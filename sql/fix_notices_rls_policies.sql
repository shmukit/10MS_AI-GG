-- Fix RLS Policies for Notices Table
-- This script adds the missing INSERT, UPDATE, and DELETE policies for notices

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are insertable by authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are updatable by authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are deletable by authenticated users" ON notices;

-- 2. Create comprehensive RLS policies for notices

-- SELECT: All authenticated users can view notices
CREATE POLICY "Notices are viewable by all authenticated users" ON notices
  FOR SELECT USING (auth.role() = 'authenticated');

-- INSERT: Authenticated users can create notices
CREATE POLICY "Notices are insertable by authenticated users" ON notices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Users can update notices they authored, or if they're mentors/admins
CREATE POLICY "Notices are updatable by authors and mentors" ON notices
  FOR UPDATE USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );

-- DELETE: Users can delete notices they authored, or if they're mentors/admins
CREATE POLICY "Notices are deletable by authors and mentors" ON notices
  FOR DELETE USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('mentor', 'admin')
    )
  );

-- 3. Verify the policies were created
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'notices'
ORDER BY policyname;

-- 4. Test the policies by attempting to insert a test notice
-- (This will be done in the application, not in SQL)
