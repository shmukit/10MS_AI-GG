import { supabase } from '../../lib/supabase';
import { StudentProgress } from '../../types/models';
import { getRoadmapTasks } from './roadmapService';

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

        return data || [];
    } catch (error) {
        console.error('Error in getStudentProgress:', error);
        return [];
    }
};

export const updateTaskProgress = async (
    userId: string,
    taskId: string,
    status: StudentProgress['status'],
    score?: number,
    feedback?: string
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('student_progress')
            .upsert({
                student_id: userId,
                task_id: taskId,
                status,
                score,
                feedback,
                completed_at: status === 'completed' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            } as unknown as never);

        if (error) {
            console.error('Error updating task progress:', error);
            return false;
        }

        // Award XP if completed
        if (status === 'completed') {
            const { data: assignments } = await supabase
                .from('student_batch_assignments')
                .select('batch_id')
                .eq('student_id', userId)
                .eq('status', 'active');

            if (assignments && assignments.length > 0) {
                const { awardTaskCompletionXP } = await import('./gamificationService');
                // Award for each active batch (usually just one)
                for (const assignment of (assignments as any[])) {
                    await awardTaskCompletionXP(userId, assignment.batch_id);
                }
            }
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

        // First, get all tasks for this week
        const weekTasks = await getRoadmapTasks(weekId);
        console.log('📋 Found tasks for week:', weekTasks.length, weekTasks);

        // Mark all tasks as completed for this user
        for (const task of weekTasks) {
            console.log('✅ Marking task as completed:', task.id, task.task_name);

            const { error } = await supabase
                .from('student_progress')
                .upsert({
                    student_id: userId,
                    task_id: task.id,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } as unknown as never);

            if (error) {
                console.error('❌ Error updating task progress:', error);
                return false;
            }

            console.log('✅ Successfully marked task as completed:', task.id);
        }

        console.log('🎉 All tasks for week marked as completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Error in markWeekAsComplete:', error);
        return false;
    }
};

export const getWeekCompletionStats = async (weekId: string, batchId: string): Promise<{
    totalStudents: number;
    completedStudents: number;
    completionPercentage: number;
    completedStudentNames: string[];
}> => {
    try {
        // Get all students in the batch
        const { data: batchStudents, error: batchError } = await supabase
            .from('student_batch_assignments')
            .select(`
        student_id,
        users!inner(first_name, last_name)
      `)
            .eq('batch_id', batchId)
            .eq('status', 'active');

        if (batchError) {
            console.error('Error fetching batch students:', batchError);
            return {
                totalStudents: 0,
                completedStudents: 0,
                completionPercentage: 0,
                completedStudentNames: []
            };
        }

        // Cast to expected type since Supabase types might not infer the join correctly
        type BatchStudent = {
            student_id: string;
            users: {
                first_name: string;
                last_name: string;
            }
        };

        const students = (batchStudents || []) as unknown as BatchStudent[];

        if (students.length === 0) {
            return {
                totalStudents: 0,
                completedStudents: 0,
                completionPercentage: 0,
                completedStudentNames: []
            };
        }

        const totalStudents = students.length;
        const studentIds = students.map(s => s.student_id);

        // Get all tasks for this week
        const weekTasks = await getRoadmapTasks(weekId);
        if (weekTasks.length === 0) {
            return {
                totalStudents,
                completedStudents: 0,
                completionPercentage: 0,
                completedStudentNames: []
            };
        }

        // Get progress for all students in this batch for this week's tasks
        const { data: progressData, error: progressError } = await supabase
            .from('student_progress')
            .select(`
        student_id,
        task_id,
        status
      `)
            .in('student_id', studentIds)
            .in('task_id', weekTasks.map(t => t.id));

        if (progressError) {
            console.error('Error fetching progress data:', progressError);
            return {
                totalStudents,
                completedStudents: 0,
                completionPercentage: 0,
                completedStudentNames: []
            };
        }

        // Calculate completion for each student
        const studentCompletion = new Map<string, { completed: number; total: number; name: string }>();

        // Initialize all students
        students.forEach(student => {
            studentCompletion.set(student.student_id, {
                completed: 0,
                total: weekTasks.length,
                name: `${student.users.first_name} ${student.users.last_name}`.trim()
            });
        });

        // Count completed tasks for each student
        const progressList = (progressData || []) as unknown as StudentProgress[];
        progressList.forEach(progress => {
            if (progress.status === 'completed') {
                const student = studentCompletion.get(progress.student_id);
                if (student) {
                    student.completed++;
                }
            }
        });

        // Find students who completed all tasks
        const completedStudents = Array.from(studentCompletion.values())
            .filter(student => student.completed === student.total);


        const completedStudentNames = completedStudents
            .map(student => student.name)
            .sort(); // Sort alphabetically

        const completionPercentage = totalStudents > 0 ? (completedStudents.length / totalStudents) * 100 : 0;

        return {
            totalStudents,
            completedStudents: completedStudents.length,
            completionPercentage,
            completedStudentNames
        };
    } catch (error) {
        console.error('Error in getWeekCompletionStats:', error);
        return {
            totalStudents: 0,
            completedStudents: 0,
            completionPercentage: 0,
            completedStudentNames: []
        };
    }
};

