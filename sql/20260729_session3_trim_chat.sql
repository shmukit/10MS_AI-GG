-- Forward-fix: trim forced Teacher-chat in Session 3 for executive audience.
-- Run AFTER sql/20260729_session2_trim_chat_add_prioritization.sql (or prior chain).
-- Idempotent. Do NOT edit prior SQL files.

DO $body$
DECLARE
  v_roadmap_id UUID;
BEGIN
  SELECT id INTO v_roadmap_id FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents' LIMIT 1;
  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  -- 3.0: instructor framing only — no Copy box
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Shift mindset from “better prompts” to “managing AI work.”

Steps
1. Listen to the instructor (projector).
2. Note one line: what “manager of agents” means for your locked process.
3. No Teacher chat required for this step.
4. Mark complete.

Keep in mind
• You manage roles + rules + evaluation; AI does the drafting.
• Harness = same ETCSLV checklist, named for shipping.$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.0 %';

  -- 3.2: Worksheet E (Harness Card) on paper; optional L/V critique in Teacher
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Finish Limits and Validation for shipping (Harness Card).

Steps
1. Fill Worksheet E (Harness Card) in your workbook — all fields, especially L and V.
2. Harness = same ETCSLV, shipping name. No letter-by-letter chat required.
3. Optional if time: paste only your L and V into Teacher, then copy the box below.
4. Mark complete when L and V are clear enough to demo.

——— COPY BELOW ———
Critique my Harness Limits and Validation above.
Make them specific and testable for Monday morning.
Rewrite only weak lines.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.2 %';

  -- 3.6: paper seed plan + R7; optional Teacher polish
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Leave with a short 30-day habit plan.

Steps
1. Fill the seed plan in your workbook (Worksheet I) and the full calendar on Reference R7.
2. Circle the Week 1 action you will actually do.
3. Optional if time: copy the box into Teacher for a short polish pass.
4. Mark complete.

——— COPY BELOW ———
Based on everything today, give me a short 30-day plan (under 120 words):
Week 1: one Monday run ritual for my shipped workflow
Week 2: improve Validation once
Week 3: optional cheaper model on an easy step OR leave as-is
Week 4: 15-minute harness review with myself or a teammate
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.6 %';

  RAISE NOTICE 'Session 3 friction trim applied for roadmap %', v_roadmap_id;
END;
$body$;

-- Verification (run manually):
-- SELECT t.task_name, LEFT(t.task_details, 140) AS preview
-- FROM public.roadmap_tasks t
-- JOIN public.roadmap_weeks w ON t.week_id = w.id
-- JOIN public.roadmaps r ON w.roadmap_id = r.id
-- WHERE r.title = 'Become a Manager of AI Agents'
--   AND (t.task_name LIKE '3.0 %' OR t.task_name LIKE '3.2 %' OR t.task_name LIKE '3.6 %')
-- ORDER BY t.task_name;
