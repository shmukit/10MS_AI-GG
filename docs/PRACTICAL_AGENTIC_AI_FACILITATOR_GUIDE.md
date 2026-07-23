# Practical Agentic AI for Productivity
## Build Your Personal AI Workforce in One Day — Facilitator Runbook

This document is written for **you, the facilitator**. Read it as a step-by-step script for running the day. Every activity explains: what to say, what to show, what participants type, and how you know they are done.

---

## 1. What this workshop is

**Who is in the room:** Working professionals — managers, HR, marketing, analysts, founders, operations, consultants, educators. They are **not** software engineers.

**What the day is about:** People learn to manage AI the way they manage junior employees: give clear instructions, check the work, set limits, and only automate what is safe.

**The story of the day (say this once at the start):**

1. **Work WITH AI** — Use AI as a daily helper (better prompts, right tool, memory).
2. **Work THROUGH AI** — Turn one messy work process into a reusable assistant and a path that can run.
3. **Work BY AI** — Treat AI like a small team: roles, rules, failure tests, then ship.

**What “done” means at the end of the day:**  
Each person (or small team) can **live-demonstrate one real work process** that runs like this:

> Something starts the work (a form, an email, a checklist, a pasted note) → AI does a clear step → the result appears where work actually goes (Google Doc, Sheet, email draft, Slack, etc.) → a human still approves anything external or high-risk.

That running path is the product. A slide deck or a written plan alone is **not** enough.

---

## 2. How teaching works in this room

You will **not** give long concept lectures. Three helpers share the load:

| Helper | What it does |
| ------ | ------------ |
| **Teacher Agent** | A ChatGPT Project or Claude Project each participant creates at the start. It explains ideas, drafts instructions, and critiques their work when they paste the prompts from this guide. |
| **You (facilitator)** | Short live demos on the projector, walk the room, fix login/tool problems, keep time, raise the quality bar, run Demo Day. |
| **Roadmap (website)** | The checklist of activities, links, and the decision tree. Participants mark tasks complete as they finish. |

**Rule of thumb:** If someone asks “what is an agent?” — send them to ask their Teacher Agent first. If someone says “my Project won’t save” — that is your job.

**Hands-on time:** More than half of every block should be participants typing and testing, not listening.

**One spine all day:** They create one Teacher Agent and choose **one business process**. Everything after that builds on that same process. Do not let them start five different toy projects.

---

## 3. Before the workshop (you prepare)

Send this to participants about **48 hours before**:

1. Create an account on **ChatGPT** (with Projects) **or** **Claude** (with Projects). One is enough as the home base.
2. Optionally create accounts for one more tool they may compare later: Gemini, Perplexity, or NotebookLM.
3. Bring **1–3 work documents** they are allowed to use (policy excerpt, SOP, FAQ, report). No confidential data they cannot show on a laptop in class.
4. Write one sentence naming a **painful, repetitive work process** (example: “Every Monday I collect status updates from three people and rewrite them into a client email”).
5. Log into the workshop roadmap URL once so login problems are fixed early.
6. Open the shared Miro/Mural link if you send one.

**You should also prepare:**

- Roadmap published with today’s sessions/tasks.
- Shared Miro or Mural board with blank templates: process map, AI roles, harness card.
- This guide’s prompts available as a shared doc or roadmap link (so people can copy-paste).
- One **demo workflow you can run live** (example: a form response → AI summary → draft message → you click approve). Prefer a template people can clone later (n8n, Zapier, or Make) rather than building automation from an empty screen.
- Backup plan if Wi‑Fi fails: phone hotspot; “ChatGPT + Claude only” track.

---

## 4. How you check work (whole day)

After each activity, use this **30-second check** at a few desks:

1. “Show me what you built.”
2. “What problem does this solve at work?”
3. “What must a human still approve?”
4. If those answers are clear: “Mark this roadmap task complete.”

At mid-points, glance at the Miro board. At the end, they must **trigger the workflow live** (or show a recording from the last few minutes).

---

## 5. Day schedule

| When | Block | Length | What participants leave with |
| ---- | ----- | ------ | ---------------------------- |
| Start | Opening — hire Teacher Agent | 25 min | Teacher Agent Project working |
| Morning | Section 1 — Work WITH AI | 85 min | Better prompting + tool sense + **today’s process chosen** |
| | Break | 15 min | |
| Mid | Section 2 — Work THROUGH AI | 100 min | Process map + pattern + assistant + first **running** automation path |
| | Break or lunch | 15–60 min | |
| Afternoon | Section 3 — Work BY AI | ~110 min | Workforce + harness + failure fixes + **shipped run** + Demo Day |

