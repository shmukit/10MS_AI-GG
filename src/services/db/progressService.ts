import { supabase } from '../../lib/supabase';
import { StudentProgress } from '../../types/models';
import { getRoadmapTasks } from './roadmapService';
import { getBatchStudents } from './batchService';

export const getStudentProgress = async (userId: string): Promise<StudentProgress[]> => {
    try {
        const { data, error } = await supabase
            .from('student_progress')
            .select('*')
            .eq('student_id', userId);

        if (error) {
            console.error('Error fetching student progress:', error);
            return [];
        }

        return (data as StudentProgress[]) || [];
    } catch (error) {
        console.error('Error in getStudentProgress:', error);
        return [];
    }
};

interface ProgressUpsert {
    student_id: string;
    task_id: string;
    status: StudentProgress['status'];
    score?: number;
    feedback?: string;
    completed_at: string | null;
    updated_at: string;
}

export const updateTaskProgress = async (
    userId: string,
    taskId: string,
    status: StudentProgress['status'],
    score?: number,
    feedback?: string
): Promise<boolean> => {
    try {
        const upsertData: ProgressUpsert = {
            student_id: userId,
            task_id: taskId,
            status,
            score,
            feedback,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('student_progress')
            .upsert(upsertData as unknown as never);

        if (error) {
            console.error('Error updating task progress:', error);
            return false;
        }

        // Award XP and sync progress if completed
        if (status === 'completed') {
            const { data: assignments } = await supabase
                .from('student_batch_assignments')
                .select('batch_id')
                .eq('student_id', userId)
                .eq('status', 'active');

            if (assignments && assignments.length > 0) {
                const { awardTaskCompletionXP } = await import('./gamificationService');
                // Parallelize XP awarding and filter out null batch_ids
                const activeAssignments = assignments as { batch_id: string | null }[];
                await Promise.all(
                    activeAssignments
                        .filter(a => a.batch_id)
                        .map(a => awardTaskCompletionXP(userId, a.batch_id!))
                );
            }

            // Sync progress to student_profiles and student_batch_assignments
            const { ProgressSyncService } = await import('../progressSync');
            await ProgressSyncService.syncStudentProgress(userId);
        }

        return true;
    } catch (error) {
        console.error('Error in updateTaskProgress:', error);
        return false;
    }
};

export const markWeekAsComplete = async (
    userId: string,
    weekId: string
): Promise<boolean> => {
    try {
        console.log('🔄 Starting markWeekAsComplete for user:', userId, 'week:', weekId);

        const weekTasks = await getRoadmapTasks(weekId);
        if (weekTasks.length === 0) return true;

        // Parallelize task completion updates
        const now = new Date().toISOString();
        const results = await Promise.all(weekTasks.map(task => {
            const upsertData: ProgressUpsert = {
                student_id: userId,
                task_id: task.id,
                status: 'completed',
                completed_at: now,
                updated_at: now
            };
            return supabase.from('student_progress').upsert(upsertData as unknown as never);
        }));

        const hasError = results.some(r => r.error);
        if (hasError) {
            console.error('❌ Errors updating task progress in markWeekAsComplete');
            return false;
        }

        const { ProgressSyncService } = await import('../progressSync');
        await ProgressSyncService.syncStudentProgress(userId);

        console.log('🎉 All tasks for week marked as completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Error in markWeekAsComplete:', error);
        return false;
    }
};

export const checkTasksCompletionStatus = async (
    weekId: string,
    userId: string
): Promise<boolean> => {
    try {
        const weekTasks = await getRoadmapTasks(weekId);
        if (weekTasks.length === 0) return true;

        const { data: progress } = await supabase
            .from('student_progress')
            .select('task_id, status')
            .eq('student_id', userId)
            .in('task_id', weekTasks.map(t => t.id));

        const progressList = (progress as StudentProgress[]) || [];
        const completedTaskIds = new Set(
            progressList.filter(p => p.status === 'completed').map(p => p.task_id)
        );

        return weekTasks.every(t => completedTaskIds.has(t.id));
    } catch (error) {
        console.error('Error in checkTasksCompletionStatus:', error);
        return false;
    }
};

export const getWeekCompletionStats = async (weekId: string, batchId: string) => {
    try {
        const students = await getBatchStudents(batchId);
        if (students.length === 0) {
            return { totalStudents: 0, completedStudents: 0, completionPercentage: 0, completedStudentNames: [] };
        }

        const weekTasks = await getRoadmapTasks(weekId);
        if (weekTasks.length === 0) {
            return { totalStudents: students.length, completedStudents: 0, completionPercentage: 0, completedStudentNames: [] };
        }

        const studentIds = students.map(s => s.student_id);
        const { data: progressData } = await supabase
            .from('student_progress')
            .select('student_id, task_id, status')
            .in('student_id', studentIds)
            .in('task_id', weekTasks.map(t => t.id));

        const progressList = (progressData as StudentProgress[]) || [];
        const studentCompletion = new Map<string, { completed: number; total: number; name: string }>();

        students.forEach(s => {
            studentCompletion.set(s.student_id, {
                completed: 0,
                total: weekTasks.length,
                name: `${s.users.first_name} ${s.users.last_name}`.trim()
            });
        });

        progressList.forEach(p => {
            if (p.status === 'completed') {
                const s = studentCompletion.get(p.student_id);
                if (s) s.completed++;
            }
        });

        const completedStudents = Array.from(studentCompletion.values())
            .filter(s => s.completed === s.total);

        return {
            totalStudents: students.length,
            completedStudents: completedStudents.length,
            completionPercentage: (completedStudents.length / students.length) * 100,
            completedStudentNames: completedStudents.map(s => s.name).sort()
        };
    } catch (error) {
        console.error('Error in getWeekCompletionStats:', error);
        return { totalStudents: 0, completedStudents: 0, completionPercentage: 0, completedStudentNames: [] };
    }
};

export const getWeekStudentCompletionDetails = async (weekId: string, batchId: string) => {
    try {
        const students = await getBatchStudents(batchId);
        const weekTasks = await getRoadmapTasks(weekId);
        if (students.length === 0 || weekTasks.length === 0) return [];

        const studentIds = students.map(s => s.student_id);
        const taskIds = weekTasks.map(t => t.id);

        const { data: progressData } = await supabase
            .from('student_progress')
            .select('student_id, task_id, status, completed_at')
            .in('student_id', studentIds)
            .in('task_id', taskIds);

        const progress = (progressData as StudentProgress[]) || [];

        const studentDetails = students.map(s => {
            const studentProgress = progress.filter(p => p.student_id === s.student_id && p.status === 'completed');
            const completedTasks = studentProgress.length;
            const totalTasks = weekTasks.length;
            
            const completedTaskNames = studentProgress
                .map(p => weekTasks.find(t => t.id === p.task_id)?.task_name || 'Task')
                .sort();

            const lastCompletedAt = studentProgress.length > 0
                ? Math.max(...studentProgress.map(p => p.completed_at ? new Date(p.completed_at).getTime() : 0))
                : undefined;

            return {
                studentId: s.student_id,
                studentName: `${s.users.first_name} ${s.users.last_name}`.trim(),
                completedTasks,
                totalTasks,
                completionPercentage: (completedTasks / totalTasks) * 100,
                completedTaskNames,
                lastCompletedAt: lastCompletedAt ? new Date(lastCompletedAt).toISOString() : undefined
            };
        });

        return studentDetails.sort((a, b) => b.completionPercentage - a.completionPercentage);
    } catch (error) {
        console.error('Error in getWeekStudentCompletionDetails:', error);
        return [];
    }
};
