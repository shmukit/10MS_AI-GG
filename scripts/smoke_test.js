#!/usr/bin/env node

/**
 * Production smoke test (RLS-aware).
 *
 * Checks env config, Supabase connectivity, RLS, auth, optional authenticated
 * table access, and optionally a running frontend preview/dev server.
 *
 * Usage: npm run smoke
 * Optional env:
 *   SMOKE_TEST_EMAIL + TEST_USER_PASSWORD — authenticated DB checks
 *   SMOKE_FRONTEND_URL — default http://127.0.0.1:4173 (vite preview)
 */

import { createClient } from '@supabase/supabase-js';
import { loadEnv, requireSupabaseEnv } from './loadEnv.js';

const loadedFiles = loadEnv();
const { url: supabaseUrl, anonKey: supabaseAnonKey } = requireSupabaseEnv();

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const frontendUrl = process.env.SMOKE_FRONTEND_URL || 'http://127.0.0.1:4173';

const results = { pass: [], fail: [], skip: [] };

function pass(name, detail = '') {
  results.pass.push({ name, detail });
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.fail.push({ name, detail });
  console.log(`❌ ${name}${detail ? ` — ${detail}` : ''}`);
}

function skip(name, detail = '') {
  results.skip.push({ name, detail });
  console.log(`⏭️  ${name}${detail ? ` — ${detail}` : ''}`);
}

const isRlsBlock = (error) =>
  error?.message?.includes('permission denied') ||
  error?.code === '42501' ||
  error?.code === 'PGRST301';

function checkEnvVars() {
  console.log('📋 Environment variables');
  if (loadedFiles.length) {
    pass('Env files loaded', loadedFiles.join(', '));
  } else {
    fail('Env files loaded', 'no .env or .env.local found');
  }

  pass('VITE_SUPABASE_URL', 'set');
  pass('VITE_SUPABASE_ANON_KEY', 'set');

  const recommended = [
    'VITE_DEFAULT_STUDENT_PASSWORD',
    'VITE_POSTHOG_KEY',
    'VITE_PARTNER_EMAIL_DOMAINS',
    'VITE_PARTNER_ROADMAP_KEYWORD',
  ];

  for (const key of recommended) {
    if (process.env[key]) {
      pass(key, 'set');
    } else {
      skip(key, 'not set (optional for smoke test)');
    }
  }

  if (process.env.SMOKE_TEST_EMAIL && process.env.TEST_USER_PASSWORD) {
    pass('SMOKE_TEST_EMAIL + TEST_USER_PASSWORD', 'set — authenticated tests enabled');
  } else {
    skip('Authenticated test credentials', 'set SMOKE_TEST_EMAIL + TEST_USER_PASSWORD to enable');
  }
}

async function checkSupabaseApi() {
  console.log('\n🌐 Supabase API');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: supabaseAnonKey },
    });
    if (res.status === 200 || res.status === 401) {
      pass('Supabase REST API reachable', `HTTP ${res.status}`);
      return true;
    }
    fail('Supabase REST API reachable', `HTTP ${res.status}`);
    return false;
  } catch (error) {
    fail('Supabase REST API reachable', error.message);
    return false;
  }
}

async function checkRls() {
  console.log('\n🔒 Row Level Security');
  const tables = ['users', 'roadmaps', 'batches', 'notices', 'student_profiles'];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && isRlsBlock(error)) {
      pass(`RLS blocks anon on ${table}`);
    } else if (error) {
      fail(`RLS check ${table}`, error.message);
    } else {
      skip(`RLS on ${table}`, 'anon read succeeded — review policies');
    }
  }
}

async function checkAuth() {
  console.log('\n🔐 Authentication service');
  const { error } = await supabase.auth.getSession();
  if (error) {
    fail('Auth getSession', error.message);
    return;
  }
  pass('Auth getSession');
}

async function checkAuthenticatedTables() {
  const email = process.env.SMOKE_TEST_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    skip('Authenticated table access', 'no test credentials');
    return;
  }

  console.log('\n👤 Authenticated access');
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    fail('Sign-in', signInError.message);
    return;
  }
  pass('Sign-in', email);

  const tables = [
    'roadmaps',
    'batches',
    'notices',
    'student_profiles',
    'student_batch_assignments',
    'student_progress',
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      fail(`Read ${table} (authenticated)`, error.message);
    } else {
      pass(`Read ${table} (authenticated)`);
    }
  }

  await supabase.auth.signOut();
}

async function checkFrontend() {
  console.log('\n🖥️  Frontend server');
  try {
    const res = await fetch(frontendUrl, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      pass('Frontend reachable', frontendUrl);
    } else {
      fail('Frontend reachable', `${frontendUrl} → HTTP ${res.status}`);
    }
  } catch {
    skip(
      'Frontend reachable',
      `${frontendUrl} not running — start with: npm run preview`
    );
  }
}

async function run() {
  console.log('🧪 Smoke Test (RLS-aware)\n');

  checkEnvVars();

  const apiOk = await checkSupabaseApi();
  if (!apiOk) {
    console.log('\n❌ Cannot continue — Supabase API unreachable');
    process.exit(1);
  }

  await checkRls();
  await checkAuth();
  await checkAuthenticatedTables();
  await checkFrontend();

  const total = results.pass.length + results.fail.length + results.skip.length;
  console.log('\n📋 Summary');
  console.log('='.repeat(40));
  console.log(`Total checks: ${total}`);
  console.log(`✅ Passed:  ${results.pass.length}`);
  console.log(`❌ Failed:  ${results.fail.length}`);
  console.log(`⏭️  Skipped: ${results.skip.length}`);

  if (results.fail.length) {
    console.log('\nFailures:');
    results.fail.forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
    process.exit(1);
  }

  console.log('\n🎉 Smoke test passed (no failures).');
  if (results.skip.length) {
    console.log('   Some optional checks were skipped — see above.');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
