-- Bulk create + enroll workshop participants on "Become a Manager of AI Agents".
-- Same login path as Mentor → Add Student (auth.users + identity + public.users + batch).
--
-- Run in Supabase SQL Editor as postgres (service role). Idempotent.
-- Set v_password in the DO block immediately before running. Do not commit a real password.
--
-- Safe / not safe:
--   SAFE if this script completes: email already confirmed; password set in auth.users;
--   public.users id matches auth.users id; batch assignment active.
--   RISK if email already exists with a different password: this RESETS password to v_password
--   (intended for workshop cohort; warn anyone who already had an account).
--   RISK if you force role=student on a mentor: existing mentor/admin emails are skipped in the loop.
--   NOT the same as public signup: they must use Login, not Sign up.
--
-- Direct login: after run, participants open the app → Login (not Sign up) with
-- their email + v_password. No email confirmation step. Email is already confirmed.
-- Roadmap: /student/roadmap/become_a_manager_of_ai_agents?batch_id=<batch_id from NOTICE>

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $body$
DECLARE
  -- Shared login password for all workshop participants.
  -- Set this in the SQL Editor immediately before running. Do not commit a real value.
  v_password text := NULL;

  v_roadmap_id uuid;
  v_batch_id uuid;
  v_mentor_id uuid;
  r record;
  v_user_id uuid;
  v_auth_id uuid;
  v_public_id uuid;
  v_identity_id uuid;
  v_created int := 0;
  v_updated int := 0;
  v_enrolled int := 0;
  v_skipped int := 0;
