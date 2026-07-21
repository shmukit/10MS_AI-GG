-- Enroll mukit@10minuteschool.com on "Become a Manager of AI Agents".
-- Prerequisite: workshop roadmap seed + resource catalog migrations already run.
-- Idempotent: safe to re-run.

DO $$
DECLARE
  v_user_id UUID;
  v_roadmap_id UUID;
  v_batch_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM public.users
  WHERE lower(email) = lower('mukit@10minuteschool.com')
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found for mukit@10minuteschool.com. Sign in once so auth.users / users row exists.';
  END IF;

  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found. Run sql/20260721_become_manager_of_ai_agents_roadmap_rerun.sql first.';
  END IF;

  -- Reuse an active batch for this roadmap, or create one.
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

  INSERT INTO public.student_batch_assignments (
    student_id,
    batch_id,
    status,
    enrollment_date,
    progress_percentage,
    completed_weeks
  )
  VALUES (
    v_user_id,
    v_batch_id,
    'active',
    CURRENT_DATE,
    0,
    0
  )
  ON CONFLICT (student_id, batch_id) DO UPDATE
  SET
    status = 'active',
    enrollment_date = EXCLUDED.enrollment_date,
    updated_at = NOW();

  -- Enable all catalog slide decks for this cohort (if catalog exists).
  INSERT INTO public.batch_slide_decks (batch_id, slide_deck_id, is_enabled)
  SELECT v_batch_id, sd.id, true
  FROM public.roadmap_slide_decks sd
  WHERE sd.roadmap_id = v_roadmap_id
    AND sd.is_active = true
  ON CONFLICT (batch_id, slide_deck_id) DO UPDATE
  SET is_enabled = true, updated_at = NOW();

  -- Enable decision tree for this cohort (if catalog exists).
  INSERT INTO public.batch_decision_trees (batch_id, decision_tree_id, is_enabled)
  SELECT v_batch_id, dt.id, true
  FROM public.roadmap_decision_trees dt
  WHERE dt.roadmap_id = v_roadmap_id
    AND dt.is_active = true
  ON CONFLICT (batch_id, decision_tree_id) DO UPDATE
  SET is_enabled = true, updated_at = NOW();

  UPDATE public.batches
  SET current_students = (
    SELECT COUNT(*)::INTEGER
    FROM public.student_batch_assignments sba
    WHERE sba.batch_id = v_batch_id
      AND sba.status = 'active'
  ),
  updated_at = NOW()
  WHERE id = v_batch_id;

  RAISE NOTICE 'Enrolled user % on batch % for roadmap %',
    v_user_id, v_batch_id, v_roadmap_id;
END $$;

-- ============ VERIFICATION ============
-- SELECT u.email, b.name AS batch_name, b.id AS batch_id, sba.status, r.title AS roadmap
-- FROM public.users u
-- JOIN public.student_batch_assignments sba ON sba.student_id = u.id
-- JOIN public.batches b ON b.id = sba.batch_id
-- JOIN public.roadmaps r ON r.id = b.roadmap_id
-- WHERE lower(u.email) = lower('mukit@10minuteschool.com')
--   AND r.title = 'Become a Manager of AI Agents';

-- Student URL (replace {batch_id} with batch_id from query above):
-- /student/roadmap/become_a_manager_of_ai_agents?batch_id={batch_id}
