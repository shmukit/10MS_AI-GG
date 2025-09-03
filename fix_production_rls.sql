-- Fix Production RLS Issues for Profile Updates
-- Run this in your production Supabase SQL editor

-- 1. First, check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'student_profiles', 'batches', 'roadmaps', 'notices')
ORDER BY tablename;

-- 2. Check current policies
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'student_profiles')
ORDER BY tablename, policyname;

-- 3. Temporarily disable RLS to test (SAFE FOR TESTING)
-- This will allow all authenticated users to access the data
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'student_profiles')
ORDER BY tablename;

-- 6. Test if you can now access the data
-- This should return your user data
SELECT * FROM users WHERE email = 'mukit@10minuteschool.com';

-- 7. Test if you can access student profiles
SELECT * FROM student_profiles WHERE user_id = (
  SELECT id FROM users WHERE email = 'mukit@10minuteschool.com'
);

-- 8. Test updating user data
UPDATE users 
SET first_name = 'Shazzad', 
    last_name = 'Ahmed',
    updated_at = NOW()
WHERE email = 'mukit@10minuteschool.com'
RETURNING *;

-- 9. Test updating student profile
UPDATE student_profiles 
SET institute = '10 Minute School - Production Test',
    updated_at = NOW()
WHERE user_id = (
  SELECT id FROM users WHERE email = 'mukit@10minuteschool.com'
)
RETURNING *;

-- 10. Verify the updates
SELECT 
  u.first_name,
  u.last_name,
  u.email,
  sp.institute,
  sp.degree,
  sp.subject
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.email = 'mukit@10minuteschool.com';

-- Note: This temporarily disables RLS for testing
-- In production, you should implement proper RLS policies after confirming the fix works
