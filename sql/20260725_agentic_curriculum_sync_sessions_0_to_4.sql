-- Forward-fix: sync agentic workshop to Sessions 0–4 (master curriculum).
-- Pedagogy source: docs/PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md + PROMPT_PACK.md
-- DB week_number = session number (0=Opening … 4=Reference) so UI shows "Session 0".
-- Idempotent. Prefer updating tasks in place; deletes only tasks not in the new set.
--
-- Run AFTER sql/20260725_agentic_roadmap_tasks_refresh.sql (or equivalent seed).
-- Do NOT edit that prior file.

ALTER TABLE public.roadmap_tasks
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- ============ REMAP WEEKS: old 1–4 → temp → 1–4; insert Session 0 ============
DO $remap$
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

  -- Avoid unique collisions: shift existing sessions up
  UPDATE public.roadmap_weeks w
  SET week_number = w.week_number + 100
  FROM public.roadmaps r
  WHERE w.roadmap_id = r.id
    AND r.id = v_roadmap_id
    AND w.week_number BETWEEN 0 AND 20;

  -- Old Session 1 (WITH) was week 1 → now 101 → target week 1
  UPDATE public.roadmap_weeks w SET week_number = 1
  FROM public.roadmaps r
  WHERE w.roadmap_id = r.id AND r.id = v_roadmap_id AND w.week_number = 101;

  UPDATE public.roadmap_weeks w SET week_number = 2
  FROM public.roadmaps r
  WHERE w.roadmap_id = r.id AND r.id = v_roadmap_id AND w.week_number = 102;

  UPDATE public.roadmap_weeks w SET week_number = 3
  FROM public.roadmaps r
  WHERE w.roadmap_id = r.id AND r.id = v_roadmap_id AND w.week_number = 103;

  UPDATE public.roadmap_weeks w SET week_number = 4
  FROM public.roadmaps r
  WHERE w.roadmap_id = r.id AND r.id = v_roadmap_id AND w.week_number = 104;

  -- Drop any unexpected leftover temps
  DELETE FROM public.roadmap_weeks w
  USING public.roadmaps r
  WHERE w.roadmap_id = r.id
    AND r.id = v_roadmap_id
    AND w.week_number >= 100;

  -- Session 0 (Opening)
  INSERT INTO public.roadmap_weeks (roadmap_id, week_number, title, description, domain)
  SELECT v_roadmap_id, 0,
    'Session 0: Housekeeping + Opening',
    'Start of day: surfaces, Teacher Agent, day contract. Live workshop housekeeping.',
    'Opening'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.roadmap_weeks w
    WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 0
  );
END
$remap$;

-- ============ ROADMAP META ============
UPDATE public.roadmaps
SET
  description = $$Single-day workshop. Session 0 = opening. Sessions 1–3 = WITH → THROUGH → BY AI (live). Session 4 = optional reference reading/watching.$$,
  total_weeks = 5,
  node_unit_label = $$Session$$,
  decision_tree_enabled = true,
  updated_at = NOW()
WHERE title = $$Become a Manager of AI Agents$$;

-- ============ SESSION TITLES ============
UPDATE public.roadmap_weeks w
SET
  title = $$Session 0: Housekeeping + Opening$$,
  description = $$Start of day: roadmap, Prompt Pack, Working Pack, hire Teacher Agent.$$,
  domain = $$Opening$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 0;

UPDATE public.roadmap_weeks w
SET
  title = $$Session 1: Work WITH AI$$,
  description = $$Chat → collaborator. Prompts, tool fit (max 2–3), memory, lock today’s process.$$,
  domain = $$AI Collaboration$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1;

UPDATE public.roadmap_weeks w
SET
  title = $$Session 2: Work THROUGH AI$$,
  description = $$Map process, ETCSLV, decision tree, workflow brain, running automation path.$$,
  domain = $$AI Workflows$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2;

