#!/usr/bin/env node

/**
 * Comprehensive Feature Test for 10MS SheSTEM Application
 * Tests all features without authentication to identify RLS and API issues
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

// Utility functions
function logTest(testName, status, message = '') {
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${testName}: ${message}`);
  
  if (status === 'PASS') {
    testResults.passed++;
  } else if (status === 'FAIL') {
    testResults.failed++;
    testResults.errors.push(`${testName}: ${message}`);
  } else {
    testResults.warnings.push(`${testName}: ${message}`);
  }
}

async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    logTest('Database Connection', 'PASS', 'Successfully connected to Supabase');
    return true;
  } catch (error) {
    logTest('Database Connection', 'FAIL', error.message);
    return false;
  }
}

async function testUsersTable() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name')
      .limit(10);
    
    if (error) throw error;
    
    logTest('Users Table Access', 'PASS', `Found ${users.length} users`);
    
    // Check for different user roles
    const roles = [...new Set(users.map(u => u.role))];
    logTest('User Roles', 'PASS', `Found roles: ${roles.join(', ')}`);
    
    return users;
  } catch (error) {
    logTest('Users Table Access', 'FAIL', error.message);
    return [];
  }
}

async function testNoticesTable() {
  try {
    // Test SELECT
    const { data: notices, error: readError } = await supabase
      .from('notices')
      .select('*')
      .limit(5);
    
    if (readError) {
      logTest('Notices Table - SELECT', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Notices Table - SELECT', 'PASS', `Found ${notices.length} notices`);
    
    // Test INSERT (this will likely fail due to RLS)
    const testNotice = {
      title: `Test Notice ${Date.now()}`,
      content: 'Test notice for RLS testing',
      tag: 'Test',
      priority: 'medium',
      is_published: true,
      author_id: null, // This will cause issues
      batch_id: null
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('notices')
      .insert([testNotice])
      .select()
      .single();
    
    if (insertError) {
      logTest('Notices Table - INSERT', 'FAIL', `RLS Error: ${insertError.message}`);
      logTest('Notices Table - INSERT', 'WARN', `Error Code: ${insertError.code}`);
    } else {
      logTest('Notices Table - INSERT', 'PASS', 'Successfully inserted notice');
      
      // Clean up
      await supabase.from('notices').delete().eq('id', insertData.id);
    }
    
    return true;
  } catch (error) {
    logTest('Notices Table', 'FAIL', error.message);
    return false;
  }
}

async function testBatchesTable() {
  try {
    const { data: batches, error } = await supabase
      .from('batches')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Batches Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Batches Table - SELECT', 'PASS', `Found ${batches.length} batches`);
    
    // Test INSERT
    const testBatch = {
      name: `Test Batch ${Date.now()}`,
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('batches')
      .insert([testBatch])
      .select()
      .single();
    
    if (insertError) {
      logTest('Batches Table - INSERT', 'FAIL', `RLS Error: ${insertError.message}`);
    } else {
      logTest('Batches Table - INSERT', 'PASS', 'Successfully inserted batch');
      
      // Clean up
      await supabase.from('batches').delete().eq('id', insertData.id);
    }
    
    return true;
  } catch (error) {
    logTest('Batches Table', 'FAIL', error.message);
    return false;
  }
}

async function testRoadmapsTable() {
  try {
    const { data: roadmaps, error } = await supabase
      .from('roadmaps')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Roadmaps Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Roadmaps Table - SELECT', 'PASS', `Found ${roadmaps.length} roadmaps`);
    
    // Test INSERT
    const testRoadmap = {
      title: `Test Roadmap ${Date.now()}`,
      description: 'Test roadmap for RLS testing',
      total_weeks: 6,
      difficulty_level: 'beginner',
      category: 'Testing',
      is_active: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('roadmaps')
      .insert([testRoadmap])
      .select()
      .single();
    
    if (insertError) {
      logTest('Roadmaps Table - INSERT', 'FAIL', `RLS Error: ${insertError.message}`);
    } else {
      logTest('Roadmaps Table - INSERT', 'PASS', 'Successfully inserted roadmap');
      
      // Clean up
      await supabase.from('roadmaps').delete().eq('id', insertData.id);
    }
    
    return true;
  } catch (error) {
    logTest('Roadmaps Table', 'FAIL', error.message);
    return false;
  }
}

async function testStudentProgressTable() {
  try {
    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Student Progress Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Student Progress Table - SELECT', 'PASS', `Found ${progress.length} progress records`);
    
    return true;
  } catch (error) {
    logTest('Student Progress Table', 'FAIL', error.message);
    return false;
  }
}

async function testStudentProfilesTable() {
  try {
    const { data: profiles, error } = await supabase
      .from('student_profiles')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Student Profiles Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Student Profiles Table - SELECT', 'PASS', `Found ${profiles.length} student profiles`);
    
    return true;
  } catch (error) {
    logTest('Student Profiles Table', 'FAIL', error.message);
    return false;
  }
}

async function testStudentBatchAssignmentsTable() {
  try {
    const { data: assignments, error } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Student Batch Assignments Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Student Batch Assignments Table - SELECT', 'PASS', `Found ${assignments.length} batch assignments`);
    
    return true;
  } catch (error) {
    logTest('Student Batch Assignments Table', 'FAIL', error.message);
    return false;
  }
}

async function testRoadmapWeeksTable() {
  try {
    const { data: weeks, error } = await supabase
      .from('roadmap_weeks')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Roadmap Weeks Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Roadmap Weeks Table - SELECT', 'PASS', `Found ${weeks.length} roadmap weeks`);
    
    return true;
  } catch (error) {
    logTest('Roadmap Weeks Table', 'FAIL', error.message);
    return false;
  }
}

async function testRoadmapTasksTable() {
  try {
    const { data: tasks, error } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Roadmap Tasks Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Roadmap Tasks Table - SELECT', 'PASS', `Found ${tasks.length} roadmap tasks`);
    
    return true;
  } catch (error) {
    logTest('Roadmap Tasks Table', 'FAIL', error.message);
    return false;
  }
}

async function testMentorProfilesTable() {
  try {
    const { data: mentors, error } = await supabase
      .from('mentor_profiles')
      .select('*')
      .limit(5);
    
    if (error) {
      logTest('Mentor Profiles Table - SELECT', 'FAIL', error.message);
      return false;
    }
    
    logTest('Mentor Profiles Table - SELECT', 'PASS', `Found ${mentors.length} mentor profiles`);
    
    return true;
  } catch (error) {
    logTest('Mentor Profiles Table', 'FAIL', error.message);
    return false;
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive Feature Test for 10MS SheSTEM Application\n');
  
  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Exiting tests.');
    return;
  }
  
  // Test 2: Core Tables
  await testUsersTable();
  await testNoticesTable();
  await testBatchesTable();
  await testRoadmapsTable();
  await testStudentProgressTable();
  await testStudentProfilesTable();
  await testStudentBatchAssignmentsTable();
  await testRoadmapWeeksTable();
  await testRoadmapTasksTable();
  await testMentorProfilesTable();
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings.length}`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    testResults.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (testResults.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    testResults.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
  console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! The database structure is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    console.log('\n🔧 RECOMMENDED FIXES:');
    console.log('1. Run the RLS policy fixes for notices table');
    console.log('2. Check authentication flow in frontend');
    console.log('3. Verify user permissions and roles');
  }
}

// Run the tests
runComprehensiveTest().catch(console.error);
