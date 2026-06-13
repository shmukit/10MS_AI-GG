/**
 * Load environment variables for Node scripts.
 * Order: .env first, then .env.local overrides (matches typical Vite setup).
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';

export function loadEnv() {
  const loaded = [];

  if (existsSync('.env')) {
    dotenv.config({ path: '.env' });
    loaded.push('.env');
  }

  if (existsSync('.env.local')) {
    dotenv.config({ path: '.env.local', override: true });
    loaded.push('.env.local');
  }

  return loaded;
}

export function requireSupabaseEnv() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    console.error('   Copy .env.example to .env or .env.local and fill in your values.');
    process.exit(1);
  }

  return { url, anonKey };
}
