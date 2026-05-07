-- =====================================================
-- Fix Remaining Security Warnings (Final Optimization)
-- =====================================================

BEGIN;

-- =====================================================
-- 1. SECURITY DEFINER Functions Executable by Public
-- =====================================================
ALTER FUNCTION public.is_admin() SECURITY INVOKER;
ALTER FUNCTION public.is_admin_or_mentor() SECURITY INVOKER;
ALTER FUNCTION public.is_mentor() SECURITY INVOKER;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mentor() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor() FROM public, anon;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_mentor() TO authenticated, service_role;


-- =====================================================
-- 2. Revoke Anon SELECT on Internal Tables
-- =====================================================
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
REVOKE SELECT ON public.student_concept_mastery FROM anon;
REVOKE SELECT ON public.student_profiles FROM anon;
REVOKE SELECT ON public.student_progress FROM anon;
REVOKE SELECT ON public.user_sessions FROM anon;
REVOKE SELECT ON public.users FROM anon;


-- =====================================================
-- 3. Exclude Tables from GraphQL API
-- Resolves: pg_graphql_anon_table_exposed & pg_graphql_authenticated_table_exposed
-- =====================================================
-- Using SQL comments to hide these from the GraphQL schema.
-- This is the only way to resolve the warnings for 'authenticated' users 
-- while still allowing them to use the PostgREST API.

COMMENT ON TABLE public.auth_users_backup_$ IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.batch_mentors IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.batch_task_deadlines IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.batches IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.concept_relationships IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.concepts IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.live_sessions IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.mentor_profiles IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.notices IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.practice_cards IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.practice_decks IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.public_users_backup_$ IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_discussions IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_tasks IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_weeks IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmaps IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_batch_assignments IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_card_mastery IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_certificates IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_concept_mastery IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_profiles IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.student_progress IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.user_sessions IS E'@graphql({"exclude": true})';
COMMENT ON TABLE public.users IS E'@graphql({"exclude": true})';

-- Also disable GraphQL usage for the public/authenticated roles entirely
REVOKE USAGE ON SCHEMA graphql FROM public, anon, authenticated;

COMMIT;
