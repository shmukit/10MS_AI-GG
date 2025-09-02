const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRaiedIdMismatch() {
  try {
    console.log('🔍 Checking current state...');
    
    // Check current state
    const { data: authUser } = await supabase.auth.admin.getUserByEmail('raied@10minuteschool.com');
    const { data: publicUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'raied@10minuteschool.com')
      .single();
    
    console.log('Auth user ID:', authUser?.user?.id);
    console.log('Public user ID:', publicUser?.id);
    
    if (!authUser?.user?.id || !publicUser?.id) {
      console.error('❌ User not found in one or both tables');
      return;
    }
    
    const authUserId = authUser.user.id;
    const publicUserId = publicUser.id;
    const batchId = 'da36d58c-9850-4f78-948f-5ce4866d50a3';
    
    if (authUserId === publicUserId) {
      console.log('✅ IDs already match, no fix needed');
      return;
    }
    
    console.log('🔧 Fixing ID mismatch...');
    
    // Update batch assignment to use auth.users ID
    const { error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .update({ student_id: authUserId })
      .eq('student_id', publicUserId)
      .eq('batch_id', batchId);
    
    if (assignmentError) {
      console.error('❌ Error updating batch assignment:', assignmentError);
    } else {
      console.log('✅ Updated batch assignment');
    }
    
    // Update student profile to use auth.users ID
    const { error: profileError } = await supabase
      .from('student_profiles')
      .update({ user_id: authUserId })
      .eq('user_id', publicUserId);
    
    if (profileError) {
      console.error('❌ Error updating student profile:', profileError);
    } else {
      console.log('✅ Updated student profile');
    }
    
    // Update public.users ID to match auth.users ID
    const { error: userError } = await supabase
      .from('users')
      .update({ id: authUserId })
      .eq('id', publicUserId);
    
    if (userError) {
      console.error('❌ Error updating public.users ID:', userError);
    } else {
      console.log('✅ Updated public.users ID');
    }
    
    console.log('🎉 ID mismatch fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRaiedIdMismatch();
