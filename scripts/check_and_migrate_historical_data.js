import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndMigrateHistoricalData() {
  console.log('🔍 Checking for historical task completion data...');
  
  try {
    // Check student_progress table
    const { data: progressData, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .limit(10);
    
    if (progressError) {
      console.error('❌ Error fetching progress data:', progressError);
      return;
    }
    
    console.log('📊 Student Progress Data:', progressData?.length || 0, 'records');
    if (progressData?.length > 0) {
      console.log('Sample progress records:', progressData.slice(0, 3));
    }
    
    // Check for mukit@10minuteschool.com specifically
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('email', 'mukit@10minuteschool.com')
      .single();
    
    if (userError) {
      console.log('❌ Error finding user:', userError);
    } else if (userData) {
      console.log('👤 Found user:', userData);
      
      // Check their progress
      const { data: userProgress, error: userProgressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userData.id);
      
      if (userProgressError) {
        console.log('❌ Error fetching user progress:', userProgressError);
      } else {
        console.log('📈 User progress records:', userProgress?.length || 0);
        if (userProgress?.length > 0) {
          console.log('User progress:', userProgress);
          
          // Calculate completed weeks based on progress
          const completedTasks = userProgress.filter(p => p.status === 'completed');
          console.log('✅ Completed tasks:', completedTasks.length);
          
          // Get roadmap weeks to map tasks to weeks
          const { data: weeks, error: weeksError } = await supabase
            .from('roadmap_weeks')
            .select('id, week_number')
            .order('week_number');
          
          if (!weeksError && weeks) {
            console.log('📅 Available weeks:', weeks);
            
            // Get tasks for each week
            const weekIds = weeks.map(w => w.id);
            const { data: tasks, error: tasksError } = await supabase
              .from('roadmap_tasks')
              .select('id, week_id, task_name')
              .in('week_id', weekIds);
            
            if (!tasksError && tasks) {
              console.log('📝 Available tasks:', tasks.length);
              
              // Calculate completed weeks
              let completedWeeks = 0;
              for (const week of weeks) {
                const weekTasks = tasks.filter(t => t.week_id === week.id);
                const completedWeekTasks = weekTasks.filter(task => 
                  completedTasks.some(progress => progress.task_id === task.id)
                );
                
                const completionPercentage = weekTasks.length > 0 ? 
                  (completedWeekTasks.length / weekTasks.length) * 100 : 0;
                
                console.log(`Week ${week.week_number}: ${completedWeekTasks.length}/${weekTasks.length} tasks completed (${completionPercentage.toFixed(1)}%)`);
                
                if (completionPercentage >= 80) {
                  completedWeeks = Math.max(completedWeeks, week.week_number);
                }
              }
              
              console.log(`🎯 Calculated completed weeks: ${completedWeeks}`);
              
              // Update student profile if needed
              const { data: profile, error: profileError } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('user_id', userData.id)
                .single();
              
              if (profileError) {
                console.log('❌ Error fetching profile:', profileError);
              } else if (profile) {
                console.log('👤 Current profile:', profile);
                
                if (profile.completed_weeks < completedWeeks) {
                  console.log(`🔄 Updating profile: ${profile.completed_weeks} -> ${completedWeeks} weeks`);
                  
                  const { error: updateError } = await supabase
                    .from('student_profiles')
                    .update({
                      completed_weeks: completedWeeks,
                      progress_percentage: Math.min(100, (completedWeeks / 6) * 100),
                      updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userData.id);
                  
                  if (updateError) {
                    console.log('❌ Error updating profile:', updateError);
                  } else {
                    console.log('✅ Profile updated successfully!');
                  }
                } else {
                  console.log('✅ Profile is already up to date');
                }
              }
            }
          }
        }
      }
    } else {
      console.log('❌ User not found');
    }
    
    // Check all student profiles for potential updates
    console.log('\n🔍 Checking all student profiles...');
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('student_profiles')
      .select('user_id, completed_weeks, progress_percentage, users(email, first_name, last_name)')
      .limit(10);
    
    if (allProfilesError) {
      console.log('❌ Error fetching all profiles:', allProfilesError);
    } else {
      console.log('👥 All profiles:', allProfiles?.length || 0);
      if (allProfiles?.length > 0) {
        console.log('Sample profiles:', allProfiles.slice(0, 3));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAndMigrateHistoricalData();
