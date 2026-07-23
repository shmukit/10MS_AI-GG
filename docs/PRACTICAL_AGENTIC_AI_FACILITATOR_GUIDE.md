# Practical Agentic AI for Productivity
## Build Your Personal AI Workforce in One Day — Facilitator Runbook

This document is written for **you, the facilitator**. Read it as a step-by-step script. Every activity explains: what you say, what you show, what participants type, and how you know they are done.

**How to read each node**

- **Facilitator demo** — You do this on the projector. Participants watch. They do not follow along yet.
- **Participant activity** — They do this on their laptops (and sometimes pen and paper).
- **Reflect / check** — Short share + what “done” looks like.

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

> Something starts the work (a form, an email, a checklist, a pasted note) → AI does a clear step → the result appears where work actually goes (Google Doc, Sheet, email draft, Slack, Slides, etc.) → a human still approves anything external or high-risk.

That running path is the product. Notes alone are **not** enough.

---

## 2. The only three digital surfaces (keep it simple)

Participants should mostly live in **three places**:

| Surface | Purpose |
| ------- | ------- |
| **1. Workshop PPT / Google Slides (agenda deck)** | “Where we are” — you advance this on the projector |
| **2. AI tools on their laptop** | Teacher Agent, Work EA, NotebookLM, automation, multimodal tools |
| **3. Roadmap website** | Checklist, decision tree, mark tasks complete |

**Working notes for maps / harness / roles:**  
Each person (or team) gets a **personal copy of a Google Slides “Working Pack”** (File → Make a copy). They fill tables on those slides.  
**Backup:** pen and paper using the same table layouts; photo the page at Demo Day if needed.

**Do not use Miro or Mural.** Extra boards split attention and need paid features you may not have.

---

## 3. How teaching works in this room

| Helper | What it does |
| ------ | ------------ |
| **Teacher Agent** | A ChatGPT or Claude **Project** each person creates at the start. It explains ideas, drafts text, and critiques their work when they paste prompts from this guide. |
| **You (facilitator)** | Short demos, walk the room, fix logins, keep time, quality bar, Demo Day. |
| **Roadmap (website)** | Activity checklist + decision tree. |

**Rule of thumb:** Theory question → ask the Teacher Agent first. Broken login / Project settings → you help.

**Hands-on:** More than half of every block should be them typing and testing.

**One spine:** One Teacher Agent + **one business process** all day. Do not let them start five toy projects.

---

## 4. Before the workshop

### Message to participants (~48 hours before)

Ask them to complete **before the night of the workshop** (not during class):

1. **Home base:** ChatGPT (Projects) **or** Claude (Projects).
2. **Knowledge / research (pick at least one):** NotebookLM and/or Perplexity and/or Gemini.
3. **Multimodal menu (create accounts now; they will only use 2–3 tomorrow):**  
   Suggest a short menu you actually support, for example:
   - Slides / docs: Gamma **or** Google Slides / Docs AI features  
   - Image: ChatGPT images / Gemini images / one image tool you choose  
   - Voice (optional): one voice tool you choose  
   - Analysis: ChatGPT/Claude with a CSV **or** a spreadsheet AI add-on  
   - UI / web mock (optional): one lightweight mock tool **or** “describe UI in ChatGPT + screenshot”  
4. Bring **1–3 work documents** they are allowed to use.
5. Write one sentence naming a **painful repetitive process**.
6. Log into the roadmap URL once.
7. Open the **Working Pack** Google Slides link and **Make a copy** titled `Agentic AI Working Pack — [Their Name]`.

### What you prepare

See **Appendix F — Facilitator toolkit & templates** at the end (accounts, demo scripts, template structures, Working Pack slides).

---

## 5. How you check work

After each activity, at a few desks:

1. “Show me what you built.”
2. “What problem does this solve at work?”
3. “What must a human still approve?”
4. If clear → “Mark this roadmap task complete.”

Mid-day: glance at their Working Pack slides or paper.  
End of day: they **trigger the workflow live** (or a recording from the last few minutes).

---

## 6. Day schedule

| When | Block | Length | They leave with |
| ---- | ----- | ------ | --------------- |
| Start | Opening — hire Teacher Agent | 25 min | Teacher Agent working |
| Morning | Section 1 — Work WITH AI | ~90 min | Prompting + tool stack (max 2–3) + process chosen |
| | Break | 15 min | |
| Mid | Section 2 — Work THROUGH AI | ~100 min | Map + pattern + assistant + first running path |
| | Break / lunch | 15–60 min | |
| Afternoon | Section 3 — Work BY AI | ~110 min | Workforce + harness + failure fixes + ship + Demo Day |

