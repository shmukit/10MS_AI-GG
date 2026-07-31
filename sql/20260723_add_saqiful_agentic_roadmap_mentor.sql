-- Add saqiful@gmail.com as mentor of "Become a Manager of AI Agents" (Agentic AI roadmap).
-- Profile: Team Lead, Manufacturing Robotics @ ACI AI Labs; data analytics expert.
-- LinkedIn: https://www.linkedin.com/in/saqifulalam/
-- Idempotent: safe to re-run.
-- Prerequisite: user must already exist in public.users (sign in / create via Admin once).

DO $$
DECLARE
  v_user_id UUID;
  v_roadmap_id UUID;
  v_batch_id UUID;
  v_profile_id UUID;
  v_batches_linked INTEGER := 0;
BEGIN
  SELECT id INTO v_user_id
  FROM public.users
  WHERE lower(email) = lower('saqiful@gmail.com')
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'No user found for saqiful@gmail.com. Create/invite the account first (Admin → Add User as mentor, or have them sign in once), then re-run this script.';
  END IF;

  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION
      'Roadmap "Become a Manager of AI Agents" not found. Run sql/20260721_become_manager_of_ai_agents_roadmap_rerun.sql first.';
  END IF;

  -- Promote to mentor and set display name.
  UPDATE public.users
  SET
    role = 'mentor',
    first_name = COALESCE(NULLIF(trim(first_name), ''), 'Khan Muhammad Saqiful'),
    last_name = COALESCE(NULLIF(trim(last_name), ''), 'Alam'),
    is_active = true,
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Prefer full LinkedIn name when still placeholder-ish.
  UPDATE public.users
  SET
    first_name = 'Khan Muhammad Saqiful',
    last_name = 'Alam',
    updated_at = NOW()
  WHERE id = v_user_id
    AND (
      lower(coalesce(first_name, '')) IN ('', 'saqiful', 'user')
      OR lower(coalesce(last_name, '')) IN ('', 'user')
    );

  -- Upsert mentor profile (no UNIQUE on user_id — update if any row exists).
  SELECT id INTO v_profile_id
  FROM public.mentor_profiles
  WHERE user_id = v_user_id
  ORDER BY created_at ASC NULLS LAST
  LIMIT 1;

  IF v_profile_id IS NULL THEN
    INSERT INTO public.mentor_profiles (
      user_id,
      organization,
      designation,
      expertise_areas,
      bio,
      years_of_experience
    )
    VALUES (
      v_user_id,
      'ACI AI Labs',
      'Team Lead, Manufacturing Robotics',
      ARRAY['Data Analytics', 'Business Intelligence', 'AI Strategy', 'Manufacturing Robotics'],
      'Data analytics expert. Team Lead, Manufacturing Robotics at ACI AI Labs. LinkedIn: https://www.linkedin.com/in/saqifulalam/',
      NULL
    )
    RETURNING id INTO v_profile_id;
  ELSE
    UPDATE public.mentor_profiles
    SET
      organization = 'ACI AI Labs',
      designation = 'Team Lead, Manufacturing Robotics',
      expertise_areas = ARRAY['Data Analytics', 'Business Intelligence', 'AI Strategy', 'Manufacturing Robotics'],
      bio = 'Data analytics expert. Team Lead, Manufacturing Robotics at ACI AI Labs. LinkedIn: https://www.linkedin.com/in/saqifulalam/',
      updated_at = NOW()
    WHERE id = v_profile_id;
  END IF;

  -- Ensure at least one active cohort exists for this roadmap.
  SELECT b.id INTO v_batch_id
  FROM public.batches b
  WHERE b.roadmap_id = v_roadmap_id
    AND b.status = 'active'
  ORDER BY b.created_at DESC
  LIMIT 1;

  IF v_batch_id IS NULL THEN
    INSERT INTO public.batches (
      name,
      roadmap_id,
      mentor_id,
      max_students,
      current_students,
      start_date,
      end_date,
      status
    )
    VALUES (
      'Become a Manager of AI Agents — Workshop Cohort',
      v_roadmap_id,
      v_user_id,
      50,
      0,
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '90 days',
      'active'
    )
    RETURNING id INTO v_batch_id;
  END IF;

  -- Link mentor to every active batch on this roadmap.
  INSERT INTO public.batch_mentors (batch_id, mentor_id)
  SELECT b.id, v_user_id
  FROM public.batches b
  WHERE b.roadmap_id = v_roadmap_id
    AND b.status = 'active'
  ON CONFLICT (batch_id, mentor_id) DO NOTHING;

  GET DIAGNOSTICS v_batches_linked = ROW_COUNT;

  -- Keep legacy batches.mentor_id populated when empty.
  UPDATE public.batches
  SET
    mentor_id = COALESCE(mentor_id, v_user_id),
    updated_at = NOW()
  WHERE roadmap_id = v_roadmap_id
    AND status = 'active'
    AND mentor_id IS NULL;

  RAISE NOTICE
    'Mentor % (%) linked to Agentic AI roadmap % (profile %, batches touched ~%)',
    v_user_id, 'saqiful@gmail.com', v_roadmap_id, v_profile_id, v_batches_linked;
END $$;

-- ============ VERIFICATION ============
-- SELECT u.id, u.email, u.role, u.first_name, u.last_name,
--        mp.organization, mp.designation, mp.expertise_areas, mp.bio
-- FROM public.users u
-- LEFT JOIN public.mentor_profiles mp ON mp.user_id = u.id
-- WHERE lower(u.email) = lower('saqiful@gmail.com');

-- SELECT b.id AS batch_id, b.name, b.status, r.title AS roadmap, bm.mentor_id
-- FROM public.batch_mentors bm
-- JOIN public.batches b ON b.id = bm.batch_id
-- JOIN public.roadmaps r ON r.id = b.roadmap_id
-- JOIN public.users u ON u.id = bm.mentor_id
-- WHERE lower(u.email) = lower('saqiful@gmail.com')
--   AND r.title = 'Become a Manager of AI Agents';
