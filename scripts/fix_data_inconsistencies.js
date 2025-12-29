import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDataInconsistencies() {
  console.log('🔧 FIXING DATA INCONSISTENCIES');
  console.log('==============================\n');

  try {
    // 1. Get all active students
    console.log('1. Fetching all active students...');
    const { data: assignments, error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .select(`
        student_id,
        batch_id,
        completed_weeks,
        progress_percentage,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('status', 'active');

    if (assignmentError) {
      console.error('❌ Error fetching assignments:', assignmentError);
      return;
    }

    console.log(`✅ Found ${assignments?.length || 0} active students`);

    if (!assignments || assignments.length === 0) {
      console.log('ℹ️ No active students found');
      return;
    }

    // 2. Process each student
    let fixedStudents = 0;
    let errors = [];

    for (const assignment of assignments) {
      const userId = assignment.student_id;
      const userEmail = assignment.users?.email;
      
      console.log(`\n📊 Processing student: ${userEmail || userId}`);

      try {
        // Get all completed tasks for this student
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
          console.error(`❌ Error fetching progress for ${userEmail}:`, progressError);
          errors.push(`Progress fetch error for ${userEmail}: ${progressError.message}`);
          continue;
        }

        // Group completed tasks by week
        const weekCompletions = {};
        
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

        // Calculate completed weeks (80%+ completion threshold)
        const completedWeeks = Object.keys(weekCompletions)
          .map(Number)
          .filter(weekNumber => {
            const weekData = weekCompletions[weekNumber];
            return weekData.total > 0 && (weekData.completed / weekData.total) >= 0.8;
          })
          .length;

        const progressPercentage = Math.min(100, (completedWeeks / 6) * 100); // Assuming 6 weeks total

        console.log(`   📈 Calculated: ${completedWeeks} weeks completed, ${progressPercentage.toFixed(1)}% progress`);
        console.log(`   📊 Week breakdown:`, weekCompletions);

        // Check if update is needed
        const currentWeeks = assignment.completed_weeks || 0;
        const currentPercentage = assignment.progress_percentage || 0;

        if (completedWeeks !== currentWeeks || Math.abs(progressPercentage - currentPercentage) > 0.1) {
          console.log(`   🔄 Update needed: ${currentWeeks}→${completedWeeks} weeks, ${currentPercentage.toFixed(1)}%→${progressPercentage.toFixed(1)}%`);

          // Update student_profiles table
          const { error: profileError } = await supabase
            .from('student_profiles')
            .update({
              completed_weeks: completedWeeks,
              progress_percentage: progressPercentage,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (profileError) {
            console.error(`   ❌ Error updating profile:`, profileError);
            errors.push(`Profile update error for ${userEmail}: ${profileError.message}`);
          } else {
            console.log(`   ✅ Updated profile`);
          }

          // Update student_batch_assignments table
          const { error: assignmentUpdateError } = await supabase
            .from('student_batch_assignments')
            .update({
              completed_weeks: completedWeeks,
              progress_percentage: progressPercentage,
              updated_at: new Date().toISOString()
            })
            .eq('student_id', userId)
            .eq('batch_id', assignment.batch_id);

          if (assignmentUpdateError) {
            console.error(`   ❌ Error updating assignment:`, assignmentUpdateError);
            errors.push(`Assignment update error for ${userEmail}: ${assignmentUpdateError.message}`);
          } else {
            console.log(`   ✅ Updated assignment`);
            fixedStudents++;
          }
        } else {
          console.log(`   ✅ Data is already consistent`);
        }

      } catch (error) {
        console.error(`❌ Error processing ${userEmail}:`, error);
        errors.push(`Processing error for ${userEmail}: ${error.message}`);
      }
    }

    // 3. Summary
    console.log('\n📊 MIGRATION SUMMARY');
    console.log('====================');
    console.log(`✅ Successfully fixed: ${fixedStudents} students`);
    console.log(`❌ Errors encountered: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    // 4. Verify mukit@10minuteschool.com specifically
    console.log('\n🔍 VERIFYING MUKIT@10MINUTESCHOOL.COM');
    console.log('=====================================');
    
    const { data: mukitUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'mukit@10minuteschool.com')
      .single();

    if (mukitUser) {
      const { data: mukitProfile } = await supabase
        .from('student_profiles')
        .select('completed_weeks, progress_percentage')
        .eq('user_id', mukitUser.id)
        .single();

      const { data: mukitAssignment } = await supabase
        .from('student_batch_assignments')
        .select('completed_weeks, progress_percentage, batches(name)')
        .eq('student_id', mukitUser.id)
        .eq('status', 'active')
        .single();

      console.log('👤 Mukit\'s current data:');
      console.log(`   Profile: ${mukitProfile?.completed_weeks || 0} weeks, ${mukitProfile?.progress_percentage || 0}%`);
      console.log(`   Assignment: ${mukitAssignment?.completed_weeks || 0} weeks, ${mukitAssignment?.progress_percentage || 0}%`);
      console.log(`   Batch: ${mukitAssignment?.batches?.name || 'Unknown'}`);
    } else {
      console.log('❌ Mukit user not found');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixDataInconsistencies();