**If late:** Cut your talking first. Never cut Demo Day or the final live run.

---

# OPENING — Hire the Workshop Teacher Agent (25 minutes)

## Goal

Every participant has a Project named **`Workshop Teacher — Agentic AI`**. It stays open all day as their tutor. You are the build coach.

## Facilitator framing (3 minutes)

Say:

> “I will not lecture agentic AI for an hour. You will hire a **Teacher Agent** that teaches you. I will help you build and fix things. The roadmap is your checklist. The agenda slides show where we are. By evening you leave with **one real work process that runs** — not just notes.”

Show: roadmap Session 1 + agenda PPT “You are here: Opening.”

## Participant activity (18 minutes) — you walk the room

### Step 1 — Create the Teacher Project

Open ChatGPT or Claude → create a **Project** (not a normal empty chat).

- Name: `Workshop Teacher — Agentic AI`
- If they cannot use Projects: Custom GPT / Gem, or a normal chat where they paste instructions at the top of important messages.

### Step 2 — Paste the Teacher’s job into Project **settings**

This is **not** a chat message.

1. Open the Project.  
2. Find **Instructions** / **Project instructions** / custom instructions for that Project.  
3. Paste the text below into that settings box and save.

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

### Step 3 — First chat message to the Teacher

In the Project **chat** (not settings), paste:

```text
I am starting the workshop now.
My role: [e.g. HR Business Partner / Marketing Manager / Operations Lead]
My organization type: [e.g. education company / fintech / agency]
The painful process I might automate today: [1–2 sentences]

Confirm you understand your teaching role.
Then explain in 6 bullets how today will grow from “work WITH AI” to “work BY AI.”
Ask me 3 clarifying questions about my process so you can coach me all day.
```

Answer the Teacher’s three questions briefly.

### Step 4 — Quick check

```text
Explain chat vs assistant vs agent in my job as [role] in 5 short bullets.
```

Pin/bookmark if possible. Mark roadmap task complete.

## Reflect / checkpoint (4 minutes)

Two volunteers read one sentence their Teacher used to define “agent.”

You say:

> “Keep this Teacher Project open all day. Explanations → Teacher. Building and shipping → I help you.”

### Done when

Teacher Project exists, instructions are in settings, first chat happened, they can explain chat vs assistant vs agent in plain language.

---

# SECTION 1 — Work WITH AI (~90 minutes)

## Section goal

1. Give AI a stable job (not only one-off chats).  
2. Improve a weak prompt.  
3. See the wider tool landscape, then **commit to at most 2–3 tools** for their workflow.  
4. Use documents as memory.  
5. **Lock the one process** they will ship today.

---

## Node 1 — Brief your first AI worker (22 minutes)

### Goal

Create a second Project that acts like their **Executive Assistant**, with rules so it does not invent facts.

### Facilitator demo (5 minutes) — projector only

**Part A — Weak chat (how many people work today)**  
Open a normal empty chat. Paste messy morning notes:

```text
- boss asked for Q2 hiring update, unclear deadline
- client Nazia wants deck by Thu??
- Slack from finance about invoice stuck
- interview candidate no-show yesterday
- need to prep 1:1 with Rahim
```

Ask only: `Help me with my morning.`

The answer is usually generic. Say:

> “Same powerful model — but no job design. It does not know who you are, what ‘done’ looks like, or that it must not invent meetings.”

**Part B — Same notes, better job design**  
Open your prepared **Work EA** Project with instructions like:

```text
You are my executive assistant.
Priorities: people issues first, then client deadlines, then internal admin.
Every morning: turn my pasted notes into a Top 5 action list with owner and next step.
Tone: concise bullets.
Never invent meetings, names, or deadlines.
If information is missing, ask one clarifying question instead of guessing.
Ask before drafting any external email.
```

Paste the **same** notes. Show a more useful Top 5. Then ask it to invent a meeting that was not in the notes — show why “never invent” matters.

Say:

> “You did not install new software. You hired a role. Job design beats hoping the model magically understands you.”

### Participant activity (14 minutes)

**Important — two different Projects**

| Project | Purpose |
| ------- | ------- |
| `Workshop Teacher — Agentic AI` | Tutor that **writes drafts** for you |
| `My Work EA — [Name]` | The assistant you will **actually use** for morning work |

