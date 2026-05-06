#!/usr/bin/env node

/**
 * Cleanup Duplicate Progress Script
 * 
 * This script removes duplicate entries from student_progress table
 * that are causing inflated completion percentages.
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

class DuplicateProgressCleaner {
  constructor() {
    this.duplicatesFound = 0;
    this.duplicatesRemoved = 0;
    this.errors = [];
  }

  async run() {
    console.log('🧹 Starting Duplicate Progress Cleanup...\n');
    
    try {
      // Step 1: Find all duplicates
      await this.findDuplicates();
      
      // Step 2: Remove duplicates (keep the latest one)
      await this.removeDuplicates();
      
      // Step 3: Verify cleanup
      await this.verifyCleanup();
      
      // Summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  async findDuplicates() {
    console.log('🔍 Step 1: Finding duplicate entries...');
    
    try {
      // Get all completed progress entries
      const { data: progressData, error } = await supabase
        .from('student_progress')
        .select('id, student_id, task_id, status, completed_at, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching progress data: ${error.message}`);
      }
      
      if (!progressData || progressData.length === 0) {
        console.log('✅ No progress data found');
        return;
      }
      
      // Group by student_id and task_id
      const grouped = new Map();
      
      progressData.forEach(progress => {
        const key = `${progress.student_id}-${progress.task_id}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(progress);
      });
      
      // Find duplicates
      const duplicates = new Map();
      grouped.forEach((entries, key) => {
        if (entries.length > 1) {
          duplicates.set(key, entries);
          this.duplicatesFound += entries.length - 1; // Count extras, not the one we'll keep
        }
      });
      
      console.log(`📊 Found ${duplicates.size} duplicate groups`);
      console.log(`📊 Total duplicate entries: ${this.duplicatesFound}`);
      
      if (duplicates.size > 0) {
        console.log('\n📋 Sample duplicates:');
        let count = 0;
        for (const [key, entries] of duplicates) {
          if (count >= 5) break; // Show only first 5
          const [studentId, taskId] = key.split('-');
          console.log(`   Student: ${studentId}, Task: ${taskId}, Count: ${entries.length}`);
          count++;
        }
      }
      
    } catch (error) {
      console.error('❌ Error finding duplicates:', error);
      this.errors.push(`Find duplicates: ${error.message}`);
    }
  }

  async removeDuplicates() {
    console.log('\n🗑️  Step 2: Removing duplicate entries...');
    
    try {
      // Get all completed progress entries again
      const { data: progressData, error } = await supabase
        .from('student_progress')
        .select('id, student_id, task_id, status, completed_at, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching progress data: ${error.message}`);
      }
      
      if (!progressData || progressData.length === 0) {
        console.log('✅ No progress data to clean');
        return;
      }
      
      // Group by student_id and task_id
      const grouped = new Map();
      
      progressData.forEach(progress => {
        const key = `${progress.student_id}-${progress.task_id}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(progress);
      });
      
      // For each group with duplicates, keep the latest and remove the rest
      const idsToRemove = [];
      
      grouped.forEach((entries, key) => {
        if (entries.length > 1) {
          // Sort by created_at descending (latest first)
          entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          // Keep the first (latest) entry, mark the rest for removal
          const toKeep = entries[0];
          const toRemove = entries.slice(1);
          
          console.log(`   Keeping latest entry for ${key} (${toKeep.id})`);
          console.log(`   Removing ${toRemove.length} duplicates`);
          
          idsToRemove.push(...toRemove.map(entry => entry.id));
        }
      });
      
      if (idsToRemove.length === 0) {
        console.log('✅ No duplicates to remove');
        return;
      }
      
      console.log(`🗑️  Removing ${idsToRemove.length} duplicate entries...`);
      
      // Remove duplicates in batches
      const batchSize = 100;
      for (let i = 0; i < idsToRemove.length; i += batchSize) {
        const batch = idsToRemove.slice(i, i + batchSize);
        
        const { error: deleteError } = await supabase
          .from('student_progress')
          .delete()
          .in('id', batch);
        
        if (deleteError) {
          throw new Error(`Error deleting batch: ${deleteError.message}`);
        }
        
        this.duplicatesRemoved += batch.length;
        console.log(`   Removed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(idsToRemove.length / batchSize)}`);
      }
      
      console.log(`✅ Successfully removed ${this.duplicatesRemoved} duplicate entries`);
      
    } catch (error) {
      console.error('❌ Error removing duplicates:', error);
      this.errors.push(`Remove duplicates: ${error.message}`);
    }
  }

  async verifyCleanup() {
    console.log('\n🔍 Step 3: Verifying cleanup...');
    
    try {
      // Check for remaining duplicates
      const { data: progressData, error } = await supabase
        .from('student_progress')
        .select('student_id, task_id, status')
        .eq('status', 'completed');
      
      if (error) {
        throw new Error(`Error verifying cleanup: ${error.message}`);
      }
      
      if (!progressData || progressData.length === 0) {
        console.log('✅ No progress data found');
        return;
      }
      
      // Check for duplicates
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
        console.log('✅ No duplicate entries found - cleanup successful!');
      } else {
        console.log(`❌ Still found ${duplicateEntries.length} duplicate groups`);
        console.log('   Sample remaining duplicates:', duplicateEntries.slice(0, 3));
      }
      
    } catch (error) {
      console.error('❌ Error verifying cleanup:', error);
      this.errors.push(`Verify cleanup: ${error.message}`);
    }
  }

  printSummary() {
    console.log('\n📊 Cleanup Summary:');
    console.log('==================');
    console.log(`🔍 Duplicates found: ${this.duplicatesFound}`);
    console.log(`🗑️  Duplicates removed: ${this.duplicatesRemoved}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (this.errors.length === 0 && this.duplicatesRemoved > 0) {
      console.log('\n🎉 Cleanup completed successfully!');
      console.log('   The inflated completion percentages should now be fixed.');
    } else if (this.errors.length === 0) {
      console.log('\n✅ No duplicates found - database is already clean!');
    } else {
      console.log('\n⚠️  Cleanup completed with errors. Please review the issues above.');
    }
  }
}

// Run the cleaner
const cleaner = new DuplicateProgressCleaner();
cleaner.run().catch(console.error);
