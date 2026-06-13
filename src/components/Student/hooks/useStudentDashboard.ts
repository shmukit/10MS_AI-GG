import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabase';
import { DatabaseService } from '../../../services/database';

export const useStudentDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();

    // State
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');

    // Helper function to get user display name with fallbacks
    const getUserDisplayName = () => {
        return dashboardData?.userData?.first_name ||
            dashboardData?.profile?.first_name ||
            user?.user_metadata?.first_name ||
            user?.user_metadata?.full_name ||
            user?.email?.split('@')[0] ||
            'Student';
    };

    // Close roadmap dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showRoadmapDropdown) {
                const target = event.target as Element;
                if (!target.closest('.roadmap-dropdown-container')) {
                    setShowRoadmapDropdown(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRoadmapDropdown]);

    // Handle batch selection change
    const handleBatchChange = (batchId: string) => {
        setSelectedBatchId(batchId);
        setShowRoadmapDropdown(false);
        // Refresh dashboard data with new batch
        if (user?.id) {
            fetchDashboardData(user.id, batchId);
        }
    };

    // Refresh tasks for the selected roadmap
    // (This is now handled inside fetchDashboardData or via derived state mostly,
    // but if we need explicit refresh, we can get roadmapId from dashboardData)
    const refreshTasksForRoadmap = async (roadmapId: string) => {
        if (!user?.id) return;
        try {
            const [currentTasks, upcomingTasks] = await Promise.all([
                DatabaseService.getCurrentWeekTasks(user.id, roadmapId),
                DatabaseService.getUpcomingTasks(user.id, roadmapId)
            ]);
            setDashboardData((prev: any) => ({
                ...prev,
                currentWeekTasks: currentTasks,
                upcomingTasks: upcomingTasks
            }));
        } catch (error) { }
    };

    // Fetch dashboard data
    const fetchDashboardData = async (userId: string, batchId?: string) => {
        try {
            // Only set full loading state if we don't have data yet
            if (!dashboardData) {
                setLoading(true);
            } else {
                // Otherwise indicate we are switching/refreshing but keep UI mounted
                // We can expose this state if we want to show a spinner
            }

            setError(null);
            // console.log('🔍 Fetching dashboard data for user ID:', userId, 'batch:', batchId);
            const data = await DatabaseService.getDashboardData(userId, { batchId });
            // console.log('📊 Dashboard data received:', data);

            setDashboardData(data);

            // Sync Auth Metadata with DB Profile to prevent name flickering
            // The flicker happens because initial render uses Auth metadata (stale) 
            // and then switches to DB data (fresh). By syncing them, they will be the same.
            if (data?.userData?.first_name) {
                const dbName = data.userData.first_name;
                const authName = user?.user_metadata?.first_name || user?.user_metadata?.full_name;

                if (dbName && dbName !== authName) {
                    console.log(`🔄 Syncing Auth metadata: ${authName} -> ${dbName}`);
                    // We don't await this to avoid blocking the UI
                    supabase.auth.updateUser({
                        data: {
                            first_name: dbName,
                            full_name: dbName + (data?.userData?.last_name ? ` ${data.userData.last_name}` : '')
                        }
                    }).then(({ error }) => {
                        if (error) console.error('Error syncing auth metadata:', error);
                        else console.log('✅ Auth metadata synced');
                    });
                }
            }

            // Set initial selections if not already set
            if (!selectedBatchId && data?.batch?.id) {
                setSelectedBatchId(data.batch.id);
            }

            // If batchId is provided, update the selected batch
            // This is critical for the dropdown to reflect the change immediately
            if (batchId) {
                setSelectedBatchId(batchId);
            }

            // (Roadmap logic removed in favor of batch logic)

            // Fetch Gamification Stats
            if (data?.batch?.id) {
                try {
                    // Import dynamically or assume imported. Dynamic import to avoid cycles if any.
                    const { getStudentStats } = await import('../../../services/db/gamificationService');
                    const stats = await getStudentStats(userId, data.batch.id);
                    if (stats) {
                        setDashboardData((prev: any) => ({ ...prev, gamificationStats: stats }));
                    }
                } catch (e) {
                    console.error('Error fetching gamification stats:', e);
                }
            }

            // Fetch TaRL Level
            const currentRoadmapId = data?.roadmap?.id;
            if (currentRoadmapId) {
                try {
                    const { getCurrentLevel } = await import('../../../services/db/tarlService');
                    const level = await getCurrentLevel(userId, currentRoadmapId);
                    setDashboardData((prev: any) => ({ ...prev, currentLevel: level }));
                } catch (e) {
                    console.error('Error fetching TaRL level:', e);
                }
            }
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user?.id) {
            setLoading(false);
            return;
        }

        // Check for batchId in URL
        const params = new URLSearchParams(location.search);
        const batchIdFromUrl = params.get('batchId');

        fetchDashboardData(user.id, batchIdFromUrl || undefined);
    }, [user?.id, authLoading, location.search]);

    // Get current roadmap data (derived from batch)
    const getCurrentRoadmap = () => {
        return dashboardData?.roadmap;
    };

    // Get current batch data
    const getCurrentBatch = () => {
        if (!dashboardData?.batch) return null;
        return dashboardData.batch;
    };

    // Weekly streaks from profile progress (completed_weeks)
    const getWeeklyStreaks = () => {
        const roadmap = getCurrentRoadmap();
        const totalWeeks = roadmap?.total_weeks ?? 6;
        const completedWeeks = dashboardData?.profile?.completed_weeks ?? 0;

        return Array.from({ length: totalWeeks }, (_, index) => {
            const weekNumber = index + 1;

            if (weekNumber <= completedWeeks) {
                return { week: weekNumber, status: 'done' as const };
            }
            if (weekNumber === completedWeeks + 1 && completedWeeks < totalWeeks) {
                return { week: weekNumber, status: 'current' as const };
            }
            return { week: weekNumber, status: 'incomplete' as const };
        });
    };

    const markNoticeAsRead = async (noticeId: string) => {
        if (!user?.id) return;

        try {
            await DatabaseService.markNoticeAsRead(noticeId, user.id);
            // Optimistic update or refetch could happen here
        } catch (error) {
            console.error('Error marking notice as read:', error);
        }
    };

    return {
        loading,
        error,
        dashboardData,
        showRoadmapDropdown,
        selectedBatchId,
        user,
        getUserDisplayName,
        setShowRoadmapDropdown,
        handleBatchChange,
        getCurrentRoadmap,
        getCurrentBatch,
        getWeeklyStreaks,
        markNoticeAsRead
    };
};
