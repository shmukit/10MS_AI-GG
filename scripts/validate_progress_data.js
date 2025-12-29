#!/usr/bin/env node

/**
 * Progress Data Validation Script
 * 
 * This script validates the current state of progress data and identifies
 * inconsistencies between different tables and views.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class ProgressValidator {
  constructor() {
    this.inconsistencies = [];
    this.students = [];
  }

  async run() {
    console.log('🔍 Starting Progress Data Validation...\n');
    
    try {
      // Step 1: Get all students
      await this.fetchAllStudents();
      
      // Step 2: Validate each student's data
      for (const student of this.students) {
        await this.validateStudentData(student);
      }
      
      // Step 3: Print validation report
      this.printValidationReport();
      
    } catch (error) {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    }
  }

  async fetchAllStudents() {
    console.log('📊 Fetching all students...');
    
    const { data: students, error } = await supabase
      .from('student_batch_assignments')
      .select(`
        student_id,
        completed_weeks,
        progress_percentage,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }

    this.students = students || [];
    console.log(`✅ Found ${this.students.length} active students\n`);
  }

  async validateStudentData(studentAssignment) {
    const studentId = studentAssignment.student_id;
    const studentName = `${studentAssignment.users.first_name} ${studentAssignment.users.last_name}`;
    const studentEmail = studentAssignment.users.email;
    
    console.log(`👤 Validating: ${studentName} (${studentEmail})`);
    
    try {
      // Get data from all sources
      const [actualProgress, profileData, assignmentData] = await Promise.all([
        this.calculateActualProgress(studentId),
        this.getStudentProfileData(studentId),
        this.getStudentAssignmentData(studentId)
      ]);
      
      console.log(`   📈 Actual Progress: ${actualProgress.completedWeeks} weeks, ${actualProgress.progressPercentage}%`);
      console.log(`   👤 Profile Data: ${profileData.completedWeeks} weeks, ${profileData.progressPercentage}%`);
      console.log(`   📋 Assignment Data: ${assignmentData.completedWeeks} weeks, ${assignmentData.progressPercentage}%`);
      
      // Check for inconsistencies
      const inconsistencies = this.findInconsistencies(studentName, studentEmail, {
        actual: actualProgress,
        profile: profileData,
        assignment: assignmentData
      });
      
      if (inconsistencies.length > 0) {
        this.inconsistencies.push({
          student: studentName,
          email: studentEmail,
          issues: inconsistencies
        });
        console.log(`   ❌ Found ${inconsistencies.length} inconsistency(ies)`);
      } else {
        console.log(`   ✅ Data is consistent`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error validating ${studentName}:`, error.message);
      this.inconsistencies.push({
        student: studentName,
        email: studentEmail,
        issues: [`Validation error: ${error.message}`]
      });
    }
  }

  async calculateActualProgress(studentId) {
    // Get all completed tasks for the student
    const { data: progressData, error: progressError } = await supabase
      .from('student_progress')
      .select(`
        *,
        roadmap_tasks (
          id,
          task_name,
          week_id,
          roadmap_weeks (
            id,
            week_number,
            roadmap_id
          )
        )
      `)
      .eq('student_id', studentId)
      .eq('status', 'completed');

    if (progressError) {
      throw new Error(`Failed to fetch progress data: ${progressError.message}`);
    }

    // Group completed tasks by week
    const weekCompletions = {};
    
    if (progressData && progressData.length > 0) {
      // Get all tasks for each week to calculate completion percentage
      const weekIds = [...new Set(progressData.map(p => p.roadmap_tasks?.week_id).filter(Boolean))];
      
      if (weekIds.length > 0) {
        const { data: allTasks, error: tasksError } = await supabase
          .from('roadmap_tasks')
          .select(`
            id,
            week_id,
            roadmap_weeks (
              week_number
            )
          `)
          .in('week_id', weekIds);

        if (!tasksError && allTasks) {
          // Count total tasks per week
          allTasks.forEach(task => {
            const weekNumber = task.roadmap_weeks?.week_number;
            if (weekNumber) {
              if (!weekCompletions[weekNumber]) {
                weekCompletions[weekNumber] = { completed: 0, total: 0 };
              }
              weekCompletions[weekNumber].total++;
            }
          });

          // Count completed tasks per week
          progressData.forEach(progress => {
            const weekNumber = progress.roadmap_tasks?.roadmap_weeks?.week_number;
            if (weekNumber && weekCompletions[weekNumber]) {
              weekCompletions[weekNumber].completed++;
            }
          });
        }
      }
    }

    // Calculate completed weeks (80%+ completion threshold)
    const completedWeeks = Object.keys(weekCompletions)
      .map(Number)
      .filter(weekNumber => {
        const weekData = weekCompletions[weekNumber];
        return weekData.total > 0 && (weekData.completed / weekData.total) >= 0.8;
      })
      .length;

    const progressPercentage = Math.min(100, (completedWeeks / 6) * 100);

    return {
      completedWeeks,
      progressPercentage,
      weekCompletions,
      totalCompletedTasks: progressData?.length || 0
    };
  }

  async getStudentProfileData(studentId) {
    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select('completed_weeks, progress_percentage')
      .eq('user_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch profile data: ${error.message}`);
    }

    return {
      completedWeeks: profile?.completed_weeks || 0,
      progressPercentage: profile?.progress_percentage || 0
    };
  }

  async getStudentAssignmentData(studentId) {
    const { data: assignment, error } = await supabase
      .from('student_batch_assignments')
      .select('completed_weeks, progress_percentage')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch assignment data: ${error.message}`);
    }

    return {
      completedWeeks: assignment?.completed_weeks || 0,
      progressPercentage: assignment?.progress_percentage || 0
    };
  }

  findInconsistencies(studentName, studentEmail, data) {
    const issues = [];
    
    // Check weeks consistency
    if (data.actual.completedWeeks !== data.profile.completedWeeks) {
      issues.push(`Profile weeks (${data.profile.completedWeeks}) doesn't match actual (${data.actual.completedWeeks})`);
    }
    
    if (data.actual.completedWeeks !== data.assignment.completedWeeks) {
      issues.push(`Assignment weeks (${data.assignment.completedWeeks}) doesn't match actual (${data.actual.completedWeeks})`);
    }
    
    // Check percentage consistency (allow 1% tolerance)
    if (Math.abs(data.actual.progressPercentage - data.profile.progressPercentage) > 1) {
      issues.push(`Profile percentage (${data.profile.progressPercentage}%) doesn't match actual (${data.actual.progressPercentage}%)`);
    }
    
    if (Math.abs(data.actual.progressPercentage - data.assignment.progressPercentage) > 1) {
      issues.push(`Assignment percentage (${data.assignment.progressPercentage}%) doesn't match actual (${data.actual.progressPercentage}%)`);
    }
    
    // Special check for Raied
    if (studentEmail === 'raied@10minuteschool.com') {
      console.log(`   🔍 Special validation for Raied:`);
      console.log(`      - Completed tasks: ${data.actual.totalCompletedTasks}`);
      console.log(`      - Week completions:`, data.actual.weekCompletions);
      
      if (data.actual.completedWeeks >= 1 && data.actual.totalCompletedTasks === 0) {
        issues.push(`CRITICAL: Shows ${data.actual.completedWeeks} weeks completed but has 0 completed tasks`);
      }
    }
    
    return issues;
  }

  printValidationReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 PROGRESS DATA VALIDATION REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total students checked: ${this.students.length}`);
    console.log(`   Students with inconsistencies: ${this.inconsistencies.length}`);
    console.log(`   Students with consistent data: ${this.students.length - this.inconsistencies.length}`);
    
    if (this.inconsistencies.length > 0) {
      console.log(`\n❌ INCONSISTENCIES FOUND:`);
      this.inconsistencies.forEach((inconsistency, index) => {
        console.log(`\n${index + 1}. ${inconsistency.student} (${inconsistency.email})`);
        inconsistency.issues.forEach(issue => {
          console.log(`   - ${issue}`);
        });
      });
      
      console.log(`\n🔧 RECOMMENDED ACTIONS:`);
      console.log(`   1. Run the fix_progress_inconsistencies.js script`);
      console.log(`   2. Verify the fixes in the application`);
      console.log(`   3. Test community page sorting by progress`);
      console.log(`   4. Check roadmap progress display`);
    } else {
      console.log(`\n✅ All student progress data is consistent!`);
    }
    
    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Fix any identified inconsistencies`);
    console.log(`   2. Test the application thoroughly`);
    console.log(`   3. Monitor for future inconsistencies`);
  }
}

// Run the validator
async function main() {
  const validator = new ProgressValidator();
  await validator.run();
}

// Run the validator
main().catch(console.error);

export { ProgressValidator };
