# Slide Plan — Practical Agentic AI for Productivity

**Keep in sync with:** [`PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md`](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md) · Facilitator Guide · roadmap SQL (`task_name` IDs `0.0`…`3.6`).

**Pedagogy:** No concept before its prerequisite. Every work slide includes **Because you just…** (bridge) + **Analogy** (workplace picture before jargon). Session 1 order = lock process → tools → memory.

## NotebookLM brief (use with facilitator guide + this file)

**How to use this file in NotebookLM**

1. Upload this file **and** `docs/PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md` as sources.
2. Prompt NotebookLM roughly like:

> Using only these sources, create a participant-facing slide deck for the one-day workshop. Follow the slide plan exactly (slide numbers, titles, roadmap task IDs, and on-slide bullets). **Every work slide must show both the concept and the matching roadmap task** (Task ID + short title + minutes + Done when), plus a **Because you just…** bridge line and one **Analogy** line. Keep slides sparse: max 6 bullets besides the task banner, large readable text, no walls of prose. Tone: professional, practical, non-engineer. Do not invent tools, timings, task numbers, or frameworks not in the sources. Include a short speaker-note line for each slide under “Instructor cue.” Export as a presentation outline I can paste into Google Slides / PowerPoint. Also produce a 2-page PDF take-home summary from the recipe at the end of this file.

3. After generation: replace placeholders (`[Roadmap URL]`, `[Prompt Pack link]`) with real links.

---

## Deck purpose (read this first)

| This deck IS | This deck is NOT |
| ------------ | ---------------- |
| Orientation spine + **task-coherent coaching wall** | The curriculum itself (Teacher Agent + roadmap teach) |
| **Concept + matching roadmap task** on the same slide | Concept-only lecture slides with no “what do I click now” |
| Agenda + timing map tied to task IDs (`0.1`…`3.6`) | Capstone / Demo Day content beyond the checklist |
| Take-home PDF reference | A lecture you read for 40 minutes |

**In-room rule:** Leave the current **task slide** (or session park slide) up while people work. Only advance when the room moves to the next roadmap task. Hands-on time > slide time.

**Slide template (required for every work slide)**

Each work slide must include this banner block **above** the concept bullets:

```
TASK X.Y · [Short title from curriculum] · ~N min
Because you just… [bridge from previous task — one line]
Do now: [one line — what they do on laptop / paper]
Done when: [one line — mark roadmap complete when…]
Analogy: [one workplace picture — before jargon]
```

Then 3–6 concept / quality-bar bullets. Never show a framework (ETCSLV, ladder, roles) without the task ID that uses it. Never introduce a concept whose prerequisite task is incomplete.

**Visual style for NotebookLM:** Clean, high contrast, minimal icons, one idea per slide, tables OK when specified, avoid dense paragraphs. Task ID should be the largest secondary signal after the title.

**Audience:** Managers, HR, marketing, ops, founders, analysts — not software engineers.

**Promise of the day:** Leave with **one running workflow** for a real business process (not a PPT-only design).

---

## Full day map (for NotebookLM context)

```
Session 0 OPEN (~33) · 0.0–0.4 → Session 1 WITH (~90) · 1.1–1.6 → break
→ Session 2 THROUGH (~104) · 2.0–2.6 → break/lunch
→ Session 3 BY (~120) · 3.0–3.6 (Demo Day + 30-day) → Session 4 Reference (async) · 4.1–4.3
```

Arc: **Work WITH AI → Work THROUGH AI → Work BY AI**

Roles: Teacher Agent teaches · Instructor facilitates doing · Roadmap holds checklist · Participant ships

---

# SLIDE-BY-SLIDE PLAN (31 slides)

---

### Slide 1 — Title

**Roadmap task:** — (door open)

**On slide**

- Title: Practical Agentic AI for Productivity
- Subtitle: Build Your Personal AI Workforce in One Day
- Line: One-day instructor-led workshop for working professionals
- Footer: Product of the day = one **running** workflow for your process
- Small: Follow roadmap tasks **0.0 → 3.6** (same numbers as Prompt Pack)

**Instructor cue:** Welcome; don’t lecture yet. Point to roadmap login.

**Show when:** Door open / start

---

### Slide 2 — Promise & non-goals

**Roadmap task:** — (expectation set before 0.1)

**On slide**

- **You will leave with:** One real workflow that runs (trigger → AI → output → human approval)
- **You will practice:** Managing AI like a team (brief, check, limit, validate)
- **You will not:** Learn to code · master every vendor · build a 16-agent swarm today
- Rule: Simplest pattern that works
- Capstone = Task **3.4** live run + Task **3.5** Demo Day — not a slide deck
- Detail next: Task **0.0** — What is AI? / expect vs don’t expect

