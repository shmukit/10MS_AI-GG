import type { RoadmapTask } from '../../../services/database';

export function transformTasksWithBatchDeadlines(
  allTasks: any[],
  batchId: string | null
): RoadmapTask[] {
  return allTasks.map((task: any) => {
    let finalDeadline = task.deadline;
    if (batchId && task.batch_task_deadlines) {
      const deadlines = Array.isArray(task.batch_task_deadlines)
        ? task.batch_task_deadlines
        : [task.batch_task_deadlines];
      const batchSpecific = deadlines.find((d: any) => d.batch_id === batchId);
      if (batchSpecific?.deadline) finalDeadline = batchSpecific.deadline;
    }
    return { ...task, deadline: finalDeadline };
  });
}
