#!/usr/bin/env node
/**
 * Fleet audit: categorize students by auth state and shared-password login result.
 *
 * Usage:
 *   node scripts/audit_student_login.js
 *   node scripts/audit_student_login.js --email shaylatasnim86@gmail.com
 *   node scripts/audit_student_login.js --output reports/student_login_audit.json
 *
 * Env (preferred):
 *   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_ANON_KEY
 *   VITE_DEFAULT_STUDENT_PASSWORD or STUDENT_PASSWORD (required)
 *
 * Fallback (no service role): SMOKE_TEST_EMAIL + TEST_USER_PASSWORD (mentor/admin)
 *   — can audit login_fail/login_ok and public.users; auth schema checks need service role.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './loadEnv.js';

loadEnv();

const args = process.argv.slice(2);
const singleEmail = args.includes('--email') ? args[args.indexOf('--email') + 1] : null;
const outputPath = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

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

const serviceClient = serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const anonClient = createClient(supabaseUrl, anonKey, {
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

async function fetchPublicStudents() {
  let client = serviceClient;
  let signedInAsMentor = false;

  if (!client) {
    const mentorEmail = process.env.SMOKE_TEST_EMAIL;
    const mentorPassword = process.env.TEST_USER_PASSWORD;
    if (!mentorEmail || !mentorPassword) {
      throw new Error(
        'Need SUPABASE_SERVICE_ROLE_KEY or SMOKE_TEST_EMAIL + TEST_USER_PASSWORD to read public.users'
      );
    }
    const { error } = await anonClient.auth.signInWithPassword({
      email: mentorEmail,
      password: mentorPassword,
    });
    if (error) throw new Error(`Mentor sign-in failed: ${error.message}`);
    signedInAsMentor = true;
    client = anonClient;
  }

  let query = client
    .from('users')
    .select('id, email, first_name, last_name, phone, role, is_active, email_verified, created_at')
    .eq('role', 'student')
    .order('created_at');

  if (singleEmail) {
    query = query.ilike('email', singleEmail);
  }

  const { data, error } = await query;
  if (signedInAsMentor) await anonClient.auth.signOut();
  if (error) throw error;
  return data ?? [];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testLogin(email, attempt = 1) {
  const { error } = await anonClient.auth.signInWithPassword({
    email,
    password: sharedPassword,
  });
  if (!error) {
    await anonClient.auth.signOut();
    return { ok: true, message: null };
  }
  if (error.message?.includes('rate limit') && attempt < 4) {
    await sleep(1500 * attempt);
    return testLogin(email, attempt + 1);
  }
  return { ok: false, message: error.message ?? null };
}

function categorizeStudent(publicUser, authByEmail) {
  const emailKey = publicUser.email.toLowerCase();
  const authUser = authByEmail.get(emailKey) ?? null;
  const tags = [];
  const hasAuthIndex = authByEmail.size > 0;

  if (!authUser) {
    if (hasAuthIndex) {
      tags.push('orphan_public');
      return { category: 'orphan_public', tags, authUser: null };
    }
    // Without service role we cannot inspect auth.users; defer to login test.
    return { category: 'auth_unknown', tags: ['auth_index_unavailable'], authUser: null };
  }

  if (authUser.id !== publicUser.id) {
    tags.push('id_mismatch');
    return { category: 'id_mismatch', tags, authUser };
  }

  if (!authUser.email_confirmed_at) tags.push('unconfirmed_email');

  const hasEmailIdentity = (authUser.identities ?? []).some((i) => i.provider === 'email');
  if (!hasEmailIdentity) tags.push('no_identity');

  if (tags.length > 0 && tags.some((t) => t !== 'unconfirmed_email')) {
    return { category: tags[0], tags, authUser };
  }

  if (!authUser.email_confirmed_at) {
    return { category: 'unconfirmed_email', tags, authUser };
  }

  return { category: 'auth_present', tags, authUser };
}

async function main() {
  console.log('Student login fleet audit');
  console.log(
    'Shared password source:',
    process.env.VITE_DEFAULT_STUDENT_PASSWORD ? 'VITE_DEFAULT_STUDENT_PASSWORD' : 'STUDENT_PASSWORD'
  );
  console.log('Service role:', serviceKey ? 'yes' : 'no (limited auth schema checks)');
  if (singleEmail) console.log('Filter:', singleEmail);
  console.log('');

  const [publicStudents, authUsers] = await Promise.all([
    fetchPublicStudents(),
    listAllAuthUsers(),
  ]);

  const authByEmail = new Map(authUsers.map((u) => [u.email?.toLowerCase(), u]));
  const publicIds = new Set(publicStudents.map((s) => s.id));

  const results = {
    generatedAt: new Date().toISOString(),
    sharedPasswordConfigured: Boolean(process.env.VITE_DEFAULT_STUDENT_PASSWORD || process.env.STUDENT_PASSWORD),
    totals: {
      publicStudents: publicStudents.length,
      authUsers: authUsers.length,
      orphanAuth: authUsers.filter((u) => !publicIds.has(u.id) && (u.user_metadata?.role === 'student' || u.app_metadata?.role === 'student')).length,
    },
    categories: {
      login_ok: [],
      login_fail: [],
      orphan_public: [],
      id_mismatch: [],
      no_identity: [],
      unconfirmed_email: [],
      auth_unknown: [],
    },
    students: [],
  };

  let processed = 0;
  for (const student of publicStudents) {
    processed += 1;
    if (processed % 25 === 0) {
      process.stdout.write(`  tested ${processed}/${publicStudents.length}...\r`);
    }

    const { category, tags, authUser } = categorizeStudent(student, authByEmail);
    const login = await testLogin(student.email);
    await sleep(120);

    let finalCategory = category;
    if (
      category === 'auth_present' ||
      category === 'unconfirmed_email' ||
      category === 'auth_unknown'
    ) {
      finalCategory = login.ok ? 'login_ok' : 'login_fail';
    }

    const entry = {
      email: student.email,
      publicId: student.id,
      authId: authUser?.id ?? null,
      createdAt: student.created_at,
      category: finalCategory,
      tags,
      loginOk: login.ok,
      loginError: login.message,
      emailConfirmed: authUser?.email_confirmed_at ?? null,
    };

    results.students.push(entry);
    if (results.categories[finalCategory]) {
      results.categories[finalCategory].push(entry);
    }
  }

  console.log(`\nAudit complete (${publicStudents.length} students)\n`);
  console.log('Summary:');
  for (const [key, list] of Object.entries(results.categories)) {
    if (list.length > 0) console.log(`  ${key}: ${list.length}`);
  }

  if (outputPath) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nWrote ${outputPath}`);
  }

  const failing = results.students.filter((s) => !s.loginOk);
  if (failing.length > 0) {
    console.log('\nSample failures (up to 10):');
    failing.slice(0, 10).forEach((s) => {
      console.log(`  ${s.email} — ${s.category}${s.loginError ? ` (${s.loginError})` : ''}`);
    });
  }

  return results;
}

main().catch((err) => {
  console.error('Audit failed:', err.message);
  process.exit(1);
});