**Instructor cue:** Reset expectations briefly; full expect table is Slide 6 / Task **0.0**.

**Show when:** Minute 0–2

---

### Slide 3 — How this room works

**Roadmap task:** — (OS of the day; leave up during 0.1–0.2 if helpful)

**On slide — 4 boxes**

| Role | Job today |
| ---- | --------- |
| Teacher Agent | Explains concepts, drafts prompts, grows with you |
| Instructor | Short demos, unsticks tools, quality bar |
| Roadmap (web) | Checklist **by task ID**, decision tree, mark complete |
| You | Build, test, ship |

- Hands-on ≥ ~60% of the day
- Call work by number: “We’re on Task **1.3**”
- Ask the Teacher Agent “why” before asking for a lecture

**Instructor cue:** Operating system. Refer back often.

**Show when:** Opening

---

### Slide 4 — Day agenda (“You are here” master map)

**Roadmap task:** — (master map; revisit at every session transition)

**On slide — timeline**

| When | Block | Roadmap tasks | What you will actually do |
| ---- | ----- | ------------- | ------------------------- |
| ~33 min | **0 · Opening** · What is AI → Hire Teacher | **0.0–0.4** | Expect/don’t · surfaces · Teacher Project · day contract · vocab |
| ~90 min | **1 · Work WITH AI** = AI helps *you* | **1.1–1.6** | Brief · 3 EA runs · coach once · **lock one job** · ≤3 tools · memory |
| 15 min | Break | | |
| ~104 min | **2 · Work THROUGH AI** = AI runs *the job* | **2.0–2.6** | Map · ETCSLV · decision tree · brain · **run once** |
| as scheduled | Break / lunch | | |
| ~120 min | **3 · Work BY AI** = AI as a *small team* | **3.0–3.6** | Roles · harness · break it · **ship** · Demo Day · 30-day |
| later | **4 · Reference** (optional) | **4.1–4.3** | Short reads / video at home |

- Bottom banner: **Same job all day.** We escalate structure — we do not start a new project at lunch.
- Footer legend (small): WITH = helper · THROUGH = one running process · BY = roles + rules + ship

**Instructor cue:** At each transition, point to the **task ID column**, then the plain line.

**Show when:** Opening; each section transition

---

### Slide 5 — Session 0 park · Hire your Teacher Agent

**Roadmap tasks:** **0.0 → 0.4** (~33 min)

**On slide — task table (park this slide)**

| ID | Do this | ~min |
| -- | ------- | ---- |
| **0.0** | What is AI? What to expect / not expect | 6 |
| **0.1** | Open roadmap + Prompt Pack + AI tool | 5 |
| **0.2** | Create Teacher Agent · paste instructions into **Settings** | 10 |
| **0.3** | Day contract in Teacher chat (same chat all day) | 7 |
| **0.4** | Chat vs assistant vs agent + checkpoint | 5 |

- Banner: **YOU ARE HERE — Session 0**
- Outcome: Shared AI/expect mental model + one Teacher Project ready; same thread for the day

**Instructor cue:** Park briefly, then go to Slide 6 (**0.0**) before housekeeping.

**Show when:** Start of Session 0

---

### Slide 6 — Task 0.0 · What is AI? Expect / don’t expect

**Roadmap task:** **0.0** What is AI? What to expect / not expect (~6 min)

**On slide**

```
TASK 0.0 · What is AI? Expect / don’t · ~6 min
Because you just… arrived — we align the mental model before any tools
Do now: Listen to instructor · write one EXPECT and one DON’T EXPECT on paper/note
Done when: Those two lines exist; mark roadmap 0.0 complete
Analogy: AI = a very fast junior who drafts well and invents confidently — needs a manager
```

**What AI is (in this room)**

- Pattern-based software that drafts, summarizes, classifies, suggests
- Powerful when you **brief → check → limit → validate**
- A teammate you **manage** — not a truth oracle

**What AI is not**

- Magic, consciousness, or always correct
- A green light to skip human approval on legal, people, money, or external sends

| Expect today | Don’t expect today |
| ------------ | ------------------ |
| One **running** workflow for a real process | Learning to code |
| Practice managing AI like a team | Mastering every vendor |
| Shared vocabulary: chat / assistant / agent | Perfect autonomy with zero human |
| Hands-on most of the day | A 16-agent swarm |

- Optional later: Session 4 video **4.3** is a refresher only — this slide is the live framing

