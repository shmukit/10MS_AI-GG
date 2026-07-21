import { supabase } from '../../../../../lib/supabase';
import { RoadmapItem } from '../../../../../types/mentor';
import type { NewTaskForm } from './types';

export async function insertRoadmapTask(weekId: string, task: NewTaskForm) {
    return (supabase.from('roadmap_tasks') as any)
        .insert([{
            week_id: weekId,
            task_name: task.taskName,
            task_details: task.taskDetails,
            task_type: task.taskType.toLowerCase(),
            relevant_links: task.relevantLinks ? [task.relevantLinks] : [],
            deadline: task.deadline || null,
            meeting_time: task.meetingTime || null,
            is_active: true,
            domain: task.domain || 'General',
        }])
        .select()
        .single();
}

export async function updateRoadmapTaskInDb(
    taskId: string,
    weekId: string,
    task: RoadmapItem & { meetingTime?: string }
) {
    return (supabase.from('roadmap_tasks') as any)
        .update({
            week_id: weekId,
            task_name: task.taskName,
            task_details: task.taskDetails,
            task_type: task.taskType.toLowerCase(),
            relevant_links: task.relevantLinks ? [task.relevantLinks] : [],
            deadline: task.deadline || null,
            meeting_time: task.meetingTime || null,
            domain: task.domain,
        })
        .eq('id', taskId)
        .select()
        .single();
}

export async function upsertBatchTaskDeadline(
    batchId: string,
    taskId: string,
    deadline: string | null
) {
    return (supabase.from('batch_task_deadlines') as any)
        .upsert({
            batch_id: batchId,
            task_id: taskId,
            deadline,
        }, {
            onConflict: 'batch_id,task_id',
        });
}

export async function deleteRoadmapTaskFromDb(taskId: string) {
    return supabase
        .from('roadmap_tasks')
        .delete()
        .eq('id', taskId);
}

export function mapDbTaskToRoadmapItem(data: any, weekNumber: number, domain: string): RoadmapItem {
    return {
        id: data.id,
        weekNumber,
        domain,
        taskType: data.task_type,
        taskName: data.task_name,
        taskDetails: data.task_details,
        relevantLinks: data.relevant_links?.[0] || '',
        deadline: data.deadline,
        meetingTime: data.meeting_time,
    };
}
