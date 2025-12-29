import React from 'react';
import { NoticeBoard } from '../NoticeBoard/NoticeBoard';
import { useTheme } from '../../lib/ThemeContext';
import { StudentHeader } from './StudentHeader';
import { LiveSessionList } from '../Dashboard/LiveSessionList';
import { useStudentDashboard } from './hooks/useStudentDashboard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { NavigationCards } from './dashboard/NavigationCards';
import { TasksSection } from './dashboard/TasksSection';
import { StreaksSection } from './dashboard/StreaksSection';
import { MentorsSection } from './dashboard/MentorsSection';

export const StudentDashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
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
    markNoticeAsRead
  } = useStudentDashboard();

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
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`text-lg transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
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
              />

              {/* Navigation Cards */}
              <NavigationCards
                isDarkMode={isDarkMode}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledRoadmaps}
                batch={getCurrentBatch()}
              />

              {/* This Week's Tasks and Upcoming */}
              <TasksSection
                isDarkMode={isDarkMode}
                currentWeekTasks={dashboardData.currentWeekTasks}
                upcomingTasks={dashboardData.upcomingTasks}
                currentRoadmap={getCurrentRoadmap()}
                enrolledRoadmaps={dashboardData.enrolledRoadmaps}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Days Streaks */}
              <StreaksSection
                isDarkMode={isDarkMode}
                streaks={getWeeklyStreaks()}
              />

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
                />
              </div>

              {/* Mentors */}
              <MentorsSection isDarkMode={isDarkMode} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
