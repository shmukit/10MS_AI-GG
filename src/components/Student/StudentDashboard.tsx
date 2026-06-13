import React from 'react';
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
import { MotionDiv, STAGGER_CHILDREN_VARIANTS } from '../ui/MotionPrimitives';
import { Skeleton } from '../ui/Skeleton';
import { useDashboardTracking } from './hooks/useDashboardTracking';

export const StudentDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();

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
    user
  } = useStudentDashboard();

  // Abstract tracking logic to custom hook
  useDashboardTracking({
    user,
    selectedBatchId,
    currentRoadmapId: getCurrentRoadmap()?.id,
    studentProgress: dashboardData?.studentProgress,
    currentWeekTasks: dashboardData?.currentWeekTasks
  });

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
                  <div className="p-2 rounded-lg bg-muted">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    Practice & Micro-learning
                  </h2>
                </div>
                <Card className="p-6">
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
              <Card className="p-6">
                <LiveSessionList
                  batchId={selectedBatchId}
                  currentLevel={dashboardData?.currentLevel}
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
