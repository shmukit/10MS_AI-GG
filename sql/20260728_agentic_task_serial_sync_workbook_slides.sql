-- Forward-fix: align roadmap week copy + task sort_order with curriculum / slides / workbook.
-- Source of truth: docs/PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md
-- Session 1 serial: 1.1 → 1.2 → 1.3 → 1.4 lock → 1.5 tools → 1.6 memory
--
-- Run AFTER (if not already applied):
--   sql/20260725_agentic_add_task_0_0_what_is_ai.sql
--   sql/20260725_agentic_session1_lock_before_tools.sql
-- Idempotent. Do not edit prior SQL files.

DO $body$
DECLARE
  v_roadmap_id UUID;
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 0: Housekeeping + Opening',
    description = '0.0 What is AI → 0.1 open tools → 0.2 Teacher → 0.3 day contract → 0.4 chat vs assistant vs agent.',
    domain = 'Opening'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 0;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 1: Work WITH AI',
    description = '1.1 EA brief → 1.2 three Work EA runs → 1.3 one coach loop → 1.4 lock process → 1.5 tools ≤3 → 1.6 memory.',
    domain = 'AI Collaboration'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 1;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 2: Work THROUGH AI',
    description = '2.0 ladder → 2.1 map → 2.2–2.3 ETCSLV → 2.4 decision tree → 2.5 workflow brain → 2.6 automation path.',
    domain = 'AI Workflows'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 2;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 3: Work BY AI',
    description = '3.0 manager framing → 3.1 workforce → 3.2 harness → 3.3 failure lab → 3.4 capstone → 3.5 demo → 3.6 30-day.',
    domain = 'AI Workforce Management'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 3;

  -- Stable sort_order from task number prefix (0.0…3.6)
  UPDATE public.roadmap_tasks t
  SET sort_order = x.sort_order
  FROM public.roadmap_weeks w
  JOIN (
    VALUES
      (0, '0.0', 0),
      (0, '0.1', 1),
      (0, '0.2', 2),
      (0, '0.3', 3),
      (0, '0.4', 4),
      (1, '1.1', 1),
      (1, '1.2', 2),
      (1, '1.3', 3),
      (1, '1.4', 4),
      (1, '1.5', 5),
      (1, '1.6', 6),
      (2, '2.0', 1),
      (2, '2.1', 2),
      (2, '2.2', 3),
      (2, '2.3', 4),
      (2, '2.4', 5),
      (2, '2.5', 6),
      (2, '2.6', 7),
      (3, '3.0', 1),
      (3, '3.1', 2),
      (3, '3.2', 3),
      (3, '3.3', 4),
      (3, '3.4', 5),
      (3, '3.5', 6),
      (3, '3.6', 7)
  ) AS x(week_number, prefix, sort_order)
    ON w.week_number = x.week_number
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE x.prefix || ' %';
END
$body$;

-- Verification:
-- SELECT w.week_number, t.sort_order, t.task_name
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
--   AND w.week_number BETWEEN 0 AND 3
-- ORDER BY w.week_number, t.sort_order;
-- Expect Session 1 names: …1.4 Lock… then 1.5 Tool… then 1.6 Memory…
-- If 1.4 is still "tools", also run sql/20260725_agentic_session1_lock_before_tools.sql
