#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hayhwvddwhgdvlxrxqun.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWh3dmRkd2hnZHZseHJ4cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODY1ODEsImV4cCI6MjA3MTc2MjU4MX0.nMtduZsKfoE9GT6DQPloXQIYd_6UcJV5UgX_mhgu1N8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function log(message, color = 'reset') {
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function aggressiveCleanup() {
  log('🧹 Starting aggressive cleanup of orphaned records...', 'cyan');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');
    
    if (usersError) {
      log(`❌ Cannot get users: ${usersError.message}`, 'red');
      return false;
    }
    
    const userIds = new Set(users.map(u => u.id));
    log(`✅ Found ${userIds.size} valid user IDs`, 'green');
    
    // Get all progress records
    const { data: allProgress, error: progressError } = await supabase
      .from('student_progress')
      .select('*');
    
    if (progressError) {
      log(`❌ Cannot get progress records: ${progressError.message}`, 'red');
      return false;
    }
    
    log(`✅ Found ${allProgress.length} total progress records`, 'green');
    
    // Find orphaned records
    const orphanedRecords = allProgress.filter(p => !userIds.has(p.student_id));
    
    if (orphanedRecords.length === 0) {
      log('✅ No orphaned records found', 'green');
      return true;
    }
    
    log(`⚠️ Found ${orphanedRecords.length} orphaned records to delete`, 'yellow');
    
    // Show details of orphaned records
    orphanedRecords.forEach((record, index) => {
      log(`  ${index + 1}. ID: ${record.id}, Student ID: ${record.student_id}, Task ID: ${record.task_id}`, 'yellow');
    });
    
    // Delete orphaned records one by one to ensure they're all removed
    let deletedCount = 0;
    for (const record of orphanedRecords) {
      const { error: deleteError } = await supabase
        .from('student_progress')
        .delete()
        .eq('id', record.id);
      
      if (deleteError) {
        log(`❌ Failed to delete record ${record.id}: ${deleteError.message}`, 'red');
      } else {
        deletedCount++;
        log(`✅ Deleted record ${record.id}`, 'green');
      }
    }
    
    log(`✅ Successfully deleted ${deletedCount}/${orphanedRecords.length} orphaned records`, 'green');
    
    // Verify cleanup
    const { data: remainingProgress, error: verifyError } = await supabase
      .from('student_progress')
      .select('*');
    
    if (verifyError) {
      log(`❌ Cannot verify cleanup: ${verifyError.message}`, 'red');
      return false;
    }
    
    const remainingOrphaned = remainingProgress.filter(p => !userIds.has(p.student_id));
    
    if (remainingOrphaned.length === 0) {
      log('✅ Cleanup verification passed - no orphaned records remain', 'green');
      return true;
    } else {
      log(`⚠️ ${remainingOrphaned.length} orphaned records still remain after cleanup`, 'yellow');
      return false;
    }
    
  } catch (error) {
    log(`❌ Cleanup failed: ${error.message}`, 'red');
    return false;
  }
}

async function testTaskCompletion() {
  log('\n🧪 Testing task completion after cleanup...', 'cyan');
  
  try {
    // Get a test user
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .limit(1)
      .single();
    
    if (userError || !testUser) {
      log('❌ No test user found', 'red');
      return false;
    }
    
    log(`✅ Found test user: ${testUser.email}`, 'green');
    
    // Get a test task
    const { data: testTask, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(1)
      .single();
    
    if (taskError || !testTask) {
      log('❌ No test task found', 'red');
      return false;
    }
    
    log(`✅ Found test task: ${testTask.task_name}`, 'green');
    
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
      log(`❌ Task completion test failed: ${progressError.message}`, 'red');
      log(`Error code: ${progressError.code}`, 'red');
      return false;
    }
    
    log('✅ Task completion test passed!', 'green');
    
    // Clean up test data
    await supabase
      .from('student_progress')
      .delete()
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id);
    
    log('✅ Test data cleaned up', 'green');
    return true;
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 Starting Aggressive Cleanup\n', 'bright');
  
  const cleanupOk = await aggressiveCleanup();
  if (!cleanupOk) {
    log('\n❌ Cleanup failed. Please check the errors above.', 'red');
    process.exit(1);
  }
  
  const testOk = await testTaskCompletion();
  if (!testOk) {
    log('\n⚠️ Cleanup completed but task completion test failed.', 'yellow');
  } else {
    log('\n🎉 Cleanup and testing completed successfully!', 'green');
    log('\n📋 The task completion issue should now be fixed.', 'cyan');
    log('You can now test the frontend application.', 'cyan');
  }
}

main().catch(console.error);
