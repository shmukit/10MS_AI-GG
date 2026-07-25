-- Forward-fix: less-paste curriculum (Session 1 = 1.1–1.6; no Working Pack).
-- Pedagogy: docs/PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md + PROMPT_PACK.md
-- Fixes chaos from Teacher↔EA hopping and multi-paste prompts.
-- Idempotent. Run AFTER sql/20260725_agentic_curriculum_sync_sessions_0_to_4.sql
--   (or any prior seed that created Sessions 0–4).
-- Do NOT edit prior SQL files.

ALTER TABLE public.roadmap_tasks
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Ensure sessions 0–4 exist and titles match
DO $weeks$
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

  UPDATE public.roadmaps
  SET
    description = $$Single-day workshop. Few surfaces. Same Teacher chat all day. Session 1 = hire EA + one coach loop. No Working Pack slides.$$,
    total_weeks = 5,
    node_unit_label = $$Session$$,
    decision_tree_enabled = true,
    updated_at = NOW()
  WHERE id = v_roadmap_id;

  -- Session 0
  INSERT INTO public.roadmap_weeks (roadmap_id, week_number, title, description, domain)
  SELECT v_roadmap_id, 0,
    'Session 0: Housekeeping + Opening',
    'Open roadmap + Prompt Pack + AI tool. Hire Teacher. Day contract (same chat all day).',
    'Opening'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.roadmap_weeks w
    WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 0
  );

  UPDATE public.roadmap_weeks w SET
    title = 'Session 0: Housekeeping + Opening',
    description = 'Open roadmap + Prompt Pack + AI tool. Hire Teacher. Day contract (same chat all day).',
    domain = 'Opening'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 0;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 1: Work WITH AI',
    description = 'Fill EA brief → 3 Work EA runs → one Teacher coach loop → tools ≤3 → memory → lock process.',
    domain = 'AI Collaboration'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 1;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 2: Work THROUGH AI',
    description = 'Map + ETCSLV in same Teacher thread. Decision tree. Workflow brain. Running automation path.',
    domain = 'AI Workflows'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 2;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 3: Work BY AI',
    description = 'Workforce + harness in chat. Failure lab. Ship. Demo Day. Short 30-day plan.',
    domain = 'AI Workforce Management'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 3;

  UPDATE public.roadmap_weeks w SET
    title = 'Session 4: Reference — Go deeper (optional)',
    description = 'Optional after the workshop. Short reads/videos for beginners.',
    domain = 'Optional Deep Dive'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 4;

  INSERT INTO public.roadmap_weeks (roadmap_id, week_number, title, description, domain)
  SELECT v_roadmap_id, 4,
    'Session 4: Reference — Go deeper (optional)',
    'Optional after the workshop. Short reads/videos for beginners.',
    'Optional Deep Dive'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.roadmap_weeks w
    WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 4
  );
END
$weeks$;

-- Upsert all tasks; delete orphans (e.g. old 1.7 / 1.8)
DO $body$
DECLARE
  v_roadmap_id UUID;
  r RECORD;
  v_week_id UUID;
  v_task_id UUID;
  v_kept UUID[] := ARRAY[]::UUID[];
  v_doc TEXT := 'https://docs.google.com/document/d/1IMp7qGHfRjJu7sgezWDJhQqpen7lPH3Uvd65_cYKxn4/edit?tab=t.0';
