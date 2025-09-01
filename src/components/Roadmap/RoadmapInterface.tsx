import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Roadmap, RoadmapWeek, RoadmapTask, getRoadmapBySlug } from '../../services/database';
import { supabase } from '../../lib/supabase';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../../lib/ThemeContext';
import { generateRoadmapData } from '../../data/roadmapData';
import { StudentHeader } from '../Student/StudentHeader';

interface RoadmapInterfaceProps {
  onBack: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const RoadmapInterface: React.FC<RoadmapInterfaceProps> = ({ onBack, isDarkMode = false, toggleDarkMode }) => {
  const { roadmapSlug } = useParams();
  const { user } = useAuth();
  const { isDarkMode: themeDarkMode, toggleDarkMode: themeToggleDarkMode } = useTheme();
  
  // Use theme context if no props provided
  const effectiveDarkMode = isDarkMode ?? themeDarkMode;
  const effectiveToggleDarkMode = toggleDarkMode ?? themeToggleDarkMode;
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Student');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [completionStats, setCompletionStats] = useState<{[weekId: string]: any}>({});

  const refreshRoadmapData = async () => {
    if (!user?.id) return;
    
    try {
      // Refresh student progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id);
      
      setStudentProgress(progressData || []);
      
      // Refresh completion statistics if we have weeks and batchId
      if (weeks.length > 0 && batchId) {
        await fetchCompletionStats();
      }
    } catch (err) {
      console.error('Error refreshing roadmap data:', err);
    }
  };

  const fetchCompletionStats = async () => {
    if (!batchId || weeks.length === 0) return;
    
    try {
      const stats: {[weekId: string]: any} = {};
      
      for (const week of weeks) {
        const weekStats = await DatabaseService.getWeekCompletionStats(week.id, batchId);
        stats[week.id] = weekStats;
      }
      
      setCompletionStats(stats);
    } catch (error) {
      console.error('Error fetching completion stats:', error);
    }
  };

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use Promise.all for parallel fetching to improve performance
        const [dashboardData, progressQuery] = await Promise.all([
          DatabaseService.getDashboardData(user.id),
          supabase
            .from('student_progress')
            .select('*')
            .eq('student_id', user.id)
        ]);
        
        // Set user name from dashboard data
        if (dashboardData?.userData?.first_name) {
          setUserName(dashboardData.userData.first_name);
        } else if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user?.email) {
          setUserName(user.email.split('@')[0]);
        }
        
        // Get student's batch information
        if (dashboardData?.batch?.id) {
          setBatchId(dashboardData.batch.id);
        }
        
        // Set progress data
        setStudentProgress(progressQuery.data || []);
        
        let roadmapData: Roadmap | null = null;
        
        // Use roadmap slug to fetch roadmap data
        if (roadmapSlug) {
          console.log('🔍 Fetching roadmap by slug:', roadmapSlug);
          roadmapData = await getRoadmapBySlug(roadmapSlug);
          console.log('📊 Roadmap data from slug:', roadmapData);
          
          // Debug: Check what roadmaps exist in the database (only if needed)
          if (!roadmapData) {
            console.log('🔍 Debug: Checking all available roadmaps...');
            const { data: allRoadmaps, error: roadmapsError } = await supabase
              .from('roadmaps')
              .select('id, title, category')
              .order('title');
            
            if (!roadmapsError && allRoadmaps) {
              console.log('📋 Available roadmaps:', allRoadmaps);
            }
          }
        }
        
        // Don't fallback to user's assigned roadmap - only use the slug
        if (!roadmapData) {
          console.error('❌ No roadmap found for slug:', roadmapSlug);
          setError(`No roadmap found for "${roadmapSlug}". Please check the URL or contact support.`);
          setLoading(false);
          return;
        }
        
        setRoadmap(roadmapData);
        
        // Fetch weeks and tasks in parallel for better performance
        const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
        setWeeks(weeksData);
        
        // Parallelize task fetching for all weeks
        const taskPromises = weeksData.map(week => 
          DatabaseService.getRoadmapTasks(week.id)
        );
        const allTaskArrays = await Promise.all(taskPromises);
        const allTasks: RoadmapTask[] = allTaskArrays.flat();
        setTasks(allTasks);
        
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError('Failed to load roadmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [user?.id, roadmapSlug]);

  // Fetch completion statistics after weeks and batchId are loaded
  useEffect(() => {
    if (weeks.length > 0 && batchId) {
      fetchCompletionStats();
    }
  }, [weeks, batchId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg transition-colors duration-200 ${effectiveDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-bold mb-4 transition-colors duration-200 ${effectiveDarkMode ? 'text-white' : 'text-gray-900'}`}>Error Loading Roadmap</h2>
          <p className={`text-gray-600 mb-6 transition-colors duration-200 ${effectiveDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error || 'No roadmap available'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Generate roadmap data from real database data with completion stats
  const roadmapData = generateRoadmapData(roadmap, weeks, tasks, studentProgress, batchId || undefined);
  
  // Update nodes with completion statistics
  const nodesWithStats = roadmapData.nodes.map(node => ({
    ...node,
    completionStats: completionStats[node.id] || undefined
  }));
  
  const completedNodes = nodesWithStats.filter(node => node.status === 'completed').length;
  const totalNodes = nodesWithStats.length;

  return (
    <div className={`h-screen flex flex-col transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <StudentHeader 
        userName={userName}
        userRole="student"
        pageTitle={roadmap.title}
      />

      {/* Breadcrumb */}
      <div className={`border-b min-h-16 transition-colors duration-200 ${
        effectiveDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 transition-colors ${
                effectiveDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Back to Dashboard</span>
            </button>
            
            <h1 className={`text-lg sm:text-2xl font-bold transition-colors duration-200 truncate ml-4 ${effectiveDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {roadmap.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar completed={completedNodes} total={totalNodes} isDarkMode={effectiveDarkMode} />

      {/* Canvas */}
      <div className="flex-1 relative">
        <RoadmapCanvas 
          isDarkMode={effectiveDarkMode} 
          roadmapNodes={nodesWithStats} 
          onRefresh={refreshRoadmapData}
          batchId={batchId}
        />
      </div>
    </div>
  );
};