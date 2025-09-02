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

async function revertAndFixRaied() {
  try {
    console.log('🔄 STEP 1: Reverting database to correct state...');
    
    // First, delete the wrong user record we created
    const { error: deleteWrongUser } = await supabase
      .from('users')
      .delete()
      .eq('id', '50103e4f-a176-4998-af73-ba1beb45ae8d');
    
    if (deleteWrongUser) {
      console.error('❌ Error deleting wrong user:', deleteWrongUser);
    } else {
      console.log('✅ Deleted wrong user record');
    }
    
    // Update batch assignment back to the correct user ID
    const { error: updateAssignment } = await supabase
      .from('student_batch_assignments')
      .update({ student_id: 'a7a70864-3577-4ade-8264-757ec3f63ce3' })
      .eq('student_id', '50103e4f-a176-4998-af73-ba1beb45ae8d')
      .eq('batch_id', 'da36d58c-9850-4f78-948f-5ce4866d50a3');
    
    if (updateAssignment) {
      console.error('❌ Error updating batch assignment:', updateAssignment);
    } else {
      console.log('✅ Reverted batch assignment to correct user ID');
    }
    
    // Update student profile back to the correct user ID
    const { error: updateProfile } = await supabase
      .from('student_profiles')
      .update({ user_id: 'a7a70864-3577-4ade-8264-757ec3f63ce3' })
      .eq('user_id', '50103e4f-a176-4998-af73-ba1beb45ae8d');
    
    if (updateProfile) {
      console.error('❌ Error updating student profile:', updateProfile);
    } else {
      console.log('✅ Reverted student profile to correct user ID');
    }
    
    console.log('🔄 STEP 2: Now raied needs to sign up again to trigger the corrected auth trigger...');
    console.log('📝 The corrected trigger will:');
    console.log('   1. Detect that raied@10minuteschool.com already exists in public.users');
    console.log('   2. Update the existing record to use the auth.users ID');
    console.log('   3. Preserve all batch assignments and relationships');
    
    console.log('🎯 NEXT STEPS:');
    console.log('   1. Run the corrected auth trigger: fix_auth_trigger_correct.sql');
    console.log('   2. Have raied sign up again (this will trigger the corrected flow)');
    console.log('   3. The dashboard should now work correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

revertAndFixRaied();
