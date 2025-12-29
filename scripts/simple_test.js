#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hayhwvddwhgdvlxrxqun.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWh3dmRkd2hnZHZseHJ4cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODY1ODEsImV4cCI6MjA3MTc2MjU4MX0.nMtduZsKfoE9GT6DQPloXQIYd_6UcJV5UgX_mhgu1N8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTaskCompletion() {
  console.log('🧪 Testing task completion functionality...');
  
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
    
    // Test task completion (this is the exact operation that was failing)
    console.log('🔄 Testing task completion upsert...');
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
      console.error('❌ Task completion failed:', progressError.message);
      console.error('Error code:', progressError.code);
      console.error('Error details:', progressError);
      return false;
    }
    
    console.log('✅ Task completion test passed!');
    
    // Verify the record was created
    const { data: createdProgress, error: verifyError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id)
      .single();
    
    if (verifyError || !createdProgress) {
      console.error('❌ Could not verify created progress record:', verifyError?.message);
      return false;
    }
    
    console.log('✅ Progress record verified:', {
      id: createdProgress.id,
      student_id: createdProgress.student_id,
      task_id: createdProgress.task_id,
      status: createdProgress.status
    });
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('student_progress')
      .delete()
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id);
    
    if (deleteError) {
      console.error('⚠️ Failed to clean up test data:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error.message);
    return false;
  }
}

async function testDatabaseHealth() {
  console.log('🔍 Testing database health...');
  
  try {
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role');
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
      return false;
    }
    
    console.log(`✅ Users table: ${users.length} users found`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    // Test student_progress table
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('student_id, task_id, status');
    
    if (progressError) {
      console.error('❌ Student progress table error:', progressError.message);
      return false;
    }
    
    console.log(`✅ Student progress table: ${progress.length} records found`);
    
    // Check for orphaned records
    const userIds = new Set(users.map(u => u.id));
    const orphanedProgress = progress.filter(p => !userIds.has(p.student_id));
    
    if (orphanedProgress.length > 0) {
      console.error(`❌ Found ${orphanedProgress.length} orphaned progress records`);
      return false;
    }
    
    console.log('✅ No orphaned progress records found');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Simple Test Suite\n');
  
  const healthOk = await testDatabaseHealth();
  if (!healthOk) {
    console.log('\n❌ Database health check failed. Cannot proceed with task completion test.');
    process.exit(1);
  }
  
  const taskCompletionOk = await testTaskCompletion();
  
  console.log('\n📊 Test Results:');
  console.log(`Database Health: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Task Completion: ${taskCompletionOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (healthOk && taskCompletionOk) {
    console.log('\n🎉 ALL TESTS PASSED! The task completion issue has been fixed.');
    console.log('\n📋 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Open the application in your browser');
    console.log('3. Navigate to the roadmap page');
    console.log('4. Try to complete a task - it should work now!');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }
}

main().catch(console.error);
