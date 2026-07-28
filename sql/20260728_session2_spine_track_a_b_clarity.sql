-- Forward-fix: clarify Session 2 spine + Track A/B in roadmap task_details.
-- Pedagogy order (unchanged IDs): ladder → map/tags → ETCSLV → lock pattern → brain → run.
-- Run AFTER sql/20260728_simplify_task_details_leader_ux.sql
-- Idempotent. Do not edit prior SQL files.

DO $body$
DECLARE
  v_roadmap_id UUID;
BEGIN
  SELECT id INTO v_roadmap_id FROM public.roadmaps
  WHERE title = 'Become a Manager of AI Agents' LIMIT 1;
  IF v_roadmap_id IS NULL THEN
    RAISE EXCEPTION 'Roadmap "Become a Manager of AI Agents" not found.';
  END IF;

  UPDATE public.roadmap_weeks w
  SET description = 'Session 2 spine: ① destination picture → ② ladder (2.0) → ③ map+tags (2.1) → ④ ETCSLV (2.2–2.3) → ⑤ lock pattern (2.4) → ⑥ brain (2.5) → ⑦ run Track A or B (2.6).'
  WHERE w.roadmap_id = v_roadmap_id AND w.week_number = 2;

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: Choose how much structure your locked process needs (don’t jump to n8n yet).

Why this step: You locked one job in Session 1 — now pick the height of the build.

Steps
1. Stay in the same Teacher chat.
2. Copy the box below and send.
3. Note the level Teacher recommends. Mark complete.

——— COPY BELOW ———
Using my locked process from earlier, explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.0 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: List the steps of your process and tag Green / Blue / Red.

Why this step: Ladder height is set — now draw the floor plan.

Steps
1. In Teacher chat, copy the box below.
2. Fill your steps (max 8). Send.
3. Accept or correct the green/blue/red tags. Mark complete.

Green = AI thinking · Blue = rules/automation · Red = human only.

——— COPY BELOW ———
Help me map my locked process.
I will list steps (max 8). For each step I name, reply with only: Green (LLM) / Blue (rules-automation) / Red (human) + 5 words why.

My steps:
1) …
2) …
3) …
(add up to 8)
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.1 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: You draft the six operating rules (ETCSLV) — Teacher waits.

Why this step: Map shows steps — now write desk rules (especially Limits and Validation).

Steps
1. In the same Teacher chat, copy the box below.
2. Fill each letter in your own words. Send.
3. Mark complete (critique is the next task).

——— COPY BELOW ———
Here is my first ETCSLV draft for my locked process (I fill; you wait):
E Execution:
T Tools:
C Context:
S State:
L Limits: (specific — not “be careful”)
V Validation: (testable Monday morning)
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.2 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: Tighten Limits and Validation so they are testable.

Why this step: First L/V drafts are usually soft — make them Monday-ready.

Steps
1. Same Teacher chat — copy the box below (no need to re-paste your draft).
2. Keep only clearer L and V. Reply with your final L and V.
3. Mark complete.

——— COPY BELOW ———
Critique only my L and V from my ETCSLV draft above.
Make each specific and testable. Ask one clarifying question if needed.
I will reply with FINAL L and FINAL V only.
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.3 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: Lock the pattern you will build next (one room — not a menu).

Why this step: Map + rules exist — triage picks the simplest pattern that fits.

Steps
1. Use the link button → complete the Decision Tree for your process.
2. Note the result in a short phrase.
3. Copy the box into Teacher chat. Send.
4. Lock one pattern. Mark complete.

——— COPY BELOW ———
My decision-tree result: […]
I will build THIS pattern today (one sentence).
Remind me: do not collect alternate patterns.
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.4 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: Create standing instructions for this job, then test them (still chatbot — not n8n yet).

Why this step: Pattern locked — write the AI step’s standing brief (Settings once).
Tool: Work Assistant Project Settings, or NotebookLM if your pattern is file-heavy.

Steps
1. In Teacher chat, copy the box below and send.
2. Paste only the system instructions into Project Settings (or NotebookLM guidance) once.
3. Test with a good example and a messy example.
4. Fix Settings if needed. Mark complete.

——— COPY BELOW ———
Using my locked pattern and my ETCSLV (especially L and V) from earlier in this chat, write:
1) System instructions (copy-paste ready, under 250 words)
2) Input contract (what I provide each run)
3) Output contract (exact format)
4) Failure behavior (missing info / out-of-scope / low confidence)
Keep it maintainable by a non-engineer.
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.5 %';

  UPDATE public.roadmap_tasks t
  SET task_details = $d$Goal: Make the path run once: trigger → AI → output → your approval.

Why this step: Brain is tested — open for business (live run).

Pick ONE track (both count):
• Track A (preferred): clone facilitator n8n / Make / Zapier template → wire your workflow-brain text into the AI step → live-run once.
• Track B (if automation blocked by IT/Wi‑Fi/time): checklist or form → AI draft in chat → YOU paste/send after approval. Still must show a live run on screen.

Not enough: diagrams or notes with no live output.

Steps
1. Choose Track A or Track B. Build/run once on screen.
2. Copy the box into Teacher for a short review.
3. Mark complete.

——— COPY BELOW ———
My track today: A (automation clone) or B (semi-auto chatbot)
My path runs:
Trigger = […]
AI step = […]
Output = […]
Approval = […]

List top 3 Monday failure modes and one fix each.
Confirm T / L / V in one line each.
——— END ———$d$
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id AND w.roadmap_id = v_roadmap_id AND t.task_name LIKE '2.6 %';
END
$body$;

-- Verification:
-- SELECT t.task_name, left(t.task_details, 120)
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents' AND w.week_number = 2
-- ORDER BY t.sort_order;