**Instructor cue:** 3–4 min talk from this slide; 2 min silent write; then advance to 0.1.

**Show when:** First work beat of Session 0 (before housekeeping)

---

### Slide 7 — Task 0.1–0.2 · Surfaces + Teacher hire

**Roadmap task:** **0.1** Open surfaces (5) → **0.2** Create Teacher + Settings paste (10)

**On slide**

```
TASK 0.1 → 0.2 · Open tools + hire Teacher · ~15 min
Because you just… set expectations — open the desk, then hire the coach
Do now: Log into roadmap · open Prompt Pack · create AI Project · paste 0.2 into Settings (not chat)
Done when: Teacher Project exists with saved instructions; roadmap 0.1 & 0.2 checked
Analogy: Settings = joining letter/handbook · Chat = today’s conversation at the desk
```

- Concept: Teacher Agent = your coach for the whole day (not the Work EA)
- Settings once ≠ chat message
- Keep **one** Teacher chat thread from here
- Settings may mention ETCSLV / ladder — **ignore until Session 2** (you will learn them when you need them)

**Instructor cue:** Demo Settings paste once. Say: “Don’t decode the acronyms yet.”

**Show when:** Tasks 0.1–0.2

---

### Slide 8 — Task 0.3 · Day contract

**Roadmap task:** **0.3** Day contract with Teacher (~7 min)

**On slide**

```
TASK 0.3 · Day contract · ~7 min
Because you just… hired the coach — start the all-day conversation (not a new thread later)
Do now: In Teacher chat (not Settings), paste Prompt Pack 0.3 · answer Teacher’s questions
Done when: You and Teacher agree on how you’ll work today; mark 0.3 complete
Analogy: Kickoff meeting with your trainer — same room all day
```

- Concept: Contract = same chat, stop→read→decide, escalate one process all day
- No second “answer deck” in Google Slides
- Prefer “use what I already told you” over re-pasting later

**Instructor cue:** Circulate; kill people pasting into Settings again.

**Show when:** Task 0.3

---

### Slide 9 — Task 0.4 · Chat vs Assistant vs Agent

**Roadmap task:** **0.4** Chat vs assistant vs agent + checkpoint (~5 min)

**On slide — concept table + task banner**

```
TASK 0.4 · Vocab checkpoint · ~5 min
Because you just… used a Project with Settings — name what you lived
Do now: Ask Teacher (Prompt Pack 0.4) for one-line definitions in YOUR work context · bookmark/pin
Done when: You can say which of the three you are using; mark 0.4 complete
Analogy: Hallway question vs hired desk EA vs routed office process (intake → desk → stamp)
```

| Chat | Assistant | Agent / workflow |
| ---- | --------- | ---------------- |
| Hallway question (re-explain every time) | Hired desk EA with a standing brief | Routed process; you manage exceptions |
| Good for exploration | Good for repeatable drafts/Q&A | Good when process is mapped |

- All day you **manage** these — you don’t worship the model
- Next: you will **hire** an assistant (Work EA) in Session 1

**Instructor cue:** Ask 2 people for their Teacher’s one-line definition. Bridge: “Next you hire one.”

**Show when:** Task 0.4 / end of Session 0

---

### Slide 10 — Session 1 park · Work WITH AI

**Roadmap tasks:** **1.1 → 1.6** (~90 min)

**On slide**

| ID | Do this | ~min |
| -- | ------- | ---- |
| **1.1** | Fill Work EA brief (think first — paper/note) | 6 |
| **1.2** | Create Work EA + **three** real runs | 22 |
| **1.3** | **One** coach loop (Teacher → fix Settings → re-run once) | 16 |
| **1.4** | **Lock today’s process** (commit the job) | 11 |
| **1.5** | Tool landscape + fit (max 2–3) **for that job** | 25 |
| **1.6** | Memory — docs + grounded questions **for that job** | 10 |

- Banner: **YOU ARE HERE — Session 1: Work WITH AI**
- Outcome: Work EA hired (3 runs) + one coach loop + **process locked** + ship stack + grounded memory
- Order rule: **Lock → tools → memory** (never tool-shop before the job is chosen)
- Reminder: Same Teacher chat all day · Teacher ↔ Work EA switch **once** (at 1.3)
- Arc analogy: WITH = a capable junior at your elbow

**Instructor cue:** Park during Session 1; jump to the task slide when you call the number.

**Show when:** Start of Session 1

---

### Slide 11 — Task 1.1 · Work EA brief

**Roadmap task:** **1.1** Fill your Work EA brief (~6 min)

**On slide**

