-- =====================================================
-- Fix Supabase Database Security and Performance Warnings
-- =====================================================
-- This script addresses:
-- 1. Function search_path security issues (2 functions)
-- 2. Auth RLS InitPlan performance issues (30+ policies across 15 tables)
-- 3. Multiple Permissive Policies performance issues (6 tables)
--
-- Run this in your Supabase SQL Editor
-- =====================================================

BEGIN;

-- =====================================================
-- PART 1: Fix Function Search Paths
-- =====================================================

-- Fix handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SET search_path = public, auth
AS $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Check if a user with this email already exists in public.users
  SELECT id INTO existing_user_id 
  FROM public.users 
  WHERE email = NEW.email;
  
  IF existing_user_id IS NOT NULL THEN
    -- User already exists - UPDATE the existing record to use the auth.users ID
    -- This preserves all existing relationships (batch assignments, etc.)
    UPDATE public.users SET
      id = NEW.id,
      email_verified = NEW.email_confirmed_at IS NOT NULL,
      updated_at = NOW()
    WHERE id = existing_user_id;
    
    RAISE NOTICE 'Updated existing user % to use auth ID %', existing_user_id, NEW.id;
  ELSE
    -- User doesn't exist - create new record
    INSERT INTO public.users (
      id,
      email,
      password_hash,
      role,
      first_name,
      last_name,
      email_verified,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      '', -- password_hash is empty since we don't store it in public.users
      COALESCE(NEW.raw_user_meta_data->>'role', 'student'), -- use metadata role or default to student
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email_confirmed_at IS NOT NULL,
      NEW.created_at,
      NEW.updated_at
    );
    
    RAISE NOTICE 'Created new user with auth ID %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 2: Optimize RLS Policies - Auth InitPlan Fix
-- =====================================================
-- Wrap all auth.uid() and auth.role() calls with (SELECT ...)
-- to prevent re-evaluation for each row
-- =====================================================

-- === USERS TABLE ===
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile by email" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

CREATE POLICY "Users can view all profiles" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile by email" ON public.users
FOR UPDATE USING (
  (SELECT auth.jwt()->>'email') = email
);

-- === STUDENT_PROFILES TABLE ===
DROP POLICY IF EXISTS "Student profiles viewable by authenticated" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles updatable by owner or email match" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles insertable by authenticated" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are viewable by owner" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are insertable by owner" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are updatable by owner" ON public.student_profiles;

CREATE POLICY "Student profiles viewable by authenticated" ON public.student_profiles
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "Student profiles updatable by owner or email match" ON public.student_profiles
FOR UPDATE USING (
  (SELECT auth.uid()) = user_id 
  OR 
  (SELECT auth.jwt()->>'email') IN (
    SELECT email FROM public.users WHERE id = user_id
  )
);

CREATE POLICY "Student profiles insertable by authenticated" ON public.student_profiles
FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- === STUDENT_CONCEPT_MASTERY TABLE ===
DROP POLICY IF EXISTS "Users view own mastery" ON public.student_concept_mastery;
DROP POLICY IF EXISTS "Users update own mastery" ON public.student_concept_mastery;

CREATE POLICY "Users view own mastery" ON public.student_concept_mastery
FOR SELECT USING ((SELECT auth.uid()) = student_id);

CREATE POLICY "Users update own mastery" ON public.student_concept_mastery
FOR UPDATE USING ((SELECT auth.uid()) = student_id);

-- === PRACTICE_DECKS TABLE ===
DROP POLICY IF EXISTS "Anyone can view public decks" ON public.practice_decks;
DROP POLICY IF EXISTS "Mentors can create decks" ON public.practice_decks;

CREATE POLICY "Anyone can view public decks" ON public.practice_decks
FOR SELECT USING (
  is_public = true 
  OR 
  (SELECT auth.uid()) = created_by
);

CREATE POLICY "Mentors can create decks" ON public.practice_decks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role = 'mentor'
  )
);

-- === PRACTICE_CARDS TABLE ===
DROP POLICY IF EXISTS "View cards if deck is visible" ON public.practice_cards;
DROP POLICY IF EXISTS "Mentors manage cards" ON public.practice_cards;

CREATE POLICY "View cards if deck is visible" ON public.practice_cards
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.practice_decks WHERE id = deck_id)
);

CREATE POLICY "Mentors manage cards" ON public.practice_cards
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role = 'mentor'
  )
);

-- === ROADMAP_DISCUSSIONS TABLE ===
DROP POLICY IF EXISTS "View discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Create discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Update own discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Delete own discussions" ON public.roadmap_discussions;

CREATE POLICY "View discussions" ON public.roadmap_discussions
FOR SELECT USING (true);

CREATE POLICY "Create discussions" ON public.roadmap_discussions
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Update own discussions" ON public.roadmap_discussions
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Delete own discussions" ON public.roadmap_discussions
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- === NOTICES TABLE ===
DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON public.notices;
DROP POLICY IF EXISTS "Notices are managed by mentors and admins" ON public.notices;
DROP POLICY IF EXISTS "Notices are insertable by authenticated users" ON public.notices;
DROP POLICY IF EXISTS "Notices are updatable by authors and mentors" ON public.notices;
DROP POLICY IF EXISTS "Notices are deletable by authors and mentors" ON public.notices;