BEGIN
  IF v_password IS NULL OR length(trim(v_password)) < 8 THEN
    RAISE EXCEPTION 'Set v_password in this DO block before running (min 8 characters). Do not commit a real password.';
  END IF;

  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  -- Prefer an existing active workshop batch; else create one.
  SELECT b.id INTO v_batch_id
  FROM public.batches b
  WHERE b.roadmap_id = v_roadmap_id
    AND b.status = 'active'
  ORDER BY b.created_at DESC
  LIMIT 1;

  IF v_batch_id IS NULL THEN
    SELECT id INTO v_mentor_id
    FROM public.users
    WHERE role IN ('mentor', 'admin')
      AND is_active IS DISTINCT FROM false
    ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END, created_at
    LIMIT 1;

    IF v_mentor_id IS NULL THEN
      RAISE EXCEPTION 'No active batch and no mentor/admin to own a new batch.';
    END IF;

    INSERT INTO public.batches (
      name, roadmap_id, mentor_id, max_students, current_students,
      start_date, end_date, status
    ) VALUES (
      'Become a Manager of AI Agents — Workshop Cohort',
      v_roadmap_id,
      v_mentor_id,
      50,
      0,
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '90 days',
      'active'
    )
    RETURNING id INTO v_batch_id;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      -- first_name, last_name, email, phone, institute, designation
      ('Md. Ruhin', 'Hossain', 'mdruhinhossain@gmail.com', '01711082630', 'National Bank PLC', 'Senior Executive Officer'),
      ('Md. Masidur', 'Rahman', 'nsideu2000@gmail.com', '01754750571', 'Bitopi Group', 'Sr. Manager'),
      ('A M Ashraf', 'Uddin', 'pushonn@gmail.com', '01713755051', 'Avery Dennison', 'Associate Manager - Ops and Supply Chain'),
      ('Md Abdur', 'Rahman', 'arahman1111@gmail.com', '01722207805', 'Modern Medical Equipments Solutions', 'AGM (Commercial & Banking)'),
      ('Md Tofail', 'Hoque', 'tofail@icloud.com', '01713365462', 'DBL Group', 'DGM'),
      ('Shahariar', 'Rahman', 'srpulak99@gmail.com', '01718752007', 'Renata PLC', 'Portfolio Manager'),
      ('Jawwad', 'Sadiq', 'jawwads99@gmail.com', '01818796089', 'British American Tobacco Bangladesh', 'IWS Manager'),
      ('Srijita', 'Das', 'dassrijita253@gmail.com', '01706627897', 'Purabi Group of Companies', 'Managing Executive'),
      ('Adrita', 'Das', 'adritadas116@gmail.com', '01881133721', 'Purabi Group of Companies', 'Managing Executive'),
      ('K. M. Habibur', 'Rahaman', 'habib0191@gmail.com', '01674717240', 'Berger', 'Manager - Supply Chain'),
      ('Rofiqul', 'Islam', 'rofiqul.islam@ipdcbd.com', '01730318771', 'IPDC Finance', 'Head of Collection-Business Finance'),
      ('Mohammad Juyel Hossain', 'Bhuiyan', 'juyel.bhuiyan@ipdcbd.com', '01730725554', 'IPDC Finance', 'Head of Recovery Portfolio at Risk'),
      ('Mohiuddin', 'Chowdhury', 'mohiuddin.chowdhury@ipdcbd.com', '01936015020', 'IPDC Finance', 'Head of Collection-Retail Business'),
      ('Jalal', 'Ahmad', 'jalal.ahmad@ipdcbd.com', '01730728291', 'IPDC Finance', 'Head of Corporate Liability'),
      ('Abdur', 'Rahim', 'rahim.rony@ipdcbd.com', '01730725551', 'IPDC Finance', 'Head of Retail Liability'),
      ('Azaharul', 'Kabir', 'azaharul.kabir@ipdcbd.com', '01858038469', 'IPDC Finance', 'Business Coordinator to MD Office'),
      ('Salehin Shahadat', 'Chowdhury', 'salehin-sfbl@squaregroup.com', '01329725886', 'Square Food and Beverage Ltd.', 'Participant'),
      ('Anamica', 'Hussain', 'anamica.hussain@gmail.com', '01701032811', 'Square Food and Beverage Ltd.', 'Participant'),
      ('Md. Abu', 'Yousuf', 'ma.yousuf@goldengroup-bd.com', '01988886199', 'Golden Group BD', 'Sr. Manager, HR'),
      ('Asif', 'Ahmed', 'a.ahmed@goldengroup-bd.com', '01988886200', 'Golden Group BD', 'Manager, Procurement'),
      ('Md. Mahadi', 'Hasan', 'm.hasan1@goldengroup-bd.com', '0132505061', 'Golden Group BD', 'Executive, MIS'),
      ('Mohammad Ejazur', 'Rahman', 'ejazur.rahman@mindmapperbd.com', '01933337733', 'Mind Mapper Bangladesh', 'Managing Director'),
      ('Nafisa', 'Anjum', 'nafisa.anjum@mindmapperbd.com', '01799773600', 'Mind Mapper Bangladesh', 'Director'),
      ('Md. Mizanur', 'Rahman', 'mizanur.enc@gmail.com', '01819210971', 'Mind Mapper Bangladesh', 'Senior Consultant and Adviser'),
      ('Rashed', 'Iqbal', 'rashed.iqbal2@gmail.com', '01769093330', 'Bangladesh Army', 'Retired Brigadier General')
      -- If Ejazur/Nafisa are already mentor/admin in public.users, the loop skips them (does not demote).
    ) AS t(first_name, last_name, email, phone, institute, designation)
  LOOP
    -- Never demote existing mentors/admins
    IF EXISTS (
      SELECT 1 FROM public.users u
      WHERE lower(u.email) = lower(r.email)
        AND u.role IN ('mentor', 'admin')
    ) THEN
      RAISE NOTICE 'SKIP (mentor/admin): %', r.email;
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    SELECT id INTO v_public_id FROM public.users WHERE lower(email) = lower(r.email) LIMIT 1;
    SELECT id INTO v_auth_id FROM auth.users WHERE lower(email) = lower(r.email) LIMIT 1;

    IF v_auth_id IS NOT NULL AND v_public_id IS NOT NULL AND v_auth_id <> v_public_id THEN
      RAISE EXCEPTION 'ID mismatch for % (auth=% public=%). Fix manually before continuing.',
        r.email, v_auth_id, v_public_id;
    END IF;

    IF v_auth_id IS NULL THEN
      v_user_id := COALESCE(v_public_id, gen_random_uuid());
      v_identity_id := gen_random_uuid();

      INSERT INTO auth.users (
        id, instance_id, role, aud, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        phone_change, phone_change_token, email_change_token_current, reauthentication_token
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', lower(r.email),
        crypt(v_password, gen_salt('bf', 10)),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object(
          'sub', v_user_id,
          'role', 'student',
          'email', lower(r.email),
          'first_name', r.first_name,
          'last_name', r.last_name,
          'email_verified', true,
          'phone_verified', false,
          'name', trim(r.first_name || ' ' || r.last_name)
        ),
        NOW(), NOW(),
        '', '', '', '', '', '', '', ''
      );

      INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id,
        last_sign_in_at, created_at, updated_at
      ) VALUES (
        v_identity_id,
        v_user_id,
        jsonb_build_object(
          'sub', v_user_id,
          'email', lower(r.email),
          'email_verified', true,
          'phone_verified', false
        ),
        'email',
        lower(r.email),
        NOW(), NOW(), NOW()
      );

      v_created := v_created + 1;
    ELSE
      v_user_id := v_auth_id;

      UPDATE auth.users
      SET
        encrypted_password = crypt(v_password, gen_salt('bf', 10)),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
          'role', 'student',
          'email', lower(r.email),
          'first_name', r.first_name,
          'last_name', r.last_name,
          'email_verified', true,
          'name', trim(r.first_name || ' ' || r.last_name)
        ),
        updated_at = NOW()
      WHERE id = v_user_id;

      -- Ensure email identity exists
      IF NOT EXISTS (
        SELECT 1 FROM auth.identities
        WHERE user_id = v_user_id AND provider = 'email'
      ) THEN
        INSERT INTO auth.identities (
          id, user_id, identity_data, provider, provider_id,
          last_sign_in_at, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          v_user_id,
          jsonb_build_object(
            'sub', v_user_id,
            'email', lower(r.email),
            'email_verified', true,
            'phone_verified', false
          ),
          'email',
          lower(r.email),
          NOW(), NOW(), NOW()
        );
      END IF;

      v_updated := v_updated + 1;
    END IF;

    INSERT INTO public.users (
      id, email, password_hash, role, first_name, last_name, phone,
      is_active, email_verified, created_at, updated_at
    ) VALUES (
      v_user_id,
      lower(r.email),
      crypt(v_password, gen_salt('bf', 10)),
      'student',
      r.first_name,
      r.last_name,
      r.phone,
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

    -- student_profiles has no batch_id (enrollment is student_batch_assignments only)
    IF EXISTS (SELECT 1 FROM public.student_profiles WHERE user_id = v_user_id) THEN
      UPDATE public.student_profiles
      SET
        institute = r.institute,
        subject = COALESCE(NULLIF(trim(r.designation), ''), 'Workshop participant'),
        updated_at = NOW()
      WHERE user_id = v_user_id;
    ELSE
      INSERT INTO public.student_profiles (
        user_id, institute, year, subject, degree,
        completed_weeks, progress_percentage, enrollment_date
      ) VALUES (
        v_user_id,
        r.institute,
        '2026',
        COALESCE(NULLIF(trim(r.designation), ''), 'Workshop participant'),
        'Workshop',
        0,
        0,
        CURRENT_DATE
      );
    END IF;

    INSERT INTO public.student_batch_assignments (
      student_id, batch_id, status, enrollment_date,
      progress_percentage, completed_weeks
    ) VALUES (
      v_user_id, v_batch_id, 'active', CURRENT_DATE, 0, 0
    )
    ON CONFLICT (student_id, batch_id) DO UPDATE SET
      status = 'active',
      enrollment_date = EXCLUDED.enrollment_date,
      updated_at = NOW();

    v_enrolled := v_enrolled + 1;
  END LOOP;

  -- Enable decks + decision tree for cohort (if catalog exists)
  BEGIN
    INSERT INTO public.batch_slide_decks (batch_id, slide_deck_id, is_enabled)
    SELECT v_batch_id, sd.id, true
    FROM public.roadmap_slide_decks sd
    WHERE sd.roadmap_id = v_roadmap_id AND sd.is_active = true
    ON CONFLICT (batch_id, slide_deck_id) DO UPDATE
    SET is_enabled = true, updated_at = NOW();
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;

  BEGIN
    INSERT INTO public.batch_decision_trees (batch_id, decision_tree_id, is_enabled)
    SELECT v_batch_id, dt.id, true
    FROM public.roadmap_decision_trees dt
    WHERE dt.roadmap_id = v_roadmap_id AND dt.is_active = true
    ON CONFLICT (batch_id, decision_tree_id) DO UPDATE
    SET is_enabled = true, updated_at = NOW();
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;

  UPDATE public.batches
  SET current_students = (
    SELECT COUNT(*)::integer
    FROM public.student_batch_assignments sba
    WHERE sba.batch_id = v_batch_id AND sba.status = 'active'
  ),
  updated_at = NOW()
  WHERE id = v_batch_id;

  RAISE NOTICE 'batch_id=% created=% password_reset_existing=% enrolled=% skipped_mentor=%',
    v_batch_id, v_created, v_updated, v_enrolled, v_skipped;
  RAISE NOTICE 'Student URL: /student/roadmap/become_a_manager_of_ai_agents?batch_id=%', v_batch_id;
END
$body$;

-- Verification (run after):
-- SELECT u.email, u.role, u.email_verified,
--        (au.id IS NOT NULL) AS has_auth,
--        au.email_confirmed_at IS NOT NULL AS email_confirmed,
--        sba.status AS batch_status,
--        b.id AS batch_id, b.name AS batch_name
-- FROM public.users u
-- LEFT JOIN auth.users au ON au.id = u.id
-- LEFT JOIN public.student_batch_assignments sba ON sba.student_id = u.id AND sba.status = 'active'
-- LEFT JOIN public.batches b ON b.id = sba.batch_id
-- LEFT JOIN public.roadmaps r ON r.id = b.roadmap_id AND r.title = 'Become a Manager of AI Agents'
-- WHERE lower(u.email) IN (
--   'mdruhinhossain@gmail.com','nsideu2000@gmail.com','pushonn@gmail.com','arahman1111@gmail.com',
--   'tofail@icloud.com','srpulak99@gmail.com','jawwads99@gmail.com','dassrijita253@gmail.com',
--   'adritadas116@gmail.com','habib0191@gmail.com','rofiqul.islam@ipdcbd.com','juyel.bhuiyan@ipdcbd.com',
--   'mohiuddin.chowdhury@ipdcbd.com','jalal.ahmad@ipdcbd.com','rahim.rony@ipdcbd.com',
--   'azaharul.kabir@ipdcbd.com','salehin-sfbl@squaregroup.com','anamica.hussain@gmail.com',
--   'ma.yousuf@goldengroup-bd.com','a.ahmed@goldengroup-bd.com','m.hasan1@goldengroup-bd.com',
--   'ejazur.rahman@mindmapperbd.com','nafisa.anjum@mindmapperbd.com',
--   'mizanur.enc@gmail.com','rashed.iqbal2@gmail.com'
-- )
-- ORDER BY u.email;
--
-- Spot-check login: one Gmail + one corporate email with the shared password (Login, not Sign up).
