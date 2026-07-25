-- Forward-fix: Session 1 pedagogy — lock process BEFORE tools/memory.
-- Prior: 1.4 tools → 1.5 memory → 1.6 lock (tool zoo before commitment).
-- Now:   1.4 lock → 1.5 tools → 1.6 memory (for the locked process).
-- Run AFTER:
--   sql/20260725_agentic_curriculum_less_paste_v2.sql
--   sql/20260725_agentic_task_prompts_in_roadmap_fix.sql
--   sql/20260725_agentic_add_task_0_0_what_is_ai.sql
-- Idempotent. Do not edit prior SQL files.
--
-- Also refreshes Session 1 week description + embeds Prompt Pack-aligned details.

DO $body$
DECLARE
  v_roadmap_id UUID;
  v_week_id UUID;
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
  WHERE roadmap_id = v_roadmap_id AND week_number = 1
  LIMIT 1;

  IF v_week_id IS NULL THEN
    RAISE EXCEPTION 'Session 1 week not found.';
  END IF;

  UPDATE public.roadmap_weeks
  SET
    title = 'Session 1: Work WITH AI',
    description = 'Fill EA brief → 3 Work EA runs → one Teacher coach loop → lock one process → tools ≤3 for that process → memory/grounding.',
    domain = 'AI Collaboration'
  WHERE id = v_week_id;

  -- 1.4 Lock today’s process (was tools)
  UPDATE public.roadmap_tasks t
  SET
    task_name = '1.4 Hands-on: Lock today’s process (11 min)',
    task_details = $d$WHERE: Paper/note (think) → Teacher chat (one short check)
BECAUSE YOU JUST: felt WITH AI on real work — commit ONE job before shopping for tools
ANALOGY: Choose one customer journey for today — not the whole company

YOU DO
1. Think 3 minutes on paper/note: process name, pain, success today, what must stay human.
2. Copy the prompt below into Teacher chat (same thread). Accept a smaller slice if Teacher says too big.
3. Do NOT open a tool zoo yet — that is Task 1.5.
4. Mark complete.

——— COPY BELOW ———
Here is the process I want to ship today:
Name: […]
Pain: […]
Success today: […]
What must stay human: […]

Is this a good one-day slice? Yes/No.
If No, propose a smaller slice in one sentence.
How will I know it worked?
Remind me: I will pick tools NEXT (max 3) for THIS process only.
——— END ———$d$,
    task_type = 'project',
    estimated_hours = 11,
    points = 10,
    is_required = true,
    sort_order = 4,
    relevant_links = NULL
  WHERE t.week_id = v_week_id
    AND t.task_name LIKE '1.4 %';

  -- 1.5 Tool fit for locked process (was memory / was old tools content)
  UPDATE public.roadmap_tasks t
  SET
    task_name = '1.5 Hands-on: Tool landscape + fit for locked process (max 2–3) (25 min)',
    task_details = $d$WHERE: Teacher chat → then try ≤3 tools
BECAUSE YOU JUST: locked the process — equip only what THAT job needs
ANALOGY: Don’t open every stall in the market — pick two that serve today’s meal

YOU DO
1. After the facilitator landscape tour, copy the prompt into Teacher.
2. Run ONE identical test only in the recommended tools.
3. Write locked stack in one line: Today’s stack: …
4. Close a fourth tool if open. Mark complete.

——— COPY BELOW ———
Using my LOCKED process from task 1.4 (use what I already told you — do not ask me to re-paste the whole thing), and the kind of outputs I need: [e.g. email draft / PDF Q&A / slide outline / sheet summary]

Recommend EXACTLY 2 tools I should try today (3 only if clearly needed) from:
ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Gamma or Google Slides AI, image gen in ChatGPT/Gemini.

For each: best for / weak for / 1 risk.
Give me ONE identical test task to run in those tools.
Remind me: max 3 tools for today’s locked process.
——— END ———$d$,
    task_type = 'project',
    estimated_hours = 25,
    points = 15,
    is_required = true,
    sort_order = 5,
    relevant_links = ARRAY['https://chat.openai.com']
  WHERE t.week_id = v_week_id
    AND t.task_name LIKE '1.5 %';

  -- 1.6 Memory for locked process (was lock)
  UPDATE public.roadmap_tasks t
  SET
    task_name = '1.6 Hands-on: Memory — docs + grounded questions for locked process (10 min)',
    task_details = $d$WHERE: NotebookLM or Project files (docs for YOUR locked process)
BECAUSE YOU JUST: chose the stack — ground it with the right files
ANALOGY: Give the junior the company file — not corridor rumors

YOU DO (Teacher optional)
1. Upload 1–2 allowed work docs relevant to your locked process.
2. Ask two questions answerable from the docs.
3. Ask one trap question that should NOT be in the docs.
4. Review: Did it refuse or invent on the trap?
5. Mark complete.$d$,
    task_type = 'project',
    estimated_hours = 10,
    points = 10,
    is_required = true,
    sort_order = 6,
    relevant_links = ARRAY['https://notebooklm.google.com']
  WHERE t.week_id = v_week_id
    AND t.task_name LIKE '1.6 %';

  -- Safety: if a prior run left mismatched names, also match by sort_order leftovers
  -- Ensure sort_order 4/5/6 align to 1.4/1.5/1.6 prefixes
  UPDATE public.roadmap_tasks t
  SET sort_order = CASE
    WHEN t.task_name LIKE '1.1 %' THEN 1
    WHEN t.task_name LIKE '1.2 %' THEN 2
    WHEN t.task_name LIKE '1.3 %' THEN 3
    WHEN t.task_name LIKE '1.4 %' THEN 4
    WHEN t.task_name LIKE '1.5 %' THEN 5
    WHEN t.task_name LIKE '1.6 %' THEN 6
    ELSE t.sort_order
  END
  WHERE t.week_id = v_week_id
    AND t.task_name ~ '^1\.[1-6] ';

  RAISE NOTICE 'Session 1 reordered: 1.4 lock → 1.5 tools → 1.6 memory';
END
$body$;

-- ============ VERIFICATION ============
-- SELECT t.sort_order, t.task_name, t.estimated_hours AS minutes
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents' AND w.week_number = 1
-- ORDER BY t.sort_order;
-- Expect: 1.1 brief, 1.2 Work EA, 1.3 coach, 1.4 Lock, 1.5 Tool, 1.6 Memory
