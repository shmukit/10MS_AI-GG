import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function comprehensiveDataDiagnosis() {
  console.log('🔍 COMPREHENSIVE DATA DIAGNOSIS');
  console.log('================================\n');

  try {
    // 1. Check mukit@10minuteschool.com user data
    console.log('1. USER DATA ANALYSIS');
    console.log('---------------------');
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'mukit@10minuteschool.com')
      .single();
    
    if (userError) {
      console.log('❌ Error finding user:', userError);
      return;
    }
    
    if (userData) {
      console.log('✅ User found:', {
        id: userData.id,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: userData.role
      });
    } else {
      console.log('❌ User not found');
      return;
    }

    // 2. Check student profile data
    console.log('\n2. STUDENT PROFILE ANALYSIS');
    console.log('----------------------------');
    
    const { data: profileData, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userData.id)
      .single();
    
    if (profileError) {
      console.log('❌ Error fetching profile:', profileError);
    } else if (profileData) {
      console.log('✅ Profile found:', {
        completed_weeks: profileData.completed_weeks,
        progress_percentage: profileData.progress_percentage,
        institute: profileData.institute,
        batch_id: profileData.batch_id
      });
    } else {
      console.log('❌ No profile found');
    }

    // 3. Check batch assignments
    console.log('\n3. BATCH ASSIGNMENT ANALYSIS');
    console.log('-----------------------------');
    
    const { data: batchAssignments, error: batchError } = await supabase
      .from('student_batch_assignments')
      .select(`
        *,
        batches (
          id,
          name,
          roadmap_id,
          roadmaps (
            id,
            title
          )
        )
      `)
      .eq('student_id', userData.id)
      .eq('status', 'active');
    
    if (batchError) {
      console.log('❌ Error fetching batch assignments:', batchError);
    } else if (batchAssignments && batchAssignments.length > 0) {
      console.log('✅ Batch assignments found:', batchAssignments.length);
      batchAssignments.forEach((assignment, index) => {
        console.log(`   Assignment ${index + 1}:`, {
          batch_name: assignment.batches?.name,
          roadmap_title: assignment.batches?.roadmaps?.title,
          completed_weeks: assignment.completed_weeks,
          progress_percentage: assignment.progress_percentage,
          enrollment_date: assignment.enrollment_date
        });
      });
    } else {
      console.log('❌ No batch assignments found');
    }

    // 4. Check student progress (task completion)
    console.log('\n4. TASK COMPLETION ANALYSIS');
    console.log('----------------------------');
    
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
            week_number
          )
        )
      `)
      .eq('student_id', userData.id);
    
    if (progressError) {
      console.log('❌ Error fetching progress:', progressError);
    } else if (progressData && progressData.length > 0) {
      console.log('✅ Progress records found:', progressData.length);
      
      // Group by week
      const progressByWeek = {};
      progressData.forEach(progress => {
        const weekNumber = progress.roadmap_tasks?.roadmap_weeks?.week_number;
        if (weekNumber) {
          if (!progressByWeek[weekNumber]) {
            progressByWeek[weekNumber] = { completed: 0, total: 0, tasks: [] };
          }
          progressByWeek[weekNumber].total++;
          if (progress.status === 'completed') {
            progressByWeek[weekNumber].completed++;
          }
          progressByWeek[weekNumber].tasks.push({
            task_name: progress.roadmap_tasks?.task_name,
            status: progress.status,
            completed_at: progress.completed_at
          });
        }
      });
      
      console.log('📊 Progress by week:');
      Object.keys(progressByWeek).sort().forEach(week => {
        const weekData = progressByWeek[week];
        const percentage = weekData.total > 0 ? (weekData.completed / weekData.total) * 100 : 0;
        console.log(`   Week ${week}: ${weekData.completed}/${weekData.total} tasks (${percentage.toFixed(1)}%)`);
        if (weekData.completed > 0) {
          console.log('     Completed tasks:', weekData.tasks.filter(t => t.status === 'completed').map(t => t.task_name));
        }
      });
    } else {
      console.log('❌ No progress records found');
    }

    // 5. Check roadmap weeks and tasks
    console.log('\n5. ROADMAP STRUCTURE ANALYSIS');
    console.log('------------------------------');
    
    if (batchAssignments && batchAssignments.length > 0) {
      const roadmapId = batchAssignments[0].batches?.roadmap_id;
      if (roadmapId) {
        const { data: weeksData, error: weeksError } = await supabase
          .from('roadmap_weeks')
          .select('*')
          .eq('roadmap_id', roadmapId)
          .order('week_number');
        
        if (weeksError) {
          console.log('❌ Error fetching weeks:', weeksError);
        } else if (weeksData && weeksData.length > 0) {
          console.log('✅ Roadmap weeks found:', weeksData.length);
          
          for (const week of weeksData) {
            const { data: tasksData, error: tasksError } = await supabase
              .from('roadmap_tasks')
              .select('*')
              .eq('week_id', week.id);
            
            if (!tasksError && tasksData) {
              console.log(`   Week ${week.week_number}: ${tasksData.length} tasks`);
            }
          }
        }
      }
    }

    // 6. Data consistency check
    console.log('\n6. DATA CONSISTENCY ANALYSIS');
    console.log('------------------------------');
    
    const profileWeeks = profileData?.completed_weeks || 0;
    const assignmentWeeks = batchAssignments?.[0]?.completed_weeks || 0;
    const actualCompletedWeeks = Object.keys(progressByWeek).filter(week => {
      const weekData = progressByWeek[week];
      return weekData.total > 0 && (weekData.completed / weekData.total) >= 0.8; // 80% completion threshold
    }).length;
    
    console.log('📊 Data consistency check:');
    console.log(`   Profile completed_weeks: ${profileWeeks}`);
    console.log(`   Assignment completed_weeks: ${assignmentWeeks}`);
    console.log(`   Actual completed weeks (80%+ tasks): ${actualCompletedWeeks}`);
    
    if (profileWeeks !== actualCompletedWeeks) {
      console.log('⚠️  INCONSISTENCY: Profile weeks do not match actual completion');
    }
    if (assignmentWeeks !== actualCompletedWeeks) {
      console.log('⚠️  INCONSISTENCY: Assignment weeks do not match actual completion');
    }
    if (profileWeeks === actualCompletedWeeks && assignmentWeeks === actualCompletedWeeks) {
      console.log('✅ Data is consistent');
    }

    // 7. Recommendations
    console.log('\n7. RECOMMENDATIONS');
    console.log('-------------------');
    
    if (actualCompletedWeeks > 0) {
      console.log('🔧 ACTION NEEDED: Update profile and assignment data');
      console.log(`   - Set profile.completed_weeks to ${actualCompletedWeeks}`);
      console.log(`   - Set assignment.completed_weeks to ${actualCompletedWeeks}`);
      console.log(`   - Set progress_percentage to ${Math.min(100, (actualCompletedWeeks / 6) * 100)}%`);
    } else {
      console.log('ℹ️  No completed weeks detected based on task completion');
    }

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  }
}

comprehensiveDataDiagnosis();
