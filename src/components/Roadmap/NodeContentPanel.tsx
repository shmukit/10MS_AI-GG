import React, { useState, useEffect } from 'react';
import { X, Clock, ExternalLink, Circle, Play, BookOpen, Code, FileText, Award, Users, Trophy } from 'lucide-react';
import { RoadmapNodeData } from './RoadmapNode';
import { DatabaseService } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { DiscussionBoard } from '../Discussion/DiscussionBoard';
import { posthog } from '../../lib/posthog';

interface NodeContentPanelProps {
  node: RoadmapNodeData;
  onClose: () => void;
  isDarkMode?: boolean;
  onRefresh?: () => void;
  batchId?: string;
}

interface StudentCompletion {
  studentId: string;
  studentName: string;
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  completedTaskNames: string[];
  lastCompletedAt?: string;
}

export const NodeContentPanel: React.FC<NodeContentPanelProps> = ({ node, onClose, isDarkMode = false, onRefresh, batchId }) => {
  const [completedTasks, setCompletedTasks] = useState(node.tasks.map(t => t.completed));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTaskConfirmation, setShowTaskConfirmation] = useState(false);
  const [showTaskUncheckConfirmation, setShowTaskUncheckConfirmation] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(-1);
  const [studentCompletions, setStudentCompletions] = useState<StudentCompletion[]>([]);
  const [loadingCompletions, setLoadingCompletions] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { databaseUserId } = useAuth();

  useEffect(() => {
    const newCompletedTasks = node.tasks.map(t => t.completed);
    setCompletedTasks(newCompletedTasks);
  }, [node.tasks]);

  useEffect(() => {
    if (batchId && node.id) {
      fetchStudentCompletions();
    }
  }, [batchId, node.id]);

  const fetchStudentCompletions = async () => {
    if (!batchId || !node.id) return;

    try {
      setLoadingCompletions(true);
      const completions = await DatabaseService.getWeekStudentCompletionDetails(node.id, batchId);
      setStudentCompletions(completions);
    } catch (error) {
      console.error('Error fetching student completions:', error);
    } finally {
      setLoadingCompletions(false);
    }
  };

  const toggleTaskCompletion = (taskIndex: number) => {
    if (node.status === 'completed') return;

    if (!completedTasks[taskIndex]) {
      setSelectedTaskIndex(taskIndex);
      setShowTaskConfirmation(true);
    } else {
      setSelectedTaskIndex(taskIndex);
      setShowTaskUncheckConfirmation(true);
    }
  };

  const handleConfirmTaskCompletion = async () => {
    if (selectedTaskIndex >= 0 && databaseUserId) {
      const task = node.tasks[selectedTaskIndex];

      try {
        const success = await DatabaseService.updateTaskProgress(
          databaseUserId,
          task.id,
          'completed'
        );

        if (success) {
          posthog?.capture('task_completed', {
            task_id: task.id,
            task_name: task.title,
            task_type: task.type,
            roadmap_id: node.id
          });
          
          setCompletedTasks(prev => {
            const newCompleted = [...prev];
            newCompleted[selectedTaskIndex] = true;
            return newCompleted;
          });
          if (onRefresh) onRefresh();
        } else {
          alert('Failed to mark task as completed. Please try again.');
        }
      } catch (error) {
        console.error('Error marking task as completed:', error);
        alert('Error marking task as completed. Please try again.');
      } finally {
        setShowTaskConfirmation(false);
        setSelectedTaskIndex(-1);
      }
    }
  };

  const handleConfirmTaskUncheck = async () => {
    if (selectedTaskIndex >= 0 && databaseUserId) {
      const task = node.tasks[selectedTaskIndex];

      try {
        const success = await DatabaseService.updateTaskProgress(
          databaseUserId,
          task.id,
          'not_started'
        );

        if (success) {
          setCompletedTasks(prev => {
            const newCompleted = [...prev];
            newCompleted[selectedTaskIndex] = false;
            return newCompleted;
          });
          if (onRefresh) onRefresh();
        } else {
          alert('Failed to update task status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        alert('Error updating task status. Please try again.');
      } finally {
        setShowTaskUncheckConfirmation(false);
        setSelectedTaskIndex(-1);
      }
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'watch': return <Play className="w-4 h-4 text-blue-500" />;
      case 'read': return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'project': return <Code className="w-4 h-4 text-orange-500" />;
      case 'attend': return <Users className="w-4 h-4 text-green-500" />;
      case 'mcq': return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'written': return <FileText className="w-4 h-4 text-teal-500" />;
      case 'video': return <Play className="w-4 h-4 text-blue-500" />;
      case 'exercise': return <Code className="w-4 h-4 text-green-500" />;
      case 'reading': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = completedTasks.filter(Boolean).length / completedTasks.length;
  const isCompleted = completionRate === 1;

  const handleMarkAsComplete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCompletion = async () => {
    if (isMarkingComplete) return;

    setIsMarkingComplete(true);
    try {
      if (!databaseUserId) {
        alert('User ID missing. Please log in again.');
        return;
      }

      // Check status (if implemented in implementation)
      if (DatabaseService.checkTasksCompletionStatus) {
        await DatabaseService.checkTasksCompletionStatus(node.id, databaseUserId);
      }

      const success = await DatabaseService.markWeekAsComplete(databaseUserId, node.id);

      if (success) {
        alert('Week marked as complete!');
        if (onRefresh) {
          setTimeout(() => onRefresh(), 1000);
        } else {
          window.location.reload();
        }
      } else {
        alert('Failed to mark week as complete. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Error marking week as complete:', error);
      alert('Error marking week as complete. Please refresh and try again.');
    } finally {
      setIsMarkingComplete(false);
      setShowConfirmation(false);
    }
  };

  const getSelectedTask = () => {
    if (selectedTaskIndex >= 0 && selectedTaskIndex < node.tasks.length) {
      return node.tasks[selectedTaskIndex];
    }
    return null;
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      <div className={`
        fixed lg:relative 
        inset-x-0 bottom-0 lg:inset-auto lg:bottom-auto
        w-full lg:w-1/3 
        max-h-[80vh] lg:max-h-none lg:h-full
        border-t lg:border-l lg:border-t-0 
        flex flex-col 
        transition-all duration-300 ease-in-out
        z-50 lg:z-auto
        rounded-t-xl lg:rounded-none
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="lg:hidden flex justify-center pt-2 pb-1">
          <div className={`w-8 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        </div>

        <div className={`flex items-center justify-between p-4 sm:p-6 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {node.status === 'completed' ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : node.status === 'active' ? (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}>
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
              </div>
            ) : (
              <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
            )}
            <h2 className={`text-lg sm:text-xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{node.title}</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{node.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-4 h-4" />
              <span>{node.estimatedTime}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Award className="w-4 h-4" />
              <span>{node.tasks.length} tasks</span>
            </div>
          </div>

          {node.status === 'active' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h3>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(completionRate * 100)}% Complete</span>
              </div>
              <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${completionRate * 100}%` }} />
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tasks & Resources</h3>
              <div className="flex gap-2">
                {node.status === 'completed' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                    Completed
                  </span>
                )}
                {node.status === 'locked' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-900/30 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                    🔒 Locked
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {node.tasks.map((task, index) => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200'}`}>
                  <button
                    onClick={() => toggleTaskCompletion(index)}
                    disabled={node.status === 'locked' || node.status === 'completed'}
                    className="flex-shrink-0"
                  >
                    {completedTasks[index] ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-gray-500' : 'border-gray-400'}`} />
                    )}
                  </button>
                  <div className="flex items-center gap-2 flex-1">
                    {getTaskIcon(task.type)}
                    <span className={`text-sm ${completedTasks[index] ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</span>
                  </div>
                  {task.url && <a 
                      href={task.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => {
                        posthog?.capture('task_started', {
                          task_id: task.id,
                          task_name: task.title,
                          task_type: task.type,
                          roadmap_id: node.id
                        });
                      }}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>}
                </div>
              ))}
            </div>
          </div>

          {batchId && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Class Completion</h3>
              </div>
              {loadingCompletions ? (
                <div className="text-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div></div>
              ) : studentCompletions.length > 0 ? (
                <div>
                  {(() => {
                    const completedStudents = studentCompletions.filter(s => s.completionPercentage >= 80);
                    if (completedStudents.length === 0) return <p className="text-center text-gray-500">No students completed yet.</p>;
                    return (
                      <div className="flex flex-wrap gap-2">
                        {completedStudents.map((student, i) => (
                          <div key={student.studentId} className="flex items-center gap-2">
                            {i === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                            <span className="text-sm font-medium text-blue-500">{student.studentName}</span>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              ) : <p className="text-center text-gray-500">No completion data</p>}
            </div>
          )}

          {(node.status === 'active' || node.status === 'completed') && (
            <div className="mb-6">
              <button
                onClick={handleMarkAsComplete}
                disabled={node.status === 'completed' || !isCompleted || isMarkingComplete}
                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${isMarkingComplete ? 'bg-gray-400 cursor-wait' :
                    node.status === 'completed' ? 'bg-green-600 cursor-default' :
                      isCompleted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                {isMarkingComplete ? 'Processing...' : node.status === 'completed' ? 'Week Completed ✓' : isCompleted ? 'Mark Week as Complete' : 'Complete all tasks first'}
              </button>
            </div>
          )}

          <div className="mb-6">
            <DiscussionBoard entityType="week" entityId={node.id} />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => !isMarkingComplete && setShowConfirmation(false)}
        onConfirm={handleConfirmCompletion}
        title="Confirm Week Completion"
        message={`Are you sure you have completed all tasks for "${node.title}"?`}
        isDarkMode={isDarkMode}
        isLoading={isMarkingComplete}
      />
      <ConfirmationModal
        isOpen={showTaskConfirmation}
        onClose={() => setShowTaskConfirmation(false)}
        onConfirm={handleConfirmTaskCompletion}
        title="Confirm Task Completion"
        message={`Complete task "${getSelectedTask()?.title}"?`}
        isDarkMode={isDarkMode}
      />
      <ConfirmationModal
        isOpen={showTaskUncheckConfirmation}
        onClose={() => setShowTaskUncheckConfirmation(false)}
        onConfirm={handleConfirmTaskUncheck}
        title="Confirm Task Uncheck"
        message={`Mark task "${getSelectedTask()?.title}" as incomplete?`}
        isDarkMode={isDarkMode}
      />
    </>
  );
};