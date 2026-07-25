# Practical Agentic AI for Productivity
## Build Your Personal AI Workforce in One Day — Facilitator Runbook

This document is written for **you, the facilitator**. Read it as a step-by-step script. Every activity explains: what you say, what you show, what participants type, and how you know they are done.

**Curriculum IDs (source of truth):** [`PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md`](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md)  
**SQL sync (latest):** [`sql/20260725_agentic_curriculum_less_paste_v2.sql`](../sql/20260725_agentic_curriculum_less_paste_v2.sql)  
**Then run (in order):**
1. [`sql/20260725_agentic_add_task_0_0_what_is_ai.sql`](../sql/20260725_agentic_add_task_0_0_what_is_ai.sql) — Task **0.0**
2. [`sql/20260725_agentic_session1_lock_before_tools.sql`](../sql/20260725_agentic_session1_lock_before_tools.sql) — Session 1 lock → tools → memory  
**Prompts:** Live on the roadmap — click task → **Copy** → paste into AI → **Mark complete**. Backup doc: [`PRACTICAL_AGENTIC_AI_PROMPT_PACK.md`](./PRACTICAL_AGENTIC_AI_PROMPT_PACK.md). Call tasks by number (e.g. “Task **1.3**”).

**Room rule:** Copy-paste less. Same Teacher chat all day. Teacher ↔ Work EA switch **once**. Answers live in the chat thread — not a second slide deck.

**Sessions on the roadmap site**

| # | Name |
| - | ---- |
| **0** | Housekeeping + Opening |
| **1** | Work WITH AI |
| **2** | Work THROUGH AI |
| **3** | Work BY AI |
| **4** | Reference (optional read/watch) |

**How to read each block**

- **Facilitator demo** — You do this on the projector. Participants watch. They do not follow along yet.
- **Participant activity** — They do this on their laptops (and sometimes pen and paper). Use Prompt Pack task IDs.
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

## 2. Surfaces (keep it simple)

Participants mostly live in **three places**:

| Surface | Purpose |
| ------- | ------- |
| **1. Agenda PPT (projector)** | “Where we are” — you advance this |
| **2. AI tools on their laptop** | Teacher Project (same chat all day), Work EA, NotebookLM, automation |
| **3. Roadmap website** | Checklist, decision tree, mark complete |

**Prompt Pack** = read-only menu of prompts (Google Doc). Not a notebook.

**Optional scratch:** paper **or** one blank note/doc on the laptop for thinking.  
It is **not** required. They must **not** maintain a Google Slides “Working Pack” or paste from notes into every prompt.

**Yes — they can use a different note or chat thread** for private scratch.  
**No — do not require them to copy from that note into Teacher.** Prefer typing short answers in the Teacher thread, or saying “use my process from earlier.”

**Do not use Miro, Mural, or a Working Pack slide deck.**

---

## 3. How teaching works in this room

| Helper | What it does |
| ------ | ------------ |
| **Teacher Agent** | One ChatGPT/Claude **Project**. Same chat thread all day. Remembers their process from the Day contract. |
| **You (facilitator)** | Short demos, walk the room, fix logins, keep time, quality bar, Demo Day. |
| **Roadmap (website)** | Activity checklist + decision tree. |

**Rule of thumb:** Theory / critique → Teacher (same thread). Broken login / Settings → you help.

**After every AI reply, coach them to:** Stop → Read → Decide (what is wrong?) → then act. Do not rush to the next paste.

**One spine:** One Teacher thread + one Work EA + **one business process**. Do not let them start five toy projects.

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
7. Open the **Prompt Pack** Google Doc once (viewer).

### What you prepare

See **Appendix F — Facilitator toolkit & templates** at the end (accounts, demo scripts, optional paper cheat-sheets).

---

## 5. How you check work

After each activity, at a few desks:

1. “Show me what you built.”
2. “What problem does this solve at work?”
3. “What must a human still approve?”
4. If clear → “Mark this roadmap task complete.”

