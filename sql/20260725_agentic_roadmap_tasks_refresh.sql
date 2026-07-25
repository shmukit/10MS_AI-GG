-- Forward-fix: refresh "Become a Manager of AI Agents" curriculum.
-- Fixes: stable task order (sort_order), no watch in Sessions 1–3, Session 4 optional
-- reading, numbered titles + (X min), Hands-on wording, slides + workshop doc links.
-- Idempotent. Does NOT wipe student_progress (updates tasks in place where possible).
--
-- Run in Supabase SQL Editor after prior agentic roadmap seed scripts.

-- ============ PREREQUISITE: stable task ordering ============
ALTER TABLE public.roadmap_tasks
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.roadmap_tasks.sort_order IS
  'Display order within a week/session. Lower = earlier. Do not rely on created_at.';

-- ============ ROADMAP META ============
UPDATE public.roadmaps
SET
  description = $$Single-day workshop for professionals. Sessions 1–3 are the live workshop (WITH → THROUGH → BY AI). Session 4 is optional go-deeper reading/watching for beginners.$$,
  total_weeks = 4,
  node_unit_label = $$Session$$,
  decision_tree_enabled = true,
  slides_url = $$https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing$$,
  updated_at = NOW()
WHERE title = $$Become a Manager of AI Agents$$;

-- Slide deck catalog row (legacy + catalog)
INSERT INTO public.roadmap_slide_decks (roadmap_id, title, slides_url, sort_order, is_default_enabled, is_active)
SELECT r.id,
  $$Workshop slides$$,
  $$https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing$$,
  0, true, true
FROM public.roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_slide_decks d
    WHERE d.roadmap_id = r.id
      AND d.slides_url LIKE $$%13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo%$$
  );

UPDATE public.roadmap_slide_decks d
SET
  slides_url = $$https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing$$,
  title = COALESCE(NULLIF(trim(d.title), ''), $$Workshop slides$$),
  is_active = true,
  is_default_enabled = true
FROM public.roadmaps r
WHERE d.roadmap_id = r.id
  AND r.title = $$Become a Manager of AI Agents$$;

-- ============ SESSION 4 NODE ============
INSERT INTO public.roadmap_weeks (roadmap_id, week_number, title, description, domain)
SELECT r.id, 4,
  $$Session 4: Optional — Go deeper (beginner)$$,
  $$Optional after the workshop. A few short, solid reads/videos — not a long reading list.$$,
  $$Optional Deep Dive$$
FROM public.roadmaps r
WHERE r.title = $$Become a Manager of AI Agents$$
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_weeks w
    WHERE w.roadmap_id = r.id AND w.week_number = 4
  );

UPDATE public.roadmap_weeks w
SET
  title = $$Session 4: Optional — Go deeper (beginner)$$,
  description = $$Optional after the workshop. A few short, solid reads/videos — not a long reading list.$$,
  domain = $$Optional Deep Dive$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id
  AND r.title = $$Become a Manager of AI Agents$$
  AND w.week_number = 4;

-- Soften Session 1–3 titles for consistency
UPDATE public.roadmap_weeks w
SET title = $$Session 1: Foundations — Work WITH AI$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 1;

UPDATE public.roadmap_weeks w
SET title = $$Session 2: Business Ops — Break Down and Decide$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 2;

UPDATE public.roadmap_weeks w
SET title = $$Session 3: Manage — Work BY AI$$
FROM public.roadmaps r
WHERE w.roadmap_id = r.id AND r.title = $$Become a Manager of AI Agents$$ AND w.week_number = 3;

