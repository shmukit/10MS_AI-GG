import { useEffect } from 'react';
import { posthog } from '../../../lib/posthog';

interface DashboardTrackingProps {
  user: { id: string } | null;
  selectedBatchId: string;
  currentRoadmapId?: string;
  studentProgress?: { is_active: boolean; is_completed: boolean; week_number: number; completion_percentage?: number }[];
  currentWeekTasks?: { id: string; task_name: string; deadline: string; completed: boolean }[];
}

/**
 * Custom hook to handle PostHog analytics tracking for the Student Dashboard.
 */
export const useDashboardTracking = ({
  user,
  selectedBatchId,
  currentRoadmapId,
  studentProgress,
  currentWeekTasks
}: DashboardTrackingProps) => {
  
  // Track page view and DAU
  useEffect(() => {
    if (user?.id) {
      posthog?.capture('student_dashboard_view', {
        user_id: user.id,
        batch_id: selectedBatchId,
        roadmap_id: currentRoadmapId
      });

      posthog?.capture('$pageview', {
        page: 'student_dashboard',
        user_id: user.id
      });
    }
  }, [user?.id, selectedBatchId, currentRoadmapId]);

  // Track week completion
  useEffect(() => {
    if (studentProgress && user?.id) {
      const currentWeek = studentProgress.find((p: any) => p.is_active);

      if (currentWeek && currentWeek.is_completed) {
        posthog?.capture('week_completed', {
          user_id: user.id,
          week_number: currentWeek.week_number,
          roadmap_id: currentRoadmapId,
          batch_id: selectedBatchId,
          completed_at: new Date().toISOString(),
          completion_percentage: currentWeek.completion_percentage || 100
        });
      }
    }
  }, [studentProgress, user?.id, selectedBatchId, currentRoadmapId]);

  // Track overdue tasks
  useEffect(() => {
    if (currentWeekTasks && user?.id) {
      const currentDate = new Date();
      const overdueTasks = currentWeekTasks.filter((task: any) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return deadline < currentDate && !task.completed;
      });

      if (overdueTasks.length > 0) {
        posthog?.capture('task_overdue', {
          user_id: user.id,
          overdue_count: overdueTasks.length,
          overdue_tasks: overdueTasks.map((task: any) => ({
            task_id: task.id,
            task_name: task.task_name,
            deadline: task.deadline,
            days_overdue: Math.ceil((currentDate.getTime() - new Date(task.deadline).getTime()) / (1000 * 60 * 60 * 24))
          })),
          roadmap_id: currentRoadmapId,
          batch_id: selectedBatchId,
          detected_at: new Date().toISOString()
        });
      }
    }
  }, [currentWeekTasks, user?.id, selectedBatchId, currentRoadmapId]);
};
