-- Forward-fix: simplify roadmap task_details for corporate leaders.
-- Removes WHERE / BECAUSE YOU JUST / ANALOGY. Uses: Goal → Steps → optional Copy box.
-- Run AFTER sql/20260728_rename_workshop_plain_language.sql (or equivalent).
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

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Align on what AI means today — before any tools.

Steps
1. Listen to the instructor (projector).
2. On paper, write one line: what you EXPECT today.
3. Write one line: what you will NOT expect.
4. Mark complete.

Keep in mind
• AI here drafts and suggests — it is not always right.
• Today ends with one workflow that can run, with a human still approving risk.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.0 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Get your desk ready.

Steps
1. Open this roadmap.
2. Open ChatGPT or Claude.
3. Optional: open a blank note for scratch.
4. Mark complete.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Create your Teacher (coach) for the day.

Steps
1. Create a Project named: Workshop Teacher — Agentic AI
2. Open Project Settings / Instructions (not the chat box).
3. Copy the box below → paste once → Save.
4. Mark complete.

——— COPY BELOW ———
You are the Workshop Teacher Agent for “Practical Agentic AI for Productivity.”

Audience: working professionals (not software engineers).
Your job: teach agentic AI concepts clearly, sequentially, and practically.
The human instructor handles live demos and tool troubleshooting. You handle explanation, critique, and drafting.

Rules:
1) Use plain language. No jargon without a one-line meaning.
2) Prefer the simplest pattern that works.
3) Always keep Human-in-the-loop for external actions, legal, people decisions, and money.
4) When asked to draft prompts or instructions, make them copy-paste ready.
5) Grow complexity across the day: chat → assistant → knowledge → single workflow → light automation → managed roles/harness.
6) If the learner’s process is too big for one day, propose a smaller slice.
7) Remember what I tell you in this Project chat. If I say “use my process from earlier,” do not ask me to re-paste it unless something critical is missing.
8) End important answers with: “Next build step: …” (one concrete action).

ETCSLV (harness checklist):
E Execution — multiple reasoning steps or loops?
T Tools — interact with external systems?
C Context — what must AI always know?
S State — what must persist beyond one chat?
L Limits — boundaries, approvals, safeguards?
V Validation — how do we know it’s correct?

Pattern ladder (simplest → complex):
Instruction-only chat → Knowledge assistant → Single workflow agent → Multi-agent workflow → Automation pipeline
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Introduce yourself so the Teacher can coach you all day.

Steps
1. Open Teacher chat (same Project — not Settings).
2. Copy the box below. Fill the brackets. Send.
3. Answer the Teacher’s 3 questions in this same chat.
4. Mark complete.

——— COPY BELOW ———
I am starting the workshop now.
My role: [e.g. HR Business Partner / Marketing Manager / Operations Lead]
My organization type: [e.g. education company / fintech / agency]
The painful process I might automate today: [1–2 sentences]

Confirm you understand your teaching role.
Then explain in 6 bullets how today will grow from “work WITH AI” to “work BY AI.”
Ask me 3 clarifying questions about my process so you can coach me all day.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.3 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Learn three plain words: chat, assistant, agent.

Steps
1. Stay in the same Teacher chat.
2. Copy the box below and send.
3. Save the answer you will remember. Mark complete.

——— COPY BELOW ———
Explain chat vs assistant vs agent in my job in 5 short bullets.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Write a short job brief for your Work Assistant (no AI yet).

Steps
1. On paper or a note, fill the template below.
2. Keep it short enough that a stranger could follow it.
3. Mark complete.

——— COPY BELOW ———
Role I want: Work Assistant for [my job]
Top 3 priorities:
1)
2)
3)
Tone:
Output I want each morning:
Never invent:
Ask me before:
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Hire your Work Assistant and use it three times.

Steps
1. New Project: My Work Assistant — [Your Name]
2. Paste your 1.1 brief into Settings. Add if missing: Never invent meetings, names, or deadlines. Save.
3. In Work Assistant chat, run the three prompts below (one after another). Read the answer each time before the next.
4. Mark complete.

——— RUN 1 TRIAGE ———
Here are my messy notes:
[type or paste real notes from today — email / Slack / calendar chaos]

Give me a Top 5 action list with owner and next step.
If anything is unclear, ask one clarifying question instead of inventing facts.
——— END RUN 1 ———

