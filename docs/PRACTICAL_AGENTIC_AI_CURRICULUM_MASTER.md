# Practical Agentic AI — Curriculum Master (source of truth)

**Keep in sync:** roadmap SQL · Prompt Pack · Facilitator Guide · Slide Plan.

**Roadmap title in DB:** `Become a Manager of AI Agents`  
**DB `week_number` = session number** (0–4) so the UI shows Session 0 … Session 4.  
**Latest SQL:** [`sql/20260725_agentic_curriculum_less_paste_v2.sql`](../sql/20260725_agentic_curriculum_less_paste_v2.sql)  
**Forward-fixes (run in order after less-paste v2):**
1. [`sql/20260725_agentic_add_task_0_0_what_is_ai.sql`](../sql/20260725_agentic_add_task_0_0_what_is_ai.sql) — Task **0.0**
2. [`sql/20260725_agentic_session1_lock_before_tools.sql`](../sql/20260725_agentic_session1_lock_before_tools.sql) — Session 1 order: lock → tools → memory  
**Prompts in roadmap tasks:** [`sql/20260725_agentic_task_prompts_in_roadmap_fix.sql`](../sql/20260725_agentic_task_prompts_in_roadmap_fix.sql); Task **0.0** + Session 1 reorder details are in the forward-fixes above.

**Task IDs** appear in: roadmap `task_name`, Prompt Pack headings, facilitator call numbers, agenda slides.

---

## Design rules (room of 30–40)

1. **Few surfaces:** roadmap · Prompt Pack (read prompts) · AI Projects/tools. Optional: paper or one personal note for thinking — never required as a paste source.
2. **Same Teacher chat all day.** Prefer “use what I already told you” over re-pasting process / map / ETCSLV.
3. **Teacher ↔ Work EA switch once** (Session 1 coach loop). Not every task.
4. **Copy-paste less; think and review more.** After each AI reply: stop, read, decide what is wrong, then act.
5. **At most one “paste into Settings”** per Project (Teacher at 0.2, Work EA at 1.2, workflow brain once at 2.5).
6. **No Google Slides “Working Pack.”** Scratch on paper or a blank note if helpful. Answers live in the chat thread.
7. **No concept before its prerequisite.** See progression spine below. Every task opens with a **Because you just…** bridge.
8. **Analogy before jargon.** Name the workplace picture first; introduce the acronym second.

---

## Progression spine (why this order)

Human story of the day: **hire a coach → hire a helper → commit one job → pick tools for that job → make the job run → manage the job like a small team.**

| Stage | Plain meaning | Tasks | Must already be true |
| ----- | ------------- | ----- | -------------------- |
| **Orient** | What AI is; what today will / won’t give you | **0.0** | — |
| **Open desk** | Surfaces ready | **0.1** | Expectations set |
| **Hire coach** | Teacher Project + Settings (handbook) | **0.2–0.3** | Desk open |
| **Name the roles** | Chat vs assistant vs agent (lived Project) | **0.4** | Teacher chat exists |
| **Hire helper** | Work EA brief → 3 runs → one coach loop | **1.1–1.3** | “Assistant” named at 0.4 |
| **Commit the job** | Lock **one** process for the rest of the day | **1.4** | Lived WITH AI on real work |
| **Equip the job** | ≤3 tools that fit **that** process | **1.5** | Process locked |
| **Ground the job** | Docs/memory for **that** process | **1.6** | Stack chosen |
| **Choose height** | Pattern ladder for *this* process only | **2.0** | Job + stack locked |
| **Map the path** | Steps + 🟢/🔵/🔴 | **2.1** | Process locked; ladder framed |
| **Write the job rules** | ETCSLV draft → critique | **2.2–2.3** | Map exists |
| **Pick the room** | Decision tree → lock pattern | **2.4** | Map + ETCSLV |
| **Staff the counter** | Workflow brain (Settings for this job) | **2.5** | Pattern locked |
| **Open for business** | Automation that **runs** once | **2.6** | Brain tested |
| **Manage the floor** | Roles → harness (= ETCSLV named for shipping) → break → ship → demo | **3.0–3.5** | A path already runs |
| **Monday ritual** | 30-day plan | **3.6** | Capstone lived |

**Arc labels (say the plain line first):**