BEGIN
  SELECT id INTO v_roadmap_id
  FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents'
  LIMIT 1;

  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  FOR r IN
    SELECT *
    FROM (
      VALUES
        -- Session 0
        (0, 1, $t$0.1 Housekeeping: open roadmap + Prompt Pack + AI tool (5 min)$t$,
         $t$Open roadmap, Prompt Pack tab, and ChatGPT/Claude. Optional paper/blank note for thinking. No Working Pack slides.$t$,
         'attend', 5, 5, true, v_doc, $t$0.1$t$, $t$Housekeeping$t$),
        (0, 2, $t$0.2 Hands-on: Create Teacher Agent + paste instructions (10 min)$t$,
         $t$Create Project “Workshop Teacher — Agentic AI”. Paste system instructions into Settings once. Prompt Pack 0.2.$t$,
         'project', 10, 10, true, v_doc, $t$0.2$t$, $t$Teacher Agent$t$),
        (0, 3, $t$0.3 Hands-on: Day contract with Teacher (7 min)$t$,
         $t$Start the Teacher chat you will reuse all day. Prompt Pack 0.3. Answer clarifying questions in the same thread.$t$,
         'project', 7, 10, true, v_doc, $t$0.3$t$, $t$Day contract$t$),
        (0, 4, $t$0.4 Chat vs assistant vs agent (5 min)$t$,
         $t$Same Teacher chat. Prompt Pack 0.4. Review one sentence you will remember.$t$,
         'attend', 5, 5, true, v_doc, $t$0.4$t$, $t$Chat vs assistant$t$),

        -- Session 1 (simplified)
        (1, 1, $t$1.1 Written: Fill your Work EA brief (6 min)$t$,
         $t$Think first on paper or a blank note. Complete role, priorities, never-invent, approvals. Do not use Teacher yet. Prompt Pack 1.1.$t$,
         'written', 6, 5, true, v_doc, $t$1.1$t$, $t$EA brief$t$),
        (1, 2, $t$1.2 Hands-on: Create Work EA + three real runs (22 min)$t$,
         $t$New Project → paste brief into Settings once. Stay in Work EA chat for triage + draft + invent-trap. Prompt Pack 1.2.$t$,
         'project', 22, 15, true, v_doc, $t$1.2$t$, $t$Work EA$t$),
        (1, 3, $t$1.3 Hands-on: One coach loop (Teacher critiques once) (16 min)$t$,
         $t$ONE Teacher↔EA switch: paste brief + one weak prompt + one reply. Improve Settings once. Re-run one task. Prompt Pack 1.3.$t$,
         'project', 16, 15, true, v_doc, $t$1.3$t$, $t$coach loop$t$),
        (1, 4, $t$1.4 Hands-on: Tool landscape + fit (max 2–3) (25 min)$t$,
         $t$After landscape tour: Teacher Prompt Pack 1.4. Try at most 2–3 tools. Lock stack. No fourth tool.$t$,
         'project', 25, 15, true, 'https://chat.openai.com', $t$1.4$t$, $t$Tool landscape$t$),
        (1, 5, $t$1.5 Hands-on: Memory — docs + grounded questions (10 min)$t$,
         $t$Upload 1–2 docs. Two grounded questions + one trap. Review refuse vs invent. Prompt Pack 1.5.$t$,
         'project', 10, 10, true, 'https://notebooklm.google.com', $t$1.5$t$, $t$Memory$t$),
        (1, 6, $t$1.6 Hands-on: Lock today’s process (11 min)$t$,
         $t$Think first, then one short Teacher check (Prompt Pack 1.6). Accept a smaller slice if needed.$t$,
         'project', 11, 10, true, v_doc, $t$1.6$t$, $t$Lock today’s process$t$),

        -- Session 2
        (2, 1, $t$2.0 Framing: pattern ladder (5 min)$t$,
         $t$Same Teacher thread. Prompt Pack 2.0 — ladder for YOUR process. No re-paste of process.$t$,
         'attend', 5, 5, true, v_doc, $t$2.0$t$, $t$pattern ladder$t$),
        (2, 2, $t$2.1 Hands-on: Map your process in Teacher chat (10 min)$t$,
         $t$Type steps (max 8) into Teacher once. Teacher tags Green/Blue/Red. Prompt Pack 2.1. No Working Pack.$t$,
         'project', 10, 10, true, v_doc, $t$2.1$t$, $t$Map your process$t$),
        (2, 3, $t$2.2 Written: First ETCSLV draft in chat (5 min)$t$,
         $t$Same Teacher thread: you type E–V. Teacher only acknowledges. Prompt Pack 2.2.$t$,
         'written', 5, 5, true, v_doc, $t$2.2$t$, $t$ETCSLV draft$t$),
        (2, 4, $t$2.3 Hands-on: Teacher critiques ETCSLV (7 min)$t$,
         $t$Reply in same thread — no re-paste. Tighten L and V. Prompt Pack 2.3.$t$,
         'project', 7, 10, true, v_doc, $t$2.3$t$, $t$ETCSLV$t$),
        (2, 5, $t$2.4 Hands-on: Decision tree + lock pattern (15 min)$t$,
         $t$Complete in-app decision tree. One short Teacher ask with result phrase only. Prompt Pack 2.4.$t$,
         'project', 15, 15, true,
         '/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree',
         $t$2.4$t$, $t$decision tree$t$),
        (2, 6, $t$2.5 Hands-on: Build the workflow brain (28 min)$t$,
         $t$One Teacher ask (uses earlier ETCSLV). Paste system instructions into Settings once. Test happy + messy. Prompt Pack 2.5.$t$,
         'project', 28, 15, true, 'https://notebooklm.google.com', $t$2.5$t$, $t$workflow brain$t$),
        (2, 7, $t$2.6 Hands-on: Automation path that runs (34 min)$t$,
         $t$Trigger → AI → output → approval. Live-run once. Short Teacher review. Prompt Pack 2.6.$t$,
         'project', 34, 15, true, v_doc, $t$2.6$t$, $t$Automation$t$),

        -- Session 3
        (3, 1, $t$3.0 Framing: manager of agents (4 min)$t$,
         $t$Teacher Prompt Pack 3.0 — five bullets for YOUR process.$t$,
         'attend', 4, 5, true, v_doc, $t$3.0$t$, $t$manager of agents$t$),
        (3, 2, $t$3.1 Hands-on: Design your AI workforce in chat (15 min)$t$,
         $t$Type proposed roles in Teacher. Cut to minimum roster. Prompt Pack 3.1.$t$,
         'project', 15, 15, true, v_doc, $t$3.1$t$, $t$AI workforce$t$),
        (3, 3, $t$3.2 Hands-on: Harness Card via Q&A (15 min)$t$,
         $t$Teacher asks E,T,C,S,L,V one at a time in same chat. Critique L/V. Prompt Pack 3.2.$t$,
         'project', 15, 15, true, v_doc, $t$3.2$t$, $t$Harness$t$),
        (3, 4, $t$3.3 Hands-on: Failure lab (18 min)$t$,
         $t$Trigger two failures on YOUR running workflow. Fix. Teacher only if stuck. Prompt Pack 3.3.$t$,
         'project', 18, 10, true, v_doc, $t$3.3$t$, $t$Failure lab$t$),
        (3, 5, $t$3.4 Hands-on: Capstone — ship the running workflow (38 min)$t$,
         $t$Re-run happy path twice. Meet definition of done. Prompt Pack 3.4 for Demo script.$t$,
         'project', 38, 20, true, v_doc, $t$3.4$t$, $t$Capstone$t$),
        (3, 6, $t$3.5 Demo Day + peer review (22 min)$t$,
         $t$Live run (or recent recording). Pain → run → who approves → one risk fixed.$t$,
         'attend', 22, 15, true, v_doc, $t$3.5$t$, $t$Demo Day$t$),
        (3, 7, $t$3.6 30-day AI adoption plan (8 min)$t$,
         $t$Minimal close: Teacher Prompt Pack 3.6. Circle Week 1 ritual you will do.$t$,
         'written', 8, 5, true, v_doc, $t$3.6$t$, $t$30-day$t$),

        -- Session 4
        (4, 1, $t$4.1 Read: Building effective agents — Anthropic (20 min)$t$,
         $t$Optional. Skim for managers: when NOT to build agents; simple patterns win.$t$,
         'read', 20, 5, false,
         'https://www.anthropic.com/engineering/building-effective-agents',
         $t$4.1$t$, $t$Anthropic$t$),
        (4, 2, $t$4.2 Read: What are AI agents? — IBM (15 min)$t$,
         $t$Optional. Plain-language overview of AI agents for non-engineers.$t$,
         'read', 15, 5, false,
         'https://www.ibm.com/think/topics/ai-agents',
         $t$4.2$t$, $t$IBM$t$),
        (4, 3, $t$4.3 Watch: What is AI? in 5 minutes (5 min)$t$,
         $t$Optional. Short refresher video if you want a plain intro.$t$,
         'watch', 5, 5, false,
         'https://www.youtube.com/watch?v=2ePf9rue1Ao',
         $t$4.3$t$, $t$What is AI$t$)
    ) AS s(
      week_number, sort_order, task_name, task_details, task_type,
      estimated_minutes, points, is_required, link, match_a, match_b
    )
    ORDER BY week_number, sort_order
  LOOP
    SELECT w.id INTO v_week_id
    FROM public.roadmap_weeks w
    WHERE w.roadmap_id = v_roadmap_id AND w.week_number = r.week_number
    LIMIT 1;

    IF v_week_id IS NULL THEN
      RAISE EXCEPTION 'Missing session/week % for agentic roadmap', r.week_number;
    END IF;

    v_task_id := NULL;
    -- Prefer match by task number prefix (e.g. "1.3 ") so renames update in place
    SELECT t.id INTO v_task_id
    FROM public.roadmap_tasks t
    WHERE t.week_id = v_week_id
      AND (
        t.task_name = r.task_name
        OR t.task_name LIKE (split_part(r.task_name, ' ', 1) || ' %')
        OR t.task_name ILIKE '%' || r.match_a || '%'
        OR (r.match_b IS NOT NULL AND t.task_name ILIKE '%' || r.match_b || '%')
      )
    ORDER BY
      CASE WHEN t.task_name = r.task_name THEN 0
           WHEN t.task_name LIKE (split_part(r.task_name, ' ', 1) || ' %') THEN 1
           ELSE 2 END,
      t.created_at ASC
    LIMIT 1;

    IF v_task_id IS NULL THEN
      INSERT INTO public.roadmap_tasks (
        week_id, task_name, task_details, task_type, relevant_links,
        estimated_hours, points, is_required, sort_order
      )
      VALUES (
        v_week_id, r.task_name, r.task_details, r.task_type,
        CASE WHEN r.link IS NULL THEN NULL ELSE ARRAY[r.link] END,
        r.estimated_minutes, r.points, r.is_required, r.sort_order
      )
      RETURNING id INTO v_task_id;
    ELSE
      UPDATE public.roadmap_tasks
      SET
        task_name = r.task_name,
        task_details = r.task_details,
        task_type = r.task_type,
        relevant_links = CASE WHEN r.link IS NULL THEN NULL ELSE ARRAY[r.link] END,
        estimated_hours = r.estimated_minutes,
        points = r.points,
        is_required = r.is_required,
        sort_order = r.sort_order
      WHERE id = v_task_id;
    END IF;

    v_kept := array_append(v_kept, v_task_id);
  END LOOP;

  -- Remove old Session 1 tasks 1.7/1.8 and any other orphans
  DELETE FROM public.roadmap_tasks t
  USING public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND NOT (t.id = ANY (v_kept));

  RAISE NOTICE 'Less-paste curriculum sync: % tasks kept (Session 1 should be 1.1–1.6)', coalesce(array_length(v_kept, 1), 0);
END
$body$;

-- VERIFY:
-- SELECT w.week_number, t.sort_order, t.task_name, t.estimated_hours AS minutes
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.sort_order;
-- Expected Session 1: six tasks 1.1 … 1.6 (no 1.7/1.8).
