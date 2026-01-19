-- Promote users to Admin role
-- Run this in Supabase SQL Editor

UPDATE users
SET role = 'admin'
WHERE email IN ('mukit@10minuteschool.com', 'raihana@10minuteschool.com');

-- Verify the changes
SELECT email, role FROM users WHERE email IN ('mukit@10minuteschool.com', 'raihana@10minuteschool.com');