Mid-day: glance at their Teacher chat (map / ETCSLV) or paper scratch.  
End of day: they **trigger the workflow live** (or a recording from the last few minutes).

---

## 6. Day schedule (matches roadmap + Prompt Pack)

| When | Session | Length | They leave with |
| ---- | ------- | ------ | --------------- |
| Start | **0** Housekeeping + Opening | ~33 min | What is AI / expect → surfaces → Teacher Agent live |
| Morning | **1** Work WITH AI | ~90 min | Work EA (3 runs) + one coach loop + tools ≤3 + process locked |
| | Break | 15 min | |
| Mid | **2** Work THROUGH AI | ~104 min | Map + ETCSLV + pattern + brain + **running** path |
| | Break / lunch | 15–60 min | |
| Afternoon | **3** Work BY AI | ~120 min | Workforce + harness + failure + ship + Demo Day + short 30-day |
| After / home | **4** Reference | ~40 min optional | Readings / video |

Full task list with minutes: [`PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md`](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md).

**If late:** Cut your talking first. Never cut Demo Day (**3.5**) or the final live run (**3.4**).

---

# SESSION 0 — Housekeeping + Opening (~33 minutes)

**Roadmap / Prompt Pack:** `0.0` → `0.4`

## Goal

Shared mental model of AI + expectations; surfaces open; every participant has Project **`Workshop Teacher — Agentic AI`**. It stays open all day as their tutor. You are the build coach.

## Facilitator framing (3 minutes)

Say:

> “I will not lecture agentic AI for an hour. You will hire a **Teacher Agent** that teaches you. I will help you build and fix things. The roadmap is your checklist. The agenda slides show where we are. By evening you leave with **one real work process that runs** — not just notes.”

Show: roadmap **Session 0** + agenda PPT “You are here: Session 0.”

## Participant activity — you walk the room

### Task 0.0 — What is AI? What to expect / not expect (6 min)

**Projector:** Task **0.0** slide (concept + expect / don’t-expect table). This is the live framing — Session 4’s optional “What is AI?” video is a later refresher only.

Say in plain language (~3–4 min):

> “AI in this room means software that predicts useful next text or actions from patterns — drafts, summaries, classifications, suggestions. It is not magic and it is not always right. You will **manage** it: brief it, check it, limit it. Today you will leave with one workflow that runs. You will not learn to code, master every tool, or build a no-human autonomous swarm.”

**Participant (2 min):** On paper/note — one line they **will** expect, one line they **won’t**. Mark roadmap **0.0**.

### Task 0.1 — Housekeeping (5 min)

Everyone opens: roadmap, Prompt Pack, ChatGPT/Claude. Optional paper/blank note for scratch. **No Working Pack slides.** Then:

### Task 0.2 — Create the Teacher Project (10 min)

Open ChatGPT or Claude → create a **Project** (not a normal empty chat).

- Name: `Workshop Teacher — Agentic AI`
- If they cannot use Projects: Custom GPT / Gem, or a normal chat where they paste instructions at the top of important messages.

### Still Task 0.2 — Paste the Teacher’s job into Project **settings**

This is **not** a chat message. Prompt Pack **0.2**.  
**Analogy:** Settings = joining letter / handbook · Chat = today’s conversation.

1. Open the Project.  
2. Find **Instructions** / **Project instructions** / custom instructions for that Project.  
3. Paste the text below into that settings box and save.  
4. Say aloud: “If you see **ETCSLV** or a ladder in this text — **ignore until Session 2**. Don’t decode now.”

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
7) Remember what I tell you in this Project chat. If I say “use my process from earlier,” do not ask me to re-paste it unless something critical is missing.
8) End important answers with: “Next build step: …” (one concrete action).

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

### Task 0.3 — Day contract (7 min)

In the Project **chat** (not settings), Prompt Pack **0.3** — paste:

