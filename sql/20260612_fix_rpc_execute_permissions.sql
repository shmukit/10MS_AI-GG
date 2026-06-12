-- =====================================================
-- Fix RPC Execute Permissions (June 2026)
-- =====================================================
-- Root cause: fix_security_warnings_2026.sql (lines 92-94) revoked
-- EXECUTE from the 'authenticated' role on upsert_student_user and
-- create_new_user. Both are called directly from the browser by
-- admin/mentor sessions and have their own internal RBAC guards.
-- Revoking from 'public' and 'anon' was the right security fix;
-- revoking from 'authenticated' broke the admin/mentor workflows.
--
-- Fixes:
--   "permission denied for function upsert_student_user"
--     → src/components/Mentor/tabs/hooks/useStudentsTab.ts
--   "permission denied for function create_new_user"
--     → src/components/Admin/UserManagement/AddUserModal.tsx
-- =====================================================

BEGIN;

-- upsert_student_user: called by mentors & admins from the Students tab.
--   Internal RBAC guard: raises if caller role NOT IN ('admin', 'mentor').
--   It is safe to grant to authenticated because students are blocked inside
--   the function body itself.
REVOKE EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) TO authenticated, service_role;

-- create_new_user: called by admins from the Add User modal.
--   Internal RBAC guard: raises if caller role IS DISTINCT FROM 'admin'.
REVOKE EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text) FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.create_new_user(text, text, text, text, text) TO authenticated, service_role;

COMMIT;

-- =====================================================
-- Verification (run after COMMIT)
-- =====================================================
-- SELECT routine_name, grantee, privilege_type
-- FROM information_schema.routine_privileges
-- WHERE routine_schema = 'public'
--   AND routine_name IN ('upsert_student_user', 'create_new_user')
-- ORDER BY routine_name, grantee;
--
-- Expected: both functions show 'authenticated' and 'service_role' as grantees.