| Label | Plain line | Analogy |
| ----- | ---------- | ------- |
| Work **WITH** AI | AI helps *you* at your elbow | A capable junior sitting next to you |
| Work **THROUGH** AI | AI helps run *the job* on a path | A reception → desk → stamp process |
| Work **BY** AI | AI as a *small team* you manage | You are the manager; roles + rules + fire drills |

**Do not teach early (even if text appears in Teacher Settings):**
- Full ETCSLV decode → wait for **2.2** (Settings may contain the letters; say “ignore until Session 2”)
- Full pattern ladder → wait for **2.0**
- Multi-agent workforce design → wait for **3.0–3.1** (after something already runs)
- 🟢/🔵/🔴 deep teach → light tease at **1.4**; full teach at **2.1**

---

## Analogy bank (use on slides + facilitator talk)

| Concept | Say this first |
| ------- | -------------- |
| AI (0.0) | A very fast junior who has read a lot of the internet — drafts well, invents confidently, needs a manager |
| Settings vs chat | Joining letter / employee handbook vs today’s conversation at the desk |
| Teacher vs Work EA | External trainer who coaches you all day vs your own secretary who does the daily work |
| Chat / assistant / agent | Hallway question to whoever’s free vs hired desk EA with a standing brief vs routed office process (intake → desk → approval stamp) |
| Stop → Read → Decide | Taste the food before it leaves the kitchen — don’t serve the first plate blindly |
| Tool fit (≤3) | Don’t open every shop in the market — pick two stalls that serve *today’s* meal |
| Memory / grounding | Give the junior the company file, not rumors from the corridor |
| Process lock | Choose **one** customer journey for today — not the whole company |
| 🟢/🔵/🔴 | Kitchen: chef inventing a special (green) · oven timer / ticket printer (blue) · manager tasting before the plate leaves (red) |
| Pattern ladder | Bicycle → scooter → one delivery van → small fleet with dispatch → factory conveyor — climb only as high as *this* route needs |
| ETCSLV / Harness | Checklist before opening a new counter: how hard (E), which systems (T), what they must always know (C), what files stay (S), what they may never do alone (L), how you check quality (V). **Harness = the same checklist**, named for shipping |
| Decision tree | Clinic triage desk: a few questions → the right room, not the whole hospital |
| Workflow brain | Standing brief for **one** recurring job (e.g. weekly client update) — not the whole company handbook |
| Automation trigger | “When the form hits reception, the file opens — nobody waits for you to remember” |
| Cost routing | Don’t send a senior manager to photocopy; cheap clerk for format, senior + sign-off for judgment |
| Failure lab | Mystery-shopper / fire drill on your own counter |
| Capstone / Demo Day | Show the shop open — not a poster about the shop |

---

## Day clock (live)

| Block | Time |
| ----- | ---- |
| Session 0 — Opening | ~33 min |
| Session 1 — Work WITH AI | ~90 min |
| Break | 15 min |
| Session 2 — Work THROUGH AI | ~104 min |
| Break / lunch | 15–60 min |
| Session 3 — Work BY AI | ~120 min |
| **Live core** | **~5.5–6.5 hrs** (+ lunch) |
| Session 4 — Reference | ~40 min optional async |

---

## Session 0 — Housekeeping + Opening (~33 min)

| ID | Task | Min | Type | Because you just… |
| -- | ---- | --- | ---- | ----------------- |
| 0.0 | What is AI? What to expect / not expect | 6 | attend | — (day starts here) |
| 0.1 | Open roadmap + Prompt Pack + your AI tool | 5 | attend | …set expectations — now open the desk |
| 0.2 | Create Teacher Agent + paste instructions into **Settings** | 10 | project | …have tools open — hire the coach (handbook → Settings) |
| 0.3 | Day contract with Teacher (same chat all day from here) | 7 | project | …hired the coach — start the all-day conversation |
| 0.4 | Chat vs assistant vs agent + checkpoint | 5 | attend | …used a Project — name what you just lived |

---

## Session 1 — Work WITH AI (~90 min)

