-- ============================================================================
-- Fix Database Hardening & Performance Warnings (May 2026 - Final)
-- ============================================================================
-- This script addresses:
-- 1. SECURITY DEFINER Views (certificate_verification, user_profiles_public)
-- 2. SECURITY DEFINER Function (increment_student_xp) callable by anon role
-- 3. Auth RLS InitPlan re-evaluation performance issues on users table
-- 4. Obsolete/permissive RLS policies on student_progress, student_profiles,
--    and student_batch_assignments
-- 5. Multiple Permissive Policies SELECT overlapping issues on 12 tables
--
-- Run this migration inside your Supabase SQL Editor.
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION 1: SECURITY DEFINER Views Hardening
-- Redefine views WITH (security_invoker = true) to prevent bypassing RLS policies
-- ============================================================================

-- Recreate certificate_verification with security invoker
DROP VIEW IF EXISTS public.certificate_verification CASCADE;

CREATE VIEW public.certificate_verification WITH (security_invoker = true) AS
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

-- Restore standard privileges on view
GRANT SELECT ON public.certificate_verification TO anon, authenticated;


-- Recreate user_profiles_public with security invoker
DROP VIEW IF EXISTS public.user_profiles_public CASCADE;

CREATE VIEW public.user_profiles_public WITH (security_invoker = true) AS
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

-- Restore standard privileges on view
GRANT SELECT ON public.user_profiles_public TO authenticated;


-- ============================================================================
-- SECTION 2: SECURITY DEFINER Function Hardening
-- Harden increment_student_xp with explicit search_path, correct column name,
-- and strict role execution permissions (blocking anon).
-- ============================================================================

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
    IF (SELECT auth.uid()) != p_student_id AND NOT (SELECT is_admin_or_mentor()) THEN
        RAISE EXCEPTION 'Unauthorized: cannot award XP to another user';
    END IF;

    -- Atomic XP increment (correct column name is xp_points)
    UPDATE public.student_batch_assignments
    SET xp_points = COALESCE(xp_points, 0) + p_points,
        updated_at = NOW()
    WHERE student_id = p_student_id
      AND batch_id = p_batch_id
      AND status = 'active';
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public;

-- Revoke execution from PUBLIC and anon roles
REVOKE EXECUTE ON FUNCTION public.increment_student_xp(UUID, UUID, INT) FROM PUBLIC, anon;

-- Explicitly allow authenticated users to execute (required for frontend gamification)
GRANT EXECUTE ON FUNCTION public.increment_student_xp(UUID, UUID, INT) TO authenticated;


-- ============================================================================
-- SECTION 3: Performance Optimization (InitPlan wrapper)
-- Redefine role helper functions and RLS policies to utilize InitPlans
-- ============================================================================

-- Recreate role helpers with optimized (SELECT auth.uid()) wrappers
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = (SELECT auth.uid())
    AND role = 'mentor'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_mentor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'mentor')
  );
$$;

-- Secure helper functions from anonymous execution
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mentor() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor() FROM public, anon;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_mentor() TO authenticated, service_role;


-- Drop obsolete, non-optimized RLS policies to eliminate performance and privacy concerns
DROP POLICY IF EXISTS "Student progress viewable by owner, staff, peers, or public" ON public.student_progress;
DROP POLICY IF EXISTS "Student profiles viewable by owner, staff, peers, or public" ON public.student_profiles;
DROP POLICY IF EXISTS "Assignments viewable by owner, staff, peers, or public" ON public.student_batch_assignments;


-- Recreate and optimize "Users updatable by owner, email, or admin" on users table
DROP POLICY IF EXISTS "Users updatable by owner, email, or admin" ON public.users;

CREATE POLICY "Users updatable by owner, email, or admin" ON public.users 
    FOR UPDATE 
    TO authenticated 
    USING (
        (SELECT auth.uid()) = id OR (SELECT auth.jwt()->>'email') = email OR (SELECT is_admin())
    );


-- ============================================================================
-- SECTION 4: Multiple Permissive Policies Performance Fix
-- Split overlapping "FOR ALL" policies into separate write action policies 
-- to optimize SELECT compilation for role authenticated.
-- ============================================================================

-- 1. batch_mentors
DROP POLICY IF EXISTS "Batch mentors managed by admins" ON public.batch_mentors;
CREATE POLICY "Batch mentors insertable by admins" ON public.batch_mentors FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin()));
CREATE POLICY "Batch mentors updatable by admins" ON public.batch_mentors FOR UPDATE TO authenticated USING ((SELECT is_admin()));
CREATE POLICY "Batch mentors deletable by admins" ON public.batch_mentors FOR DELETE TO authenticated USING ((SELECT is_admin()));

