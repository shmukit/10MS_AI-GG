-- Forward-fix: round odd task minutes to 5 / 10 / 15 / 20 / 30.
-- Updates estimated_hours + "(N min)" in task_name for Become a Manager of AI Agents.
-- Source of truth after this: docs/PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md
--
-- Run AFTER sql/20260728_rename_workshop_plain_language.sql (and prior curriculum chain).
-- Idempotent. Do not edit prior SQL files.

DO $body$
DECLARE
  v_roadmap_id UUID;
  r RECORD;
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      -- Session 0 (~35)
      (0, '0.0', 5),
      (0, '0.3', 10),
      -- Session 1 (~90)
      (1, '1.1', 5),
      (1, '1.2', 20),
      (1, '1.3', 15),
      (1, '1.4', 10),
      (1, '1.5', 30),
      -- Session 2 (~105)
      (2, '2.3', 10),
      (2, '2.5', 30),
      (2, '2.6', 30),
      -- Session 3 (~115)
      (3, '3.0', 5),
      (3, '3.3', 20),
      (3, '3.4', 30),
      (3, '3.5', 20),
      (3, '3.6', 10)
    ) AS x(week_number, prefix, minutes)
  LOOP
    UPDATE public.roadmap_tasks t
    SET
      estimated_hours = r.minutes,
      task_name = regexp_replace(
        t.task_name,
        '\(\s*\d+\s*min\s*\)',
        '(' || r.minutes || ' min)',
        'i'
      )
    FROM public.roadmap_weeks w
    WHERE t.week_id = w.id
      AND w.roadmap_id = v_roadmap_id
      AND w.week_number = r.week_number
      AND t.task_name LIKE r.prefix || ' %';
  END LOOP;

  -- Ensure already-nice times stay labeled (no-op if already matching)
  FOR r IN
    SELECT * FROM (VALUES
      (0, '0.1', 5),
      (0, '0.2', 10),
      (0, '0.4', 5),
      (1, '1.6', 10),
      (2, '2.0', 5),
      (2, '2.1', 10),
      (2, '2.2', 5),
      (2, '2.4', 15),
      (3, '3.1', 15),
      (3, '3.2', 15),
      (4, '4.1', 20),
      (4, '4.2', 15),
      (4, '4.3', 5)
    ) AS x(week_number, prefix, minutes)
  LOOP
    UPDATE public.roadmap_tasks t
    SET
      estimated_hours = r.minutes,
      task_name = CASE
        WHEN t.task_name ~* '\(\s*\d+\s*min\s*\)' THEN
          regexp_replace(
            t.task_name,
            '\(\s*\d+\s*min\s*\)',
            '(' || r.minutes || ' min)',
            'i'
          )
        ELSE t.task_name
      END
    FROM public.roadmap_weeks w
    WHERE t.week_id = w.id
      AND w.roadmap_id = v_roadmap_id
      AND w.week_number = r.week_number
      AND t.task_name LIKE r.prefix || ' %';
  END LOOP;
END
$body$;

-- Verification (expect only 5/10/15/20/30):
-- SELECT w.week_number, t.sort_order, t.task_name, t.estimated_hours AS minutes
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.sort_order;
--
-- SELECT DISTINCT t.estimated_hours
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY 1;
