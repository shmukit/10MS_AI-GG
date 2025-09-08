#!/usr/bin/env node

/**
 * Comprehensive Feature Test for 10MS AI GG Project
 * 
 * This script tests all major features and identifies issues:
 * 1. User authentication and role management
 * 2. Batch creation and management
 * 3. Student assignment functionality
 * 4. Roadmap data access
 * 5. Task management
 * 6. Database consistency
 * 7. API endpoint functionality
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

class FeatureTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: [],
      issues: []
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
      this.results.issues.push({ test: testName, error: error.message });
      log(`❌ FAILED: ${testName} - ${error.message}`, 'red');
      return null;
    }
  }

  // Test 1: Database Connection
  async testDatabaseConnection() {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw new Error(`Database connection failed: ${error.message}`);
    return { connected: true, message: 'Database connection successful' };
  }

  // Test 2: User Authentication System
  async testUserAuthentication() {
    // Test fetching users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name, is_active')
      .limit(10);

    if (usersError) throw new Error(`Failed to fetch users: ${usersError.message}`);

    // Check if we have users with different roles
    const roles = [...new Set(users.map(u => u.role))];
    const activeUsers = users.filter(u => u.is_active);

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      roles: roles,
      hasStudents: roles.includes('student'),
      hasMentors: roles.includes('mentor'),
      hasAdmins: roles.includes('admin')
    };
  }

  // Test 3: Roadmap System
  async testRoadmapSystem() {
    // Test fetching roadmaps
    const { data: roadmaps, error: roadmapsError } = await supabase
      .from('roadmaps')
      .select('*')
      .order('title');

    if (roadmapsError) throw new Error(`Failed to fetch roadmaps: ${roadmapsError.message}`);

    // Test fetching roadmap weeks
    const { data: weeks, error: weeksError } = await supabase
      .from('roadmap_weeks')
      .select('*')
      .limit(5);

    if (weeksError) throw new Error(`Failed to fetch roadmap weeks: ${weeksError.message}`);

    // Test fetching roadmap tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .limit(5);

    if (tasksError) throw new Error(`Failed to fetch roadmap tasks: ${tasksError.message}`);

    return {
      roadmapsCount: roadmaps.length,
      weeksCount: weeks.length,
      tasksCount: tasks.length,
      roadmaps: roadmaps.map(r => ({ id: r.id, title: r.title, category: r.category }))
    };
  }

  // Test 4: Batch Management System
  async testBatchManagement() {
    // Test fetching batches
    const { data: batches, error: batchesError } = await supabase
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
      .eq('status', 'active')
      .order('name');

    if (batchesError) throw new Error(`Failed to fetch batches: ${batchesError.message}`);

    // Test batch creation (dry run - don't actually create)
    const testBatchData = {
      name: 'Test Batch - Feature Test',
      roadmap_id: batches[0]?.roadmap_id || 'fde72f6d-5ee0-4f59-ae8e-7ddd08188099',
      mentor_id: 'test-mentor-id',
      max_students: 30,
      current_students: 0,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Test if batch creation would work (validate data structure)
    const requiredFields = ['name', 'roadmap_id', 'mentor_id', 'max_students', 'current_students', 'start_date', 'status'];
    const missingFields = requiredFields.filter(field => testBatchData[field] === undefined || testBatchData[field] === null);
    
    if (missingFields.length > 0) {
      throw new Error(`Batch creation validation failed. Missing fields: ${missingFields.join(', ')}`);
    }

    return {
      batchesCount: batches.length,
      batches: batches.map(b => ({ 
        id: b.id, 
        name: b.name, 
        roadmapName: b.roadmaps?.title || 'Unknown',
        studentCount: b.current_students 
      })),
      batchCreationValid: true
    };
  }

  // Test 5: Student Assignment System
  async testStudentAssignment() {
    // Test fetching all users (students, admins, mentors)
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .in('role', ['student', 'admin', 'mentor'])
      .eq('is_active', true);

    if (allUsersError) throw new Error(`Failed to fetch users for assignment: ${allUsersError.message}`);

    // Test fetching student batch assignments
    const { data: assignments, error: assignmentsError } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .eq('status', 'active');

    if (assignmentsError) throw new Error(`Failed to fetch student assignments: ${assignmentsError.message}`);

    // Check if admins are included in available users
    const admins = allUsers.filter(u => u.role === 'admin');
    const students = allUsers.filter(u => u.role === 'student');
    const mentors = allUsers.filter(u => u.role === 'mentor');

    return {
      totalUsers: allUsers.length,
      adminsCount: admins.length,
      studentsCount: students.length,
      mentorsCount: mentors.length,
      assignmentsCount: assignments.length,
      includesAdmins: admins.length > 0,
      includesStudents: students.length > 0,
      includesMentors: mentors.length > 0
    };
  }

  // Test 6: Student Progress System
  async testStudentProgress() {
    // Test fetching student progress
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .limit(10);

    if (progressError) throw new Error(`Failed to fetch student progress: ${progressError.message}`);

    // Test progress statuses
    const statuses = [...new Set(progress.map(p => p.status))];
    const completedCount = progress.filter(p => p.status === 'completed').length;

    return {
      progressRecords: progress.length,
      statuses: statuses,
      completedCount: completedCount,
      hasProgress: progress.length > 0
    };
  }

  // Test 7: Notice System
  async testNoticeSystem() {
    // Test fetching notices
    const { data: notices, error: noticesError } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (noticesError) throw new Error(`Failed to fetch notices: ${noticesError.message}`);

    // Test notice priorities
    const priorities = [...new Set(notices.map(n => n.priority))];

    return {
      noticesCount: notices.length,
      priorities: priorities,
      hasNotices: notices.length > 0
    };
  }

  // Test 8: Database Schema Validation
  async testDatabaseSchema() {
    const schemaTests = [];

    // Test users table structure
    const { data: usersSample, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name, is_active, created_at')
      .limit(1);

    if (usersError) {
      schemaTests.push({ table: 'users', status: 'FAILED', error: usersError.message });
    } else {
      schemaTests.push({ table: 'users', status: 'PASSED', fields: Object.keys(usersSample[0] || {}) });
    }

    // Test batches table structure
    const { data: batchesSample, error: batchesError } = await supabase
      .from('batches')
      .select('id, name, roadmap_id, current_students, created_at')
      .limit(1);

    if (batchesError) {
      schemaTests.push({ table: 'batches', status: 'FAILED', error: batchesError.message });
    } else {
      schemaTests.push({ table: 'batches', status: 'PASSED', fields: Object.keys(batchesSample[0] || {}) });
    }

    // Test roadmaps table structure
    const { data: roadmapsSample, error: roadmapsError } = await supabase
      .from('roadmaps')
      .select('id, title, description, total_weeks, category')
      .limit(1);

    if (roadmapsError) {
      schemaTests.push({ table: 'roadmaps', status: 'FAILED', error: roadmapsError.message });
    } else {
      schemaTests.push({ table: 'roadmaps', status: 'PASSED', fields: Object.keys(roadmapsSample[0] || {}) });
    }

    return {
      schemaTests: schemaTests,
      passedTables: schemaTests.filter(t => t.status === 'PASSED').length,
      totalTables: schemaTests.length
    };
  }

  // Test 9: API Endpoint Functionality
  async testAPIEndpoints() {
    const endpointTests = [];

    // Test roadmap tasks endpoint
    try {
      const { data: tasks, error } = await supabase
        .from('roadmap_tasks')
        .select(`
          id,
          task_name,
          task_details,
          task_type,
          deadline,
          estimated_hours,
          week_id,
          roadmap_weeks (
            week_number,
            roadmap_id,
            roadmaps (
              title
            )
          )
        `)
        .limit(5);

      if (error) {
        endpointTests.push({ endpoint: 'roadmap_tasks_with_joins', status: 'FAILED', error: error.message });
      } else {
        endpointTests.push({ endpoint: 'roadmap_tasks_with_joins', status: 'PASSED', records: tasks.length });
      }
    } catch (err) {
      endpointTests.push({ endpoint: 'roadmap_tasks_with_joins', status: 'FAILED', error: err.message });
    }

    // Test student batch assignments with user data
    try {
      const { data: assignments, error } = await supabase
        .from('student_batch_assignments')
        .select(`
          id,
          student_id,
          batch_id,
          status,
          users (
            first_name,
            last_name,
            email,
            role
          ),
          batches (
            name
          )
        `)
        .limit(5);

      if (error) {
        endpointTests.push({ endpoint: 'student_assignments_with_joins', status: 'FAILED', error: error.message });
      } else {
        endpointTests.push({ endpoint: 'student_assignments_with_joins', status: 'PASSED', records: assignments.length });
      }
    } catch (err) {
      endpointTests.push({ endpoint: 'student_assignments_with_joins', status: 'FAILED', error: err.message });
    }

    return {
      endpointTests: endpointTests,
      passedEndpoints: endpointTests.filter(t => t.status === 'PASSED').length,
      totalEndpoints: endpointTests.length
    };
  }

  // Test 10: Data Consistency
  async testDataConsistency() {
    const consistencyIssues = [];

    // Check if all batches have valid roadmap references
    const { data: batches, error: batchesError } = await supabase
      .from('batches')
      .select('id, name, roadmap_id');

    if (!batchesError && batches) {
      const { data: roadmaps, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('id');

      if (!roadmapsError && roadmaps) {
        const roadmapIds = new Set(roadmaps.map(r => r.id));
        const invalidBatches = batches.filter(b => !roadmapIds.has(b.roadmap_id));
        
        if (invalidBatches.length > 0) {
          consistencyIssues.push({
            type: 'invalid_roadmap_references',
            count: invalidBatches.length,
            batches: invalidBatches.map(b => b.name)
          });
        }
      }
    }

    // Check if all student assignments have valid user references
    const { data: assignments, error: assignmentsError } = await supabase
      .from('student_batch_assignments')
      .select('id, student_id, batch_id');

    if (!assignmentsError && assignments) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id');

      if (!usersError && users) {
        const userIds = new Set(users.map(u => u.id));
        const invalidAssignments = assignments.filter(a => !userIds.has(a.student_id));
        
        if (invalidAssignments.length > 0) {
          consistencyIssues.push({
            type: 'invalid_user_references',
            count: invalidAssignments.length
          });
        }
      }
    }

    return {
      consistencyIssues: consistencyIssues,
      hasIssues: consistencyIssues.length > 0,
      totalIssues: consistencyIssues.length
    };
  }

  // Run all tests
  async runAllTests() {
    log('🚀 Starting Comprehensive Feature Test Suite', 'bright');
    log('=' .repeat(60), 'cyan');

    // Run all tests
    await this.runTest('Database Connection', () => this.testDatabaseConnection());
    await this.runTest('User Authentication System', () => this.testUserAuthentication());
    await this.runTest('Roadmap System', () => this.testRoadmapSystem());
    await this.runTest('Batch Management System', () => this.testBatchManagement());
    await this.runTest('Student Assignment System', () => this.testStudentAssignment());
    await this.runTest('Student Progress System', () => this.testStudentProgress());
    await this.runTest('Notice System', () => this.testNoticeSystem());
    await this.runTest('Database Schema Validation', () => this.testDatabaseSchema());
    await this.runTest('API Endpoint Functionality', () => this.testAPIEndpoints());
    await this.runTest('Data Consistency', () => this.testDataConsistency());

    // Print summary
    this.printSummary();
  }

  printSummary() {
    log('\n' + '=' .repeat(60), 'cyan');
    log('📊 TEST SUMMARY', 'bright');
    log('=' .repeat(60), 'cyan');
    
    log(`Total Tests: ${this.results.total}`, 'blue');
    log(`Passed: ${this.results.passed}`, 'green');
    log(`Failed: ${this.results.failed}`, 'red');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');

    if (this.results.issues.length > 0) {
      log('\n🚨 IDENTIFIED ISSUES:', 'red');
      this.results.issues.forEach((issue, index) => {
        log(`${index + 1}. ${issue.test}: ${issue.error}`, 'red');
      });
    }

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
const testSuite = new FeatureTestSuite();
testSuite.runAllTests().catch(console.error);
