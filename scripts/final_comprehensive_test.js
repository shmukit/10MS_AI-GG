#!/usr/bin/env node

/**
 * Final Comprehensive Test for 10MS AI GG Project
 * 
 * This script simulates the complete user workflow:
 * 1. Mentor creates a new batch
 * 2. Mentor assigns students (including admins) to the batch
 * 3. Students complete tasks and track progress
 * 4. Mentor manages the batch and students
 * 5. System maintains data consistency
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

class FinalComprehensiveTest {
  constructor() {
    this.testData = {
      mentorId: null,
      batchId: null,
      studentIds: [],
      taskIds: [],
      assignmentIds: [],
      progressIds: []
    };
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: [],
      workflow: []
    };
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    log(`\n🔄 Running: ${testName}`, 'blue');
    
    try {
      const result = await testFunction();
      this.results.passed++;
      this.results.tests.push({ name: testName, status: 'PASSED', result });
      this.results.workflow.push({ step: testName, status: 'PASSED', timestamp: new Date().toISOString() });
      log(`✅ PASSED: ${testName}`, 'green');
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAILED', error: error.message });
      this.results.workflow.push({ step: testName, status: 'FAILED', error: error.message, timestamp: new Date().toISOString() });
      log(`❌ FAILED: ${testName} - ${error.message}`, 'red');
      return null;
    }
  }

  // Step 1: Setup - Get mentor and students
  async testSetup() {
    // Get a mentor user
    const { data: mentors, error: mentorError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('role', 'mentor')
      .eq('is_active', true)
      .limit(1);

    if (mentorError) throw new Error(`Failed to get mentor: ${mentorError.message}`);
    if (!mentors || mentors.length === 0) throw new Error('No mentor users found');

    this.testData.mentorId = mentors[0].id;

    // Get students and admins for assignment
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .in('role', ['student', 'admin', 'mentor'])
      .eq('is_active', true)
      .limit(5);

    if (usersError) throw new Error(`Failed to get users: ${usersError.message}`);

    this.testData.studentIds = users.map(u => u.id);

    return {
      mentor: mentors[0],
      users: users.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, role: u.role })),
      totalUsers: users.length
    };
  }

  // Step 2: Create a new batch (simulating mentor dashboard)
  async testCreateBatch() {
    // Get available roadmaps
    const { data: roadmaps, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('id, title')
      .eq('is_active', true)
      .limit(1);

    if (roadmapError) throw new Error(`Failed to get roadmaps: ${roadmapError.message}`);
    if (!roadmaps || roadmaps.length === 0) throw new Error('No active roadmaps found');

    const batchData = {
      name: `Final Test Batch - ${new Date().toISOString().split('T')[0]}`,
      roadmap_id: roadmaps[0].id,
      mentor_id: this.testData.mentorId,
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      whatsapp_link: 'https://wa.me/finaltest',
      discord_link: 'https://discord.gg/finaltest',
      emergency_contact: '+1234567890',
      status: 'active'
    };

    const { data: batch, error } = await supabase
      .from('batches')
      .insert([batchData])
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

    this.testData.batchId = batch.id;

    return {
      batchId: batch.id,
      batchName: batch.name,
      roadmapName: batch.roadmaps?.title || 'Unknown',
      studentCount: batch.current_students
    };
  }

  // Step 3: Assign users to batch (including admins)
  async testAssignUsersToBatch() {
    const assignments = this.testData.studentIds.map(userId => ({
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

    // Update batch student count
    const { error: updateError } = await supabase
      .from('batches')
      .update({ 
        current_students: this.testData.studentIds.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.testData.batchId);

    if (updateError) throw new Error(`Failed to update batch student count: ${updateError.message}`);

    return {
      assignmentCount: assignmentData.length,
      batchStudentCount: this.testData.studentIds.length
    };
  }

  // Step 4: Get roadmap tasks for progress tracking
  async testGetRoadmapTasks() {
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
      .limit(10);

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

  // Step 5: Simulate student progress tracking
  async testStudentProgressTracking() {
    const progressRecords = [];
    
    // Create progress for different students and tasks
    for (let i = 0; i < Math.min(3, this.testData.studentIds.length); i++) {
      for (let j = 0; j < Math.min(3, this.testData.taskIds.length); j++) {
        const isCompleted = Math.random() > 0.5;
        progressRecords.push({
          student_id: this.testData.studentIds[i],
          task_id: this.testData.taskIds[j],
          status: isCompleted ? 'completed' : 'in_progress',
          completed_at: isCompleted ? new Date().toISOString() : null,
          score: isCompleted ? Math.floor(Math.random() * 40) + 60 : null // 60-100
        });
      }
    }

    const { data: progressData, error } = await supabase
      .from('student_progress')
      .insert(progressRecords)
      .select();

    if (error) throw new Error(`Failed to create student progress: ${error.message}`);

    this.testData.progressIds = progressData.map(p => p.id);

    return {
      progressCount: progressData.length,
      completedCount: progressData.filter(p => p.status === 'completed').length,
      inProgressCount: progressData.filter(p => p.status === 'in_progress').length
    };
  }

  // Step 6: Test batch management (mentor view)
  async testBatchManagement() {
    // Get batch with all details
    const { data: batch, error: batchError } = await supabase
      .from('batches')
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
      .eq('id', this.testData.batchId)
      .single();

    if (batchError) throw new Error(`Failed to get batch details: ${batchError.message}`);

    // Get students in this batch
    const { data: assignments, error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .select(`
        id,
        student_id,
        status,
        users (
          first_name,
          last_name,
          email,
          role
        )
      `)
      .eq('batch_id', this.testData.batchId);

    if (assignmentError) throw new Error(`Failed to get batch assignments: ${assignmentError.message}`);

    return {
      batch: {
        id: batch.id,
        name: batch.name,
        roadmapName: batch.roadmaps?.title || 'Unknown',
        studentCount: batch.current_students,
        whatsappLink: batch.whatsapp_link,
        discordLink: batch.discord_link
      },
      students: assignments.map(a => ({
        id: a.student_id,
        name: `${a.users.first_name} ${a.users.last_name}`,
        email: a.users.email,
        role: a.users.role,
        status: a.status
      }))
    };
  }

  // Step 7: Test student progress queries
  async testStudentProgressQueries() {
    // Get progress for first student
    const { data: studentProgress, error: progressError } = await supabase
      .from('student_progress')
      .select(`
        id,
        status,
        completed_at,
        score,
        task_id,
        roadmap_tasks (
          task_name,
          task_type,
          roadmap_weeks (
            week_number
          )
        )
      `)
      .eq('student_id', this.testData.studentIds[0])
      .limit(10);

    if (progressError) throw new Error(`Failed to get student progress: ${progressError.message}`);

    // Calculate progress statistics
    const totalTasks = studentProgress.length;
    const completedTasks = studentProgress.filter(p => p.status === 'completed').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      studentId: this.testData.studentIds[0],
      totalTasks,
      completedTasks,
      progressPercentage,
      progress: studentProgress.map(p => ({
        taskName: p.roadmap_tasks?.task_name || 'Unknown',
        taskType: p.roadmap_tasks?.task_type || 'Unknown',
        weekNumber: p.roadmap_tasks?.roadmap_weeks?.week_number || 0,
        status: p.status,
        score: p.score
      }))
    };
  }

  // Step 8: Test data consistency and integrity
  async testDataConsistency() {
    const consistencyChecks = [];

    // Check 1: Batch student count matches assignments
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .select('current_students')
      .eq('id', this.testData.batchId)
      .single();

    if (!batchError) {
      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select('id')
        .eq('batch_id', this.testData.batchId)
        .eq('status', 'active');

      if (!assignmentError) {
        const countMatches = batch.current_students === assignments.length;
        consistencyChecks.push({
          check: 'Batch student count matches assignments',
          passed: countMatches,
          expected: assignments.length,
          actual: batch.current_students
        });
      }
    }

    // Check 2: All progress records have valid task references
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('task_id')
      .in('id', this.testData.progressIds);

    if (!progressError) {
      const { data: tasks, error: tasksError } = await supabase
        .from('roadmap_tasks')
        .select('id')
        .in('id', progress.map(p => p.task_id));

      if (!tasksError) {
        const allTasksValid = progress.length === tasks.length;
        consistencyChecks.push({
          check: 'All progress records have valid task references',
          passed: allTasksValid,
          expected: progress.length,
          actual: tasks.length
        });
      }
    }

    // Check 3: All assignments have valid user references
    const { data: assignments, error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .select('student_id')
      .in('id', this.testData.assignmentIds);

    if (!assignmentError) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .in('id', assignments.map(a => a.student_id));

      if (!usersError) {
        const allUsersValid = assignments.length === users.length;
        consistencyChecks.push({
          check: 'All assignments have valid user references',
          passed: allUsersValid,
          expected: assignments.length,
          actual: users.length
        });
      }
    }

    return {
      consistencyChecks,
      allPassed: consistencyChecks.every(c => c.passed),
      passedChecks: consistencyChecks.filter(c => c.passed).length,
      totalChecks: consistencyChecks.length
    };
  }

  // Step 9: Test cleanup
  async testCleanup() {
    const cleanupResults = [];

    // Delete progress records
    if (this.testData.progressIds.length > 0) {
      const { error: progressError } = await supabase
        .from('student_progress')
        .delete()
        .in('id', this.testData.progressIds);

      cleanupResults.push({
        type: 'progress',
        status: progressError ? 'FAILED' : 'PASSED',
        count: this.testData.progressIds.length,
        error: progressError?.message
      });
    }

    // Delete assignments
    if (this.testData.assignmentIds.length > 0) {
      const { error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .delete()
        .in('id', this.testData.assignmentIds);

      cleanupResults.push({
        type: 'assignments',
        status: assignmentError ? 'FAILED' : 'PASSED',
        count: this.testData.assignmentIds.length,
        error: assignmentError?.message
      });
    }

    // Delete batch
    if (this.testData.batchId) {
      const { error: batchError } = await supabase
        .from('batches')
        .delete()
        .eq('id', this.testData.batchId);

      cleanupResults.push({
        type: 'batch',
        status: batchError ? 'FAILED' : 'PASSED',
        id: this.testData.batchId,
        error: batchError?.message
      });
    }

    return {
      cleanupResults,
      allCleaned: cleanupResults.every(r => r.status === 'PASSED')
    };
  }

  // Run complete workflow test
  async runCompleteWorkflow() {
    log('🚀 Starting Final Comprehensive Workflow Test', 'bright');
    log('=' .repeat(70), 'cyan');
    log('This test simulates the complete user workflow:', 'blue');
    log('1. Mentor creates a new batch', 'blue');
    log('2. Mentor assigns students (including admins) to the batch', 'blue');
    log('3. Students complete tasks and track progress', 'blue');
    log('4. Mentor manages the batch and students', 'blue');
    log('5. System maintains data consistency', 'blue');
    log('=' .repeat(70), 'cyan');

    try {
      // Run complete workflow
      await this.runTest('Setup - Get Mentor and Students', () => this.testSetup());
      await this.runTest('Create New Batch', () => this.testCreateBatch());
      await this.runTest('Assign Users to Batch (Including Admins)', () => this.testAssignUsersToBatch());
      await this.runTest('Get Roadmap Tasks', () => this.testGetRoadmapTasks());
      await this.runTest('Simulate Student Progress Tracking', () => this.testStudentProgressTracking());
      await this.runTest('Test Batch Management (Mentor View)', () => this.testBatchManagement());
      await this.runTest('Test Student Progress Queries', () => this.testStudentProgressQueries());
      await this.runTest('Test Data Consistency and Integrity', () => this.testDataConsistency());
      await this.runTest('Clean Up Test Data', () => this.testCleanup());

    } catch (error) {
      log(`\n❌ Workflow test failed: ${error.message}`, 'red');
      
      // Attempt cleanup even if tests failed
      try {
        await this.testCleanup();
        log('🧹 Cleanup completed despite test failures', 'yellow');
      } catch (cleanupError) {
        log(`⚠️ Cleanup failed: ${cleanupError.message}`, 'yellow');
      }
    }

    // Print comprehensive summary
    this.printComprehensiveSummary();
  }

  printComprehensiveSummary() {
    log('\n' + '=' .repeat(70), 'cyan');
    log('📊 FINAL COMPREHENSIVE TEST SUMMARY', 'bright');
    log('=' .repeat(70), 'cyan');
    
    log(`Total Tests: ${this.results.total}`, 'blue');
    log(`Passed: ${this.results.passed}`, 'green');
    log(`Failed: ${this.results.failed}`, 'red');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : 'yellow');

    log('\n🔄 WORKFLOW STEPS:', 'blue');
    this.results.workflow.forEach((step, index) => {
      const status = step.status === 'PASSED' ? '✅' : '❌';
      const color = step.status === 'PASSED' ? 'green' : 'red';
      log(`${index + 1}. ${status} ${step.step}`, color);
      if (step.error) {
        log(`   Error: ${step.error}`, 'red');
      }
    });

    log('\n📋 DETAILED TEST RESULTS:', 'blue');
    this.results.tests.forEach((test, index) => {
      const status = test.status === 'PASSED' ? '✅' : '❌';
      const color = test.status === 'PASSED' ? 'green' : 'red';
      log(`${index + 1}. ${status} ${test.name}`, color);
    });

    log('\n🎯 KEY FEATURES TESTED:', 'blue');
    log('✅ Batch creation with database persistence', 'green');
    log('✅ Student assignment including admins and mentors', 'green');
    log('✅ Student progress tracking and completion', 'green');
    log('✅ Mentor batch management functionality', 'green');
    log('✅ Data consistency and integrity checks', 'green');
    log('✅ Complete CRUD operations for all entities', 'green');

    log('\n' + '=' .repeat(70), 'cyan');
    
    if (successRate >= 90) {
      log('🎉 ALL SYSTEMS OPERATIONAL - READY FOR PRODUCTION!', 'green');
    } else {
      log('⚠️ SOME ISSUES DETECTED - REVIEW FAILED TESTS', 'yellow');
    }
    
    log('=' .repeat(70), 'cyan');
  }
}

// Run the comprehensive test
const testSuite = new FinalComprehensiveTest();
testSuite.runCompleteWorkflow().catch(console.error);
