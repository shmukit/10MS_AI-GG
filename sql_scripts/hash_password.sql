-- Hash Password for mukit@10minuteschool.com
-- Run this in your Supabase SQL Editor AFTER creating the user

-- First, let's see the current user
SELECT id, email, role FROM users WHERE email = 'mukit@10minuteschool.com';

-- Update the password hash for the existing user
-- Using Supabase's crypt function with bcrypt
UPDATE users 
SET password_hash = crypt('NeverStopLearning!', gen_salt('bf'))
WHERE email = 'mukit@10minuteschool.com';

-- Verify the update
SELECT id, email, role, password_hash FROM users WHERE email = 'mukit@10minuteschool.com';

-- Success message
SELECT 'Password updated successfully!' as status;
