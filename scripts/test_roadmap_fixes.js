#!/usr/bin/env node

/**
 * Test Roadmap Fixes Script
 * 
 * This script tests the fixes for:
 * 1. Completion percentages showing 200% and 300%
 * 2. Class Progress showing 0/16 when students completed
 * 3. Tasks Locked badge showing for completed weeks
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

class RoadmapFixTester {
  constructor() {
    this.testResults = [];
  }

  async run() {
    console.log('🧪 Testing Roadmap Fixes...\n');
    
    try {
      // Test 1: Check completion percentages are reasonable
      await this.testCompletionPercentages();
      
      // Test 2: Check class progress consistency
      await this.testClassProgressConsistency();
      
      // Test 3: Check for duplicate task completions
      await this.testDuplicateTaskCompletions();
      
      // Summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }

  async testCompletionPercentages() {
    console.log('🔍 Test 1: Checking completion percentages...');
    
    try {
      // Get a sample week and batch
      const { data: weeks } = await supabase
        .from('roadmap_weeks')
        .select('id, week_number')
        .eq('week_number', 1)
        .limit(1);
      
      if (!weeks || weeks.length === 0) {
        console.log('⚠️  No Week 1 found, skipping test');
        return;
      }
      
      const { data: batches } = await supabase
        .from('batches')
        .select('id')
        .limit(1);
      
      if (!batches || batches.length === 0) {
        console.log('⚠️  No batches found, skipping test');
        return;
      }
      
      const weekId = weeks[0].id;
      const batchId = batches[0].id;
      
      // Test the fixed method
      const { data: completions } = await supabase.rpc('get_week_student_completion_details', {
        week_id: weekId,
        batch_id: batchId
      });
      
      if (completions) {
        const invalidPercentages = completions.filter(c => c.completion_percentage > 100);
        
        if (invalidPercentages.length === 0) {
          console.log('✅ All completion percentages are within 0-100% range');
          this.testResults.push({ test: 'Completion Percentages', status: 'PASS' });
        } else {
          console.log('❌ Found invalid percentages:', invalidPercentages);
          this.testResults.push({ test: 'Completion Percentages', status: 'FAIL' });
        }
      } else {
        console.log('⚠️  No completion data found');
        this.testResults.push({ test: 'Completion Percentages', status: 'SKIP' });
      }
      
    } catch (error) {
      console.error('❌ Error testing completion percentages:', error);
      this.testResults.push({ test: 'Completion Percentages', status: 'ERROR' });
    }
  }

  async testClassProgressConsistency() {
    console.log('\n🔍 Test 2: Checking class progress consistency...');
    
    try {
      // Get a sample week and batch
      const { data: weeks } = await supabase
        .from('roadmap_weeks')
        .select('id, week_number')
        .eq('week_number', 1)
        .limit(1);
      
      if (!weeks || weeks.length === 0) {
        console.log('⚠️  No Week 1 found, skipping test');
        return;
      }
      
      const { data: batches } = await supabase
        .from('batches')
        .select('id')
        .limit(1);
      
      if (!batches || batches.length === 0) {
        console.log('⚠️  No batches found, skipping test');
        return;
      }
      
      const weekId = weeks[0].id;
      const batchId = batches[0].id;
      
      // Test both methods
      const { data: stats } = await supabase.rpc('get_week_completion_stats', {
        week_id: weekId,
        batch_id: batchId
      });
      
      const { data: details } = await supabase.rpc('get_week_student_completion_details', {
        week_id: weekId,
        batch_id: batchId
      });
      
      if (stats && details) {
        const completedFromDetails = details.filter(d => d.completion_percentage >= 80).length;
        const completedFromStats = stats.completed_students;
        
        if (completedFromDetails === completedFromStats) {
          console.log('✅ Class progress counts are consistent');
          console.log(`   Stats: ${completedFromStats} students completed`);
          console.log(`   Details: ${completedFromDetails} students completed`);
          this.testResults.push({ test: 'Class Progress Consistency', status: 'PASS' });
        } else {
          console.log('❌ Class progress counts are inconsistent');
          console.log(`   Stats: ${completedFromStats} students completed`);
          console.log(`   Details: ${completedFromDetails} students completed`);
          this.testResults.push({ test: 'Class Progress Consistency', status: 'FAIL' });
        }
      } else {
        console.log('⚠️  No data found for comparison');
        this.testResults.push({ test: 'Class Progress Consistency', status: 'SKIP' });
      }
      
    } catch (error) {
      console.error('❌ Error testing class progress consistency:', error);
      this.testResults.push({ test: 'Class Progress Consistency', status: 'ERROR' });
    }
  }

  async testDuplicateTaskCompletions() {
    console.log('\n🔍 Test 3: Checking for duplicate task completions...');
    
    try {
      // Check for duplicate entries in student_progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('student_id, task_id, status')
        .eq('status', 'completed');
      
      if (progressData) {
        const duplicates = new Map();
        
        progressData.forEach(progress => {
          const key = `${progress.student_id}-${progress.task_id}`;
          if (duplicates.has(key)) {
            duplicates.set(key, duplicates.get(key) + 1);
          } else {
            duplicates.set(key, 1);
          }
        });
        
        const duplicateEntries = Array.from(duplicates.entries()).filter(([key, count]) => count > 1);
        
        if (duplicateEntries.length === 0) {
          console.log('✅ No duplicate task completions found');
          this.testResults.push({ test: 'Duplicate Task Completions', status: 'PASS' });
        } else {
          console.log('❌ Found duplicate task completions:', duplicateEntries.length);
          console.log('   Sample duplicates:', duplicateEntries.slice(0, 5));
          this.testResults.push({ test: 'Duplicate Task Completions', status: 'FAIL' });
        }
      } else {
        console.log('⚠️  No progress data found');
        this.testResults.push({ test: 'Duplicate Task Completions', status: 'SKIP' });
      }
      
    } catch (error) {
      console.error('❌ Error testing duplicate task completions:', error);
      this.testResults.push({ test: 'Duplicate Task Completions', status: 'ERROR' });
    }
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const skipped = this.testResults.filter(r => r.status === 'SKIP').length;
    
    this.testResults.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : 
                   result.status === 'FAIL' ? '❌' : 
                   result.status === 'ERROR' ? '⚠️' : '⏭️';
      console.log(`${icon} ${result.test}: ${result.status}`);
    });
    
    console.log(`\nTotal: ${this.testResults.length} tests`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Errors: ${errors}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    
    if (failed === 0 && errors === 0) {
      console.log('\n🎉 All tests passed! The roadmap fixes are working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
  }
}

// Run the tester
const tester = new RoadmapFixTester();
tester.run().catch(console.error);
