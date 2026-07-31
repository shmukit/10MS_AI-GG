-- Forward-fix: clearer Pre/Post self-assessment copy for Agentic roadmap.
-- Run after 20260801_roadmap_quiz_attempts.sql has been executed.
-- Idempotent: only updates rows that still match the old default wording.

DO $$
DECLARE
  v_roadmap_id UUID;
  v_pre_deck UUID;
  v_post_deck UUID;
  v_old_labels TEXT[] := ARRAY[
    '1 — Not at all',
    '2',
    '3 — A little',
    '4',
    '5 — Yes, confidently'
  ];
  v_new_labels TEXT[] := ARRAY[
    '1 — Not at all',
    '2 — Slightly',
    '3 — Somewhat',
    '4 — Mostly',
    '5 — Yes, confidently'
  ];
  v_old_questions TEXT[] := ARRAY[
    'Say what AI is helpful for at work — and what it should NOT do alone',
    'Give AI clear instructions for a real task (what I want, in what form)',
    'Notice when an AI answer might be wrong or made up',
    'Decide when I must check before anything is sent or decided',
    'Pick a few simple tools for ONE office job (not every tool)',
    'Use AI on a task I do again and again (not only one-off chats)',
    'Tell AI what it must never do without asking me',
    'Treat AI like a junior helper I manage — not like magic'
  ];
  v_new_questions TEXT[] := ARRAY[
    'I can explain which tasks AI can help with at work — and which tasks still need a human',
    'I can write clear, simple instructions for AI so it gives me useful results',
    'I can spot when an AI answer looks wrong, fake, or unsafe',
    'I know when to double-check AI output before using it for decisions',
    'I can choose 1–2 simple AI tools that fit my daily work',
    'I can use AI to speed up tasks I do repeatedly, not just one-time questions',
    'I can set clear rules for what AI should never do without my approval',
    'I can manage AI like a helpful assistant, not like magic'
  ];
  i INT;
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE NOTICE 'Agentic roadmap not found — skip copy update.';
    RETURN;
  END IF;

  SELECT id INTO v_pre_deck
  FROM public.practice_decks
  WHERE roadmap_id = v_roadmap_id AND title = 'Pre-Workshop Self-Assessment'
  LIMIT 1;

  SELECT id INTO v_post_deck
  FROM public.practice_decks
  WHERE roadmap_id = v_roadmap_id AND title = 'Post-Workshop Self-Assessment'
  LIMIT 1;

  -- Update deck descriptions to sound friendlier.
  UPDATE public.practice_decks
  SET description = '8 quick confidence questions. No right answers.',
      updated_at = NOW()
  WHERE id IN (v_pre_deck, v_post_deck)
    AND description IN (
      '8 confidence items (Likert 1–5). Same as paper pre-assessment.',
      'Same 8 items as pre — circle how you feel now.'
    );

  -- Update cards only if they still carry the old default question text.
  -- practice_cards has no updated_at column, so we only patch `content`.
  FOR i IN 1..8 LOOP
    UPDATE public.practice_cards
    SET content = jsonb_build_object(
          'questionKind', 'likert',
          'question', v_new_questions[i],
          'options', to_jsonb(v_new_labels),
          'scaleMin', 1,
          'scaleMax', 5
        )
    WHERE deck_id IN (v_pre_deck, v_post_deck)
      AND card_type = 'quiz'
      AND content->>'question' = v_old_questions[i];
  END LOOP;

  -- Update quiz wrapper descriptions.
  UPDATE public.roadmap_quizzes
  SET description = 'Not a test. ~5 minutes. Pick what feels true for you.',
      updated_at = NOW()
  WHERE roadmap_id = v_roadmap_id
    AND title = 'Pre-Workshop Self-Assessment'
    AND description = 'Not a test. ~5 minutes. Circle how confident you feel today.';

  UPDATE public.roadmap_quizzes
  SET description = 'Same questions as before. Pick what feels true for you now.',
      updated_at = NOW()
  WHERE roadmap_id = v_roadmap_id
    AND title = 'Post-Workshop Self-Assessment'
    AND description = 'Same questions as this morning. Circle how you feel now.';

  RAISE NOTICE 'Agentic quiz copy updated (roadmap %).', v_roadmap_id;
END $$;

-- Verification
SELECT deck_id, content->>'question' AS question
FROM public.practice_cards
WHERE deck_id IN (
  SELECT id FROM public.practice_decks
  WHERE title IN ('Pre-Workshop Self-Assessment', 'Post-Workshop Self-Assessment')
)
ORDER BY deck_id, order_index;
