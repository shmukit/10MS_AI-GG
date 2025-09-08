import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserIdFix() {
  try {
    console.log('🧪 Testing user ID fix...');
    
    // Test with a known user email
    const testEmail = 'uttam@10minuteschool.com';
    const taskId = '1c05f973-3fcc-45d8-9236-0cc645cfe0e4';
    
    console.log('👤 Looking up user by email:', testEmail);
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', testEmail)
      .single();
    
    if (userError) {
      console.log('❌ User lookup error:', userError);
      return;
    }
    
    console.log('✅ Found user:', user);
    console.log('🆔 Database user ID:', user.id);
    
    // Test task completion with the correct user ID
    console.log('\n🧪 Testing task completion with correct user ID...');
    const progressData = {
      student_id: user.id,
      task_id: taskId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // First, check if progress already exists
    const { data: existingProgress, error: existingError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('task_id', taskId);
    
    if (existingError) {
      console.log('❌ Error checking existing progress:', existingError);
      return;
    }
    
    console.log('📊 Existing progress records:', existingProgress.length);
    
    let result;
    if (existingProgress && existingProgress.length > 0) {
      console.log('📝 Updating existing progress...');
      result = await supabase
        .from('student_progress')
        .update(progressData)
        .eq('student_id', user.id)
        .eq('task_id', taskId);
    } else {
      console.log('➕ Inserting new progress...');
      result = await supabase
        .from('student_progress')
        .insert(progressData);
    }
    
    if (result.error) {
      console.log('❌ Progress update error:', result.error);
      console.log('Error code:', result.error.code);
      console.log('Error message:', result.error.message);
      
      if (result.error.code === '23503') {
        console.log('🚨 Still getting foreign key constraint violation!');
      } else if (result.error.code === '23505') {
        console.log('🚨 Getting unique constraint violation!');
      }
    } else {
      console.log('✅ Progress update successful!');
      console.log('📊 Updated data:', result.data);
    }
    
    // Test upsert as well
    console.log('\n🔄 Testing upsert operation...');
    const { data: upsertResult, error: upsertError } = await supabase
      .from('student_progress')
      .upsert(progressData);
    
    if (upsertError) {
      console.log('❌ Upsert error:', upsertError);
      console.log('Error code:', upsertError.code);
      console.log('Error message:', upsertError.message);
    } else {
      console.log('✅ Upsert successful!');
      console.log('📊 Upsert data:', upsertResult);
    }
    
    // Final verification
    console.log('\n📊 Final verification...');
    const { data: finalProgress, error: finalError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('task_id', taskId);
    
    if (finalError) {
      console.log('❌ Final verification error:', finalError);
    } else {
      console.log('📊 Final progress records:', finalProgress.length);
      if (finalProgress.length > 0) {
        console.log('✅ Task completion working correctly!');
      } else {
        console.log('⚠️ No progress records found');
      }
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testUserIdFix();
