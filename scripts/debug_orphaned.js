#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hayhwvddwhgdvlxrxqun.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWh3dmRkd2hnZHZseHJ4cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODY1ODEsImV4cCI6MjA3MTc2MjU4MX0.nMtduZsKfoE9GT6DQPloXQIYd_6UcJV5UgX_mhgu1N8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugOrphanedRecords() {
  console.log('🔍 Debugging orphaned records...');
  
  // Get all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, role');
  
  if (usersError) {
    console.error('❌ Cannot get users:', usersError.message);
    return;
  }
  
  console.log(`\n📊 Users (${users.length}):`);
  users.forEach(user => {
    console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
  });
  
  // Get all progress records
  const { data: progress, error: progressError } = await supabase
    .from('student_progress')
    .select('*');
  
  if (progressError) {
    console.error('❌ Cannot get progress records:', progressError.message);
    return;
  }
  
  console.log(`\n📊 Progress Records (${progress.length}):`);
  progress.forEach((record, index) => {
    console.log(`  ${index + 1}. ID: ${record.id}`);
    console.log(`     Student ID: ${record.student_id}`);
    console.log(`     Task ID: ${record.task_id}`);
    console.log(`     Status: ${record.status}`);
    console.log(`     Created: ${record.created_at}`);
    console.log('');
  });
  
  // Check for orphaned records
  const userIds = new Set(users.map(u => u.id));
  const orphanedRecords = progress.filter(p => !userIds.has(p.student_id));
  
  console.log(`\n🚨 Orphaned Records (${orphanedRecords.length}):`);
  if (orphanedRecords.length > 0) {
    orphanedRecords.forEach((record, index) => {
      console.log(`  ${index + 1}. ID: ${record.id}`);
      console.log(`     Student ID: ${record.student_id} (NOT FOUND IN USERS TABLE)`);
      console.log(`     Task ID: ${record.task_id}`);
      console.log(`     Status: ${record.status}`);
      console.log(`     Created: ${record.created_at}`);
      console.log('');
    });
  } else {
    console.log('  ✅ No orphaned records found');
  }
  
  // Check if any of the orphaned student IDs exist in auth.users
  console.log('\n🔍 Checking if orphaned student IDs exist in auth.users...');
  for (const record of orphanedRecords) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(record.student_id);
      if (authError) {
        console.log(`  ❌ Student ID ${record.student_id} not found in auth.users: ${authError.message}`);
      } else {
        console.log(`  ⚠️  Student ID ${record.student_id} exists in auth.users but not in public.users`);
        console.log(`      Auth user: ${authUser.user.email}`);
      }
    } catch (error) {
      console.log(`  ❌ Error checking auth user ${record.student_id}: ${error.message}`);
    }
  }
}

debugOrphanedRecords().catch(console.error);
