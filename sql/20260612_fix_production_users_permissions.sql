-- =====================================================
-- Fix Production Database Permissions (June 2026)
-- =====================================================
-- Root cause: security_hardening_2026.sql revoked ALL table grants
-- and only granted column-level SELECT on a subset of users columns.
-- The app uses SELECT * on users, which fails when password_hash is not
-- granted ("permission denied for table users").
--
-- fix_remaining_warnings_2026.sql also changed is_admin/is_mentor helpers
-- to SECURITY INVOKER, breaking RLS role checks.
--
-- Run this in the Supabase SQL Editor for production.
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Restore SECURITY DEFINER role helper functions
-- =====================================================
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

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mentor() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor() FROM public, anon;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_mentor() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_mentor() TO authenticated, service_role;


-- =====================================================
-- 2. Update safe public view (excludes password_hash)
-- =====================================================
DROP VIEW IF EXISTS public.user_profiles_public CASCADE;

CREATE VIEW public.user_profiles_public WITH (security_invoker = true) AS
SELECT
    id,
    email,
    role,
    first_name,
    last_name,
    profile_picture_url,
    phone,
    is_active,
    email_verified,
    created_at,
    updated_at
FROM public.users;

GRANT SELECT ON public.user_profiles_public TO authenticated;


-- =====================================================
-- 3. Fix users table grants for authenticated role
--    Grant all columns EXCEPT password_hash
-- =====================================================
GRANT SELECT (
    id,
    email,
    role,
    first_name,
    last_name,
    profile_picture_url,
    phone,
    is_active,
    email_verified,
    created_at,
    updated_at
) ON public.users TO authenticated;

GRANT UPDATE (
    first_name,
    last_name,
    profile_picture_url,
    phone,
    is_active,
    role
) ON public.users TO authenticated;

-- Admin user management (RLS policies restrict who can use these)
GRANT INSERT ON public.users TO authenticated;
GRANT DELETE ON public.users TO authenticated;


-- =====================================================
-- 4. Ensure RLS policies allow required access
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users viewable by authenticated users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Mentors/admins need to read student rows; cohort views need cross-user reads.
CREATE POLICY "Users viewable by authenticated users" ON public.users
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users updatable by owner, email, or admin" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

CREATE POLICY "Users updatable by owner, email, or admin" ON public.users
    FOR UPDATE TO authenticated
    USING (
        (SELECT auth.uid()) = id
        OR (SELECT auth.jwt()->>'email') = email
        OR (SELECT is_admin())
    );

DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT is_admin()));

DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE TO authenticated
    USING ((SELECT is_admin()));

COMMIT;

-- =====================================================
-- Verification queries (run after COMMIT)
-- =====================================================
-- SELECT column_name, privilege_type
-- FROM information_schema.column_privileges
-- WHERE table_schema = 'public' AND table_name = 'users' AND grantee = 'authenticated'
-- ORDER BY column_name;

-- SELECT proname, prosecdef FROM pg_proc WHERE proname IN ('is_admin', 'is_mentor', 'is_admin_or_mentor');