```
TASK 1.1 · Work EA brief · ~6 min
Because you just… named “assistant” (0.4) — now write the job brief before hiring
Do now: NO AI yet — fill Prompt Pack 1.1 fields on paper or a blank note
Done when: Brief is filled enough to paste into Settings next; mark 1.1 complete
Analogy: Write the secretary’s joining letter before their first day
```

- Concept: Brief = who this EA serves, recurring jobs, tone, hard limits
- Thinking before hiring beats a vague mega-prompt
- This brief becomes Work EA **Settings** in 1.2 (paste once)

**Instructor cue:** Silent room. Kill early tool-opening.

**Show when:** Task 1.1 (after short facilitator demo if using guide)

---

### Slide 12 — Task 1.2 · Hire Work EA + three runs

**Roadmap task:** **1.2** Create Work EA + three real tasks (~22 min)

**On slide**

```
TASK 1.2 · Create Work EA + 3 runs · ~22 min
Because you just… wrote the brief — hire the worker and use them three times
Do now: New Project · paste 1.1 brief into Settings once · run 3 real work tasks · Stop, read, decide after each
Done when: Three outputs exist in the Work EA Project; mark 1.2 complete
Analogy: Teacher = trainer · Work EA = your secretary (different desks)
```

- Concept: Work EA = daily helper Project (separate from Teacher)
- Leave Teacher **closed** until 1.3
- Quality bar: real work, not “write a poem”
- Stop→Read→Decide = taste before you serve

**Instructor cue:** Walk; ask “show me run 2.”

**Show when:** Task 1.2

---

### Slide 13 — Task 1.3 · One coach loop

**Roadmap task:** **1.3** Teacher critiques → fix Settings → re-run once (~16 min)

**On slide**

```
TASK 1.3 · One coach loop · ~16 min
Because you just… have real EA output — coach once, don’t thrash
Do now: Teacher Prompt Pack 1.3 → accept fixes you agree with → update Work EA Settings once → re-run ONE task
Done when: Before/after comparison exists; mark 1.3 complete
Analogy: Manager reviews one sample of work, updates the handbook, asks for one redo
```

- Concept: Manage prompts like a manager — critique once
- Only **one** Teacher ↔ Work EA switch this session
- Update Settings (handbook) — don’t rely on chat memory alone

**Instructor cue:** Enforce “once.” No endless critique loops.

**Show when:** Task 1.3

---

### Slide 14 — Task 1.4 · Lock today’s process

**Roadmap task:** **1.4** Lock today’s process (~11 min)

**On slide**

```
TASK 1.4 · Lock process · ~11 min
Because you just… felt WITH AI on real work — commit ONE job before shopping for tools
Do now: Think 3 min (paper/note) · one short Teacher check (Prompt Pack 1.4) · accept a smaller slice if Teacher pushes
Done when: One process named for Sessions 2–3; mark 1.4 complete
Analogy: Choose one customer journey for today — not the whole company
```

- Light tag tease (full teach at **2.1**):
  - 🟢 thinking · 🔵 rules/automation · 🔴 human approval
- Pick **one** process with clear 🟢 + 🔴
- Same process the rest of the day — tools come **next**, fitted to this job

**Instructor cue:** Reject “boil the ocean.” Say: “Tools wait until the job is locked.”

**Show when:** Task 1.4

---

### Slide 15 — Task 1.5 · Tool fit (ship stack)

**Roadmap task:** **1.5** Tool landscape + fit · max 2–3 tools (~25 min)

**On slide**

```
TASK 1.5 · Tool fit for the locked job · ~25 min
Because you just… locked the process — equip only what THAT job needs
Do now: Browse for fit · identical test in recommended tools only · lock stack in one line · close a 4th tool if open
Done when: ≤3 tools named for Demo Day; mark 1.5 complete
Analogy: Don’t open every stall in the market — pick two that serve today’s meal
```

- Concept: Browse widely · **ship** narrow
- Typical stack: (1) Primary brain ChatGPT **or** Claude Project (2) Grounding NotebookLM if doc-heavy (3) Runner automation **or** Track B semi-auto
- Demo Day = re-run this stack — not a tool zoo

**Instructor cue:** Kill FOMO. Stack is for the **1.4** process only.

**Show when:** Task 1.5

---

### Slide 16 — Task 1.6 · Memory / grounding

**Roadmap task:** **1.6** Memory — docs + grounded questions (~10 min)

**On slide**

