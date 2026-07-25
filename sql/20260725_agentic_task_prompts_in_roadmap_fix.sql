-- Forward-fix: embed Prompt Pack into task_details (fixes failed GET DIAGNOSTICS script).
-- Prior broken file: sql/20260725_agentic_task_prompts_in_roadmap.sql (syntax error — did not apply).
-- Also: relevant_links only for instructor PPT, decision tree, or Session 4 externals.
-- Run after sql/20260725_agentic_curriculum_less_paste_v2.sql.
-- Do NOT edit prior SQL files.

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

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Roadmap + your AI tool (ChatGPT or Claude). Optional paper/blank note.

YOU DO (no AI paste yet)
1. Confirm this roadmap is open.
2. Open ChatGPT or Claude (ready to create a Project).
3. Optional: open a blank note or grab paper for scratch thinking.
4. Tap Mark complete when ready.

Prompts for later tasks live inside each task on this roadmap — click a task to open, Copy, paste into AI.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '0.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Teacher Project → Settings / Instructions (NOT the chat box)
WHEN: Once, at the start of the day

1. Create a Project named: Workshop Teacher — Agentic AI
2. Open that Project’s Settings / Instructions
3. Copy the block below → paste once → Save

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
    task_details = $d$WHERE: Teacher Project → Chat (start the thread you will reuse all day)

Copy the prompt below, fill [brackets], paste into Teacher chat.
Then answer the Teacher’s three questions briefly in the SAME chat.

REVIEW: Skim the Teacher’s summary. If your process is wrong, correct it in one short reply.

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
    task_details = $d$WHERE: Same Teacher chat

Copy → paste → review. Pick the one sentence you will remember.

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
    task_details = $d$WHERE: Paper or a blank note — NOT in Teacher yet.

Think first. Complete in your own words (short). Copy this template into your note if helpful.

REVIEW: Read it once. If a stranger could follow it, you are done.

——— COPY BELOW ———
Role I want: Executive Assistant for [my job]
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
    task_details = $d$WHERE: Work EA Project only (leave Teacher closed until 1.3)

A — HIRE ONCE
1. New Project: My Work EA — [Your Name]
2. Open Settings / Instructions
3. Type or paste your brief from 1.1. Add if missing: Never invent meetings, names, or deadlines.
4. Save.

B — THREE RUNS in Work EA chat (copy each run when you need it)

After each run: Stop → Read → Decide.

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
——— END RUN 3 ———

A good EA refuses or asks on Run 3. If it invented the meeting, strengthen “never invent” in 1.3.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Teacher chat once → then Work EA Settings once → re-run once in Work EA.
This is the ONLY planned Teacher ↔ Work EA switch.

STEP 1 — Teacher (one message). Fill blanks from your Work EA chat (scroll; don’t build a second deck).

——— COPY BELOW ———
I hired a Work EA. Here is its Settings brief:
[paste brief once]

Here is one weak prompt I used:
[type the weakest ask you actually sent]

Here is the EA’s reply to that ask:
[paste that one reply once]

Do two things:
1) Rewrite my Settings brief — keep under 200 words; strengthen never-invent and approvals.
2) Rewrite my weak prompt using: role + context + task + format + constraints.
Show BEFORE vs AFTER for the prompt only.
Tell me the single change that will improve quality most.
——— END ———

REVIEW: Accept only the fixes you agree with.

STEP 2 — Work EA
1. Update Settings with the improved brief (one paste).
2. Re-run one task (triage or draft).
3. Compare. Better? Good.
Stay in Teacher for the rest of Session 1 unless told otherwise.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.3 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Watch facilitator landscape tour first (use the link button for agenda PPT if needed). Then Teacher chat.

——— COPY BELOW ———
Using my process from earlier today, and the kind of outputs I need: [e.g. email draft / PDF Q&A / slide outline / sheet summary]

Recommend EXACTLY 2 tools I should try today (3 only if clearly needed) from:
ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Gamma or Google Slides AI, image gen in ChatGPT/Gemini.

For each: best for / weak for / 1 risk.
Give me ONE identical test task to run in those tools.
Remind me: max 3 tools for today’s process.
——— END ———

YOU DO: Run that one test in only the recommended tools.
REVIEW: Lock stack in one line: Today’s stack: …
Do not open a fourth tool.$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: NotebookLM or a Project with files. No Teacher required.

YOU DO
1. Upload 1–2 allowed work docs.
2. Ask two questions answerable from the docs.
3. Ask one trap question that should NOT be in the docs.
4. REVIEW: Did it refuse or invent on the trap?

Optional trap starter to copy:

——— COPY BELOW ———
According to these documents, what is the exact refund policy for [something that is NOT in the docs]?
——— END ———$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Think first (paper/note, 3 min), then one short Teacher message.

Think template (optional copy to note):

——— THINK FIRST ———
Process name:
Why painful:
Success today looks like:
Tools (max 3):
——— END ———

Then Teacher:

——— COPY BELOW ———
Here is the process I want to ship today:
Name: […]
Pain: […]
Success today: […]
Tools: […]

Is this a good one-day slice? Yes/No.
If No, propose a smaller slice in one sentence.
What must stay human?
How will I know it worked?
——— END ———

REVIEW: If Teacher says too big, accept the smaller slice.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '1.6 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Same Teacher thread. Watch facilitator ladder on agenda PPT (link button) if helpful.

——— COPY BELOW ———
Using my locked process from earlier, explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
——— END ———

REVIEW: Say the recommended level out loud to yourself.$d$,
    relevant_links = ARRAY['https://docs.google.com/presentation/d/13nUZayahPZM2gGUwEua0FnnPthdU8ss0XrsIs_P08Yo/edit?usp=sharing']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.0 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Type into Teacher chat (this message IS your map).

