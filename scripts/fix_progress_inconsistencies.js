#!/usr/bin/env node

/**
 * Fix Progress Inconsistencies Script
 * 
 * This script addresses the data consistency issues between:
 * 1. student_profiles table
 * 2. student_batch_assignments table  
 * 3. student_progress table
 * 4. Community page sorting
 * 5. Roadmap progress display
 * 
 * Issues it fixes:
 * - Raied showing completed week 1 but tasks not marked as done
 * - Community page not sorting by actual progress
 * - Class completion showing "No students completed" when they have
 * - Progress percentages not matching between different views
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

class ProgressFixer {
  constructor() {
    this.fixedStudents = 0;
    this.errors = [];
  }

  async run() {
    console.log('🚀 Starting Progress Inconsistencies Fix...\n');
    
    try {
      // Step 1: Get all students with progress data
      const students = await this.getAllStudentsWithProgress();
      console.log(`📊 Found ${students.length} students to check\n`);
      
      // Step 2: Fix each student's progress
      for (const student of students) {
        await this.fixStudentProgress(student);
      }
      
      // Step 3: Summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    }
  }

  async getAllStudentsWithProgress() {
    console.log('🔍 Fetching all students with progress data...');
    
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

    return students || [];
  }

  async fixStudentProgress(studentAssignment) {
    const studentId = studentAssignment.student_id;
    const studentName = `${studentAssignment.users.first_name} ${studentAssignment.users.last_name}`;
    const studentEmail = studentAssignment.users.email;
    
    console.log(`\n👤 Processing: ${studentName} (${studentEmail})`);
    
    try {
      // Step 1: Calculate actual progress from student_progress table
      const actualProgress = await this.calculateActualProgress(studentId);
      console.log(`   📈 Actual progress: ${actualProgress.completedWeeks} weeks, ${actualProgress.progressPercentage}%`);
      
      // Step 2: Get current stored progress
      const storedProgress = {
        completedWeeks: studentAssignment.completed_weeks || 0,
        progressPercentage: studentAssignment.progress_percentage || 0
      };
      console.log(`   💾 Stored progress: ${storedProgress.completedWeeks} weeks, ${storedProgress.progressPercentage}%`);
      
      // Step 3: Check if update is needed
      const needsUpdate = 
        actualProgress.completedWeeks !== storedProgress.completedWeeks ||
        Math.abs(actualProgress.progressPercentage - storedProgress.progressPercentage) > 1; // Allow 1% tolerance
      
      if (!needsUpdate) {
        console.log(`   ✅ Progress is consistent, no update needed`);
        return;
      }
      
      console.log(`   🔄 Progress mismatch detected, updating...`);
      
      // Step 4: Update student_batch_assignments
      const { error: assignmentError } = await supabase
        .from('student_batch_assignments')
        .update({
          completed_weeks: actualProgress.completedWeeks,
          progress_percentage: actualProgress.progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId)
        .eq('status', 'active');
      
      if (assignmentError) {
        throw new Error(`Failed to update batch assignment: ${assignmentError.message}`);
      }
      
      // Step 5: Update student_profiles
      const { error: profileError } = await supabase
        .from('student_profiles')
        .update({
          completed_weeks: actualProgress.completedWeeks,
          progress_percentage: actualProgress.progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', studentId);
      
      if (profileError) {
        console.log(`   ⚠️  Warning: Failed to update student profile: ${profileError.message}`);
      }
      
      console.log(`   ✅ Updated progress: ${actualProgress.completedWeeks} weeks, ${actualProgress.progressPercentage}%`);
      this.fixedStudents++;
      
    } catch (error) {
      console.error(`   ❌ Error fixing progress for ${studentName}:`, error.message);
      this.errors.push(`${studentName}: ${error.message}`);
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

    const progressPercentage = Math.min(100, (completedWeeks / 6) * 100); // Assuming 6 weeks total

    return {
      completedWeeks,
      progressPercentage,
      weekCompletions
    };
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROGRESS FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Students fixed: ${this.fixedStudents}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 ERRORS:');
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎉 Progress inconsistencies fix completed!');
    console.log('\nNext steps:');
    console.log('1. Test the roadmap page to ensure progress displays correctly');
    console.log('2. Test the community page sorting by progress');
    console.log('3. Verify that "Class Completion" shows proper data');
    console.log('4. Check that Raied\'s progress is now consistent across all views');
  }
}

// Run the fixer
async function main() {
  const fixer = new ProgressFixer();
  await fixer.run();
}

// Run the fixer
main().catch(console.error);

export { ProgressFixer };