```
TASK 1.6 · Memory for the locked job · ~10 min
Because you just… chose the stack — ground it with the right files (not random PDFs)
Do now: Prompt Pack 1.6 — attach/upload key docs for YOUR process · ask 2 grounded questions · check faithfulness
Done when: At least one grounded answer you trust; mark 1.6 complete
Analogy: Give the junior the company file — not corridor rumors
```

- Concept: Memory = files/context the AI must not invent
- Grounded Q&A ≠ free hallucination
- Keep light if the process is not doc-heavy

**Instructor cue:** Spot-check “where did that fact come from?”

**Show when:** Task 1.6 · end Session 1

---

### Slide 17 — Session 2 park · Work THROUGH AI

**Roadmap tasks:** **2.0 → 2.6** (~104 min)

**On slide**

| ID | Do this | ~min |
| -- | ------- | ---- |
| **2.0** | Framing: pattern ladder (same Teacher thread) | 5 |
| **2.1** | Map process **in Teacher chat** (type steps once) | 10 |
| **2.2** | First ETCSLV draft (you type) | 5 |
| **2.3** | Teacher critiques ETCSLV (same thread — no re-paste) | 7 |
| **2.4** | Decision tree + lock pattern | 15 |
| **2.5** | Build workflow brain (Settings **once** → test) | 28 |
| **2.6** | Automation path that **runs** (+ short Teacher review) | 34 |

- Banner: **YOU ARE HERE — Session 2: Work THROUGH AI**
- Bridge: WITH = junior at your elbow → THROUGH = the **job** runs on a path
- Outcome: Mapped process + locked pattern + workflow brain + path that can run
- Same process as **1.4** — escalate, don’t rebuild toys
- Arc analogy: reception → desk → approval stamp (one customer journey)

**Instructor cue:** Leave park up; advance per task ID.

**Show when:** Start of Session 2

---

### Slide 18 — Task 2.0 · Pattern ladder

**Roadmap task:** **2.0** Framing: pattern ladder (~5 min)

**On slide**

```
TASK 2.0 · Pattern ladder · ~5 min
Because you just… locked one job + stack — ask how much structure THAT job needs (not the universe)
Do now: Same Teacher thread — Prompt Pack 2.0 (“using my locked process”) — no process re-paste
Done when: You know which ladder rung you’re aiming at today; mark 2.0 complete
Analogy: Bicycle → scooter → one van → small fleet → factory conveyor — climb only as high as this route needs
```

- Ladder (vocabulary) — you already lived rungs 1–2 in Session 1:
  1. Instruction-only chat
  2. Knowledge assistant (your docs)
  3. Single workflow agent
  4. Multi-agent workflow *(Session 3 — after something runs)*
  5. Automation pipeline
- Climb only as high as **this process** needs · most ship at 2–3 + light automation

**Instructor cue:** “You already lived chat + assistant. Ladder only asks: how high for *this* job?”

**Show when:** Task 2.0

---

### Slide 19 — Task 2.1 · Map the process

**Roadmap task:** **2.1** Map your process in Teacher chat (~10 min)

**On slide**

```
TASK 2.1 · Map in Teacher chat · ~10 min
Because you just… chose a ladder height — draw the floor plan (steps) for that height
Do now: Type steps once into Teacher (Prompt Pack 2.1) · Teacher tags 🟢/🔵/🔴 · that message IS the map
Done when: Ordered steps exist in the Teacher thread; mark 2.1 complete
Analogy: Kitchen tickets — chef invents (🟢) · timer/printer (🔵) · manager tastes before plate leaves (🔴)
```

- Concept: Map before more tools · chat message = source of truth (no second deck)
- Full tag teach happens **here** (light tease was at 1.4)
- Do not rebuild a new process — use the **1.4** lock

**Instructor cue:** Teach tags once if needed; then silence.

**Show when:** Task 2.1

---

### Slide 20 — Tasks 2.2–2.3 · ETCSLV draft + critique

**Roadmap tasks:** **2.2** First ETCSLV draft (5) → **2.3** Teacher critique (7)

**On slide — concept table + task banner**

```
TASK 2.2 → 2.3 · ETCSLV draft + critique · ~12 min
Because you just… mapped the steps — write the checklist before opening the counter
Do now: 2.2 type E–V in same Teacher thread · 2.3 “Critique my ETCSLV draft above” · reply with stronger L/V
Done when: Critiqued ETCSLV exists in-thread (no re-paste); mark 2.2 & 2.3 complete
Analogy: Before a new service desk opens: how hard · which systems · what they must know · what files stay · what they may never do alone · how you check quality
```

