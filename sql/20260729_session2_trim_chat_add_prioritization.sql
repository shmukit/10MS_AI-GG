-- Forward-fix: trim forced Teacher-chat steps in Session 2; add process prioritization at 1.4.
-- Run AFTER sql/20260728_simplify_task_details_leader_ux.sql (and prior chain).
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

  -- 1.4: prioritization on paper, then one Teacher check (Copy box kept)
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Choose one work process for the rest of today — start with low-hanging fruit.

Steps
1. On paper (5 minutes): list 2–3 candidate processes from your real work.
2. Plot each on Impact (time/rows saved if it worked) vs Effort (data, tools, approvals needed). Pick the winner — usually high impact, lower effort.
3. Write for that winner: name · why it hurts · what “done today” looks like · what must stay human.
4. Open Teacher chat. Copy the box below and send.
5. If Teacher says it is too big, take the smaller version.
6. Do not pick new tools yet — that is the next task.
7. Mark complete.

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
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.4 %';

  -- 2.0: readiness self-score + group ladder — no Teacher chat required
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Choose how much structure your locked process needs today.

Steps
1. On paper or in your workbook: rate yourself 1–5 on each readiness dimension:
   • Data readiness (clean inputs exist?)
   • Tool / IT access (can you use the apps you need?)
   • Risk appetite (comfort with AI drafts before human send?)
   • Change capacity (can your team adopt this in 30 days?)
2. Listen to the instructor on the pattern ladder (chat → knowledge → workflow → multi-agent → automation).
3. Circle the rung that fits YOUR locked process for today — discuss with a neighbor if unsure.
4. Write one line: My ladder rung today: …
5. Mark complete.

Keep in mind
• Climb only as high as this route needs. You already lived chat + assistant this morning.
• Multi-agent waits until something already runs.$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.0 %';

  -- 2.2: paper-only ETCSLV draft on Worksheet D — no Copy box
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Write your first ETCSLV draft on paper (Worksheet D).

Steps
1. Open Worksheet D in your workbook (after the ETCSLV Framework page).
2. Fill E, T, C, S, L, V in your own words — be specific on L and V.
3. No Teacher chat for this step — critique comes next (Task 2.3).
4. Mark complete.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.2 %';

  -- 2.3: paste draft once, then critique (single Teacher moment for ETCSLV)
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Tighten Limits and Validation so they are testable.

Steps
1. In Teacher chat, paste your E–V from Worksheet D (one message).
2. Copy the box below and send in the same thread.
3. Reply with your updated L and V only (testable, not “be careful”).
4. Mark complete.

——— COPY BELOW ———
Critique my ETCSLV draft above.
Focus on Limits and Validation — make them specific and testable.
Rewrite only weak lines.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.3 %';

  -- 2.6: live run required; Teacher review optional
  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Make the path run once: trigger → AI → output → your approval.

Steps
1. Build with the facilitator’s clone (or Track B: checklist → AI → you paste/send).
2. Live-run once on screen.
3. Optional if time: copy the box into Teacher for a short review.
4. Mark complete.

——— COPY BELOW ———
My path runs:
Trigger = […]
AI step = […]
Output = […]
Approval = […]

List top 3 Monday failure modes and one fix each.
Confirm T / L / V in one line each.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.6 %';

  RAISE NOTICE 'Session 2 friction trim applied for roadmap %', v_roadmap_id;
END;
$body$;

-- Verification (run manually):
-- SELECT t.task_name, LEFT(t.task_details, 120) AS preview
-- FROM public.roadmap_tasks t
-- JOIN public.roadmap_weeks w ON t.week_id = w.id
-- JOIN public.roadmaps r ON w.roadmap_id = r.id
-- WHERE r.title = 'Become a Manager of AI Agents'
--   AND (t.task_name LIKE '1.4 %' OR t.task_name LIKE '2.0 %' OR t.task_name LIKE '2.2 %'
--        OR t.task_name LIKE '2.3 %' OR t.task_name LIKE '2.6 %')
-- ORDER BY t.task_name;
