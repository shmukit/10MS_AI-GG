-- =====================================================
-- Harden SECURITY DEFINER RPC exposure (2026-07-25)
-- =====================================================
-- Forward-fixes Supabase Database Linter warnings:
--   0028_anon_security_definer_function_executable
--   0029_authenticated_security_definer_function_executable
--
-- Root cause: SECURITY DEFINER implementations lived in the PostgREST-exposed
-- `public` schema with EXECUTE for anon/authenticated, so `/rest/v1/rpc/...`
-- could invoke privileged functions directly.
--
-- Fix: keep DEFINER bodies in a non-exposed `private` schema; expose only thin
-- SECURITY INVOKER wrappers in `public` for intentional client RPCs. RLS helper
-- OIDs are preserved by ALTER ... SET SCHEMA, so existing policies keep working.
--
-- Prior scripts:
--   fix_security_warnings_2026.sql
--   fix_remaining_warnings_2026.sql
--   fix_linter_warnings_2026_final.sql
--   20260612_fix_rpc_execute_permissions.sql
--   20260725_marketing_active_batches_stat.sql
--
-- NOT covered here (Auth dashboard / Management API):
--   auth_leaked_password_protection — enable HaveIBeenPwned checks in
--   Authentication → Providers → Email → "Leaked password protection"
-- =====================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

-- Prevent future private functions from defaulting to PUBLIC EXECUTE
ALTER DEFAULT PRIVILEGES IN SCHEMA private
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- -----------------------------------------------------
-- Move SECURITY DEFINER bodies out of exposed schema
-- (only when the public function is still DEFINER)
-- -----------------------------------------------------

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND p.proname IN (
        'is_admin',
        'is_mentor',
        'is_admin_or_mentor',
        'get_public_marketing_data',
        'create_new_user',
        'upsert_student_user',
        'increment_student_xp'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET SCHEMA private', r.sig);
  END LOOP;
END $$;

-- Fail loudly if a DEFINER body did not land in private (avoids clobbering logic)
DO $$
BEGIN
  IF to_regprocedure('private.is_admin()') IS NULL
     OR to_regprocedure('private.is_mentor()') IS NULL
     OR to_regprocedure('private.is_admin_or_mentor()') IS NULL
     OR to_regprocedure('private.get_public_marketing_data()') IS NULL
     OR to_regprocedure('private.create_new_user(text,text,text,text,text)') IS NULL
     OR to_regprocedure('private.upsert_student_user(uuid,text,text,text,text,text)') IS NULL
     OR to_regprocedure('private.increment_student_xp(uuid,uuid,integer)') IS NULL
  THEN
    RAISE EXCEPTION
      'Expected private.* SECURITY DEFINER functions are missing. Aborting before creating public wrappers.';
  END IF;
END $$;

-- -----------------------------------------------------
-- Private grants (DEFINER implementations)
-- -----------------------------------------------------

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_mentor() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_admin_or_mentor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin_or_mentor() TO authenticated, service_role;

REVOKE ALL ON FUNCTION private.get_public_marketing_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.get_public_marketing_data() TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION private.create_new_user(text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.create_new_user(text, text, text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION private.upsert_student_user(uuid, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.upsert_student_user(uuid, text, text, text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION private.increment_student_xp(uuid, uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.increment_student_xp(uuid, uuid, integer) TO authenticated, service_role;

-- -----------------------------------------------------
-- Public SECURITY INVOKER wrappers (PostgREST / compatibility)
-- Internal RBAC in private.* bodies is unchanged.
-- -----------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.is_admin();
$$;

CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.is_mentor();
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_mentor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.is_admin_or_mentor();
$$;

CREATE OR REPLACE FUNCTION public.get_public_marketing_data()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.get_public_marketing_data();
$$;

CREATE OR REPLACE FUNCTION public.create_new_user(
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_role text
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.create_new_user(p_email, p_password, p_first_name, p_last_name, p_role);
$$;

CREATE OR REPLACE FUNCTION public.upsert_student_user(
  p_user_id uuid,
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_phone text
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.upsert_student_user(
    p_user_id, p_email, p_password, p_first_name, p_last_name, p_phone
  );
$$;

CREATE OR REPLACE FUNCTION public.increment_student_xp(
  p_student_id uuid,
  p_batch_id uuid,
  p_points integer
)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.increment_student_xp(p_student_id, p_batch_id, p_points);
$$;

-- -----------------------------------------------------
-- Public grants (INVOKER wrappers only)
-- -----------------------------------------------------

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_mentor() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin_or_mentor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_mentor() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_public_marketing_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_marketing_data() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.create_new_user(text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.increment_student_xp(uuid, uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_student_xp(uuid, uuid, integer) TO authenticated, service_role;

COMMIT;

-- =====================================================
-- Verification (run after COMMIT)
-- =====================================================
-- 1) Exposed public RPCs must be SECURITY INVOKER (prosecdef = false)
-- SELECT n.nspname, p.proname, p.prosecdef AS security_definer,
--        pg_get_function_identity_arguments(p.oid) AS args
-- FROM pg_proc p
-- JOIN pg_namespace n ON n.oid = p.pronamespace
-- WHERE p.proname IN (
--   'is_admin', 'is_mentor', 'is_admin_or_mentor',
--   'get_public_marketing_data', 'create_new_user',
--   'upsert_student_user', 'increment_student_xp'
-- )
-- ORDER BY n.nspname, p.proname;
--
-- Expected: public.* → security_definer = false
--           private.* → security_definer = true
--
-- 2) Smoke tests
-- SELECT public.is_admin();
-- SELECT public.get_public_marketing_data()->'stats';
--
-- 3) Confirm `private` is NOT in PostgREST exposed schemas
--    (Dashboard → Settings → API → Exposed schemas → only public / graphql_public)
--
-- 4) Auth: enable leaked password protection in the Auth settings UI
--    https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