**Step 1 — Ask the Teacher (chat message inside the Teacher Project)**

Paste this into the Teacher **chat**:

```text
Draft copy-paste Project instructions for my Executive Assistant.
Role context: [paste 3–6 lines about your real job and priorities]
Must include: priorities, tone, output format, “never invent facts,” and when to ask before acting.
Keep under 200 words.
Then give me one sample morning input I can paste to test it.
```

What happens: the Teacher replies with a block of text. That text is a **draft job description**. Participants are **not** done yet.

**Step 2 — Create the Work EA Project and paste into its settings**

1. Create a **new** Project: `My Work EA — [Name]`.  
2. Open **that** Project’s Instructions / settings field.  
3. Paste the Teacher’s draft into **those** settings (edit anything that feels wrong).  
4. Save.

**Step 3 — Run one real morning-style task**

Explain clearly:

> “Paste something from your real work — today’s rough notes, a messy email summary, Slack dump, or calendar chaos — into the Work EA chat. Ask it for a Top 5 action list. If you cannot share real work, use the sample morning input the Teacher gave you, then switch to real notes after the break.”

**Step 4 — Critique once**

Back in the Teacher Project chat:

```text
Here are my Executive Assistant instructions:
[paste what you put in Work EA settings]

Critique them for reliability.
What is missing?
Rewrite only the weak parts.
```

Apply one improvement to the Work EA settings.

### Reflect (3 minutes)

Pairs show one bullet of EA output. Mark roadmap complete.

### Done when

Work EA settings include role, tone, never-invent, approval rule; at least one successful test run.

---

## Node 2 — Prompt bake-off (18 minutes)

### Goal

Feel the difference between a lazy prompt and a structured prompt.

### Facilitator demo (4 minutes) — projector only

Run both on the same tool:

**Weak:** `Write feedback for my team member.`

**Stronger:**

```text
Role: You are an HR-aware people manager.
Context: B2B services team that values clarity and ownership.
Task: Draft developmental feedback for [Name], role [Role].
Format: 3 bullets — Strength / Gap / Next 30 days action.
Constraints: under 120 words, no clichés, no invented metrics.
If details are missing, ask me before drafting.
```

Compare. Stop. No long lecture.

### Participant activity (12 minutes)

**1.** In Teacher chat:

```text
Here is a weak prompt: [paste one weak prompt from work, or: “Write a weekly update for my client.”]
Rewrite it using: role + context + task + format + constraints + verify step.
Show BEFORE vs AFTER.
Tell me which single change will improve quality most.
```

**2.** Run before and after in Work EA or chat.  
**3.** Save both in Working Pack slide “Prompt bake-off” or paper.

### Reflect (2 minutes)

Poll: “Which line changed the output most — role, format, or constraints?”

### Done when

One before/after pair exists; “after” has role + task + format/constraints.

---

## Node 3 — Tool landscape + fit sprint (25 minutes)

### Goal

1. See what kinds of AI tools exist for daily ops (including multimodal).  
2. For **their** workflow, pick **at most 2–3 tools** and try those — not the whole internet.

Accounts should already exist from pre-work. Class time is for **choosing and trying**, not signing up.

### Facilitator demo — landscape overview (8 minutes) — projector only

Walk five “lanes” quickly (one example each). Do **not** make everyone open every tool.

| Lane | Example use | Example tools (pick what you support) |
| ---- | ----------- | -------------------------------------- |
| Chat / reasoning | Draft, plan, critique | ChatGPT, Claude |
| Knowledge / research | Docs Q&A, web with citations | NotebookLM, Perplexity, Gemini |
| Slides / docs | Deck or one-pager from outline | Gamma, Google Slides/Docs AI |
| Image / visual | Diagram, social visual, mock poster | ChatGPT/Gemini images (or your pick) |
| Voice / analysis / UI (light touch) | Voice note → text; CSV ask; UI description | One voice tool; Claude/ChatGPT + CSV; text UI mock |

Say:

> “This is a map of the city. Today you will only drive on the streets that match **your** process. Maximum two or three tools for the workflow you will ship.”

### Facilitator demo — fit, not winners (3 minutes)

Same short prompt in **two** tools. Ask what differed. Say: no permanent winner — only fit.

### Participant activity (12 minutes)

**1.** In Teacher chat (tool picker for **their** process):

