import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function investigateUserIdIssue() {
  try {
    console.log('🔍 Investigating user ID issue...');
    
    const problematicUserId = '03d8f8f9-cdab-4fc4-9e74-7e1cd91fa364';
    const taskId = '1c05f973-3fcc-45d8-9236-0cc645cfe0e4';
    
    console.log('👤 Checking if user exists in users table...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', problematicUserId)
      .single();
    
    if (userError) {
      console.log('❌ User not found in users table:', userError);
      console.log('This explains the foreign key constraint violation!');
    } else {
      console.log('✅ User found in users table:', user);
    }
    
    // Check if this user ID exists in auth.users
    console.log('\n🔐 Checking if user exists in auth.users...');
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError);
    } else {
      console.log('✅ Auth user:', authUser.user?.id, authUser.user?.email);
    }
    
    // Check what user is currently logged in
    console.log('\n🔍 Checking current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError);
    } else {
      console.log('📊 Current session:', session?.user?.id, session?.user?.email);
    }
    
    // Check if the problematic user ID exists anywhere
    console.log('\n🔍 Searching for this user ID in all tables...');
    
    // Check in student_progress
    const { data: progressRecords, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', problematicUserId);
    
    if (progressError) {
      console.log('❌ Error checking student_progress:', progressError);
    } else {
      console.log('📊 Records in student_progress with this user ID:', progressRecords.length);
      if (progressRecords.length > 0) {
        console.log('📋 Sample records:', progressRecords.slice(0, 3));
      }
    }
    
    // Check in student_batch_assignments
    const { data: batchAssignments, error: batchError } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .eq('student_id', problematicUserId);
    
    if (batchError) {
      console.log('❌ Error checking student_batch_assignments:', batchError);
    } else {
      console.log('📊 Records in student_batch_assignments with this user ID:', batchAssignments.length);
    }
    
    // Check if this is a mismatch between auth user and database user
    console.log('\n🔍 Checking for user ID mismatches...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, role')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (allUsersError) {
      console.log('❌ Error fetching users:', allUsersError);
    } else {
      console.log('📊 Recent users in database:');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role}): ${u.id}`);
      });
    }
    
    // Check if the task exists
    console.log('\n📋 Checking if task exists...');
    const { data: task, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      console.log('❌ Task not found:', taskError);
    } else {
      console.log('✅ Task found:', task.task_name);
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

investigateUserIdIssue();
