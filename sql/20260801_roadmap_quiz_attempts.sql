-- Roadmap graded quizzes: multi-type questions (Likert, binary, categorical, MCQ).
-- Reuses practice_decks / practice_cards (card_type = quiz).
-- Run in Supabase SQL Editor. Idempotent.

-- ============ TABLES ============

CREATE TABLE IF NOT EXISTS public.roadmap_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  practice_deck_id UUID NOT NULL REFERENCES public.practice_decks(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.roadmap_tasks(id) ON DELETE SET NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  negative_marking_enabled BOOLEAN NOT NULL DEFAULT false,
  negative_mark_value NUMERIC(3,2) NULL,
  default_question_kind TEXT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT roadmap_quizzes_negative_mark_value_check
    CHECK (
      negative_mark_value IS NULL
      OR negative_mark_value IN (0.25, 0.5, 1.0)
    )
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  roadmap_quiz_id UUID NOT NULL REFERENCES public.roadmap_quizzes(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  score NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  negative_marking_enabled BOOLEAN NOT NULL DEFAULT false,
  negative_mark_value NUMERIC(3,2) NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.practice_cards(id) ON DELETE CASCADE,
  selected_option INT NULL,
  selected_options INT[] NULL,
  is_correct BOOLEAN NULL,
  points NUMERIC(6,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT quiz_attempt_answers_unique UNIQUE (attempt_id, card_id)
);

ALTER TABLE public.roadmap_tasks
  ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES public.roadmap_quizzes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_roadmap_quizzes_roadmap ON public.roadmap_quizzes(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_quizzes_task ON public.roadmap_quizzes(task_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_quiz ON public.quiz_attempts(student_id, roadmap_quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_batch ON public.quiz_attempts(roadmap_quiz_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt ON public.quiz_attempt_answers(attempt_id);

-- ============ RLS ============

ALTER TABLE public.roadmap_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempt_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Roadmap quizzes viewable by enrolled" ON public.roadmap_quizzes;
CREATE POLICY "Roadmap quizzes viewable by enrolled"
  ON public.roadmap_quizzes FOR SELECT TO authenticated
  USING (
    public.is_admin_or_mentor()
    OR EXISTS (
      SELECT 1 FROM public.student_batch_assignments sba
      JOIN public.batches b ON b.id = sba.batch_id
      WHERE sba.student_id = auth.uid()
        AND sba.status = 'active'
        AND b.roadmap_id = roadmap_quizzes.roadmap_id
    )
  );

DROP POLICY IF EXISTS "Roadmap quizzes manageable by staff" ON public.roadmap_quizzes;
CREATE POLICY "Roadmap quizzes manageable by staff"
  ON public.roadmap_quizzes FOR ALL TO authenticated
  USING (public.is_admin_or_mentor())
  WITH CHECK (public.is_admin_or_mentor());

DROP POLICY IF EXISTS "Quiz attempts viewable by owner or staff" ON public.quiz_attempts;
CREATE POLICY "Quiz attempts viewable by owner or staff"
  ON public.quiz_attempts FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin_or_mentor()
  );

DROP POLICY IF EXISTS "Quiz attempts insertable by owner" ON public.quiz_attempts;
CREATE POLICY "Quiz attempts insertable by owner"
  ON public.quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Quiz attempts updatable by owner" ON public.quiz_attempts;
CREATE POLICY "Quiz attempts updatable by owner"
  ON public.quiz_attempts FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Quiz answers viewable by owner or staff" ON public.quiz_attempt_answers;
CREATE POLICY "Quiz answers viewable by owner or staff"
  ON public.quiz_attempt_answers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND (qa.student_id = auth.uid() OR public.is_admin_or_mentor())
    )
  );

DROP POLICY IF EXISTS "Quiz answers insertable by owner" ON public.quiz_attempt_answers;
CREATE POLICY "Quiz answers insertable by owner"
  ON public.quiz_attempt_answers FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.student_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Quiz answers updatable by owner" ON public.quiz_attempt_answers;
CREATE POLICY "Quiz answers updatable by owner"
  ON public.quiz_attempt_answers FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.student_id = auth.uid()
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.roadmap_quizzes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.quiz_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.quiz_attempt_answers TO authenticated;

-- ============ SEED: Agentic Pre/Post Likert (8 items each) ============

DO $$
DECLARE
  v_roadmap_id UUID;
  v_week0 UUID;
  v_week3 UUID;
  v_pre_deck UUID;
  v_post_deck UUID;
  v_pre_quiz UUID;
  v_post_quiz UUID;
  v_pre_task UUID;
  v_post_task UUID;
  v_mentor UUID;
  v_labels TEXT[] := ARRAY[
    '1 — Not at all',
    '2',
    '3 — A little',
    '4',
    '5 — Yes, confidently'
  ];
  v_questions TEXT[] := ARRAY[
    'Say what AI is helpful for at work — and what it should NOT do alone',
    'Give AI clear instructions for a real task (what I want, in what form)',
    'Notice when an AI answer might be wrong or made up',
    'Decide when I must check before anything is sent or decided',
    'Pick a few simple tools for ONE office job (not every tool)',
    'Use AI on a task I do again and again (not only one-off chats)',
    'Tell AI what it must never do without asking me',
    'Treat AI like a junior helper I manage — not like magic'
  ];
  i INT;
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE NOTICE 'Agentic roadmap not found — skip quiz seed.';
    RETURN;
  END IF;

  SELECT id INTO v_week0
  FROM public.roadmap_weeks
  WHERE roadmap_id = v_roadmap_id AND week_number = 0
  LIMIT 1;

  SELECT id INTO v_week3
  FROM public.roadmap_weeks
  WHERE roadmap_id = v_roadmap_id AND week_number = 3
  LIMIT 1;

  SELECT id INTO v_mentor
  FROM public.users
  WHERE role IN ('mentor', 'admin') AND is_active IS DISTINCT FROM false
  ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END
  LIMIT 1;

  -- Pre deck
  SELECT id INTO v_pre_deck
  FROM public.practice_decks
  WHERE roadmap_id = v_roadmap_id AND title = 'Pre-Workshop Self-Assessment'
  LIMIT 1;

  IF v_pre_deck IS NULL THEN
    INSERT INTO public.practice_decks (title, description, roadmap_id, created_by, is_public)
    VALUES (
      'Pre-Workshop Self-Assessment',
      '8 confidence items (Likert 1–5). Same as paper pre-assessment.',
      v_roadmap_id,
      v_mentor,
      true
    )
    RETURNING id INTO v_pre_deck;
  END IF;

  IF v_pre_deck IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.practice_cards WHERE deck_id = v_pre_deck LIMIT 1
  ) THEN
    FOR i IN 1..8 LOOP
      INSERT INTO public.practice_cards (deck_id, card_type, content, order_index)
      VALUES (
        v_pre_deck,
        'quiz',
        jsonb_build_object(
          'questionKind', 'likert',
          'question', v_questions[i],
          'options', to_jsonb(v_labels),
          'scaleMin', 1,
          'scaleMax', 5
        ),
        i - 1
      );
    END LOOP;
  END IF;

  -- Post deck
  SELECT id INTO v_post_deck
  FROM public.practice_decks
  WHERE roadmap_id = v_roadmap_id AND title = 'Post-Workshop Self-Assessment'
  LIMIT 1;

  IF v_post_deck IS NULL THEN
    INSERT INTO public.practice_decks (title, description, roadmap_id, created_by, is_public)
    VALUES (
      'Post-Workshop Self-Assessment',
      'Same 8 items as pre — circle how you feel now.',
      v_roadmap_id,
      v_mentor,
      true
    )
    RETURNING id INTO v_post_deck;
  END IF;

  IF v_post_deck IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.practice_cards WHERE deck_id = v_post_deck LIMIT 1
  ) THEN
    FOR i IN 1..8 LOOP
      INSERT INTO public.practice_cards (deck_id, card_type, content, order_index)
      VALUES (
        v_post_deck,
        'quiz',
        jsonb_build_object(
          'questionKind', 'likert',
          'question', v_questions[i],
          'options', to_jsonb(v_labels),
          'scaleMin', 1,
          'scaleMax', 5
        ),
        i - 1
      );
    END LOOP;
  END IF;

  -- Pre quiz wrapper
  SELECT id INTO v_pre_quiz
  FROM public.roadmap_quizzes
  WHERE roadmap_id = v_roadmap_id AND title = 'Pre-Workshop Self-Assessment'
  LIMIT 1;

  IF v_pre_quiz IS NULL THEN
    INSERT INTO public.roadmap_quizzes (
      roadmap_id, practice_deck_id, title, description,
      negative_marking_enabled, default_question_kind, created_by, is_active
    )
    VALUES (
      v_roadmap_id, v_pre_deck,
      'Pre-Workshop Self-Assessment',
      'Not a test. ~5 minutes. Circle how confident you feel today.',
      false, 'likert', v_mentor, true
    )
    RETURNING id INTO v_pre_quiz;
  ELSE
    UPDATE public.roadmap_quizzes
    SET practice_deck_id = v_pre_deck, is_active = true, updated_at = NOW()
    WHERE id = v_pre_quiz;
  END IF;

  -- Post quiz wrapper
  SELECT id INTO v_post_quiz
  FROM public.roadmap_quizzes
  WHERE roadmap_id = v_roadmap_id AND title = 'Post-Workshop Self-Assessment'
  LIMIT 1;

  IF v_post_quiz IS NULL THEN
    INSERT INTO public.roadmap_quizzes (
      roadmap_id, practice_deck_id, title, description,
      negative_marking_enabled, default_question_kind, created_by, is_active
    )
    VALUES (
      v_roadmap_id, v_post_deck,
      'Post-Workshop Self-Assessment',
      'Same questions as this morning. Circle how you feel now.',
      false, 'likert', v_mentor, true
    )
    RETURNING id INTO v_post_quiz;
  ELSE
    UPDATE public.roadmap_quizzes
    SET practice_deck_id = v_post_deck, is_active = true, updated_at = NOW()
    WHERE id = v_post_quiz;
  END IF;

  -- Pre task (Session 0, before 0.0)
  IF v_week0 IS NOT NULL THEN
    SELECT t.id INTO v_pre_task
    FROM public.roadmap_tasks t
    WHERE t.week_id = v_week0 AND t.task_name LIKE '0.0a %'
    LIMIT 1;

    IF v_pre_task IS NULL THEN
      INSERT INTO public.roadmap_tasks (
        week_id, task_name, task_details, task_type,
        estimated_hours, points, is_required, sort_order, quiz_id
      )
      VALUES (
        v_week0,
        '0.0a Pre-Workshop self-assessment (5 min)',
        $d$**Goal:** Baseline confidence before we start.

**Steps:**
1. Tap **Start quiz** below.
2. Answer all 8 items (1 = Not at all → 5 = Yes, confidently).
3. Submit — your score is saved (max 40).

*Same items as the paper sheet if you prefer paper.*$d$,
        'mcq',
        0.08,
        5,
        true,
        -1,
        v_pre_quiz
      )
      RETURNING id INTO v_pre_task;
    ELSE
      UPDATE public.roadmap_tasks
      SET quiz_id = v_pre_quiz, task_type = 'mcq', is_required = true
      WHERE id = v_pre_task;
    END IF;

    UPDATE public.roadmap_quizzes SET task_id = v_pre_task WHERE id = v_pre_quiz;
  END IF;

  -- Post task (Session 3, after 3.6)
  IF v_week3 IS NOT NULL THEN
    SELECT t.id INTO v_post_task
    FROM public.roadmap_tasks t
    WHERE t.week_id = v_week3 AND t.task_name LIKE '3.7 %'
    LIMIT 1;

    IF v_post_task IS NULL THEN
      INSERT INTO public.roadmap_tasks (
        week_id, task_name, task_details, task_type,
        estimated_hours, points, is_required, sort_order, quiz_id
      )
      VALUES (
        v_week3,
        '3.7 Post-Workshop self-assessment (5 min)',
        $d$**Goal:** Measure growth vs this morning.

**Steps:**
1. Tap **Start quiz**.
2. Same 8 confidence items — answer for how you feel **now**.
3. Compare your total to your pre score if you remember it.

**One thing I will try at work next week:** note it on paper or in your 30-day plan (3.6).$d$,
        'mcq',
        0.08,
        5,
        true,
        8,
        v_post_quiz
      )
      RETURNING id INTO v_post_task;
    ELSE
      UPDATE public.roadmap_tasks
      SET quiz_id = v_post_quiz, task_type = 'mcq', is_required = true
      WHERE id = v_post_task;
    END IF;

    UPDATE public.roadmap_quizzes SET task_id = v_post_task WHERE id = v_post_quiz;
  END IF;

  RAISE NOTICE 'Agentic quiz seed: pre_quiz=% post_quiz=%', v_pre_quiz, v_post_quiz;
END $$;

-- Verification:
-- SELECT t.task_name, t.quiz_id, rq.title, pd.title AS deck
-- FROM roadmap_tasks t
-- JOIN roadmap_quizzes rq ON rq.id = t.quiz_id
-- JOIN practice_decks pd ON pd.id = rq.practice_deck_id
-- WHERE t.task_name LIKE '0.0a %' OR t.task_name LIKE '3.7 %';