```text
My work process for today: [paste one sentence]
The kind of outputs I need (e.g. email draft, slide outline, summary from PDFs, image, sheet analysis): [paste]

From this menu, recommend EXACTLY 2 tools I should try today (3 only if clearly needed):
- ChatGPT
- Claude
- Gemini
- Perplexity
- NotebookLM
- Gamma or Google Slides AI (slides/docs)
- Image generation in ChatGPT or Gemini
- [optional tools you listed in pre-work]

For each tool: best for / weak for / 1 risk.
Give me ONE identical test task I can run in both/all chosen tools.
Remind me: I must not try more than 3 tools today for this process.
```

**2.** Run that identical test in only the recommended 2 (max 3) tools.  
**3.** Fill Working Pack slide “Tool scorecard”:

| Tool | Speed | Quality | Fit to my process | Ease | Keep for today? Y/N |
| ---- | ----- | ------- | ----------------- | ---- | ------------------- |

**4.** Write locked stack on the same slide: `Today’s stack (max 3): …`

### Reflect (2 minutes)

> “Would your winning tool win for every task?” → No.  
> “Did anyone open a fourth tool?” → Close it.

### Done when

Scorecard filled; stack locked at ≤3 tools; those tools match the process they will ship.

---

## Node 4 — Memory + choose today’s process (25 minutes)

### Goal

Ground AI in documents; lock the process for the rest of the day.

### Facilitator demo (4 minutes) — projector only

1. NotebookLM (or Project with files) + short PDF.  
2. Ask a question **in** the doc → grounded answer.  
3. Ask a trap question **not** in the doc → should refuse or say not in sources.

> “Memory is documents + instructions + noticing ungrounded answers — not magic.”

### Participant activity (18 minutes)

**1.** Upload 1–2 allowed docs to NotebookLM or a Project with files.  
**2.** Two grounded questions + one trap.  
**3.** Lock today’s process on Working Pack slide “Process lock” (or paper):

```text
Process name:
Why it is painful:
Who owns it:
Success today looks like:
Tools I will use (max 3):
```

Force slices. Bad: “Automate all of HR.” Good: “Turn weekly team bullets into a client status email draft I still approve.”

**4.** Teacher chat:

```text
Process I want to automate today: [paste Process lock text]
Docs I can use: [list]
Answer:
1) Good one-day candidate? Yes/No
2) If No, propose a smaller slice
3) Simplest pattern on the ladder
4) What must stay human (Limits)
5) How we’ll validate done (Validation)
```

Accept a smaller slice if the Teacher says so.

### Reflect (3 minutes)

2–3 people read their process aloud. You kill overscoped monsters.

### Break — 15 minutes

---

# SECTION 2 — Work THROUGH AI (~100 minutes)

## Section goal

Same process → map → pattern → reusable brain → running path (trigger → AI → output → approval).

---

## Framing (5 minutes)

### Facilitator (2 minutes)

Show the ladder once on a PPT slide:

```text
Instruction-only chat
→ Knowledge assistant (your docs)
→ Single workflow agent
→ Multi-agent workflow
→ Automation pipeline
```

> “Climb only as high as your process needs. Most people ship at knowledge assistant or single workflow, plus a light run path.”

### Participant activity (3 minutes)

Teacher chat:

```text
Using MY process: [paste]
Explain the pattern ladder with one example at each level for THIS process.
Recommend the level I should build today and why not higher.
```

---

## Node 1 — Map the process + learn ETCSLV (22 minutes)

### Goal

1. Understand ETCSLV **before** using it.  
2. Map 6–8 steps for their process.  
3. Fill ETCSLV in their Working Pack; Teacher only critiques.

### What the step tags mean (say once)

- **Green — LLM thinking:** draft, summarize, brainstorm, rewrite.  
- **Blue — rules / automation:** forms, reminders, moving data, triggers.  
- **Red — human only:** legal, people conflict, money, send-to-client without review.

### Facilitator demo — teach ETCSLV first (5 minutes) — projector only

Show the table on a PPT slide and walk **one fully filled example** (“Weekly client report”):

| Letter | Meaning | Core question | Example answer for weekly client report |
| ------ | ------- | ------------- | ---------------------------------------- |
| **E** | Execution | Multiple reasoning steps or loops? | Yes — gather bullets, rewrite, adjust tone |
| **T** | Tools | External systems needed? | Email + Doc; optional sheet of inputs |
| **C** | Context | What must AI always know? | Client name, offer, forbidden claims |
| **S** | State | What persists beyond one chat? | Last week’s report file; client prefs |
| **L** | Limits | Boundaries / approvals? | No send without manager approval; no invented metrics |
| **V** | Validation | How do we know it’s correct? | Checklist: facts cited, tone OK, human signed off |

