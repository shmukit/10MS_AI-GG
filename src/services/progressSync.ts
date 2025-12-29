import { supabase } from '../lib/supabase';

export interface ProgressSyncResult {
  success: boolean;
  updatedWeeks: number;
  updatedPercentage: number;
  errors: string[];
}

export class ProgressSyncService {
  /**
   * Synchronize student progress across all data sources
   * This ensures consistency between student_profiles, student_batch_assignments, and student_progress
   */
  static async syncStudentProgress(userId: string): Promise<ProgressSyncResult> {
    const errors: string[] = [];
    let updatedWeeks = 0;
    let updatedPercentage = 0;

    try {
      console.log('🔄 Starting progress sync for user:', userId);

      // 1. Get all completed tasks for the user
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          *,
          roadmap_tasks (
            id,
            task_name,
            week_id,
            roadmap_weeks (
              id,
              week_number,
              roadmap_id
            )
          )
        `)
        .eq('student_id', userId)
        .eq('status', 'completed');

      if (progressError) {
        errors.push(`Error fetching progress: ${progressError.message}`);
        return { success: false, updatedWeeks: 0, updatedPercentage: 0, errors };
      }

      // 2. Group completed tasks by week
      const weekCompletions: { [weekNumber: number]: { completed: number; total: number } } = {};
      
      if (progressData && progressData.length > 0) {
        // Get all tasks for each week to calculate completion percentage
        const weekIds = [...new Set(progressData.map(p => p.roadmap_tasks?.week_id).filter(Boolean))];
        
        if (weekIds.length > 0) {
          const { data: allTasks, error: tasksError } = await supabase
            .from('roadmap_tasks')
            .select(`
              id,
              week_id,
              roadmap_weeks (
                week_number
              )
            `)
            .in('week_id', weekIds);

          if (!tasksError && allTasks) {
            // Count total tasks per week
            allTasks.forEach(task => {
              const weekNumber = task.roadmap_weeks?.week_number;
              if (weekNumber) {
                if (!weekCompletions[weekNumber]) {
                  weekCompletions[weekNumber] = { completed: 0, total: 0 };
                }
                weekCompletions[weekNumber].total++;
              }
            });

            // Count completed tasks per week
            progressData.forEach(progress => {
              const weekNumber = progress.roadmap_tasks?.roadmap_weeks?.week_number;
              if (weekNumber && weekCompletions[weekNumber]) {
                weekCompletions[weekNumber].completed++;
              }
            });
          }
        }
      }

      // 3. Calculate completed weeks (80%+ completion threshold)
      const completedWeeks = Object.keys(weekCompletions)
        .map(Number)
        .filter(weekNumber => {
          const weekData = weekCompletions[weekNumber];
          return weekData.total > 0 && (weekData.completed / weekData.total) >= 0.8;
        })
        .length;

      const progressPercentage = Math.min(100, (completedWeeks / 6) * 100); // Assuming 6 weeks total

      console.log('📊 Calculated progress:', {
        completedWeeks,
        progressPercentage,
        weekCompletions
      });

      // 4. Update student_profiles table
      const { error: profileError } = await supabase
        .from('student_profiles')
        .update({
          completed_weeks: completedWeeks,
          progress_percentage: progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) {
        errors.push(`Error updating profile: ${profileError.message}`);
      } else {
        console.log('✅ Updated student profile');
      }

      // 5. Update student_batch_assignments table
      const { error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .update({
          completed_weeks: completedWeeks,
          progress_percentage: progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', userId)
        .eq('status', 'active');

      if (assignmentError) {
        errors.push(`Error updating batch assignment: ${assignmentError.message}`);
      } else {
        console.log('✅ Updated batch assignments');
      }

      updatedWeeks = completedWeeks;
      updatedPercentage = progressPercentage;

      return {
        success: errors.length === 0,
        updatedWeeks,
        updatedPercentage,
        errors
      };

    } catch (error) {
      console.error('❌ Error in syncStudentProgress:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, updatedWeeks: 0, updatedPercentage: 0, errors };
    }
  }

  /**
   * Sync progress for all students in a batch
   */
  static async syncBatchProgress(batchId: string): Promise<{ success: boolean; syncedStudents: number; errors: string[] }> {
    const errors: string[] = [];
    let syncedStudents = 0;

    try {
      console.log('🔄 Starting batch progress sync for batch:', batchId);

      // Get all students in the batch
      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('student_id')
        .eq('batch_id', batchId)
        .eq('status', 'active');

      if (assignmentError) {
        errors.push(`Error fetching batch students: ${assignmentError.message}`);
        return { success: false, syncedStudents: 0, errors };
      }

      if (!assignments || assignments.length === 0) {
        console.log('ℹ️ No students found in batch');
        return { success: true, syncedStudents: 0, errors };
      }

      // Sync each student
      for (const assignment of assignments) {
        const result = await this.syncStudentProgress(assignment.student_id);
        if (result.success) {
          syncedStudents++;
        } else {
          errors.push(...result.errors);
        }
      }

      console.log(`✅ Synced progress for ${syncedStudents}/${assignments.length} students`);

      return {
        success: errors.length === 0,
        syncedStudents,
        errors
      };

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
    let syncedStudents = 0;

    try {
      console.log('🔄 Starting system-wide progress sync');

      // Get all active students
      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('student_id')
        .eq('status', 'active');

      if (assignmentError) {
        errors.push(`Error fetching all students: ${assignmentError.message}`);
        return { success: false, syncedStudents: 0, errors };
      }

      if (!assignments || assignments.length === 0) {
        console.log('ℹ️ No active students found');
        return { success: true, syncedStudents: 0, errors };
      }

      // Sync each student
      for (const assignment of assignments) {
        const result = await this.syncStudentProgress(assignment.student_id);
        if (result.success) {
          syncedStudents++;
        } else {
          errors.push(...result.errors);
        }
      }

      console.log(`✅ Synced progress for ${syncedStudents}/${assignments.length} students`);

      return {
        success: errors.length === 0,
        syncedStudents,
        errors
      };

    } catch (error) {
      console.error('❌ Error in syncAllProgress:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, syncedStudents: 0, errors };
    }
  }

  /**
   * Get detailed progress report for a student
   */
  static async getStudentProgressReport(userId: string): Promise<{
    profile: any;
    assignments: any[];
    progress: any[];
    calculatedWeeks: number;
    calculatedPercentage: number;
  } | null> {
    try {
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get assignment data
      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('*')
        .eq('student_id', userId)
        .eq('status', 'active');

      // Get progress data
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          *,
          roadmap_tasks (
            id,
            task_name,
            week_id,
            roadmap_weeks (
              week_number
            )
          )
        `)
        .eq('student_id', userId);

      if (profileError || assignmentError || progressError) {
        console.error('Error fetching progress report:', { profileError, assignmentError, progressError });
        return null;
      }

      // Calculate actual progress
      const weekCompletions: { [weekNumber: number]: { completed: number; total: number } } = {};
      
      if (progress && progress.length > 0) {
        const weekIds = [...new Set(progress.map(p => p.roadmap_tasks?.week_id).filter(Boolean))];
        
        if (weekIds.length > 0) {
          const { data: allTasks } = await supabase
            .from('roadmap_tasks')
            .select(`
              id,
              week_id,
              roadmap_weeks (
                week_number
              )
            `)
            .in('week_id', weekIds);

          if (allTasks) {
            // Count total tasks per week
            allTasks.forEach(task => {
              const weekNumber = task.roadmap_weeks?.week_number;
              if (weekNumber) {
                if (!weekCompletions[weekNumber]) {
                  weekCompletions[weekNumber] = { completed: 0, total: 0 };
                }
                weekCompletions[weekNumber].total++;
              }
            });

            // Count completed tasks per week
            progress.forEach(p => {
              const weekNumber = p.roadmap_tasks?.roadmap_weeks?.week_number;
              if (weekNumber && weekCompletions[weekNumber] && p.status === 'completed') {
                weekCompletions[weekNumber].completed++;
              }
            });
          }
        }
      }

      const calculatedWeeks = Object.keys(weekCompletions)
        .map(Number)
        .filter(weekNumber => {
          const weekData = weekCompletions[weekNumber];
          return weekData.total > 0 && (weekData.completed / weekData.total) >= 0.8;
        })
        .length;

      const calculatedPercentage = Math.min(100, (calculatedWeeks / 6) * 100);

      return {
        profile,
        assignments: assignments || [],
        progress: progress || [],
        calculatedWeeks,
        calculatedPercentage
      };

    } catch (error) {
      console.error('❌ Error in getStudentProgressReport:', error);
      return null;
    }
  }
}
