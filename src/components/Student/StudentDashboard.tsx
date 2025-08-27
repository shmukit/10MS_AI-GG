import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Map, Users, Bell, ChevronDown } from 'lucide-react';
import { NoticeBoard } from '../NoticeBoard/NoticeBoard';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { ProfileDropdown } from '../Profile/ProfileDropdown';
import { DatabaseService } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { useTheme } from '../../lib/ThemeContext';
import { StudentHeader } from './StudentHeader';
import { generateBatchSlug, generateRoadmapSlug } from '../../services/database';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [showTaskConfirmation, setShowTaskConfirmation] = useState(false);

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

  const handleMarkAsDone = () => {
    setShowTaskConfirmation(true);
  };

  const handleConfirmTask = () => {
    console.log('Task marked as completed');
    setShowTaskConfirmation(false);
    // Here you would typically call an API to mark the task as done
    // For now, just showing a success message
    alert('Task marked as completed successfully!');
  };

  // Handle roadmap selection change
  const handleRoadmapChange = (roadmapId: string) => {
    console.log('🔄 Roadmap selection changed to:', roadmapId);
    console.log('🔄 Roadmap title:', dashboardData?.enrolledRoadmaps?.find((r: any) => r.id === roadmapId)?.title);
    setSelectedRoadmap(roadmapId);
    setShowRoadmapDropdown(false);
    // Refresh dashboard data with new roadmap
    if (user?.id) {
      console.log('🔄 Fetching dashboard data for roadmap:', roadmapId);
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
      console.error('Error refreshing tasks:', error);
    }
  };

  // Handle batch selection change
  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
    // Refresh dashboard data with new batch
    if (user?.id) {
      fetchDashboardData(user.id, selectedRoadmap, batchId);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async (userId: string, roadmapId?: string, batchId?: string) => {
    try {
      console.log('🔄 fetchDashboardData called with roadmapId:', roadmapId);
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getDashboardData(userId, roadmapId);
      console.log('📊 Dashboard data received:', data);
      setDashboardData(data);
      
      // Set initial selections if not already set
      if (!selectedRoadmap && data?.enrolledRoadmaps?.length > 0) {
        setSelectedRoadmap(data.enrolledRoadmaps[0].id);
      }
      if (!selectedBatch && data?.batch?.id) {
        setSelectedBatch(data.batch.id);
      }

      // If roadmapId is provided, update the selected roadmap
      if (roadmapId) {
        setSelectedRoadmap(roadmapId);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchDashboardData(user.id);
  }, [user?.id]);

  // Get current roadmap data
  const getCurrentRoadmap = () => {
    if (!dashboardData?.enrolledRoadmaps) return null;
    const roadmap = dashboardData.enrolledRoadmaps.find((r: any) => r.id === selectedRoadmap) || dashboardData.enrolledRoadmaps[0];
    console.log('🎯 getCurrentRoadmap called, selectedRoadmap:', selectedRoadmap, 'returning:', roadmap?.title);
    return roadmap;
  };

  // Get current roadmap ID
  const getCurrentRoadmapId = () => {
    const roadmap = getCurrentRoadmap();
    return roadmap?.id;
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

    // Use the actual roadmap weeks from the database
    return Array.from({ length: roadmap.total_weeks }, (_, index) => ({
      week: index + 1,
      status: index < 3 ? 'done' : index === 3 ? 'current' : 'incomplete'
    }));
  };

  // Force re-render when selectedRoadmap changes
  useEffect(() => {
    if (selectedRoadmap) {
      // This will trigger a re-render of components that depend on selectedRoadmap
      console.log('Selected roadmap changed to:', selectedRoadmap);
    }
  }, [selectedRoadmap]);

  const debugRoadmaps = () => {
    console.log('🔄 Debugging Roadmaps:');
    console.log('Current Roadmap:', getCurrentRoadmap()?.title);
    console.log('Generated Slug:', generateRoadmapSlug(getCurrentRoadmap()?.title || ''));
    console.log('Available Roadmaps:', dashboardData?.enrolledRoadmaps || []);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader 
        userName={dashboardData?.userData?.first_name || dashboardData?.profile?.first_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section with Roadmap Selection */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Good afternoon, {dashboardData?.userData?.first_name || dashboardData?.profile?.first_name || 'Student'}</h2>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-Enabled Group Guidance Program</p>
              </div>
              
              {/* Roadmap Selection Dropdown */}
              {dashboardData?.enrolledRoadmaps && dashboardData.enrolledRoadmaps.length > 1 && (
                <div className="relative roadmap-dropdown-container">
                  <button
                    onClick={() => setShowRoadmapDropdown(!showRoadmapDropdown)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {getCurrentRoadmap()?.title || 'Select Roadmap'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRoadmapDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Roadmap Dropdown */}
                  {showRoadmapDropdown && (
                    <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg z-10 border min-w-48 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="py-2">
                        {dashboardData.enrolledRoadmaps.map((roadmap: any) => (
                          <button
                            key={roadmap.id}
                            onClick={() => handleRoadmapChange(roadmap.id)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                              isDarkMode 
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                            } ${selectedRoadmap === roadmap.id ? 'bg-blue-50 text-blue-700' : ''}`}
                          >
                            {roadmap.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              

            </div>

            {/* Navigation Cards */}
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => {
                  if (getCurrentRoadmap()) {
                    const roadmapSlug = generateRoadmapSlug(getCurrentRoadmap()?.title || '');
                    console.log('🔍 Navigating to roadmap with slug:', roadmapSlug);
                    navigate(`/student/roadmap/${roadmapSlug}`);
                  } else {
                    navigate('/student/roadmap');
                  }
                }}
                className="border rounded-xl p-4 text-center transition-colors group cursor-pointer hover:bg-green-100"
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-blue-600 group-hover:bg-blue-700">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Roadmap</span>
              </div>

              <button
                onClick={() => {
                  // Navigate to community with roadmap context
                  if (getCurrentRoadmap()) {
                    const roadmapSlug = generateRoadmapSlug(getCurrentRoadmap()?.title || '');
                    console.log('🔍 Navigating to community with slug:', roadmapSlug);
                    navigate(`/student/community/${roadmapSlug}`);
                  } else if (dashboardData?.batch) {
                    const batchSlug = generateBatchSlug(dashboardData.batch.name);
                    navigate(`/student/community/${batchSlug}`);
                  } else {
                    navigate('/student/community');
                  }
                }}
                className={`border rounded-xl p-4 text-center transition-colors group ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30' 
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-purple-500 group-hover:bg-purple-600' 
                    : 'bg-purple-500 group-hover:bg-purple-600'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</span>
              </button>
            </div>

            {/* Debug Section */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Current Roadmap: {getCurrentRoadmap()?.title || 'None'}</div>
                <div>Generated Slug: {getCurrentRoadmap() ? generateRoadmapSlug(getCurrentRoadmap()?.title || '') : 'None'}</div>
                <div>Available Roadmaps: {dashboardData?.enrolledRoadmaps?.length || 0}</div>
                <button 
                  onClick={debugRoadmaps}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Debug Roadmaps
                </button>
              </div>
            </div>

            {/* This Week's Tasks and Upcoming - Stacked Vertically */}
            <div className="space-y-6">
              {/* This Week's Tasks */}
              <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This Week's Tasks</h3>
                
                                 {dashboardData?.currentWeekTasks && dashboardData.currentWeekTasks.length > 0 ? (
                   <div className="space-y-4">
                     {dashboardData.currentWeekTasks.map((task: any, index: number) => (
                      <div key={task.id} className={`rounded-lg p-4 transition-colors duration-200 ${
                        isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {task.task_name}
                          </h4>
                          <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Due'}
                          </span>
                        </div>
                        {task.task_details && (
                          <p className={`text-sm mb-3 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.task_details}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                            isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.task_type}
                          </span>
                          {task.estimated_hours && (
                            <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                              isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {task.estimated_hours}h
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={handleMarkAsDone}
                          className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                            isDarkMode 
                              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          ✓ Mark as Done
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`text-gray-400 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      📝
                    </div>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No tasks assigned for this week
                    </p>
                  </div>
                )}
              </div>

              {/* Upcoming Tasks */}
              <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
                  <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next week</span>
                </div>
                
                {dashboardData?.upcomingTasks && dashboardData.upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.upcomingTasks.slice(0, 3).map((task: any) => (
                      <div key={task.id} className={`rounded-lg p-4 border transition-colors duration-200 ${
                        isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📝</span>
                            <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {task.task_name}
                            </h4>
                          </div>
                          <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Week {(task as any).week_number || 'N/A'}
                          </span>
                        </div>
                        {task.task_details && (
                          <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.task_details}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                            isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {task.task_type}
                          </span>
                          {task.deadline && (
                            <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                              isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                            }`}>
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`text-gray-400 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      📅
                    </div>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No upcoming tasks scheduled
                    </p>
                  </div>
                )}
              </div>
            </div>


          </div>

                      {/* Right Column */}
            <div className="space-y-6">
              {/* Days Streaks */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Week Streaks</h3>
                <div className={`flex items-center gap-4 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-300"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Incomplete</span>
                  </div>
                </div>
              </div>
              

              
                              <div className="flex justify-between items-center">
                  {getWeeklyStreaks().map((streak: any, index: number) => (
                    <div key={streak.week} className="text-center">
                      <div className={`text-xs mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Week {streak.week}
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          streak.status === 'done' ? 'bg-green-500' :
                          streak.status === 'current' ? 'bg-blue-500 border-2 border-blue-300' :
                          'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* Notice Board */}
            <NoticeBoard 
              isDarkMode={isDarkMode} 
              notices={dashboardData?.notices || []}
              onMarkAsRead={async (noticeId) => {
                if (!user?.id) return;
                
                try {
                  const success = await DatabaseService.markNoticeAsRead(noticeId, user.id);
                  if (success) {
                    // Refresh dashboard data to update notice status
                    // For now, just log success - in a real app you'd refresh the data
                    console.log('Notice marked as read successfully');
                  }
                } catch (error) {
                  console.error('Error marking notice as read:', error);
                }
              }}
            />

            {/* Next Zoom Call */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Next Zoom Call</h3>
                  <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mentor: Uttam Deb</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thu, 3:30 PM</div>
                <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>September 12, 2025</div>
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                📹 Join Zoom
              </button>
            </div>

            {/* Mentors */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mentors</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Uttam Deb</div>
                      <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Senior BI Executive, 10 Minute School</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                    }`}>Python</span>
                    <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                    }`}>SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Confirmation Modal for Task */}
        <ConfirmationModal
          isOpen={showTaskConfirmation}
          onClose={() => setShowTaskConfirmation(false)}
          onConfirm={handleConfirmTask}
          title="Confirm Task Completion"
          message="Are you sure you have completed this task? Please double-check before confirming as this will mark the task as done and update your progress."
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
