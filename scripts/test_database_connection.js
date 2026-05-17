#!/usr/bin/env node

/**
 * Simple Database Connection Test
 * Tests the database connection and identifies the core issue
 */

import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the frontend
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function testUserData() {
  console.log('\n👥 Testing user data...');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(10);
    
    if (usersError) {
      console.error('❌ Users query failed:', usersError.message);
      return false;
    }
    
    console.log(`✅ Found ${users.length} users in public.users table`);
    
    if (users.length > 0) {
      console.log('Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ User data test failed:', error.message);
    return false;
  }
}

async function testStudentProgress() {
  console.log('\n📊 Testing student progress...');
  
  try {
    // Get all progress records
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .limit(10);
    
    if (progressError) {
      console.error('❌ Student progress query failed:', progressError.message);
      console.error('Error details:', progressError);
      return false;
    }
    
    console.log(`✅ Found ${progress.length} progress records`);
    
    if (progress.length > 0) {
      console.log('Sample progress records:');
      progress.forEach(p => {
        console.log(`  - Student ID: ${p.student_id}, Task ID: ${p.task_id}, Status: ${p.status}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Student progress test failed:', error.message);
    return false;
  }
}

async function testTaskCompletion() {
  console.log('\n🧪 Testing task completion...');
  
  try {
    // Get a test user
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .limit(1)
      .single();
    
    if (userError || !testUser) {
      console.error('❌ No test user found:', userError?.message);
      return false;
    }
    
    console.log(`✅ Found test user: ${testUser.email} (${testUser.id})`);
    
    // Get a test task
    const { data: testTask, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(1)
      .single();
    
    if (taskError || !testTask) {
      console.error('❌ No test task found:', taskError?.message);
      return false;
    }
    
    console.log(`✅ Found test task: ${testTask.task_name} (${testTask.id})`);
    
    // Test task completion
    const { error: progressError } = await supabase
      .from('student_progress')
      .upsert({
        student_id: testUser.id,
        task_id: testTask.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (progressError) {
      console.error('❌ Task completion test failed:', progressError.message);
      console.error('Error details:', progressError);
      return false;
    }
    
    console.log('✅ Task completion test passed!');
    
    // Clean up test data
    await supabase
      .from('student_progress')
      .delete()
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id);
    
    console.log('✅ Test data cleaned up');
    
    return true;
    
  } catch (error) {
    console.error('❌ Task completion test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Database Connection Test\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Database connection failed. Please check your Supabase configuration.');
    process.exit(1);
  }
  
  const usersOk = await testUserData();
  const progressOk = await testStudentProgress();
  const taskCompletionOk = await testTaskCompletion();
  
  console.log('\n📋 Test Summary:');
  console.log(`  Database Connection: ${connectionOk ? '✅' : '❌'}`);
  console.log(`  User Data: ${usersOk ? '✅' : '❌'}`);
  console.log(`  Student Progress: ${progressOk ? '✅' : '❌'}`);
  console.log(`  Task Completion: ${taskCompletionOk ? '✅' : '❌'}`);
  
  if (connectionOk && usersOk && progressOk && taskCompletionOk) {
    console.log('\n🎉 All tests passed! Database is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }
}

// Run the test
main().catch(console.error);
