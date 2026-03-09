#!/usr/bin/env node
/**
 * Verifies that every active student can log in with "NeverStopLearning!"
 *
 * What it does:
 * - Reads active student emails from `public.users`
 * - Attempts `supabase.auth.signInWithPassword` for each email
 * - Reports failures (missing auth account, wrong password, etc.)
 *
 * Requirements:
 * - `.env` must contain `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing env: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const PASSWORD = 'NeverStopLearning!';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchActiveStudentEmails() {
  const supabase = makeClient();
  const { data, error } = await supabase
    .from('users')
    .select('email, is_active')
    .eq('role', 'student')
    .order('created_at', { ascending: true });

  if (error) throw error;
  const rows = (data || []).filter((r) => typeof r?.email === 'string' && r.email.includes('@'));
  const active = rows.filter((r) => r.is_active === true);
  const inactive = rows.filter((r) => r.is_active !== true);
  return {
    all: rows.map((r) => r.email),
    active: active.map((r) => r.email),
    inactive: inactive.map((r) => r.email),
  };
}

function isRateLimitError(message) {
  return typeof message === 'string' && message.toLowerCase().includes('rate limit');
}

async function tryLoginWithRetry(email, maxAttempts = 4) {
  let backoffMs = 1500;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const supabase = makeClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: PASSWORD,
    });
    if (!error) {
      await supabase.auth.signOut();
      return { ok: true, email, userId: data?.user?.id || null, attempts: attempt };
    }

    const msg = error.message || String(error);
    if (isRateLimitError(msg) && attempt < maxAttempts) {
      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs * 2, 15000);
      continue;
    }

    // For transient-looking auth DB errors, retry a couple times too
    if (msg.toLowerCase().includes('database error') && attempt < maxAttempts) {
      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs * 2, 15000);
      continue;
    }

    return { ok: false, email, error: msg, attempts: attempt };
  }

  return { ok: false, email, error: 'Unknown error', attempts: maxAttempts };
}

async function main() {
  const mode = process.argv.includes('--all') ? 'all' : 'active';

  console.log('🔎 Fetching student emails from public.users...');
  const { all, active, inactive } = await fetchActiveStudentEmails();
  console.log(`👥 Students found: ${all.length} (active: ${active.length}, inactive: ${inactive.length})`);

  const emails = mode === 'all' ? all : active;
  console.log(`🔐 Will attempt logins for: ${emails.length} students (mode: ${mode})`);

  if (emails.length === 0) {
    console.log('⚠️ No active students found. Exiting.');
    process.exit(0);
  }

  const failures = [];
  let successes = 0;

  // Sequential to avoid rate limits
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const res = await tryLoginWithRetry(email);
    if (res.ok) {
      successes++;
    } else {
      failures.push(res);
    }

    // progress every 10 users
    if ((i + 1) % 10 === 0 || i === emails.length - 1) {
      console.log(
        `...checked ${i + 1}/${emails.length} | ✅ ${successes} | ❌ ${failures.length}`
      );
    }

    // short delay to be gentle to auth rate limits
    await sleep(350);
  }

  console.log('\n📋 RESULT');
  console.log(`✅ Successful logins: ${successes}`);
  console.log(`❌ Failed logins: ${failures.length}`);

  if (failures.length > 0) {
    console.log('\n❌ Failure details (first 25):');
    failures.slice(0, 25).forEach((f) => {
      console.log(`- ${f.email}: ${f.error} (attempts: ${f.attempts})`);
    });
    process.exitCode = 2;
  } else {
    console.log('\n🎉 All active students can log in with NeverStopLearning!');
  }
}

main().catch((err) => {
  console.error('❌ Script failed:', err?.message || err);
  process.exit(1);
});