**If you are running late:** Cut your talking first. Never cut Demo Day or the final live run.

---

# OPENING — Hire the Workshop Teacher Agent (25 minutes)

## Goal

Every participant has a Project named something like **“Workshop Teacher — Agentic AI”**. That Project stays open all day. It is their private tutor. You are their build coach.

## Minute 0–3 — What you say

Say something close to this:

> “I will not lecture agentic AI for an hour. You will hire a **Teacher Agent** that teaches you. I will help you build and fix things. The website roadmap is your checklist. By the end of today you should leave with **one real work process that actually runs** — not just notes.”

Open the roadmap on the projector and show where Session 1 starts. Show where the shared prompt document lives (if separate from this guide).

## Minute 3–21 — What participants do (you walk the room)

### Step 1 — Create the Project

Ask everyone to open ChatGPT or Claude and create a **Project** (not a normal one-off chat).

- Name it: `Workshop Teacher — Agentic AI`
- If someone cannot find Projects: help them. If their plan does not support Projects, use a Custom GPT / Gem, or a normal chat where they paste the instructions at the top of every important message. Prefer Projects when possible.

### Step 2 — Give the Teacher its job description

Have them open **Project instructions** (sometimes called custom instructions / system prompt for the Project) and paste **exactly** this:

```text
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
7) End important answers with: “Next build step: …” (one concrete action).

ETCSLV (learner’s harness checklist):
E Execution — multiple reasoning steps or loops?
T Tools — interact with external systems?
C Context — what must AI always know?
S State — what must persist beyond one chat?
L Limits — boundaries, approvals, safeguards?
V Validation — how do we know it’s correct?

Pattern ladder (simplest → complex):
Instruction-only chat → Knowledge assistant → Single workflow agent → Multi-agent workflow → Automation pipeline
```

### Step 3 — Introduce themselves to the Teacher

In the Project chat, they paste this message (they fill the brackets):

```text
I am starting the workshop now.
My role: [e.g. HR Business Partner / Marketing Manager / Operations Lead]
My organization type: [e.g. education company / fintech / agency / NGO]
The painful process I might automate today: [1–2 sentences about a real repetitive task]

Confirm you understand your teaching role.
Then explain in 6 bullets how today will grow from “work WITH AI” to “work BY AI.”
Ask me 3 clarifying questions about my process so you can coach me all day.
```

They should answer the Teacher’s three questions briefly.

### Step 4 — Quick understanding check

They ask:

```text
Explain chat vs assistant vs agent in my job as [their role] in 5 short bullets.
```

They bookmark / pin that answer if the tool allows.

### Step 5 — Mark progress

They mark the roadmap task for Teacher Agent as complete.

**While they work, you only rescue:** wrong account, cannot find Projects, paste failed, “I’m in a normal chat by mistake.” Do not start teaching theory from the front.

## Minute 21–25 — Checkpoint

Ask two volunteers to read **one sentence** their Teacher used to define “agent.”

Then say:

> “Keep this Teacher Project open all day. When you need an explanation, ask the Teacher. When you need to build something that ships, I will help you.”

### Done when

- Project exists with the long instructions pasted.
- First conversation happened.
- They can get a plain-language answer about chat vs assistant vs agent.

---

# SECTION 1 — Work WITH AI (about 85 minutes)

## Section goal in plain language

By the end of this section, participants should:

1. Know how to give AI a stable job (not only one-off questions).
2. Improve a weak prompt into a stronger one.
3. Compare tools for **fit**, without trying to master every product.
4. Upload documents so AI answers from their material.
5. **Choose the one work process** they will automate for the rest of the day.

---

## Node 1 — Brief your first AI worker (22 minutes)

### Goal

Each person creates a second Project (or a clearly named mode) that acts like their **Executive Assistant** for daily coordination work — with rules so it does not invent facts.

### Demo — 5 minutes (what you actually show)

Do this on the projector so the difference is obvious.

**Part A — Weak chat (the bad way many people work today)**  
Open a normal empty chat. Paste a messy pile of notes that look like a real morning inbox, for example:

```text
- boss asked for Q2 hiring update, unclear deadline
- client Nazia wants deck by Thu??
- Slack from finance about invoice stuck
- interview candidate no-show yesterday
- need to prep 1:1 with Rahim
```

