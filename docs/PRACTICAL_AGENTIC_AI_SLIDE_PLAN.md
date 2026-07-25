# Slide Plan — Practical Agentic AI for Productivity

## NotebookLM brief (use with `PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md`)

**How to use this file in NotebookLM**

1. Upload this file **and** `docs/PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md` as sources.
2. Prompt NotebookLM roughly like:

> Using only these sources, create a participant-facing slide deck for the one-day workshop. Follow the slide plan exactly (slide numbers, titles, and on-slide bullets). Keep slides sparse: max 6 bullets, large readable text, no walls of prose. Tone: professional, practical, non-engineer. Do not invent tools, timings, or frameworks not in the sources. Include a short speaker-note line for each slide under “Instructor cue.” Export as a presentation outline I can paste into Google Slides / PowerPoint. Also produce a 2-page PDF take-home summary from slides 1, 3–5, 8–11, 14–16, 20–22.

1. After generation: replace placeholders (`[Roadmap URL]`, `[Prompt Pack link]`) with real links.

---



## Deck purpose (read this first)


| This deck IS                       | This deck is NOT                               |
| ---------------------------------- | ---------------------------------------------- |
| Orientation spine (“where we are”) | The curriculum (Teacher Agent + roadmap teach) |
| Shared vocabulary wall             | Step-by-step tool tutorials                    |
| Agenda + timing map                | Capstone / Demo Day content                    |
| Take-home PDF reference            | A lecture you read for 40 minutes              |


**In-room rule:** Leave the current “You are here” session slide up while people work. Only advance at transitions. Hands-on time > slide time.

**Visual style for NotebookLM:** Clean, high contrast, minimal icons, one idea per slide, tables OK when specified, avoid dense paragraphs.

**Audience:** Managers, HR, marketing, ops, founders, analysts — not software engineers.

**Promise of the day:** Leave with **one running workflow** for a real business process (not a PPT-only design).

---



## Full day map (for NotebookLM context)

```
Session 0 OPEN (~27) → Session 1 WITH (~90) → break → Session 2 THROUGH (~104)
→ break/lunch → Session 3 BY (~120, includes Demo Day + short 30-day) → Session 4 Reference (async)
```

Arc: **Work WITH AI → Work THROUGH AI → Work BY AI**

Roles: Teacher Agent teaches · Instructor facilitates doing · Roadmap holds checklist · Participant ships

---



# SLIDE-BY-SLIDE PLAN (22 slides)

---



### Slide 1 — Title

**On slide**

- Title: Practical Agentic AI for Productivity
- Subtitle: Build Your Personal AI Workforce in One Day
- Line: One-day instructor-led workshop for working professionals
- Footer: Product of the day = one **running** workflow for your process

**Instructor cue:** Welcome; don’t lecture yet. Point to roadmap login.

**Show when:** Door open / start

---



### Slide 2 — Promise & non-goals

**On slide**

- **You will leave with:** One real workflow that runs (trigger → AI → output → human approval)
- **You will practice:** Managing AI like a team (brief, check, limit, validate)
- **You will not:** Learn to code · master every vendor · build a 16-agent swarm today
- Rule: Simplest pattern that works

**Instructor cue:** Reset expectations. Capstone is a live run, not a deck.

**Show when:** Minute 0–2

---



### Slide 3 — How this room works

**On slide — 4 boxes**


| Role          | Job today                                         |
| ------------- | ------------------------------------------------- |
| Teacher Agent | Explains concepts, drafts prompts, grows with you |
| Instructor    | Short demos, unsticks tools, quality bar          |
| Roadmap (web) | Checklist, decision tree, links                   |
| You           | Build, test, ship                                 |


- Hands-on ≥ ~60% of the day
- Ask the Teacher Agent “why” before asking for a lecture

**Instructor cue:** This is the operating system of the day. Refer back often.

**Show when:** Opening; leave up while they create Teacher Agent if helpful

---



### Slide 4 — Day agenda (“You are here” master map)

**On slide — timeline**

Plain language first. Keep the WITH / THROUGH / BY labels (day arc), but never leave them unexplained on the slide.


