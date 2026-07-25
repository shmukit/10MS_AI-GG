-- Forward-fix: add Session 0 Task 0.0 — What is AI? / expect vs don't expect.
-- Run AFTER sql/20260725_agentic_curriculum_less_paste_v2.sql
-- (and ideally after sql/20260725_agentic_task_prompts_in_roadmap_fix.sql).
-- Idempotent. Do not edit prior SQL files.
--
-- Why: curriculum / slides / facilitator now open with shared AI literacy +
-- expectation-setting before housekeeping (0.1) and Teacher hire (0.2).
-- Session 4 task 4.3 remains an optional async video refresher only.

DO $body$
DECLARE
  v_roadmap_id UUID;
  v_week_id UUID;
  v_task_id UUID;
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  SELECT id INTO v_week_id
  FROM public.roadmap_weeks
  WHERE roadmap_id = v_roadmap_id AND week_number = 0
  LIMIT 1;

  IF v_week_id IS NULL THEN
    RAISE EXCEPTION 'Session 0 week not found for agentic roadmap.';
  END IF;

  UPDATE public.roadmap_weeks
  SET
    title = 'Session 0: Housekeeping + Opening',
    description = 'What is AI + expect/don’t. Open roadmap + Prompt Pack + AI tool. Hire Teacher. Day contract (same chat all day).',
    domain = 'Opening'
  WHERE id = v_week_id;

  -- Ensure Task 0.0 exists (match by number prefix)
  SELECT t.id INTO v_task_id
  FROM public.roadmap_tasks t
  WHERE t.week_id = v_week_id
    AND t.task_name LIKE '0.0 %'
  ORDER BY t.created_at ASC
  LIMIT 1;

  IF v_task_id IS NULL THEN
    INSERT INTO public.roadmap_tasks (
      week_id, task_name, task_details, task_type, relevant_links,
      estimated_hours, points, is_required, sort_order
    )
    VALUES (
      v_week_id,
      '0.0 What is AI? What to expect / not expect (6 min)',
      $d$WHERE: Agenda slide + paper/blank note (no AI yet)

Instructor covers: what AI is in this room, what to expect today, what not to expect.

YOU DO
1. Follow the Task 0.0 slide on the projector.
2. On paper or a blank note, write one line you WILL expect today and one line you will NOT expect.
3. Tap Mark complete.

Remember:
• AI here = pattern-based software that drafts, summarizes, classifies, suggests — not magic or guaranteed truth.
• Expect: one running workflow + practice managing AI (brief → check → limit → validate).
• Don’t expect: learning to code, mastering every vendor, or a perfect autonomous agent with zero human.

(Optional later refresher: Session 4 task 4.3 video — not required now.)$d$,
      'attend',
      NULL,
      6,
      5,
      true,
      0
    )
    RETURNING id INTO v_task_id;
  ELSE
    UPDATE public.roadmap_tasks
    SET
      task_name = '0.0 What is AI? What to expect / not expect (6 min)',
      task_details = $d$WHERE: Agenda slide + paper/blank note (no AI yet)

Instructor covers: what AI is in this room, what to expect today, what not to expect.

YOU DO
1. Follow the Task 0.0 slide on the projector.
2. On paper or a blank note, write one line you WILL expect today and one line you will NOT expect.
3. Tap Mark complete.

Remember:
• AI here = pattern-based software that drafts, summarizes, classifies, suggests — not magic or guaranteed truth.
• Expect: one running workflow + practice managing AI (brief → check → limit → validate).
• Don’t expect: learning to code, mastering every vendor, or a perfect autonomous agent with zero human.

(Optional later refresher: Session 4 task 4.3 video — not required now.)$d$,
      task_type = 'attend',
      relevant_links = NULL,
      estimated_hours = 6,
      points = 5,
      is_required = true,
      sort_order = 0
    WHERE id = v_task_id;
  END IF;

  -- Keep Session 0 order: 0.0, 0.1, 0.2, 0.3, 0.4
  UPDATE public.roadmap_tasks t
  SET sort_order = CASE
    WHEN t.task_name LIKE '0.0 %' THEN 0
    WHEN t.task_name LIKE '0.1 %' THEN 1
    WHEN t.task_name LIKE '0.2 %' THEN 2
    WHEN t.task_name LIKE '0.3 %' THEN 3
    WHEN t.task_name LIKE '0.4 %' THEN 4
    ELSE t.sort_order
  END
  WHERE t.week_id = v_week_id
    AND t.task_name ~ '^0\.[0-4] ';

  RAISE NOTICE 'Added/updated Task 0.0 What is AI / expect (id=%)', v_task_id;
END
$body$;

-- ============ VERIFICATION ============
-- SELECT t.sort_order, t.task_name, t.estimated_hours AS minutes, t.task_type
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents' AND w.week_number = 0
-- ORDER BY t.sort_order;
-- Expect: 0.0, 0.1, 0.2, 0.3, 0.4
