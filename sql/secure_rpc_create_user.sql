-- SECURE RPC FOR USER CREATION
-- replaces the buggy client-side 'signUp' in Admin Panel.

-- 1. Function Definition
CREATE OR REPLACE FUNCTION public.create_new_user(
    p_email text,
    p_password text,
    p_first_name text,
    p_last_name text,
    p_role text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- Critical: Runs as Superuser to write to auth.users
SET search_path = public, auth, extensions -- Critical: finds pgcrypto/gen_salt
AS $$
DECLARE
    new_uid uuid;
    new_identity_id uuid;
    v_executing_role text;
BEGIN
    -- A. SECURITY CHECK
    -- Only allow if the CALLER is an 'admin' in public.users
    SELECT role INTO v_executing_role
    FROM public.users
    WHERE id = auth.uid();

    IF v_executing_role IS DISTINCT FROM 'admin' THEN
        RAISE EXCEPTION 'Access Denied: Only Admins can create new users. (You are %)', v_executing_role;
    END IF;

    -- B. VALIDATION
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
        RAISE EXCEPTION 'User with this email already exists.';
    END IF;

    -- C. INSERTION (Using the "Platinum" Logic)
    new_uid := gen_random_uuid();
    new_identity_id := gen_random_uuid();

    -- 1. Auth User
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
        p_email,
        crypt(p_password, gen_salt('bf', 10)), -- Cost 10
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object(
            'sub', new_uid,
            'role', p_role, -- Dynamic Role
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
        '', '', '', '', '', '', '', '' -- Essential Empty Strings
    );

    -- 2. Auth Identity (The Missing Link)
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id, -- Essential
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        new_identity_id,
        new_uid,
        jsonb_build_object(
            'sub', new_uid,
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

    -- 3. Public User
    -- We attempt to insert, but handle conflict if Trigger beat us to it.
    INSERT INTO public.users (
        id,
        email,
        role,
        first_name,
        last_name,
        password_hash,
        email_verified,
        created_at,
        updated_at
    ) VALUES (
        new_uid,
        p_email,
        p_role,
        p_first_name,
        p_last_name,
        crypt(p_password, gen_salt('bf', 10)),
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();

    RETURN jsonb_build_object('id', new_uid, 'email', p_email);
END;
$$;

-- 2. Permissions
REVOKE EXECUTE ON FUNCTION public.create_new_user FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_new_user TO authenticated; -- Required so logged-in admins can call it

SELECT 'RPC Function create_new_user created.' as status;
