import { supabase } from '../../lib/supabase';
import { getRoadmapWeeks } from './roadmapService';

// Threshold for unlocking next week (e.g., 80% task completion)
const UNLOCK_THRESHOLD_PERCENT = 80;

export interface WeekStatus {
    weekId: string;
    weekNumber: number;
    isUnlocked: boolean;
    isCompleted: boolean;
    completionPercentage: number;
}

/**
 * Calculates the current unlocking status for all weeks in a roadmap for a specific student.
 * This is the core "TaRL" (Teaching at the Right Level) logic.
 */
export const calculateStudentLevel = async (
    userId: string,
    roadmapId: string
): Promise<{ currentLevel: number; weekStatuses: WeekStatus[] }> => {
    try {
        const weeks = await getRoadmapWeeks(roadmapId);
        if (!weeks.length) return { currentLevel: 1, weekStatuses: [] };

        const weekStatuses: WeekStatus[] = [];
        let currentLevel = 1;

        // Fetch all progress for this user
        const { data: progressData } = await supabase
            .from('student_progress')
            .select('task_id, status')
            .eq('student_id', userId)
            .eq('status', 'completed');

        const completedTaskIds = new Set(progressData?.map((p: any) => p.task_id) || []);

        // Fetch all tasks for this roadmap in one go to avoid N+1 queries
        const weekIds = weeks.map(w => w.id);
        const { data: allRoadmapTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select('id, week_id, is_required')
            .in('week_id', weekIds);

        if (tasksError) {
            console.error('Error fetching roadmap tasks:', tasksError);
            return { currentLevel: 1, weekStatuses: [] };
        }

        const tasksByWeek = new Map<string, any[]>();
        (allRoadmapTasks as any[])?.forEach(task => {
            const weekTasks = tasksByWeek.get(task.week_id) || [];
            weekTasks.push(task);
            tasksByWeek.set(task.week_id, weekTasks);
        });

        // Iterate weeks sequentially
        for (let i = 0; i < weeks.length; i++) {
            const week = weeks[i];
            const isFirstWeek = i === 0;

            // Check previous week completion
            const prevWeekCompleted = isFirstWeek ? true : weekStatuses[i - 1].isCompleted;

            // Unlock logic: previous week must be completed
            const isUnlocked = prevWeekCompleted;

            // Calculate completion for THIS week using pre-fetched tasks
            const weekTasks = tasksByWeek.get(week.id) || [];
            const requiredTasks = weekTasks.filter((t: any) => t.is_required);
            const totalRequired = requiredTasks.length;

            let isCompleted = false;
            let percentObj = 0;

            if (totalRequired === 0) {
                isCompleted = true;
                percentObj = 100;
            } else {
                const completedCount = requiredTasks.filter((t: any) => completedTaskIds.has(t.id)).length;
                percentObj = (completedCount / totalRequired) * 100;
                isCompleted = percentObj >= UNLOCK_THRESHOLD_PERCENT;
            }

            if (isUnlocked && !isCompleted) {
                currentLevel = week.week_number;
            }

            weekStatuses.push({
                weekId: week.id,
                weekNumber: week.week_number,
                isUnlocked,
                isCompleted,
                completionPercentage: Math.round(percentObj)
            });
        }

        // If all weeks completed, level is last week + 1 (or finished)
        if (weekStatuses.every(w => w.isCompleted)) {
            currentLevel = weeks.length + 1;
        }

        return { currentLevel, weekStatuses };

    } catch (error) {
        console.error('Error calculating TaRL level:', error);
        return { currentLevel: 1, weekStatuses: [] };
    }
};

/**
 * Returns the "Current Week" number for a student.
 */
export const getCurrentLevel = async (userId: string, roadmapId: string): Promise<number> => {
    const { currentLevel } = await calculateStudentLevel(userId, roadmapId);
    return currentLevel;
};
