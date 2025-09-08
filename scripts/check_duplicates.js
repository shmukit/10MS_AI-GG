import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  try {
    console.log('🔍 Checking for duplicate progress records...');
    
    // Get all progress records to find duplicates manually
    const { data: allRecords, error: allRecordsError } = await supabase
      .from('student_progress')
      .select('*')
      .order('student_id, task_id, created_at');
    
    if (allRecordsError) {
      console.log('❌ Error fetching all records:', allRecordsError);
      return;
    }
    
    // Find duplicates manually
    const duplicates = new Map();
    allRecords.forEach(record => {
      const key = `${record.student_id}-${record.task_id}`;
      if (!duplicates.has(key)) {
        duplicates.set(key, []);
      }
      duplicates.get(key).push(record);
    });
    
    const duplicateGroups = Array.from(duplicates.values()).filter(group => group.length > 1);
    
    console.log('📊 Duplicate groups found:', duplicateGroups.length);
    
    // Process each duplicate group
    for (const duplicateGroup of duplicateGroups) {
      const firstRecord = duplicateGroup[0];
      console.log(`\n🔍 Checking duplicates for student ${firstRecord.student_id} and task ${firstRecord.task_id}:`);
      
      console.log('📋 Records:', duplicateGroup);
      
      // Keep the latest record, delete the rest
      if (duplicateGroup.length > 1) {
        console.log('🧹 Cleaning up duplicates...');
        const recordsToDelete = duplicateGroup.slice(0, -1); // All except the last one
        
        for (const record of recordsToDelete) {
          console.log(`🗑️ Deleting duplicate record: ${record.id}`);
          const { error: deleteError } = await supabase
            .from('student_progress')
            .delete()
            .eq('id', record.id);
          
          if (deleteError) {
            console.log('❌ Error deleting record:', deleteError);
          } else {
            console.log('✅ Deleted successfully');
          }
        }
      }
    }
    
    // Check if there should be a unique constraint
    console.log('\n🔍 Checking for unique constraints...');
    const { data: constraints, error: constraintError } = await supabase
      .rpc('get_table_constraints', { table_name: 'student_progress' });
    
    if (constraintError) {
      console.log('❌ Error checking constraints:', constraintError);
      // Try alternative approach
      const { data: info, error: infoError } = await supabase
        .from('information_schema.table_constraints')
        .select('*')
        .eq('table_name', 'student_progress')
        .eq('constraint_type', 'UNIQUE');
      
      if (infoError) {
        console.log('❌ Error with information_schema:', infoError);
      } else {
        console.log('📋 Unique constraints:', info);
      }
    } else {
      console.log('📋 Constraints:', constraints);
    }
    
    // Add unique constraint if it doesn't exist
    console.log('\n🔧 Adding unique constraint if needed...');
    const { error: addConstraintError } = await supabase
      .rpc('add_unique_constraint', {
        table_name: 'student_progress',
        column_names: ['student_id', 'task_id']
      });
    
    if (addConstraintError) {
      console.log('❌ Error adding constraint:', addConstraintError);
      console.log('This might be expected if the constraint already exists or the function doesn\'t exist');
    } else {
      console.log('✅ Unique constraint added successfully');
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkDuplicates();