| When | Block (say it out loud) | What you will actually do |
| ---- | ----------------------- | ------------------------- |
| ~27 min | **0 · Opening** · Hire your Teacher Agent | Surfaces open · one AI coach for the whole day |
| ~90 min | **1 · Work WITH AI** = AI helps *you* | Ask clearer · pick ≤3 tools · lock **one real job** |
| 15 min | Break | |
| ~104 min | **2 · Work THROUGH AI** = AI helps run *the job* | Map · ETCSLV · decision tree · build · **run once** |
| as scheduled | Break / lunch | |
| ~120 min | **3 · Work BY AI** = AI as a *small team* | Roles · harness · break it · **ship live** · Demo Day |
| later | **4 · Reference** (optional) | Short reads / video at home |


- Bottom banner: **Same job all day.** We only add structure — we do not start a new project at lunch.
- Optional footer legend (small): WITH = helper · THROUGH = one running process · BY = roles + rules + ship

**Instructor cue:** At each transition, point to the row and say the plain line (“AI helps you” / “AI helps run the job” / “AI as a small team”), not only WITH/THROUGH/BY. Add a “YOU ARE HERE” marker.

**Show when:** Opening; each section transition

---



### Slide 5 — The growth ladder (vocabulary)

**On slide — vertical ladder**

1. Instruction-only chat
2. Knowledge assistant (your docs)
3. Single workflow agent
4. Multi-agent workflow
5. Automation pipeline

- Today we climb only as high as **your process needs**
- Most people ship at levels 2–3 + light automation

**Instructor cue:** One breath. No deep dive — Teacher Agent explains in their context later.

**Show when:** Opening (30 sec) + Session 2 framing

---



### Slide 6 — Chat vs Assistant vs Agent

**On slide — 3 columns**


| Chat                      | Assistant                         | Agent / workflow                   |
| ------------------------- | --------------------------------- | ---------------------------------- |
| One-off question          | Reusable job + instructions/files | Multi-step job with tools/triggers |
| You re-explain every time | Same brief every week             | Runs a path; you manage exceptions |
| Good for exploration      | Good for repeatable drafts/Q&A    | Good when process is mapped        |


- All day you **manage** these — you don’t worship the model

**Instructor cue:** After Teacher Agent exists, ask 2 people for their Teacher’s one-line definition.

**Show when:** After Teacher Agent build / checkpoint

---



### Slide 7 — Session 1 marker · Work WITH AI

**On slide**

- Banner: **YOU ARE HERE — Session 1: Work WITH AI** (~90 min) · tasks 1.1–1.6
- Outcome: Work EA hired (3 runs) + one coach loop + process locked
- Flow (short):
  1. Fill EA brief → 3 Work EA runs
  2. Teacher critiques **once** → re-run once
  3. Tools ≤3 + memory
  4. Lock today’s process
- Reminder: Same Teacher chat all day · Stop → Read → Decide

**Instructor cue:** Leave this slide up during Session 1 work.

**Show when:** Start of Session 1

---



### Slide 8 — Tool strategy for Demo Day

**On slide**

- **Browse** widely for ~20 minutes (fit test)
- **Ship** with at most 2–3 tools
- Typical stack:
  1. Primary brain — ChatGPT **or** Claude Project
  2. Grounding — NotebookLM only if doc-heavy
  3. Runner — automation template **or** semi-auto Track B
- Demo Day = re-run the stack you already used — not a tool zoo

**Instructor cue:** Kill FOMO. Say this before Tool Fit Sprint.

**Show when:** Before / during Node 3 Tool Fit

---



### Slide 9 — Tag work before automating

**On slide**

- 🟢 LLM thinking — draft, summarize, brainstorm  
- 🔵 Rules / automation — forms, reminders, filters, triggers  
- 🔴 Human only — legal, people conflict, money, external send approval  
- End of Session 1: pick **one** process that has clear 🟢 + 🔴

**Instructor cue:** Use when they choose today’s process in Teacher chat.

**Show when:** Session 1 Node 4

---



### Slide 10 — Session 2 marker · Work THROUGH AI

**On slide**

- Banner: **YOU ARE HERE — Session 2: Work THROUGH AI** (~104 min) · tasks 2.0–2.6
- Outcome: Mapped process + locked pattern + workflow brain + **automation path that can run**
- Nodes:
  1. Map on Teacher chat or paper
  2. Decision tree → lock pattern
  3. Build workflow brain (assistant/agent core)
  4. Automation path (clone template preferred)
