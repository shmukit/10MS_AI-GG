-- Fix Shazzad's Role to Admin/Mentor
-- Run this script in the Supabase SQL Editor

BEGIN;

DO $$
DECLARE
    v_email TEXT := 'shazzadhossainmukit@gmail.com';
    v_user_id UUID;
BEGIN
    -- 1. Find the user ID by email
    SELECT id INTO v_user_id FROM users WHERE email = v_email;

    IF v_user_id IS NOT NULL THEN
        -- 2. Update role to 'admin' (provides full access)
        UPDATE users 
        SET role = 'admin' 
        WHERE id = v_user_id;

        RAISE NOTICE 'Updated role for user % to admin', v_email;

        -- 3. Ensure a Mentor Profile exists (optional, but good for dashboard)
        IF NOT EXISTS (SELECT 1 FROM mentor_profiles WHERE user_id = v_user_id) THEN
            INSERT INTO mentor_profiles (user_id, organization, designation, expertise_areas, years_of_experience)
            VALUES (v_user_id, '10 Minute School', 'Admin/Mentor', ARRAY['Administration', 'Mentorship'], 5);
            RAISE NOTICE 'Created mentor profile for user %', v_email;
        END IF;

    ELSE
        RAISE NOTICE 'User % not found in public.users table.', v_email;
    END IF;

END $$;

COMMIT;