-- 2. batch_task_deadlines
DROP POLICY IF EXISTS "Batch task deadlines managed by admins" ON public.batch_task_deadlines;
CREATE POLICY "Batch task deadlines insertable by admins" ON public.batch_task_deadlines FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin()));
CREATE POLICY "Batch task deadlines updatable by admins" ON public.batch_task_deadlines FOR UPDATE TO authenticated USING ((SELECT is_admin()));
CREATE POLICY "Batch task deadlines deletable by admins" ON public.batch_task_deadlines FOR DELETE TO authenticated USING ((SELECT is_admin()));

-- 3. batches
DROP POLICY IF EXISTS "Batches managed by staff" ON public.batches;
CREATE POLICY "Batches insertable by staff" ON public.batches FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Batches updatable by staff" ON public.batches FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Batches deletable by staff" ON public.batches FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 4. live_sessions
DROP POLICY IF EXISTS "Live sessions managed by staff" ON public.live_sessions;
CREATE POLICY "Live sessions insertable by staff" ON public.live_sessions FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Live sessions updatable by staff" ON public.live_sessions FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Live sessions deletable by staff" ON public.live_sessions FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 5. notices
DROP POLICY IF EXISTS "Notices managed by staff" ON public.notices;
CREATE POLICY "Notices insertable by staff" ON public.notices FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Notices updatable by staff" ON public.notices FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Notices deletable by staff" ON public.notices FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 6. practice_cards
DROP POLICY IF EXISTS "Practice cards managed by staff" ON public.practice_cards;
CREATE POLICY "Practice cards insertable by staff" ON public.practice_cards FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Practice cards updatable by staff" ON public.practice_cards FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Practice cards deletable by staff" ON public.practice_cards FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 7. practice_decks
DROP POLICY IF EXISTS "Practice decks managed by staff" ON public.practice_decks;
CREATE POLICY "Practice decks insertable by staff" ON public.practice_decks FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Practice decks updatable by staff" ON public.practice_decks FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Practice decks deletable by staff" ON public.practice_decks FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 8. roadmap_tasks
DROP POLICY IF EXISTS "Roadmap tasks managed by admins" ON public.roadmap_tasks;
CREATE POLICY "Roadmap tasks insertable by admins" ON public.roadmap_tasks FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin()));
CREATE POLICY "Roadmap tasks updatable by admins" ON public.roadmap_tasks FOR UPDATE TO authenticated USING ((SELECT is_admin()));
CREATE POLICY "Roadmap tasks deletable by admins" ON public.roadmap_tasks FOR DELETE TO authenticated USING ((SELECT is_admin()));

-- 9. roadmap_weeks
DROP POLICY IF EXISTS "Roadmap weeks managed by staff" ON public.roadmap_weeks;
CREATE POLICY "Roadmap weeks insertable by staff" ON public.roadmap_weeks FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Roadmap weeks updatable by staff" ON public.roadmap_weeks FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Roadmap weeks deletable by staff" ON public.roadmap_weeks FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 10. roadmaps
DROP POLICY IF EXISTS "Roadmaps managed by admins" ON public.roadmaps;
CREATE POLICY "Roadmaps insertable by admins" ON public.roadmaps FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin()));
CREATE POLICY "Roadmaps updatable by admins" ON public.roadmaps FOR UPDATE TO authenticated USING ((SELECT is_admin()));
CREATE POLICY "Roadmaps deletable by admins" ON public.roadmaps FOR DELETE TO authenticated USING ((SELECT is_admin()));

-- 11. student_batch_assignments
DROP POLICY IF EXISTS "Assignments managed by staff" ON public.student_batch_assignments;
CREATE POLICY "Assignments insertable by staff" ON public.student_batch_assignments FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Assignments updatable by staff" ON public.student_batch_assignments FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Assignments deletable by staff" ON public.student_batch_assignments FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));

-- 12. student_certificates
DROP POLICY IF EXISTS "Certificates managed by staff" ON public.student_certificates;
CREATE POLICY "Certificates insertable by staff" ON public.student_certificates FOR INSERT TO authenticated WITH CHECK ((SELECT is_admin_or_mentor()));
CREATE POLICY "Certificates updatable by staff" ON public.student_certificates FOR UPDATE TO authenticated USING ((SELECT is_admin_or_mentor()));
CREATE POLICY "Certificates deletable by staff" ON public.student_certificates FOR DELETE TO authenticated USING ((SELECT is_admin_or_mentor()));


COMMIT;