- Same process as Session 1 — escalate, don’t rebuild toys

**Instructor cue:** Leave up during Session 2.

**Show when:** Start of Session 2

---



### Slide 11 — ETCSLV (harness checklist)

**On slide — table**


| Letter | Meaning    | Core question                      |
| ------ | ---------- | ---------------------------------- |
| E      | Execution  | Multiple reasoning steps or loops? |
| T      | Tools      | Need external systems?             |
| C      | Context    | What must AI always know?          |
| S      | State      | What must persist beyond one chat? |
| L      | Limits     | Boundaries, approvals, safeguards? |
| V      | Validation | How do we know it’s correct?       |


- Most teams fail by picking a tool before answering **C, S, L, V**

**Instructor cue:** Vocabulary wall. Teacher Agent fills bullets from their Teacher chat map.

**Show when:** Session 2 framing / map node; again at Harness

---



### Slide 12 — Cost & model routing (manager skill)

**On slide**

- Title: Don’t use a $$$ model for a $ task
- Table:


| Task type                            | Model choice                      |
| ------------------------------------ | --------------------------------- |
| Format, extract, tag, clear classify | Smaller / faster / cheaper        |
| Ambiguous planning, hard synthesis   | Stronger / costlier               |
| External send / high-stakes tone     | Strong model **+ human approval** |


- Route by **Execution (E)** difficulty, not brand loyalty
- Mark process steps: `$` vs `$$$`
- API keys (if used): secrets only — never in notes, chat, or roadmap

**Instructor cue:** 60–90 sec talk + point to dual-model idea in automation. Optional micro-exercise with Teacher Agent.

**Show when:** Session 2 before/during Automation Path

---



### Slide 13 — Automation definition of “running”

**On slide**

- A workflow “runs” when you can show:
  1. Trigger used once
  2. AI step with your instructions/context
  3. Output where work actually goes
  4. Human approval before external send (if relevant)
- Track A: clone no-code template (n8n / Zapier / Make)  
- Track B: semi-auto still valid if tools blocked — must still **live-run**

**Instructor cue:** Kill paper-only architectures.

**Show when:** Start of Automation Path

---



### Slide 14 — Session 3 marker · Work BY AI

**On slide**

- Banner: **YOU ARE HERE — Session 3: Work BY AI** (~120 min) · tasks 3.0–3.6
- Outcome: Manage the workforce around **the same** workflow → ship → demo the run
- Nodes:
  1. AI workforce in Teacher chat (minimum roles)
  2. Harness Card (ETCSLV)
  3. Failure Lab (break it on purpose)
  4. Capstone: **ship the running workflow** (not a PPT)
  5. Demo Day: show the run

**Instructor cue:** Leave up during Session 3.

**Show when:** Start of Session 3

---



### Slide 15 — Manager of agents (roles)

**On slide**

- Example roster (cut to minimum): Planner · Researcher · Writer · Reviewer · **Human**
- Specialists beat one mega-prompt
- Human owns outcomes and external actions
- Org chart lives on **Teacher chat or paper**, not as the final deliverable

**Instructor cue:** 60 sec; then they build in Teacher chat with Teacher Agent cutting overkill.

**Show when:** Workforce node

---



### Slide 16 — Harness Card fields

**On slide — map to ETCSLV**


| Harness field                 | ETCSLV |
| ----------------------------- | ------ |
| Workflow                      | —      |
| Execution complexity          | E      |
| Tools (+ which model $ / $$$) | T      |
| Context                       | C      |
| State                         | S      |
| Limits                        | L      |
| Validation                    | V      |


- Weak Limits/Validation = not ready to demo

**Instructor cue:** Spot-check L and V only if short on time.

**Show when:** Harness node

---



### Slide 17 — Failure Lab modes

**On slide — five failures**

1. Missing context
2. Hallucination
3. Wrong tool
4. No approval
5. Doom loop

- Pick 2 · trigger on **your** workflow · fix Harness  
- Production AI fails in boring ways

**Instructor cue:** Demo one break yourself first.

**Show when:** Failure Lab

