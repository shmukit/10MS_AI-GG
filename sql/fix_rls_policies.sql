-- Fix Row Level Security (RLS) Policies for 10MS SheSTEM
-- Run this in your Supabase SQL editor to fix the 403 Forbidden errors

-- 1. Enable RLS on tables (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Student profiles are viewable by owner" ON student_profiles;
DROP POLICY IF EXISTS "Student profiles are insertable by owner" ON student_profiles;
DROP POLICY IF EXISTS "Student profiles are updatable by owner" ON student_profiles;
DROP POLICY IF EXISTS "Batches are viewable by all authenticated users" ON batches;
DROP POLICY IF EXISTS "Batches are insertable by authenticated users" ON batches;
DROP POLICY IF EXISTS "Roadmaps are viewable by all authenticated users" ON roadmaps;
DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON notices;

-- 3. Create new RLS policies

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Student profiles are viewable by owner" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Student profiles are insertable by owner" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Student profiles are updatable by owner" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Mentor profiles policies
CREATE POLICY "Mentor profiles are viewable by owner" ON mentor_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Mentor profiles are insertable by owner" ON mentor_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentor profiles are updatable by owner" ON mentor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Batches policies (viewable by all authenticated users)
CREATE POLICY "Batches are viewable by all authenticated users" ON batches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Batches are insertable by authenticated users" ON batches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Roadmaps policies (viewable by all authenticated users)
CREATE POLICY "Roadmaps are viewable by all authenticated users" ON roadmaps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Roadmap weeks policies
CREATE POLICY "Roadmap weeks are viewable by all authenticated users" ON roadmap_weeks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Roadmap tasks policies
CREATE POLICY "Roadmap tasks are viewable by all authenticated users" ON roadmap_tasks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Student progress policies
CREATE POLICY "Student progress is viewable by owner" ON student_progress
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Student progress is insertable by owner" ON student_progress
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Student progress is updatable by owner" ON student_progress
  FOR UPDATE USING (auth.uid() = student_id);

-- Notices policies (viewable by all authenticated users)
CREATE POLICY "Notices are viewable by all authenticated users" ON notices
  FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 6. Test the policies by checking if they exist
SELECT 
  tablename as table_name,
  policyname as policy_name,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'student_profiles', 'batches', 'roadmaps', 'notices')
ORDER BY tablename, policyname;
