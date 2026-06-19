-- Forward-fix: students who cannot log in with the shared default password.
-- Root cause: public.users rows without matching auth.users, or auth password never set via upsert_student_user.
--
-- Run in Supabase SQL Editor. Replace the password literal below if your production default differs.
-- Prior scripts: secure_rpc_upsert_student_user.sql, sync_existing_users.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- VERIFICATION (run first — read-only)
-- =============================================================================

-- Count: students in public.users with NO auth.users row
-- SELECT count(*) AS orphan_public_count
-- FROM public.users pu
-- LEFT JOIN auth.users au ON lower(pu.email) = lower(au.email)
-- WHERE pu.role = 'student' AND au.id IS NULL;

-- List orphans
-- SELECT pu.id, pu.email, pu.created_at
-- FROM public.users pu
-- LEFT JOIN auth.users au ON lower(pu.email) = lower(au.email)
-- WHERE pu.role = 'student' AND au.id IS NULL
-- ORDER BY pu.created_at;

-- ID mismatches (same email, different UUID)
-- SELECT pu.id AS public_id, au.id AS auth_id, pu.email
-- FROM public.users pu
-- JOIN auth.users au ON lower(pu.email) = lower(au.email)
-- WHERE pu.role = 'student' AND pu.id <> au.id;

-- Unconfirmed self-signup students
-- SELECT au.email, au.email_confirmed_at
-- FROM auth.users au
-- JOIN public.users pu ON lower(au.email) = lower(pu.email)
-- WHERE pu.role = 'student' AND au.email_confirmed_at IS NULL;

-- =============================================================================
-- FIX: provision auth.users + identities for orphan public students
-- =============================================================================

DO $$
DECLARE
  r RECORD;
  v_identity_id uuid;
  v_password text := 'NeverStopLearning!';
BEGIN
  FOR r IN
    SELECT pu.id, pu.email, pu.first_name, pu.last_name, pu.phone
    FROM public.users pu
    LEFT JOIN auth.users au ON lower(pu.email) = lower(au.email)
    WHERE pu.role = 'student' AND au.id IS NULL
  LOOP
    v_identity_id := gen_random_uuid();

    INSERT INTO auth.users (
      id, instance_id, role, aud, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      phone_change, phone_change_token, email_change_token_current, reauthentication_token
    ) VALUES (
      r.id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', r.email,
      crypt(v_password, gen_salt('bf', 10)),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'sub', r.id, 'role', 'student', 'email', r.email,
        'first_name', coalesce(r.first_name, split_part(r.email, '@', 1)),
        'last_name', coalesce(r.last_name, ''),
        'email_verified', true, 'phone_verified', false,
        'name', trim(coalesce(r.first_name, '') || ' ' || coalesce(r.last_name, ''))
      ),
      NOW(), NOW(), '', '', '', '', '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      v_identity_id, r.id,
      jsonb_build_object('sub', r.id, 'email', r.email, 'email_verified', true),
      'email', r.email, NOW(), NOW(), NOW()
    );

    UPDATE public.users
    SET
      password_hash = crypt(v_password, gen_salt('bf', 10)),
      email_verified = true,
      is_active = true,
      updated_at = NOW()
    WHERE id = r.id;

    RAISE NOTICE 'Provisioned auth user for %', r.email;
  END LOOP;
END $$;

-- =============================================================================
-- FIX: reset password for existing auth students (wrong hash / self-signup)
-- =============================================================================

DO $$
DECLARE
  r RECORD;
  v_password text := 'NeverStopLearning!';
BEGIN
  FOR r IN
    SELECT au.id, au.email
    FROM auth.users au
    JOIN public.users pu ON lower(au.email) = lower(pu.email)
    WHERE pu.role = 'student'
  LOOP
    UPDATE auth.users
    SET
      encrypted_password = crypt(v_password, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE id = r.id;

    UPDATE public.users
    SET
      password_hash = crypt(v_password, gen_salt('bf', 10)),
      email_verified = true,
      updated_at = NOW()
    WHERE lower(email) = lower(r.email);

    RAISE NOTICE 'Reset password for %', r.email;
  END LOOP;
END $$;

-- =============================================================================
-- POST-FIX VERIFICATION
-- =============================================================================

-- SELECT count(*) AS remaining_orphan_public
-- FROM public.users pu
-- LEFT JOIN auth.users au ON lower(pu.email) = lower(au.email)
-- WHERE pu.role = 'student' AND au.id IS NULL;

-- SELECT count(*) AS students_with_auth
-- FROM public.users pu
-- JOIN auth.users au ON lower(pu.email) = lower(au.email)
-- WHERE pu.role = 'student';

SELECT 'Student auth provisioning + password reset complete. Test login via app or scripts/audit_student_login.js' AS status;
