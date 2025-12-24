import React, { useState, useEffect } from 'react';
import { X, Clock, ExternalLink, Circle, Play, BookOpen, Code, FileText, Award, Users, Trophy } from 'lucide-react';
import { RoadmapNodeData } from './RoadmapNode';
import { DatabaseService } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { DiscussionBoard } from '../Discussion/DiscussionBoard';

interface NodeContentPanelProps {
  node: RoadmapNodeData;
  onClose: () => void;
  isDarkMode?: boolean;
  onRefresh?: () => void; // Added onRefresh prop
  batchId?: string; // Add batchId prop for fetching completion data
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
  const { user } = useAuth();

  // Fetch student completion data when the panel opens
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
    // If week is already completed, tasks cannot be changed
    if (node.status === 'completed') {
      return;
    }

    // If task is being completed, show confirmation
    if (!completedTasks[taskIndex]) {
      setSelectedTaskIndex(taskIndex);
      setShowTaskConfirmation(true);
    } else {
      // If task is being unchecked, show confirmation modal
      setSelectedTaskIndex(taskIndex);
      setShowTaskUncheckConfirmation(true);
    }
  };

  const handleConfirmTaskCompletion = () => {
    if (selectedTaskIndex >= 0) {
      setCompletedTasks(prev => {
        const newCompleted = [...prev];
        newCompleted[selectedTaskIndex] = true;
        return newCompleted;
      });
      setShowTaskConfirmation(false);
      setSelectedTaskIndex(-1);
    }
  };

  const handleConfirmTaskUncheck = () => {
    if (selectedTaskIndex >= 0) {
      setCompletedTasks(prev => {
        const newCompleted = [...prev];
        newCompleted[selectedTaskIndex] = false;
        return newCompleted;
      });
      setShowTaskUncheckConfirmation(false);
      setSelectedTaskIndex(-1);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'watch':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'project':
        return <Code className="w-4 h-4 text-orange-500" />;
      case 'attend':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'mcq':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'written':
        return <FileText className="w-4 h-4 text-teal-500" />;
      case 'video':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'exercise':
        return <Code className="w-4 h-4 text-green-500" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const completionRate = completedTasks.filter(Boolean).length / completedTasks.length;
  const isCompleted = completionRate === 1;

  const handleMarkAsComplete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCompletion = async () => {
    try {
      if (!user?.id) {
        console.error('❌ User not authenticated');
        alert('User not authenticated. Please log in again.');
        return;
      }

      console.log('🔄 Calling markWeekAsComplete for user:', user.id, 'week:', node.id);

      // Mark week as complete
      const success = await DatabaseService.markWeekAsComplete(user.id, node.id);
      console.log('📊 markWeekAsComplete result:', success);

      if (success) {
        // Update local state to reflect completion
        // This would typically trigger a refresh of the roadmap data
        console.log('✅ Week marked as complete successfully');
        alert('Week marked as complete!');
        // Call refresh callback if provided
        if (onRefresh) {
          console.log('🔄 Calling onRefresh callback');
          onRefresh();
        } else {
          console.log('⚠️ No onRefresh callback provided');
        }
      } else {
        console.error('❌ Failed to mark week as complete');
        alert('Failed to mark week as complete. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error marking week as complete:', error);
      alert('Error marking week as complete. Please try again.');
    } finally {
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
      {/* Mobile Modal Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Task Panel - Mobile Modal or Desktop Sidebar */}
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
        ${isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
        }
      `}>
        {/* Mobile drag handle */}
        <div className="lg:hidden flex justify-center pt-2 pb-1">
          <div className={`w-8 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {node.status === 'completed' ? (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isDarkMode
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                }`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : node.status === 'active' ? (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'border-blue-400' : 'border-blue-500'
                }`}>
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
              </div>
            ) : (
              <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
            )}
            <h2 className={`text-lg sm:text-xl font-bold transition-colors duration-200 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{node.title}</h2>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${isDarkMode
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-500'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Description */}
          <div className="mb-6">
            <p className={`leading-relaxed transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{node.description}</p>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-4 h-4" />
              <span>{node.estimatedTime}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Award className="w-4 h-4" />
              <span>{node.tasks.length} tasks</span>
            </div>
          </div>

          {/* 1. Your Progress */}
          {node.status === 'active' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h3>
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Math.round(completionRate * 100)}% Complete
                </span>
              </div>
              <div className={`w-full rounded-full h-2 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                  style={{ width: `${completionRate * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* 2. Tasks & Resources */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tasks & Resources</h3>
              {node.status === 'completed' && (
                <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode
                  ? 'bg-green-900/30 text-green-300 border border-green-700'
                  : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                  🔒 Tasks Locked
                </span>
              )}
            </div>
            <div className="space-y-3">
              {node.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isDarkMode
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <button
                    onClick={() => toggleTaskCompletion(index)}
                    className="flex-shrink-0"
                    disabled={node.status === 'locked' || node.status === 'completed'}
                    title={node.status === 'completed' ? 'Tasks are locked after week completion' : ''}
                  >
                    {completedTasks[index] ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${isDarkMode
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                        }`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-110 ${isDarkMode
                        ? 'border-gray-500 hover:border-gray-400 hover:bg-gray-600'
                        : 'border-gray-400 hover:border-gray-500 hover:bg-gray-100'
                        }`} />
                    )}
                  </button>

                  <div className="flex items-center gap-2 flex-1">
                    {getTaskIcon(task.type)}
                    <span className={`text-sm ${completedTasks[index]
                      ? `line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`
                      : `${isDarkMode ? 'text-white' : 'text-gray-900'}`
                      }`}>
                      {task.title}
                    </span>
                  </div>

                  {task.url && (
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-shrink-0 p-1 rounded transition-colors ${isDarkMode
                        ? 'hover:bg-gray-600 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-500'
                        }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Related Skills */}
          {node.relatedSkills.length > 0 && (
            <div className="mb-6">
              <h3 className={`font-semibold mb-3 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Related Skills</h3>
              <div className="flex flex-wrap gap-2">
                {node.relatedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${isDarkMode
                      ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. Class Completion - Only show students who completed ALL tasks */}
          {batchId && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Class Completion
                </h3>
              </div>

              {loadingCompletions ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading completion data...</p>
                </div>
              ) : studentCompletions.length > 0 ? (
                <div>
                  {/* Filter to only show students who completed ALL tasks */}
                  {(() => {
                    const fullyCompletedStudents = studentCompletions.filter(
                      student => student.completionPercentage === 100
                    );

                    if (fullyCompletedStudents.length === 0) {
                      return (
                        <p className={`text-sm text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          No students have completed all tasks for this week yet.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          This week's tasks completed by:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {fullyCompletedStudents.map((student, index) => (
                            <div key={student.studentId} className="flex items-center gap-2">
                              {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'
                                }`}>
                                {student.studentName}
                              </span>
                              {index < fullyCompletedStudents.length - 1 && (
                                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>,</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <p className={`text-sm text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No completion data available
                </p>
              )}
            </div>
          )}

          {/* Complete Button - Moved near Related Skills */}
          {node.status === 'active' && (
            <div className="mb-6">
              <button
                onClick={handleMarkAsComplete}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${isCompleted
                  ? `${isDarkMode ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'} text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                  }`}
                disabled={!isCompleted}
              >
                {isCompleted ? 'Mark as Complete' : `Complete ${completedTasks.filter(Boolean).length}/${completedTasks.length} tasks first`}
              </button>
            </div>
          )}

          {/* 5. Discussion Board */}
          <div className="mb-6">
            <DiscussionBoard entityType="week" entityId={node.id} />
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Week Completion */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCompletion}
        title="Confirm Week Completion"
        message={`Are you sure you have completed all tasks for "${node.title}"? Please double-check before confirming as this will mark the week as complete and update your progress.`}
        isDarkMode={isDarkMode}
      />

      {/* Confirmation Modal for Task Completion */}
      <ConfirmationModal
        isOpen={showTaskConfirmation}
        onClose={() => {
          setShowTaskConfirmation(false);
          setSelectedTaskIndex(-1);
        }}
        onConfirm={handleConfirmTaskCompletion}
        title="Confirm Task Completion"
        message={`Are you sure you have completed the task "${getSelectedTask()?.title}"? Please double-check before confirming as this will mark the task as done and update your progress.`}
        isDarkMode={isDarkMode}
      />

      {/* Confirmation Modal for Task Uncheck */}
      <ConfirmationModal
        isOpen={showTaskUncheckConfirmation}
        onClose={() => {
          setShowTaskUncheckConfirmation(false);
          setSelectedTaskIndex(-1);
        }}
        onConfirm={handleConfirmTaskUncheck}
        title="Confirm Task Uncheck"
        message={`Are you sure you want to mark the task "${getSelectedTask()?.title}" as incomplete? This will update your progress and remove the completion status.`}
        isDarkMode={isDarkMode}
      />
    </>
  );
};