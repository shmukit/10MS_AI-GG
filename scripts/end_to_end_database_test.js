#!/usr/bin/env node

/**
 * End-to-End Database Test for 10MS AI GG Project
 * 
 * This script tests actual database operations:
 * 1. Create a test batch
 * 2. Assign users to the batch
 * 3. Test student progress tracking
 * 4. Test roadmap task management
 * 5. Clean up test data
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://hayhwvddwhgdvlxrxqun.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWh3dmRkd2hnZHZseHJ4cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODY1ODEsImV4cCI6MjA3MTc2MjU4MX0.nMtduZsKfoE9GT6DQPloXQIYd_6UcJV5UgX_mhgu1N8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Color codes for console output
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class E2EDatabaseTest {
  constructor() {
    this.testData = {
      batchId: null,
      userIds: [],
      taskIds: [],
      assignmentIds: [],
      progressIds: []
    };
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    log(`\n🔄 Running: ${testName}`, 'blue');
    
    try {
      const result = await testFunction();
      this.results.passed++;
      this.results.tests.push({ name: testName, status: 'PASSED', result });
      log(`✅ PASSED: ${testName}`, 'green');
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAILED', error: error.message });
      log(`❌ FAILED: ${testName} - ${error.message}`, 'red');
      return null;
    }
  }

  // Test 1: Get or create test users
  async testGetTestUsers() {
    // Get existing users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .in('role', ['student', 'admin', 'mentor'])
      .eq('is_active', true)
      .limit(5);

    if (error) throw new Error(`Failed to fetch users: ${error.message}`);

    this.testData.userIds = users.map(u => u.id);

    return {
      userCount: users.length,
      users: users.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, role: u.role }))
    };
  }

  // Test 2: Get available roadmaps
  async testGetRoadmaps() {
    const { data: roadmaps, error } = await supabase
      .from('roadmaps')
      .select('id, title, category')
      .eq('is_active', true)
      .limit(5);

    if (error) throw new Error(`Failed to fetch roadmaps: ${error.message}`);

    return {
      roadmapCount: roadmaps.length,
      roadmaps: roadmaps.map(r => ({ id: r.id, title: r.title, category: r.category }))
    };
  }

  // Test 3: Create test batch
  async testCreateBatch() {
    // Get first available roadmap
    const { data: roadmaps, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('id')
      .eq('is_active', true)
      .limit(1);

    if (roadmapError) throw new Error(`Failed to fetch roadmap: ${roadmapError.message}`);
    if (!roadmaps || roadmaps.length === 0) throw new Error('No active roadmaps found');

    const testBatchData = {
      name: `E2E Test Batch - ${new Date().toISOString()}`,
      roadmap_id: roadmaps[0].id,
      mentor_id: this.testData.userIds[0] || 'test-mentor-id',
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      whatsapp_link: 'https://wa.me/test',
      discord_link: 'https://discord.gg/test',
      emergency_contact: '+1234567890',
      status: 'active'
    };

    const { data: batchData, error } = await supabase
      .from('batches')
      .insert([testBatchData])
      .select(`
        id,
        name,
        roadmap_id,
        current_students,
        whatsapp_link,
        discord_link,
        emergency_contact,
        created_at,
        roadmaps (
          title
        )
      `)
      .single();

    if (error) throw new Error(`Failed to create batch: ${error.message}`);

    this.testData.batchId = batchData.id;

    return {
      batchId: batchData.id,
      batchName: batchData.name,
      roadmapName: batchData.roadmaps?.title || 'Unknown',
      studentCount: batchData.current_students
    };
  }

  // Test 4: Assign users to batch
  async testAssignUsersToBatch() {
    if (!this.testData.batchId || this.testData.userIds.length === 0) {
      throw new Error('No batch or users available for assignment');
    }

    const assignments = this.testData.userIds.map(userId => ({
      student_id: userId,
      batch_id: this.testData.batchId,
      status: 'active',
      enrollment_date: new Date().toISOString().split('T')[0]
    }));

    const { data: assignmentData, error } = await supabase
      .from('student_batch_assignments')
      .insert(assignments)
      .select();

    if (error) throw new Error(`Failed to assign users to batch: ${error.message}`);

    this.testData.assignmentIds = assignmentData.map(a => a.id);

    return {
      assignmentCount: assignmentData.length,
      assignments: assignmentData.map(a => ({ id: a.id, studentId: a.student_id, batchId: a.batch_id }))
    };
  }

  // Test 5: Get roadmap tasks
  async testGetRoadmapTasks() {
    if (!this.testData.batchId) {
      throw new Error('No batch available for task testing');
    }

    // Get batch roadmap
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select('roadmap_id')
      .eq('id', this.testData.batchId)
      .single();

    if (batchError) throw new Error(`Failed to get batch roadmap: ${batchError.message}`);

    // Get roadmap tasks
    const { data: tasks, error } = await supabase
      .from('roadmap_tasks')
      .select(`
        id,
        task_name,
        task_type,
        deadline,
        estimated_hours,
        week_id,
        roadmap_weeks (
          week_number,
          roadmap_id
        )
      `)
      .eq('roadmap_weeks.roadmap_id', batch.roadmap_id)
      .limit(5);

    if (error) throw new Error(`Failed to fetch roadmap tasks: ${error.message}`);

    this.testData.taskIds = tasks.map(t => t.id);

    return {
      taskCount: tasks.length,
      tasks: tasks.map(t => ({ 
        id: t.id, 
        name: t.task_name, 
        type: t.task_type,
        weekNumber: t.roadmap_weeks?.week_number || 0
      }))
    };
  }

  // Test 6: Create student progress
  async testCreateStudentProgress() {
    if (this.testData.userIds.length === 0 || this.testData.taskIds.length === 0) {
      throw new Error('No users or tasks available for progress testing');
    }

    const progressRecords = [];
    
    // Create progress for first user and first few tasks
    for (let i = 0; i < Math.min(3, this.testData.taskIds.length); i++) {
      progressRecords.push({
        student_id: this.testData.userIds[0],
        task_id: this.testData.taskIds[i],
        status: i === 0 ? 'completed' : 'in_progress',
        completed_at: i === 0 ? new Date().toISOString() : null,
        score: i === 0 ? 85.5 : null
      });
    }

    const { data: progressData, error } = await supabase
      .from('student_progress')
      .insert(progressRecords)
      .select();

    if (error) throw new Error(`Failed to create student progress: ${error.message}`);

    this.testData.progressIds = progressData.map(p => p.id);

    return {
      progressCount: progressData.length,
      progress: progressData.map(p => ({ 
        id: p.id, 
        studentId: p.student_id, 
        taskId: p.task_id, 
        status: p.status,
        score: p.score
      }))
    };
  }

  // Test 7: Update batch student count
  async testUpdateBatchStudentCount() {
    if (!this.testData.batchId) {
      throw new Error('No batch available for update testing');
    }

    const { data: updateData, error } = await supabase
      .from('batches')
      .update({ 
        current_students: this.testData.userIds.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.testData.batchId)
      .select('id, name, current_students')
      .single();

    if (error) throw new Error(`Failed to update batch student count: ${error.message}`);

    return {
      batchId: updateData.id,
      batchName: updateData.name,
      updatedStudentCount: updateData.current_students
    };
  }

  // Test 8: Verify data integrity
  async testDataIntegrity() {
    if (!this.testData.batchId) {
      throw new Error('No batch available for integrity testing');
    }

    // Verify batch exists
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select('*')
      .eq('id', this.testData.batchId)
      .single();

    if (batchError) throw new Error(`Batch not found: ${batchError.message}`);

    // Verify assignments exist
    const { data: assignments, error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .eq('batch_id', this.testData.batchId);

    if (assignmentError) throw new Error(`Assignments not found: ${assignmentError.message}`);

    // Verify progress exists
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .in('id', this.testData.progressIds);

    if (progressError) throw new Error(`Progress not found: ${progressError.message}`);

    return {
      batchExists: !!batch,
      assignmentCount: assignments.length,
      progressCount: progress.length,
      dataIntegrity: true
    };
  }

  // Test 9: Clean up test data
  async testCleanup() {
    const cleanupResults = [];

    // Delete progress records
    if (this.testData.progressIds.length > 0) {
      const { error: progressError } = await supabase
        .from('student_progress')
        .delete()
        .in('id', this.testData.progressIds);

      if (progressError) {
        cleanupResults.push({ type: 'progress', status: 'FAILED', error: progressError.message });
      } else {
        cleanupResults.push({ type: 'progress', status: 'PASSED', count: this.testData.progressIds.length });
      }
    }

    // Delete assignments
    if (this.testData.assignmentIds.length > 0) {
      const { error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .delete()
        .in('id', this.testData.assignmentIds);

      if (assignmentError) {
        cleanupResults.push({ type: 'assignments', status: 'FAILED', error: assignmentError.message });
      } else {
        cleanupResults.push({ type: 'assignments', status: 'PASSED', count: this.testData.assignmentIds.length });
      }
    }

    // Delete batch
    if (this.testData.batchId) {
      const { error: batchError } = await supabase
        .from('batches')
        .delete()
        .eq('id', this.testData.batchId);

      if (batchError) {
        cleanupResults.push({ type: 'batch', status: 'FAILED', error: batchError.message });
      } else {
        cleanupResults.push({ type: 'batch', status: 'PASSED', id: this.testData.batchId });
      }
    }

    return {
      cleanupResults: cleanupResults,
      allCleaned: cleanupResults.every(r => r.status === 'PASSED')
    };
  }

  // Run all tests
  async runAllTests() {
    log('🚀 Starting End-to-End Database Test Suite', 'bright');
    log('=' .repeat(60), 'cyan');

    try {
      // Run all tests
      await this.runTest('Get Test Users', () => this.testGetTestUsers());
      await this.runTest('Get Available Roadmaps', () => this.testGetRoadmaps());
      await this.runTest('Create Test Batch', () => this.testCreateBatch());
      await this.runTest('Assign Users to Batch', () => this.testAssignUsersToBatch());
      await this.runTest('Get Roadmap Tasks', () => this.testGetRoadmapTasks());
      await this.runTest('Create Student Progress', () => this.testCreateStudentProgress());
      await this.runTest('Update Batch Student Count', () => this.testUpdateBatchStudentCount());
      await this.runTest('Verify Data Integrity', () => this.testDataIntegrity());
      await this.runTest('Clean Up Test Data', () => this.testCleanup());

    } catch (error) {
      log(`\n❌ Test suite failed: ${error.message}`, 'red');
      
      // Attempt cleanup even if tests failed
      try {
        await this.testCleanup();
        log('🧹 Cleanup completed despite test failures', 'yellow');
      } catch (cleanupError) {
        log(`⚠️ Cleanup failed: ${cleanupError.message}`, 'yellow');
      }
    }

    // Print summary
    this.printSummary();
  }

  printSummary() {
    log('\n' + '=' .repeat(60), 'cyan');
    log('📊 E2E DATABASE TEST SUMMARY', 'bright');
    log('=' .repeat(60), 'cyan');
    
    log(`Total Tests: ${this.results.total}`, 'blue');
    log(`Passed: ${this.results.passed}`, 'green');
    log(`Failed: ${this.results.failed}`, 'red');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');

    log('\n📋 DETAILED RESULTS:', 'blue');
    this.results.tests.forEach((test, index) => {
      const status = test.status === 'PASSED' ? '✅' : '❌';
      const color = test.status === 'PASSED' ? 'green' : 'red';
      log(`${index + 1}. ${status} ${test.name}`, color);
    });

    log('\n' + '=' .repeat(60), 'cyan');
  }
}

// Run the test suite
const testSuite = new E2EDatabaseTest();
testSuite.runAllTests().catch(console.error);