Say:

> “ETCSLV is your operating checklist for any AI workflow. We fill it after we map steps — not before we understand the letters.”

Then quickly draw 6–8 steps for the same example on a PPT slide or paper under the document camera; tag green/blue/red; point at L and V again.

### Participant activity (14 minutes)

**1.** On Working Pack slide “Process map” (or paper), list **at most 8 steps** for their process.  
**2.** Tag each step green / blue / red.  
**3.** On Working Pack slide “ETCSLV,” fill all six letters in their own words first (empty boxes in the template).  
**4.** Only then, Teacher chat:

```text
Here is my workflow map (steps + green/blue/red tags):
[paste]

Here is my first ETCSLV draft:
E: …
T: …
C: …
S: …
L: …
V: …

Critique vague answers — especially Limits and Validation.
Rewrite only the weak lines so they are specific and testable.
```

Update the Working Pack with the improved L and V.

### Reflect (3 minutes)

“Hardest letter was ___.” Spot-check that L and V are not “be careful.”

### Done when

Map exists; ETCSLV filled; L and V are specific.

---

## Node 2 — Choose the pattern with the decision tree (15 minutes)

### Goal

Lock today’s pattern so people stop fantasizing about unfinished mega-systems.

### Facilitator demo (3 minutes) — projector only

Volunteer process → roadmap Decision Tree live → read result card.

### Participant activity (10 minutes)

**1.** Complete Decision Tree for their process.  
**2.** Teacher chat:

```text
Decision tree result: [paste type and recommendation]
My process: [paste]
Defend or challenge the result.
State the simplest build plan for the next 90 minutes in 5 steps.
```

**3.** Working Pack slide “Pattern lock”: `Today we build: [pattern]`.

### Reflect (2 minutes)

Celebrate anyone told to build **simpler** than expected.

---

## Node 3 — Build the workflow brain (28 minutes)

### Goal

Reusable instructions + input/output contract for **this** process (not a new toy).

### Facilitator demo (4 minutes) — projector only

Show a “Weekly Status Report Assistant”: fixed sections (Done / Blocked / Next week), example past report, rule “ask if bullets missing.” Run once.

### Participant activity (22 minutes)

**1.** Teacher chat:

```text
Locked pattern: [paste]
Process: [paste]
ETCSLV: [paste]

Write:
1) System instructions (copy-paste ready)
2) Input contract (what I must provide each time)
3) Output contract (exact format)
4) Failure behavior (missing info, out-of-scope, low confidence)
Keep it maintainable by a non-engineer.
```

**2.** Put instructions into the right place (Project / GPT / NotebookLM as fits the pattern).  
**3.** Test happy path + messy path.  
**4.** One Teacher critique, one fix.

### Reflect (2 minutes)

Working Pack: “Still requires a human: ___.”

---

## Node 4 — Automation path that can run (34 minutes)

### Goal

Trigger → AI → output → approval — **live once**, not paper architecture.

### Facilitator demo (6 minutes) — projector only

Your prebuilt path: form/email/sheet → AI step → Doc/Slack/email draft → human approve. Prefer a **cloneable** Zapier/Make/n8n template.

Also say (cost routing, 1–2 minutes):

> “Do not use an expensive high-reasoning model for a cheap formatting job. Mark easy steps `$` and hard judgment `$$$` on your process map. API keys at work belong in a secret store — never in chat, slides, or the roadmap.”

| Kind of step | Model choice |
| ------------ | ------------ |
| Format, extract, tag, clear classify | Smaller / faster / cheaper |
| Ambiguous planning or hard synthesis | Stronger / costlier |
| External / high-stakes message | Stronger model + human approval |

### Participant activity (24 minutes)

**Track A — Preferred: no-code automation**  
1. Clone your template or build minimum: Trigger → AI → Output.  
2. Wire their workflow-brain prompt into the AI step.  
3. Run once with sample data.  
4. Teacher chat:

```text
My automation path:
Trigger = [ ]
AI step = [ ]
Output = [ ]
Approval = [ ]

List Tools (T), Limits (L), Validation (V).
List top 3 ways this breaks on Monday and one fix each.
```

