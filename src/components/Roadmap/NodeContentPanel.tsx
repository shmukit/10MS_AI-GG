import React, { useState, useEffect } from 'react';
import { X, Clock, ExternalLink, Circle, Play, BookOpen, Code, FileText, Award, Users, Trophy } from 'lucide-react';
import { RoadmapNodeData } from './RoadmapNode';
import { DatabaseService } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { DiscussionBoard } from '../Discussion/DiscussionBoard';
import { posthog } from '../../lib/posthog';
import { isDecisionTreeResourceUrl } from '../Playbooks/AgenticDecisionTree';
import { useToast } from '../ui/ToastProvider';

interface NodeContentPanelProps {
  node: RoadmapNodeData;
  onClose: () => void;
  onRefresh?: () => void;
  batchId?: string;
  nodeUnitLabel?: string;
  onOpenDecisionTree?: () => void;
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

export const NodeContentPanel: React.FC<NodeContentPanelProps> = ({ node, onClose, onRefresh, batchId, nodeUnitLabel = 'Week', onOpenDecisionTree }) => {
  const [completedTasks, setCompletedTasks] = useState(node.tasks.map(t => t.completed));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTaskConfirmation, setShowTaskConfirmation] = useState(false);
  const [showTaskUncheckConfirmation, setShowTaskUncheckConfirmation] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(-1);
  const [studentCompletions, setStudentCompletions] = useState<StudentCompletion[]>([]);
  const [loadingCompletions, setLoadingCompletions] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { databaseUserId } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

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
          toastError('Failed to mark task as completed. Please try again.');
        }
      } catch (error) {
        console.error('Error marking task as completed:', error);
        toastError('Error marking task as completed. Please try again.');
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
          toastError('Failed to update task status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        toastError('Error updating task status. Please try again.');
      } finally {
        setShowTaskUncheckConfirmation(false);
        setSelectedTaskIndex(-1);
      }
    }
  };

  const getTaskIcon = (type: string) => {
    const iconClass = 'w-4 h-4 text-muted-foreground';
    switch (type.toLowerCase()) {
      case 'watch': return <Play className={iconClass} />;
      case 'read': return <BookOpen className={iconClass} />;
      case 'project': return <Code className={iconClass} />;
      case 'attend': return <Users className={iconClass} />;
      case 'mcq': return <FileText className={iconClass} />;
      case 'written': return <FileText className={iconClass} />;
      case 'video': return <Play className={iconClass} />;
      case 'exercise': return <Code className={iconClass} />;
      case 'reading': return <BookOpen className={iconClass} />;
      default: return <Circle className={iconClass} />;
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
        toastError('User ID missing. Please log in again.');
        return;
      }

      // Check status (if implemented in implementation)
      if (DatabaseService.checkTasksCompletionStatus) {
        await DatabaseService.checkTasksCompletionStatus(node.id, databaseUserId);
      }

      const success = await DatabaseService.markWeekAsComplete(databaseUserId, node.id);

      if (success) {
        toastSuccess('Week marked as complete!');
        if (onRefresh) {
          setTimeout(() => onRefresh(), 1000);
        } else {
          window.location.reload();
        }
      } else {
        toastError('Failed to mark week as complete. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Error marking week as complete:', error);
      toastError('Error marking week as complete. Please refresh and try again.');
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

      <div className="
        fixed lg:relative 
        inset-x-0 bottom-0 lg:inset-auto lg:bottom-auto
        w-full lg:w-1/3 
        max-h-[80vh] lg:max-h-none lg:h-full
        border-t lg:border-l lg:border-t-0 
        flex flex-col 
        transition-all duration-300 ease-in-out
        z-50 lg:z-auto
        rounded-t-xl lg:rounded-none
        bg-card border-border
      ">
        <div className="lg:hidden flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 rounded-full bg-muted"></div>
        </div>

        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border transition-colors duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {node.status === 'completed' ? (
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : node.status === 'active' ? (
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-border" />
            )}
            <h2 className="text-lg sm:text-xl font-bold truncate text-foreground">{node.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Close panel">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <p className="leading-relaxed text-muted-foreground">{node.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{node.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>{node.tasks.length} tasks</span>
            </div>
          </div>

          {node.status === 'active' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-foreground">Your Progress</h3>
                <span className="text-sm text-muted-foreground">{Math.round(completionRate * 100)}% Complete</span>
              </div>
              <div className="progress-track w-full rounded-full h-2">
                <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${completionRate * 100}%` }} />
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Tasks & Resources</h3>
              <div className="flex gap-2">
                {node.status === 'completed' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                    Completed
                  </span>
                )}
                {node.status === 'locked' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    🔒 Locked
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {node.tasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50">
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
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                  </button>
                  <div className="flex items-center gap-2 flex-1">
                    {getTaskIcon(task.type)}
                    <span className={`text-sm ${completedTasks[index] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                  </div>
                  {task.url && (
                    isDecisionTreeResourceUrl(task.url) && onOpenDecisionTree ? (
                      <button
                        type="button"
                        onClick={() => {
                          posthog?.capture('task_started', {
                            task_id: task.id,
                            task_name: task.title,
                            task_type: task.type,
                            roadmap_id: node.id,
                          });
                          onOpenDecisionTree();
                        }}
                        className="p-1 rounded hover:bg-accent"
                        title="Open decision tree"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ) : (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          posthog?.capture('task_started', {
                            task_id: task.id,
                            task_name: task.title,
                            task_type: task.type,
                            roadmap_id: node.id,
                          });
                        }}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {batchId && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Class Completion</h3>
              </div>
              {loadingCompletions ? (
                <div className="text-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div></div>
              ) : studentCompletions.length > 0 ? (
                <div>
                  {(() => {
                    const completedStudents = studentCompletions.filter(s => s.completionPercentage >= 80);
                    if (completedStudents.length === 0) return <p className="text-center text-muted-foreground">No students completed yet.</p>;
                    return (
                      <div className="flex flex-wrap gap-2">
                        {completedStudents.map((student, i) => (
                          <div key={student.studentId} className="flex items-center gap-2">
                            {i === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                            <span className="text-sm font-medium text-primary">{student.studentName}</span>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              ) : <p className="text-center text-muted-foreground">No completion data</p>}
            </div>
          )}

          {(node.status === 'active' || node.status === 'completed') && (
            <div className="mb-6">
              <button
                onClick={handleMarkAsComplete}
                disabled={node.status === 'completed' || !isCompleted || isMarkingComplete}
                className={`w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 ${
                  isMarkingComplete
                    ? 'bg-muted text-muted-foreground cursor-wait'
                    : node.status === 'completed'
                      ? 'bg-primary text-primary-foreground cursor-default'
                      : isCompleted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isMarkingComplete ? 'Processing...' : node.status === 'completed' ? `${nodeUnitLabel} Completed ✓` : isCompleted ? `Mark ${nodeUnitLabel} as Complete` : 'Complete all tasks first'}
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
        title={`Confirm ${nodeUnitLabel} Completion`}
        message={`Are you sure you have completed all tasks for "${node.title}"?`}
        isLoading={isMarkingComplete}
      />
      <ConfirmationModal
        isOpen={showTaskConfirmation}
        onClose={() => setShowTaskConfirmation(false)}
        onConfirm={handleConfirmTaskCompletion}
        title="Confirm Task Completion"
        message={`Complete task "${getSelectedTask()?.title}"?`}
      />
      <ConfirmationModal
        isOpen={showTaskUncheckConfirmation}
        onClose={() => setShowTaskUncheckConfirmation(false)}
        onConfirm={handleConfirmTaskUncheck}
        title="Confirm Task Uncheck"
        message={`Mark task "${getSelectedTask()?.title}" as incomplete?`}
      />
    </>
  );
};
