-- Fix All Permissions & RLS Issues
-- 1. Create secure checks for roles that bypass RLS
-- 2. Update policies for all tables to allow Admins full access
-- 3. Ensure other roles can perform their duties

-- Function to check if user is admin (bypassing RLS)
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

-- Function to check if user is mentor (bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'mentor'
  );
$$;

-- Generic function for admin OR mentor
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

-- ==========================================
-- 1. USERS Table
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Only admins can insert/delete users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (is_admin());

-- ==========================================
-- 2. STUDENT_PROFILES Table
-- ==========================================
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Student profiles are viewable by owner" ON student_profiles;
DROP POLICY IF EXISTS "Student profiles are insertable by owner" ON student_profiles;
DROP POLICY IF EXISTS "Student profiles are updatable by owner" ON student_profiles;
DROP POLICY IF EXISTS "View student profiles" ON student_profiles;
DROP POLICY IF EXISTS "Insert student profiles" ON student_profiles;
DROP POLICY IF EXISTS "Update student profiles" ON student_profiles;


-- View: Owner, Admin, Mentor
CREATE POLICY "View student profiles" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id OR is_admin_or_mentor());

-- Insert: Owner (registration), Admin
CREATE POLICY "Insert student profiles" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());

-- Update: Owner, Admin
CREATE POLICY "Update student profiles" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());


-- ==========================================
-- 3. MENTOR_PROFILES Table
-- ==========================================
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentor profiles are viewable by owner" ON mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are insertable by owner" ON mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are updatable by owner" ON mentor_profiles;
DROP POLICY IF EXISTS "View mentor profiles" ON mentor_profiles;
DROP POLICY IF EXISTS "Insert mentor profiles" ON mentor_profiles;
DROP POLICY IF EXISTS "Update mentor profiles" ON mentor_profiles;

-- View: Public/Authenticated (Mentors are visible)
CREATE POLICY "View mentor profiles" ON mentor_profiles
  FOR SELECT USING (true); 

-- Insert: Owner, Admin
CREATE POLICY "Insert mentor profiles" ON mentor_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());

-- Update: Owner, Admin
CREATE POLICY "Update mentor profiles" ON mentor_profiles
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- ==========================================
-- 4. BATCHES Table
-- ==========================================
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Batches are viewable by all authenticated users" ON batches;
DROP POLICY IF EXISTS "Batches are insertable by authenticated users" ON batches;
DROP POLICY IF EXISTS "View batches" ON batches;
DROP POLICY IF EXISTS "Manage batches" ON batches;

CREATE POLICY "View batches" ON batches
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert/Update/Delete: Admin or Mentor
CREATE POLICY "Manage batches" ON batches
  FOR ALL USING (is_admin_or_mentor());

-- ==========================================
-- 5. NOTICES Table
-- ==========================================
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are insertable by authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are updatable by authors and mentors" ON notices;
DROP POLICY IF EXISTS "Notices are deletable by authors and mentors" ON notices;
DROP POLICY IF EXISTS "View notices" ON notices;
DROP POLICY IF EXISTS "Manage notices" ON notices;


CREATE POLICY "View notices" ON notices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage notices" ON notices
  FOR ALL USING (is_admin_or_mentor());

-- ==========================================
-- 6. ROADMAPS (and related) Table
-- ==========================================
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Roadmaps are viewable by all authenticated users" ON roadmaps;
DROP POLICY IF EXISTS "Roadmap weeks are viewable by all authenticated users" ON roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap tasks are viewable by all authenticated users" ON roadmap_tasks;
DROP POLICY IF EXISTS "View roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Manage roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "View roadmap weeks" ON roadmap_weeks;
DROP POLICY IF EXISTS "Manage roadmap weeks" ON roadmap_weeks;
DROP POLICY IF EXISTS "View roadmap tasks" ON roadmap_tasks;
DROP POLICY IF EXISTS "Manage roadmap tasks" ON roadmap_tasks;


-- View
CREATE POLICY "View roadmaps" ON roadmaps FOR SELECT USING (true);
CREATE POLICY "View roadmap weeks" ON roadmap_weeks FOR SELECT USING (true);
CREATE POLICY "View roadmap tasks" ON roadmap_tasks FOR SELECT USING (true);