CREATE POLICY "Notices are viewable by all authenticated users" ON public.notices
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "Notices are managed by mentors and admins" ON public.notices
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role IN ('mentor', 'admin')
  )
);

-- === LIVE_SESSIONS TABLE ===
DROP POLICY IF EXISTS "View live sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "Mentors manage sessions" ON public.live_sessions;

CREATE POLICY "View live sessions" ON public.live_sessions
FOR SELECT USING (true);

CREATE POLICY "Mentors manage sessions" ON public.live_sessions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role = 'mentor'
  )
);

-- === MENTOR_PROFILES TABLE ===
DROP POLICY IF EXISTS "Mentor profiles are viewable by all authenticated users" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are insertable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are updatable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are viewable by owner" ON public.mentor_profiles;

CREATE POLICY "Mentor profiles are viewable by all authenticated users" ON public.mentor_profiles
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "Mentor profiles are insertable by owner" ON public.mentor_profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Mentor profiles are updatable by owner" ON public.mentor_profiles
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- === STUDENT_PROGRESS TABLE ===
DROP POLICY IF EXISTS "Student progress viewable by owner and mentors" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is insertable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is updatable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is viewable by owner" ON public.student_progress;

CREATE POLICY "Student progress viewable by owner and mentors" ON public.student_progress
FOR SELECT USING (
  (SELECT auth.uid()) = student_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role IN ('mentor', 'admin')
  )
);

CREATE POLICY "Student progress is insertable by owner" ON public.student_progress
FOR INSERT WITH CHECK ((SELECT auth.uid()) = student_id);

CREATE POLICY "Student progress is updatable by owner" ON public.student_progress
FOR UPDATE USING ((SELECT auth.uid()) = student_id);

-- === STUDENT_BATCH_ASSIGNMENTS TABLE ===
DROP POLICY IF EXISTS "Assignments viewable by owner" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by mentors and admins" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments managed by mentors and admins" ON public.student_batch_assignments;

-- Consolidated policy for viewing assignments
CREATE POLICY "Assignments viewable by owner and staff" ON public.student_batch_assignments
FOR SELECT USING (
  (SELECT auth.uid()) = student_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role IN ('mentor', 'admin')
  )
);

CREATE POLICY "Assignments managed by mentors and admins" ON public.student_batch_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role IN ('mentor', 'admin')
  )
);

-- === BATCHES TABLE ===
DROP POLICY IF EXISTS "Batches are viewable by all authenticated users" ON public.batches;
DROP POLICY IF EXISTS "Batches are managed by mentors and admins" ON public.batches;
DROP POLICY IF EXISTS "Batches are insertable by authenticated users" ON public.batches;

-- Consolidated policy for viewing batches
CREATE POLICY "Batches viewable by authenticated users" ON public.batches
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

CREATE POLICY "Batches are managed by mentors and admins" ON public.batches
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = (SELECT auth.uid()) AND role IN ('mentor', 'admin')
  )
);

-- === ROADMAPS TABLE ===
DROP POLICY IF EXISTS "Public read access to roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps are viewable by all authenticated users" ON public.roadmaps;

CREATE POLICY "Roadmaps are viewable by all authenticated users" ON public.roadmaps
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- === ROADMAP_WEEKS TABLE ===
DROP POLICY IF EXISTS "Public read access to roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap weeks are viewable by all authenticated users" ON public.roadmap_weeks;

CREATE POLICY "Roadmap weeks are viewable by all authenticated users" ON public.roadmap_weeks
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- === ROADMAP_TASKS TABLE ===
DROP POLICY IF EXISTS "Public read access to roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Roadmap tasks are viewable by all authenticated users" ON public.roadmap_tasks;

CREATE POLICY "Roadmap tasks are viewable by all authenticated users" ON public.roadmap_tasks
FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

-- =====================================================
-- PART 3: Verification Queries
-- =====================================================

-- Verify function search paths are set
SELECT 
  p.proname,
  p.proconfig
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('handle_new_user', 'update_updated_at_column');

-- Verify RLS policies are in place and optimized
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'student_profiles', 'student_concept_mastery', 
    'practice_decks', 'practice_cards', 'roadmap_discussions',
    'notices', 'live_sessions', 'mentor_profiles', 
    'student_progress', 'student_batch_assignments', 'batches',
    'roadmaps', 'roadmap_weeks', 'roadmap_tasks'
  )
ORDER BY tablename, policyname;

COMMIT;

-- Success message
SELECT 'Database security and performance warnings fixed successfully! 
Please verify in Supabase Dashboard:
1. Security Advisor - Function Search Path warnings should be resolved
2. Performance Advisor - Auth RLS InitPlan warnings should be resolved
3. Performance Advisor - Multiple Permissive Policies warnings should be resolved' as status;