Ask the empty chat only: `Help me with my morning.`

The answer will usually be generic (“prioritize your tasks… stay organized…”). Point at the screen and say:

> “This is weak chat. Same powerful model — but no job design. It does not know who you are, what ‘done’ looks like, or that it must not invent meetings.”

**Part B — Same messy notes, better job design**  
Open (or quickly create) an Executive Assistant Project with short instructions such as:

```text
You are my executive assistant.
Priorities: people issues first, then client deadlines, then internal admin.
Every morning: turn my pasted notes into a Top 5 action list with owner and next step.
Tone: concise bullets.
Never invent meetings, names, or deadlines.
If information is missing, ask me one clarifying question instead of guessing.
Ask before drafting any external email.
```

Paste the **same** messy notes. Show that the output is more useful — and then deliberately ask it to invent a meeting that was not in the notes, so the class sees why the “never invent” rule matters.

Say:

> “You did not install new software. You hired a role. Job design beats hoping the model magically understands you.”

### Participants — 14 minutes (exactly what they do)

**1.** Go back to the **Teacher Agent** Project and paste:

```text
Draft copy-paste Project instructions for my Executive Assistant.
Role context: [paste 3–6 lines about their real job and priorities]
Must include: priorities, tone, output format, “never invent facts,” and when to ask before acting.
Keep under 200 words.
Then give me one sample morning input I can paste to test it.
```

**2.** Create a **new** Project named like `My Work EA — [Name]`. Prefer a separate Project from the Teacher. Paste the Teacher’s drafted instructions into this new Project’s instructions. Edit anything that feels wrong for their real job.

**3.** Run one **real morning-style task**.  
Explain to the room what this means (do not leave it vague):

> “A real morning task means: paste something from your actual work life into the EA — today’s rough notes, a messy email thread summary, a Slack dump, or your calendar chaos — and ask the EA to produce a useful Top 5 action list. If you truly have nothing personal you can share, use the sample morning input the Teacher just gave you, then replace it with real notes after the break.”

They should get one usable output on screen.

**4.** Return to the Teacher Agent and paste:

```text
Here are my Executive Assistant instructions:
[paste]

Critique them for reliability.
What is missing?
Rewrite only the weak parts.
```

They apply one improvement.

### Reflect — 3 minutes

Pairs show each other one bullet from the EA output. Mark roadmap complete.

### You check

Instructions mention role/priorities, tone, “never invent,” and when to ask before acting. They have at least one successful test run.

---

## Node 2 — Prompt bake-off (18 minutes)

### Goal

Participants feel the difference between a lazy prompt and a structured prompt — by rewriting one example and running both.

### Demo — 4 minutes

On the projector, run these two prompts on the same tool and compare.

**Weak:**

```text
Write feedback for my team member.
```

**Stronger:**

```text
Role: You are an HR-aware people manager.
Context: B2B services team that values clarity and ownership.
Task: Draft developmental feedback for [Name], role [Role].
Format: 3 bullets — Strength / Gap / Next 30 days action.
Constraints: under 120 words, no clichés, no invented metrics.
If details are missing, ask me before drafting.
```

Stop after the comparison. Do not lecture five prompt frameworks verbally — the Teacher will do that in the exercise.

### Participants — 12 minutes

**1.** In the Teacher Agent, paste:

```text
Here is a weak prompt: [paste one weak prompt from their work, or use: “Write a weekly update for my client.”]
Rewrite it using: role + context + task + format + constraints + verify step.
Show BEFORE vs AFTER.
Tell me which single change will improve quality most.
```

**2.** Run the **before** prompt and the **after** prompt in their EA or a normal chat. Notice the difference.

**3.** Save both versions in their notes or roadmap task notes.

### Reflect — 2 minutes

Quick poll: “Which one line changed the output most — role, format, or constraints?”

### You check

They have one before/after pair. The “after” includes role, task, and format or constraints.

---

## Node 3 — Tool fit sprint (20 minutes)

### Goal

Participants learn that tools have different strengths. They do **not** need to master five products. They browse briefly, then commit to a small stack for the rest of the day.

### What you say before they start

> “For about fifteen minutes you may compare tools. For the rest of the day you will ship with at most two or three. Demo Day is not a tool zoo. It is a re-run of the stack you already used for your process.”

### Demo — 4 minutes