-- Manage: Admin or Mentor
CREATE POLICY "Manage roadmaps" ON roadmaps FOR ALL USING (is_admin_or_mentor());
CREATE POLICY "Manage roadmap weeks" ON roadmap_weeks FOR ALL USING (is_admin_or_mentor());
CREATE POLICY "Manage roadmap tasks" ON roadmap_tasks FOR ALL USING (is_admin_or_mentor());


-- ==========================================
-- 7. STUDENT_PROGRESS Table
-- ==========================================
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Student progress is viewable by owner" ON student_progress;
DROP POLICY IF EXISTS "Student progress is insertable by owner" ON student_progress;
DROP POLICY IF EXISTS "Student progress is updatable by owner" ON student_progress;
DROP POLICY IF EXISTS "View student progress" ON student_progress;
DROP POLICY IF EXISTS "Insert student progress" ON student_progress;
DROP POLICY IF EXISTS "Update student progress" ON student_progress;

-- View: Owner, Admin, Mentor
CREATE POLICY "View student progress" ON student_progress
  FOR SELECT USING (auth.uid() = student_id OR is_admin_or_mentor());

-- Insert: Owner
CREATE POLICY "Insert student progress" ON student_progress
  FOR INSERT WITH CHECK (auth.uid() = student_id OR is_admin());

-- Update: Owner, Admin, Mentor (for grading)
CREATE POLICY "Update student progress" ON student_progress
  FOR UPDATE USING (auth.uid() = student_id OR is_admin_or_mentor());


-- ==========================================
-- 8. PRACTICE DECKS & CARDS
-- ==========================================
-- Check if tables exist first to avoid errors (or assume they do based on TS code)
-- We'll assume they exist or create them if missing (safer to assume existence for this fix script)

ALTER TABLE practice_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View practice decks" ON practice_decks;
DROP POLICY IF EXISTS "Manage practice decks" ON practice_decks;
DROP POLICY IF EXISTS "View practice cards" ON practice_cards;
DROP POLICY IF EXISTS "Manage practice cards" ON practice_cards;

-- View Decks: Public or Authenticated
CREATE POLICY "View practice decks" ON practice_decks
  FOR SELECT USING (true);

-- Manage Decks: Owner, Admin, Mentor
CREATE POLICY "Manage practice decks" ON practice_decks
  FOR ALL USING (auth.uid() = created_by OR is_admin_or_mentor());

-- View Cards: Public or Authenticated
CREATE POLICY "View practice cards" ON practice_cards
  FOR SELECT USING (true);

-- Manage Cards: Owner of Deck, Admin, Mentor
CREATE POLICY "Manage practice cards" ON practice_cards
  FOR ALL USING (
    is_admin_or_mentor() OR 
    EXISTS (
      SELECT 1 FROM practice_decks 
      WHERE id = deck_id 
      AND created_by = auth.uid()
    )
  );


-- ==========================================
-- 9. LIVE SESSIONS (Scheduling)
-- ==========================================
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View live sessions" ON live_sessions;
DROP POLICY IF EXISTS "Manage live sessions" ON live_sessions;

-- View: Authenticated
CREATE POLICY "View live sessions" ON live_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Manage: Admin or Mentor
CREATE POLICY "Manage live sessions" ON live_sessions
  FOR ALL USING (is_admin_or_mentor());


-- ==========================================
-- 10. BATCH MENTORS
-- ==========================================
ALTER TABLE batch_mentors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View batch mentors" ON batch_mentors;
DROP POLICY IF EXISTS "Manage batch mentors" ON batch_mentors;

CREATE POLICY "View batch mentors" ON batch_mentors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Manage batch mentors" ON batch_mentors
  FOR ALL USING (is_admin_or_mentor());


-- ==========================================
-- 11. STUDENT BATCH ASSIGNMENTS
-- ==========================================
ALTER TABLE student_batch_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View student batch assignments" ON student_batch_assignments;
DROP POLICY IF EXISTS "Manage student batch assignments" ON student_batch_assignments;

-- View: Authenticated (needed for lists)
CREATE POLICY "View student batch assignments" ON student_batch_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Manage: Admin or Mentor
CREATE POLICY "Manage student batch assignments" ON student_batch_assignments
  FOR ALL USING (is_admin_or_mentor());



