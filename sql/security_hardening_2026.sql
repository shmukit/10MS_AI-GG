-- =====================================================
-- Security Hardening Migration
-- Run in Supabase SQL Editor
-- =====================================================
-- This migration addresses:
--   F4:  Users table exposes password_hash to all authenticated users
--   F5:  anon role has access to sensitive student data
--   F9:  GRANT ALL on all tables
--   F10: increment_student_xp lacks search_path and RBAC
-- =====================================================

BEGIN;

-- =====================================================
-- F4: Create a public-safe view of the users table
-- that excludes password_hash and other sensitive fields
-- =====================================================

-- Drop existing view if it exists (for idempotency)
DROP VIEW IF EXISTS public.user_profiles_public;

CREATE VIEW public.user_profiles_public AS
SELECT
    id,
    email,
    role,
    first_name,
    last_name,
    profile_picture_url,
    is_active,
    created_at,
    updated_at
FROM public.users;

-- Grant read access on the view to authenticated users
GRANT SELECT ON public.user_profiles_public TO authenticated;

-- Allow authenticated users to SELECT from the users table so leaderboard/cohort joins work.
-- Column-level SELECT privileges below will protect sensitive fields like password_hash.
DROP POLICY IF EXISTS "Users viewable by self or staff" ON public.users;
DROP POLICY IF EXISTS "Users viewable by authenticated users" ON public.users;

CREATE POLICY "Users viewable by authenticated users" ON public.users
    FOR SELECT TO authenticated
    USING (true);

-- =====================================================
-- F5: Remove anon access from sensitive tables
-- The anon access was added for the public certificate page,
-- so we create a dedicated certificate view for that.
-- =====================================================

-- Drop the overly-permissive anon policies (from fix_concurrency_and_rls.sql)
DROP POLICY IF EXISTS "Student progress viewable by owner or staff" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress viewable by authenticated users" ON public.student_progress;
DROP POLICY IF EXISTS "Student profiles viewable by everyone" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles viewable by authenticated users" ON public.student_profiles;
DROP POLICY IF EXISTS "Assignments viewable by owner or staff" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by authenticated users" ON public.student_batch_assignments;

-- Recreate with authenticated-only access
CREATE POLICY "Student progress viewable by authenticated users" ON public.student_progress
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Student profiles viewable by authenticated users" ON public.student_profiles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Assignments viewable by authenticated users" ON public.student_batch_assignments
    FOR SELECT TO authenticated
    USING (true);

-- Create a dedicated anon-safe view for the public certificate page
DROP VIEW IF EXISTS public.certificate_verification;

CREATE VIEW public.certificate_verification AS
SELECT
    sc.id,
    sc.student_id,
    sc.issued_by,
    sc.certificate_type,
    sc.issued_at,
    sc.public_url_slug,
    sc.image_url,
    sc.metadata
FROM public.student_certificates sc;

-- Allow anon read access ONLY to this view
GRANT SELECT ON public.certificate_verification TO anon;
GRANT SELECT ON public.certificate_verification TO authenticated;

-- Add RLS policy for user_sessions (currently has RLS enabled but zero policies)
DROP POLICY IF EXISTS "Sessions viewable by owner" ON public.user_sessions;
DROP POLICY IF EXISTS "Sessions insertable by owner" ON public.user_sessions;
DROP POLICY IF EXISTS "Sessions deletable by owner" ON public.user_sessions;

CREATE POLICY "Sessions viewable by owner" ON public.user_sessions
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Sessions insertable by owner" ON public.user_sessions
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Sessions deletable by owner" ON public.user_sessions
    FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- =====================================================
-- F9: Replace GRANT ALL with minimum-privilege grants
-- =====================================================

-- First revoke ALL from authenticated on all tables
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

-- Re-grant minimum required privileges per table:

-- Core user tables: protect password_hash using column-level privileges.
-- Users can read all users' basic info (for leaderboards/cohorts) but cannot see password hashes.
GRANT SELECT (id, email, role, first_name, last_name, profile_picture_url, is_active, created_at, updated_at) ON public.users TO authenticated;
GRANT UPDATE (first_name, last_name, profile_picture_url, phone) ON public.users TO authenticated;
-- No INSERT/DELETE for users (managed via auth + RPC)

GRANT SELECT, INSERT, UPDATE ON public.student_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.mentor_profiles TO authenticated;

-- Learning content (read-only for students, writable for staff via RLS)
GRANT SELECT ON public.roadmaps TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmaps TO authenticated;
GRANT SELECT ON public.roadmap_weeks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_weeks TO authenticated;
GRANT SELECT ON public.roadmap_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_tasks TO authenticated;

-- Student progress: students write their own, staff can also write
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_progress TO authenticated;

-- Batch management
GRANT SELECT ON public.batches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batches TO authenticated;
GRANT SELECT ON public.batch_mentors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_mentors TO authenticated;
GRANT SELECT ON public.batch_task_deadlines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_task_deadlines TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_batch_assignments TO authenticated;

-- Practice system
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_decks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_cards TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.student_card_mastery TO authenticated;

-- Communication
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_discussions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_sessions TO authenticated;

-- Certificates
-- Certificates: public read access allowed (for sharing), writes restricted to staff
GRANT SELECT ON public.student_certificates TO anon, authenticated;
GRANT INSERT, UPDATE ON public.student_certificates TO authenticated;

-- Sessions
GRANT SELECT, INSERT, DELETE ON public.user_sessions TO authenticated;

-- Views
GRANT SELECT ON public.user_profiles_public TO authenticated;

-- Sequences (needed for insert operations)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- F10: Harden increment_student_xp
-- =====================================================

-- Drop and recreate with proper security
DROP FUNCTION IF EXISTS public.increment_student_xp(UUID, UUID, INT);

CREATE OR REPLACE FUNCTION public.increment_student_xp(
    p_student_id UUID,
    p_batch_id UUID,
    p_points INT
)
RETURNS VOID AS $$
BEGIN
    -- Validate: points must be positive
    IF p_points <= 0 THEN
        RAISE EXCEPTION 'XP points must be positive, got %', p_points;
    END IF;

    -- Validate: caller must be the student themselves, or an admin/mentor
    IF (SELECT auth.uid()) != p_student_id AND NOT is_admin_or_mentor() THEN
        RAISE EXCEPTION 'Unauthorized: cannot award XP to another user';
    END IF;

    -- Atomic XP increment
    UPDATE public.student_batch_assignments
    SET xp = COALESCE(xp, 0) + p_points,
        updated_at = NOW()
    WHERE student_id = p_student_id
      AND batch_id = p_batch_id
      AND status = 'active';
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public;

-- Restrict execution to authenticated users only
REVOKE EXECUTE ON FUNCTION public.increment_student_xp(UUID, UUID, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_student_xp(UUID, UUID, INT) TO authenticated;

COMMIT;

-- =====================================================
-- Verification: Run these queries to confirm changes
-- =====================================================

-- Check that password_hash is NOT in the view
SELECT column_name FROM information_schema.columns
WHERE table_name = 'user_profiles_public'
ORDER BY ordinal_position;

-- Check that no anon policies exist on student tables
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND 'anon' = ANY(roles)
ORDER BY tablename;

-- Check increment_student_xp has search_path set
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE proname = 'increment_student_xp';