| ID | Task | Min | Type | Because you just… |
| -- | ---- | --- | ---- | ----------------- |
| 1.1 | Fill your Work EA brief (think first — paper or note) | 6 | written | …named “assistant” — write the job brief before hiring |
| 1.2 | Create Work EA + run **three** real tasks in that Project | 22 | project | …wrote the brief — hire the secretary and use them thrice |
| 1.3 | **One** coach loop: Teacher critiques → you fix Settings → re-run once | 16 | project | …have real EA output — coach once, don’t thrash |
| 1.4 | Lock today’s process (think, then one short Teacher check) | 11 | project | …felt WITH AI — **commit one job** before shopping for tools |
| 1.5 | Tool landscape + fit (max 2–3 tools) **for the locked process** | 25 | project | …locked the job — equip only what that job needs |
| 1.6 | Memory — docs + grounded questions **for that process** | 10 | project | …chose the stack — ground it with the right files |

> **Order rule:** Lock process (**1.4**) → tools (**1.5**) → memory (**1.6**). Never browse a tool zoo before the job is chosen.

---

## Session 2 — Work THROUGH AI (~104 min)

| ID | Task | Min | Type | Because you just… |
| -- | ---- | --- | ---- | ----------------- |
| 2.0 | Framing: pattern ladder (same Teacher thread) | 5 | attend | …locked one job — ask how much structure *that* job needs |
| 2.1 | Map your process **in Teacher chat** (type steps once) | 10 | project | …chose a height — write the steps on the floor plan |
| 2.2 | First ETCSLV draft — you type in same thread | 5 | written | …mapped steps — write the counter checklist (E–V) |
| 2.3 | Teacher critiques ETCSLV (reply in same thread — no re-paste) | 7 | project | …drafted E–V — tighten Limits + Validation |
| 2.4 | Decision tree + lock pattern (roadmap, then one short Teacher ask) | 15 | project | …have map + rules — triage picks the room (pattern) |
| 2.5 | Build the workflow brain (one Teacher ask → paste Settings **once** → test) | 28 | project | …locked pattern — write the standing brief for **this** job |
| 2.6 | Automation path that runs (+ short Teacher review) | 34 | project | …tested the brain — open the counter (trigger → run once) |

> **Identity rule:** Workflow brain = Settings for the **locked process** (extend Work EA **or** one new Project — not a third mystery surface).

---

## Session 3 — Work BY AI (~120 min)

| ID | Task | Min | Type | Because you just… |
| -- | ---- | --- | ---- | ----------------- |
| 3.0 | Framing: manager of agents | 4 | attend | …have a path that runs — now manage it for Monday |
| 3.1 | Design AI workforce **in Teacher chat** (type, then cut) | 15 | project | …are the manager — minimum roster around the **same** run |
| 3.2 | Harness Card — answer Teacher’s questions (same thread) | 15 | project | …named roles — harness = **same ETCSLV**, shipping name |
| 3.3 | Failure lab (break → review → fix; Teacher only if stuck) | 18 | project | …wrote L/V — fire-drill the counter on purpose |
| 3.4 | Capstone — ship the running workflow | 38 | project | …fixed one break — make it re-runnable without the instructor |
| 3.5 | Demo Day + peer review | 22 | attend | …can re-run — show the shop open, not a poster |
| 3.6 | 30-day AI adoption plan (minimal) | 8 | written | …demoed — write the Monday ritual |

---

## Session 4 — Reference (optional, ~40 min async)

| ID | Task | Min | Required |
| -- | ---- | --- | -------- |
| 4.1 | Read: Building effective agents (Anthropic) | 20 | no |
| 4.2 | Read: What are AI agents? (IBM) | 15 | no |
| 4.3 | Watch: What is AI? (~5 min) — optional refresher (live framing is Task **0.0**) | 5 | no |

---

## Surfaces

| Surface | Purpose |
| ------- | ------- |
| Agenda PPT (projector) | Where we are — task + concept + **bridge** + **analogy** (`PRACTICAL_AGENTIC_AI_SLIDE_PLAN.md`) |
| Roadmap website | Checklist + decision tree |
| Prompt Pack | Read-only prompts to copy **into AI** when told |
| AI tools | Teacher Project, Work EA Project, NotebookLM, automation, etc. |
| Optional scratch | Paper **or** one blank note/doc — for thinking only. Do **not** maintain a second “answer deck.” |

No Miro. No Google Slides Working Pack.

---

*Last synced: 2026-07-25 · progression spine · Session 1 = lock→tools→memory · analogies required on concept slides*
