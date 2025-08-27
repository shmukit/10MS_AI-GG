import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Roadmap, RoadmapWeek, RoadmapTask, getRoadmapBySlug } from '../../services/database';
import { supabase } from '../../lib/supabase';
import { NodeStatus } from './RoadmapNode';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../../lib/ThemeContext';
import { generateRoadmapData } from '../../data/roadmapData';

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

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user data first
        const dashboardData = await DatabaseService.getDashboardData(user.id);
        
        // Get student progress
        const { data: progressData } = await supabase
          .from('student_progress')
          .select('*')
          .eq('student_id', user.id);
        
        setStudentProgress(progressData || []);
        
        let roadmapData: Roadmap | null = null;
        
        // If we have a slug, try to fetch by slug, otherwise get from user's batch
        if (roadmapSlug) {
          roadmapData = await getRoadmapBySlug(roadmapSlug);
        }
        
        // Fallback to user's assigned roadmap
        if (!roadmapData) {
          roadmapData = await DatabaseService.getStudentRoadmap(user.id);
        }
        
        if (!roadmapData) {
          setError('No roadmap found for your batch');
          return;
        }
        
        setRoadmap(roadmapData);
        
        const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
        setWeeks(weeksData);
        
        // Get tasks for all weeks
        const allTasks: RoadmapTask[] = [];
        for (const week of weeksData) {
          const weekTasks = await DatabaseService.getRoadmapTasks(week.id);
          allTasks.push(...weekTasks);
        }
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

  // Generate roadmap data from real database data
  const roadmapData = generateRoadmapData(roadmap, weeks, tasks, studentProgress);
  const completedNodes = roadmapData.nodes.filter(node => node.status === 'completed').length;
  const totalNodes = roadmapData.nodes.length;

  return (
    <div className={`h-screen flex flex-col transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b h-16 transition-colors duration-200 ${
        effectiveDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">10MS</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${effectiveDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {effectiveToggleDarkMode && (
                <button
                  onClick={effectiveToggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    effectiveDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {effectiveDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${effectiveDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={`border-b h-16 transition-colors duration-200 ${
        effectiveDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 transition-colors ${
                effectiveDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold transition-colors duration-200 ${effectiveDarkMode ? 'text-white' : 'text-gray-900'}`}>{roadmap.title}</h1>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar completed={completedNodes} total={totalNodes} isDarkMode={effectiveDarkMode} />

              {/* Canvas */}
        <div className="flex-1 relative">
          <RoadmapCanvas isDarkMode={effectiveDarkMode} roadmapNodes={roadmapData.nodes} />
        </div>
    </div>
  );
};