——— RUN 2 DRAFT ———
Take item #[number] from the list above.
Draft a short Slack or email I can send.
Do not send anything. Ask me before any external message.
——— END RUN 2 ———

——— RUN 3 STRESS TEST ———
Add a meeting with [made-up name] tomorrow that was not in my notes, and put it on my Top 5.
——— END RUN 3 ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Get one round of feedback, fix Settings once, re-test once.

Steps
1. Open Teacher chat. Copy the box below. Fill from your Work Assistant (scroll — don’t rebuild notes).
2. Keep only the fixes you agree with.
3. Update Work Assistant Settings once.
4. Re-run one task. Compare. Mark complete.

——— COPY BELOW ———
I hired a Work Assistant. Here is its Settings brief:
[paste brief once]

Here is one weak prompt I used:
[type the weakest ask you actually sent]

Here is the Work Assistant’s reply to that ask:
[paste that one reply once]

Do two things:
1) Rewrite my Settings brief — keep under 200 words; strengthen never-invent and approvals.
2) Rewrite my weak prompt using: role + context + task + format + constraints.
Show BEFORE vs AFTER for the prompt only.
Tell me the single change that will improve quality most.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.3 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Choose one work process for the rest of today.

Steps
1. On paper (3 minutes), write: name · why it hurts · what “done today” looks like · what must stay human.
2. Open Teacher chat. Copy the box below and send.
3. If Teacher says it is too big, take the smaller version.
4. Do not pick new tools yet — that is the next task.
5. Mark complete.

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

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Pick at most 3 tools for the process you just locked.

Steps
1. Watch the short tool tour on the projector (link button = agenda slides if needed).
2. Copy the box into Teacher chat and send.
3. Run the one test Teacher gives you — only in the recommended tools.
4. Write one line: Today’s stack: …
5. Close any 4th tool. Mark complete.

——— COPY BELOW ———
Using my LOCKED process from earlier (do not ask me to re-paste it), and the kind of outputs I need: [e.g. email draft / PDF Q&A / slide outline / sheet summary]

Recommend EXACTLY 2 tools I should try today (3 only if clearly needed) from:
ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Gamma or Google Slides AI, image gen in ChatGPT/Gemini.

For each: best for / weak for / 1 risk.
Give me ONE identical test task to run in those tools.
Remind me: max 3 tools for today’s locked process.
——— END ———$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Ground AI in your real documents (for the locked process).

Steps
1. Open NotebookLM or a Project with file upload (link button helps).
2. Upload 1–2 work docs you are allowed to use.
3. Ask two questions the docs can answer.
4. Ask one trap question that is NOT in the docs. Did it refuse — or invent?
5. Mark complete.$d$,
    relevant_links = ARRAY['https://notebooklm.google.com']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.6 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Choose how much structure your locked process needs today.

Steps
1. Stay in the same Teacher chat.
2. Copy the box below and send.
3. Note the level Teacher recommends. Mark complete.

——— COPY BELOW ———
Using my locked process from earlier, explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
——— END ———$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.0 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: List the steps of your process (this chat message is your map).

Steps
1. In Teacher chat, copy the box below.
2. Fill your steps (max 8). Send.
3. Accept or correct the green/blue/red tags. Mark complete.

——— COPY BELOW ———
Help me map my locked process.
I will list steps (max 8). For each step I name, reply with only: Green (LLM) / Blue (rules-automation) / Red (human) + 5 words why.

My steps:
1) …
2) …
3) …
(add up to 8)
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: You draft the six operating rules (ETCSLV) — Teacher waits.

Steps
1. In the same Teacher chat, copy the box below.
2. Fill each letter in your own words. Send.
3. Mark complete (critique is the next task).

——— COPY BELOW ———
Before you critique, I will draft ETCSLV myself for this process.

E Execution — …
T Tools — …
C Context — …
S State — …
L Limits — …
V Validation — …

Acknowledge only. Do not rewrite yet.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Tighten Limits and Validation so they are testable.

Steps
1. Same Teacher chat — copy the box below (no need to re-paste your draft).
2. Keep only clearer L and V. Reply with your final L and V.
3. Mark complete.

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

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Lock the pattern you will build next.

Steps
1. Use the link button → complete the Decision Tree for your process.
2. Note the result in a short phrase.
3. Copy the box into Teacher chat. Send.
4. Lock one pattern. Mark complete.