Take **one** short prompt and run it in **two** tools only (for example ChatGPT and Perplexity). Ask the class what differed: tone, citations, length, confidence. Say: “There is no permanent winner — only fit for the task.”

### Participants — 14 minutes

**1.** In the Teacher Agent, paste:

```text
Task I need to do: [paste one concrete task from their work]
Recommend exactly 2 tools from: ChatGPT, Claude, Gemini, Perplexity, NotebookLM.
For each: best for / weak for / 1 risk.
Give me one identical test prompt to run in both.
```

**2.** Run that identical test prompt in the two recommended tools (optional third if they are fast).

**3.** Fill a tiny scorecard (Miro sticky or notes):

| Tool | Speed | Quality | Citations / grounding | Ease |
| ---- | ----- | ------- | --------------------- | ---- |
| A | | | | |
| B | | | | |

### Reflect — 2 minutes

Ask: “Would your winning tool win for every task?” The honest answer should be no.

### You check

They scored at least two tools on one task. They are not trying to use five tools for the final product.

---

## Node 4 — Memory + choose today’s process (25 minutes)

### Goal

1. Experience AI grounded in **their documents**.  
2. Lock the **one process** they will build for the rest of the day.

### Demo — 4 minutes

On the projector:

1. Open NotebookLM (or a Project with file upload).
2. Upload a short sample PDF (handbook excerpt or FAQ).
3. Ask a question that **is** in the document. Show a grounded answer.
4. Ask a trap question that is **not** in the document. Show that a good setup admits “not in sources” instead of inventing policy.

Say:

> “Memory is not magic. Memory is documents plus instructions plus the discipline to notice when the answer is ungrounded.”

### Participants — 18 minutes

**1.** Upload 1–2 allowed work documents into NotebookLM or into a Project with files.

**2.** Ask two questions that should be answerable from the docs, and one trap question that should not. Note what happened.

**3.** Choose today’s process and post it on Miro using this format:

```text
Process name: …
Why it is painful: …
Who owns it: …
Success today looks like: …
```

Help them slice. Bad: “Automate all of HR.” Good: “Turn weekly team bullets into a client status email draft I still approve.”

**4.** Ask the Teacher Agent:

```text
Process I want to automate today: [paste the Miro text]
Docs I can use: [list filenames or say “none yet”]
Answer:
1) Good one-day candidate? Yes/No
2) If No, propose a smaller slice
3) Simplest pattern on the ladder
4) What must stay human (Limits)
5) How we’ll validate done (Validation)
```

If the Teacher says the process is too big, they must accept a smaller slice before the break.

### Reflect — 3 minutes

Everyone’s process is visible on Miro. You scan for monsters and force slices out loud if needed.

### Break — 15 minutes

---

# SECTION 2 — Work THROUGH AI (about 100 minutes)

## Section goal in plain language

They take the process chosen in Section 1 and:

1. Map the steps on Miro.
2. Choose the simplest AI pattern (using the roadmap decision tree).
3. Build the “brain” — reusable instructions and output format.
4. Connect a **running** path: trigger → AI → output → approval.

---

## Framing — 5 minutes

### You — 2 minutes

Draw or show this ladder once:

```text
Instruction-only chat
   → Knowledge assistant (answers from your docs)
   → Single workflow agent (multi-step, one job)
   → Multi-agent workflow (handoffs between roles)
   → Automation pipeline (trigger + systems)
```

Say:

> “Climb only as high as your process needs. Most people today should ship around knowledge assistant or single workflow, plus a light automation path.”

### Participants — 3 minutes

In the Teacher Agent:

```text
Using MY process: [paste]
Explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
```

No long lecture from you.

---

## Node 1 — Map the process on Miro (18 minutes)

### Goal

A simple map of 6–8 steps for their process, tagged by who/what should do each step, plus first answers to the ETCSLV checklist.

### What the colored tags mean (explain once)

- **Green (LLM thinking):** drafting, summarizing, brainstorming, rewriting.
- **Blue (rules / automation):** forms, reminders, moving data, triggers.
- **Red (human only):** legal judgment, people conflicts, money, sending to a client/boss without review.

### Demo — 3 minutes

On Miro, quickly map “Weekly client report” in 6–8 boxes. Tag each box green/blue/red. Say one sentence for Limits (“manager approves before send”) and Validation (“checklist before publish”).

### Participants — 14 minutes