——— COPY BELOW ———
Help me map my locked process.
I will list steps (max 8). For each step I name, reply with only: Green (LLM) / Blue (rules-automation) / Red (human) + 5 words why.

My steps:
1) …
2) …
3) …
(add up to 8)
——— END ———

REVIEW: Are Red steps really human-only? Fix any tag you disagree with in a short reply.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Same Teacher thread. You fill; Teacher must not invent for you yet.

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
    task_details = $d$WHERE: Same Teacher thread — no re-paste of the draft above.

——— COPY BELOW ———
Critique my ETCSLV draft above.
Focus on Limits and Validation — make them specific and testable.
Rewrite only weak lines.
——— END ———

REVIEW: Accept only clearer L and V. Reply with: Updated L: … Updated V: …$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.3 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: 1) Use the link button to open the Decision Tree on this roadmap. Click through. 2) Then one Teacher message.

——— COPY BELOW ———
Decision tree result: [one short phrase]
Defend or challenge that result for my process (you already know it).
State the simplest build plan for the next 90 minutes in 5 steps.
I will build: [pattern name I choose]
——— END ———

REVIEW: Lock one pattern. Do not collect options.$d$,
    relevant_links = ARRAY['/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: One Teacher ask → paste system instructions into worker Settings ONCE → test.

——— COPY BELOW ———
Using my locked pattern and my ETCSLV (especially L and V) from earlier in this chat, write:
1) System instructions (copy-paste ready, under 250 words)
2) Input contract (what I provide each run)
3) Output contract (exact format)
4) Failure behavior (missing info / out-of-scope / low confidence)
Keep it maintainable by a non-engineer.
——— END ———

THEN YOU DO
1. Open the Project / Custom GPT / NotebookLM for this workflow.
2. Paste ONLY the system instructions into Settings.
3. Test happy path + messy path.
4. REVIEW: Fix Settings yourself if output is wrong.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Build trigger → AI → output → human approval. Live-run once. Then short Teacher review.

——— COPY BELOW ———
My path runs:
Trigger = […]
AI step = […]
Output = […]
Approval = […]

List top 3 Monday failure modes and one fix each.
Confirm T / L / V in one line each.
——— END ———

REVIEW: Can you trigger it again without help?$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '2.6 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Same Teacher chat. Facilitator framing may use agenda PPT (link button).

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
    task_details = $d$WHERE: Type roles into Teacher (same thread).

——— COPY BELOW ———
Proposed AI roles for today’s process (3–5 max):
- Role: … Receives: … Produces: …
- …
Human gate: …

Cut this to the minimum roster needed today. Show final table.
——— END ———

REVIEW: Delete any role you cannot explain in one sentence.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Same Teacher thread — answer in chat.

——— COPY BELOW ———
Ask me the Harness questions one letter at a time (E, T with $/$$$, C, S, L, V) for my workflow.
Wait for my answer before the next letter.
After all six, critique Limits and Validation first, then rewrite only weak fields.
——— END ———

REVIEW: Final L and V should be testable Monday morning.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Your running workflow first. Teacher only if stuck.

YOU DO FIRST: Trigger two failures. Watch what breaks. Fix instructions or the path.
After each: Stop → Read → Fix.

ONLY IF STUCK — Teacher:

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
    task_details = $d$WHERE: Ship the running workflow. Re-run happy path twice. Then Teacher for Demo script.

——— COPY BELOW ———
Write a 60-second spoken Demo Day script for my process.
I must: name the pain, trigger the run, show output, name the human approval, name one failure we fixed.
No slide language. Sound like a manager.
——— END ———

REVIEW: Read the script aloud once. Cut fluff.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.4 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Live Demo Day — no paste required.

YOU DO: Live trigger (or recording from the last 10 minutes).
Show: pain → run → who approves → one risk fixed.
Then mark complete.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.5 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$WHERE: Teacher chat

——— COPY BELOW ———
Based on everything today, give me a short 30-day plan (under 120 words):
Week 1: one Monday run ritual for my shipped workflow
Week 2: improve Validation once
Week 3: optional cheaper model on an easy step OR leave as-is
Week 4: 15-minute harness review with myself or a teammate
——— END ———

REVIEW: Circle the Week 1 ritual you will actually do.$d$,
    relevant_links = NULL
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '3.6 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Optional read (use the link button).
Skim for managers: when NOT to build agents; simple patterns win.
Mark complete when finished (or skip).$d$,
    relevant_links = ARRAY['https://www.anthropic.com/engineering/building-effective-agents']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.1 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Optional read (use the link button).
Plain-language overview of AI agents for non-engineers.
Mark complete when finished (or skip).$d$,
    relevant_links = ARRAY['https://www.ibm.com/think/topics/ai-agents']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.2 %';

  UPDATE public.roadmap_tasks t
  SET
    task_details = $d$Optional watch (use the link button).
Short refresher if you want a plain intro to AI.
Mark complete when finished (or skip).$d$,
    relevant_links = ARRAY['https://www.youtube.com/watch?v=2ePf9rue1Ao']::text[]
  FROM public.roadmap_weeks w
  WHERE t.week_id = w.id
    AND w.roadmap_id = v_roadmap_id
    AND t.task_name LIKE '4.3 %';

  RAISE NOTICE 'Embedded prompts into agentic roadmap tasks';
END
$body$;

-- VERIFY:
-- SELECT left(t.task_name, 40), length(t.task_details), t.relevant_links
-- FROM roadmap_tasks t
-- JOIN roadmap_weeks w ON w.id = t.week_id
-- JOIN roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.sort_order;
