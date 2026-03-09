-- Fix a single student's Supabase Auth login by recreating auth records.
-- Use when sign-in returns "Database error querying schema" for a specific email.
--
-- Steps:
-- 1) Set the target email below
-- 2) Run in Supabase SQL Editor
--
-- This preserves the public.users UUID to keep batch assignments/profiles intact.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_email text := 'humayra1393@gmail.com'; -- <- change this if needed
  v_uid uuid;
  v_identity_id uuid;
BEGIN
  SELECT id INTO v_uid FROM public.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No public.users record found for %', v_email;
  END IF;

  -- Remove any existing auth identities/users for this email/id
  DELETE FROM auth.identities WHERE user_id = v_uid OR provider_id = v_email;
  DELETE FROM auth.users WHERE id = v_uid OR email = v_email;

  v_identity_id := gen_random_uuid();

  -- Recreate auth user with the standard password
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
    v_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    v_email,
    crypt('NeverStopLearning!', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object(
      'sub', v_uid,
      'role', 'student',
      'email', v_email,
      'first_name', (SELECT first_name FROM public.users WHERE id = v_uid),
      'last_name', (SELECT last_name FROM public.users WHERE id = v_uid),
      'email_verified', true,
      'phone_verified', false,
      'is_company_user', false,
      'name', (SELECT first_name || ' ' || last_name FROM public.users WHERE id = v_uid)
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
    v_identity_id,
    v_uid,
    jsonb_build_object(
      'sub', v_uid,
      'email', v_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    v_email,
    NOW(),
    NOW(),
    NOW()
  );

  -- Keep public.users password_hash aligned (optional, but consistent)
  UPDATE public.users
  SET password_hash = crypt('NeverStopLearning!', gen_salt('bf', 10)),
      updated_at = NOW()
  WHERE id = v_uid;

  RAISE NOTICE 'Recreated auth user for % (id=%)', v_email, v_uid;
END $$;

