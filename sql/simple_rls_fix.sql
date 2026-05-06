-- Simple RLS Fix for 10MS SheSTEM
-- Run this in your Supabase SQL editor

-- 1. Temporarily disable RLS to test
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_weeks DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;

-- 2. Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 3. Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'student_profiles', 'batches', 'roadmaps', 'notices')
ORDER BY tablename;

-- 4. Test if you can now access the data
-- This should return your user data
SELECT * FROM users WHERE email = 'mukit@10minuteschool.com';

-- 5. Test if you can access student profiles
SELECT * FROM student_profiles WHERE user_id = '95595c17-d5dd-4449-96d6-1699977f27c3';

-- 6. Test if you can access batches
SELECT * FROM batches WHERE id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Note: This is a temporary fix for development
-- In production, you should implement proper RLS policies