| Letter | Meaning | Core question |
| ------ | ------- | ------------- |
| E | Execution | Multiple reasoning steps or loops? |
| T | Tools | Need external systems? |
| C | Context | What must AI always know? |
| S | State | What must persist beyond one chat? |
| L | Limits | Boundaries, approvals, safeguards? |
| V | Validation | How do we know it’s correct? |

- Most teams fail by picking a tool before answering **C, S, L, V**

**Instructor cue:** Projector teach ETCSLV ~5 min before they draft (per facilitator guide).

**Show when:** Tasks 2.2–2.3

---

### Slide 21 — Task 2.4 · Decision tree + lock pattern

**Roadmap task:** **2.4** Decision tree + lock pattern (~15 min)

**On slide**

```
TASK 2.4 · Decision tree + lock pattern · ~15 min
Because you just… have map + ETCSLV — triage picks the right room (don’t invent architecture)
Do now: Open roadmap decision tree · walk YOUR process · one short Teacher ask · lock the pattern name
Done when: Pattern locked for today’s build; mark 2.4 complete
Analogy: Clinic triage desk — a few questions → the right room, not the whole hospital
```

- Concept: Tree chooses pattern — third chooser after ladder + ETCSLV, but **narrowing**, not a new religion
- Lock before building the brain (2.5)
- Promote complexity only when the tree says so

**Instructor cue:** Unstick people who skip the tree and jump to Zapier.

**Show when:** Task 2.4

---

### Slide 22 — Task 2.5 · Workflow brain

**Roadmap task:** **2.5** Build the workflow brain (~28 min)

**On slide**

```
TASK 2.5 · Workflow brain · ~28 min
Because you just… locked the pattern — write the standing brief for THIS job
Do now: One Teacher ask for instructions → paste into Project Settings ONCE → test on a real input
Done when: Brain Project returns a usable draft for your process; mark 2.5 complete
Analogy: Standing brief for one recurring job (weekly client update) — not the company handbook
```

- Concept: Workflow brain = Settings for the **locked process**
- Identity: extend **Work EA** **or** one new Project — not a third mystery surface / not a new Teacher
- At most one Settings paste here · test with real work sample

**Instructor cue:** Ask “Are you extending Work EA or one new Project?” Quality = usable output.

**Show when:** Task 2.5

---

### Slide 23 — Task 2.6 · Automation that “runs” (+ cost routing)

**Roadmap task:** **2.6** Automation path that runs (~34 min)

**On slide**

```
TASK 2.6 · Automation path that runs · ~34 min
Because you just… tested the brain — open the counter so the job runs without you remembering
Do now: Track A clone template (n8n/Zapier/Make) OR Track B semi-auto · live-run once · short Teacher review
Done when: You can show trigger → AI → output → human approval (if needed); mark 2.6 complete
Analogy: When the form hits reception, the file opens — nobody waits for you to remember
```

- Definition of **running**:
  1. Trigger used once
  2. AI step with your instructions/context
  3. Output where work actually goes
  4. Human approval before external send (if relevant)
- Cost routing (manager skill): low-E → cheaper/faster · high-E / high-stakes → stronger model **+** human approval
- API keys: secrets only — never in notes, chat, or roadmap

**Instructor cue:** Kill paper-only architectures. 60–90 sec on cost routing while they build.

**Show when:** Task 2.6

---

### Slide 24 — Session 3 park · Work BY AI

**Roadmap tasks:** **3.0 → 3.6** (~120 min)

**On slide**

| ID | Do this | ~min |
| -- | ------- | ---- |
| **3.0** | Framing: manager of agents | 4 |
| **3.1** | Design AI workforce in Teacher chat | 15 |
| **3.2** | Harness Card (answer Teacher’s questions) | 15 |
| **3.3** | Failure lab (break → fix) | 18 |
| **3.4** | Capstone — **ship** the running workflow | 38 |
| **3.5** | Demo Day + peer review | 22 |
| **3.6** | 30-day AI adoption plan | 8 |

- Banner: **YOU ARE HERE — Session 3: Work BY AI**
- Bridge: Path already runs → BY = manage it for Monday (roles + rules + fire drills) — **not** a new product
- Outcome: Manage the workforce around **the same** workflow → ship → demo the run
- Arc analogy: You are the floor manager; the counter is already open
- Never cut **3.4** or **3.5** if late — cut instructor talk first

**Instructor cue:** Park; call task numbers loudly.

**Show when:** Start of Session 3

---

### Slide 25 — Tasks 3.0–3.1 · Manager of agents + workforce

**Roadmap tasks:** **3.0** Framing (4) → **3.1** Design AI workforce (15)

**On slide**