```text
I am starting the workshop now.
My role: [e.g. HR Business Partner / Marketing Manager / Operations Lead]
My organization type: [e.g. education company / fintech / agency]
The painful process I might automate today: [1–2 sentences]

Confirm you understand your teaching role.
Then explain in 6 bullets how today will grow from “work WITH AI” to “work BY AI.”
Ask me 3 clarifying questions about my process so you can coach me all day.
```

Answer the Teacher’s three questions briefly **in the same chat**. This thread is home base for the day.

### Task 0.4 — Chat vs assistant vs agent (5 min)

Prompt Pack **0.4**:

```text
Explain chat vs assistant vs agent in my job as [role] in 5 short bullets.
```

Pin/bookmark if possible. Mark roadmap **0.4** complete.

## Reflect / checkpoint

Two volunteers read one sentence their Teacher used to define “agent.”

You say:

> “Keep this Teacher Project open all day. Explanations → Teacher. Building and shipping → I help you.”

### Done when

They can state one expect + one don’t-expect (Task **0.0**); Teacher Project exists; instructions are in settings; first chat happened; they can explain chat vs assistant vs agent in plain language.

---

# SESSION 1 — Work WITH AI (~90 minutes)

**Roadmap / Prompt Pack tasks:** `1.1` → `1.6`

## Session goal

1. Hire one Work EA (Settings once) and **use it three times**.  
2. Switch Teacher ↔ EA **once** to learn good prompts + dual-Project critique.  
3. **Lock one process**, then fit ≤3 tools, then ground memory — in that order.  
4. Think and review more than copy-paste.

**Wall script for you:**

> “1) Fill a brief. 2) Hire the EA — three runs. 3) Ask the coach once — fix — re-run once. 4) **Lock the job.** 5) Pick tools for *that* job. 6) Ground with the right files. Stay in one Project until I say switch.”

**Progression bridge into Session 1:**

> “You named *assistant* at 0.4. Now you hire one — like writing a secretary’s joining letter, then putting them to work.”

---

## Facilitator demo (5 min) — projector only — before 1.1

**Weak chat:** empty chat + messy notes + `Help me with my morning.` → generic.

**Work EA with Settings:** same notes → useful Top 5 → invent-trap → show “never invent.”

> “You hired a role. Settings stick across many chats. That is why we will run the EA three times — not once.”

---

## Task 1.1 — Fill Work EA brief (6 min)

**No AI.** Paper or blank note. Prompt Pack **1.1** fields.

Walk the room: if their brief is vague (“be helpful”), force priorities + never-invent + ask-before.

---

## Task 1.2 — Create Work EA + three runs (22 min)

| Project | Purpose |
| ------- | ------- |
| Teacher | Coach — leave closed until **1.3** |
| `My Work EA — [Name]` | Worker — stay here for all three runs |

1. Settings: paste/type their **1.1** brief once.  
2. Run 1 triage → **Stop, read, decide.**  
3. Run 2 draft from one list item → review.  
4. Run 3 invent-trap → must refuse or ask.

If someone finishes early: improve Settings themselves (no Teacher yet).

**Done when:** three runs visible in one Work EA chat.

---

## Task 1.3 — One coach loop (16 min)

**Only planned Teacher ↔ EA switch today.**

1. Teacher Prompt Pack **1.3** — one message: brief + one weak prompt + one EA reply.  
2. They accept only fixes they agree with.  
3. Update Work EA Settings once.  
4. Re-run **one** task. Compare.

Say:

> “This is how two Projects help each other — once. Good prompts + better job design in the same loop. Do not hop back and forth for the rest of the morning.”

Poll: “Did the re-run get better?”

---

## Task 1.4 — Lock today’s process (11 min)

**Bridge:** They felt WITH AI — now commit **one** job before any tool shopping.

**Analogy:** One customer journey today — not the whole company.

Think first (3 min) on paper/note. Then **one short** Teacher check — Prompt Pack **1.4**. Accept smaller slice. Light 🟢/🔵/🔴 tease only; full teach at **2.1**.

2–3 people read process aloud. Kill overscoped monsters.  
Say: “Tools wait until the job is locked.”

