-- SECURE RPC: UPSERT STUDENT USER (Mentor/Admin)
-- Purpose:
-- - Ensures a student can actually log in (creates/updates `auth.users`)
-- - Keeps `public.users` in sync (role, name, password_hash)
-- - Allows mentors/admins to add students without exposing service_role keys in the client
--
-- Usage (from client):
--   supabase.rpc('upsert_student_user', {
--     p_user_id,
--     p_email,
--     p_password,
--     p_first_name,
--     p_last_name,
--     p_phone
--   })
--
-- Note:
-- This sets the password in BOTH:
-- - auth.users.encrypted_password (used by Supabase Auth login)
-- - public.users.password_hash (custom app table)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.upsert_student_user(
  p_user_id uuid,
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_phone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_executing_role text;
  v_auth_id uuid;
  v_public_id uuid;
  v_identity_id uuid;
BEGIN
  -- SECURITY CHECK: only mentors/admins
  SELECT role INTO v_executing_role
  FROM public.users
  WHERE id = auth.uid();

  IF v_executing_role IS DISTINCT FROM 'admin' AND v_executing_role IS DISTINCT FROM 'mentor' THEN
    RAISE EXCEPTION 'Access Denied: Only Admins or Mentors can upsert students. (You are %)', v_executing_role;
  END IF;

  -- Find by email in both schemas
  SELECT id INTO v_public_id FROM public.users WHERE email = p_email;
  SELECT id INTO v_auth_id FROM auth.users WHERE email = p_email;

  -- If both exist but IDs differ, stop (needs dedicated reconciliation)
  IF v_auth_id IS NOT NULL AND v_public_id IS NOT NULL AND v_auth_id <> v_public_id THEN
    RAISE EXCEPTION 'ID mismatch for % (auth.users.id=% public.users.id=%). Run sync/fix scripts before continuing.',
      p_email, v_auth_id, v_public_id;
  END IF;

  IF v_auth_id IS NULL THEN
    -- Prefer existing public.users id to preserve relationships; otherwise use caller-provided p_user_id
    v_auth_id := COALESCE(v_public_id, p_user_id);
    v_identity_id := gen_random_uuid();

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
      v_auth_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      p_email,
      crypt(p_password, gen_salt('bf', 10)),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'sub', v_auth_id,
        'role', 'student',
        'email', p_email,
        'first_name', p_first_name,
        'last_name', p_last_name,
        'email_verified', true,
        'phone_verified', false,
        'is_company_user', false,
        'name', p_first_name || ' ' || p_last_name
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
      v_auth_id,
      jsonb_build_object(
        'sub', v_auth_id,
        'email', p_email,
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      p_email,
      NOW(),
      NOW(),
      NOW()
    );
  ELSE
    -- Exists in auth.users: reset password + metadata to student
    UPDATE auth.users
    SET
      encrypted_password = crypt(p_password, gen_salt('bf', 10)),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
        'role', 'student',
        'email', p_email,
        'first_name', p_first_name,
        'last_name', p_last_name,
        'email_verified', true,
        'name', p_first_name || ' ' || p_last_name
      ),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE id = v_auth_id;
  END IF;

  -- Upsert public.users to match auth id and store a bcrypt hash for reference
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    role,
    first_name,
    last_name,
    phone,
    is_active,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_auth_id,
    p_email,
    crypt(p_password, gen_salt('bf', 10)),
    'student',
    p_first_name,
    p_last_name,
    p_phone,
    true,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'student',
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    is_active = true,
    email_verified = true,
    updated_at = NOW();

  RETURN jsonb_build_object('id', v_auth_id, 'email', p_email);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_student_user(uuid, text, text, text, text, text) TO authenticated;

SELECT 'RPC Function upsert_student_user created.' as status;

