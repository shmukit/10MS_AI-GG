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

async function checkCurrentState() {
  try {
    console.log('🔍 CHECKING CURRENT DATABASE STATE...\n');
    
    // Check auth.users
    console.log('📋 AUTH.USERS:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
    } else {
      const raiedAuth = authUsers.users.find(u => u.email === 'raied@10minuteschool.com');
      if (raiedAuth) {
        console.log('✅ Found in auth.users:', {
          id: raiedAuth.id,
          email: raiedAuth.email,
          created_at: raiedAuth.created_at
        });
      } else {
        console.log('❌ NOT found in auth.users');
      }
    }
    
    // Check public.users
    console.log('\n📋 PUBLIC.USERS:');
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'raied@10minuteschool.com');
    
    if (publicError) {
      console.error('❌ Error fetching public users:', publicError);
    } else if (publicUsers && publicUsers.length > 0) {
      console.log('✅ Found in public.users:', publicUsers.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        created_at: u.created_at
      })));
    } else {
      console.log('❌ NOT found in public.users');
    }
    
    // Check student_profiles
    console.log('\n📋 STUDENT_PROFILES:');
    const { data: profiles, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', 'a7a70864-3577-4ade-8264-757ec3f63ce3');
    
    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
    } else if (profiles && profiles.length > 0) {
      console.log('✅ Found profiles for old ID:', profiles.map(p => ({
        id: p.id,
        user_id: p.user_id,
        institute: p.institute
      })));
    } else {
      console.log('❌ No profiles found for old ID');
    }
    
    // Check batch assignments
    console.log('\n📋 BATCH ASSIGNMENTS:');
    const { data: assignments, error: assignmentError } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .eq('student_id', 'a7a70864-3577-4ade-8264-757ec3f63ce3');
    
    if (assignmentError) {
      console.error('❌ Error fetching assignments:', assignmentError);
    } else if (assignments && assignments.length > 0) {
      console.log('✅ Found assignments for old ID:', assignments.map(a => ({
        id: a.id,
        student_id: a.student_id,
        batch_id: a.batch_id,
        status: a.status
      })));
    } else {
      console.log('❌ No assignments found for old ID');
    }
    
    // Check if there are any assignments for the auth.users ID
    console.log('\n🔍 CHECKING FOR ASSIGNMENTS WITH AUTH.USERS ID...');
    const { data: authAssignments, error: authAssignmentError } = await supabase
      .from('student_batch_assignments')
      .select('*')
      .eq('student_id', '50103e4f-a176-4998-af73-ba1beb45ae8d');
    
    if (authAssignmentError) {
      console.error('❌ Error fetching auth assignments:', authAssignmentError);
    } else if (authAssignments && authAssignments.length > 0) {
      console.log('⚠️  Found assignments for auth.users ID:', authAssignments.map(a => ({
        id: a.id,
        student_id: a.student_id,
        batch_id: a.batch_id,
        status: a.status
      })));
    } else {
      console.log('✅ No assignments found for auth.users ID (this is correct)');
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('The issue is that the frontend is using the auth.users ID but the database');
    console.log('still has data linked to the old public.users ID.');
    console.log('We need to run the corrected auth trigger to fix this permanently.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCurrentState();
