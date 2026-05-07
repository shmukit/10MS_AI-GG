import { supabase } from '../lib/supabase';
import { calculateProgressMetrics } from '../utils/progressUtils';

export interface ProgressSyncResult {
  success: boolean;
  updatedWeeks: number;
  updatedPercentage: number;
  errors: string[];
}

interface ProgressWithRoadmap {
  status: string;
  roadmap_tasks: {
    week_id: string;
    roadmap_weeks: {
      week_number: number;
    };
  } | null;
}

export class ProgressSyncService {
  /**
   * Synchronize student progress across all data sources
   */
  static async syncStudentProgress(userId: string): Promise<ProgressSyncResult> {
    const errors: string[] = [];

    try {
      console.log('🔄 Starting progress sync for user:', userId);

      const progressData = await this.fetchUserProgress(userId, errors);
      if (errors.length > 0 || !progressData) {
        return { success: false, updatedWeeks: 0, updatedPercentage: 0, errors };
      }

      const allTasks = await this.fetchRelevantTasks(progressData, errors);
      if (errors.length > 0 || !allTasks) {
        return { success: false, updatedWeeks: 0, updatedPercentage: 0, errors };
      }

      const { completedWeeks, progressPercentage } = calculateProgressMetrics(progressData, allTasks);

      await this.updateProfileAndAssignments(userId, completedWeeks, progressPercentage, errors);

      return {
        success: errors.length === 0,
        updatedWeeks: completedWeeks,
        updatedPercentage: progressPercentage,
        errors
      };

    } catch (error) {
      console.error('❌ Error in syncStudentProgress:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, updatedWeeks: 0, updatedPercentage: 0, errors };
    }
  }

  private static async fetchUserProgress(userId: string, errors: string[]): Promise<ProgressWithRoadmap[] | null> {
    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        status,
        roadmap_tasks (
          week_id,
          roadmap_weeks (
            week_number
          )
        )
      `)
      .eq('student_id', userId)
      .eq('status', 'completed');

    if (error) {
      errors.push(`Error fetching progress: ${error.message}`);
      return null;
    }
    return (data as unknown) as ProgressWithRoadmap[];
  }

  private static async fetchRelevantTasks(progressData: ProgressWithRoadmap[], errors: string[]) {
    const weekIds = [...new Set(progressData.map(p => p.roadmap_tasks?.week_id).filter(Boolean))];
    if (weekIds.length === 0) return [];

    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select(`
        id,
        week_id,
        roadmap_weeks (
          week_number
        )
      `)
      .in('week_id', weekIds);

    if (error) {
      errors.push(`Error fetching tasks: ${error.message}`);
      return null;
    }
    return data;
  }

  private static async updateProfileAndAssignments(userId: string, weeks: number, percentage: number, errors: string[]) {
    const updateData = {
      completed_weeks: weeks,
      progress_percentage: percentage,
      updated_at: new Date().toISOString()
    };

    // Use unknown cast to bypass strict Supabase update types without using 'any'
    const [profileRes, assignmentRes] = await Promise.all([
      supabase.from('student_profiles').update(updateData as unknown as never).eq('user_id', userId),
      supabase.from('student_batch_assignments').update(updateData as unknown as never).eq('student_id', userId).eq('status', 'active')
    ]);

    if (profileRes.error) errors.push(`Error updating profile: ${profileRes.error.message}`);
    if (assignmentRes.error) errors.push(`Error updating batch assignment: ${assignmentRes.error.message}`);
  }

  /**
   * Sync progress for all students in a batch with parallel execution
   */
  static async syncBatchProgress(batchId: string): Promise<{ success: boolean; syncedStudents: number; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      console.log('🔄 Starting batch progress sync for batch:', batchId);

      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('student_id')
        .eq('batch_id', batchId)
        .eq('status', 'active');

      if (assignmentError) {
        errors.push(`Error fetching batch students: ${assignmentError.message}`);
        return { success: false, syncedStudents: 0, errors };
      }

      if (!assignments || assignments.length === 0) return { success: true, syncedStudents: 0, errors };

      const activeAssignments = assignments as { student_id: string | null }[];

      // Use Promise.all for parallel processing
      const results = await Promise.all(
        activeAssignments
          .filter(a => a.student_id)
          .map(a => this.syncStudentProgress(a.student_id!))
      );

      const syncedStudents = results.filter(r => r.success).length;
      results.forEach(r => !r.success && errors.push(...r.errors));

      console.log(`✅ Synced progress for ${syncedStudents}/${assignments.length} students`);
      return { success: errors.length === 0, syncedStudents, errors };

    } catch (error) {
      console.error('❌ Error in syncBatchProgress:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, syncedStudents: 0, errors };
    }
  }

  /**
   * Sync progress for all students in the system
   */
  static async syncAllProgress(): Promise<{ success: boolean; syncedStudents: number; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      console.log('🔄 Starting system-wide progress sync');

      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('student_id')
        .eq('status', 'active');

      if (assignmentError) {
        errors.push(`Error fetching all students: ${assignmentError.message}`);
        return { success: false, syncedStudents: 0, errors };
      }

      if (!assignments || assignments.length === 0) return { success: true, syncedStudents: 0, errors };

      const activeAssignments = assignments as { student_id: string | null }[];

      // Process in smaller chunks to avoid overwhelming the database/rate limits
      const chunkSize = 10;
      let syncedCount = 0;

      for (let i = 0; i < activeAssignments.length; i += chunkSize) {
        const chunk = activeAssignments.slice(i, i + chunkSize);
        const results = await Promise.all(
          chunk
            .filter(a => a.student_id)
            .map(a => this.syncStudentProgress(a.student_id!))
        );
        syncedCount += results.filter(r => r.success).length;
        results.forEach(r => !r.success && errors.push(...r.errors));
      }

      console.log(`✅ Synced progress for ${syncedCount}/${assignments.length} students`);
      return { success: errors.length === 0, syncedStudents: syncedCount, errors };

    } catch (error) {
      console.error('❌ Error in syncAllProgress:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, syncedStudents: 0, errors };
    }
  }

  /**
   * Get detailed progress report for a student
   */
  static async getStudentProgressReport(userId: string) {
    try {
      const [profileRes, assignmentRes, progressRes] = await Promise.all([
        supabase.from('student_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('student_batch_assignments').select('*').eq('student_id', userId).eq('status', 'active'),
        supabase.from('student_progress').select(`
          status,
          roadmap_tasks (
            week_id,
            roadmap_weeks (
              week_number
            )
          )
        `).eq('student_id', userId)
      ]);

      if (profileRes.error || assignmentRes.error || progressRes.error) {
        console.error('Error fetching progress report data');
        return null;
      }

      const progressData = (progressRes.data as unknown) as ProgressWithRoadmap[];
      const weekIds = [...new Set(progressData.map(p => p.roadmap_tasks?.week_id).filter(Boolean))];
      
      let allTasks: { roadmap_weeks?: { week_number: number } }[] = [];
      if (weekIds.length > 0) {
        const { data } = await supabase
          .from('roadmap_tasks')
          .select(`
            id,
            week_id,
            roadmap_weeks (
              week_number
            )
          `)
          .in('week_id', weekIds);
        allTasks = data || [];
      }

      const { completedWeeks, progressPercentage } = calculateProgressMetrics(progressData, allTasks);

      return {
        profile: profileRes.data,
        assignments: assignmentRes.data || [],
        progress: progressData,
        calculatedWeeks: completedWeeks,
        calculatedPercentage: progressPercentage
      };

    } catch (error) {
      console.error('❌ Error in getStudentProgressReport:', error);
      return null;
    }
  }
}
