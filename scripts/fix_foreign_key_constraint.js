#!/usr/bin/env node

/**
 * Fix Foreign Key Constraint Violation
 * 
 * This script addresses the core issue where student_id in student_progress
 * doesn't exist in the users table, causing the 409 conflict error.
 */

import { createClient } from '@supabase/supabase-js';

// We'll use the service role key for admin operations
// For now, let's try with the anon key and see what we can access
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

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

async function diagnoseIssue() {
  log('\n🔍 Diagnosing Foreign Key Constraint Issue...', 'cyan');
  
  try {
    // First, let's see what we can access
    log('📊 Checking database access...', 'blue');
    
    // Try to get users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);
    
    if (usersError) {
      log(`❌ Cannot access users table: ${usersError.message}`, 'red');
      log(`Error code: ${usersError.code}`, 'red');
      log(`Error details: ${JSON.stringify(usersError, null, 2)}`, 'red');
      return false;
    }
    
    log(`✅ Found ${users.length} users in database`, 'green');
    if (users.length > 0) {
      log('Sample users:', 'yellow');
      users.forEach(user => {
        log(`  - ${user.email} (${user.role}) - ID: ${user.id}`, 'yellow');
      });
    }
    
    // Try to get student progress
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('student_id, task_id, status')
      .limit(5);
    
    if (progressError) {
      log(`❌ Cannot access student_progress table: ${progressError.message}`, 'red');
      log(`Error code: ${progressError.code}`, 'red');
      return false;
    }
    
    log(`✅ Found ${progress.length} progress records`, 'green');
    if (progress.length > 0) {
      log('Sample progress records:', 'yellow');
      progress.forEach(p => {
        log(`  - Student ID: ${p.student_id}, Task ID: ${p.task_id}, Status: ${p.status}`, 'yellow');
      });
    }
    
    // Check for orphaned records
    const userIds = new Set(users.map(u => u.id));
    const orphanedProgress = progress.filter(p => !userIds.has(p.student_id));
    
    if (orphanedProgress.length > 0) {
      log(`⚠️ Found ${orphanedProgress.length} orphaned progress records`, 'yellow');
      orphanedProgress.forEach(p => {
        log(`  - Orphaned: Student ID ${p.student_id} not found in users table`, 'red');
      });
    } else {
      log('✅ No orphaned progress records found', 'green');
    }
    
    return true;
    
  } catch (error) {
    log(`❌ Diagnosis failed: ${error.message}`, 'red');
    return false;
  }
}

async function fixOrphanedRecords() {
  log('\n🔧 Fixing orphaned progress records...', 'cyan');
  
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
    
    // Delete orphaned records
    const orphanedIds = orphanedRecords.map(r => r.id);
    
    // Delete in batches to avoid timeout
    const batchSize = 100;
    let deletedCount = 0;
    
    for (let i = 0; i < orphanedIds.length; i += batchSize) {
      const batch = orphanedIds.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('student_progress')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        log(`❌ Failed to delete batch ${i}-${i + batch.length}: ${deleteError.message}`, 'red');
      } else {
        deletedCount += batch.length;
        log(`✅ Deleted batch ${i}-${i + batch.length} (${deletedCount}/${orphanedIds.length})`, 'green');
      }
    }
    
    log(`✅ Successfully deleted ${deletedCount} orphaned records`, 'green');
    return true;
    
  } catch (error) {
    log(`❌ Fix failed: ${error.message}`, 'red');
    return false;
  }
}

async function testTaskCompletion() {
  log('\n🧪 Testing task completion after fix...', 'cyan');
  
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
  log('🚀 Starting Foreign Key Constraint Fix\n', 'bright');
  
  // Step 1: Diagnose the issue
  const diagnosisOk = await diagnoseIssue();
  if (!diagnosisOk) {
    log('\n❌ Diagnosis failed. Cannot proceed with fix.', 'red');
    process.exit(1);
  }
  
  // Step 2: Fix orphaned records
  const fixOk = await fixOrphanedRecords();
  if (!fixOk) {
    log('\n❌ Fix failed. Please check the errors above.', 'red');
    process.exit(1);
  }
  
  // Step 3: Test task completion
  const testOk = await testTaskCompletion();
  if (!testOk) {
    log('\n⚠️ Fix applied but task completion test failed.', 'yellow');
  } else {
    log('\n🎉 All fixes applied successfully! Task completion should now work.', 'green');
  }
  
  log('\n📋 Next Steps:', 'cyan');
  log('1. Test the frontend application', 'blue');
  log('2. Try to complete a task from the roadmap page', 'blue');
  log('3. Check browser console for any remaining errors', 'blue');
}

// Run the fix
main().catch(console.error);
