import React, { useEffect } from 'react';
// import { NoticeBoard } from '../NoticeBoard/NoticeBoard';
import { useTheme } from '../../lib/ThemeContext';
import { StudentHeader } from './StudentHeader';
import { LiveSessionList } from '../Dashboard/LiveSessionList';
import { useStudentDashboard } from './hooks/useStudentDashboard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { NavigationCards } from './dashboard/NavigationCards';
import { TasksSection } from './dashboard/TasksSection';
import { StreaksSection } from './dashboard/StreaksSection';
import { GamificationStatsCard } from './dashboard/GamificationStatsCard';
import { MentorsSection } from './dashboard/MentorsSection';
import { PracticeDeckList } from './PracticeDeckList';
import { Layers } from 'lucide-react';
import { Leaderboard } from '../Dashboard/Leaderboard';
import { Card } from '../ui/Card';
import { posthog } from '../../lib/posthog';
import { MotionDiv, STAGGER_CHILDREN_VARIANTS, FADE_IN_VARIANTS, HoverLift } from '../ui/MotionPrimitives';
import { Skeleton } from '../ui/Skeleton';

export const StudentDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  // const posthog = usePostHog(); // Removed to use singleton directly

  const {
    loading,
    error,
    dashboardData,
    showRoadmapDropdown,
    selectedBatchId,
    getUserDisplayName,
    setShowRoadmapDropdown,
    handleBatchChange,
    getCurrentRoadmap,
    getCurrentBatch,
    getWeeklyStreaks,
    markNoticeAsRead,
    user
  } = useStudentDashboard();

  // Track page view and DAU (from origin/main logic)
  useEffect(() => {
    if (user?.id) {
      posthog?.capture('student_dashboard_view', {
        user_id: user.id,
        batch_id: selectedBatchId,
        roadmap_id: getCurrentRoadmap()?.id
      });

      // Track DAU (Daily Active User)
      posthog?.capture('$pageview', {
        page: 'student_dashboard',
        user_id: user.id
      });
    }
  }, [user?.id, posthog, selectedBatchId, dashboardData?.roadmap]);

  // Check for week completion and track it
  useEffect(() => {
    if (dashboardData?.studentProgress && user?.id) {
      const studentProgress = dashboardData.studentProgress;
      const currentWeek = studentProgress.find((p: any) => p.is_active);

      if (currentWeek && currentWeek.is_completed) {
        posthog?.capture('week_completed', {
          user_id: user.id,
          week_number: currentWeek.week_number,
          roadmap_id: getCurrentRoadmap()?.id,
          batch_id: selectedBatchId,
          completed_at: new Date().toISOString(),
          completion_percentage: currentWeek.completion_percentage || 100
        });
      }
    }
  }, [dashboardData, user?.id, selectedBatchId]);

  // Check for overdue tasks
  useEffect(() => {
    if (dashboardData?.currentWeekTasks && user?.id) {
      const currentDate = new Date();
      const overdueTasks = dashboardData.currentWeekTasks.filter((task: any) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return deadline < currentDate && !task.completed; // Note: 'completed' property might need verifying in task object
      });

      if (overdueTasks.length > 0) {
        posthog?.capture('task_overdue', {
          user_id: user.id,
          overdue_count: overdueTasks.length,
          overdue_tasks: overdueTasks.map((task: any) => ({
            task_id: task.id,
            task_name: task.task_name,
            deadline: task.deadline,
            days_overdue: Math.ceil((currentDate.getTime() - new Date(task.deadline).getTime()) / (1000 * 60 * 60 * 24))
          })),
          roadmap_id: getCurrentRoadmap()?.id,
          batch_id: selectedBatchId,
          detected_at: new Date().toISOString()
        });
      }
    }
  }, [dashboardData, user?.id, selectedBatchId]);

  return (
    <div className="min-h-screen transition-colors duration-200 bg-background">
      <StudentHeader
        userName={getUserDisplayName()}
        userRole="student"
        pageTitle="Dashboard"
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Header Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                </div>
              </div>

              {/* Practice Skeleton */}
              <Skeleton className="h-64 rounded-xl" />

              {/* Tasks Skeleton */}
              <Skeleton className="h-48 rounded-xl" />
            </div>

            <div className="space-y-6">
              {/* Right Column Skeletons */}
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <MotionDiv
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center">
                <span className="text-destructive text-sm">!</span>
              </div>
              <div>
                <h3 className="text-destructive font-medium">Error Loading Dashboard</h3>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Dashboard Content */}
        {!loading && !error && dashboardData && (
          <MotionDiv
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={STAGGER_CHILDREN_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Section with Roadmap Selection */}
              <DashboardHeader
                displayName={getUserDisplayName()}
                isDarkMode={isDarkMode}
                enrolledBatches={dashboardData.enrolledBatches}
                currentBatch={getCurrentBatch()}
                showRoadmapDropdown={showRoadmapDropdown}
                setShowRoadmapDropdown={setShowRoadmapDropdown}
                handleBatchChange={handleBatchChange}
                selectedBatchId={selectedBatchId}
                gamificationStats={dashboardData?.gamificationStats}
              />

              {/* Navigation Cards */}
              <NavigationCards
                isDarkMode={isDarkMode}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledBatches?.map((b: any) => b.roadmap) || []}
                batch={getCurrentBatch()}
              />

              {/* Practice & Micro-learning Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                    <Layers className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Practice & Micro-learning
                  </h2>
                </div>
                <Card className={`p-6 transition-all duration-300 ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 shadow-xl'
                  : 'bg-white shadow-professional hover:shadow-professional-lg'
                  }`}>
                  <PracticeDeckList isDarkMode={isDarkMode} batchId={selectedBatchId} roadmapId={getCurrentRoadmap()?.id} />
                </Card>
              </div>

              {/* This Week's Tasks and Upcoming */}
              <TasksSection
                isDarkMode={isDarkMode}
                currentWeekTasks={dashboardData.currentWeekTasks}
                upcomingTasks={dashboardData.upcomingTasks}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledBatches?.map((b: any) => b.roadmap) || []}
                currentLevel={dashboardData.currentLevel || 1}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Days Streaks */}
              <StreaksSection
                isDarkMode={isDarkMode}
                streaks={getWeeklyStreaks()}
              />

              {/* Gamification Stats Card - New Position */}
              <GamificationStatsCard
                stats={dashboardData.gamificationStats ? {
                  totalXP: dashboardData.gamificationStats.totalXP,
                  rank: dashboardData.gamificationStats.rank,
                  batchId: dashboardData.gamificationStats.batchId || ''
                } : undefined}
                isDarkMode={isDarkMode}
              />

              {/* Leaderboard */}
              <Leaderboard batchId={selectedBatchId} isDarkMode={isDarkMode} />

              {/* NoticeBoard removed from web view as it's now in the header dropdown */}
              {/* <div className="hidden md:block">
                <NoticeBoard
                  isDarkMode={isDarkMode}
                  notices={dashboardData?.notices || []}
                  onMarkAsRead={markNoticeAsRead}
                />
              </div> */}

              {/* Live Sessions */}
              <Card className={`p-6 transition-all duration-300 ${isDarkMode
                ? 'bg-gray-800 border-gray-700 shadow-xl'
                : 'bg-white shadow-professional hover:shadow-professional-lg'
                }`}>
                <LiveSessionList
                  batchId={selectedBatchId}
                  currentLevel={dashboardData?.currentLevel}
                  isDarkMode={isDarkMode}
                />
              </Card>

              {/* Mentors */}
              <MentorsSection isDarkMode={isDarkMode} />
            </div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
};
