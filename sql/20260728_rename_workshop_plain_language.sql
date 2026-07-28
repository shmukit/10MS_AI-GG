-- Forward-fix: plain-language rename for workshop niche jargon on live roadmap.
-- Renames (participant-facing):
--   day contract     → kickoff chat
--   coach loop       → feedback round
--   Work EA          → Work Assistant
-- (human stamp / counter / floor plan / share-out are workbook/docs only)
--
-- Run AFTER sql/20260728_agentic_task_serial_sync_workbook_slides.sql
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

  -- Session blurbs
  UPDATE public.roadmap_weeks w SET
    description = '0.0 What is AI → 0.1 open tools → 0.2 Teacher → 0.3 kickoff chat → 0.4 chat vs assistant vs agent.'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 0;

  UPDATE public.roadmap_weeks w SET
    description = '1.1 Work Assistant brief → 1.2 three runs → 1.3 one feedback round → 1.4 lock process → 1.5 tools ≤3 → 1.6 memory.'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 1;

  -- Task 0.3 title
  UPDATE public.roadmap_tasks t
  SET task_name = regexp_replace(
        t.task_name,
        'Day contract',
        'Kickoff chat',
        'gi'
      )
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND w.week_number = 0
    AND t.task_name ILIKE '%0.3%'
    AND t.task_name ILIKE '%contract%';

  UPDATE public.roadmap_tasks t
  SET task_details = replace(replace(t.task_details, 'Day contract', 'Kickoff chat'), 'day contract', 'kickoff chat')
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND (
      t.task_details ILIKE '%day contract%'
      OR t.task_details ILIKE '%Day contract%'
    );

  -- Task 1.1–1.3 titles: Work EA → Work Assistant; coach loop → feedback round
  UPDATE public.roadmap_tasks t
  SET task_name = replace(replace(replace(replace(
        t.task_name,
        'Work EA', 'Work Assistant'),
        'EA brief', 'Work Assistant brief'),
        'coach loop', 'feedback round'),
        'Coach loop', 'Feedback round')
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND w.week_number = 1
    AND (
      t.task_name ILIKE '%Work EA%'
      OR t.task_name ILIKE '%EA brief%'
      OR t.task_name ILIKE '%coach loop%'
    );

  UPDATE public.roadmap_tasks t
  SET task_details = replace(replace(replace(replace(replace(replace(
        t.task_details,
        'Work EA', 'Work Assistant'),
        'My Work EA', 'My Work Assistant'),
        'Teacher ↔ Work EA', 'Teacher ↔ Work Assistant'),
        'Teacher ↔ EA', 'Teacher ↔ Work Assistant'),
        'coach loop', 'feedback round'),
        'I hired a Work EA', 'I hired a Work Assistant')
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND (
      t.task_details ILIKE '%Work EA%'
      OR t.task_details ILIKE '%coach loop%'
      OR t.task_details ILIKE '%Teacher ↔ EA%'
    );

  -- Any remaining Work EA / day contract / coach loop in this roadmap’s task fields
  UPDATE public.roadmap_tasks t
  SET
    task_name = replace(replace(replace(t.task_name, 'Work EA', 'Work Assistant'), 'day contract', 'kickoff chat'), 'Day contract', 'Kickoff chat'),
    task_details = replace(replace(replace(replace(
      t.task_details,
      'Work EA', 'Work Assistant'),
      'day contract', 'kickoff chat'),
      'Day contract', 'Kickoff chat'),
      'coach loop', 'feedback round')
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND (
      t.task_name ILIKE '%Work EA%'
      OR t.task_name ILIKE '%day contract%'
      OR t.task_details ILIKE '%Work EA%'
      OR t.task_details ILIKE '%day contract%'
      OR t.task_details ILIKE '%coach loop%'
    );
END
$body$;

-- Verification:
-- SELECT w.week_number, t.sort_order, t.task_name
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
--   AND (t.task_name ILIKE '%EA%' OR t.task_name ILIKE '%contract%' OR t.task_name ILIKE '%coach%')
-- ORDER BY w.week_number, t.sort_order;
