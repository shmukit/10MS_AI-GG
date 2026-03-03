-- SQL SCRIPT TO SYNC PUBLIC.USERS TO AUTH.USERS
-- This fixes the issue where students were added to the public table but cannot log in.

DO $$
DECLARE
    user_record RECORD;
    new_uid UUID;
    new_identity_id UUID;
    v_password_plain TEXT := 'NeverStopLearning!';
BEGIN
    FOR user_record IN 
        SELECT pu.id, pu.email, pu.first_name, pu.last_name, pu.role
        FROM public.users pu
        LEFT JOIN auth.users au ON pu.email = au.email
        WHERE au.id IS NULL AND pu.role = 'student'
    LOOP
        RAISE NOTICE 'Syncing user: %', user_record.email;
        
        new_uid := user_record.id; -- Keep the same ID if possible, or use NEW.id if preferred.
        -- Actually, it's safer to use the ID already in public.users to maintain relationships.
        
        new_identity_id := gen_random_uuid();

        -- 1. Insert into auth.users
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
                'role', user_record.role,
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

        -- 2. Insert into auth.identities
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
        
        RAISE NOTICE 'User % synced successfully.', user_record.email;
    END LOOP;
END $$;
