import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHistoricalData() {
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
        }
      }
    } else {
      console.log('❌ User not found');
    }
    
    // Check student_profiles for completed_weeks
    const { data: profiles, error: profilesError } = await supabase
      .from('student_profiles')
      .select('user_id, completed_weeks, progress_percentage, users(email, first_name, last_name)')
      .gt('completed_weeks', 0)
      .limit(10);
    
    if (profilesError) {
      console.log('❌ Error fetching profiles:', profilesError);
    } else {
      console.log('👥 Students with completed weeks:', profiles?.length || 0);
      if (profiles?.length > 0) {
        console.log('Sample profiles with progress:', profiles.slice(0, 3));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkHistoricalData();
