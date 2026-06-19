#!/usr/bin/env node
/**
 * Diagnose a single student email across auth.users, public.users, and identities.
 *
 * Usage:
 *   node scripts/diagnose_student_email.js shaylatasnim86@gmail.com
 *
 * Requires: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env / .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './loadEnv.js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/diagnose_student_email.js <email>');
  process.exit(1);
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const normalizedEmail = email.toLowerCase();

async function findAuthUser() {
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (match) return match;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

async function main() {
  console.log(`\nDiagnosing: ${email}\n`);

  const authUser = await findAuthUser();
  const { data: publicUser, error: publicError } = await supabase
    .from('users')
    .select('id, email, role, is_active, email_verified, created_at, updated_at')
    .ilike('email', email)
    .maybeSingle();

  if (publicError) {
    console.error('public.users query failed:', publicError.message);
    process.exit(1);
  }

  console.log('--- auth.users ---');
  if (authUser) {
    console.log('  status: EXISTS');
    console.log('  id:', authUser.id);
    console.log('  email:', authUser.email);
    console.log('  email_confirmed_at:', authUser.email_confirmed_at ?? 'NULL');
    console.log('  created_at:', authUser.created_at);
    console.log('  updated_at:', authUser.updated_at);
    console.log('  role (metadata):', authUser.user_metadata?.role ?? 'n/a');
  } else {
    console.log('  status: MISSING');
  }

  console.log('\n--- public.users ---');
  if (publicUser) {
    console.log('  status: EXISTS');
    console.log('  id:', publicUser.id);
    console.log('  email:', publicUser.email);
    console.log('  role:', publicUser.role);
    console.log('  is_active:', publicUser.is_active);
    console.log('  email_verified:', publicUser.email_verified);
    console.log('  created_at:', publicUser.created_at);
  } else {
    console.log('  status: MISSING');
  }

  console.log('\n--- ID match ---');
  if (authUser && publicUser) {
    const match = authUser.id === publicUser.id;
    console.log('  auth_id:', authUser.id);
    console.log('  public_id:', publicUser.id);
    console.log('  match:', match ? 'YES' : 'NO — ID MISMATCH');
  } else {
    console.log('  match: N/A (one or both tables missing row)');
  }

  console.log('\n--- auth.identities (email provider) ---');
  if (authUser) {
    const identities = authUser.identities ?? [];
    const emailIdentity = identities.find((i) => i.provider === 'email');
    if (emailIdentity) {
      console.log('  status: EXISTS');
      console.log('  identity_id:', emailIdentity.id);
      console.log('  provider_id:', emailIdentity.identity_data?.email ?? emailIdentity.provider_id);
    } else {
      console.log('  status: MISSING email identity');
      console.log('  identities:', identities.map((i) => i.provider).join(', ') || 'none');
    }
  } else {
    console.log('  status: N/A (no auth user)');
  }

  console.log('\n--- category ---');
  let category = 'unknown';
  if (!authUser && publicUser) category = 'orphan_public';
  else if (authUser && !publicUser) category = 'orphan_auth';
  else if (authUser && publicUser && authUser.id !== publicUser.id) category = 'id_mismatch';
  else if (authUser && !authUser.email_confirmed_at) category = 'unconfirmed_email';
  else if (authUser && !(authUser.identities ?? []).some((i) => i.provider === 'email')) category = 'no_identity';
  else if (authUser && publicUser) category = 'auth_present_check_password';
  else if (!authUser && !publicUser) category = 'not_provisioned';

  console.log('  ', category);

  const defaultPassword =
    process.env.VITE_DEFAULT_STUDENT_PASSWORD || process.env.STUDENT_PASSWORD || 'NeverStopLearning!';

  if (authUser) {
    console.log('\n--- login test (anon key) ---');
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!anonKey) {
      console.log('  skipped: VITE_SUPABASE_ANON_KEY not set');
    } else {
      const anonClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: signInError } = await anonClient.auth.signInWithPassword({
        email,
        password: defaultPassword,
      });
      if (signInError) {
        console.log('  result: FAIL —', signInError.message);
      } else {
        console.log('  result: OK');
        await anonClient.auth.signOut();
      }
    }
  }

  console.log('');
}

main().catch((err) => {
  console.error('Diagnosis failed:', err.message);
  process.exit(1);
});