---

## Task 1.5 — Tool landscape + fit (25 min)

**Bridge:** Process locked — equip only what **that** job needs.

**Analogy:** Don’t open every stall — pick two for today’s meal.

Same landscape demo as before (five lanes, projector). Max **2–3 tools** for the **1.4** process.

Participant: Prompt Pack **1.5** in Teacher → one identical test in recommended tools only → lock stack in one line (paper/note fine). Close a fourth tool if open.

---

## Task 1.6 — Memory (10 min)

**Bridge:** Stack chosen — ground with files for **this** process.

**Analogy:** Company file, not corridor rumors.

NotebookLM / Project files: 2 grounded + 1 trap. **Review** refuse vs invent. Teacher optional.

### Break — 15 minutes

---

# SESSION 2 — Work THROUGH AI (~104 minutes)

**Roadmap / Prompt Pack tasks:** `2.0` → `2.6`

## Session goal

Same process → map → pattern → reusable brain → running path (trigger → AI → output → approval).

**Bridge into Session 2:**

> “WITH = a junior at your elbow. THROUGH = the **job** runs on a path — reception → desk → stamp. Same process you locked at **1.4**. We only add structure.”

---

## Task 2.0 — Framing: pattern ladder (5 minutes)

### Facilitator (2 minutes)

Show the ladder once on a PPT slide:

```text
Instruction-only chat
→ Knowledge assistant (your docs)
→ Single workflow agent
→ Multi-agent workflow
→ Automation pipeline
```

> “Climb only as high as your process needs. Most people ship at knowledge assistant or single workflow, plus a light run path. You already lived chat + assistant this morning — the ladder only asks how high for *this* job. Multi-agent waits until something runs.”

**Analogy:** Bicycle → scooter → one van → small fleet → factory conveyor.

### Participant activity (3 minutes)

Same Teacher thread — Prompt Pack **2.0** (“using my locked process from earlier” — **no process paste**).

---

## Tasks 2.1–2.3 — Map + ETCSLV in the same Teacher thread (22 minutes)

### Goal

1. Teach ETCSLV **before** critique.  
2. Map steps **in Teacher chat** (typed once — that message is the map).  
3. They draft ETCSLV; Teacher critiques in the **same thread** (no re-paste).

### What the step tags mean (say once) — full teach here

**Analogy (kitchen):** chef inventing a special (🟢) · oven timer / ticket printer (🔵) · manager tasting before the plate leaves (🔴).

- **Green — LLM thinking:** draft, summarize, brainstorm, rewrite.  
- **Blue — rules / automation:** forms, reminders, moving data, triggers.  
- **Red — human only:** legal, people conflict, money, send-to-client without review.

### Facilitator demo — teach ETCSLV first (5 minutes) — projector only

**Bridge:** Map is the floor plan; ETCSLV is the checklist before the counter opens.  
**Analogy:** How hard · which systems · what they must know · what files stay · what they may never do alone · how you check quality.

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

> “ETCSLV is your operating checklist. Map in the Teacher chat. Draft letters yourself. Then ask for critique — do not paste the map twice.”

### Participant activity (14 minutes)

**2.1** Prompt Pack — type steps into Teacher; Teacher tags Green/Blue/Red.  
**2.2** Same thread — they type E–V; Teacher only acknowledges.  
**2.3** Same thread — “Critique my ETCSLV draft above.” They reply with updated L/V.

**Review mantra:** Stop → Read → Decide before accepting rewrites.

### Reflect (3 minutes)

“Hardest letter was ___.” Spot-check that L and V are not “be careful.”

### Done when

Map exists in Teacher chat; L and V are specific.

---

## Task 2.4 — Decision tree + lock pattern (15 minutes)

### Goal

Lock today’s pattern. **One** short Teacher ask — result phrase only, not a process dump.

**Bridge:** You already have map + ETCSLV — the tree **narrows** the room; it is not a third religion.  
**Analogy:** Clinic triage — a few questions → the right room, not the whole hospital.

