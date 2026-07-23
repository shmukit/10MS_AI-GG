import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../lib';
import { supabase } from '../../../lib/supabase';
import { DatabaseService } from '../../../services/database';

export const useStudentDashboard = () => {
    const { user, loading: authLoading, databaseUserId, roleLoading } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    // Auth uid is what student_batch_assignments.student_id / RLS use.
    // public.users.id can diverge — pass both when fetching enrollments.
    const authUserId = user?.id || null;
    const effectiveUserId = authUserId || databaseUserId || null;
    const alternateUserIds =
        databaseUserId && authUserId && databaseUserId !== authUserId
            ? [databaseUserId]
            : databaseUserId && !authUserId
              ? [databaseUserId]
              : [];

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

    // Handle batch selection change
    const handleBatchChange = (batchId: string) => {
        setSelectedBatchId(batchId);
        setShowRoadmapDropdown(false);
        navigate(`/student/dashboard?batch_id=${batchId}`, { replace: true });
        if (effectiveUserId) {
            fetchDashboardData(effectiveUserId, batchId);
        }
    };

    // Fetch dashboard data
    const fetchDashboardData = async (userId: string, batchId?: string) => {
        try {
            // Only set full loading state if we don't have data yet
            if (!dashboardData) {
                setLoading(true);
            }

            setError(null);
            const data = await DatabaseService.getDashboardData(userId, {
                batchId,
                alternateUserIds: [
                    databaseUserId,
                    authUserId,
                    ...alternateUserIds,
                ],
            });

            console.log(
                '📊 Dashboard enrolledBatches:',
                data?.enrolledBatches?.length,
                data?.enrolledBatches?.map((b: any) => b.name)
            );

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
        if (authLoading || roleLoading) return;

        if (!effectiveUserId) {
            setLoading(false);
            return;
        }

        // Check for batchId in URL
        const params = new URLSearchParams(location.search);
        const batchIdFromUrl = params.get('batch_id') || params.get('batchId');

        fetchDashboardData(effectiveUserId, batchIdFromUrl || undefined);
    }, [effectiveUserId, databaseUserId, authUserId, authLoading, roleLoading, location.search]);

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
        if (!effectiveUserId) return;

        try {
            await DatabaseService.markNoticeAsRead(noticeId, effectiveUserId);
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