```
TASK 3.0 → 3.1 · Manager framing + workforce design · ~19 min
Because you just… have a path that runs — design the smallest team around THAT run (don’t rebuild)
Do now: 3.0 short Teacher framing · 3.1 type minimum roles in Teacher chat · cut overkill
Done when: Org chart of roles exists in Teacher thread (not as final deliverable); mark 3.0 & 3.1 complete
Analogy: Staff a counter that already serves customers — don’t design a new mall
```

- Concept: Example roster (cut to minimum): Planner · Researcher · Writer · Reviewer · **Human**
- Specialists beat one mega-prompt
- Human owns outcomes and external actions
- Chart lives on **Teacher chat or paper** — capstone is still the **run**

**Instructor cue:** 60 sec roster talk; Teacher Agent cuts empire-building.

**Show when:** Tasks 3.0–3.1

---

### Slide 26 — Task 3.2 · Harness Card

**Roadmap task:** **3.2** Harness Card (~15 min)

**On slide**

```
TASK 3.2 · Harness Card · ~15 min
Because you just… named roles — harness = the **same ETCSLV** checklist, named for shipping
Do now: Answer Teacher’s harness questions in the same thread (Prompt Pack 3.2) — map to ETCSLV
Done when: L and V are explicit enough to demo; mark 3.2 complete
Analogy: Job description + SOPs + approval stamp on the desk — rules of the seat, not a new framework
```

| Harness field | ETCSLV |
| ------------- | ------ |
| Workflow | — |
| Execution complexity | E |
| Tools (+ which model $ / $$$) | T |
| Context | C |
| State | S |
| Limits | L |
| Validation | V |

- Weak Limits/Validation = not ready to demo

**Instructor cue:** Spot-check L and V only if short on time.

**Show when:** Task 3.2

---

### Slide 27 — Task 3.3 · Failure Lab

**Roadmap task:** **3.3** Failure lab (~18 min)

**On slide**

```
TASK 3.3 · Failure lab · ~18 min
Because you just… wrote L/V — fire-drill the counter on purpose before Demo Day
Do now: Pick 2 failure modes · trigger on YOUR workflow · fix Harness · Teacher only if stuck
Done when: At least one real break + fix documented; mark 3.3 complete
Analogy: Mystery-shopper drill — send a bad file, a fake fact, a send-without-boss
```

- Five failures (concept):
  1. Missing context
  2. Hallucination
  3. Wrong tool
  4. No approval
  5. Doom loop
- Production AI fails in boring ways

**Instructor cue:** Demo one break yourself first.

**Show when:** Task 3.3

---

### Slide 28 — Task 3.4 · Capstone definition of done

**Roadmap task:** **3.4** Capstone — ship the running workflow (~38 min)

**On slide**

```
TASK 3.4 · Capstone ship · ~38 min
Because you just… fixed one break — make the shop re-openable without the instructor
Do now: Make the workflow re-runnable without the instructor · use your locked stack
Done when: Checklist below is true; mark 3.4 complete
Analogy: Show the shop open — not a poster about the shop
```

- [ ] Trigger defined and used  
- [ ] AI step uses your instructions/context  
- [ ] Output lands in a real destination  
- [ ] Human approval step exists when needed  
- [ ] Harness L + V match what you built  
- [ ] You can re-run without the instructor  

- Capstone ≠ slides. Capstone = **the run**.

**Instructor cue:** Post this for the full 38 min ship block.

**Show when:** Task 3.4

---

### Slide 29 — Task 3.5 · Demo Day rules

**Roadmap task:** **3.5** Demo Day + peer review (~22 min)

**On slide**

```
TASK 3.5 · Demo Day · ~22 min
Because you just… can re-run — show peers the live path (pain → trigger → output → who approves)
Do now: ~3 min/team (or 90-sec lightning) · peer votes
Done when: You showed a live (or just-recorded) run; mark 3.5 complete
Analogy: Live counter demo for a visiting CFO — no slide theater
```

- Must: name the pain → **trigger live** (or recording from last 10 min) → show output → name who approves → one risk fixed
- No slide theater
- Peer votes: Most practical · Safest · Best time save

**Instructor cue:** Strict timer. CFO-in-the-room energy.

**Show when:** Task 3.5

---

### Slide 30 — Task 3.6 · 30-day plan + links

**Roadmap task:** **3.6** 30-day AI adoption plan (~8 min) · then close

**On slide**

```
TASK 3.6 · 30-day plan · ~8 min
Do now: Minimal written plan (Prompt Pack 3.6) · keep Teacher as Monday coach
Done when: Four-week sketch exists; mark 3.6 complete
```

