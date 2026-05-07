-- =====================================================
-- Fix Remaining Security Warnings
-- =====================================================

BEGIN;

-- =====================================================
-- 1. SECURITY DEFINER Functions Executable by Public
-- https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
-- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
-- =====================================================
-- Switch functions to SECURITY INVOKER so they run with caller privileges
ALTER FUNCTION public.is_admin() SECURITY INVOKER;
ALTER FUNCTION public.is_admin_or_mentor() SECURITY INVOKER;
ALTER FUNCTION public.is_mentor() SECURITY INVOKER;

-- Revoke default public execution rights
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mentor() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor() FROM public, anon;

-- Explicitly grant execute back to authenticated and service_role
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_mentor() TO authenticated, service_role;


-- =====================================================
-- 2. Revoke Anon SELECT on Internal Tables
-- Resolves: pg_graphql_anon_table_exposed
-- =====================================================
-- These tables should not be accessible without a session.
-- Revoking SELECT from 'anon' strictly enforces this at the postgres privilege level.

REVOKE SELECT ON public.auth_users_backup_$ FROM anon;
REVOKE SELECT ON public.batch_mentors FROM anon;
REVOKE SELECT ON public.batch_task_deadlines FROM anon;
REVOKE SELECT ON public.batches FROM anon;
REVOKE SELECT ON public.concept_relationships FROM anon;
REVOKE SELECT ON public.concepts FROM anon;
REVOKE SELECT ON public.live_sessions FROM anon;
REVOKE SELECT ON public.mentor_profiles FROM anon;
REVOKE SELECT ON public.notices FROM anon;
REVOKE SELECT ON public.practice_cards FROM anon;
REVOKE SELECT ON public.practice_decks FROM anon;
REVOKE SELECT ON public.public_users_backup_$ FROM anon;
REVOKE SELECT ON public.roadmap_discussions FROM anon;
REVOKE SELECT ON public.roadmap_tasks FROM anon;
REVOKE SELECT ON public.roadmap_weeks FROM anon;
REVOKE SELECT ON public.roadmaps FROM anon;
REVOKE SELECT ON public.student_batch_assignments FROM anon;
REVOKE SELECT ON public.student_card_mastery FROM anon;
-- EXCLUDED: student_certificates (because PublicCertificatePage requires anon read access)
REVOKE SELECT ON public.student_concept_mastery FROM anon;
REVOKE SELECT ON public.student_profiles FROM anon;
REVOKE SELECT ON public.student_progress FROM anon;
REVOKE SELECT ON public.user_sessions FROM anon;
REVOKE SELECT ON public.users FROM anon;


-- =====================================================
-- 3. Disable GraphQL API Exposure
-- Resolves: pg_graphql_authenticated_table_exposed (and remaining anon warnings)
-- =====================================================
-- The application uses the PostgREST API (@supabase/supabase-js), not GraphQL.
-- By revoking schema usage, we kill the entire class of GraphQL exposure warnings 
-- without affecting normal REST queries.

REVOKE USAGE ON SCHEMA graphql FROM public, anon, authenticated;


COMMIT;