-- ============ UPSERT TASKS (no TEMP table — Supabase SQL Editor often
-- cannot see TEMP tables created outside a DO block) ============
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
        -- Session 1
        (1, 1, $t$1.1 What AI actually is (and isn't) (10 min)$t$,
         $t$Facilitator + discussion: AI vs traditional software; LLMs in plain language. Chat = instructions + conversation; agents need a clear job design.$t$,
         'attend', 10, 10, true, v_doc, $t$What AI actually is$t$, NULL::text),
        (1, 2, $t$1.2 Chat vs assistant vs agent (10 min)$t$,
         $t$Same model, different job design. When a simple chat is enough vs when you need a structured workflow with checks.$t$,
         'attend', 10, 10, true, v_doc, $t$Chat vs assistant$t$, NULL),
        (1, 3, $t$1.3 The thinking brain: where LLMs help (15 min)$t$,
         $t$LLM = think, brainstorm, plan, draft, critique — not the whole workflow. Contrast with calculators, forms, databases, and rules.$t$,
         'attend', 15, 10, true, v_doc, $t$thinking brain$t$, NULL),
        (1, 4, $t$1.4 Hands-on: Prompting Properly (30 min)$t$,
         $t$Practice levels: zero-shot → role/context → structured output → few-shot → verify. Deliverable: your personal prompt cheatsheet.$t$,
         'project', 30, 15, true, v_doc, $t$Prompting Properly$t$, NULL),
        (1, 5, $t$1.5 Reflection: opportunity map (15 min)$t$,
         $t$List 5 repetitive tasks from your week. Mark each: needs LLM thinking vs rule-based automation vs must stay human.$t$,
         'written', 15, 10, true, v_doc, $t$opportunity map$t$, NULL),
        (1, 6, $t$1.6 Hands-on: Tool landscape (light) (20 min)$t$,
         $t$Run the same small task in 2–3 tools (ChatGPT, Claude, Perplexity). Note tone, citations, and speed differences.$t$,
         'project', 20, 10, true, 'https://chat.openai.com', $t$Tool landscape$t$, NULL),
        (1, 7, $t$1.7 Hands-on: Meet your first AI employee (25 min)$t$,
         $t$Configure a simple Executive Assistant in ChatGPT Projects or Claude Projects for your own role. Save instructions you will reuse.$t$,
         'project', 25, 15, true, 'https://claude.ai', $t$first AI employee$t$, NULL),
        -- Session 2
        (2, 1, $t$2.1 Day-to-day business workflow catalog (20 min)$t$,
         $t$Walk families in business language: intake/triage, research, documents, support, sales/BD, finance, HR, content/data.$t$,
         'attend', 20, 10, true, v_doc, $t$workflow catalog$t$, NULL),
        (2, 2, $t$2.2 Hands-on: Break a workflow into phases (30 min)$t$,
         $t$Pick one real process. Map phases. Tag each: rule-based vs LLM thinking vs human must decide.$t$,
         'project', 30, 15, true, v_doc, $t$Break a workflow$t$, NULL),
        (2, 3, $t$2.3 Hands-on: Where the thinking brain sits (20 min)$t$,
         $t$Annotate your map: which phases call an LLM, which stay scripts/rules/UI, which need human approval.$t$,
         'project', 20, 10, true, v_doc, $t$Where the thinking brain$t$, NULL),
        (2, 4, $t$2.4 Hands-on: Interactive decision tree (25 min)$t$,
         $t$Use the in-app decision tree to classify your process. Save the Type 1–7 result for your Harness Card.$t$,
         'project', 25, 15, true,
         '/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree',
         $t$Interactive decision tree$t$, NULL),
        (2, 5, $t$2.5 Hands-on: Build the simplest fitting assistant (25 min)$t$,
         $t$Build only as complex as the tree says — usually a knowledge helper or single workflow assistant.$t$,
         'project', 25, 15, true, 'https://notebooklm.google.com', $t$simplest fitting assistant$t$, NULL),
        (2, 6, $t$2.6 Reflection: time and risk (10 min)$t$,
         $t$Estimate hours saved vs risk if under- or over-automated. What stays human?$t$,
         'written', 10, 10, true, v_doc, $t$time and risk$t$, NULL),
        -- Session 3
        (3, 1, $t$3.1 Hands-on: Design your AI workforce (25 min)$t$,
         $t$Org chart of AI helpers for your role (researcher, drafter, reviewer) — thinking jobs, not engineering jargon.$t$,
         'project', 25, 15, true, v_doc, $t$Design your AI workforce$t$, NULL),
        (3, 2, $t$3.2 Hands-on: Complete the Harness Card (20 min)$t$,
         $t$Fill: workflow, tools, context, what persists, limits/approvals, how you know it is done.$t$,
         'project', 20, 15, true, v_doc, $t$Harness Card$t$, NULL),
        (3, 3, $t$3.3 Hands-on: Failure lab (20 min)$t$,
         $t$Intentionally break the workflow: missing context, hallucination, wrong tool, no approval. Document what failed and why.$t$,
         'project', 20, 10, true, v_doc, $t$Failure lab$t$, NULL),
        (3, 4, $t$3.4 Hands-on: Capstone — redesign one real workflow (35 min)$t$,
         $t$Current process, pain, AI opportunities (rule vs LLM vs human), revised flow, review points, expected ROI.$t$,
         'project', 35, 20, true, v_doc, $t$Capstone$t$, NULL),
        (3, 5, $t$3.5 Demo day + peer review (30 min)$t$,
         $t$5-minute demo of your capstone. Give and receive peer feedback.$t$,
         'attend', 30, 15, true, v_doc, $t$Demo day$t$, NULL),
        (3, 6, $t$3.6 30-day AI adoption plan (15 min)$t$,
         $t$What you will try at work next month. Start simple; add complexity only when the decision tree says so.$t$,
         'written', 15, 10, true, v_doc, $t$30-day$t$, NULL),
        -- Session 4 optional
        (4, 1, $t$4.1 Read: Building effective agents — Anthropic (20 min)$t$,
         $t$Optional. Skim for managers: when NOT to build agents, and why simple patterns win. Official Anthropic engineering note (Dec 2024).$t$,
         'read', 20, 5, false,
         'https://www.anthropic.com/engineering/building-effective-agents',
         $t$Building effective agents$t$, $t$Anthropic$t$),
        (4, 2, $t$4.2 Read: What are AI agents? — IBM (15 min)$t$,
         $t$Optional. Plain-language overview of AI agents for non-engineers.$t$,
         'read', 15, 5, false,
         'https://www.ibm.com/think/topics/ai-agents',
         $t$AI agents$t$, $t$IBM$t$),
        (4, 3, $t$4.3 Watch: What is AI? in 5 minutes (5 min)$t$,
         $t$Optional. Short refresher video if you want a plain intro before revisiting your notes.$t$,
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

  RAISE NOTICE 'Agentic roadmap refreshed: % tasks kept/updated', coalesce(array_length(v_kept, 1), 0);
END
$body$;

-- ============ VERIFICATION ============
-- SELECT week_number, title FROM roadmap_weeks w
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY week_number;
--
-- SELECT w.week_number, t.sort_order, t.task_name, t.task_type, t.estimated_hours, t.is_required
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.sort_order;
--
-- SELECT title, total_weeks, slides_url FROM roadmaps
-- WHERE title = 'Become a Manager of AI Agents';