- Week 1: Run this workflow once without the workshop room  
- Week 2: Improve Validation (V)  
- Week 3: Optional second automation **or** cheaper model on low-E steps  
- Week 4: Review Harness with your team  
- Links: Roadmap `[Roadmap URL]` · Prompt Pack `[Prompt Pack link]` · decision tree inside roadmap  
- Optional async later: Session 4 tasks **4.1–4.3** (reads/video)

**Instructor cue:** Close energy; send PDF + links.

**Show when:** Task 3.6 / closing

---

### Slide 31 — Thank you / contact

**Roadmap task:** — (end)

**On slide**

- Workshop title again
- One line: You’re not here to chat better — you’re here to **manage AI work**
- You practiced tasks **0.0 → 3.6** — keep calling work by number on Monday
- Instructor / org contact placeholders
- Optional: feedback form link

**Instructor cue:** End.

**Show when:** End

---

# OPTIONAL SLIDES (only if time / advanced track)

Use only if you explicitly ask NotebookLM to append them. Default deck = **31 slides above**.

### Optional A — API keys safety (60-sec projector) · use during **2.6**

**On slide**

- Keys in secret store / automation credentials — never chat, Git, roadmap  
- Prefer company vault Monday; avoid personal keys in workshop  
- Log tokens ≈ cost; set spend limits  
- Rotate if exposed

### Optional B — Dual-model automation sketch · use during **2.6**

**On slide**

- Step 1 (low E) → cheap/fast model  
- If low confidence / high E → escalate to strong model  
- Always → Validation + Limits

### Optional C — Session 4 reference card (async)

**On slide**

| ID | Optional read/watch |
| -- | ------------------- |
| **4.1** | Anthropic — Building effective agents |
| **4.2** | IBM — What are AI agents? |
| **4.3** | Watch — What is AI? (~5 min) — optional refresher (live = Task **0.0**) |

---

# TAKE-HOME PDF RECIPE (tell NotebookLM)

Create a **2-page handout** from:

**Page 1:** Slides 4 (agenda+task IDs), 6 (What is AI / expect), 9 (chat/assistant/agent), 10 (S1 task table), 14 (lock process), 15 (tool fit), 20 (ETCSLV)  
**Page 2:** Slides 17 (S2 task table), 23 (running + cost), 24 (S3 task table), 26 (harness), 27 (failure), 28 (capstone DoD), 29 (demo rules), 30 (30-day + links)

Title the PDF: `Practical Agentic AI — Participant Takeaway`

Include footer: “Teacher Agent + roadmap teach by task ID; this PDF is the map.”

---

# NOTEBOOKLM GENERATION CONSTRAINTS (paste into chat)

- Max **6 bullets** per slide unless a table is specified (task banner does not count toward the 6)
- Every work slide must show **TASK X.Y · title · minutes · Because you just… · Do now · Done when · Analogy**
- Do **not** paste Prompt Pack Blocks onto slides (link / “use Prompt Pack X.Y” only)
- Do **not** invent timings or task numbers different from the curriculum master
- Do **not** make capstone a “build a presentation” activity
- Prefer tables for ETCSLV, roles, agenda, session park task lists
- Every session park slide must include **YOU ARE HERE** + full task ID table
- Language: clear, managerial, Bangladesh/global workplace OK; no hype

---

# INSTRUCTOR RUN ORDER (when to click)

| Timebox | Slide # | Call out |
| ------- | ------- | -------- |
| Start | 1 → 2 → 3 → 4 | — |
| Session 0 | 5 (park) → 6 (**0.0**) → 7 (**0.1–0.2**) → 8 (**0.3**) → 9 (**0.4**) | Task numbers |
| Session 1 | 10 (park) → 11 (**1.1**) → 12 (**1.2**) → 13 (**1.3**) → 14 (**1.4 lock**) → 15 (**1.5 tools**) → 16 (**1.6 memory**) | Task numbers |
| Session 2 | 17 (park) → 18 (**2.0**) → 19 (**2.1**) → 20 (**2.2–2.3**) → 21 (**2.4**) → 22 (**2.5**) → 23 (**2.6**) | Task numbers |
| Session 3 | 24 (park) → 25 (**3.0–3.1**) → 26 (**3.2**) → 27 (**3.3**) → 28 (**3.4**) → 29 (**3.5**) → 30 (**3.6**) → 31 | Task numbers |

**Park rule:** If the room is mid-task, leave that task’s slide up — don’t flip back to concept-only walls.

---

*Aligned to curriculum master · 2026-07-25 · Progression spine · Session 1 lock→tools→memory · Bridges + analogies on every work slide*