**Track B — If automation is blocked**  
Still valid if live-runnable: checklist trigger on Working Pack / paper → assistant produces artifact → human sends after review. Optional form/sheet for inputs only.

### Reflect (4 minutes)

Three people show the **run on screen**.

### Break or lunch

---

# SECTION 3 — Work BY AI (~110 minutes)

## Section goal

Same workflow → minimum AI roles → harness → break it → ship → demo the run.

---

## Framing (4 minutes)

Facilitator:

> “You are the manager. AI roles are workers. The Harness Card is the job description. Failure Lab is Monday. Then we ship.”

Participant — Teacher chat:

```text
In 5 bullets: what it means to manage AI workers for my process (not merely to “prompt better”).
Include: role design, handoffs, approvals, evaluation.
```

---

## Node 1 — AI workforce (15 minutes)

### Goal

Minimum role roster for **this** process + one human gate. Use Working Pack slide or pen and paper.

### Facilitator demo (2 minutes) — projector only

On a PPT slide: `Planner → Researcher → Writer → Reviewer → Human approval`

### Participant activity (11 minutes)

**1.** Working Pack “Workforce” table: 3–5 AI roles + human.  
**2.** Teacher chat:

```text
Proposed AI roles: [paste]
My pattern: [paste]
Cut to the minimum roles needed today.
Show final roster + what each receives/produces + where Human sits.
```

**3.** Shrink the table.

### Done when

Handoffs clear; human on external/high-risk steps.

---

## Node 2 — Harness Card (15 minutes)

### Goal

Operating card that matches what they built (ETCSLV already learned).

### Facilitator demo (2 minutes) — projector only

Fill one example harness on a PPT slide (“Weekly competitor brief”).

### Participant activity (11 minutes)

Complete Working Pack “Harness” slide:

| Field | ETCSLV |
| ----- | ------ |
| Workflow | — |
| Execution | E |
| Tools (+ $ / $$$ models) | T |
| Context | C |
| State | S |
| Limits | L |
| Validation | V |

Teacher chat:

```text
Here is my Harness Card: [paste]
Critique Limits and Validation first.
Rewrite weak fields to be specific and testable.
```

### Done when

L and V are specific enough to test.

---

## Node 3 — Failure Lab (18 minutes)

### Goal

Break their workflow on purpose; harden it.

### Failure types (facilitator explains once)

1. Missing context  
2. Hallucination  
3. Wrong tool  
4. No approval  
5. Doom loop  

### Facilitator demo (3 minutes) — projector only

Break your demo once (empty input is easiest). Show the fix in instructions.

### Participant activity (12 minutes)

Trigger **two** failures on their running workflow. Log on Working Pack / paper:

```text
What broke:
Why:
Fix we applied:
```

If stuck — Teacher chat:

```text
I will break my workflow with: [failure type]
Give me exact steps to trigger it, what I should observe, and how to fix instructions or automation.
```

Update Harness L/V.

---

## Node 4 — Capstone: ship the real workflow (38 minutes)

### Goal

**Not** “make a presentation about the idea.”  
**Yes** — make **this** process run twice on their machine.

### Definition of done (show on agenda PPT)

- [ ] Trigger defined and used  
- [ ] AI step uses their instructions/context  
- [ ] Output lands where real work goes  
- [ ] Human approval before external send when relevant  
- [ ] Harness L + V match the build  
- [ ] They can re-run without you beside them  

### Participant activity (~32 minutes)

1. Close Failure Lab gaps.  
2. Re-run happy path twice.  
3. Teacher chat for spoken script:

```text
Write a 60-second spoken script for Demo Day.
I must: name the pain, trigger the run, show output, name the human approval, name one failure we fixed.
No slide language. Sound like a manager, not a vendor.
```

4. Optional: one screenshot on Working Pack. Agenda PPT is for orientation — not the capstone.

### Facilitator

Walk desks. Kill scope creep: “Ship the slice you can re-run in ten minutes.”

---

## Node 5 — Demo Day (20–25 minutes)

### Goal

Show the **run**, not slide theater.

| Time | What happens |
| ---- | ------------ |
| 2 min | Rules: ~3 min/team; live trigger or recording from last 10 min |
| ~3 min × teams | Pain → run → who approves → one risk fixed |
| 3 min | Votes: Most practical · Safest · Best time saved |
| 3 min | Close + 30-day challenge |

Too many teams → 90-second lightning runs.

