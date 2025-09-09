#!/usr/bin/env node

/**
 * Comprehensive End-to-End Test for 10MS SheSTEM Application
 * Tests all features: Authentication, Notices, Students, Batches, Roadmaps, Progress
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

// Test user credentials
const testUsers = {
  mentor: {
    email: 'mentor@10minuteschool.com',
    password: 'TestPassword123!'
  },
  student: {
    email: 'student@10minuteschool.com', 
    password: 'TestPassword123!'
  }
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
    // Test mentor login
    const { data: mentorData, error: mentorError } = await supabase.auth.signInWithPassword({
      email: testUsers.mentor.email,
      password: testUsers.mentor.password
    });
    
    if (mentorError) {
      logTest('Mentor Authentication', 'FAIL', mentorError.message);
      return false;
    }
    
    logTest('Mentor Authentication', 'PASS', `Logged in as ${mentorData.user?.email}`);
    
    // Test student login
    const { data: studentData, error: studentError } = await supabase.auth.signInWithPassword({
      email: testUsers.student.email,
      password: testUsers.student.password
    });
    
    if (studentError) {
      logTest('Student Authentication', 'FAIL', studentError.message);
      return false;
    }
    
    logTest('Student Authentication', 'PASS', `Logged in as ${studentData.user?.email}`);
    
    return { mentor: mentorData.user, student: studentData.user };
  } catch (error) {
    logTest('Authentication', 'FAIL', error.message);
    return false;
  }
}

async function testNoticesCRUD(user) {
  try {
    // Switch to mentor user for notice operations
    await supabase.auth.signInWithPassword({
      email: testUsers.mentor.email,
      password: testUsers.mentor.password
    });
    
    // Test 1: Create Notice
    const testNotice = {
      title: `Test Notice ${Date.now()}`,
      content: 'This is a test notice for E2E testing',
      tag: 'Test',
      priority: 'medium',
      is_published: true,
      author_id: user.id,
      batch_id: null
    };
    
    const { data: createData, error: createError } = await supabase
      .from('notices')
      .insert([testNotice])
      .select()
      .single();
    
    if (createError) {
      logTest('Notice Creation', 'FAIL', createError.message);
      return false;
    }
    
    logTest('Notice Creation', 'PASS', `Created notice: ${createData.title}`);
    
    // Test 2: Read Notice
    const { data: readData, error: readError } = await supabase
      .from('notices')
      .select('*')
      .eq('id', createData.id)
      .single();
    
    if (readError) {
      logTest('Notice Reading', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Notice Reading', 'PASS', `Read notice: ${readData.title}`);
    
    // Test 3: Update Notice
    const { data: updateData, error: updateError } = await supabase
      .from('notices')
      .update({ 
        title: `Updated Test Notice ${Date.now()}`,
        content: 'This notice has been updated for testing'
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Notice Update', 'FAIL', updateError.message);
      return false;
    }
    
    logTest('Notice Update', 'PASS', `Updated notice: ${updateData.title}`);
    
    // Test 4: Delete Notice
    const { error: deleteError } = await supabase
      .from('notices')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Notice Deletion', 'FAIL', deleteError.message);
      return false;
    }
    
    logTest('Notice Deletion', 'PASS', 'Successfully deleted test notice');
    
    return true;
  } catch (error) {
    logTest('Notices CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testBatchesCRUD(user) {
  try {
    // Test 1: Create Batch
    const testBatch = {
      name: `Test Batch ${Date.now()}`,
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      mentor_id: user.id
    };
    
    const { data: createData, error: createError } = await supabase
      .from('batches')
      .insert([testBatch])
      .select()
      .single();
    
    if (createError) {
      logTest('Batch Creation', 'FAIL', createError.message);
      return false;
    }
    
    logTest('Batch Creation', 'PASS', `Created batch: ${createData.name}`);
    
    // Test 2: Read Batch
    const { data: readData, error: readError } = await supabase
      .from('batches')
      .select('*')
      .eq('id', createData.id)
      .single();
    
    if (readError) {
      logTest('Batch Reading', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Batch Reading', 'PASS', `Read batch: ${readData.name}`);
    
    // Test 3: Update Batch
    const { data: updateData, error: updateError } = await supabase
      .from('batches')
      .update({ 
        name: `Updated Test Batch ${Date.now()}`,
        current_students: 1
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Batch Update', 'FAIL', updateError.message);
      return false;
    }
    
    logTest('Batch Update', 'PASS', `Updated batch: ${updateData.name}`);
    
    // Test 4: Delete Batch
    const { error: deleteError } = await supabase
      .from('batches')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Batch Deletion', 'FAIL', deleteError.message);
      return false;
    }
    
    logTest('Batch Deletion', 'PASS', 'Successfully deleted test batch');
    
    return true;
  } catch (error) {
    logTest('Batches CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testRoadmapsCRUD(user) {
  try {
    // Test 1: Create Roadmap
    const testRoadmap = {
      title: `Test Roadmap ${Date.now()}`,
      description: 'This is a test roadmap for E2E testing',
      total_weeks: 6,
      difficulty_level: 'beginner',
      category: 'Programming',
      is_active: true
    };
    
    const { data: createData, error: createError } = await supabase
      .from('roadmaps')
      .insert([testRoadmap])
      .select()
      .single();
    
    if (createError) {
      logTest('Roadmap Creation', 'FAIL', createError.message);
      return false;
    }
    
    logTest('Roadmap Creation', 'PASS', `Created roadmap: ${createData.title}`);
    
    // Test 2: Read Roadmap
    const { data: readData, error: readError } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', createData.id)
      .single();
    
    if (readError) {
      logTest('Roadmap Reading', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Roadmap Reading', 'PASS', `Read roadmap: ${readData.title}`);
    
    // Test 3: Update Roadmap
    const { data: updateData, error: updateError } = await supabase
      .from('roadmaps')
      .update({ 
        title: `Updated Test Roadmap ${Date.now()}`,
        description: 'This roadmap has been updated for testing'
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Roadmap Update', 'FAIL', updateError.message);
      return false;
    }
    
    logTest('Roadmap Update', 'PASS', `Updated roadmap: ${updateData.title}`);
    
    // Test 4: Delete Roadmap
    const { error: deleteError } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      logTest('Roadmap Deletion', 'FAIL', deleteError.message);
      return false;
    }
    
    logTest('Roadmap Deletion', 'PASS', 'Successfully deleted test roadmap');
    
    return true;
  } catch (error) {
    logTest('Roadmaps CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testStudentProgressCRUD(user) {
  try {
    // First, we need to create a roadmap and task for progress testing
    const { data: roadmapData, error: roadmapError } = await supabase
      .from('roadmaps')
      .insert([{
        title: `Progress Test Roadmap ${Date.now()}`,
        description: 'Test roadmap for progress testing',
        total_weeks: 1,
        difficulty_level: 'beginner',
        category: 'Testing',
        is_active: true
      }])
      .select()
      .single();
    
    if (roadmapError) {
      logTest('Progress Test Setup', 'FAIL', roadmapError.message);
      return false;
    }
    
    // Create a week
    const { data: weekData, error: weekError } = await supabase
      .from('roadmap_weeks')
      .insert([{
        roadmap_id: roadmapData.id,
        week_number: 1,
        title: 'Test Week 1',
        description: 'Test week for progress testing',
        domain: 'Testing'
      }])
      .select()
      .single();
    
    if (weekError) {
      logTest('Progress Test Setup', 'FAIL', weekError.message);
      return false;
    }
    
    // Create a task
    const { data: taskData, error: taskError } = await supabase
      .from('roadmap_tasks')
      .insert([{
        week_id: weekData.id,
        task_name: 'Test Task',
        task_details: 'Test task for progress testing',
        task_type: 'read',
        points: 10,
        is_required: true
      }])
      .select()
      .single();
    
    if (taskError) {
      logTest('Progress Test Setup', 'FAIL', taskError.message);
      return false;
    }
    
    // Test 1: Create Student Progress
    const testProgress = {
      student_id: user.id,
      task_id: taskData.id,
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
      logTest('Student Progress Creation', 'FAIL', createError.message);
      return false;
    }
    
    logTest('Student Progress Creation', 'PASS', `Created progress for task: ${taskData.task_name}`);
    
    // Test 2: Read Student Progress
    const { data: readData, error: readError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('id', createData.id)
      .single();
    
    if (readError) {
      logTest('Student Progress Reading', 'FAIL', readError.message);
      return false;
    }
    
    logTest('Student Progress Reading', 'PASS', `Read progress: ${readData.status}`);
    
    // Test 3: Update Student Progress
    const { data: updateData, error: updateError } = await supabase
      .from('student_progress')
      .update({ 
        status: 'completed',
        score: 100,
        feedback: 'Excellent work!'
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      logTest('Student Progress Update', 'FAIL', updateError.message);
      return false;
    }
    
    logTest('Student Progress Update', 'PASS', `Updated progress: ${updateData.status}`);
    
    // Cleanup
    await supabase.from('student_progress').delete().eq('id', createData.id);
    await supabase.from('roadmap_tasks').delete().eq('id', taskData.id);
    await supabase.from('roadmap_weeks').delete().eq('id', weekData.id);
    await supabase.from('roadmaps').delete().eq('id', roadmapData.id);
    
    logTest('Student Progress Cleanup', 'PASS', 'Cleaned up test data');
    
    return true;
  } catch (error) {
    logTest('Student Progress CRUD', 'FAIL', error.message);
    return false;
  }
}

async function testRLSPolicies() {
  try {
    // Test if we can access different tables with different user roles
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);
    
    if (usersError) {
      logTest('RLS - Users Access', 'FAIL', usersError.message);
    } else {
      logTest('RLS - Users Access', 'PASS', `Can access users table: ${usersData.length} records`);
    }
    
    const { data: noticesData, error: noticesError } = await supabase
      .from('notices')
      .select('id, title, author_id')
      .limit(5);
    
    if (noticesError) {
      logTest('RLS - Notices Access', 'FAIL', noticesError.message);
    } else {
      logTest('RLS - Notices Access', 'PASS', `Can access notices table: ${noticesData.length} records`);
    }
    
    const { data: batchesData, error: batchesError } = await supabase
      .from('batches')
      .select('id, name, status')
      .limit(5);
    
    if (batchesError) {
      logTest('RLS - Batches Access', 'FAIL', batchesError.message);
    } else {
      logTest('RLS - Batches Access', 'PASS', `Can access batches table: ${batchesData.length} records`);
    }
    
    return true;
  } catch (error) {
    logTest('RLS Policies', 'FAIL', error.message);
    return false;
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive End-to-End Test for 10MS SheSTEM Application\n');
  
  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Database connection failed. Exiting tests.');
    return;
  }
  
  // Test 2: Authentication
  const authResult = await testAuthentication();
  if (!authResult) {
    console.log('\n❌ Authentication failed. Exiting tests.');
    return;
  }
  
  // Test 3: RLS Policies
  await testRLSPolicies();
  
  // Test 4: Notices CRUD (with mentor user)
  await testNoticesCRUD(authResult.mentor);
  
  // Test 5: Batches CRUD
  await testBatchesCRUD(authResult.mentor);
  
  // Test 6: Roadmaps CRUD
  await testRoadmapsCRUD(authResult.mentor);
  
  // Test 7: Student Progress CRUD (with student user)
  await testStudentProgressCRUD(authResult.student);
  
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
  
  // Save results to file
  const resultsFile = path.join(__dirname, 'test_results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  
  const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
  console.log(`\n🎯 Success Rate: ${successRate.toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! The application is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

// Run the tests
runComprehensiveTest().catch(console.error);