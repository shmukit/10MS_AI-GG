-- Fix RLS Permissions for Student Addition and Admin Access
-- Run this script in the Supabase SQL Editor

-- 1. Helper Functions to securely check roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_mentor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'mentor')
  );
$$;

-- 2. USERS Table Policies (Fixes "new row violates row-level security policy for table users")
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (is_admin());

-- 3. BATCHES Table Policies (Ensures Admins/Mentors can manage batches)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manage batches" ON batches;
DROP POLICY IF EXISTS "View batches" ON batches;
DROP POLICY IF EXISTS "Batches are viewable by all authenticated users" ON batches;
DROP POLICY IF EXISTS "Batches are insertable by authenticated users" ON batches;


CREATE POLICY "View batches" ON batches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage batches" ON batches
  FOR ALL USING (is_admin_or_mentor());

-- 4. ROADMAP WEEKS Policies (Fixes missing week creation permissions)
ALTER TABLE roadmap_weeks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage roadmap weeks" ON roadmap_weeks;
DROP POLICY IF EXISTS "View roadmap weeks" ON roadmap_weeks;

CREATE POLICY "View roadmap weeks" ON roadmap_weeks FOR SELECT USING (true);
CREATE POLICY "Manage roadmap weeks" ON roadmap_weeks FOR ALL USING (is_admin_or_mentor());

-- 5. STUDENT BATCH ASSIGNMENTS Policies
ALTER TABLE student_batch_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manage student batch assignments" ON student_batch_assignments;
DROP POLICY IF EXISTS "View student batch assignments" ON student_batch_assignments;

CREATE POLICY "View student batch assignments" ON student_batch_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage student batch assignments" ON student_batch_assignments
  FOR ALL USING (is_admin_or_mentor());
