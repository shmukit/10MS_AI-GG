#!/usr/bin/env node
/**
 * Fix student login issues by resetting shared password via service role or mentor RPC.
 *
 * Usage:
 *   node scripts/fix_student_login.js --dry-run
 *   node scripts/fix_student_login.js --email shaylatasnim86@gmail.com
 *   node scripts/fix_student_login.js --limit 5
 *   node scripts/fix_student_login.js
 *
 * Modes (auto-selected):
 *   1. SUPABASE_SERVICE_ROLE_KEY — admin.createUser / admin.updateUserById
 *   2. SMOKE_TEST_EMAIL + TEST_USER_PASSWORD (mentor/admin) — upsert_student_user RPC
 *
 * Env:
 *   VITE_DEFAULT_STUDENT_PASSWORD or STUDENT_PASSWORD (required)
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './loadEnv.js';

loadEnv();

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const singleEmail = args.includes('--email') ? args[args.indexOf('--email') + 1] : null;
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : null;
const allStudents = args.includes('--all-students');

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

const mentorEmail = process.env.SMOKE_TEST_EMAIL || process.env.MENTOR_EMAIL;
const mentorPassword = process.env.TEST_USER_PASSWORD || process.env.MENTOR_PASSWORD;

const serviceClient = serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const mentorClient = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const loginTestClient = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function listAllAuthUsers() {
  if (!serviceClient) return [];
  const users = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return users;
}

async function fetchPublicStudents(client) {
  let query = client
    .from('users')
    .select('id, email, first_name, last_name, phone, role, created_at')
    .eq('role', 'student')
    .order('created_at');

  if (singleEmail) query = query.ilike('email', singleEmail);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loginWorks(email, attempt = 1) {
  const { error } = await loginTestClient.auth.signInWithPassword({ email, password: sharedPassword });
  if (!error) {
    await loginTestClient.auth.signOut();
    return true;
  }
  if (error.message?.includes('rate limit') && attempt < 4) {
    await sleep(1500 * attempt);
    return loginWorks(email, attempt + 1);
  }
  return false;
}

async function ensureMentorSession() {
  if (!mentorEmail || !mentorPassword) {
    throw new Error('Need SUPABASE_SERVICE_ROLE_KEY or SMOKE_TEST_EMAIL + TEST_USER_PASSWORD');
  }
  const { data, error } = await mentorClient.auth.getSession();
  if (!error && data.session) return;

  const { error: signInError } = await mentorClient.auth.signInWithPassword({
    email: mentorEmail,
    password: mentorPassword,
  });
  if (signInError) throw new Error(`Mentor sign-in failed: ${signInError.message}`);
}

async function fixWithServiceRole(student, authByEmail) {
  const authUser = authByEmail.get(student.email.toLowerCase());

  if (!authUser) {
    if (dryRun) return { action: 'createUser', email: student.email };
    const { data, error } = await serviceClient.auth.admin.createUser({
      email: student.email,
      password: sharedPassword,
      email_confirm: true,
      user_metadata: {
        role: 'student',
        first_name: student.first_name,
        last_name: student.last_name,
        email_verified: true,
        name: `${student.first_name ?? ''} ${student.last_name ?? ''}`.trim(),
      },
    });
    if (error) throw error;

    if (data.user.id !== student.id) {
      const { error: updateError } = await serviceClient
        .from('users')
        .update({ id: data.user.id })
        .eq('id', student.id);
      if (updateError) {
        return {
          action: 'createUser_id_mismatch',
          email: student.email,
          warning: `auth id ${data.user.id} != public id ${student.id}; manual reconcile needed`,
        };
      }
    }
    return { action: 'createUser', email: student.email, authId: data.user.id };
  }

  if (dryRun) return { action: 'updateUserById', email: student.email, authId: authUser.id };

  const { error } = await serviceClient.auth.admin.updateUserById(authUser.id, {
    password: sharedPassword,
    email_confirm: true,
    user_metadata: {
      ...authUser.user_metadata,
      role: 'student',
      first_name: student.first_name,
      last_name: student.last_name,
      email_verified: true,
    },
  });
  if (error) throw error;
  return { action: 'updateUserById', email: student.email, authId: authUser.id };
}

async function fixWithMentorRpc(student, client) {
  if (dryRun) return { action: 'upsert_student_user', email: student.email };

  const { data, error } = await client.rpc('upsert_student_user', {
    p_user_id: student.id,
    p_email: student.email,
    p_password: sharedPassword,
    p_first_name: student.first_name || student.email.split('@')[0],
    p_last_name: student.last_name || '',
    p_phone: student.phone || null,
  });

  if (error) throw error;
  return { action: 'upsert_student_user', email: student.email, result: data };
}

async function main() {
  console.log('Student login fix');
  console.log('Mode:', serviceClient ? 'service_role admin API' : 'mentor upsert_student_user RPC');
  console.log('Dry run:', dryRun);
  if (singleEmail) console.log('Filter:', singleEmail);
  if (limit) console.log('Limit:', limit);
  console.log('');

  let workClient = serviceClient;
  let signedInAsMentor = false;

  if (!workClient) {
    await ensureMentorSession();
    signedInAsMentor = true;
    workClient = mentorClient;
  }

  const [students, authUsers] = await Promise.all([
    fetchPublicStudents(workClient),
    listAllAuthUsers(),
  ]);

  const authByEmail = new Map(authUsers.map((u) => [u.email?.toLowerCase(), u]));

  const targets = [];
  if (allStudents || singleEmail) {
    for (const student of students) {
      targets.push(student);
      if (limit && targets.length >= limit) break;
    }
  } else {
    for (const student of students) {
      if (await loginWorks(student.email)) continue;
      targets.push(student);
      if (limit && targets.length >= limit) break;
      await sleep(120);
    }
  }

  console.log(`Students needing fix: ${targets.length} / ${students.length}`);

  const results = { fixed: [], failed: [], skipped: [] };

  for (let i = 0; i < targets.length; i++) {
    const student = targets[i];
    process.stdout.write(`[${i + 1}/${targets.length}] ${student.email} ... `);
    try {
      if (!serviceClient) await ensureMentorSession();

      const outcome = serviceClient
        ? await fixWithServiceRole(student, authByEmail)
        : await fixWithMentorRpc(student, workClient);

      if (!dryRun) {
        const ok = await loginWorks(student.email);
        if (!ok) {
          results.failed.push({ email: student.email, outcome, error: 'login still fails after fix' });
          console.log('FAIL (login still fails)');
          continue;
        }
      }

      results.fixed.push({ email: student.email, outcome });
      console.log(dryRun ? `DRY-RUN ${outcome.action}` : `OK (${outcome.action})`);
    } catch (err) {
      results.failed.push({ email: student.email, error: err.message });
      console.log(`ERROR: ${err.message}`);
    }
    await sleep(250);
  }

  if (signedInAsMentor) await mentorClient.auth.signOut();

  console.log('\nDone');
  console.log(`  fixed: ${results.fixed.length}`);
  console.log(`  failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailures:');
    results.failed.forEach((f) => console.log(`  ${f.email}: ${f.error}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fix failed:', err.message);
  process.exit(1);
});