### Closing — say this

> “Monday: run this once without this room. Keep the Teacher Agent. Improve Validation next. Add complexity only when the decision tree says so.”

Optional Teacher prompt:

```text
Based on everything today, give me a 30-day plan:
Week 1 run ritual, Week 2 improve Validation, Week 3 optional second automation or cheaper models on easy steps, Week 4 review harness with my team.
Keep under 150 words.
```

Mark Demo Day + workshop complete on the roadmap.

---

# Appendix A — Timing map

| Block | ~Time | Bias |
| ----- | ----- | ---- |
| Opening | 25 | Hands-on |
| Section 1 (incl. landscape) | ~90 | Hands-on |
| Section 2 | ~100 | Hands-on |
| Section 3 + Demo | ~110 | Hands-on |
| Breaks | 2×15 (+ lunch) | |

---

# Appendix B — Roadmap node titles

| Session | Title | Nodes |
| ------- | ----- | ----- |
| 1 | Work WITH AI | Teacher Agent · First Worker · Prompt Bake-Off · Tool Landscape + Fit · Memory + Process Choice |
| 2 | Work THROUGH AI | Process Map + ETCSLV · Decision Tree · Workflow Brain · Automation Path |
| 3 | Work BY AI | Workforce · Harness · Failure Lab · Ship Workflow · Demo Day |

---

# Appendix C — Do / don’t

**Do**

- Send theory to the Teacher Agent.  
- Demo short; rescue long.  
- Force slices that ship today.  
- Require a live run.  
- Keep work in Working Pack slides / paper + AI tools + roadmap.

**Don’t**

- Add Miro/Mural.  
- Let people try more than 3 tools for the shipping stack.  
- Accept a deck as capstone without a run.  
- Teach automation from a blank canvas unless someone is clearly advanced.  
- Introduce ETCSLV only via a Teacher prompt with no explanation.

---

# Appendix D — If things go wrong

| Problem | Fix |
| ------- | --- |
| Wi‑Fi / tool blocked | Track B semi-auto; still require live assistant run |
| Process too big | One trigger, one AI step, one output |
| Automation clone fails | Sheet/form → assistant → human send still counts if live |
| Too many Demo Day teams | 90-second lightning |
| Teacher Agent weak | Re-paste Opening system instructions |
| Someone opens a 4th tool | Remind locked stack; close it |

---

# Appendix E — Teacher prompts (quick copy sheet)

Same prompts as in the sections. Use this when projecting a shared doc.

**E1 — Teacher system instructions** → Opening Step 2 (Project **settings**)  
**E2 — Day contract** → Opening Step 3 (Teacher **chat**)  
**E3 — EA draft** → Node 1 Step 1 (Teacher **chat**; result goes into Work EA **settings**)  
**E4 — Prompt rewrite** → Node 2  
**E5 — Tool picker (max 2–3)** → Node 3  
**E6 — Process candidate** → Node 4  
**E7 — Ladder** → Section 2 framing  
**E8 — ETCSLV critique** → Section 2 Node 1 (only after they filled a draft themselves)  
**E9 — Decision tree challenge** → Section 2 Node 2  
**E10 — Workflow brain** → Section 2 Node 3  
**E11 — Automation T/L/V** → Section 2 Node 4  
**E12 — Manager mindset** → Section 3 framing  
**E13 — Cut roster** → Section 3 Node 1  
**E14 — Harness critique** → Section 3 Node 2  
**E15 — Failure coach** → Section 3 Node 3  
**E16 — Demo script** → Capstone  
**E17 — 30-day plan** → Closing  

(Full prompt text appears in the matching sections above — do not invent shorter versions.)

---

# Appendix F — Facilitator toolkit & templates

This is your prep checklist. Do this **before** workshop day.

## F1 — Accounts and tools you must have ready

| Need | What to set up |
| ---- | -------------- |
| Home LLM | ChatGPT and/or Claude with Projects — Teacher + Work EA demos pre-created |
| Knowledge demo | NotebookLM (or Project files) + 1–2 safe PDFs |
| Compare demo | One second chat/research tool (e.g. Perplexity) |
| Automation | **One** platform you will support live: Zapier **or** Make **or** n8n — with a **clone link** |
| Multimodal tour | Accounts for every lane you will show on projector (you demo; they already signed up) |
| Agenda deck | Google Slides / PPT with section “You are here” markers |
| Working Pack | Google Slides template participants duplicate |
| Roadmap | Batch enrolled; decision tree on; prompt pack linked |
| Backup | Hotspot; ChatGPT+Claude-only track; paper printouts of Working Pack tables |

