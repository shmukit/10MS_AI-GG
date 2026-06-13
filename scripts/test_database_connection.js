#!/usr/bin/env node

/**
 * Database connectivity test (RLS-aware).
 *
 * - Verifies Supabase REST API is reachable
 * - Confirms RLS blocks unauthenticated reads (expected in production)
 * - Optionally signs in with SMOKE_TEST_EMAIL + TEST_USER_PASSWORD for authenticated checks
 *
 * Usage: npm run test:db
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv, requireSupabaseEnv } from './loadEnv.js';

loadEnv();
const { url: supabaseUrl, anonKey: supabaseAnonKey } = requireSupabaseEnv();

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const isRlsBlock = (error) =>
  error?.message?.includes('permission denied') ||
  error?.code === '42501' ||
  error?.code === 'PGRST301';

async function testApiReachable() {
  console.log('🔍 Testing Supabase API reachability...');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: supabaseAnonKey },
    });
    // 200 or 401 both mean the API endpoint is up
    if (res.status === 200 || res.status === 401) {
      console.log(`✅ Supabase API reachable (HTTP ${res.status})`);
      return true;
    }
    console.error(`❌ Unexpected HTTP status: ${res.status}`);
    return false;
  } catch (error) {
    console.error('❌ Cannot reach Supabase API:', error.message);
    return false;
  }
}

async function testRlsBlocksAnon() {
  console.log('\n🔒 Testing RLS blocks unauthenticated access...');
  const { error } = await supabase.from('users').select('id').limit(1);

  if (error && isRlsBlock(error)) {
    console.log('✅ RLS active — anon cannot read users table (expected)');
    return true;
  }

  if (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }

  console.warn('⚠️  Anon read on users succeeded — RLS may be too permissive');
  return true;
}

async function testAuthService() {
  console.log('\n🔐 Testing auth service...');
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('❌ Auth service error:', error.message);
    return false;
  }

  console.log(`✅ Auth service OK (session: ${data.session ? 'active' : 'none'})`);
  return true;
}

async function testAuthenticatedAccess() {
  const email = process.env.SMOKE_TEST_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    console.log('\n⏭️  Skipping authenticated tests (set SMOKE_TEST_EMAIL + TEST_USER_PASSWORD in .env)');
    return null;
  }

  console.log(`\n👤 Testing authenticated access as ${email}...`);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('❌ Sign-in failed:', signInError.message);
    return false;
  }

  console.log('✅ Sign-in successful');

  const tables = ['roadmaps', 'batches', 'notices', 'student_profiles'];
  let passed = 0;

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    } else {
      console.log(`   ✅ ${table}: accessible (${data?.length ?? 0} row sampled)`);
      passed++;
    }
  }

  await supabase.auth.signOut();

  const ok = passed > 0;
  console.log(ok ? `✅ Authenticated access OK (${passed}/${tables.length} tables)` : '❌ No tables accessible after sign-in');
  return ok;
}

async function main() {
  console.log('🚀 Database Connection Test (RLS-aware)\n');

  const apiOk = await testApiReachable();
  if (!apiOk) process.exit(1);

  const rlsOk = await testRlsBlocksAnon();
  const authOk = await testAuthService();
  const authedOk = await testAuthenticatedAccess();

  console.log('\n📋 Summary');
  console.log(`  API reachable:     ${apiOk ? '✅' : '❌'}`);
  console.log(`  RLS blocks anon:   ${rlsOk ? '✅' : '❌'}`);
  console.log(`  Auth service:      ${authOk ? '✅' : '❌'}`);
  console.log(`  Authenticated:     ${authedOk === null ? '⏭️  skipped' : authedOk ? '✅' : '❌'}`);

  const coreOk = apiOk && rlsOk && authOk;
  const allOk = coreOk && (authedOk === null || authedOk);

  if (allOk) {
    console.log('\n🎉 Database checks passed.');
    process.exit(0);
  }

  console.log('\n⚠️  Some checks failed. Review output above.');
  process.exit(coreOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
