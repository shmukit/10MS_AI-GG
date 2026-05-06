-- Fix 20 Student ID Mismatches
-- This script synchronizes public.users IDs with Supabase Auth IDs
-- and reassigns all related data (profiles, assignments, progress, etc.)

BEGIN;

-- 1. aninditanitul@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'ac43bdeb-94de-4b52-be56-2ea80fc14f8c';
  v_old_id UUID := '5c732507-fd2b-49bd-8bd2-56ae782a048c';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 2. nishattasnim06ce@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'c2be1d53-be15-4b91-b3cf-c7e751b77015';
  v_old_id UUID := 'c4136ab7-f17b-453e-91f7-d0d13d4c1fd4';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 3. zebasotota71318@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '1d9a9eb5-7cb5-4b89-ab1b-0d9f499e85d3';
  v_old_id UUID := 'ed0ba10c-2aff-401f-8a36-a53af1d9d559';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 4. msnila20599@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '8baacada-7933-4f19-9301-c971dfb74cc1';
  v_old_id UUID := '575cabba-0669-4e87-8f36-de297da7d406';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 5. shazzadhossainmukit@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '1d376640-2bf7-4ef0-b550-ad5b73ee5c02';
  v_old_id UUID := 'e5744731-20b7-41d9-994b-0e8aa5bc54b2';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 6. nafisayasmin24@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '59b720cc-0cd4-48e8-8809-0f2f9c2ada69';
  v_old_id UUID := 'e601a746-79cc-4c4a-b20c-1e6512f0e30c';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 7. farzanaakhi8852@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '67a52266-fc2c-4cdb-b0c0-11c9d6b94ebd';
  v_old_id UUID := 'b634ac81-b743-43fd-aa9f-a69e32038473';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 8. anisakhanam282@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '966dcf0f-992d-4d18-a1b4-f7747ab54a55';
  v_old_id UUID := '0b322492-4e72-4797-b539-2bf15088ebc8';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 9. afiyatanjum49@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '4487f35b-d6af-4e41-aa11-b04033d01617';
  v_old_id UUID := '63c10f0e-9ebb-4b27-bd82-93d929ca9bc4';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 10. mhfiona1309@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'c500745d-7127-4f6d-a77b-4ac805b78d2b';
  v_old_id UUID := '7f33bdef-36f4-403c-bafe-2ac2ed474127';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 11. tas.noshin22@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '375fb0af-d28c-4a22-be6d-4b06c4573ef4';
  v_old_id UUID := '4935328f-c743-42d6-8a5f-cebe9a00b588';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 12. hridimehnaj@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'eff0cec9-7f9c-455f-8da9-a93242064258';
  v_old_id UUID := 'c535bd5c-466b-4abd-bac5-912c3cb25712';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 13. info.kazinusera@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '416b8cde-21ab-4516-b29e-3ab5c790c930';
  v_old_id UUID := 'a7b3eb00-22ac-4247-9b04-34118324c15c';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 14. samhakashfia@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '24607b0f-52b6-473a-9f02-b18a30c467a0';
  v_old_id UUID := 'e0c1ee8e-e55b-4b67-bc58-02b416fa0bcd';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 15. nawar.sadita@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'bee1e546-8bee-487f-a585-97cec71b4189';
  v_old_id UUID := 'a8ad26a3-30d0-42c2-82a2-14139207737d';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 16. anikazahan17@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '37b18985-d17e-4592-9728-0bf7bf9dcc35';
  v_old_id UUID := 'a0737bf3-190c-4ee2-a27b-ee00954b5533';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 17. nadia.ictd@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '323d66f4-4294-4507-934e-81af4ecbb46b';
  v_old_id UUID := 'e5658cb3-fcd0-4c2e-8276-04ad092224fe';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 18. trinasustcse41@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := 'cec3b7c1-d3bf-48e8-ba16-fab135a39a1f';
  v_old_id UUID := 'adbf2834-53db-451d-a365-fc4bfdbc851e';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 19. tabassumfarin222@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '39b61d5c-f89c-414b-a014-837560606adc';
  v_old_id UUID := '308324f0-fded-4eff-9ff6-050ce39f8324';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

-- 20. peris.marilyn5649@gmail.com
DO $$ 
DECLARE 
  v_new_id UUID := '1da57d47-0785-4d2f-808f-cefa03a8cc77';
  v_old_id UUID := '4512a298-a195-42c0-9c22-cda300d90764';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_new_id) THEN
    INSERT INTO users (id, email, password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at)
    SELECT v_new_id, email || '_tmp', password_hash, role, first_name, last_name, profile_picture_url, phone, is_active, email_verified, created_at
    FROM users WHERE id = v_old_id;
    UPDATE student_profiles SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_batch_assignments SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE student_progress SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE roadmap_discussions SET user_id = v_new_id WHERE user_id = v_old_id;
    UPDATE student_concept_mastery SET student_id = v_new_id WHERE student_id = v_old_id;
    UPDATE user_sessions SET user_id = v_new_id WHERE user_id = v_old_id;
    DELETE FROM users WHERE id = v_old_id;
    UPDATE users SET email = REPLACE(email, '_tmp', '') WHERE id = v_new_id;
  END IF;
END $$;

COMMIT;
