#!/usr/bin/env node

/**
 * Comprehensive End-to-End Test for 10MS AI GG Project
 * 
 * This script tests all major features:
 * 1. User authentication and role management
 * 2. Student progress tracking
 * 3. Task completion functionality
 * 4. Batch assignments
 * 5. Roadmap data access
 * 6. Database consistency
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

class E2ETestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    log(`\n🧪 Running: ${testName}`, 'blue');
    
    try {
      const result = await testFunction();
      if (result) {
        this.results.passed++;
        this.results.tests.push({ name: testName, status: 'PASSED' });
        log(`✅ ${testName} - PASSED`, 'green');
        return true;
      } else {
        this.results.failed++;
        this.results.tests.push({ name: testName, status: 'FAILED' });
        log(`❌ ${testName} - FAILED`, 'red');
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAILED', error: error.message });
      log(`❌ ${testName} - FAILED: ${error.message}`, 'red');
      return false;
    }
  }

  async testDatabaseConnection() {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return !error;
  }

  async testUserDataAccess() {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name')
      .limit(10);
    
    if (error) return false;
    
    log(`  Found ${users.length} users`, 'yellow');
    users.forEach(user => {
      log(`    - ${user.email} (${user.role})`, 'yellow');
    });
    
    return users.length > 0;
  }

  async testStudentProgressAccess() {
    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('*')
      .limit(5);
    
    if (error) return false;
    
    log(`  Found ${progress.length} progress records`, 'yellow');
    return true;
  }

  async testTaskCompletion() {
    // Get a test user
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .limit(1)
      .single();
    
    if (userError || !testUser) return false;
    
    // Get a test task
    const { data: testTask, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(1)
      .single();
    
    if (taskError || !testTask) return false;
    
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
    
    if (progressError) return false;
    
    // Clean up test data
    await supabase
      .from('student_progress')
      .delete()
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id);
    
    log(`  Tested with user: ${testUser.email}`, 'yellow');
    log(`  Tested with task: ${testTask.task_name}`, 'yellow');
    
    return true;
  }

  async testBatchAssignments() {
    const { data: assignments, error } = await supabase
      .from('student_batch_assignments')
      .select(`
        *,
        users!student_batch_assignments_student_id_fkey(id, email, first_name, last_name),
        batches!student_batch_assignments_batch_id_fkey(id, name, status)
      `)
      .limit(5);
    
    if (error) return false;
    
    log(`  Found ${assignments.length} batch assignments`, 'yellow');
    return true;
  }

  async testRoadmapData() {
    // Test roadmaps
    const { data: roadmaps, error: roadmapsError } = await supabase
      .from('roadmaps')
      .select('*')
      .limit(5);
    
    if (roadmapsError) return false;
    
    // Test roadmap weeks
    const { data: weeks, error: weeksError } = await supabase
      .from('roadmap_weeks')
      .select('*')
      .limit(10);
    
    if (weeksError) return false;
    
    // Test roadmap tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(20);
    
    if (tasksError) return false;
    
    log(`  Found ${roadmaps.length} roadmaps`, 'yellow');
    log(`  Found ${weeks.length} roadmap weeks`, 'yellow');
    log(`  Found ${tasks.length} roadmap tasks`, 'yellow');
    
    return true;
  }

  async testStudentProfiles() {
    const { data: profiles, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        users!student_profiles_user_id_fkey(id, email, first_name, last_name)
      `)
      .limit(5);
    
    if (error) return false;
    
    log(`  Found ${profiles.length} student profiles`, 'yellow');
    return true;
  }

  async testNotices() {
    const { data: notices, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .limit(5);
    
    if (error) return false;
    
    log(`  Found ${notices.length} published notices`, 'yellow');
    return true;
  }

  async testForeignKeys() {
    // Test that all foreign key relationships are valid
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select(`
        student_id,
        task_id,
        users!student_progress_student_id_fkey(id, email),
        roadmap_tasks!student_progress_task_id_fkey(id, task_name)
      `)
      .limit(10);
    
    if (progressError) return false;
    
    // Check for any null references
    const invalidRefs = progress.filter(p => !p.users || !p.roadmap_tasks);
    if (invalidRefs.length > 0) {
      log(`  Found ${invalidRefs.length} invalid foreign key references`, 'red');
      return false;
    }
    
    log(`  All ${progress.length} foreign key references are valid`, 'yellow');
    return true;
  }

  async testDataConsistency() {
    // Check that all student_progress records have valid student_id
    const { data: allProgress, error: progressError } = await supabase
      .from('student_progress')
      .select('student_id');
    
    if (progressError) return false;
    
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id');
    
    if (usersError) return false;
    
    const userIds = new Set(allUsers.map(u => u.id));
    const orphanedProgress = allProgress.filter(p => !userIds.has(p.student_id));
    
    if (orphanedProgress.length > 0) {
      log(`  Found ${orphanedProgress.length} orphaned progress records`, 'red');
      return false;
    }
    
    log(`  All ${allProgress.length} progress records have valid student references`, 'yellow');
    return true;
  }

  async testTaskUpdateWorkflow() {
    // Simulate the complete task update workflow
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .limit(1)
      .single();
    
    if (userError || !testUser) return false;
    
    const { data: testTask, error: taskError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(1)
      .single();
    
    if (taskError || !testTask) return false;
    
    // Test the exact workflow from the frontend
    const { error: upsertError } = await supabase
      .from('student_progress')
      .upsert({
        student_id: testUser.id,
        task_id: testTask.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (upsertError) {
      log(`  Upsert failed: ${upsertError.message}`, 'red');
      return false;
    }
    
    // Verify the update was successful
    const { data: updatedProgress, error: verifyError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id)
      .single();
    
    if (verifyError || !updatedProgress) return false;
    
    // Clean up
    await supabase
      .from('student_progress')
      .delete()
      .eq('student_id', testUser.id)
      .eq('task_id', testTask.id);
    
    log(`  Complete workflow test passed for user: ${testUser.email}`, 'yellow');
    return true;
  }

  async runAllTests() {
    log('🚀 Starting Comprehensive End-to-End Test Suite\n', 'bright');
    log('='.repeat(60), 'cyan');
    
    // Core functionality tests
    await this.runTest('Database Connection', () => this.testDatabaseConnection());
    await this.runTest('User Data Access', () => this.testUserDataAccess());
    await this.runTest('Student Progress Access', () => this.testStudentProgressAccess());
    await this.runTest('Task Completion', () => this.testTaskCompletion());
    await this.runTest('Batch Assignments', () => this.testBatchAssignments());
    await this.runTest('Roadmap Data', () => this.testRoadmapData());
    await this.runTest('Student Profiles', () => this.testStudentProfiles());
    await this.runTest('Notices', () => this.testNotices());
    
    // Data integrity tests
    await this.runTest('Foreign Key Constraints', () => this.testForeignKeys());
    await this.runTest('Data Consistency', () => this.testDataConsistency());
    
    // Workflow tests
    await this.runTest('Complete Task Update Workflow', () => this.testTaskUpdateWorkflow());
    
    this.generateReport();
  }

  generateReport() {
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 TEST RESULTS SUMMARY', 'bright');
    log('='.repeat(60), 'cyan');
    
    log(`\n📈 Overall Results:`, 'blue');
    log(`  Total Tests: ${this.results.total}`, 'blue');
    log(`  Passed: ${this.results.passed}`, 'green');
    log(`  Failed: ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'green');
    log(`  Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`, 
        this.results.failed === 0 ? 'green' : 'yellow');
    
    if (this.results.failed > 0) {
      log(`\n❌ Failed Tests:`, 'red');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          log(`  • ${test.name}`, 'red');
          if (test.error) {
            log(`    Error: ${test.error}`, 'red');
          }
        });
    }
    
    log(`\n✅ Passed Tests:`, 'green');
    this.results.tests
      .filter(test => test.status === 'PASSED')
      .forEach(test => {
        log(`  • ${test.name}`, 'green');
      });
    
    if (this.results.failed === 0) {
      log('\n🎉 ALL TESTS PASSED! The application is ready for use.', 'green');
      log('\n📋 Next Steps:', 'cyan');
      log('1. Start the development server: npm run dev', 'blue');
      log('2. Open the application in your browser', 'blue');
      log('3. Test the task completion functionality in the roadmap page', 'blue');
      log('4. Verify that students can update their weekly tasks', 'blue');
    } else {
      log('\n⚠️ Some tests failed. Please review the errors above.', 'yellow');
    }
    
    log('\n' + '='.repeat(60), 'cyan');
  }
}

async function main() {
  try {
    const testSuite = new E2ETestSuite();
    await testSuite.runAllTests();
  } catch (error) {
    log(`\n💥 Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test suite
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { E2ETestSuite };
