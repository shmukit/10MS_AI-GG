#!/usr/bin/env node
/**
 * Print fleet auth consistency counts (mirrors SQL verification in
 * sql/20260619_fix_student_auth_passwords.sql).
 *
 * Usage:
 *   node scripts/fleet_sql_counts.js
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY for auth.users access.
 * Without it, prints login-based estimates from public.users only.
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './loadEnv.js';

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const sharedPassword =
  process.env.VITE_DEFAULT_STUDENT_PASSWORD ||
  process.env.STUDENT_PASSWORD;

if (!sharedPassword) {
  console.error('Set VITE_DEFAULT_STUDENT_PASSWORD or STUDENT_PASSWORD in .env.local');
  process.exit(1);
}

if (!supabaseUrl || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function listAllAuthUsers(client) {
  const users = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return users;
}

async function fetchPublicStudents(client) {
  const { data, error } = await client
    .from('users')
    .select('id, email, created_at')
    .eq('role', 'student');
  if (error) throw error;
  return data ?? [];
}

async function testLoginWithClient(client, email, attempt = 1) {
  const { error } = await client.auth.signInWithPassword({ email, password: sharedPassword });
  if (!error) {
    await client.auth.signOut();
    return true;
  }
  if (error.message?.includes('rate limit') && attempt < 4) {
    await sleep(1500 * attempt);
    return testLoginWithClient(client, email, attempt + 1);
  }
  return false;
}

async function main() {
  console.log('Fleet SQL-style counts\n');

  let dbClient;
  let signedIn = false;

  if (serviceKey) {
    dbClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    const mentorEmail = process.env.SMOKE_TEST_EMAIL;
    const mentorPassword = process.env.TEST_USER_PASSWORD;
    if (!mentorEmail || !mentorPassword) {
      console.error('Need SUPABASE_SERVICE_ROLE_KEY or SMOKE_TEST_EMAIL + TEST_USER_PASSWORD');
      process.exit(1);
    }
    dbClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const { error } = await dbClient.auth.signInWithPassword({
      email: mentorEmail,
      password: mentorPassword,
    });
    if (error) throw error;
    signedIn = true;
  }

  const publicStudents = await fetchPublicStudents(dbClient);
  console.log(`public.users students: ${publicStudents.length}`);

  if (!serviceKey) {
    console.log('\nWithout service role — login-based estimate (sampling all students):');
    const loginClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    let ok = 0;
    let fail = 0;
    for (const s of publicStudents) {
      const works = await testLoginWithClient(loginClient, s.email);
      if (works) ok += 1;
      else fail += 1;
      await sleep(120);
    }
    console.log(`  login_ok (estimate): ${ok}`);
    console.log(`  login_fail (estimate): ${fail}`);
    if (signedIn) await dbClient.auth.signOut();
    return;
  }

  const authUsers = await listAllAuthUsers(dbClient);
  const authByEmail = new Map(authUsers.map((u) => [u.email?.toLowerCase(), u]));

  let orphanPublic = 0;
  let idMismatch = 0;
  let unconfirmed = 0;
  let noIdentity = 0;
  let matched = 0;

  for (const s of publicStudents) {
    const au = authByEmail.get(s.email.toLowerCase());
    if (!au) {
      orphanPublic += 1;
      continue;
    }
    if (au.id !== s.id) {
      idMismatch += 1;
      continue;
    }
    matched += 1;
    if (!au.email_confirmed_at) unconfirmed += 1;
    if (!(au.identities ?? []).some((i) => i.provider === 'email')) noIdentity += 1;
  }

  console.log(`auth.users total: ${authUsers.length}`);
  console.log(`orphan_public (public only): ${orphanPublic}`);
  console.log(`id_mismatch: ${idMismatch}`);
  console.log(`matched auth+public: ${matched}`);
  console.log(`unconfirmed_email: ${unconfirmed}`);
  console.log(`no_identity: ${noIdentity}`);
}

main().catch((err) => {
  console.error('Count failed:', err.message);
  process.exit(1);
});
