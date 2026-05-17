import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Roadmap, RoadmapWeek, RoadmapTask } from '../../services/database';
import { supabase } from '../../lib/supabase';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../../lib/ThemeContext';
import { generateRoadmapData } from '../../data/roadmapData';
import { StudentHeader } from '../Student/StudentHeader';
import { RoadmapDropdown } from '../Student/dashboard/RoadmapDropdown';
import { useNavigate } from 'react-router-dom';
import { posthog } from '../../lib/posthog';

interface RoadmapInterfaceProps {
  onBack: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const RoadmapInterface: React.FC<RoadmapInterfaceProps> = ({ onBack, isDarkMode = false }) => {
  const { roadmapSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { user, databaseUserId } = useAuth();
  const { isDarkMode: themeDarkMode } = useTheme();
  // const posthog = usePostHog();

  // Use theme context if no props provided
  const effectiveDarkMode = isDarkMode ?? themeDarkMode;

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Student');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [completionStats, setCompletionStats] = useState<{ [weekId: string]: any }>({});
  const [targetWeekNumber, setTargetWeekNumber] = useState<number | null>(null);
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
  const navigate = useNavigate();

  const refreshRoadmapData = async () => {
    if (!databaseUserId) return;

    try {
      console.log('🔄 Refreshing roadmap data after week completion...');

      // Refresh student progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', databaseUserId);

      console.log('📊 Refreshed progress data:', progressData?.length || 0, 'records');
      setStudentProgress(progressData || []);

      // Refresh completion statistics if we have weeks and batchId
      if (weeks.length > 0 && batchId) {
        console.log('🔄 Refreshing completion stats...');
        await fetchCompletionStats();
      }

      console.log('✅ Roadmap data refresh completed');
    } catch (err) {
      console.error('❌ Error refreshing roadmap data:', err);
    }
  };

  const fetchCompletionStats = async () => {
    if (!batchId || weeks.length === 0) return;

    try {
      const stats: { [weekId: string]: any } = {};

      for (const week of weeks) {
        const weekStats = await DatabaseService.getWeekCompletionStats(week.id, batchId);
        stats[week.id] = weekStats;
      }

      setCompletionStats(stats);
    } catch (error) {
      console.error('Error fetching completion stats:', error);
    }
  };

  const handleBatchChange = async (newBatchId: string) => {
    const selectedBatch = enrolledBatches.find(b => b.id === newBatchId);
    if (selectedBatch && selectedBatch.roadmap) {
      const slug = DatabaseService.generateRoadmapSlug(selectedBatch.roadmap.title);
      navigate(`/student/roadmap/${slug}`);
      setShowRoadmapDropdown(false);
    }
  };

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!databaseUserId) return;

      try {
        setLoading(true);
        setError(null);

        // Track roadmap view and WAU/MAU
        posthog?.capture('roadmap_view', {
          user_id: databaseUserId,
          roadmap_slug: roadmapSlug,
          batch_id: batchId,
          viewed_at: new Date().toISOString()
        });

        // Track WAU (Weekly Active User)
        posthog?.capture('$pageview', {
          page: 'roadmap_interface',
          user_id: databaseUserId,
          roadmap_slug: roadmapSlug
        });

        // Check for week parameter in URL
        const weekParam = searchParams.get('week');
        if (weekParam) {
          const weekNum = parseInt(weekParam, 10);
          if (!isNaN(weekNum) && weekNum > 0) {
            setTargetWeekNumber(weekNum);
          }
        }

        // Fetch only essential data in parallel - avoid heavy getDashboardData
        const [userDataQuery, batchQuery, enrolledQuery, progressQuery] = await Promise.all([
          DatabaseService.getUserById(databaseUserId),
          DatabaseService.getStudentBatch(databaseUserId),
          DatabaseService.getEnrolledBatches(databaseUserId),
          supabase
            .from('student_progress')
            .select('*')
            .eq('student_id', databaseUserId)
        ]);

        // Set user name from lightweight user data
        if (userDataQuery?.first_name) {
          setUserName(userDataQuery.first_name);
        } else if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user?.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Get student's batch information
        if (batchQuery?.id) {
          setBatchId(batchQuery.id);
        }

        // Set enrolled batches for the dropdown
        if (enrolledQuery) {
          setEnrolledBatches(enrolledQuery);
        }

        // Set progress data
        setStudentProgress(progressQuery.data || []);

        // Optimize roadmap fetching with parallel processing
        if (!roadmapSlug) {
          setError('No roadmap specified in URL');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching roadmap by slug:', roadmapSlug);
        const roadmapData = await DatabaseService.getRoadmapBySlug(roadmapSlug);

        if (!roadmapData) {
          console.error('❌ No roadmap found for slug:', roadmapSlug);
          setError(`No roadmap found for "${roadmapSlug}". Please check the URL or contact support.`);
          setLoading(false);
          return;
        }

        setRoadmap(roadmapData);

        // Fetch weeks and all tasks in a single optimized query
        const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
        setWeeks(weeksData);

        // Fetch all tasks for all weeks in parallel (much faster)
        if (weeksData.length > 0) {
          const weekIds = weeksData.map(week => week.id);
          const { data: allTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select(`
              *,
              batch_task_deadlines!left(deadline, batch_id)
            `)
            .in('week_id', weekIds)
            .order('created_at');

          if (!tasksError && allTasks) {
            // Apply batch-specific deadlines
            const transformedTasks = allTasks.map((task: any) => {
              let finalDeadline = task.deadline;
              if (batchId && task.batch_task_deadlines) {
                const deadlines = Array.isArray(task.batch_task_deadlines) ?
                  task.batch_task_deadlines : [task.batch_task_deadlines];
                const batchSpecific = deadlines.find((d: any) => d.batch_id === batchId);
                if (batchSpecific?.deadline) finalDeadline = batchSpecific.deadline;
              }
              return { ...task, deadline: finalDeadline };
            });
            setTasks(transformedTasks);
          } else {
            console.error('Error fetching tasks:', tasksError);
            setTasks([]);
          }
        } else {
          setTasks([]);
        }

      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError('Failed to load roadmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [databaseUserId, roadmapSlug]);

  // Lazy-load completion statistics after initial render for better performance
  useEffect(() => {
    if (weeks.length > 0 && batchId && !loading) {
      // Delay completion stats to avoid blocking initial render
      setTimeout(() => {
        fetchCompletionStats();
      }, 100);
    }
  }, [weeks, batchId, loading]);

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

  // Count completed nodes based on task completion, not just status
  const completedNodes = nodesWithStats.filter(node => {
    const completedTasks = node.tasks.filter(task => task.completed).length;
    return completedTasks === node.tasks.length && node.tasks.length > 0;
  }).length;
  const totalNodes = nodesWithStats.length;

  console.log('📊 Progress calculation:', {
    completedNodes,
    totalNodes,
    nodeStatuses: nodesWithStats.map(n => ({ title: n.title, status: n.status, completedTasks: n.tasks.filter(t => t.completed).length, totalTasks: n.tasks.length }))
  });

  return (
    <div className={`h-screen flex flex-col transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <StudentHeader
        userName={userName}
        userRole="student"
        pageTitle="Roadmap"
        actions={
          enrolledBatches.length > 1 && (
            <RoadmapDropdown
              isDarkMode={effectiveDarkMode}
              enrolledBatches={enrolledBatches}
              currentBatch={enrolledBatches.find(b => b.id === batchId) || roadmap}
              showDropdown={showRoadmapDropdown}
              setShowDropdown={setShowRoadmapDropdown}
              handleBatchChange={handleBatchChange}
              selectedBatchId={batchId || ''}
            />
          )
        }
      />

      {/* Breadcrumb / Back button */}
      <div className={`border-b min-h-12 md:min-h-16 transition-colors duration-200 ${effectiveDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 md:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 md:gap-2 transition-colors ${effectiveDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-xs md:text-base">Back to Dashboard</span>
            </button>

            {/* Removed duplicate title here as it's now in StudentHeader */}
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
          targetWeekNumber={targetWeekNumber}
        />
      </div>
    </div>
  );
};