**Try every demo once the day before** with the same Wi‑Fi quality you expect in the room.

## F2 — Pre-built demos you should be able to run cold

| Demo | What “ready” means |
| ---- | ------------------ |
| Weak chat vs Work EA | Messy inbox text saved; EA Project instructions already filled |
| Prompt before/after | Two prompts saved in a note |
| Tool landscape | 5 lanes on one agenda slide; one live flash per lane max |
| NotebookLM trap question | PDF uploaded; two questions written |
| Decision tree | One sample process with known answers |
| Workflow brain | Status assistant Project ready |
| Automation | Cloneable scenario with dummy trigger data |
| Failure | One intentional break + known fix |
| Cost $ / $$$ | Same sample map with two steps marked |

## F3 — Working Pack (Google Slides) — structure for participants

Create one template. Share view-only. Instruction: **File → Make a copy**.

Suggested slides:

1. **Cover** — Name, role, date  
2. **Process lock** — name, pain, owner, success, tools (max 3)  
3. **Prompt bake-off** — before / after  
4. **Tool scorecard** — table + locked stack  
5. **Process map** — rows: Step # · Description · Green/Blue/Red · Notes  
6. **ETCSLV** — six empty answer boxes with letter + meaning as labels  
7. **Pattern lock** — decision tree result + “today we build”  
8. **Workforce** — Role · Receives · Produces · Human?  
9. **Harness** — Workflow, E, T (with $/$$$), C, S, L, V  
10. **Failure log** — two rows  
11. **Definition of done** — checklist  
12. **Demo script** — paste Teacher’s 60-second script  

**Pen-and-paper backup:** print slides 2, 5, 6, 8, 9, 10 as one double-sided handout.

## F4 — Agenda PPT / Google Slides (facilitator projector deck)

Keep sparse (see also `PRACTICAL_AGENTIC_AI_SLIDE_PLAN.md`). Must include:

- Day map with YOU ARE HERE  
- Three surfaces reminder  
- Chat vs Assistant vs Agent  
- Tool landscape 5 lanes + “max 2–3 for your workflow”  
- Green / Blue / Red tags  
- ETCSLV table with one filled example  
- Pattern ladder  
- Cost $ vs $$$  
- Definition of done  
- Demo Day rules  
- 30-day challenge + links  

Use **your** agenda deck to demo maps/roles/harness live if helpful (edit one example slide). Participants do **not** collaboratively edit your agenda deck.

## F5 — Automation template structure (Zapier / Make / n8n)

Build one scenario participants can clone:

1. **Trigger** — Google Form submit **or** new Sheet row **or** email labeled X  
2. **Normalize** — map fields to: `raw_input`, `requester`, `date`  
3. **AI step** — prompt placeholder: paste “workflow brain” instructions + `{{raw_input}}`  
4. **Write output** — Google Doc body / Sheet column / Slack draft message / Gmail draft  
5. **Approval note** — branch or final step: “Do not send externally until human checks” (even if only a checklist field)  
6. **Dummy data** — 3 sample form responses for the live demo  

Document in one page: clone link, required connections, where to paste their prompt.

## F6 — Sample content packs to pre-write

| Pack | Contents |
| ---- | -------- |
| Messy inbox | The morning bullets used in Node 1 |
| EA instructions | Final text for your demo Work EA |
| Client-report map | 6–8 steps + tags + full ETCSLV answers |
| Trap PDF | Short fake policy PDF for NotebookLM |
| Bad/good prompts | Node 2 pair |
| Multimodal one-liners | One sentence per lane for the tour |

## F7 — Night-before facilitator checklist

- [ ] All your demo Projects open and tested  
- [ ] Automation clone works on a second browser/profile  
- [ ] Working Pack link + “Make a copy” instruction in email/roadmap  
- [ ] Agenda deck on the workshop laptop + backup PDF  
- [ ] Participant pre-work list includes multimodal signups  
- [ ] Room Wi‑Fi + hotspot verified  
- [ ] Printed paper Working Pack for 20% of seats  

---

*Document version: 2026-07-23b · No Miro · Google Slides Working Pack + pen/paper · Multimodal landscape with max 2–3 tools · Facilitator demos labeled · ETCSLV taught before use · Product of the day: one running workflow*
