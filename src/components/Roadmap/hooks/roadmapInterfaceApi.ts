import { DatabaseService, RoadmapWeek } from '../../../services/database';
import { supabase } from '../../../lib/supabase';
import { transformTasksWithBatchDeadlines } from './roadmapTaskTransform';

export async function fetchStudentProgress(studentId: string) {
  const { data } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', studentId);

  return data || [];
}

export async function fetchRoadmapTasksForWeeks(weekIds: string[], batchId: string | null) {
  const { data: allTasks, error: tasksError } = await supabase
    .from('roadmap_tasks')
    .select(`*, batch_task_deadlines!left(deadline, batch_id)`)
    .in('week_id', weekIds)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (tasksError || !allTasks) {
    return [];
  }

  return transformTasksWithBatchDeadlines(allTasks, batchId);
}

export async function fetchWeekCompletionStats(weeks: RoadmapWeek[], batchId: string) {
  const stats: { [weekId: string]: any } = {};

  for (const week of weeks) {
    const weekStats = await DatabaseService.getWeekCompletionStats(week.id, batchId);
    stats[week.id] = weekStats;
  }

  return stats;
}