---



### Slide 18 — Capstone definition of done

**On slide — checklist**

- [ ] Trigger defined and used  
- [ ] AI step uses your instructions/context  
- [ ] Output lands in a real destination  
- [ ] Human approval step exists when needed  
- [ ] Harness L + V match what you built  
- [ ] You can re-run without the instructor  

- Capstone ≠ slides. Capstone = **the run**.

**Instructor cue:** Post this during the 38 min ship block.

**Show when:** Capstone / ship

---



### Slide 19 — Demo Day rules

**On slide**

- ~3 minutes per team (or 90-sec lightning if many teams)
- Must: name the pain → **trigger live** (or recording from last 10 min) → show output → name who approves → one risk fixed
- No slide theater
- Peer votes: Most practical · Safest · Best time save

**Instructor cue:** Strict timer. CFO-in-the-room energy.

**Show when:** Demo Day start

---



### Slide 20 — 30-day challenge

**On slide**

- Week 1: Run this workflow once without the workshop room  
- Week 2: Improve Validation (V)  
- Week 3: Optional second automation **or** cheaper model on low-E steps  
- Week 4: Review Harness with your team  
- Keep Teacher Agent as Monday coach  
- Promote complexity only when the decision tree says so

**Instructor cue:** Close energy; send PDF + Prompt Pack link.

**Show when:** Closing

---



### Slide 21 — Links & takeaways

**On slide**

- Roadmap: `[Roadmap URL]`
- Prompt Pack: `[Prompt Pack link]`
- Decision tree: inside roadmap
- Take home: this PDF + your running workflow + Teacher Agent Project

**Instructor cue:** QR codes optional.

**Show when:** Closing / email follow-up

---



### Slide 22 — Thank you / contact

**On slide**

- Workshop title again
- One line: You’re not here to chat better — you’re here to **manage AI work**
- Instructor / org contact placeholders
- Optional: feedback form link

**Instructor cue:** End.

**Show when:** End

---



# OPTIONAL SLIDES (only if time / advanced track)

Use only if you explicitly ask NotebookLM to append them. Default deck = **22 slides above**.

### Optional A — API keys safety (60-sec projector)

**On slide**

- Keys in secret store / automation credentials — never chat, Git, roadmap  
- Prefer company vault Monday; avoid personal keys in workshop  
- Log tokens ≈ cost; set spend limits  
- Rotate if exposed



### Optional B — Dual-model automation sketch

**On slide**

- Step 1 (low E) → cheap/fast model  
- If low confidence / high E → escalate to strong model  
- Always → Validation + Limits

---



# TAKE-HOME PDF RECIPE (tell NotebookLM)

Create a **2-page handout** from:

**Page 1:** Slides 1, 3, 4, 5, 6, 8, 11, 12  
**Page 2:** Slides 13, 16, 17, 18, 19, 20, 21  

Title the PDF: `Practical Agentic AI — Participant Takeaway`

Include footer: “Teacher Agent + roadmap teach; this PDF is the map.”

---



# NOTEBOOKLM GENERATION CONSTRAINTS (paste into chat)

- Max **6 bullets** per slide unless a table is specified  
- Do **not** paste Prompt Pack Blocks A–Q onto slides (link only)  
- Do **not** invent timings different from the facilitator guide  
- Do **not** make capstone a “build a presentation” activity  
- Prefer tables for ETCSLV, roles, agenda, cost routing  
- Every section marker slide must include **YOU ARE HERE**  
- Language: clear, managerial, Bangladesh/global workplace OK; no hype

---



# INSTRUCTOR RUN ORDER (when to click)


| Timebox            | Slide #                                         |
| ------------------ | ----------------------------------------------- |
| Start              | 1 → 2 → 3 → 4 → 5                               |
| Teacher Agent live | 6                                               |
| Session 1          | 7 (park) → 8 before tools → 9 at process choice |
| Session 2          | 10 (park) → 11 → 12 → 13                        |
| Session 3          | 14 (park) → 15 → 16 → 17 → 18                   |
| Demo + close       | 19 → 20 → 21 → 22                               |


---

*Aligned to facilitator guide version 2026-07-22 · Product-of-day: one running workflow · Teacher-Agent–led*