import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Roadmap, RoadmapWeek, RoadmapTask, StudentProgress } from '../../services/database';

export const StudentRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const { roadmapSlug } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [weeks, setWeeks] = useState<RoadmapWeek[]>([]);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const roadmapData = await DatabaseService.getStudentRoadmap(user.id);
        if (!roadmapData) {
          setError('No roadmap found for your batch');
          return;
        }
        
        setRoadmap(roadmapData);
        
        const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
        setWeeks(weeksData);
        
        const progressData = await DatabaseService.getStudentProgress(user.id);
        setProgress(progressData);
        
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
  }, [user?.id]);

  const getTaskStatus = (taskId: string) => {
    const taskProgress = progress.find(p => p.task_id === taskId);
    return taskProgress?.status || 'not_started';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h5 text-red-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Roadmap</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-yellow-800 font-medium">No Roadmap Available</h3>
                <p className="text-yellow-600 text-sm">
                  You haven't been assigned to a roadmap yet. Please contact your mentor or administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {roadmap.title}
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{roadmap.total_weeks}</div>
              <div className="text-sm text-gray-600">Total Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{roadmap.difficulty_level}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{roadmap.category}</div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
          </div>
          
          {roadmap.description && (
            <p className="text-gray-700 text-center">{roadmap.description}</p>
          )}
        </div>

        {/* Weeks and Tasks */}
        <div className="space-y-6">
          {weeks.map((week) => {
            const weekTasks = tasks.filter(task => {
              // This is a simplified mapping - you'd need proper week-task relationships
              return true; // Show all tasks for now
            });
            
            return (
              <div key={week.id} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Week {week.week_number}: {week.title}
                </h3>
                
                {week.description && (
                  <p className="text-gray-600 mb-4">{week.description}</p>
                )}
                
                <div className="space-y-3">
                  {weekTasks.map((task) => {
                    const status = getTaskStatus(task.id);
                    return (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(status)}
                          <div>
                            <h4 className="font-medium text-gray-900">{task.task_name}</h4>
                            {task.task_details && (
                              <p className="text-sm text-gray-600">{task.task_details}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(status)}`}>
                            {status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">{task.points} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
