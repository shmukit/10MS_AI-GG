# Database Fixes for User Sync

## Problem
New user signups were only creating entries in Supabase's `auth.users` table but not in the custom `public.users` table, causing authentication issues.

## Solution
Created a database trigger that automatically syncs new users from `auth.users` to `public.users`.

## Files to Run (in order)

### 1. Create the Sync Trigger
Run `sync_auth_users.sql` in your Supabase SQL Editor to:
- Create a function `handle_new_user()` that handles user sync
- Create a trigger `on_auth_user_created` on the `auth.users` table
- Grant necessary permissions

### 2. Sync Existing Users (Optional)
Run `sync_existing_users.sql` to manually sync any users that were created before the trigger was set up.

## How It Works

1. **Automatic Sync**: When a new user signs up through Supabase Auth, the trigger automatically creates a corresponding entry in your `public.users` table.

2. **Data Mapping**:
   - `id`: Uses the same UUID from `auth.users`
   - `email`: Copied from `auth.users`
   - `role`: Defaults to 'student'
   - `first_name` & `last_name`: Extracted from `raw_user_meta_data`
   - `email_verified`: Based on `email_confirmed_at`
   - `password_hash`: Left empty (not stored in public table)

3. **Error Handling**: The trigger includes error handling to prevent failures and logs warnings for debugging.

## Testing

After deploying:
1. Create a new user account through the signup form
2. Check both `auth.users` and `public.users` tables
3. Verify the user appears in both tables with matching IDs

## Bulk Student Addition

### 3. Bulk Add Students and Update Passwords
Run `bulk_add_students_and_update_passwords.sql` to:
- Add 4 new students (Humayra, Anindita, Nishat, Zeba) to the system
- Create their student profiles with proper institute/degree information
- Assign them to the Augmedix RCM Specialist Batch 1
- Update ALL existing student passwords to "NeverStopLearning!"

**New Students Added:**
- Humayra Tasnim (RUET, CSE)
- Anindita Dutta (AUST, EEE) 
- Nishat Tasnim (FEC, Transportation Engineering)
- ZEBA ISLAM Sotota (RUET, CSE)

## Notes

- The trigger runs with `SECURITY DEFINER` to ensure it has proper permissions
- New users get the default role 'student' - you can update this manually or add logic to determine roles
- All students now use the password "NeverStopLearning!" for easier management during MVP phase
- Students are automatically assigned to batches upon creation
