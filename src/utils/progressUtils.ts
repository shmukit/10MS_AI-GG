export interface WeekCompletion {
  completed: number;
  total: number;
}

export interface ProgressMetrics {
  completedWeeks: number;
  progressPercentage: number;
  weekCompletions: Record<number, WeekCompletion>;
}

/**
 * Calculates progress metrics based on task completion data.
 * @param progressData - List of progress records for a student
 * @param allTasks - List of all relevant tasks to determine totals per week
 * @param totalWeeks - Total number of weeks in the roadmap (default 6)
 * @param completionThreshold - Percentage threshold to consider a week complete (default 0.8)
 */
export const calculateProgressMetrics = (
  progressData: { roadmap_tasks?: { roadmap_weeks?: { week_number: number } | null } | null, status: string }[],
  allTasks: { roadmap_weeks?: { week_number: number } | null }[],
  totalWeeks: number = 6,
  completionThreshold: number = 0.8
): ProgressMetrics => {
  const weekCompletions: Record<number, WeekCompletion> = {};

  // Initialize totals per week from allTasks
  allTasks.forEach(task => {
    const weekNumber = task.roadmap_weeks?.week_number;
    if (weekNumber) {
      if (!weekCompletions[weekNumber]) {
        weekCompletions[weekNumber] = { completed: 0, total: 0 };
      }
      weekCompletions[weekNumber].total++;
    }
  });

  // Count completed tasks per week from progressData
  progressData.forEach(progress => {
    const weekNumber = progress.roadmap_tasks?.roadmap_weeks?.week_number;
    if (weekNumber && weekCompletions[weekNumber] && progress.status === 'completed') {
      weekCompletions[weekNumber].completed++;
    }
  });

  // Calculate completed weeks based on threshold
  const completedWeeksCount = Object.keys(weekCompletions)
    .map(Number)
    .filter(weekNumber => {
      const weekData = weekCompletions[weekNumber];
      return weekData.total > 0 && (weekData.completed / weekData.total) >= completionThreshold;
    })
    .length;

  const progressPercentage = Math.min(100, (completedWeeksCount / totalWeeks) * 100);

  return {
    completedWeeks: completedWeeksCount,
    progressPercentage,
    weekCompletions
  };
};
