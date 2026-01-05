import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/useAuth';
import { DatabaseService } from '../../../services/database';

export const useStudentDashboard = () => {
    const { user, loading: authLoading } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
    const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');
    const [selectedBatch, setSelectedBatch] = useState<string>('');

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

    // Handle roadmap selection change
    const handleRoadmapChange = (roadmapId: string) => {
        setSelectedRoadmap(roadmapId);
        setShowRoadmapDropdown(false);
        // Refresh dashboard data with new roadmap
        if (user?.id) {
            fetchDashboardData(user.id, roadmapId);
            // Also refresh tasks for the new roadmap
            refreshTasksForRoadmap(roadmapId);
        }
    };

    // Refresh tasks for the selected roadmap
    const refreshTasksForRoadmap = async (roadmapId: string) => {
        if (!user?.id) return;

        try {
            const [currentTasks, upcomingTasks] = await Promise.all([
                DatabaseService.getCurrentWeekTasks(user.id, roadmapId),
                DatabaseService.getUpcomingTasks(user.id, roadmapId)
            ]);

            // Update dashboard data with new tasks
            setDashboardData((prev: any) => ({
                ...prev,
                currentWeekTasks: currentTasks,
                upcomingTasks: upcomingTasks
            }));
        } catch (error) {
            // Silently handle error - could show user notification in production
        }
    };

    // Fetch dashboard data
    const fetchDashboardData = async (userId: string, roadmapId?: string) => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Fetching dashboard data for user ID:', userId);
            const data = await DatabaseService.getDashboardData(userId, roadmapId);
            console.log('📊 Dashboard data received:', data);

            setDashboardData(data);

            // Set initial selections if not already set
            if (!selectedRoadmap && data?.enrolledRoadmaps?.length > 0) {
                // For company users, prioritize Augmedix/AI/ML roadmaps over Python
                const isCompanyUser = user?.email?.includes('@10minuteschool.com') || user?.email?.includes('@lightcastlepartners.com');

                let preferredRoadmap = data.enrolledRoadmaps[0]; // Default to first

                if (isCompanyUser && data.enrolledRoadmaps.length > 1) {
                    // Look for Augmedix, AI, or ML roadmaps first
                    const augmedixRoadmap = data.enrolledRoadmaps.find((r: any) =>
                        r.title?.toLowerCase().includes('augmedix') ||
                        r.description?.toLowerCase().includes('augmedix')
                    );

                    const aiMlRoadmap = data.enrolledRoadmaps.find((r: any) =>
                        r.title?.toLowerCase().includes('ai') ||
                        r.title?.toLowerCase().includes('ml') ||
                        r.title?.toLowerCase().includes('machine learning')
                    );

                    // Avoid Python roadmaps for company users
                    const nonPythonRoadmap = data.enrolledRoadmaps.find((r: any) =>
                        !r.title?.toLowerCase().includes('python')
                    );

                    // Priority order: Augmedix > AI/ML > Non-Python > First available
                    preferredRoadmap = augmedixRoadmap || aiMlRoadmap || nonPythonRoadmap || data.enrolledRoadmaps[0];
                }

                setSelectedRoadmap(preferredRoadmap.id);
            }
            if (data?.batch?.id) {
                setSelectedBatch(data.batch.id);
            }

            // If roadmapId is provided, update the selected roadmap
            if (roadmapId) {
                setSelectedRoadmap(roadmapId);
            }

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
            const currentRoadmapId = roadmapId || data?.enrolledRoadmaps?.[0]?.id;
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

        fetchDashboardData(user.id);
    }, [user?.id, authLoading]);

    // Get current roadmap data
    const getCurrentRoadmap = () => {
        if (!dashboardData?.enrolledRoadmaps) return null;
        const roadmap = dashboardData.enrolledRoadmaps.find((r: any) => r.id === selectedRoadmap) || dashboardData.enrolledRoadmaps[0];
        return roadmap;
    };

    // Get current batch data
    const getCurrentBatch = () => {
        if (!dashboardData?.batch) return null;
        return dashboardData.batch;
    };

    // Get weekly streaks based on current roadmap and batch
    const getWeeklyStreaks = () => {
        // Get data from current roadmap
        const roadmap = getCurrentRoadmap();
        const batch = getCurrentBatch();

        if (!roadmap || !batch) {
            // If no roadmap data, show a default of 6 weeks
            return Array.from({ length: 6 }, (_, index) => ({
                week: index + 1,
                status: 'incomplete' as const
            }));
        }

        // Get actual student progress from the database
        const studentProgress = dashboardData?.studentProgress || [];

        // Map weeks based on actual progress data
        return Array.from({ length: roadmap.total_weeks }, (_, index) => {
            const weekNumber = index + 1;
            const weekProgress = studentProgress.find((p: any) => p.week_number === weekNumber);

            if (weekProgress?.is_completed) {
                return { week: weekNumber, status: 'done' as const };
            } else if (weekProgress?.is_active) {
                return { week: weekNumber, status: 'current' as const };
            } else {
                return { week: weekNumber, status: 'incomplete' as const };
            }
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
        selectedRoadmap,
        selectedBatch,
        user,
        getUserDisplayName,
        setShowRoadmapDropdown,
        handleRoadmapChange,
        getCurrentRoadmap,
        getCurrentBatch,
        getWeeklyStreaks,
        markNoticeAsRead
    };
};
