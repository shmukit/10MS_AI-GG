-- GRANT FULL ACCESS TO ADMINS
-- This script updates RLS policies to ensure Admins can View, Insert, Update, and Delete data across all tables.

-- Helper: We use a common check for admin role:
-- EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')

-- 1. STUDENT PROFILES
DROP POLICY IF EXISTS "Student profiles are viewable by owner" ON student_profiles;
CREATE POLICY "Student profiles viewable by owner and admin" ON student_profiles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Student profiles are updatable by owner" ON student_profiles;
CREATE POLICY "Student profiles updatable by owner and admin" ON student_profiles
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Student profiles are insertable by owner" ON student_profiles;
CREATE POLICY "Student profiles insertable by owner and admin" ON student_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. MENTOR PROFILES
DROP POLICY IF EXISTS "Mentor profiles are viewable by owner" ON mentor_profiles;
CREATE POLICY "Mentor profiles viewable by owner and admin" ON mentor_profiles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Mentor profiles are updatable by owner" ON mentor_profiles;
CREATE POLICY "Mentor profiles updatable by owner and admin" ON mentor_profiles
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. STUDENT PROGRESS
DROP POLICY IF EXISTS "Student progress is viewable by owner" ON student_progress;
CREATE POLICY "Student progress viewable by owner and admin" ON student_progress
  FOR SELECT USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Student progress is updatable by owner" ON student_progress;
CREATE POLICY "Student progress updatable by owner and admin" ON student_progress
  FOR UPDATE USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Student progress is insertable by owner" ON student_progress;
CREATE POLICY "Student progress insertable by owner and admin" ON student_progress
  FOR INSERT WITH CHECK (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. BATCHES (Already 'authenticated' for select, but ensure Admin can Manage)
-- Updating existing 'authenticated' policies to be explicit if needed, 
-- but 'authenticated' includes admin. 
-- However, we likely want to restrict INSERT/UPDATE to Admins/Mentors only, 
-- but for now ensuring Admins have access is the goal.
-- If previous policy was "Batches are insertable by authenticated users", admins are covered.

-- 5. ROADMAPS & TASKS
-- Generally viewable by all. 
-- We should ensure Admin can UPDATE/DELETE them (Content Management).

CREATE POLICY "Admins can update roadmaps" ON roadmaps
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update roadmap tasks" ON roadmap_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert roadmap tasks" ON roadmap_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. STUDENT BATCH ASSIGNMENTS
-- This table is critical for enrollment.
CREATE POLICY "Admins can view all batch assignments" ON student_batch_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin') OR
    auth.uid() = student_id -- Keep existing student access
  );

CREATE POLICY "Admins can manage batch assignments" ON student_batch_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