**1.** Duplicate the Miro template. Map **their** process in at most 8 steps.  
**2.** Tag each step green / blue / red.  
**3.** Paste the map as text into the Teacher Agent:

```text
Here is my workflow map (steps + green/blue/red tags):
[paste]

Produce ETCSLV answers as 6 short bullets (E, T, C, S, L, V).
Flag anything vague and ask me to tighten Limits and Validation.
```

They edit the Teacher’s draft until Limits and Validation are specific (not “be careful”).

### Reflect — 1 minute

Sticky note: “Hardest ETCSLV letter was ___.”

### You check

Map exists. At least one green and one red step. Limits and Validation are not generic fluff.

---

## Node 2 — Choose the pattern with the decision tree (15 minutes)

### Goal

Lock today’s build pattern so people stop fantasizing about giant multi-agent systems they cannot finish today.

### Demo — 3 minutes

Pick one volunteer’s process. On the projector, open the roadmap **Decision Tree**, answer the questions live, and read the result card (pattern + recommendation).

### Participants — 10 minutes

**1.** Open the roadmap Decision Tree and complete it for **their** process.  
**2.** Paste the result into the Teacher Agent:

```text
Decision tree result: [paste the type and recommendation]
My process: [paste]
Defend or challenge the result.
State the simplest build plan for the next 90 minutes in 5 steps.
```

**3.** Put a Miro sticky: `Today we build: [pattern name]`.

### Reflect — 2 minutes

Celebrate anyone told to build something **simpler** than they expected.

### You check

Pattern is locked and realistic for one afternoon.

---

## Node 3 — Build the workflow brain (28 minutes)

### Goal

Create the reusable assistant/instructions that will power today’s process — fixed input expectations and fixed output shape. This is not a new random toy; it is the brain of the process they already chose.

### Demo — 4 minutes

Build (or open) a “Weekly Status Report Assistant” with:

- fixed sections such as Done / Blocked / Next week,
- one example of a good past report uploaded or pasted,
- a rule: if bullets are missing, ask before drafting.

Run it once with sample bullets.

### Participants — 22 minutes

**1.** Ask the Teacher Agent:

```text
Locked pattern: [paste]
Process: [paste]
ETCSLV: [paste their six bullets]

Write:
1) System instructions (copy-paste ready)
2) Input contract (what I must provide each time)
3) Output contract (exact format)
4) Failure behavior (missing info, out-of-scope, low confidence)
Keep it maintainable by a non-engineer.
```

**2.** Put those instructions into the right place for their pattern:

- reusable Project / Custom GPT, and/or
- NotebookLM notebook if the pattern is knowledge-heavy.

**3.** Test twice:

- **Happy path:** clean, complete input.
- **Messy path:** missing details — does it ask instead of inventing?

**4.** Ask the Teacher to critique once, then apply one fix.

### Reflect — 2 minutes

On Miro, write: “Still requires a human: ___.” This feeds Limits later.

### You check

Assistant runs twice. Output format is stable. A human gate is named.

---

## Node 4 — Automation path that can run (34 minutes)

### Goal

Move from “I have a good assistant” to “I can start the work, get an AI result, and land it somewhere useful — with approval.”

### Demo — 6 minutes

Run your prepared example on the projector:

1. Trigger (Google Form, email, or sheet row).
2. AI step (summary or draft using a clear prompt).
3. Output (Slack message, email draft, or Doc).
4. Human approval before anything external is final.

Name which tool you are using today (n8n / Zapier / Make / simpler sheet-based path). Prefer showing a **cloneable template**, not building from a blank canvas.

### Also introduce cost awareness here (2 minutes inside the demo if needed)

Say:

> “Do not use an expensive high-reasoning model for a cheap formatting job. Mark easy steps as low cost and hard judgment steps as high cost. If you use API keys later at work, keep them in a secret store — never in Miro, chat, or the roadmap.”

Optional table on a slide or Miro:

| Kind of step | Model choice |
| ------------ | ------------ |
| Format, extract, tag, clear classify | Smaller / faster / cheaper |
| Ambiguous planning or hard synthesis | Stronger / costlier |
| External or high-stakes message | Stronger model + human approval |

### Participants — 24 minutes — choose a track

#### Track A — Preferred: no-code automation

1. Clone your template, or build the minimum path: Trigger → AI step → Output.
2. Put their workflow-brain instructions into the AI step (or have the automation drop text into a place their assistant already understands).
3. Run once with sample/dummy data end-to-end.
4. Ask the Teacher Agent:

```text
My automation path:
Trigger = [what starts it]
AI step = [what the model does]
Output = [where the result goes]
Approval = [who approves what]

List Tools (T), Limits (L), Validation (V).
List top 3 ways this breaks on Monday and one fix each.
```

#### Track B — If automation tools are blocked

This still counts if they can **live-run** it:

1. Write the trigger checklist on Miro (“Every Monday at 10:00 I gather X”).
2. Run the assistant to produce the artifact.
3. Human copies/sends only after review.
4. Optional: a form or sheet that only collects inputs.

### Reflect — 4 minutes

Three volunteers show the **run on screen**, not an architecture diagram.

### You check

You saw evidence of a run. Limits and Validation are written.

### Break or lunch

---

# SECTION 3 — Work BY AI (about 110 minutes)

## Section goal in plain language

They manage the same workflow like a small AI team: minimum roles, a harness (operating rules), intentional failure tests, then ship and demo the live run.

---

## Framing — 4 minutes

Say:

> “You are the manager. AI roles are workers. The Harness Card is the job description. Failure Lab is what Monday will feel like. Then we ship.”

Participants ask the Teacher Agent:

```text
In 5 bullets: what it means to manage AI workers for my process (not merely to “prompt better”).
Include: role design, handoffs, approvals, evaluation.
```

---

## Node 1 — AI workforce on Miro (15 minutes)

### Goal

A simple Miro roster of AI roles for **this** process — fewer roles is better — plus one human approval point.

### Demo — 2 minutes

Show an example chain on Miro:

`Planner → Researcher → Writer → Reviewer → Human approval`

### Participants — 11 minutes

**1.** On Miro, place 3–5 AI roles for their process and mark where the human sits.  
**2.** Ask the Teacher Agent:

```text
Proposed AI roles: [paste]
My pattern: [paste]
Cut to the minimum roles needed today.
Show final roster + what each receives/produces + where Human sits.
```

**3.** Update Miro to the smaller roster.

### You check

Handoffs are clear. External or high-risk steps have a human.

---

## Node 2 — Harness Card (15 minutes)

### Goal

Complete an operating card so Monday is not vibes-based.

### What each field means (say this while they fill)

| Field | Plain meaning |
| ----- | ------------- |
| Workflow | What process is this? |
| Execution (E) | Does it need multiple reasoning steps or loops? |
| Tools (T) | Which systems and which model cost tier ($ vs $$$)? |
| Context (C) | What must the AI always know (docs, tone, audience)? |
| State (S) | What must persist beyond one chat (files, sheet, memory)? |
| Limits (L) | What must it never do? Who approves external actions? |
| Validation (V) | How do we know the output is acceptable? |

### Demo — 2 minutes

Fill one example harness on Miro for “Weekly competitor brief.”

### Participants — 11 minutes

Fill their harness on Miro (or a linked doc). Then ask the Teacher:

```text
Here is my Harness Card: [paste all fields]
Critique Limits and Validation first.
Rewrite weak fields to be specific and testable.
```

Apply the rewrite.

### You check

Limits and Validation are specific enough to test.

---

## Node 3 — Failure Lab (18 minutes)

### Goal

Break their own workflow on purpose, then harden it. This builds trust more than another happy-path demo.

### The five failure types (explain once)

1. **Missing context** — run it with empty or incomplete input.  
2. **Hallucination** — ask for facts not in the sources.  
3. **Wrong tool** — force a spreadsheet-style job into chat-only.  
4. **No approval** — imagine sending externally with no human gate.  
5. **Doom loop** — a step that retriggers itself forever.

### Demo — 3 minutes

Break your own demo once (missing context is easiest). Show what a good fix looks like in instructions (“If input is empty, stop and ask”).

### Participants — 12 minutes

On **their** running workflow, trigger **two** failures. For each, write on Miro:

```text
What broke:
Why:
Fix we applied:
```

If stuck, ask the Teacher:

```text
I will break my workflow with: [failure type]
Give me exact steps to trigger it, what I should observe, and how to fix instructions or automation.
```

Update Harness Limits/Validation after the fixes.

### You check

At least one fix is visible in instructions or in the automation path.

---

## Node 4 — Capstone: ship the real workflow (38 minutes)

### Goal

Finish and re-run the **same** business process end-to-end.  
This is **not** “make a PowerPoint about the idea.”  
This is “make it run twice on your machine.”

