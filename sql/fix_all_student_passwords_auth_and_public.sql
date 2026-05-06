-- FIX: Set ALL student passwords to "NeverStopLearning!"
-- This script updates BOTH:
-- - auth.users.encrypted_password (what Supabase login uses)
-- - public.users.password_hash (custom app table)
--
-- It also creates missing auth.users rows for students that only exist in public.users.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  user_record RECORD;
  new_uid UUID;
  new_identity_id UUID;
  v_password_plain TEXT := 'NeverStopLearning!';
BEGIN
  -- 1) Create auth.users rows for students missing in auth.users (email-based)
  FOR user_record IN
    SELECT pu.id, pu.email, pu.first_name, pu.last_name
    FROM public.users pu
    LEFT JOIN auth.users au ON pu.email = au.email
    WHERE au.id IS NULL
      AND pu.role = 'student'
      AND pu.is_active = true
  LOOP
    new_uid := user_record.id; -- preserve existing relationships
    new_identity_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      role,
      aud,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change, phone_change, phone_change_token, email_change_token_current, reauthentication_token
    ) VALUES (
      new_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      user_record.email,
      crypt(v_password_plain, gen_salt('bf', 10)),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'sub', new_uid,
        'role', 'student',
        'email', user_record.email,
        'first_name', user_record.first_name,
        'last_name', user_record.last_name,
        'email_verified', true,
        'phone_verified', false,
        'is_company_user', false,
        'name', user_record.first_name || ' ' || user_record.last_name
      ),
      NOW(),
      NOW(),
      '', '', '', '', '', '', '', ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_identity_id,
      new_uid,
      jsonb_build_object(
        'sub', new_uid,
        'email', user_record.email,
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      user_record.email,
      NOW(),
      NOW(),
      NOW()
    );
  END LOOP;
END $$;

-- 2) Update auth password for all active students (by email list from public.users)
UPDATE auth.users au
SET
  encrypted_password = crypt('NeverStopLearning!', gen_salt('bf', 10)),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE au.email IN (
  SELECT email FROM public.users WHERE role = 'student' AND is_active = true
);

-- 3) Update public password_hash for all active students
UPDATE public.users pu
SET
  password_hash = crypt('NeverStopLearning!', gen_salt('bf', 10)),
  updated_at = NOW()
WHERE pu.role = 'student' AND pu.is_active = true;

-- 4) Verification counts
SELECT
  (SELECT COUNT(*) FROM public.users WHERE role = 'student' AND is_active = true) AS total_active_students_in_public,
  (SELECT COUNT(*)
   FROM auth.users au
   WHERE au.email IN (SELECT email FROM public.users WHERE role = 'student' AND is_active = true)
  ) AS corresponding_students_in_auth;