UPDATE public.roadmap_weeks w
SET
  title = $$Session 3: Work BY AI$$,
  description = $$AI workforce, Harness Card, Failure Lab, ship running workflow, Demo Day.$$,
  domain = $$AI Workforce Management$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3;

UPDATE public.roadmap_weeks w
SET
  title = $$Session 4: Reference — Go deeper (optional)$$,
  description = $$Optional after the workshop. Short reads/videos for beginners.$$,
  domain = $$Optional Deep Dive$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 4;

INSERT INTO public.roadmap_weeks (roadmap_id, week_number, title, description, domain)
SELECT r.id, 4,
  $$Session 4: Reference — Go deeper (optional)$$,
  $$Optional after the workshop. Short reads/videos for beginners.$$,
  $$Optional Deep Dive$$
FROM public.roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_weeks w
    WHERE w.roadmap_id = r.id AND w.week_number = 4
  );

-- ============ UPSERT ALL TASKS ============
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
        -- ========== Session 0 ==========
        (0, 1, $t$0.1 Housekeeping: open your three surfaces (5 min)$t$,
         $t$Open roadmap, agenda slides, and Prompt Pack (viewer). Make a copy of the Working Pack Google Slides. Confirm Wi‑Fi and login.$t$,
         'attend', 5, 5, true, v_doc, $t$Housekeeping$t$, NULL::text),
        (0, 2, $t$0.2 Hands-on: Create Teacher Agent + paste instructions (10 min)$t$,
         $t$Create Project “Workshop Teacher — Agentic AI”. Paste system instructions into Project Settings (not chat). Prompt Pack Task 0.2.$t$,
         'project', 10, 10, true, v_doc, $t$Teacher Agent$t$, $t$system instructions$t$),
        (0, 3, $t$0.3 Hands-on: Day contract with Teacher (7 min)$t$,
         $t$In Teacher chat, paste Day contract (Prompt Pack 0.3). Answer the Teacher’s clarifying questions.$t$,
         'project', 7, 10, true, v_doc, $t$Day contract$t$, NULL),
        (0, 4, $t$0.4 Chat vs assistant vs agent (5 min)$t$,
         $t$Ask Teacher (Prompt Pack 0.4). Share one-sentence definition in checkpoint. Mark complete.$t$,
         'attend', 5, 5, true, v_doc, $t$Chat vs assistant$t$, NULL),

        -- ========== Session 1 ==========
        (1, 1, $t$1.1 Hands-on: Draft Work EA instructions via Teacher (8 min)$t$,
         $t$Teacher chat Prompt Pack 1.1 — Teacher writes EA instructions. Do not paste into settings yet.$t$,
         'project', 8, 10, true, v_doc, $t$Draft$t$, $t$Executive Assistant$t$),
        (1, 2, $t$1.2 Hands-on: Create Work EA Project + paste settings (5 min)$t$,
         $t$New Project “My Work EA — [Name]”. Paste Teacher’s draft into that Project’s Settings/Instructions.$t$,
         'project', 5, 10, true, v_doc, $t$Work EA$t$, $t$settings$t$),
        (1, 3, $t$1.3 Hands-on: Run one morning-style task (5 min)$t$,
         $t$In Work EA chat, paste real morning notes (or Teacher sample). Get a Top 5 action list.$t$,
         'project', 5, 10, true, v_doc, $t$morning$t$, NULL),
        (1, 4, $t$1.4 Hands-on: Critique Work EA instructions (4 min)$t$,
         $t$Teacher chat Prompt Pack 1.4. Apply one reliability fix to Work EA settings.$t$,
         'project', 4, 5, true, v_doc, $t$Critique$t$, NULL),
        (1, 5, $t$1.5 Hands-on: Prompt bake-off (18 min)$t$,
         $t$Teacher Prompt Pack 1.5 — before/after rewrite. Run both. Save on Working Pack.$t$,
         'project', 18, 15, true, v_doc, $t$Prompt bake-off$t$, $t$Prompting$t$),
        (1, 6, $t$1.6 Hands-on: Tool landscape + fit (max 2–3) (25 min)$t$,
         $t$After facilitator landscape tour: Teacher Prompt Pack 1.6. Try at most 2–3 tools for YOUR process. Lock stack on Working Pack.$t$,
         'project', 25, 15, true, 'https://chat.openai.com', $t$Tool landscape$t$, $t$Tool fit$t$),
        (1, 7, $t$1.7 Hands-on: Memory — docs + grounded questions (10 min)$t$,
         $t$Upload 1–2 allowed docs (NotebookLM or Project files). Ask 2 grounded questions + 1 trap.$t$,
         'project', 10, 10, true, 'https://notebooklm.google.com', $t$Memory$t$, $t$NotebookLM$t$),
        (1, 8, $t$1.8 Hands-on: Lock today’s process (15 min)$t$,
         $t$Fill Working Pack Process lock. Teacher Prompt Pack 1.8 — accept a smaller slice if needed.$t$,
         'project', 15, 10, true, v_doc, $t$Lock today’s process$t$, $t$opportunity$t$),

        -- ========== Session 2 ==========
        (2, 1, $t$2.0 Framing: pattern ladder (5 min)$t$,
         $t$Facilitator shows ladder. Teacher Prompt Pack 2.0 — ladder in YOUR process context.$t$,
         'attend', 5, 5, true, v_doc, $t$pattern ladder$t$, $t$Framing$t$),
        (2, 2, $t$2.1 Hands-on: Map your process (10 min)$t$,
         $t$Working Pack: max 8 steps. Tag each Green (LLM) / Blue (rules) / Red (human).$t$,
         'project', 10, 10, true, v_doc, $t$Map your process$t$, $t$Break a workflow$t$),
        (2, 3, $t$2.2 Written: First ETCSLV draft — you fill (5 min)$t$,
         $t$After facilitator teaches ETCSLV: fill all six letters on Working Pack yourself (Prompt Pack 2.2).$t$,
         'written', 5, 5, true, v_doc, $t$ETCSLV draft$t$, NULL),
        (2, 4, $t$2.3 Hands-on: Teacher critiques ETCSLV (7 min)$t$,
         $t$Prompt Pack 2.3 — tighten Limits and Validation. Update Working Pack.$t$,
         'project', 7, 10, true, v_doc, $t$ETCSLV$t$, $t$thinking brain$t$),
        (2, 5, $t$2.4 Hands-on: Decision tree + lock pattern (15 min)$t$,
         $t$Complete in-app decision tree. Teacher Prompt Pack 2.4. Write Pattern lock on Working Pack.$t$,
         'project', 15, 15, true,
         '/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree',
         $t$decision tree$t$, NULL),
        (2, 6, $t$2.5 Hands-on: Build the workflow brain (28 min)$t$,
         $t$Teacher Prompt Pack 2.5 — system instructions + I/O contract. Test happy path + messy path.$t$,
         'project', 28, 15, true, 'https://notebooklm.google.com', $t$workflow brain$t$, $t$fitting assistant$t$),
        (2, 7, $t$2.6 Hands-on: Automation path that runs (34 min)$t$,
         $t$Trigger → AI → output → approval. Clone template or Track B semi-auto. Must live-run once. Prompt Pack 2.6.$t$,
         'project', 34, 15, true, v_doc, $t$Automation$t$, $t$time and risk$t$),

        -- ========== Session 3 ==========
        (3, 1, $t$3.0 Framing: manager of agents (4 min)$t$,
         $t$Facilitator framing. Teacher Prompt Pack 3.0 — five bullets for YOUR process.$t$,
         'attend', 4, 5, true, v_doc, $t$manager of agents$t$, NULL),
        (3, 2, $t$3.1 Hands-on: Design your AI workforce (15 min)$t$,
         $t$Working Pack workforce table. Teacher Prompt Pack 3.1 — cut to minimum roles + human gate.$t$,
         'project', 15, 15, true, v_doc, $t$AI workforce$t$, NULL),
        (3, 3, $t$3.2 Hands-on: Complete the Harness Card (15 min)$t$,
         $t$Fill Harness (E,T,C,S,L,V). Teacher Prompt Pack 3.2 critiques L and V.$t$,
         'project', 15, 15, true, v_doc, $t$Harness Card$t$, NULL),
        (3, 4, $t$3.3 Hands-on: Failure lab (18 min)$t$,
         $t$Trigger two failures on YOUR running workflow. Log fixes. Prompt Pack 3.3 if stuck.$t$,
         'project', 18, 10, true, v_doc, $t$Failure lab$t$, NULL),
        (3, 5, $t$3.4 Hands-on: Capstone — ship the running workflow (38 min)$t$,
         $t$Not a slide deck. Re-run happy path twice. Meet definition of done. Prompt Pack 3.4 for Demo script.$t$,
         'project', 38, 20, true, v_doc, $t$Capstone$t$, $t$ship$t$),
        (3, 6, $t$3.5 Demo Day + peer review (22 min)$t$,
         $t$Live run (or recent recording). Pain → run → who approves → one risk fixed. Peer votes.$t$,
         'attend', 22, 15, true, v_doc, $t$Demo day$t$, $t$Demo Day$t$),
        (3, 7, $t$3.6 30-day AI adoption plan (8 min)$t$,
         $t$Minimal close: Teacher Prompt Pack 3.5 (30-day). One ritual for Monday.$t$,
         'written', 8, 5, true, v_doc, $t$30-day$t$, NULL),

        -- ========== Session 4 optional ==========
        (4, 1, $t$4.1 Read: Building effective agents — Anthropic (20 min)$t$,
         $t$Optional. Skim for managers: when NOT to build agents; simple patterns win.$t$,
         'read', 20, 5, false,
         'https://www.anthropic.com/engineering/building-effective-agents',
         $t$Building effective agents$t$, $t$Anthropic$t$),
        (4, 2, $t$4.2 Read: What are AI agents? — IBM (15 min)$t$,
         $t$Optional. Plain-language overview of AI agents for non-engineers.$t$,
         'read', 15, 5, false,
         'https://www.ibm.com/think/topics/ai-agents',
         $t$AI agents$t$, $t$IBM$t$),
        (4, 3, $t$4.3 Watch: What is AI? in 5 minutes (5 min)$t$,
         $t$Optional. Short refresher video if you want a plain intro.$t$,
         'watch', 5, 5, false,
         'https://www.youtube.com/watch?v=2ePf9rue1Ao',
         $t$What is AI$t$, $t$5 minutes$t$)
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
    SELECT t.id INTO v_task_id
    FROM public.roadmap_tasks t
    WHERE t.week_id = v_week_id
      AND (
        t.task_name = r.task_name
        OR t.task_name ILIKE '%' || r.match_a || '%'
        OR (r.match_b IS NOT NULL AND t.task_name ILIKE '%' || r.match_b || '%')
      )
    ORDER BY
      CASE WHEN t.task_name = r.task_name THEN 0 ELSE 1 END,
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

  DELETE FROM public.roadmap_tasks t
  USING public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND NOT (t.id = ANY (v_kept));

  RAISE NOTICE 'Curriculum sync complete: % tasks; sessions week_number 0–4', coalesce(array_length(v_kept, 1), 0);
END
$body$;

-- ============ VERIFICATION ============
-- SELECT week_number, title FROM roadmap_weeks w
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY week_number;
--
-- SELECT w.week_number, t.sort_order, t.task_name, t.task_type, t.estimated_hours AS minutes, t.is_required
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.sort_order;
