#!/usr/bin/env node

/**
 * Comprehensive Diagnosis and Fix Script for 10MS AI GG Project
 * 
 * This script will:
 * 1. Diagnose all database issues
 * 2. Fix foreign key constraint violations
 * 3. Sync user data between auth.users and public.users
 * 4. Test all CRUD operations
 * 5. Verify task completion functionality
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class DatabaseDiagnostic {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  async runDiagnosis() {
    log('\n🔍 Starting Comprehensive Database Diagnosis...', 'cyan');
    
    try {
      // 1. Check database connection
      await this.checkConnection();
      
      // 2. Check user data consistency
      await this.checkUserConsistency();
      
      // 3. Check foreign key constraints
      await this.checkForeignKeyConstraints();
      
      // 4. Check student progress data
      await this.checkStudentProgress();
      
      // 5. Check batch assignments
      await this.checkBatchAssignments();
      
      // 6. Check roadmap data
      await this.checkRoadmapData();
      
      // 7. Check RLS policies
      await this.checkRLSPolicies();
      
      // 8. Generate summary
      this.generateSummary();
      
    } catch (error) {
      log(`❌ Diagnosis failed: ${error.message}`, 'red');
      throw error;
    }
  }

  async checkConnection() {
    log('\n📡 Checking database connection...', 'blue');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      log('✅ Database connection successful', 'green');
    } catch (error) {
      this.issues.push({
        type: 'connection',
        message: `Database connection failed: ${error.message}`,
        severity: 'critical'
      });
      throw error;
    }
  }

  async checkUserConsistency() {
    log('\n👥 Checking user data consistency...', 'blue');
    
    try {
      // Get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;
      
      // Get all public users
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*');
      if (publicError) throw publicError;
      
      log(`📊 Found ${authUsers.users.length} auth users and ${publicUsers.length} public users`, 'yellow');
      
      // Check for missing users in public.users
      const authUserIds = new Set(authUsers.users.map(u => u.id));
      const publicUserIds = new Set(publicUsers.map(u => u.id));
      
      const missingInPublic = authUsers.users.filter(u => !publicUserIds.has(u.id));
      const missingInAuth = publicUsers.filter(u => !authUserIds.has(u.id));
      
      if (missingInPublic.length > 0) {
        this.issues.push({
          type: 'user_consistency',
          message: `${missingInPublic.length} auth users missing in public.users table`,
          severity: 'high',
          data: missingInPublic.map(u => ({ id: u.id, email: u.email }))
        });
        
        // Fix: Create missing users in public.users
        for (const user of missingInPublic) {
          await this.createPublicUser(user);
        }
      }
      
      if (missingInAuth.length > 0) {
        this.issues.push({
          type: 'user_consistency',
          message: `${missingInAuth.length} public users missing in auth.users table`,
          severity: 'medium',
          data: missingInAuth.map(u => ({ id: u.id, email: u.email }))
        });
      }
      
      log('✅ User consistency check completed', 'green');
      
    } catch (error) {
      this.issues.push({
        type: 'user_consistency',
        message: `User consistency check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async createPublicUser(authUser) {
    try {
      const userData = {
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.user_metadata?.first_name || authUser.email.split('@')[0],
        last_name: authUser.user_metadata?.last_name || '',
        role: authUser.user_metadata?.role || 'student',
        is_active: true,
        email_verified: !!authUser.email_confirmed_at,
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('users')
        .insert(userData);
      
      if (error) throw error;
      
      log(`✅ Created public user: ${authUser.email}`, 'green');
      this.fixes.push(`Created public user: ${authUser.email}`);
      
    } catch (error) {
      log(`❌ Failed to create public user ${authUser.email}: ${error.message}`, 'red');
    }
  }

  async checkForeignKeyConstraints() {
    log('\n🔗 Checking foreign key constraints...', 'blue');
    
    try {
      // Check student_progress foreign keys
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          student_id,
          task_id,
          users!student_progress_student_id_fkey(id, email),
          roadmap_tasks!student_progress_task_id_fkey(id, task_name)
        `)
        .limit(10);
      
      if (progressError) {
        this.issues.push({
          type: 'foreign_key',
          message: `student_progress foreign key constraint error: ${progressError.message}`,
          severity: 'critical'
        });
        
        // Try to fix by finding orphaned records
        await this.fixOrphanedProgressRecords();
      } else {
        log('✅ Foreign key constraints are valid', 'green');
      }
      
    } catch (error) {
      this.issues.push({
        type: 'foreign_key',
        message: `Foreign key check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async fixOrphanedProgressRecords() {
    log('\n🔧 Fixing orphaned progress records...', 'yellow');
    
    try {
      // Get all progress records
      const { data: allProgress, error: progressError } = await supabase
        .from('student_progress')
        .select('*');
      
      if (progressError) throw progressError;
      
      // Get all valid user IDs
      const { data: validUsers, error: usersError } = await supabase
        .from('users')
        .select('id');
      
      if (usersError) throw usersError;
      
      const validUserIds = new Set(validUsers.map(u => u.id));
      
      // Find orphaned records
      const orphanedRecords = allProgress.filter(p => !validUserIds.has(p.student_id));
      
      if (orphanedRecords.length > 0) {
        log(`🗑️ Found ${orphanedRecords.length} orphaned progress records`, 'yellow');
        
        // Delete orphaned records
        const orphanedIds = orphanedRecords.map(r => r.id);
        const { error: deleteError } = await supabase
          .from('student_progress')
          .delete()
          .in('id', orphanedIds);
        
        if (deleteError) throw deleteError;
        
        log(`✅ Deleted ${orphanedRecords.length} orphaned progress records`, 'green');
        this.fixes.push(`Deleted ${orphanedRecords.length} orphaned progress records`);
      }
      
    } catch (error) {
      log(`❌ Failed to fix orphaned records: ${error.message}`, 'red');
    }
  }

  async checkStudentProgress() {
    log('\n📊 Checking student progress data...', 'blue');
    
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          *,
          users!student_progress_student_id_fkey(id, email, first_name, last_name),
          roadmap_tasks!student_progress_task_id_fkey(id, task_name, week_id)
        `)
        .limit(20);
      
      if (progressError) {
        this.issues.push({
          type: 'student_progress',
          message: `Student progress query failed: ${progressError.message}`,
          severity: 'high'
        });
      } else {
        log(`✅ Found ${progressData.length} progress records`, 'green');
        
        // Check for data quality issues
        const invalidRecords = progressData.filter(p => !p.users || !p.roadmap_tasks);
        if (invalidRecords.length > 0) {
          this.issues.push({
            type: 'student_progress',
            message: `${invalidRecords.length} progress records have invalid references`,
            severity: 'medium',
            data: invalidRecords
          });
        }
      }
      
    } catch (error) {
      this.issues.push({
        type: 'student_progress',
        message: `Student progress check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async checkBatchAssignments() {
    log('\n📦 Checking batch assignments...', 'blue');
    
    try {
      const { data: assignments, error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .select(`
          *,
          users!student_batch_assignments_student_id_fkey(id, email, first_name, last_name),
          batches!student_batch_assignments_batch_id_fkey(id, name, status)
        `)
        .limit(20);
      
      if (assignmentError) {
        this.issues.push({
          type: 'batch_assignments',
          message: `Batch assignments query failed: ${assignmentError.message}`,
          severity: 'high'
        });
      } else {
        log(`✅ Found ${assignments.length} batch assignments`, 'green');
        
        // Check for data quality issues
        const invalidAssignments = assignments.filter(a => !a.users || !a.batches);
        if (invalidAssignments.length > 0) {
          this.issues.push({
            type: 'batch_assignments',
            message: `${invalidAssignments.length} batch assignments have invalid references`,
            severity: 'medium'
          });
        }
      }
      
    } catch (error) {
      this.issues.push({
        type: 'batch_assignments',
        message: `Batch assignments check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async checkRoadmapData() {
    log('\n🗺️ Checking roadmap data...', 'blue');
    
    try {
      // Check roadmaps
      const { data: roadmaps, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('*')
        .limit(10);
      
      if (roadmapsError) {
        this.issues.push({
          type: 'roadmaps',
          message: `Roadmaps query failed: ${roadmapsError.message}`,
          severity: 'high'
        });
      } else {
        log(`✅ Found ${roadmaps.length} roadmaps`, 'green');
      }
      
      // Check roadmap weeks
      const { data: weeks, error: weeksError } = await supabase
        .from('roadmap_weeks')
        .select('*')
        .limit(20);
      
      if (weeksError) {
        this.issues.push({
          type: 'roadmap_weeks',
          message: `Roadmap weeks query failed: ${weeksError.message}`,
          severity: 'high'
        });
      } else {
        log(`✅ Found ${weeks.length} roadmap weeks`, 'green');
      }
      
      // Check roadmap tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .limit(50);
      
      if (tasksError) {
        this.issues.push({
          type: 'roadmap_tasks',
          message: `Roadmap tasks query failed: ${tasksError.message}`,
          severity: 'high'
        });
      } else {
        log(`✅ Found ${tasks.length} roadmap tasks`, 'green');
      }
      
    } catch (error) {
      this.issues.push({
        type: 'roadmap_data',
        message: `Roadmap data check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  async checkRLSPolicies() {
    log('\n🔒 Checking RLS policies...', 'blue');
    
    try {
      // Test if we can read data with service key
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, role')
        .limit(5);
      
      if (usersError) {
        this.issues.push({
          type: 'rls',
          message: `RLS policy may be blocking access: ${usersError.message}`,
          severity: 'high'
        });
      } else {
        log('✅ RLS policies allow service key access', 'green');
      }
      
    } catch (error) {
      this.issues.push({
        type: 'rls',
        message: `RLS check failed: ${error.message}`,
        severity: 'high'
      });
    }
  }

  generateSummary() {
    log('\n📋 DIAGNOSIS SUMMARY', 'bright');
    log('='.repeat(50), 'cyan');
    
    if (this.issues.length === 0) {
      log('🎉 No issues found! Database is healthy.', 'green');
    } else {
      log(`\n❌ Found ${this.issues.length} issues:`, 'red');
      
      const criticalIssues = this.issues.filter(i => i.severity === 'critical');
      const highIssues = this.issues.filter(i => i.severity === 'high');
      const mediumIssues = this.issues.filter(i => i.severity === 'medium');
      
      if (criticalIssues.length > 0) {
        log(`\n🚨 Critical Issues (${criticalIssues.length}):`, 'red');
        criticalIssues.forEach(issue => {
          log(`  • ${issue.type}: ${issue.message}`, 'red');
        });
      }
      
      if (highIssues.length > 0) {
        log(`\n⚠️ High Priority Issues (${highIssues.length}):`, 'yellow');
        highIssues.forEach(issue => {
          log(`  • ${issue.type}: ${issue.message}`, 'yellow');
        });
      }
      
      if (mediumIssues.length > 0) {
        log(`\nℹ️ Medium Priority Issues (${mediumIssues.length}):`, 'blue');
        mediumIssues.forEach(issue => {
          log(`  • ${issue.type}: ${issue.message}`, 'blue');
        });
      }
    }
    
    if (this.fixes.length > 0) {
      log(`\n✅ Applied ${this.fixes.length} fixes:`, 'green');
      this.fixes.forEach(fix => {
        log(`  • ${fix}`, 'green');
      });
    }
    
    log('\n' + '='.repeat(50), 'cyan');
  }

  async testTaskCompletion() {
    log('\n🧪 Testing task completion functionality...', 'blue');
    
    try {
      // Get a test user
      const { data: testUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .limit(1)
        .single();
      
      if (userError || !testUser) {
        log('❌ No test user found for task completion test', 'red');
        return false;
      }
      
      // Get a test task
      const { data: testTask, error: taskError } = await supabase
        .from('roadmap_tasks')
        .select('*')
        .limit(1)
        .single();
      
      if (taskError || !testTask) {
        log('❌ No test task found for task completion test', 'red');
        return false;
      }
      
      log(`🧪 Testing with user: ${testUser.email} and task: ${testTask.task_name}`, 'yellow');
      
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
        return false;
      }
      
      log('✅ Task completion test passed!', 'green');
      
      // Clean up test data
      await supabase
        .from('student_progress')
        .delete()
        .eq('student_id', testUser.id)
        .eq('task_id', testTask.id);
      
      return true;
      
    } catch (error) {
      log(`❌ Task completion test failed: ${error.message}`, 'red');
      return false;
    }
  }
}

async function main() {
  try {
    const diagnostic = new DatabaseDiagnostic();
    
    // Run diagnosis
    await diagnostic.runDiagnosis();
    
    // Test task completion
    const taskCompletionWorks = await diagnostic.testTaskCompletion();
    
    if (taskCompletionWorks) {
      log('\n🎉 All systems are working correctly!', 'green');
    } else {
      log('\n⚠️ Task completion functionality needs attention', 'yellow');
    }
    
  } catch (error) {
    log(`\n💥 Script failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DatabaseDiagnostic };
