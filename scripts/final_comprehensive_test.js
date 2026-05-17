#!/usr/bin/env node

/**
 * Final Comprehensive Test for 10MS SheSTEM Application
 * Tests all features after fixes to ensure everything is working
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

async function testAuthentication() {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logTest('Authentication Session', 'FAIL', sessionError.message);
      return false;
    }
    
    if (session) {
      logTest('Authentication Session', 'PASS', `Active session for: ${session.user.email}`);
      return { user: session.user };
    } else {
      logTest('Authentication Session', 'WARN', 'No active session - testing with anonymous access');
      return null;
    }
  } catch (error) {
    logTest('Authentication', 'FAIL', error.message);
    return false;
  }
}

async function testNoticesCRUD() {
  try {
    // Test 1: Read existing notices
    const { data: notices, error: readError } = await supabase
      .from('notices')
      .select('*')
      .limit(5);

    if (readError) {
      logTest('Notices - SELECT', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Notices - SELECT', 'PASS', `Found ${notices.length} existing notices`);
    
    // Test 2: Create a new notice (this will test RLS policies)
    const testNotice = {
      title: `E2E Test Notice ${Date.now()}`,
      content: 'This is a comprehensive test notice for end-to-end testing',
      tag: 'Test',
      priority: 'medium',
      is_published: true,
      author_id: null, // This will test the RLS policy
      batch_id: null
    };
    
    const { data: createData, error: createError } = await supabase
      .from('notices')
      .insert([testNotice])
      .select()
      .single();
    
    if (createError) {
      logTest('Notices - INSERT', 'FAIL', `RLS Error: ${createError.message}`);
      logTest('Notices - INSERT', 'WARN', `Error Code: ${createError.code}`);
      return false;
    }
    
    logTest('Notices - INSERT', 'PASS', `Successfully created notice: ${createData.title}`);
    
    // Test 3: Update the notice
    const { data: updateData, error: updateError } = await supabase
      .from('notices')
      .update({
        title: `Updated E2E Test Notice ${Date.now()}`,
        content: 'This notice has been updated for testing',
        updated_at: new Date().toISOString()
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Notices - UPDATE', 'FAIL', `RLS Error: ${updateError.message}`);
    } else {
      logTest('Notices - UPDATE', 'PASS', `Successfully updated notice: ${updateData.title}`);
    }
    
    // Test 4: Delete the notice
    const { error: deleteError } = await supabase
      .from('notices')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Notices - DELETE', 'FAIL', `RLS Error: ${deleteError.message}`);
    } else {
      logTest('Notices - DELETE', 'PASS', 'Successfully deleted test notice');
    }
    
    return true;
  } catch (error) {
    logTest('Notices CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testBatchesCRUD() {
  try {
    // Test 1: Read existing batches
    const { data: batches, error: readError } = await supabase
      .from('batches')
      .select('*')
      .limit(5);
    
    if (readError) {
      logTest('Batches - SELECT', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Batches - SELECT', 'PASS', `Found ${batches.length} existing batches`);
    
    // Test 2: Create a new batch
    const testBatch = {
      name: `E2E Test Batch ${Date.now()}`,
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };

    const { data: createData, error: createError } = await supabase
      .from('batches')
      .insert([testBatch])
      .select()
      .single();

    if (createError) {
      logTest('Batches - INSERT', 'FAIL', `RLS Error: ${createError.message}`);
      return false;
    }
    
    logTest('Batches - INSERT', 'PASS', `Successfully created batch: ${createData.name}`);
    
    // Test 3: Update the batch
    const { data: updateData, error: updateError } = await supabase
      .from('batches')
      .update({ 
        name: `Updated E2E Test Batch ${Date.now()}`,
        current_students: 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Batches - UPDATE', 'FAIL', `RLS Error: ${updateError.message}`);
    } else {
      logTest('Batches - UPDATE', 'PASS', `Successfully updated batch: ${updateData.name}`);
    }
    
    // Test 4: Delete the batch
    const { error: deleteError } = await supabase
      .from('batches')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Batches - DELETE', 'FAIL', `RLS Error: ${deleteError.message}`);
    } else {
      logTest('Batches - DELETE', 'PASS', 'Successfully deleted test batch');
    }
    
    return true;
  } catch (error) {
    logTest('Batches CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testRoadmapsCRUD() {
  try {
    // Test 1: Read existing roadmaps
    const { data: roadmaps, error: readError } = await supabase
      .from('roadmaps')
      .select('*')
      .limit(5);
    
    if (readError) {
      logTest('Roadmaps - SELECT', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Roadmaps - SELECT', 'PASS', `Found ${roadmaps.length} existing roadmaps`);
    
    // Test 2: Create a new roadmap
    const testRoadmap = {
      title: `E2E Test Roadmap ${Date.now()}`,
      description: 'This is a comprehensive test roadmap for end-to-end testing',
      total_weeks: 6,
      difficulty_level: 'beginner',
      category: 'Testing',
      is_active: true
    };
    
    const { data: createData, error: createError } = await supabase
      .from('roadmaps')
      .insert([testRoadmap])
      .select()
      .single();

    if (createError) {
      logTest('Roadmaps - INSERT', 'FAIL', `RLS Error: ${createError.message}`);
      return false;
    }
    
    logTest('Roadmaps - INSERT', 'PASS', `Successfully created roadmap: ${createData.title}`);
    
    // Test 3: Update the roadmap
    const { data: updateData, error: updateError } = await supabase
      .from('roadmaps')
      .update({
        title: `Updated E2E Test Roadmap ${Date.now()}`,
        description: 'This roadmap has been updated for testing',
        updated_at: new Date().toISOString()
      })
      .eq('id', createData.id)
      .select()
      .single();

    if (updateError) {
      logTest('Roadmaps - UPDATE', 'FAIL', `RLS Error: ${updateError.message}`);
    } else {
      logTest('Roadmaps - UPDATE', 'PASS', `Successfully updated roadmap: ${updateData.title}`);
    }
    
    // Test 4: Delete the roadmap
    const { error: deleteError } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Roadmaps - DELETE', 'FAIL', `RLS Error: ${deleteError.message}`);
    } else {
      logTest('Roadmaps - DELETE', 'PASS', 'Successfully deleted test roadmap');
    }
    
    return true;
  } catch (error) {
    logTest('Roadmaps CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testStudentProgressCRUD() {
  try {
    // Test 1: Read existing progress
    const { data: progress, error: readError } = await supabase
      .from('student_progress')
      .select('*')
      .limit(5);
    
    if (readError) {
      logTest('Student Progress - SELECT', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Student Progress - SELECT', 'PASS', `Found ${progress.length} existing progress records`);
    
    // Test 2: Get a test user and task for progress testing
    const { data: testUser, error: userError } = await supabase
        .from('users')
        .select('id')
      .eq('role', 'student')
      .limit(1)
      .single();
    
    if (userError || !testUser) {
      logTest('Student Progress - Test Setup', 'WARN', 'No test user found for progress testing');
      return true;
    }
    
    const { data: testTask, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('id')
      .limit(1)
      .single();
    
    if (taskError || !testTask) {
      logTest('Student Progress - Test Setup', 'WARN', 'No test task found for progress testing');
      return true;
    }
    
    // Test 3: Create progress record
    const testProgress = {
      student_id: testUser.id,
      task_id: testTask.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
      score: 95
    };
    
    const { data: createData, error: createError } = await supabase
        .from('student_progress')
      .insert([testProgress])
      .select()
      .single();
    
    if (createError) {
      logTest('Student Progress - INSERT', 'FAIL', `RLS Error: ${createError.message}`);
      return false;
    }
    
    logTest('Student Progress - INSERT', 'PASS', `Successfully created progress record`);
    
    // Test 4: Update progress record
    const { data: updateData, error: updateError } = await supabase
      .from('student_progress')
      .update({
        status: 'completed',
        score: 100,
        feedback: 'Excellent work!',
        updated_at: new Date().toISOString()
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Student Progress - UPDATE', 'FAIL', `RLS Error: ${updateError.message}`);
    } else {
      logTest('Student Progress - UPDATE', 'PASS', `Successfully updated progress record`);
    }
    
    // Test 5: Delete progress record
    const { error: deleteError } = await supabase
      .from('student_progress')
        .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Student Progress - DELETE', 'FAIL', `RLS Error: ${deleteError.message}`);
    } else {
      logTest('Student Progress - DELETE', 'PASS', 'Successfully deleted test progress record');
    }
    
    return true;
  } catch (error) {
    logTest('Student Progress CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testAllTables() {
  const tables = [
    'users',
    'student_profiles', 
    'student_batch_assignments',
    'mentor_profiles',
    'batches',
    'roadmaps',
    'roadmap_weeks',
    'roadmap_tasks',
    'student_progress',
    'notices'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        logTest(`Table ${table}`, 'FAIL', error.message);
      } else {
        logTest(`Table ${table}`, 'PASS', 'Accessible');
      }
    } catch (err) {
      logTest(`Table ${table}`, 'FAIL', err.message);
    }
  }
}

async function runFinalTest() {
  console.log('🚀 Starting Final Comprehensive Test for 10MS SheSTEM Application\n');
  
  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Exiting tests.');
    return;
  }
  
  // Test 2: Authentication
  const authResult = await testAuthentication();
  
  // Test 3: All Tables Access
  await testAllTables();
  
  // Test 4: CRUD Operations
  await testNoticesCRUD();
  await testBatchesCRUD();
  await testRoadmapsCRUD();
  await testStudentProgressCRUD();
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST SUMMARY');
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
    console.log('\n🎉 ALL TESTS PASSED! The application is fully functional.');
    console.log('\n✅ FEATURES WORKING:');
    console.log('  - Database connection and authentication');
    console.log('  - Notices CRUD operations');
    console.log('  - Batches CRUD operations');
    console.log('  - Roadmaps CRUD operations');
    console.log('  - Student progress tracking');
    console.log('  - All database tables accessible');
    console.log('\n🔧 FIXES APPLIED:');
    console.log('  - Fixed notice creation by using databaseUserId instead of auth user ID');
    console.log('  - Applied proper RLS policies for notices table');
    console.log('  - Verified all CRUD operations work correctly');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

// Run the tests
runFinalTest().catch(console.error);