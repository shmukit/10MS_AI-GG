import React, { useEffect } from 'react';
import { NoticeBoard } from '../NoticeBoard/NoticeBoard';
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
    selectedRoadmap,
    selectedBatch,
    getUserDisplayName,
    setShowRoadmapDropdown,
    handleRoadmapChange,
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
        batch_id: selectedBatch,
        roadmap_id: selectedRoadmap
      });

      // Track DAU (Daily Active User)
      posthog?.capture('$pageview', {
        page: 'student_dashboard',
        user_id: user.id
      });
    }
  }, [user?.id, posthog, selectedBatch, selectedRoadmap]);

  // Check for week completion and track it
  useEffect(() => {
    if (dashboardData?.studentProgress && user?.id) {
      const studentProgress = dashboardData.studentProgress;
      const currentWeek = studentProgress.find((p: any) => p.is_active);

      if (currentWeek && currentWeek.is_completed) {
        posthog?.capture('week_completed', {
          user_id: user.id,
          week_number: currentWeek.week_number,
          roadmap_id: selectedRoadmap,
          batch_id: selectedBatch,
          completed_at: new Date().toISOString(),
          completion_percentage: currentWeek.completion_percentage || 100
        });
      }
    }
  }, [dashboardData, user?.id, selectedRoadmap, selectedBatch]);

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
          roadmap_id: selectedRoadmap,
          batch_id: selectedBatch,
          detected_at: new Date().toISOString()
        });
      }
    }
  }, [dashboardData, user?.id, selectedRoadmap, selectedBatch]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader
        userName={getUserDisplayName()}
        userRole="student"
        pageTitle="Dashboard"
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
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
            className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
                <p className="text-red-600 text-sm">{error}</p>
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
                enrolledRoadmaps={dashboardData.enrolledRoadmaps}
                currentRoadmap={getCurrentRoadmap()}
                showRoadmapDropdown={showRoadmapDropdown}
                setShowRoadmapDropdown={setShowRoadmapDropdown}
                handleRoadmapChange={handleRoadmapChange}
                selectedRoadmapId={selectedRoadmap}
                gamificationStats={dashboardData?.gamificationStats}
              />

              {/* Navigation Cards */}
              <NavigationCards
                isDarkMode={isDarkMode}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledRoadmaps}
                batch={getCurrentBatch()}
              />

              {/* Practice & Micro-learning Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Practice & Micro-learning
                  </h2>
                </div>
                <div className={`rounded-xl p-6 border shadow-professional transition-all duration-200 hover:shadow-professional-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                  <PracticeDeckList isDarkMode={isDarkMode} batchId={selectedBatch} roadmapId={selectedRoadmap} />
                </div>
              </div>

              {/* This Week's Tasks and Upcoming */}
              <TasksSection
                isDarkMode={isDarkMode}
                currentWeekTasks={dashboardData.currentWeekTasks}
                upcomingTasks={dashboardData.upcomingTasks}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledRoadmaps}
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
              <Leaderboard batchId={selectedBatch} isDarkMode={isDarkMode} />

              {/* Notice Board */}
              <NoticeBoard
                isDarkMode={isDarkMode}
                notices={dashboardData?.notices || []}
                onMarkAsRead={markNoticeAsRead}
              />

              {/* Live Sessions */}
              <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                <LiveSessionList
                  batchId={selectedBatch}
                  currentLevel={dashboardData?.currentLevel}
                />
              </div>

              {/* Mentors */}
              <MentorsSection isDarkMode={isDarkMode} />
            </div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
};
