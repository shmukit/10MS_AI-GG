// Create Auth Users via Supabase Management API
// This script uses Supabase's official API to create users properly.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... TEST_USER_PASSWORD=... node scripts/create_users_via_api.js
//
// Edit usersToCreate below with your own test accounts before running.

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const defaultPassword = process.env.TEST_USER_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local or your shell.');
  process.exit(1);
}

if (!defaultPassword) {
  console.error('Missing TEST_USER_PASSWORD. Set a secure password in .env.local before running.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Replace with your own test users before running
const usersToCreate = [
  { email: 'admin@example.com', name: 'Admin User' },
  { email: 'mentor@example.com', name: 'Mentor User' },
  { email: 'student@example.com', name: 'Student User' },
];

async function createAuthUsers() {
  console.log('Starting to create auth users...');

  let created = 0;
  let skipped = 0;

  for (const user of usersToCreate) {
    try {
      console.log(`Creating user: ${user.email}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          name: user.name
        }
      });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`User ${user.email} already exists - skipping`);
          skipped++;
        } else {
          console.error(`Error creating ${user.email}:`, error.message);
        }
      } else {
        console.log(`Created user: ${user.email} with ID: ${data.user.id}`);
        created++;
      }

    } catch (err) {
      console.error(`Exception creating ${user.email}:`, err.message);
    }
  }

  console.log('\nCompleted!');
  console.log(`Created: ${created} users`);
  console.log(`Skipped: ${skipped} users`);
}

createAuthUsers().catch(console.error);
