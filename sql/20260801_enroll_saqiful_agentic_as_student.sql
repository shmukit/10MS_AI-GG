-- Enroll saqiful@gmail.com as a *learner* on "Become a Manager of AI Agents"
-- without demoting mentor role.
--
-- Why: mentors can open /student/* (roleAccess always includes student), but
-- roadmap content requires an active student_batch_assignments row.
-- Keep users.role = 'mentor' + batch_mentors; only add enrollment.
--
-- Idempotent. Prerequisite: account exists (see 20260723_add_saqiful_agentic_roadmap_mentor.sql).

DO $$
DECLARE
  v_user_id UUID;
  v_roadmap_id UUID;
  v_batch_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM public.users
  WHERE lower(email) = lower('saqiful@gmail.com')
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'No user found for saqiful@gmail.com. Create the account / run mentor script first.';
  END IF;

  -- Do NOT set role = student. Mentor stays mentor.
  UPDATE public.users
  SET is_active = true, updated_at = NOW()
  WHERE id = v_user_id;

  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  SELECT b.id INTO v_batch_id
  FROM public.batches b
  WHERE b.roadmap_id = v_roadmap_id
    AND b.status = 'active'
  ORDER BY b.created_at DESC
  LIMIT 1;

  IF v_batch_id IS NULL THEN
    RAISE EXCEPTION
      'No active workshop batch. Run bulk enroll or create a cohort first.';
  END IF;

  -- Profile optional (no batch_id column on student_profiles).
  IF NOT EXISTS (
    SELECT 1 FROM public.student_profiles WHERE user_id = v_user_id
  ) THEN
    INSERT INTO public.student_profiles (
      user_id, institute, year, subject, degree,
      completed_weeks, progress_percentage, enrollment_date
    ) VALUES (
      v_user_id,
      'ACI AI Labs',
      '2026',
      'Workshop facilitator / mentor-learner',
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

  UPDATE public.batches
  SET current_students = (
    SELECT COUNT(*)::integer
    FROM public.student_batch_assignments sba
    WHERE sba.batch_id = v_batch_id AND sba.status = 'active'
  ),
  updated_at = NOW()
  WHERE id = v_batch_id;

  RAISE NOTICE
    'Enrolled mentor-learner % on batch % (role unchanged). URL: /student/roadmap/become_a_manager_of_ai_agents?batch_id=%',
    'saqiful@gmail.com', v_batch_id, v_batch_id;
END $$;

-- Verification:
-- SELECT u.email, u.role, sba.status, b.id AS batch_id, b.name, r.title
-- FROM public.users u
-- JOIN public.student_batch_assignments sba ON sba.student_id = u.id
-- JOIN public.batches b ON b.id = sba.batch_id
-- JOIN public.roadmaps r ON r.id = b.roadmap_id
-- WHERE lower(u.email) = lower('saqiful@gmail.com')
--   AND r.title = 'Become a Manager of AI Agents';
--
-- He should still show role = mentor, plus an active assignment.
-- In the app: open Student Dashboard (or switch to Student), then the roadmap.