### Facilitator demo (3 minutes) — projector only

Volunteer process → roadmap Decision Tree live → read result card.

**Printable decision tree (external handout):** Generate [`docs/AGENTIC_DECISION_TREE_PRINTABLE.md`](AGENTIC_DECISION_TREE_PRINTABLE.md) with `npm run generate:decision-tree-printable`.

### Participant activity (10 minutes)

1. Complete Decision Tree on the roadmap (click through).  
2. Prompt Pack **2.4** — one Teacher message with the **result phrase** + “I will build: …”  
3. No second document required.

### Reflect (2 minutes)

Celebrate anyone told to build **simpler** than expected.

---

## Task 2.5 — Build the workflow brain (28 minutes)

### Goal

One Teacher ask (uses earlier ETCSLV) → **one** Settings paste → test happy + messy. Review the output; fix Settings yourself.

**Bridge / identity:** Brain = standing brief for **this** locked job. Extend **Work EA** or create **one** new Project — not a new Teacher, not five surfaces.  
**Analogy:** Standing brief for the weekly client update — not the whole company handbook.

### Facilitator demo (4 minutes) — projector only

Show a “Weekly Status Report Assistant”: fixed sections, rule “ask if bullets missing.” Run once.

### Participant activity (22 minutes)

1. Prompt Pack **2.5** — one Teacher message (**no** re-paste of pattern/process/ETCSLV blocks).  
2. Paste **only** system instructions into the worker Project/GPT/NotebookLM Settings once.  
3. Test happy + messy. **Review** before asking Teacher again.  
4. Optional: one short fix ask if stuck.

### Reflect (2 minutes)

Say aloud: “Still requires a human: ___.”

---

## Task 2.6 — Automation path that can run (34 minutes)

### Goal

Trigger → AI → output → approval — **live once**, not paper architecture.

### Facilitator demo (6 minutes) — projector only

Your prebuilt path: form/email/sheet → AI step → Doc/Slack/email draft → human approve. Prefer a **cloneable** Zapier/Make/n8n template.

Also say (cost routing, 1–2 minutes):

> “Do not use an expensive high-reasoning model for a cheap formatting job. Easy steps `$`, hard judgment `$$$`. Never put API keys in chat.”

| Kind of step | Model choice |
| ------------ | ------------ |
| Format, extract, tag, clear classify | Smaller / faster / cheaper |
| Ambiguous planning or hard synthesis | Stronger / costlier |
| External / high-stakes message | Stronger model + human approval |

### Participant activity (24 minutes)

**Track A — Preferred: no-code automation**  
1. Clone template or build: Trigger → AI → Output.  
2. Wire workflow-brain instructions into the AI step.  
3. Live-run once.  
4. Short Teacher review — Prompt Pack **2.6** (fill short blanks; do not paste essays).

**Track B — If automation is blocked**  
Checklist on paper → assistant produces artifact → human sends after review. Still counts if live-runnable.

### Reflect (4 minutes)

Three people show the **run on screen**.

### Break or lunch

---

# SESSION 3 — Work BY AI (~120 minutes)

**Roadmap / Prompt Pack tasks:** `3.0` → `3.6`

## Session goal

Same workflow → minimum AI roles → harness → break it → ship → demo the run.  
Keep answers in the **Teacher chat** — no workforce/harness slide deck.

**Bridge into Session 3:**

> “Your path already runs. BY is not a new product — it is managing the counter for Monday: roles, rules, fire drills. You are the floor manager.”

---

## Task 3.0 — Framing: manager of agents (4 minutes)

Facilitator:

> “You are the manager. AI roles are workers. The harness is the job description — **same ETCSLV letters**, shipping name. Failure Lab is Monday. Then we ship.”

**Analogy:** Staff a counter that already serves customers — don’t design a new mall.

Participant — Prompt Pack **3.0** in Teacher chat.

---

## Task 3.1 — AI workforce (15 minutes)

