import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRaiedId() {
  try {
    console.log('🔧 Fixing raied ID mismatch...');
    
    // Step 1: First, create a new user record with the auth.users ID
    console.log('📝 Step 1: Creating new user record with auth.users ID...');
    const { error: createUserError } = await supabase
      .from('users')
      .insert({
        id: '50103e4f-a176-4998-af73-ba1beb45ae8d',
        email: 'raied@10minuteschool.com',
        password_hash: '$2a$10$NeverStopLearning!', // Platform password hash
        role: 'admin',
        first_name: 'Raied',
        last_name: 'Hasan',
        is_active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (createUserError) {
      console.error('❌ Error creating new user record:', createUserError);
    } else {
      console.log('✅ Created new user record with auth.users ID');
    }
    
    // Step 2: Update batch assignment to use auth.users ID
    console.log('📝 Step 2: Updating batch assignment...');
    const { error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .update({ student_id: '50103e4f-a176-4998-af73-ba1beb45ae8d' })
      .eq('student_id', 'a7a70864-3577-4ade-8264-757ec3f63ce3')
      .eq('batch_id', 'da36d58c-9850-4f78-948f-5ce4866d50a3');
    
    if (assignmentError) {
      console.error('❌ Error updating batch assignment:', assignmentError);
    } else {
      console.log('✅ Updated batch assignment');
    }
    
    // Step 3: Update student profile to use auth.users ID
    console.log('📝 Step 3: Updating student profile...');
    const { error: profileError } = await supabase
      .from('student_profiles')
      .update({ user_id: '50103e4f-a176-4998-af73-ba1beb45ae8d' })
      .eq('user_id', 'a7a70864-3577-4ade-8264-757ec3f63ce3');
    
    if (profileError) {
      console.error('❌ Error updating student profile:', profileError);
    } else {
      console.log('✅ Updated student profile');
    }
    
    // Step 4: Delete the old user record
    console.log('📝 Step 4: Deleting old user record...');
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', 'a7a70864-3577-4ade-8264-757ec3f63ce3');
    
    if (deleteUserError) {
      console.error('❌ Error deleting old user record:', deleteUserError);
    } else {
      console.log('✅ Deleted old user record');
    }
    
    console.log('🎉 ID mismatch fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRaiedId();
