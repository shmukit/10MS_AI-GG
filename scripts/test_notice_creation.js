#!/usr/bin/env node

/**
 * Test Notice Creation and RLS Policies
 * Specifically tests the notice creation issue mentioned in the error
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNoticeCreation() {
  console.log('🔍 Testing Notice Creation...\n');
  
  try {
    // First, get a mentor user
    const { data: mentor, error: mentorError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'mentor')
      .limit(1)
      .single();
    
    if (mentorError || !mentor) {
      console.error('❌ No mentor found:', mentorError?.message);
      return false;
    }
    
    console.log(`✅ Found mentor: ${mentor.email} (${mentor.id})`);
    
    // Test 1: Check current RLS policies for notices
    console.log('\n📋 Checking RLS policies for notices...');
    // Try to query notices directly to test RLS
    const { data: policies, error: policyError } = await supabase
      .from('notices')
      .select('*')
      .limit(1);
    
    if (policyError) {
      console.log('⚠️  Could not check RLS policies directly:', policyError.message);
    } else {
      console.log('✅ Can access notices table');
    }
    
    // Test 2: Try to read notices (should work with current policies)
    console.log('\n📖 Testing notice reading...');
    const { data: existingNotices, error: readError } = await supabase
      .from('notices')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('❌ Notice reading failed:', readError.message);
      console.error('Error details:', readError);
    } else {
      console.log(`✅ Successfully read ${existingNotices.length} notices`);
      if (existingNotices.length > 0) {
        console.log('Sample notices:');
        existingNotices.forEach(notice => {
          console.log(`  - ${notice.title} (${notice.tag}) - Author: ${notice.author_id}`);
        });
      }
    }
    
    // Test 3: Try to create a notice (this is where the error occurs)
    console.log('\n➕ Testing notice creation...');
    const testNotice = {
      title: `Test Notice ${Date.now()}`,
      content: 'This is a test notice for debugging the creation issue',
      tag: 'Test',
      priority: 'medium',
      is_published: true,
      author_id: mentor.id,
      batch_id: null
    };
    
    console.log('Creating notice with data:', testNotice);
    
    const { data: createData, error: createError } = await supabase
      .from('notices')
      .insert([testNotice])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Notice creation failed:', createError.message);
      console.error('Error code:', createError.code);
      console.error('Error details:', createError);
      console.error('Error hint:', createError.hint);
      
      // Check if it's a constraint violation
      if (createError.code === '23503') {
        console.log('\n🔍 This is a foreign key constraint violation (23503)');
        console.log('This means the author_id or batch_id references a non-existent record');
        
        // Check if the mentor ID exists in auth.users
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        console.log('Current auth user:', authUser.user?.id);
        console.log('Mentor ID from users table:', mentor.id);
        console.log('Do they match?', authUser.user?.id === mentor.id);
      }
      
      return false;
    }
    
    console.log('✅ Notice created successfully:', createData);
    
    // Test 4: Try to update the notice
    console.log('\n✏️  Testing notice update...');
    const { data: updateData, error: updateError } = await supabase
      .from('notices')
      .update({ 
        title: `Updated Test Notice ${Date.now()}`,
        content: 'This notice has been updated'
      })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Notice update failed:', updateError.message);
      console.error('Error details:', updateError);
    } else {
      console.log('✅ Notice updated successfully:', updateData);
    }
    
    // Test 5: Try to delete the notice
    console.log('\n🗑️  Testing notice deletion...');
    const { error: deleteError } = await supabase
      .from('notices')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      console.error('❌ Notice deletion failed:', deleteError.message);
      console.error('Error details:', deleteError);
    } else {
      console.log('✅ Notice deleted successfully');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Notice creation test failed:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('🔐 Testing Authentication...\n');
  
  try {
    // Try to get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ Current session:', session.user.email);
    } else {
      console.log('⚠️  No active session');
    }
    
    // Try to sign in with a mentor account
    const { data: mentor, error: mentorError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'mentor')
      .limit(1)
      .single();
    
    if (mentorError || !mentor) {
      console.error('❌ No mentor found for auth test');
      return false;
    }
    
    console.log(`Found mentor: ${mentor.email}`);
    
    // Note: We can't actually sign in via the API without the password
    // But we can test if the user exists and has the right role
    
    return true;
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return false;
  }
}

async function checkRLSPolicies() {
  console.log('🔒 Checking RLS Policies...\n');
  
  try {
    // Check if we can access the pg_policies table
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'notices');
    
    if (policyError) {
      console.log('⚠️  Could not access pg_policies table directly');
      console.log('Error:', policyError.message);
    } else {
      console.log(`Found ${policies.length} policies for notices table`);
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ RLS policy check failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Notice Creation Debug Test\n');
  
  const authOk = await testAuthentication();
  const rlsOk = await checkRLSPolicies();
  const noticeOk = await testNoticeCreation();
  
  console.log('\n📋 Test Summary:');
  console.log(`  Authentication: ${authOk ? '✅' : '❌'}`);
  console.log(`  RLS Policies: ${rlsOk ? '✅' : '❌'}`);
  console.log(`  Notice CRUD: ${noticeOk ? '✅' : '❌'}`);
  
  if (noticeOk) {
    console.log('\n🎉 Notice creation is working correctly!');
  } else {
    console.log('\n⚠️  Notice creation has issues. Check the errors above.');
  }
}

// Run the test
main().catch(console.error);
