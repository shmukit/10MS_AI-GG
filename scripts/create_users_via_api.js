// Create Auth Users via Supabase Management API
// This script uses Supabase's official API to create users properly

const { createClient } = require('@supabase/supabase-js');

// You'll need your service role key for this
const supabaseUrl = 'https://hayhwvddwhgdvlxrxqun.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // Get from Supabase Dashboard → Settings → API

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Users from your public.users table that need auth accounts
const usersToCreate = [
  { email: 'raied@10minuteschool.com', name: 'Raied Rahman' },
  { email: 'raihana@10minuteschool.com', name: 'Raihana Sultana' },
  { email: 'shams@10minuteschool.com', name: 'Shams Ul Haque' },
  { email: 'farhanur@10minuteschool.com', name: 'Farhanur Rahman' },
  { email: 'zinat.khan@lightcastlepartners.com', name: 'Zinat Khan' },
  { email: 'ridwanur.rahman@lightcastlepartners.com', name: 'Ridwanur Rahman' },
  { email: 'afsanamimi194@gmail.com', name: 'Afsana Mimi' },
  // Add more users as needed
];

async function createAuthUsers() {
  console.log('🚀 Starting to create auth users...');
  
  let created = 0;
  let skipped = 0;
  
  for (const user of usersToCreate) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'NeverStopLearning!',
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: user.name
        }
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✅ User ${user.email} already exists - skipping`);
          skipped++;
        } else {
          console.error(`❌ Error creating ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Created user: ${user.email} with ID: ${data.user.id}`);
        created++;
      }
      
    } catch (err) {
      console.error(`❌ Exception creating ${user.email}:`, err.message);
    }
  }
  
  console.log('\n🎉 Completed!');
  console.log(`✅ Created: ${created} users`);
  console.log(`⏭️  Skipped: ${skipped} users`);
}

// Run the script
createAuthUsers().catch(console.error);
