-- =====================================================
-- Fix Supabase Database Security Warnings (May 2026)
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Function Search Path Mutable
-- https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
-- =====================================================
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, extensions;


-- =====================================================
-- 2. Extension in Public
-- https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public
-- =====================================================
CREATE SCHEMA IF NOT EXISTS extensions;

-- Ensure extensions schema is in the search_path so UUID generation doesn't fail
ALTER ROLE authenticator SET search_path = "$user", public, extensions;
ALTER ROLE anon SET search_path = "$user", public, extensions;
ALTER ROLE authenticated SET search_path = "$user", public, extensions;
ALTER ROLE service_role SET search_path = "$user", public, extensions;

-- Move pgcrypto to the new schema
ALTER EXTENSION pgcrypto SET SCHEMA extensions;


-- =====================================================
-- 3. Public Bucket Allows Listing
-- https://supabase.com/docs/guides/database/database-linter?lint=0025_public_bucket_allows_listing
-- =====================================================
-- Public buckets don't need a SELECT policy just to allow URL access.
DROP POLICY IF EXISTS "Public read for certificates bucket" ON storage.objects;


-- =====================================================
-- 4. GraphQL Exposure for Tables (Anon & Authenticated)
-- https://supabase.com/docs/guides/database/database-linter?lint=0026_pg_graphql_anon_table_exposed
-- https://supabase.com/docs/guides/database/database-linter?lint=0027_pg_graphql_authenticated_table_exposed
-- =====================================================
-- We use SQL comments to exclude tables from the GraphQL API. 
-- This safely resolves the warnings without modifying standard privileges, 
-- ensuring the PostgREST API remains unaffected.
COMMENT ON TABLE public.auth_users_backup_$ IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.batch_mentors IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.batch_task_deadlines IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.batches IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.concept_relationships IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.concepts IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.live_sessions IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.mentor_profiles IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.notices IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.practice_cards IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.practice_decks IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.public_users_backup_$ IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_discussions IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_tasks IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmap_weeks IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.roadmaps IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_batch_assignments IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_card_mastery IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_certificates IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_concept_mastery IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_profiles IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.student_progress IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.user_sessions IS '@graphql({"exclude": true})';
COMMENT ON TABLE public.users IS '@graphql({"exclude": true})';


-- =====================================================
-- 5. SECURITY DEFINER Functions Executable by Public
-- https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
-- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
-- =====================================================

-- First, set explicit search_paths on all security definer functions to prevent path injection
ALTER FUNCTION public.create_auth_user_from_public(text, text, jsonb) SET search_path = public, extensions;
ALTER FUNCTION public.create_new_user(text, text, text, text, text) SET search_path = public, extensions;
ALTER FUNCTION public.handle_new_user() SET search_path = public, extensions;
ALTER FUNCTION public.is_admin() SET search_path = public, extensions;
ALTER FUNCTION public.is_admin_or_mentor() SET search_path = public, extensions;
ALTER FUNCTION public.is_mentor() SET search_path = public, extensions;
ALTER FUNCTION public.sync_public_user_to_auth(text, text) SET search_path = public, extensions;
ALTER FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) SET search_path = public, extensions;

-- Revoke execute from anon and public for backend management RPCs
-- NOTE: We retain authenticated access for 'is_admin' and related RLS helper functions
-- otherwise RLS policies evaluating those functions will fail.
REVOKE EXECUTE ON FUNCTION public.create_auth_user_from_public(text, text, jsonb) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_public_user_to_auth(text, text) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) FROM public, anon, authenticated;

-- Grant execute to service_role specifically so backend/edge functions can still use them
GRANT EXECUTE ON FUNCTION public.create_auth_user_from_public(text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_public_user_to_auth(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) TO service_role;

-- Revoke direct execution of the trigger function entirely from clients
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- For 'is_admin()', 'is_mentor()', 'is_admin_or_mentor()':
-- They must remain executable by authenticated for RLS. 
-- However, we revoke from 'anon' if anonymous users shouldn't execute them.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mentor() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor() FROM anon;

COMMIT;