### Goal

Minimum role roster + one human gate — **typed in Teacher chat** — around the **same** running workflow.

### Facilitator demo (2 minutes) — projector only

On a PPT slide: `Planner → Researcher → Writer → Reviewer → Human approval`

### Participant activity (11 minutes)

Prompt Pack **3.1**: type proposed roles → Teacher cuts → they delete any role they cannot explain.

### Done when

Handoffs clear; human on external/high-risk steps.

---

## Task 3.2 — Harness via Q&A (15 minutes)

### Goal

Same ETCSLV, answered **in the Teacher chat** one letter at a time — no paste of a filled card.  
Say explicitly: “Harness ≠ new framework. Harness = ETCSLV with a shipping name.”

**Analogy:** Job description + SOPs + approval stamp on the desk.

### Facilitator demo (2 minutes) — projector only

Fill one example harness on a PPT slide (“Weekly competitor brief”).

### Participant activity (11 minutes)

Prompt Pack **3.2**: Teacher asks E, T ($/$$$), C, S, L, V one at a time; then critiques L/V.

### Done when

L and V are specific enough to test Monday morning.

---

## Task 3.3 — Failure Lab (18 minutes)

### Goal

Break their workflow on purpose; harden it. **Do first, ask Teacher only if stuck.**

### Failure types (facilitator explains once)

1. Missing context  
2. Hallucination  
3. Wrong tool  
4. No approval  
5. Doom loop  

### Facilitator demo (3 minutes) — projector only

Break your demo once (empty input is easiest). Show the fix in instructions.

### Participant activity (12 minutes)

Trigger **two** failures. After each: Stop → Read → Fix. Optional two lines on paper: What broke → Fix.

Teacher only if stuck — Prompt Pack **3.3**.

---

## Task 3.4 — Capstone: ship the real workflow (38 minutes)

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

4. Agenda PPT is for orientation — not the capstone.

### Facilitator

Walk desks. Kill scope creep: “Ship the slice you can re-run in ten minutes.”

---

## Task 3.5 — Demo Day (22 minutes)

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

## Task 3.6 — 30-day plan (8 minutes, minimal)

Prompt Pack **3.6** (short). Mark **3.5** and **3.6** complete.

---

# SESSION 4 — Reference (optional, async)

**Roadmap:** `4.1` → `4.3`. Not required live. Link in follow-up email.  
Note: Task **4.3** (What is AI? video) is an optional refresher — the live framing is Task **0.0** at the start of the day.

---

# Appendix A — Timing map

Full minutes per task: [`PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md`](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md).

| Session | ~Time | Bias |
| ------- | ----- | ---- |
| 0 Opening | ~33 | Hands-on |
| 1 WITH | ~90 | Hands-on |
| 2 THROUGH | ~104 | Hands-on |
| 3 BY + Demo | ~120 | Hands-on |
| 4 Reference | ~40 async | Optional |
| Breaks | 2×15 (+ lunch) | |

---

# Appendix B — Roadmap sessions (`week_number` = session #)

| week_number | Title | Task IDs |
| ----------- | ----- | -------- |
| 0 | Session 0: Housekeeping + Opening | 0.0–0.4 |
| 1 | Session 1: Work WITH AI | 1.1–1.6 |
| 2 | Session 2: Work THROUGH AI | 2.0–2.6 |
| 3 | Session 3: Work BY AI | 3.0–3.6 |
| 4 | Session 4: Reference — Go deeper (optional) | 4.1–4.3 |

---

# Appendix C — Do / don’t

**Do**

- Keep one Teacher chat all day (“use earlier context”).  
- Demo short; rescue long.  
- Force slices that ship today.  
- Require a live run.  
- After every AI reply: Stop → Read → Decide.  
- Allow optional paper/blank note for thinking — not as a paste source.

**Don’t**

