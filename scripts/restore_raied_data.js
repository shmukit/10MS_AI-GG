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

async function restoreRaiedData() {
  try {
    console.log('🔄 RESTORING RAIED DATA...\n');
    
    // Step 1: Create user record with the auth.users ID
    console.log('📝 Step 1: Creating user record...');
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: '50103e4f-a176-4998-af73-ba1beb45ae8d',
        email: 'raied@10minuteschool.com',
        password_hash: '$2a$10$NeverStopLearning!',
        role: 'admin',
        first_name: 'Raied',
        last_name: 'Hasan',
        is_active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (userError) {
      console.error('❌ Error creating user:', userError);
      return;
    } else {
      console.log('✅ User record created');
    }
    
    // Step 2: Create student profile
    console.log('📝 Step 2: Creating student profile...');
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: '50103e4f-a176-4998-af73-ba1beb45ae8d',
        institute: '10 Minute School',
        year: '2025',
        subject: 'Computer Science',
        degree: 'Bachelor',
        completed_weeks: 0,
        progress_percentage: 0,
        enrollment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
    } else {
      console.log('✅ Student profile created');
    }
    
    // Step 3: Create batch assignment to Augmedix
    console.log('📝 Step 3: Creating batch assignment...');
    const { error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .insert({
        student_id: '50103e4f-a176-4998-af73-ba1beb45ae8d',
        batch_id: 'da36d58c-9850-4f78-948f-5ce4866d50a3', // Augmedix batch
        status: 'active',
        enrollment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (assignmentError) {
      console.error('❌ Error creating assignment:', assignmentError);
    } else {
      console.log('✅ Batch assignment created');
    }
    
    console.log('\n🎉 RAIED DATA RESTORED!');
    console.log('Now the dashboard should work correctly.');
    console.log('The user ID is now properly aligned between auth.users and public.users.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

restoreRaiedData();