### Post this definition of done on Miro / projector

- [ ] Trigger is defined and was used at least once  
- [ ] AI step uses their instructions and context  
- [ ] Output lands where real work goes (Doc, Sheet, email draft, Slack, ticket, etc.)  
- [ ] Human approval exists before external send when relevant  
- [ ] Harness Limits and Validation match what they built  
- [ ] They can re-run without you standing beside them  

### Participants — about 32 minutes

1. Close gaps found in Failure Lab.  
2. Re-run the happy path **twice**.  
3. Ask the Teacher Agent for a spoken demo script:

```text
Write a 60-second spoken script for Demo Day.
I must: name the pain, trigger the run, show output, name the human approval, name one failure we fixed.
No slide language. Sound like a manager, not a vendor.
```

4. Optional: one Miro frame with a screenshot of the run (before → after). Slides are optional support only.

### What you do

Walk desks only. Kill scope creep with:

> “Ship the slice you can re-run in the next ten minutes.”

### You check

Live re-run works. Most definition-of-done boxes are green.

---

## Node 5 — Demo Day (20–25 minutes)

### Goal

Public proof. Show the run, not a presentation performance.

### Timing

| Time | What happens |
| ---- | ------------ |
| 2 min | Rules: about 3 minutes per team; must trigger live or show a recording from the last 10 minutes |
| ~3 min × teams | Pain → live run → who approves → one risk fixed |
| 3 min | Peer votes: Most practical · Safest · Best time saved |
| 3 min | Your closing + 30-day challenge |

If there are too many teams: gallery walk + 90-second lightning runs + vote.

### Closing — what you say

> “On Monday, run this workflow once without this room. Keep the Teacher Agent as your coach. Improve Validation next. Only add more complexity when the decision tree says you need it.”

Optional Teacher prompt for take-home:

```text
Based on everything today, give me a 30-day plan:
Week 1 run ritual, Week 2 improve Validation, Week 3 optional second automation or cheaper models on easy steps, Week 4 review harness with my team.
Keep under 150 words.
```

Mark Demo Day and workshop complete on the roadmap.

---

# Appendix A — Quick timing map

| Block | Approx. time | Bias |
| ----- | ------------ | ---- |
| Opening — Teacher Agent | 25 min | Hands-on |
| Section 1 — WITH | 85 min | Hands-on |
| Section 2 — THROUGH | 100 min | Hands-on |
| Section 3 — BY + Demo | 110 min | Hands-on |
| Breaks | 2 × 15 min (+ lunch if scheduled) | |

---

# Appendix B — Suggested roadmap node titles

| Session | Title | Nodes |
| ------- | ----- | ----- |
| 1 | Work WITH AI | Teacher Agent · First Worker · Prompt Bake-Off · Tool Fit · Memory + Process Choice |
| 2 | Work THROUGH AI | Miro Map · Decision Tree · Workflow Brain · Automation Path |
| 3 | Work BY AI | Workforce (Miro) · Harness · Failure Lab · Ship Workflow · Demo Day |

Use task type `project` for builds, `attend` for Demo Day, and short `written` notes only for harness/ETCSLV.

---

# Appendix C — Facilitator do / don’t

**Do**

- Send theory questions to the Teacher Agent first.
- Keep demos short; spend time unblocking people.
- Force process slices that can ship today.
- Require a live run before calling something “done.”
- Keep maps, workforce, and harness on Miro/Mural.

**Don’t**

- Restart a new toy project in Section 2 — escalate the same process.
- Accept a slide deck as the capstone without a run.
- Teach automation from a blank canvas unless someone is clearly advanced.
- Turn Demo Day into slide theater.

---

# Appendix D — If things go wrong

| Problem | What you do |
| ------- | ----------- |
| Wi‑Fi or tool blocked | Use Track B semi-automation; still require a live assistant run |
| Process too big | Slice to one trigger, one AI step, one output |
| Automation clone fails | Form/sheet collects input → assistant drafts → human sends; that can still count as a run |
| Too many teams for Demo Day | 90-second lightning demos |
| Teacher Agent answers poorly | Re-paste the Opening system instructions; ask again more specifically |

---

# Appendix E — All Teacher prompts in one place

These are the same prompts already written into the sections above. Keep this appendix as a single copy-paste sheet for the shared participant doc.

### E1 — Teacher system instructions (Project instructions)