export const getWeekStudentCompletionDetails = async (weekId: string, batchId: string): Promise<{
    studentId: string;
    studentName: string;
    completedTasks: number;
    totalTasks: number;
    completionPercentage: number;
    completedTaskNames: string[];
    lastCompletedAt?: string;
}[]> => {
    try {
        // Get all students in the batch
        const { data: batchStudents, error: batchError } = await supabase
            .from('student_batch_assignments')
            .select(`
        student_id,
        users!inner(first_name, last_name)
      `)
            .eq('batch_id', batchId)
            .eq('status', 'active');

        if (batchError) {
            console.error('Error fetching batch students:', batchError);
            return [];
        }

        // Cast to expected type since Supabase types might not infer the join correctly
        type BatchStudent = {
            student_id: string;
            users: {
                first_name: string;
                last_name: string;
            }
        };

        const students = (batchStudents || []) as unknown as BatchStudent[];

        // Get all tasks for this week
        const weekTasks = await getRoadmapTasks(weekId);
        if (weekTasks.length === 0) {
            return [];
        }

        const studentIds = students.map(s => s.student_id);
        const taskIds = weekTasks.map(t => t.id);

        // Get progress for all students in this batch for this week's tasks
        const { data: progressData, error: progressError } = await supabase
            .from('student_progress')
            .select(`
        student_id,
        task_id,
        status,
        completed_at
      `)
            .in('student_id', studentIds)
            .in('task_id', taskIds);

        const progress = (progressData || []) as unknown as StudentProgress[];

        if (progressError) {
            console.error('Error fetching progress data:', progressError);
            return [];
        }

        // Calculate completion for each student
        const studentDetails = students.map(batchStudent => {
            const studentId = batchStudent.student_id;
            const studentName = `${batchStudent.users.first_name} ${batchStudent.users.last_name}`.trim();

            // Get completed tasks for this student
            const studentProgress = progress.filter(p =>
                p.student_id === studentId && p.status === 'completed'
            ) || [];

            const completedTasks = studentProgress.length;
            const totalTasks = weekTasks.length;
            const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            // Get completed task names
            const completedTaskNames = studentProgress
                .map(p => {
                    const task = weekTasks.find(t => t.id === p.task_id);
                    return task ? task.task_name : 'Task Completed';
                }) // Map task IDs to names
                .sort();

            // Get last completion time
            const lastCompletedAt = studentProgress.length > 0
                ? Math.max(...studentProgress.map(p => p.completed_at ? new Date(p.completed_at).getTime() : 0))
                : undefined;

            return {
                studentId,
                studentName,
                completedTasks,
                totalTasks,
                completionPercentage,
                completedTaskNames,
                lastCompletedAt: lastCompletedAt ? new Date(lastCompletedAt).toISOString() : undefined
            };
        });

        // Sort by completion percentage (highest first), then by last completed time
        return studentDetails.sort((a, b) => {
            if (a.completionPercentage !== b.completionPercentage) {
                return b.completionPercentage - a.completionPercentage;
            }
            if (a.lastCompletedAt && b.lastCompletedAt) {
                return new Date(b.lastCompletedAt).getTime() - new Date(a.lastCompletedAt).getTime();
            }
            return 0;
        });
    } catch (error) {
        console.error('Error in getWeekStudentCompletionDetails:', error);
        return [];
    }
};