- Add Miro/Mural or a Google Slides Working Pack.  
- Require multi-block pastes (process + map + ETCSLV) in one prompt.  
- Hop Teacher ↔ Work EA except the one coach loop (**1.3**).  
- Let people try more than 3 tools for the shipping stack.  
- Accept a deck as capstone without a run.  
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

**E1 — Teacher system instructions** → 0.2 (Settings once)  
**E2 — Day contract** → 0.3 (start all-day Teacher thread)  
**E3 — One coach loop** → 1.3 (only Teacher↔EA switch; includes prompt rewrite)  
**E4 — Tool picker (max 2–3)** → 1.4  
**E5 — Process lock check** → 1.6  
**E6 — Ladder** → 2.0 (no process re-paste)  
**E7 — Map in chat** → 2.1  
**E8 — ETCSLV critique** → 2.3 (after their draft in 2.2; same thread)  
**E9 — Decision tree challenge** → 2.4 (result phrase only)  
**E10 — Workflow brain** → 2.5 (one ask; Settings once)  
**E11 — Automation review** → 2.6  
**E12 — Manager mindset** → 3.0  
**E13 — Cut roster** → 3.1 (type in chat)  
**E14 — Harness Q&A** → 3.2  
**E15 — Failure coach** → 3.3 (only if stuck)  
**E16 — Demo script** → 3.4  
**E17 — 30-day plan** → 3.6 (minimal)

Full prompt text: Prompt Pack. Do not invent shorter versions that reintroduce multi-paste dumps.

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
| Agenda deck | Google Slides / PPT with session “You are here” markers |
| Prompt Pack | Google Doc (viewer) republished from PROMPT_PACK.md |
| Roadmap | Batch enrolled; decision tree on; Prompt Pack linked |
| Backup | Hotspot; ChatGPT+Claude-only track; optional 1-page paper cheat-sheet (EA brief fields + Green/Blue/Red) |

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

## F3 — Optional paper cheat-sheet (not a second homework deck)

If Wi‑Fi or focus is weak, print **one page** with:

- EA brief blanks (role / priorities / never-invent / ask-before)  
- Green / Blue / Red meanings  
- Reminder: answers live in Teacher / Work EA chats  

Do **not** require Google Slides copies or paste-from-paper rituals.

## F4 — Agenda PPT / Google Slides (facilitator projector deck)

Keep sparse (see also `PRACTICAL_AGENTIC_AI_SLIDE_PLAN.md`). Must include:

- Day map with YOU ARE HERE  
- Surfaces: roadmap · Prompt Pack · AI tools (+ optional scratch)  
- Same Teacher chat all day · Teacher↔EA once  
- Stop → Read → Decide  
- Chat vs Assistant vs Agent  
- Tool landscape 5 lanes + “max 2–3 for your workflow”  
- Green / Blue / Red tags  
- ETCSLV table with one filled example  
- Pattern ladder  
- Cost $ vs $$$  
- Definition of done  
- Demo Day rules  
- 30-day challenge + links  

Participants do **not** collaboratively edit your agenda deck.

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
| Messy inbox | Morning bullets for Work EA demo |
| EA instructions | Final text for your demo Work EA |
| Client-report map | 6–8 steps + tags + full ETCSLV answers |
| Trap PDF | Short fake policy PDF for NotebookLM |
| Coach-loop sample | One weak prompt + mediocre EA reply for 1.3 demo |
| Multimodal one-liners | One sentence per lane for the tour |

## F7 — Night-before facilitator checklist

- [ ] All your demo Projects open and tested  
- [ ] Automation clone works on a second browser/profile  
- [ ] Prompt Pack Google Doc republished from latest markdown  
- [ ] Agenda deck on the workshop laptop + backup PDF  
- [ ] Participant pre-work list includes multimodal signups  
- [ ] Room Wi‑Fi + hotspot verified  
- [ ] Optional paper cheat-sheets for ~20% of seats  

---

*Document version: 2026-07-25c · Sessions 0–4 · Less paste · Same Teacher thread · No Working Pack · Teacher↔EA once · Stop→Read→Decide · Product of the day: one running workflow*
