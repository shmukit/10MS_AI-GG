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
import { usePostHog } from 'posthog-js/react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, databaseUserId } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const posthog = usePostHog();

  // Helper function to get user display name with fallbacks
  const getUserDisplayName = () => {
    return dashboardData?.userData?.first_name || 
           dashboardData?.profile?.first_name || 
           user?.user_metadata?.first_name ||
           user?.user_metadata?.full_name || 
           user?.email?.split('@')[0] || 
           'Student';
  };
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
    setShowTaskConfirmation(false);
    // Here you would typically call an API to mark the task as done
    // For now, just showing a success message
    alert('Task marked as completed successfully!');
  };

  // Handle roadmap selection change
  const handleRoadmapChange = (roadmapId: string) => {
    setSelectedRoadmap(roadmapId);
    setShowRoadmapDropdown(false);
    // Refresh dashboard data with new roadmap
    if (user?.id) {
      fetchDashboardData(databaseUserId, roadmapId);
      // Also refresh tasks for the new roadmap
      refreshTasksForRoadmap(roadmapId);
    }
  };

  // Refresh tasks for the selected roadmap
  const refreshTasksForRoadmap = async (roadmapId: string) => {
    if (!user?.id) return;
    
    try {
      const [currentTasks, upcomingTasks] = await Promise.all([
        DatabaseService.getCurrentWeekTasks(databaseUserId, roadmapId),
        DatabaseService.getUpcomingTasks(databaseUserId, roadmapId)
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

  // Handle batch selection change
  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
    // Refresh dashboard data with new batch
    if (user?.id) {
      fetchDashboardData(databaseUserId, selectedRoadmap, batchId);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async (userId: string, roadmapId?: string, batchId?: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching dashboard data for user ID:', userId);
      const data = await DatabaseService.getDashboardData(userId, roadmapId);
      console.log('📊 Dashboard data received:', data);
      console.log('👤 User data in response:', data?.userData);
      console.log('📝 Profile data in response:', data?.profile);
      setDashboardData(data);
      
      // Set initial selections if not already set
      if (!selectedRoadmap && data?.enrolledRoadmaps?.length > 0) {
        // Use the roadmap that's currently active (from the batch)
        const currentRoadmap = data.roadmap || data.enrolledRoadmaps[0];
        setSelectedRoadmap(currentRoadmap.id);
        console.log('🎯 Initial roadmap selected (from current batch):', currentRoadmap.title, currentRoadmap.id);
      }
      if (!selectedBatch && data?.batch?.id) {
        setSelectedBatch(data.batch.id);
      }

      // If roadmapId is provided, update the selected roadmap
      if (roadmapId) {
        setSelectedRoadmap(roadmapId);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Auth user object:', user);
    console.log('🆔 User ID:', user?.id);
    console.log('📧 User email:', user?.email);
    console.log('📋 User metadata:', user?.user_metadata);
    if (!user?.id) return;
    fetchDashboardData(databaseUserId);
  }, [user?.id]);

  // Track page view and DAU
  useEffect(() => {
    if (user?.id && databaseUserId) {
      posthog?.capture('student_dashboard_view', {
        user_id: databaseUserId,
        batch_id: selectedBatch,
        roadmap_id: selectedRoadmap
      });
      
      // Track DAU (Daily Active User)
      posthog?.capture('$pageview', {
        page: 'student_dashboard',
        user_id: databaseUserId
      });
    }
  }, [user?.id, databaseUserId, posthog, selectedBatch, selectedRoadmap]);

  // Get current roadmap data
  const getCurrentRoadmap = () => {
    if (!dashboardData?.enrolledRoadmaps) return null;
    const roadmap = dashboardData.enrolledRoadmaps.find((r: any) => r.id === selectedRoadmap) || dashboardData.enrolledRoadmaps[0];
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
    // Use the weekStreaks data from dashboardData which now includes date-based calculation
    if (dashboardData?.weekStreaks && dashboardData.weekStreaks.length > 0) {
      return dashboardData.weekStreaks.map((streak: any) => ({
        week: streak.week,
        status: streak.status
      }));
    }

    // Fallback: Get data from current roadmap
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

  // Handle weekly streak click
  const handleWeeklyStreakClick = (weekNumber: number, status: string) => {
    posthog?.capture('weekly_streak_clicked', {
      user_id: databaseUserId,
      week_number: weekNumber,
      streak_status: status,
      roadmap_id: selectedRoadmap,
      batch_id: selectedBatch,
      clicked_at: new Date().toISOString()
    });
  };

  // Handle current week task click
  const handleCurrentWeekTaskClick = (task: any) => {
    posthog?.capture('current_week_task_clicked', {
      user_id: databaseUserId,
      task_id: task.id,
      task_name: task.task_name,
      task_type: task.task_type,
      week_number: task.week_number,
      roadmap_id: selectedRoadmap,
      batch_id: selectedBatch,
      clicked_at: new Date().toISOString()
    });
  };

  // Handle upcoming task click
  const handleUpcomingTaskClick = (task: any) => {
    posthog?.capture('upcoming_task_clicked', {
      user_id: databaseUserId,
      task_id: task.id,
      task_name: task.task_name,
      task_type: task.task_type,
      week_number: task.week_number,
      roadmap_id: selectedRoadmap,
      batch_id: selectedBatch,
      clicked_at: new Date().toISOString()
    });
  };

  // Handle notice click
  const handleNoticeClick = (notice: any) => {
    posthog?.capture('notice_clicked', {
      user_id: databaseUserId,
      notice_id: notice.id,
      notice_title: notice.title,
      notice_tag: notice.tag,
      roadmap_id: selectedRoadmap,
      batch_id: selectedBatch,
      clicked_at: new Date().toISOString()
    });
  };

  // Check for week completion and track it
  const checkWeekCompletion = () => {
    if (!dashboardData?.studentProgress) return;
    
    const studentProgress = dashboardData.studentProgress;
    const currentWeek = studentProgress.find((p: any) => p.is_active);
    
    if (currentWeek && currentWeek.is_completed) {
      posthog?.capture('week_completed', {
        user_id: databaseUserId,
        week_number: currentWeek.week_number,
        roadmap_id: selectedRoadmap,
        batch_id: selectedBatch,
        completed_at: new Date().toISOString(),
        completion_percentage: currentWeek.completion_percentage || 100
      });
    }
  };

  // Check for overdue tasks
  const checkOverdueTasks = () => {
    if (!dashboardData?.currentWeekTasks) return;
    
    const currentDate = new Date();
    const overdueTasks = dashboardData.currentWeekTasks.filter((task: any) => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);
      return deadline < currentDate && !task.completed;
    });

    if (overdueTasks.length > 0) {
      posthog?.capture('task_overdue', {
        user_id: databaseUserId,
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
  };

  // Run completion and overdue checks when dashboard data changes
  useEffect(() => {
    if (dashboardData) {
      checkWeekCompletion();
      checkOverdueTasks();
    }
  }, [dashboardData]);

  // Force re-render when selectedRoadmap changes
  useEffect(() => {
    if (selectedRoadmap) {
      // This will trigger a re-render of components that depend on selectedRoadmap
    }
  }, [selectedRoadmap]);

  // Note: Dashboard data is fetched once on component mount
  // Real-time updates should come from WebSocket or server-sent events in production

  // Get next attend task for zoom call
  const getNextAttendTask = () => {
    if (!dashboardData?.currentWeekTasks && !dashboardData?.upcomingTasks) return null;
    
    const allTasks = [
      ...(dashboardData.currentWeekTasks || []),
      ...(dashboardData.upcomingTasks || [])
    ];
    
    const attendTasks = allTasks.filter(task => 
      task.task_type?.toLowerCase() === 'attend'
    );
    
    if (attendTasks.length === 0) return null;
    
    // Sort by deadline and return the earliest one
    return attendTasks.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
      const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    })[0];
  };

  const debugRoadmaps = () => {
    // Debug function removed for production
  };

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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Hello, {getUserDisplayName()}
                </h2>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-Enabled Group Guidance Program</p>
              </div>
              
              {/* Roadmap Selection Dropdown */}
              {dashboardData?.enrolledRoadmaps && dashboardData.enrolledRoadmaps.length > 1 && (
                <div className="relative roadmap-dropdown-container">
                  <button
                    onClick={() => setShowRoadmapDropdown(!showRoadmapDropdown)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
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
                            className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 ${
                              isDarkMode 
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white hover:bg-opacity-80' 
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-opacity-80'
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
                    navigate(`/student/roadmap/${roadmapSlug}`);
                  } else if (dashboardData?.enrolledRoadmaps?.length > 0) {
                    // Fallback: use first available roadmap
                    const firstRoadmap = dashboardData.enrolledRoadmaps[0];
                    const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                    navigate(`/student/roadmap/${roadmapSlug}`);
                  } else {
                    // No roadmaps available, stay on dashboard
                    console.warn('No roadmaps available for navigation');
                    alert('No roadmaps available. Please contact your administrator.');
                  }
                }}
                className={`border rounded-xl p-4 text-center transition-all duration-200 group cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${
                  isDarkMode 
                    ? 'bg-orange-900/20 border-orange-800 hover:bg-orange-900/30 hover:border-orange-700' 
                    : 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700'
                }`}>
                  <Map className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Roadmap</span>
              </div>

              <button
                onClick={() => {
                  // Navigate to community with roadmap context
                  if (getCurrentRoadmap()) {
                    const roadmapSlug = generateRoadmapSlug(getCurrentRoadmap()?.title || '');
                    navigate(`/student/community/${roadmapSlug}`);
                  } else if (dashboardData?.enrolledRoadmaps?.length > 0) {
                    // Fallback: use first available roadmap
                    const firstRoadmap = dashboardData.enrolledRoadmaps[0];
                    const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                    navigate(`/student/community/${roadmapSlug}`);
                  } else if (dashboardData?.batch) {
                    const batchSlug = generateBatchSlug(dashboardData.batch.name);
                    navigate(`/student/community/${batchSlug}`);
                  } else {
                    // No roadmaps or batches available, stay on dashboard
                    console.warn('No roadmaps or batches available for navigation');
                    alert('No roadmaps available. Please contact your administrator.');
                  }
                }}
                className={`border rounded-xl p-4 text-center transition-all duration-200 group hover:shadow-lg transform hover:scale-[1.02] ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-800 hover:bg-blue-900/30 hover:border-blue-700' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-500 group-hover:to-blue-600' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700'
                }`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</span>
              </button>
            </div>



            {/* This Week's Tasks and Upcoming - Stacked Vertically */}
            <div className="space-y-6">
              {/* This Week's Tasks */}
              <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This Week's Tasks</h3>
                
                                                 {dashboardData?.currentWeekTasks && dashboardData.currentWeekTasks.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.currentWeekTasks.map((task: any, index: number) => (
                     <div 
                       key={task.id} 
                       onClick={() => {
                         handleCurrentWeekTaskClick(task);
                         if (getCurrentRoadmap()) {
                           const roadmapSlug = generateRoadmapSlug(getCurrentRoadmap()?.title || '');
                           navigate(`/student/roadmap/${roadmapSlug}?week=${task.week_number || 1}`);
                         } else if (dashboardData?.enrolledRoadmaps?.length > 0) {
                           // Fallback: use first available roadmap
                           const firstRoadmap = dashboardData.enrolledRoadmaps[0];
                           const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                           navigate(`/student/roadmap/${roadmapSlug}?week=${task.week_number || 1}`);
                         } else {
                           // No roadmaps available, stay on dashboard
                           console.warn('No roadmaps available for navigation');
                           alert('No roadmaps available. Please contact your administrator.');
                         }
                       }}
                       className={`rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${
                         isDarkMode ? 'bg-gray-700/50 border border-gray-600 hover:bg-gray-700/70 hover:border-gray-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                       }`}>
                       <div className="flex justify-between items-start mb-3">
                         <h4 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                           {task.task_name}
                         </h4>
                         <span className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                           isDarkMode ? 'bg-orange-900/30 text-orange-300 border border-orange-700' : 'bg-orange-100 text-orange-700 border border-orange-200'
                         }`}>
                           {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Due'}
                         </span>
                       </div>
                       {task.task_details && (
                         <p className={`text-sm mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                           {task.task_details}
                         </p>
                       )}
                       <div className="flex items-center gap-3">
                         <span className={`text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 ${
                           isDarkMode ? 'bg-blue-900/30 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-700 border border-blue-200'
                         }`}>
                           {task.task_type}
                         </span>
                         {task.estimated_hours && (
                           <span className={`text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 ${
                             isDarkMode ? 'bg-purple-900/30 text-purple-300 border border-purple-700' : 'bg-purple-100 text-purple-700 border border-purple-200'
                           }`}>
                             ⏱️ {task.estimated_hours}h
                           </span>
                         )}
                       </div>
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
              <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
                  <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next week</span>
                </div>
                
                {dashboardData?.upcomingTasks && dashboardData.upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.upcomingTasks.slice(0, 3).map((task: any) => (
                      <div 
                        key={task.id} 
                        onClick={() => {
                          handleUpcomingTaskClick(task);
                          if (getCurrentRoadmap()) {
                            const roadmapSlug = generateRoadmapSlug(getCurrentRoadmap()?.title || '');
                            navigate(`/student/roadmap/${roadmapSlug}?week=${(task as any).week_number || 2}`);
                          } else if (dashboardData?.enrolledRoadmaps?.length > 0) {
                            // Fallback: use first available roadmap
                            const firstRoadmap = dashboardData.enrolledRoadmaps[0];
                            const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
                            navigate(`/student/roadmap/${roadmapSlug}?week=${(task as any).week_number || 2}`);
                          } else {
                            // No roadmaps available, stay on dashboard
                            console.warn('No roadmaps available for navigation');
                            alert('No roadmaps available. Please contact your administrator.');
                          }
                        }}
                        className={`rounded-lg p-4 border transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${
                          isDarkMode ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30 hover:border-green-700' : 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
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
            <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Week Streaks</h3>
                <div className={`flex items-center gap-4 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">Done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-blue-300 shadow-sm"></div>
                    <span className="text-xs font-medium">Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium">Incomplete</span>
                  </div>
                </div>
              </div>
              

              
                              <div className="flex justify-between items-center">
                  {getWeeklyStreaks().map((streak: any, index: number) => (
                    <div key={streak.week} className="text-center">
                      <div className={`text-xs mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Week {streak.week}
                      </div>
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-all duration-200 ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleWeeklyStreakClick(streak.week, streak.status)}
                        title={`Click to view Week ${streak.week} details`}
                      >
                                              <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        streak.status === 'done' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm' :
                        streak.status === 'current' ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-300 shadow-sm' :
                        'bg-gradient-to-r from-red-500 to-red-600 shadow-sm'
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
                  const success = await DatabaseService.markNoticeAsRead(noticeId, databaseUserId);
                  if (success) {
                    // Refresh dashboard data to update notice status
                    // For now, just silently succeed - in a real app you'd refresh the data
                  }
                } catch (error) {
                  // Silently handle error - could show user notification in production
                }
              }}
              onNoticeClick={handleNoticeClick}
            />

            {/* Next Zoom Call */}
            {getNextAttendTask() ? (
              <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Next Zoom Call</h3>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getNextAttendTask()?.task_name || 'Zoom Meeting'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getNextAttendTask()?.deadline ? 
                      new Date(getNextAttendTask()?.deadline).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'TBD'
                    }
                  </div>
                  <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getNextAttendTask()?.meeting_time ? 
                      (() => {
                        // Convert 24-hour format to 12-hour AM/PM format
                        const [hours, minutes] = getNextAttendTask()?.meeting_time.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        return `${displayHour}:${minutes} ${ampm}`;
                      })() : 
                      getNextAttendTask()?.deadline ? 
                        new Date(getNextAttendTask()?.deadline).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        }) : 'Time TBD'
                    }
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const task = getNextAttendTask();
                    if (task?.relevant_links && task.relevant_links.length > 0) {
                      window.open(task.relevant_links[0], '_blank');
                    } else {
                      alert('No zoom link available for this meeting');
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  }`}>
                  📹 Join Zoom
                </button>
              </div>
            ) : (
              <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-center">
                  <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Zoom Calls Scheduled</h3>
                  <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No zoom classes to attend soon. Check back later for updates.
                  </p>
                </div>
              </div>
            )}

            {/* Mentors */}
            <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-200 hover:border-gray-300'
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
