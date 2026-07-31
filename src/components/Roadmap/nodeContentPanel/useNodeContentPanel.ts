import { useState, useEffect, useCallback, useMemo } from 'react';
import { DatabaseService } from '../../../services/database';
import { useAuth } from '../../../lib/useAuth';
import { posthog } from '../../../lib/posthog';
import { useToast } from '../../ui/ToastProvider';
import type { RoadmapNodeData } from '../RoadmapNode';
import type { StudentCompletion } from './types';

interface UseNodeContentPanelParams {
  node: RoadmapNodeData;
  onRefresh?: () => void;
  batchId?: string;
}

export function useNodeContentPanel({ node, onRefresh, batchId }: UseNodeContentPanelParams) {
  const [completedTasks, setCompletedTasks] = useState(node.tasks.map((t) => t.completed));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTaskConfirmation, setShowTaskConfirmation] = useState(false);
  const [showTaskUncheckConfirmation, setShowTaskUncheckConfirmation] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(-1);
  const [detailTaskIndex, setDetailTaskIndex] = useState<number>(-1);
  const [isCompletingFromModal, setIsCompletingFromModal] = useState(false);
  const [studentCompletions, setStudentCompletions] = useState<StudentCompletion[]>([]);
  const [loadingCompletions, setLoadingCompletions] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { databaseUserId } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    setCompletedTasks(node.tasks.map((t) => t.completed));
  }, [node.tasks]);

  const fetchStudentCompletions = useCallback(async () => {
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
  }, [batchId, node.id]);

  useEffect(() => {
    if (batchId && node.id) {
      fetchStudentCompletions();
    }
  }, [batchId, node.id, fetchStudentCompletions]);

  const completionRate = completedTasks.filter(Boolean).length / completedTasks.length;
  const isCompleted = completionRate === 1;

  const getSelectedTask = useCallback(() => {
    if (selectedTaskIndex >= 0 && selectedTaskIndex < node.tasks.length) {
      return node.tasks[selectedTaskIndex];
    }
    return null;
  }, [node.tasks, selectedTaskIndex]);

  const toggleTaskCompletion = useCallback((taskIndex: number) => {
    if (node.status === 'completed') return;

    if (!completedTasks[taskIndex]) {
      setSelectedTaskIndex(taskIndex);
      setShowTaskConfirmation(true);
    } else {
      setSelectedTaskIndex(taskIndex);
      setShowTaskUncheckConfirmation(true);
    }
  }, [completedTasks, node.status]);

  const handleConfirmTaskCompletion = useCallback(async () => {
    if (selectedTaskIndex < 0) return;

    if (!databaseUserId) {
      toastError('User ID missing. Please log in again.');
      setShowTaskConfirmation(false);
      setSelectedTaskIndex(-1);
      return;
    }

    const taskIndex = selectedTaskIndex;
    const task = node.tasks[taskIndex];

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
          roadmap_id: node.id,
        });

        setCompletedTasks((prev) => {
          const newCompleted = [...prev];
          newCompleted[taskIndex] = true;
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
  }, [databaseUserId, node.id, node.tasks, onRefresh, selectedTaskIndex, toastError]);

  const handleConfirmTaskUncheck = useCallback(async () => {
    if (selectedTaskIndex < 0) return;

    if (!databaseUserId) {
      toastError('User ID missing. Please log in again.');
      setShowTaskUncheckConfirmation(false);
      setSelectedTaskIndex(-1);
      return;
    }

    const taskIndex = selectedTaskIndex;
    const task = node.tasks[taskIndex];

    try {
      const success = await DatabaseService.updateTaskProgress(
        databaseUserId,
        task.id,
        'not_started'
      );

      if (success) {
        setCompletedTasks((prev) => {
          const newCompleted = [...prev];
          newCompleted[taskIndex] = false;
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
  }, [databaseUserId, node.tasks, onRefresh, selectedTaskIndex, toastError]);

  const handleMarkAsComplete = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleConfirmCompletion = useCallback(async () => {
    if (isMarkingComplete) return;

    setIsMarkingComplete(true);
    try {
      if (!databaseUserId) {
        toastError('User ID missing. Please log in again.');
        return;
      }

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
  }, [databaseUserId, isMarkingComplete, node.id, onRefresh, toastError, toastSuccess]);

  const openTaskDetail = useCallback((index: number) => {
    setDetailTaskIndex(index);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setDetailTaskIndex(-1);
  }, []);

  const handleCompleteFromModal = useCallback(async () => {
    if (detailTaskIndex < 0) return;
    if (node.status === 'locked' || node.status === 'completed') return;
    if (completedTasks[detailTaskIndex]) return;
    if (!databaseUserId) {
      toastError('User ID missing. Please log in again.');
      return;
    }

    const taskIndex = detailTaskIndex;
    const task = node.tasks[taskIndex];
    setIsCompletingFromModal(true);
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
          roadmap_id: node.id,
          source: 'task_detail_modal',
        });
        setCompletedTasks((prev) => {
          const next = [...prev];
          next[taskIndex] = true;
          return next;
        });
        if (onRefresh) onRefresh();
      } else {
        toastError('Failed to mark task as completed. Please try again.');
      }
    } catch (error) {
      console.error('Error marking task as completed:', error);
      toastError('Error marking task as completed. Please try again.');
    } finally {
      setIsCompletingFromModal(false);
    }
  }, [completedTasks, databaseUserId, detailTaskIndex, node.id, node.status, node.tasks, onRefresh, toastError]);

  const detailTask = useMemo(
    () =>
      detailTaskIndex >= 0 && detailTaskIndex < node.tasks.length
        ? {
            ...node.tasks[detailTaskIndex],
            completed: completedTasks[detailTaskIndex],
          }
        : null,
    [completedTasks, detailTaskIndex, node.tasks]
  );

  return {
    completedTasks,
    showConfirmation,
    setShowConfirmation,
    showTaskConfirmation,
    setShowTaskConfirmation,
    showTaskUncheckConfirmation,
    setShowTaskUncheckConfirmation,
    detailTaskIndex,
    setDetailTaskIndex,
    isCompletingFromModal,
    studentCompletions,
    loadingCompletions,
    isMarkingComplete,
    completionRate,
    isCompleted,
    getSelectedTask,
    toggleTaskCompletion,
    handleConfirmTaskCompletion,
    handleConfirmTaskUncheck,
    handleMarkAsComplete,
    handleConfirmCompletion,
    openTaskDetail,
    closeTaskDetail,
    handleCompleteFromModal,
    detailTask,
  };
}