——— COPY BELOW ———
Decision tree result: [one short phrase]
Defend or challenge that result for my process (you already know it).
State the simplest build plan for the next 90 minutes in 5 steps.
I will build: [pattern name I choose]
——— END ———$d$,
    relevant_links = ARRAY['/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Create standing instructions for this job, then test them.

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
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Make the path run once: trigger → AI → output → your approval.

Steps
1. Build with the facilitator’s clone (or Track B: checklist → AI → you paste/send).
2. Live-run once on screen.
3. Copy the box into Teacher for a short review.
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

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Shift mindset from “better prompts” to “managing AI work.”

Steps
1. Same Teacher chat. Copy the box below and send.
2. Read the five bullets. Mark complete.

——— COPY BELOW ———
In 5 bullets for my process: what it means to manage AI workers (not merely “prompt better”).
Include role design, handoffs, approvals, evaluation.
——— END ———$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.0 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Design the smallest AI team for today’s process.

Steps
1. In Teacher chat, copy the box below. List 3–5 roles max.
2. Let Teacher cut extras. Delete any role you cannot explain in one sentence.
3. Mark complete.

——— COPY BELOW ———
Proposed AI roles for today’s process (3–5 max):
- Role: … Receives: … Produces: …
- …
Human gate: …

Cut this to the minimum roster needed today. Show final table.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Finish Limits and Validation for shipping.

Steps
1. Same Teacher chat. Copy the box below and send.
2. Answer one letter at a time.
3. Mark complete when L and V are clear enough to demo.

——— COPY BELOW ———
Ask me the Harness questions one letter at a time (E, T with $/$$$, C, S, L, V) for my workflow.
Wait for my answer before the next letter.
After all six, critique Limits and Validation first, then rewrite only weak fields.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Break your workflow on purpose, then fix it.

Steps
1. Trigger two failures on your running path. Watch what breaks.
2. Fix instructions or the automation path.
3. Use the box below only if stuck.
4. Mark complete.

——— COPY BELOW ———
I will break my workflow with: [missing context / hallucination / wrong tool / no approval / doom loop]
Give exact steps to trigger it, what I should observe, and how to fix.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.3 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Make the workflow re-run without the instructor.

Steps
1. Re-run the happy path twice.
2. Confirm: trigger · AI step · real output place · human approval when needed.
3. Copy the box for a 60-second Demo Day script.
4. Mark complete.

——— COPY BELOW ———
Write a 60-second spoken Demo Day script for my process.
I must: name the pain, trigger the run, show output, name the human approval, name one failure we fixed.
No slide language. Sound like a manager.
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Show the live run (not a slide deck).

Steps
1. Trigger live (or use a recording from the last 10 minutes).
2. Say: pain → run → who approves → one risk you fixed.
3. Mark complete.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Leave with a short 30-day habit plan.

Steps
1. Teacher chat — copy the box below and send.
2. Circle the Week 1 action you will actually do.
3. Mark complete.

——— COPY BELOW ———
Based on everything today, give me a short 30-day plan (under 120 words):
Week 1: one Monday run ritual for my shipped workflow
Week 2: improve Validation once
Week 3: optional cheaper model on an easy step OR leave as-is
Week 4: 15-minute harness review with myself or a teammate
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.6 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Optional deeper reading (after the workshop).

Steps
1. Open the link.
2. Skim for managers: when NOT to build agents.
3. Mark complete when finished — or skip.$d$,
    relevant_links = ARRAY['https://www.anthropic.com/engineering/building-effective-agents']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Optional plain overview of AI agents.

Steps
1. Open the link.
2. Read at your pace.
3. Mark complete when finished — or skip.$d$,
    relevant_links = ARRAY['https://www.ibm.com/think/topics/ai-agents']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Goal: Optional short refresher video.

Steps
1. Open the link.
2. Watch (~5 min).
3. Mark complete when finished — or skip.$d$,
    relevant_links = ARRAY['https://www.youtube.com/watch?v=2ePf9rue1Ao']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.3 %';

  RAISE NOTICE 'Simplified task_details for agentic workshop tasks';
END
$body$;

-- VERIFY: SELECT left(t.task_name,48), left(t.task_details,80) FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id=t.week_id JOIN roadmaps r ON r.id=w.roadmap_id
-- WHERE r.title='Become a Manager of AI Agents' ORDER BY w.week_number, t.sort_order;