```text
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
7) End important answers with: “Next build step: …” (one concrete action).

ETCSLV (learner’s harness checklist):
E Execution — multiple reasoning steps or loops?
T Tools — interact with external systems?
C Context — what must AI always know?
S State — what must persist beyond one chat?
L Limits — boundaries, approvals, safeguards?
V Validation — how do we know it’s correct?

Pattern ladder (simplest → complex):
Instruction-only chat → Knowledge assistant → Single workflow agent → Multi-agent workflow → Automation pipeline
```

### E2 — Day contract

```text
I am starting the workshop now.
My role: [ROLE]
My organization type: [e.g. HR / marketing / ops / founder]
The painful process I might automate today: [1–2 sentences]

Confirm you understand your teaching role.
Then explain in 6 bullets how today will grow from “work WITH AI” to “work BY AI.”
Ask me 3 clarifying questions about my process so you can coach me all day.
```

### E3 — Executive Assistant draft

```text
Draft copy-paste Project instructions for my Executive Assistant.
Role context: [paste]
Must include: priorities, tone, output format, “never invent facts,” and when to ask before acting.
Keep under 200 words.
Then give me one sample morning input I can paste to test it.
```

### E4 — Prompt rewrite

```text
Here is a weak prompt: [paste]
Rewrite it using: role + context + task + format + constraints + verify step.
Show BEFORE vs AFTER.
Tell me which single change will improve quality most.
```

### E5 — Tool fit

```text
Task I need to do: [paste]
Recommend exactly 2 tools from: ChatGPT, Claude, Gemini, Perplexity, NotebookLM.
For each: best for / weak for / 1 risk.
Give me one identical test prompt to run in both.
```

### E6 — Process candidate check

```text
Process I want to automate today: [paste]
Docs I can use: [list]
Answer:
1) Good one-day candidate? Yes/No
2) If No, propose a smaller slice
3) Simplest pattern on the ladder
4) What must stay human (Limits)
5) How we’ll validate done (Validation)
```

### E7 — Ladder in my context

```text
Using MY process: [paste]
Explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
```

### E8 — ETCSLV from map

```text
Here is my workflow map (steps + green/blue/red tags):
[paste]

Produce ETCSLV answers as 6 short bullets (E, T, C, S, L, V).
Flag anything vague and ask me to tighten Limits and Validation.
```

### E9 — Decision tree challenge

```text
Decision tree result: [paste type and recommendation]
My process: [paste]
Defend or challenge the result.
State the simplest build plan for the next 90 minutes in 5 steps.
```

### E10 — Workflow brain

```text
Locked pattern: [paste]
Process: [paste]
ETCSLV: [paste]

Write:
1) System instructions (copy-paste)
2) Input contract (what I must provide)
3) Output contract (exact format)
4) Failure behavior (missing info, out-of-scope, low confidence)
Keep it maintainable by a non-engineer.
```

### E11 — Automation T / L / V

```text
My automation path:
Trigger = [ ]
AI step = [ ]
Output = [ ]
Approval = [ ]

List Tools (T), Limits (L), Validation (V).
List top 3 ways this breaks on Monday and one fix each.
```

### E12 — Manager mindset

```text
In 5 bullets: what it means to manage AI workers for my process (not merely to “prompt better”).
Include: role design, handoffs, approvals, evaluation.
```

### E13 — Cut the roster

```text
Proposed AI roles: [paste]
My pattern: [paste]
Cut to the minimum roles needed today.
Show final roster + what each receives/produces + where Human sits.
```

### E14 — Harness critique

```text
Here is my Harness Card: [paste]
Critique Limits and Validation first.
Rewrite weak fields to be specific and testable.
```

### E15 — Failure lab coach

```text
I will break my workflow with: [failure type]
Give me exact steps to trigger it, what I should observe, and how to fix instructions or automation.
```

### E16 — Demo Day script

```text
Write a 60-second spoken script for Demo Day.
I must: name the pain, trigger the run, show output, name the human approval, name one failure we fixed.
No slide language. Sound like a manager, not a vendor.
```

### E17 — 30-day plan

```text
Based on everything today, give me a 30-day plan:
Week 1 run ritual, Week 2 improve Validation, Week 3 optional second automation or cheaper models on easy steps, Week 4 review harness with my team.
Keep under 150 words.
```

---

*Document version: 2026-07-23 · Facilitator-facing runbook · Teacher-Agent–led · Product of the day: one running workflow*
