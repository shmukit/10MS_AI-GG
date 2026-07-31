<!--
COMPACT EDITION (~35 pages) — trimmed from the full workbook for print budget.
The full edition stays at docs/BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK.md (58 pp).

PDF EXPORT
  python3 scripts/export_workbook_pdf.py docs/BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK_COMPACT.md

Needs: pip3 install markdown · Google Chrome
Output: docs/BECOME_A_MANAGER_OF_AI_AGENTS_PARTICIPANT_WORKBOOK_COMPACT.pdf
-->
<style>
/* Embedded fallback so tables/boxes still print if external CSS is skipped */
table { border-collapse: collapse !important; width: 100% !important; margin: 0.75em 0 !important; border: 1.5px solid #111 !important; }
th, td { border: 1px solid #333 !important; padding: 6px 8px !important; vertical-align: top !important; text-align: left !important; }
th, thead th, tr:first-child th { background: #d9d9d9 !important; font-weight: 700 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
tbody tr:nth-child(even) td { background: #f7f7f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table:has(> tbody > tr > td:only-child),
table:has(> thead > tr > th:only-child) { border: 2.5px solid #111 !important; background: #f3f3f3 !important; }
table:has(> thead > tr > th:only-child) thead th,
table:has(> tbody > tr > td:only-child) thead th { background: #222 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table:has(> tbody > tr > td:only-child) tbody td,
table:has(> thead > tr > th:only-child) tbody td { color: #111 !important; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
table:has(> tbody > tr > td:only-child) tbody tr:nth-child(even) td,
table:has(> thead > tr > th:only-child) tbody tr:nth-child(even) td { background: #ececec !important; color: #111 !important; }
blockquote { margin: 0.8em 0 !important; padding: 10px 14px !important; border: 1.5px solid #333 !important; border-left: 6px solid #111 !important; background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page-break { break-before: page !important; page-break-before: always !important; display: block; height: 0; }
pre { border: 1.5px solid #333 !important; background: #f4f4f4 !important; padding: 10px 12px !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1 { border-bottom: 3px solid #111; padding-bottom: 0.25em; }
h2 { border-bottom: 1.5px solid #444; padding-bottom: 0.15em; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

/* —— COMPACT EDITION density overrides (page budget ~35pp) —— */
@page { size: A4; margin: 11mm 11mm 26mm 11mm; }
body { font-size: 9.5pt !important; line-height: 1.26 !important; padding-bottom: 4mm !important; }
h1 { font-size: 16pt !important; margin: 0.1em 0 0.3em !important; }
h2 { font-size: 12pt !important; margin: 0.55em 0 0.25em !important; }
h3 { font-size: 10.5pt !important; margin: 0.5em 0 0.2em !important; }
hr { margin: 0.45em 0 !important; }
p { margin: 0.3em 0 !important; }
table { font-size: 8.5pt !important; margin: 0.4em 0 0.5em !important; }
th, td { padding: 3px 5px !important; }
table:has(> tbody > tr > td:only-child),
table:has(> thead > tr > th:only-child) { margin: 0.45em 0 0.6em !important; }
table:has(> thead > tr > th:only-child) thead th,
table:has(> tbody > tr > td:only-child) thead th { font-size: 9pt !important; padding: 5px 7px !important; }
blockquote { margin: 0.4em 0 !important; padding: 6px 10px !important; }
pre, code { font-size: 7.8pt !important; }
pre { padding: 6px 9px !important; margin: 0.4em 0 !important; line-height: 1.25 !important; }
ul, ol { margin: 0.25em 0 0.35em 1.1em !important; }
li { margin: 0.1em 0 !important; }
</style>

**Sec 01** · Opening · Cover & How to Use

# Become a Manager of AI Agents

### Build Your Personal AI Workforce

**One-day instructor-led workshop · Participant Workbook — Compact Edition**

---


|                         |                                  |
| ----------------------- | -------------------------------- |
| **Participant name**    | ________________________________ |
| **Organization / team** | ________________________________ |
| **Role**                | ________________________________ |
| **Date**                | ________________________________ |
| **City**                | ________________________________ |

> **How to use this book**
> This is a **workshop companion**, not a textbook. Listen to the instructor. Use these pages to capture ideas, complete exercises, and take home a plan you can use later. Write in the blanks. Leave pages messy. The value is in *your* notes, not the printed text.
> Where you see *italic starters* or an “e.g.” — those are **examples to steal and adapt**, not the “right answer.” Cross them out and write your real work.
>
> **Roadmap = instructions.** Each task’s **Copy** box lives on the roadmap website. This book is for writing, worksheets, and notes — not a second prompt dump.
>
> **Finding a page:** Use the **page number at the bottom center** (same as the PDF viewer). Headers say **Sec XX** for the chapter.

---

*Become a Manager of AI Agents · Participant Workbook · Sec 01*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 02** · Opening · Story of the Day & Day Map

## The story of the day

```
Work WITH AI  →  Work THROUGH AI  →  Work BY AI
     ↓                  ↓                  ↓
 AI helps YOU     AI runs THE JOB    YOU manage AI
 at your job     on a clear path    like a small team
```


| Stage       | Plain meaning                      | Workplace example                         |
| ----------- | ---------------------------------- | ----------------------------------------- |
| **WITH**    | AI sits next to you and helps      | A capable junior at your desk             |
| **THROUGH** | AI helps run a recurring process   | Reception → desk → approval               |
| **BY**      | You coordinate specialist AI roles | You are the manager; AI does the drafting |


**Product of the day:** One real work process that can run like this:

> Trigger → AI step → Output where work lives → Human approval for anything risky

## Day map (fill as you go)


| Block         | Focus                                     | Time (approx.) | Tasks       | My status |
| ------------- | ----------------------------------------- | -------------- | ----------- | --------- |
| Opening       | What AI is · expectations · Teacher Agent | ~35 min        | **0.0–0.4** | ☐         |
| Session 1     | Work **WITH** AI                          | ~90 min        | **1.1–1.6** | ☐         |
| Break         |                                           | 15 min         |             | ☐         |
| Session 2     | Work **THROUGH** AI                       | ~105 min       | **2.0–2.6** | ☐         |
| Lunch / break |                                           |                |             | ☐         |
| Session 3     | Work **BY** AI · Demo Day · 30-day plan   | ~115 min       | **3.0–3.6** | ☐         |


**My painful process for today (one sentence):**

> *Starter:* “Every Friday I scramble WhatsApp notes into a manager update and numbers go wrong.”
>
> ---

**What “done” looks like:**

> *e.g.* “Friday 4pm: one approved email draft in Gmail, numbers checked, ready to send.”
>
> ---

---

*Become a Manager of AI Agents · Participant Workbook · Sec 02*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 03** · Opening · Contents — Page Guide

# Contents — Page Guide

Instructors may say “open **Sec 10**” or “Task **1.1**.” In this edition the **Sec number is also the page number**. Task serials match the roadmap website and slides: **0.0→0.4** · **1.1→1.6** · **2.0→2.6** · **3.0→3.6**.

| Sec    | Block               | Title                                       | Tasks       |
| ------ | ------------------- | ------------------------------------------- | ----------- |
| **01** | Opening             | Cover & How to Use                          |             |
| **02** | Opening             | Story of the Day & Day Map                  |             |
| **03** | Opening             | Contents — Page Guide                       |             |
| **04** | Session 0 · Opening | What is AI? What is Generative AI?          | **0.0**     |
| **05** | Session 0 · Opening | AI vs Software · Chat / Assistant / Agent   |             |
| **06** | Session 0 · Opening | Teacher Agent & Labels                      | **0.1–0.4** |
| **07** | Session 0 · Opening | Prompt Engineering (CTAO)                   |             |
| **08** | Section 1 · WITH    | Hallucination & Human-in-the-loop           |             |
| **09** | Section 1 · WITH    | Worksheet A — Work Assistant Brief          | **1.1–1.3** |
| **10** | Section 1 · WITH    | Worksheet B — Lock Process                  | **1.4**     |
| **11** | Section 1 · WITH    | Choosing Tools (≤3)                         | **1.5**     |
| **12** | Section 1 · WITH    | Context, Memory & Reflection                | **1.6**     |
| **13** | Section 2 · THROUGH | Workflows — the destination picture         |             |
| **14** | Section 2 · THROUGH | Pattern Ladder, Readiness & Projects        | **2.0**     |
| **15** | Section 2 · THROUGH | Worksheet C — Workflow Canvas               | **2.1**     |
| **16** | Section 2 · THROUGH | ETCSLV Framework                            |             |
| **17** | Section 2 · THROUGH | Worksheet D — ETCSLV Draft                  | **2.2–2.3** |
| **18** | Section 2 · THROUGH | Decision Tree & Type Cards                  | **2.4**     |
| **19** | Section 2 · THROUGH | Workflow Brain, Make it Run & Reflection    | **2.5–2.6** |
| **20** | Section 3 · BY      | From Helper to AI Workforce                 | **3.0**     |
| **21** | Section 3 · BY      | Worksheet F — AI Workforce Canvas           | **3.1**     |
| **22** | Section 3 · BY      | Worksheet E — Harness Card                  | **3.2**     |
| **23** | Section 3 · BY      | Failure Lab                                 | **3.3**     |
| **24** | Section 3 · BY      | Worksheet G — Capstone & Demo Day           | **3.4–3.5** |
| **25** | Section 3 · BY      | Delegation, Adoption Plan & Reflection      | **3.6**     |
| **26** | Reference           | R1 Prompt Cheat Sheet · R3 Workflow Check   |             |
| **27** | Reference           | R2 Tool Matrix · R4 ETCSLV · R5 Tree        |             |
| **28** | Reference           | R6 Ethics & Privacy · R9 Glossary           |             |
| **29** | Reference           | R7 — 30-Day Personal AI Adoption Plan       | **3.6**     |
| **30** | Reference           | R8 — Corporate Scenario Bank                |             |
| **31** | Big picture         | Day Roadmap — How every piece connects      | **0.0–3.6** |
| **32** | Notes               | Notes page                                  |             |
| **33** | Notes               | Parking Lot, Wins & Closing                 |             |


**Quick find** — Work Assistant Brief **09** · Lock process **10** · Tool fit **11** · Memory **12** · Workflow Canvas **15** · ETCSLV taught **16** · ETCSLV draft **17** · Harness Card **22** · Capstone **24** · 30-day plan **29** · Scenario ideas **30**

---

*Become a Manager of AI Agents · Participant Workbook · Sec 03*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 04** · Session 0 · Opening · What is AI? What is Generative AI?

# SESSION 0 — Housekeeping + Opening

*Goal: Shared language + one Teacher Agent you will use all day.*


| 🧠 **TASK 0.0** (~5 min) — What is AI? What to expect / not expect |
| -------------------------------------------------------------------------------- |
| **Do:** Follow the instructor. On this page, write one line you **expect** today and one you will **not** expect. |
| **Done when:** Both lines written. Mark roadmap **0.0** complete. |


**What is AI — in plain words:**
Software that learns patterns from large amounts of data and produces useful outputs — text, summaries, suggestions, classifications — without you writing every rule by hand.

**Analogy:** A **very fast new junior** who has read a huge library. They draft quickly and **sound confident**. They still invent details when unsure. They need a manager who briefs them, checks the work, and decides what leaves the room.

**What is Generative AI:** AI that creates *new* content from a prompt — emails, reports, Bangla/English rewrites, slide outlines — instead of only retrieving a fixed answer.
Traditional software is a **fixed menu**: press button → same dish. Generative AI is a **skilled cook**: give ingredients and instructions → a new plate each time. **Taste before you serve.**

**What AI is good at today**


| Strong                             | Weak / risky                                              |
| ---------------------------------- | --------------------------------------------------------- |
| Drafting and rewriting             | Final hiring, legal, budget, or credit decisions          |
| Summarizing long text              | Inventing “facts” when sources are missing                |
| Turning rough notes into structure | Knowing your latest internal policy unless you provide it |
| Brainstorming options              | Sending emails, publishing, or approving alone            |


> **Callout — Manager mindset**
> You do not need to “become a programmer.” You need to become a **clear brief-giver and quality checker**.

**I expect today:** _______________________________________________________________

**I do *not* expect today:** ______________________________________________________

**Where I already manage juniors (brief → review → approve):** ____________________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 04*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 05** · Session 0 · Opening · AI vs Software · Chat / Assistant / Agent

## AI vs traditional software


|                  | Traditional software                                  | Generative AI                            |
| ---------------- | ----------------------------------------------------- | ---------------------------------------- |
| **How it works** | Fixed rules and forms                                 | Predicts likely next words / patterns    |
| **Same input**   | Same output every time                                | Similar but not identical                |
| **Best for**     | Calculations, records, workflows that must not invent | Drafting, summarizing, exploring options |
| **Risk**         | Wrong rule → wrong result (usually consistent)        | Confident wrong answer (“hallucination”) |
| **Your job**     | Configure and operate                                 | Brief, constrain, and review             |


> **Callout**
> Use traditional software (HRIS, ERP, CRM) for **truth that must not drift**. Use generative AI for **language, structure, and first drafts**. AI should never “invent” a leave balance or invoice total.

**When would you use which?** (circle one per row)


| Task                                             | System of record | Generative AI | Both + human |
| ------------------------------------------------ | ---------------- | ------------- | ------------ |
| Check leave balance or payroll total             | ○                | ○             | ○            |
| Write a polite follow-up email to a vendor       | ○                | ○             | ○            |
| Decide final hiring / budget / credit approval   | ○                | ○             | ○            |
| Summarize 20-page policy for new-joiner training | ○                | ○             | ○            |


## Chatbots vs AI Assistants vs AI Agents


| Type                    | Picture                                         | What it means                                           |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| **Chatbot / chat**      | Hallway question to whoever is free             | One-off Q&A; little standing brief                      |
| **AI Assistant**        | Hired desk assistant with a joining letter      | Project/Settings = standing role; you still drive       |
| **AI Agent / workflow** | Routed office process: intake → desk → approval | Steps, tools, and rules; human still approves high risk |


```
Chat          →  “Help me rewrite this email.”
Assistant     →  “You are my Work Assistant for weekly reporting. Always ask if numbers are missing.”
Agent path    →  Form arrives → AI drafts → Sheet updates → Manager approves before send
```

---

*Become a Manager of AI Agents · Participant Workbook · Sec 05*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 06** · Session 0 · Opening · Teacher Agent & Labels (0.1–0.4)

### Opening tasks (Session 0)

| 🖥️ **TASK 0.1** (~5 min) — Open your tools |
| -------------------------------------------------------------------------------- |
| **Do:** Open this **roadmap** · ChatGPT or Claude (ready for a Project). Optional: blank note for scratch. Copy boxes for later tasks live on the roadmap. |
| **Done when:** Roadmap + AI tool open. Mark roadmap **0.1** complete. |



| 📘 **TASK 0.2** (~10 min) — Create Teacher Agent |
| -------------------------------------------------------------------------------- |
| **Do:** Create Project `Workshop Teacher — Agentic AI` → open **Settings** (not chat) → paste the roadmap **Copy** box once → Save. |
| **Done when:** Settings saved. Mark roadmap **0.2** complete. |



| 🤝 **TASK 0.3** (~10 min) — Kickoff chat with Teacher |
| -------------------------------------------------------------------------------- |
| **Do:** In Teacher **Chat** (same thread all day), send the roadmap **Copy** box (role, org, painful process). Answer Teacher’s 3 questions in the **same** chat. |
| **Done when:** Teacher has your process right. Mark roadmap **0.3** complete. |


| 💬 **TASK 0.4** (~5 min) — Chat vs assistant vs agent |
| -------------------------------------------------------------------------------- |
| **Do:** In the **same Teacher chat**, send the roadmap **Copy** box. Write one sentence you will remember in the checkpoint below. |
| **Done when:** One remember-sentence written. Mark roadmap **0.4** complete. |


**Checkpoint — Write one sentence you will remember**

> ---

**Teacher vs Work Assistant (don’t mix them up)**

| | Teacher Agent | Work Assistant |
|--|---------------|----------------|
| Job | Coach / critique / explain | Do *your* real work |
| When | Same **one chat thread** all day | Session 1 runs + later as your worker |
| Switch | — | **Once** at Task **1.3** (feedback round), not every task |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 06*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 07** · Session 0 · Opening · Prompt Engineering (CTAO)

## Prompt Engineering (clear instructions)

**In plain words:** A prompt is a work brief. Better briefs → better first drafts. You still review.

**Simple prompt recipe (CTAO)**


| Letter | Meaning                | Example                                                     |
| ------ | ---------------------- | ----------------------------------------------------------- |
| **C**  | Context                | “I am an Operations Lead at a corporate office in Dhaka.”   |
| **T**  | Task                   | “Draft a follow-up email after yesterday’s vendor meeting.” |
| **A**  | Audience / constraints | “Polite, under 120 words, no new commercial promises.”      |
| **O**  | Output format          | “3 options. Label A/B/C.”                                   |


**Weak vs stronger**


| Weak                      | Stronger (CTAO)                                                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “Make this email better.” | “Context: Ops lead, Dhaka office. Task: rewrite this vendor follow-up. Audience: polite, under 100 words, no new price promises. Output: 2 options A/B + 3 risks I should check.” |


**Exercise — Rewrite your weak prompt**

My weak prompt:

---

My stronger prompt (use CTAO):

---

---

---

**After AI replies — Stop → Read → Decide**


| Check                          | Yes / No |
| ------------------------------ | -------- |
| Facts match what I know?       | ☐ / ☐    |
| Tone safe for customer / boss? | ☐ / ☐    |
| Anything invented?             | ☐ / ☐    |
| Ready to send as-is?           | ☐ / ☐    |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 07*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 08** · Section 1 · WITH · Hallucination & Human-in-the-loop

## Hallucination

**In plain words:** AI invents details that sound right but are not true — fake citations, wrong numbers, made-up clause numbers, imaginary employee or customer facts. A confident junior filling gaps so the board pack “looks complete.”

**High-risk zones**

- Headcount, salary, bonus, or budget figures
- Legal, HR, or compliance wording (“policy says…”) without a source
- Customer or employee PII · marketing and competitor claims
- Promises to clients, vendors, or candidates · rates, fees, EMI, regulatory language

**Detection habits:** ask for a source or “say unknown” · spot-check numbers against the system of record · prefer “draft + checklist” over “final answer.”

## Human-in-the-loop

**In plain words:** A human must approve steps that affect customers, money, legal/compliance, people decisions, or public reputation.

**Green / Blue / Red (kitchen tags) — same meanings all day**


| Tag          | Meaning               | Examples                                                                        |
| ------------ | --------------------- | ------------------------------------------------------------------------------- |
| 🟢 **Green** | AI thinking OK        | Draft, summarize, rewrite, brainstorm                                           |
| 🔵 **Blue**  | Rules / automation OK | Forms, reminders, moving data, triggers                                         |
| 🔴 **Red**   | Human only            | Hiring, legal, conflict, budget/credit decision, send externally without review |


**Always human before…**

- [ ] External email / SMS / WhatsApp to customer, vendor, or candidate
- [ ] Changing official records (HRIS, ERP, CRM)
- [ ] Publishing marketing / social posts · HR letters with pay or exit language
- [ ] Hiring, budget, legal, credit, or compliance decisions

**My personal red lines**

*e.g. (1) Any email leaving the company (2) Numbers in a manager pack (3) HR letters with pay language*

1. ___________________________________________________________________________
2. ___________________________________________________________________________
3. ___________________________________________________________________________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 08*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 09** · Section 1 · WITH · Worksheet A — Work Assistant Brief

# SECTION 1 — Work WITH AI

*Goal: Use AI as a daily helper — clear instructions, the right tool, and human judgment.*
**Task order:** **1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6** (lock the job before tools).

## Worksheet A — Work Assistant Brief


| 📝 **TASK 1.1** (~5 min) — Fill your Work Assistant brief |
| -------------------------------------------------------------------------------- |
| **Do:** Complete the brief below first (paper — **no AI yet**). Keep it short enough that a stranger could follow it. |
| **Done when:** Brief filled. Mark roadmap **1.1** complete. |



| 🧑‍💼 **TASK 1.2** (~20 min) — Create Work Assistant + three real runs |
| -------------------------------------------------------------------------------- |
| **Do:** New Project `My Work Assistant — [Your Name]` → paste your brief into **Settings** (add “Never invent meetings, names, or deadlines” if missing) → run the **three** prompts from the roadmap **Copy** boxes in that chat. Read each answer before the next. |
| **Done when:** Three runs done. Mark roadmap **1.2** complete. |



| 🔁 **TASK 1.3** (~15 min) — One feedback round (Teacher ↔ Work Assistant once) |
| -------------------------------------------------------------------------------- |
| **Do:** In Teacher chat, send the roadmap **Copy** box (brief + weak prompt + one reply). Keep fixes you agree with → update Work Assistant **Settings** once → re-run **one** task. |
| **Done when:** Settings updated + one re-run compared. Mark roadmap **1.3** complete. |


*Italic starters are examples — cross them out and write yours.*


| Field                     | Your answer                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role title**            | Executive Assistant for *e.g. Operations Lead — weekly reporting & vendor follow-ups* ________________________________                      |
| **Top 3 priorities**      | 1. *e.g. Turn rough notes into clear updates* 2. *e.g. Draft polite follow-ups* 3. *e.g. Flag missing numbers* ____________________________ |
| **Tone**                  | ☐ Formal ☐ Friendly-professional ☐ Concise bullets ☐ Bangla-first ☐ English-first                                                           |
| **Always ask me before…** | *e.g. Sending externally · inventing a deadline · using any figure I did not provide* ________________________________                      |
| **Never invent…**         | *e.g. Metrics, headcount, prices, policy clauses, people’s names not in my notes* ________________________________                          |
| **Output style**          | *e.g. Short bullets first, then optional full draft; end with “Human must check:”* ________________________________                         |
| **Success looks like**    | *e.g. I can paste 5 messy bullets and get a usable draft in under 2 minutes* ________________________________                               |


**Three real tasks I will run today** — *rewrite one real email · clean one meeting note into actions · draft one weekly update*


| #   | Task | Done? |
| --- | ---- | ----- |
| 1   |      | ☐     |
| 2   |      | ☐     |
| 3   |      | ☐     |


**What I changed in Settings after Teacher critique:** *e.g. Added “never invent numbers”* ______________________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 09*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 10** · Section 1 · WITH · Worksheet B — Lock Process

## Worksheet B — Lock today’s process


| 🔒 **TASK 1.4** (~10 min) — Lock today’s process |
| -------------------------------------------------------------------------------- |
| **Do:** List 2–3 candidate processes. Plot each on **Impact vs Effort** (below). Pick the winner. Write name · pain · done today · what stays human. Then send the roadmap **Copy** box in Teacher chat. If Teacher says too big, take the smaller slice. Do **not** pick tools yet. |
| **Done when:** Process locked for the rest of the day. Mark roadmap **1.4** complete. |
| **Next:** tools (**1.5**) → memory (**1.6**) for *this* job. **Session 2** turns **this same locked process** into a path that can run. |


*One recurring job for the rest of the day — not the whole company. Start with low-hanging fruit: high impact, lower effort.*

**Pick your process — Impact vs Effort**

| | **Low effort** (data ready, tools OK, few approvals) | **High effort** (messy data, IT blocks, many sign-offs) |
| --- | --- | --- |
| **High impact** (saves hours / many rows) | *Best start — put candidate #1 here* | *Phase 2 — after you ship one win* |
| **Low impact** (nice-to-have) | *Maybe later* | *Skip for now* |

**My candidates:** 1. <span style="display:inline-block;width:150px;border-bottom:1px solid #666"></span> 2. <span style="display:inline-block;width:150px;border-bottom:1px solid #666"></span> 3. <span style="display:inline-block;width:150px;border-bottom:1px solid #666"></span>
**Winner for today:** <span style="display:inline-block;width:300px;border-bottom:1px solid #666"></span>


|                                           | Starter (steal & adapt)                                                         | Write yours                       |
| ----------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------- |
| Process name                              | Weekly team update from Friday bullets                                          |                                   |
| Who starts it?                            | Me — I paste bullets / fill a Sheet row                                         |                                   |
| Who receives the output?                  | My manager (email draft)                                                        |                                   |
| How often?                                | Weekly                                                                          | Daily / Weekly / Monthly / Ad hoc |
| Pain today                                | Last-minute scramble; numbers sometimes wrong                                   |                                   |
| Smallest useful slice for *this* workshop | Bullets → draft update → I approve before send *(not “automate all reporting”)* |                                   |


**Green / Blue / Red first sketch** (optional — refine in Session 2; tag key on **Sec 08**)


| Step (rough)                                      | 🟢 / 🔵 / 🔴 |
| ------------------------------------------------- | ------------ |
| *Collect bullet points or requirements from team* | *🔵 or you*  |
| *AI drafts the update*                            | *🟢*         |
| *I check numbers & send*                          | *🔴*         |
|                                                   |              |
|                                                   |              |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 10*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 11** · Section 1 · WITH · Choosing Tools (≤3)

## Choosing the right AI tool


| 🧰 **TASK 1.5** (~30 min) — Tool landscape + fit (max 2–3) for the locked process |
| -------------------------------------------------------------------------------- |
| **Do:** Watch the short tool tour. With your locked process from **1.4**, send the roadmap **Copy** box to Teacher. Run **one** identical test only in the recommended tools (max 3). Write today’s stack below. |
| **Done when:** Stack written (max 3). Mark roadmap **1.5** complete. |


**Rule of the day:** Lock **one job** first. Then pick **≤3 tools** for that job. Do not open every shop in the market.

> **Tools change fast.** Brand names here are **examples for today**. Learn the **core job** each tool does, then pick whatever your company allows.

**Five lanes (A–E) — jobs, not brands**


| Lane | Core job | What it does for you | Example tools (illustrative) |
| ---- | -------- | -------------------- | ---------------------------- |
| **A** | Think & draft | Writes, rewrites, critiques, plans | ChatGPT, Claude |
| **B** | Research web | Finds current public info + links | Perplexity, Gemini |
| **C** | Your files | Answers from *your* PDFs / SOPs | NotebookLM, Projects with uploads |
| **D** | See / hear / show | Images, voice, slides, screenshots | Gemini, Gamma, ChatGPT images |
| **E** | Connect & run | Trigger → AI → Doc/Sheet/email draft | Zapier / Make / n8n (+ Forms/Sheets) |


**Fit questions:** (1) Do I need one finished draft — or many steps? (2) Must the answer come from **company files**? (3) Will a human approve each sensitive step?

**My stack for today’s locked process (max 3)**

*Starter stack many people use:* ChatGPT or Claude (Work Assistant) · NotebookLM or Project files (SOPs) · Google Form/Sheet (trigger).


| #   | Tool                       | Why this job needs it                      |
| --- | -------------------------- | ------------------------------------------ |
| 1   | *e.g. Claude / ChatGPT*    | *Standing Work Assistant + drafts*         |
| 2   | *e.g. NotebookLM*          | *Answers from our handbook PDF*            |
| 3   | *e.g. Google Form → Sheet* | *Trigger / inputs*                         |


> **Callout — Privacy**
> Do not paste employee/customer NID, salaries, passwords, medical details, or confidential contracts into public tools unless your organization has approved that use.

**Exercise — Match the *job type* (A–E), then name a tool**


| Job                                                   | Core job (A–E) | Tool you would try |
| ----------------------------------------------------- | -------------- | ------------------ |
| Summarize our leave policy PDF with page refs         | ______________ | ________________   |
| Rewrite angry customer/vendor email, polite Bangla    | ______________ | ________________   |
| Find recent public news on our industry / competitors | ______________ | ________________   |
| Standing weekly Work Assistant for your team update   | ______________ | ________________   |
| Turn bullets into a first-pass slide outline          | ______________ | ________________   |
| Form submit → draft lands in a Doc for my review      | ______________ | ________________   |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 11*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 12** · Section 1 · WITH · Context, Memory & Reflection

## Context

**In plain words:** Context is everything AI needs *in this conversation* — role, product, audience, constraints, and the actual content (notes, policy excerpt, table). Like briefing a new hire *before* they write a customer letter.

**Did I give enough context?** ☐ Who I am / my role · ☐ Who the audience is · ☐ The raw material · ☐ What “good” looks like · ☐ What is forbidden

## Memory


| 📁 **TASK 1.6** (~10 min) — Memory — docs + grounded questions for the locked process |
| ------------------------------------------------------------------------------------ |
| **Do:** Upload 1–2 allowed work docs for your locked process (NotebookLM or Project files). Ask two questions the docs can answer. Ask one trap question that is **not** in the docs — did it refuse or invent? |
| **Done when:** You verified one citation and saw the trap fail safely. Mark roadmap **1.6** complete. |


**In plain words:** Memory is what sticks beyond one message — Project instructions, uploaded files, past chat in the same thread, saved preferences.


| Kind of memory              | Workplace picture                | Example                                   |
| --------------------------- | -------------------------------- | ----------------------------------------- |
| **Instructions / Settings** | Joining letter / handbook        | “Never invent numbers or policy clauses.” |
| **Files**                   | Company file on the desk         | Policy PDF, product FAQ, SOP              |
| **Chat history**            | Ongoing conversation at the desk | “Use my process from earlier.”            |
| **Your brain**              | Manager judgment                 | You still know what is true today         |


> **Callout — Grounding**
> Give the junior the **company file**, not corridor rumors. If the file is missing, good AI should say “I don’t know” — not invent policy.

**Exercise — What should my Work Assistant always remember?**


| Always know                                                     | Never invent                                                |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| *e.g. My role, Bangla/English preference, weekly update format* | *e.g. Headcount, salary, revenue, deadlines I did not give* |
|                                                                 |                                                             |
|                                                                 |                                                             |


## Section 1 — Reflection

1. What changed in how I brief AI after this morning?
  ---
2. Which habit will I keep: better prompts, memory/files, or human-in-the-loop?
  ---

---

*Become a Manager of AI Agents · Participant Workbook · Sec 12*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 13** · Section 2 · THROUGH · Workflows — the destination picture

# SECTION 2 — Work THROUGH AI

*Goal: Turn one messy process into a reusable path — map, rules, pattern, and a run that works once.*

> **Bridge from Session 1**
> In **Task 1.4** you locked **one** recurring job. Session 1 = AI helped *you*. Session 2 = that **same job** becomes a **path that can run** (not a blank chat every time).

**My locked process from Task 1.4:**

---

### Session 2 spine (why this order — follow top → bottom)

```
① Picture the destination     Anatomy: Trigger → AI → Output → Human approval
② How tall is the build?      Pattern ladder (Task 2.0)
③ What happens on the floor?  Map steps + 🟢 AI thinking / 🔵 rules / 🔴 human (Task 2.1)
④ Learn ETCSLV → write it     Framework page → Worksheet D (Tasks 2.2–2.3)
⑤ Pick the room               Decision tree → lock one pattern (Task 2.4)
⑥ Hire the standing brief     Workflow brain in Settings (Task 2.5)
⑦ Open for business           Make it run once — Track A or Track B (Task 2.6)
```

**What is an AI workflow?** A **repeatable path**: something starts the work → AI (and maybe other systems) do clear steps → a result appears where your team already works → a human still owns risk. Reception → desk → manager approval. AI can sit at some desks; it should not steal the manager’s approval.

**Anatomy of a running workflow (remember this picture)**

```
TRIGGER          AI / SYSTEMS           OUTPUT              HUMAN
(form, email,    (draft, extract,       (Doc, Sheet,        (approve /
 sheet row,       classify, route)       draft email,        edit / reject)
 checklist)                              Slack)
```

**Tools in Session 2:** Teacher chat for **2.1, 2.3, 2.4, 2.5** only · chatbot Project (or NotebookLM if file-heavy) for 2.5 · **Track A** n8n/Make/Zapier clone **or Track B** semi-auto for 2.6. Tasks **2.0** and **2.2** are paper/discussion — no forced chat.

> You will **not** automate yet. First choose height (ladder), map steps, write rules, lock a pattern, write the brain. Automation comes at **Task 2.6**.

---

*Become a Manager of AI Agents · Participant Workbook · Sec 13*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 14** · Section 2 · THROUGH · Pattern Ladder, Readiness & Projects

## Pattern ladder (how much structure?) — Step ②


| 🪜 **TASK 2.0** (~5 min) — Pattern ladder + readiness |
| -------------------------------------------------------------------------------- |
| **Because:** You locked one job — now ask how much structure *that* job needs (don’t jump to n8n yet). |
| **Do:** Rate yourself 1–5 on the readiness table below. Listen to the instructor on the ladder. Circle your rung. Discuss with a neighbour if unsure. **No Teacher chat required.** |
| **Done when:** Rung noted below. Mark roadmap **2.0** complete. |


**Readiness self-score (1 = weak · 5 = strong)**

| Dimension | 1 | 2 | 3 | 4 | 5 | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| **Data readiness** (clean inputs exist?) | ☐ | ☐ | ☐ | ☐ | ☐ | |
| **Tool / IT access** (apps you need?) | ☐ | ☐ | ☐ | ☐ | ☐ | |
| **Risk appetite** (OK with AI draft before you send?) | ☐ | ☐ | ☐ | ☐ | ☐ | |
| **Change capacity** (team can adopt in ~30 days?) | ☐ | ☐ | ☐ | ☐ | ☐ | |

Climb only as high as *this* route needs:

```
1 Instruction-only chat
2 Knowledge assistant (your files)
3 Single workflow agent (clear steps + you approve)
4 Multi-agent / role handoff
5 Automation pipeline (trigger → run)
```

**Bicycle → scooter → van → small fleet → factory.** Do not buy a factory for a bicycle trip.

**My ladder rung for today:** *e.g. Level 3 — single workflow agent* ______________________________________

## Knowledge assistants, Projects & the workflow brain

**Knowledge assistant / RAG:** before answering, the system **finds relevant passages from your files**, then writes an answer grounded in those passages (ideally with citations). Instead of guessing leave rules from memory, the junior **opens the HR binder**, then drafts. *Still your job:* verify citations; update files when policy changes.


| Idea                   | Meaning                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Reusable assistant** | Same role and rules every time (Settings / instructions)                   |
| **AI Project**         | A container: instructions + files + ongoing chats for one job family       |
| **Workflow brain**     | Standing brief for **one locked process** (not the whole company handbook) |


**Identity rule for today:** Extend your Work Assistant **or** create **one** worker Project for the locked job — not five mystery bots.

---

*Become a Manager of AI Agents · Participant Workbook · Sec 14*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 15** · Section 2 · THROUGH · Worksheet C — Workflow Canvas

## Worksheet C — Map your process — Step ③


| 🗺️ **TASK 2.1** (~10 min) — Map your process |
| -------------------------------------------------------------------------------- |
| **Because:** You chose a height on the ladder — now write the floor plan (steps) and tag who does what. |
| **Do:** In Teacher chat, send the roadmap **Copy** box with your steps (max 8). Accept or correct 🟢/🔵/🔴 tags. Copy the map onto this canvas. |
| **Done when:** Map exists in Teacher chat + on this page. Mark roadmap **2.1** complete. |


*Map the process. Messy is fine. Rows 1–4 show a starter path — replace with yours.*

**Process name:** *e.g. Weekly team update* _________________________________________________


| #   | Step                                         | Who / what does it                | 🟢 Green · 🔵 Blue · 🔴 Red |
| --- | -------------------------------------------- | --------------------------------- | --------------------------- |
| 1   | *Trigger: Friday Sheet row / pasted bullets* | *Form / Sheet / me*               | *🔵*                        |
| 2   | *AI drafts update from bullets*              | *Work Assistant / workflow brain* | *🟢*                        |
| 3   | *Draft lands in Google Doc / email draft*    | *Doc / Gmail*                     | *🔵*                        |
| 4   | *Manager checks numbers & tone, then sends*  | *You*                             | *🔴*                        |
| 5   |                                              |                                   |                             |
| 6   |                                              |                                   |                             |
| 7   |                                              |                                   |                             |
| 8   |                                              |                                   |                             |


*Key: 🟢 **Green** = AI thinking · 🔵 **Blue** = rules / automation · 🔴 **Red** = human only*

**Draw the flow** (boxes and arrows)

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Trigger  │  →   │          │  →   │          │  →   │ Human    │
│          │      │          │      │          │      │ approval │
└──────────┘      └──────────┘      └──────────┘      └──────────┘

(Redraw freely)

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________
```

**Still requires a human:** *e.g. Final send + any number that affects decisions* _______________________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 15*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 16** · Section 2 · THROUGH · ETCSLV Framework

## ETCSLV — Onboarding a new employee (and an AI helper on a desk process)

> Use this page **after Worksheet C** (map) and **before Worksheet D** (ETCSLV draft).

**Say the picture first:** before you open a new role, you decide how hard the work is, which systems they touch, what they must always know, what files stay, what they may never do alone, and how you check quality.


| Letter | Name       | Core question                      | New-employee analogy                               |
| ------ | ---------- | ---------------------------------- | -------------------------------------------------- |
| **E**  | Execution  | Multiple reasoning steps or loops? | Is this a multi-step desk job or a one-line reply? |
| **T**  | Tools      | Which systems must they touch?     | Email, Docs, Sheet, CRM, Forms…                    |
| **C**  | Context    | What must they always know?        | Team goals, tone, forbidden claims                 |
| **S**  | State      | What must persist beyond one chat? | Last week’s file, client prefs, ticket ID          |
| **L**  | Limits     | What may they never do alone?      | No send, no salary figures, no legal promises      |
| **V**  | Validation | How do we know it’s correct?       | Checklist, sample check, manager sign-off          |


**Filled example — Weekly team / stakeholder update (common corporate)**


|       | Example answer                                                     |
| ----- | ------------------------------------------------------------------ |
| **E** | Yes — gather bullets, rewrite, adjust tone                         |
| **T** | Email + Doc; optional input Sheet                                  |
| **C** | Audience (boss / client), priorities, forbidden claims, brand tone |
| **S** | Last week’s update file; known preferences                         |
| **L** | No send without manager approval; no invented metrics or headcount |
| **V** | Facts cited / source noted; tone OK; human signed off              |


> **Callout**
> **Harness = the same ETCSLV checklist**, named for shipping. You will reuse it in Session 3 (Worksheet E).

---

*Become a Manager of AI Agents · Participant Workbook · Sec 16*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 17** · Section 2 · THROUGH · Worksheet D — ETCSLV Draft

## Worksheet D — ETCSLV draft — Step ④

> Fill this **after** the ETCSLV Framework page (**Sec 16**).


| ✍️ **TASK 2.2** (~5 min) — First ETCSLV draft |
| -------------------------------------------------------------------------------- |
| **Because:** The map shows steps — now write the desk rules (especially **L**imits and **V**alidation). |
| **Do:** Fill E–T–C–S–L–V below in your own words. **Paper only — no Teacher chat.** Critique is Task 2.3. |
| **Done when:** Draft written on this page. Mark roadmap **2.2** complete. |



| 🔍 **TASK 2.3** (~10 min) — Teacher critiques ETCSLV |
| -------------------------------------------------------------------------------- |
| **Because:** First drafts of L/V are usually soft (“be careful”) — tighten until Monday-testable. |
| **Do:** Paste your E–V from this page into Teacher chat. Send the roadmap **Copy** box. Reply with updated **L** and **V** only. |
| **Done when:** Updated L + V are specific/testable. Mark roadmap **2.3** complete. |


*Starters below match a “weekly update” job — rewrite for your process. Be specific on L and V.*


| Letter           | My answer for today’s process                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| **E** Execution  | *e.g. Yes — gather bullets, rewrite, adjust tone*                                                      |
| **T** Tools      | *e.g. Sheet (inputs) + Doc/email draft*                                                                |
| **C** Context    | *e.g. Audience = my manager; no invented metrics; friendly-professional*                               |
| **S** State      | *e.g. Last week’s update file; recurring section headings* *(State = what must still exist next week)* |
| **L** Limits     | *e.g. Never send; never invent headcount/revenue; ask if bullets missing* *(not just “be careful”)*    |
| **V** Validation | *e.g. Checklist: every number has a Sheet source · I sign off before send*                             |


**After Teacher critique — updated L & V (must be specific)**

| **L** (revised) | |
| **V** (revised) | |

Hardest letter for me: *often S, L, or V* <span style="display:inline-block;width:60px;border-bottom:1px solid #666"></span> because <span style="display:inline-block;width:330px;border-bottom:1px solid #666"></span>

---

*Become a Manager of AI Agents · Participant Workbook · Sec 17*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 18** · Section 2 · THROUGH · Decision Tree & Type Cards

## Decision Tree — Find the simplest help — Step ⑤


| 🌳 **TASK 2.4** (~15 min) — Decision tree + lock pattern |
| -------------------------------------------------------------------------------- |
| **Because:** Map + rules exist — triage picks **one** pattern room (don’t collect options). |
| **Do:** Complete the Decision Tree on the **roadmap** (link on the task). Note the result. Send the roadmap **Copy** box to Teacher. Lock **one** pattern — do not collect options. |
| **Done when:** Pattern locked. Mark roadmap **2.4** complete. |


*Clinic triage: a few questions → the right room, not the whole hospital.*

1. **When this job is finished, what do you have?**
  - ☐ One message, doc, image, or answer → go to Q2
  - ☐ Several steps until a sheet / inbox / status updates → go to Q3
2. **Does AI need company files?**
  - ☐ No — I can paste in chat → **Type 1 · Quick helper**
  - ☐ Yes — PDFs / sheets / scans → **Type 2 · Company brain**
3. **How should multi-step work run?**
  - ☐ I approve each step → **Type 3 · Work buddy**
  - ☐ Many similar items overnight → **Type 6 · Batch**
  - ☐ Two different roles hand off → **Type 5 · Handoff**

**My result**


|                          |                                                              |
| ------------------------ | ------------------------------------------------------------ |
| Type # and name          | *e.g. Type 3 · Work buddy*                                   |
| I will build today       | *e.g. Sheet bullets → AI draft Doc → I approve before email* |
| Simpler than I expected? | ☐ Yes ☐ No                                                   |


## Type cards (short)


| Type                  | One-line meaning                            | Monday 15-min action                            |
| --------------------- | ------------------------------------------- | ----------------------------------------------- |
| **1 Quick helper**    | One good output; you check; send/save       | Paste draft + 3 rules; one improved version     |
| **2 Company brain**   | Answers from your files + citations         | Upload 3–5 PDFs; ask; verify one citation       |
| **3 Work buddy**      | Multi-step; you approve each sensitive step | Gather → AI draft → you approve → paste/send    |
| **4 Coding helper**   | Ship/fix with tests as “done”               | AI for PR text; code still through tests        |
| **5 Handoff**         | Two specialist roles; structured packet     | Role A sources → Role B writes from packet only |
| **6 Batch**           | Many similar items; morning sample-check    | Trigger on new rows; review sample column       |
| **7 Quality checker** | Score vs checklist; human decides           | Pin rubric; never auto-pass unsure cases        |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 18*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 19** · Section 2 · THROUGH · Workflow Brain, Make it Run & Reflection


| 🧬 **TASK 2.5** (~30 min) — Build the workflow brain — Step ⑥ |
| -------------------------------------------------------------------------------- |
| **Because:** Pattern is locked — write the **standing brief** for the AI step (Settings once). Still chatbot/NotebookLM here — not n8n yet. |
| **Do:** Send the roadmap **Copy** box to Teacher → paste **only** the system instructions into Settings for this job **once** (extend Work Assistant or one new Project; NotebookLM OK if file-heavy). Test a good example and a messy example. |
| **Done when:** Brain tested. Mark roadmap **2.5** complete. |


## Make it run — Track A or Track B — Step ⑦

**In plain words:** Automation means the path can **start without you remembering**. Day one stays humble: one trigger, one AI step, one output, one approval.

| | **Track A — preferred** | **Track B — if automation is blocked** |
| -- | ----------------------- | -------------------------------------- |
| **What** | Clone facilitator’s **n8n / Make / Zapier** template | Semi-auto: checklist or form → **AI draft in chat** → **you** paste/send after review |
| **When** | Wi-Fi + tool access OK | Corporate laptop blocks automation, or IT forbids |
| **Still must** | Live-run once on screen | Live-run once on screen (show the draft + where you’d send it) |
| **Not enough** | Architecture diagram only | Notes-only with no live AI output |


| ⚡ **TASK 2.6** (~30 min) — Automation path that runs |
| -------------------------------------------------------------------------------- |
| **Because:** Brain is tested — open the path once (automation **or** Track B semi-auto). |
| **Do:** **Track A:** clone facilitator template → wire your workflow-brain instructions into the AI step → live-run once. **Track B (if blocked):** trigger checklist/form → AI produces the artifact in chat → you show paste/send after approval. **Optional if time:** send the roadmap **Copy** box to Teacher for a short review. |
| **Done when:** You can re-trigger (or re-run the Track B path) without the instructor. Mark roadmap **2.6** complete. |
| **My track today:** ☐ A (n8n/Make/Zapier) · ☐ B (semi-auto chatbot) |


## Quick share — Workflow spotlight (5–10 min)

A volunteer (or someone picked at random) explains in ~60 seconds: (1) the locked process, (2) where the **human approval** (🔴) sits, (3) what AI must **never invent**. Listeners: note one idea to steal for your own L or V.

**Idea I heard that I might use:** ______________________________________________

## Section 2 — Reflection

1. Did the decision tree push me simpler or more complex?
  ---
2. Can I demo trigger → AI → output once? ☐ Yes ☐ Not yet — blocker: ____________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 19*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 20** · Section 3 · BY · From Helper to AI Workforce

# SECTION 3 — Work BY AI

*Goal: Manage AI like a small team — roles, harness, failure drill, then ship.*


| 👔 **TASK 3.0** (~5 min) — Manager of agents (framing) |
| -------------------------------------------------------------------------------- |
| **Do:** Follow the instructor. Write one line below: what “manager of agents” means for your process. **No Teacher chat required.** |
| **Done when:** Framing heard + one line written. Mark roadmap **3.0** complete. |


**One line for me:** *You manage roles + rules + evaluation; AI does the drafting.*
_______________________________________________________________________________

**Tools in Session 3:** Teacher chat for **3.1** and **3.4** (required) · **3.2** and **3.6** optional polish · **3.3** only if stuck · **3.5** live demo (no chat).

## From helper to workforce

**Manager truth:** You do not personally write every email, check every cell, and design every slide. You **coordinate specialists**, set standards, and own exceptions. Managing AI is the same:

```
Model  +  Memory  +  Tools  +  Workflow  +  Evaluation
  │         │         │          │             │
 which      what it   systems    the path      how you
 brain      must know  it may    it follows    know it’s
 you use    / remember touch                   good enough
```

## AI workers & AI teams

**Specialist roles (use only what you need)**


| Role              | Job                                        | Human parallel             |
| ----------------- | ------------------------------------------ | -------------------------- |
| **Planner**       | Break work into steps / outline            | Team lead planning the day |
| **Researcher**    | Gather facts from allowed sources          | Analyst pulling data       |
| **Writer**        | Draft the customer- or manager-facing text | Communications             |
| **Reviewer**      | Check tone, policy, completeness           | Peer review                |
| **Evaluator**     | Score against a rubric / checklist         | QA / compliance checker    |
| **Human manager** | Approves, rejects, escalates               | You                        |


**Corporate sketch — New joiner onboarding pack:** Researcher pulls the day-1 checklist from the approved HR handbook → Writer drafts welcome email + checklist → Reviewer flags any salary/benefit language that was not provided → **HR (you) sends or edits**.

> **Callout**
> Minimum roster. Extra agents create coordination cost. Prefer **one running path** over a 16-agent swarm.

---

*Become a Manager of AI Agents · Participant Workbook · Sec 20*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 21** · Section 3 · BY · Worksheet F — AI Workforce Canvas

## Worksheet F — AI Workforce Canvas


| 👥 **TASK 3.1** (~15 min) — Design your AI workforce |
| -------------------------------------------------------------------------------- |
| **Do:** In Teacher chat, send the roadmap **Copy** box (3–5 roles max). Let Teacher cut extras. Delete any role you cannot explain in one sentence. Fill this canvas. |
| **Done when:** Minimum role list named. Mark roadmap **3.1** complete. |


*Minimum roster. Starters assume weekly update — cut roles you don’t need.*


| Field                                           | Your design                                                          |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| Locked process                                  | *e.g. Weekly team update*                                            |
| Human manager                                   | *e.g. Me*                                                            |
| Roles I will use (circle)                       | Planner · Researcher · Writer · Reviewer · Evaluator · Other: ______ |
| Handoff packet (what passes between roles)      | *e.g. Bullets + sources → draft text only (no new facts)*            |
| Tools per role                                  | *e.g. Writer: Claude · Evaluator: checklist in Sheet*                |
| Limits (shared)                                 | *e.g. No external send; no invented numbers*                         |
| Validation (shared)                             | *e.g. Every figure has a source row · human approves*                |
| Cost note ($ cheap draft vs $$$ careful review) | *e.g. $ draft · $$$ only for board-facing rewrite*                   |


**Swimlane sketch**

```
Planner     : *e.g. Outline: wins / risks / asks* _______________________________

Researcher  : *(optional)* *Pull last week’s file / Sheet totals* _______________

Writer      : *Draft narrative from packet only* _______________________________

Reviewer    : *Flag tone + any claim without source* ___________________________

Human       : *Approve / edit / send* __________________________________________
```

---

*Become a Manager of AI Agents · Participant Workbook · Sec 21*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 22** · Section 3 · BY · Worksheet E — Harness Card

## Worksheet E — Harness Card (shipping name for ETCSLV)


| 🛡️ **TASK 3.2** (~15 min) — Harness Card (shipping name for ETCSLV) |
| -------------------------------------------------------------------------------- |
| **Do:** Fill Worksheet E below — all fields, especially **L** and **V**. Harness = same ETCSLV, shipping name. **Optional if time:** paste L + V into Teacher and send the roadmap **Copy** box for critique. |
| **Done when:** L and V are clear enough to demo. Mark roadmap **3.2** complete. |


*Same letters. Now written as job rules for the process that must run.*
*Middle column = example to steal. Right column = blank lines for your answers.*


| Field | Example (starter) | Write yours |
| --- | --- | --- |
| Workflow name | *Friday Team Update Draft* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| Owner (human manager) | *Me (Ops Lead)* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **E** How hard / multi-step? | *Multi-step: collect → draft → tone pass* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **T** Tools (+ cheap vs expensive) | *$ Sheet+Doc draft · $$$ only if legal review* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **C** Always-on context | *Audience, forbidden claims, section template* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **S** What must persist | *Last update file + standing Settings* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **L** Hard limits / approvals | *No send; no invented metrics; escalate missing bullets* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| **V** How we validate | *Number-source checklist + human sign-off* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| Failure test I will try | *Submit empty bullets / ask it to invent a %* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |
| Pass / fail rule | *Pass only if it asks for missing input and refuses invented %* | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:185px"></div> |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 22*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 23** · Section 3 · BY · Failure Lab

## Failure Lab


| 💥 **TASK 3.3** (~20 min) — Failure lab |
| -------------------------------------------------------------------------------- |
| **Do:** Trigger **two** failures on your running workflow. Fix instructions or the path. Use the roadmap **Copy** box only if stuck. |
| **Done when:** Two lines written: What broke → Fix applied. Mark roadmap **3.3** complete. |


**Analogy:** Mystery-shopper / fire drill on your own process — break it on purpose before Monday does.


| Attack                     | Example                                         | What I observed | Fix applied |
| -------------------------- | ----------------------------------------------- | --------------- | ----------- |
| Missing input              | Empty bullets                                   | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:150px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0;min-width:150px"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> |
| Messy / Bangla-English mix | *e.g. Half Bangla WhatsApp paste*               | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> |
| Forbidden ask              | “Promise a salary / discount we never approved” | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> |
| Overconfident draft        | Invented metric                                 | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> |
| *(your own attack)*        | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> | <div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div><div style="border-bottom:1px solid #666;height:1.45em;margin:0.25em 0"></div> |


**What broke (1):** <span style="display:inline-block;width:480px;border-bottom:1px solid #666"></span>

**Fix applied (1):** <span style="display:inline-block;width:475px;border-bottom:1px solid #666"></span>

**What broke (2):** <span style="display:inline-block;width:480px;border-bottom:1px solid #666"></span>

**Fix applied (2):** <span style="display:inline-block;width:475px;border-bottom:1px solid #666"></span>

**One fix I shipped after Failure Lab:** <span style="display:inline-block;width:370px;border-bottom:1px solid #666"></span>

---

*Become a Manager of AI Agents · Participant Workbook · Sec 23*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 24** · Section 3 · BY · Worksheet G — Capstone & Demo Day

## Worksheet G — Capstone (ship the running workflow)


| 🚀 **TASK 3.4** (~30 min) — Capstone: ship + demo script |
| -------------------------------------------------------------------------------- |
| **Do:** Re-run the happy path twice without the instructor. Confirm trigger · AI · real output place · human approval. Fill the capstone fields and use the roadmap **Copy** box for a 60-second demo script. |
| **Done when:** Definition-of-done checklist complete. Mark roadmap **3.4** complete. |



| 🎤 **TASK 3.5** (~20 min) — Demo Day + peer review |
| -------------------------------------------------------------------------------- |
| **Do:** Live-demo trigger → AI → output → human approval. Say: pain → run → who approves → one risk you fixed. Peer notes one strength + one improvement. |
| **Done when:** Demo shown + peer row filled. Mark roadmap **3.5** complete. |


**Definition of done:** ☐ Trigger is real ☐ AI step uses standing instructions ☐ Output lands where work lives ☐ Human approval step is visible ☐ I can re-run without the instructor ☐ L and V match what I built


| Capstone field         | Answer                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| Demo title (5 words)   | *e.g. Friday Update Auto-Draft*                                     |
| Trigger                | *e.g. New row in “Weekly Bullets” Sheet / pasted notes*             |
| AI does                | *e.g. Writes manager update from bullets using Settings rules*      |
| Output location        | *e.g. Google Doc body / Gmail draft*                                |
| Human must still…      | *e.g. Check every number and click Send*                            |
| Biggest risk remaining | *e.g. Someone pastes incomplete bullets and still trusts the draft* |


**Demo Day script (60–90 seconds)**

1. Problem: *e.g. Friday scramble from WhatsApp notes* ___________________________
2. Show trigger: *e.g. I add a Sheet row / paste bullets* _______________________
3. Show output: *e.g. Draft appears in Doc* ______________________________________
4. Show human gate: *e.g. I refuse to send until numbers checked* _______________
5. Monday next step: *e.g. Run it once with real team bullets* __________________

**Peer review received**


| Strength | Improvement |
| -------- | ----------- |
|          |             |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 24*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 25** · Section 3 · BY · Delegation, Adoption Plan & Reflection

## Checklist H — AI Delegation Checklist

Before you delegate a task to AI (assistant or workflow):

**Brief:** ☐ Role and outcome clear ☐ Audience and tone set ☐ Forbidden content listed ☐ Output format specified

**Safety:** ☐ No unnecessary PII in the prompt ☐ Red steps marked human-only ☐ Hallucination checks for numbers / policy

**Operate & ship:** ☐ Right tool for this job (≤3) ☐ Files attached if required ☐ Validation method named (V) ☐ You own exceptions ☐ Ran once successfully ☐ Failure case tested once

## Worksheet I — Personal AI Adoption Plan (seed for 30 days)


| 📅 **TASK 3.6** (~10 min) — 30-day AI adoption plan |
| -------------------------------------------------------------------------------- |
| **Do:** Fill this seed plan and complete the full calendar in **R7 (Sec 29)**. Circle the Week 1 action you will actually do. **Optional if time:** send the roadmap **Copy** box to Teacher for a polish pass. |
| **Done when:** Tomorrow + this week filled. Mark roadmap **3.6** complete. |



| Horizon                        | Commitment                                            |
| ------------------------------ | ----------------------------------------------------- |
| **Tomorrow**                   | *e.g. Use Work Assistant on 1 real email before lunch* |
| **This week**                  | *e.g. Attach 3 SOPs/files; run my workflow once*      |
| **Next 30 days**               | *e.g. Friday ritual: trigger → draft → approve*       |
| **I will stop doing…**         | *e.g. Pasting customer/employee PII into public chat* |
| **I will measure success by…** | *e.g. Time to first usable draft under 10 minutes*    |
| **Accountability buddy**       | *e.g. Desk neighbour / team lead*                     |


## Section 3 — Reflection

1. As a manager of AI, my most important skill is:
  ---
2. One process I will **not** automate yet:
  ---

---

*Become a Manager of AI Agents · Participant Workbook · Sec 25*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 26** · Reference · R1 Prompt Cheat Sheet · R3 Workflow Checklist

# END OF BOOKLET — Reference Cards

*Tear-out style pages. Keep using after the workshop.*

## R1 — Prompt Cheat Sheet

**CTAO**

```
Context: I am [role] at [org type] working on [topic].
Task: [verb] [object].
Audience / constraints: [tone, language, length, never invent X].
Output: [format, number of options, sections].
```

**Power add-ons**


| Need              | Add this line                                                                         |
| ----------------- | ------------------------------------------------------------------------------------- |
| Less invention    | “If unknown, say unknown. Do not invent numbers or policy.”                           |
| Better structure  | “Use headings + bullets. Max one page.”                                               |
| Bangla quality    | “Natural Bangla, not literal translation. Avoid awkward formalisms.”                  |
| Critique mode     | “List weaknesses first. Then rewrite once.”                                           |
| Use prior context | “Use my process from earlier in this chat. Don’t ask me to re-paste unless critical.” |
| Manager gate      | “End with: Risks / What a human must check.”                                          |


**Stop → Read → Decide** before you paste into email, CRM, or WhatsApp.

## R3 — AI Workflow Checklist

- [ ] One locked process named
- [ ] Trigger defined
- [ ] Steps mapped (🟢/🔵/🔴)
- [ ] ETCSLV drafted — L & V specific
- [ ] Pattern / Type chosen (simplest that works)
- [ ] Workflow brain in Settings (once)
- [ ] Happy path tested · Messy path tested
- [ ] Output location correct
- [ ] Human approval visible
- [ ] Owner named for exceptions

*Key: 🟢 **Green** = AI thinking · 🔵 **Blue** = rules / automation · 🔴 **Red** = human only*

---

*Become a Manager of AI Agents · Participant Workbook · Sec 26*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 27** · Reference · R2 Tool Matrix · R4 ETCSLV Summary · R5 Decision Tree

## R2 — AI Tool Selection Matrix


| If your job needs…           | Start with                      | Also consider           | Avoid for this job                      |
| ---------------------------- | ------------------------------- | ----------------------- | --------------------------------------- |
| Fast draft / rewrite         | ChatGPT or Claude               | Gemini                  | Over-tooling                            |
| Long policy reading          | Claude or ChatGPT (+ file)      | NotebookLM              | Blind trust without cite                |
| Answers from *your* SOP pack | NotebookLM / Project files      | Claude/ChatGPT Projects | Pure web chat with no upload            |
| Web research + links         | Perplexity                      | Gemini                  | Treating snippets as audited fact       |
| Slides / visuals             | Gemini / Gamma / ChatGPT images | —                       | Brand compliance without review         |
| Recurring trigger            | Zapier / Make / n8n + Doc/Sheet | —                       | Multi-agent complexity on day 1         |


**Max 2–3 tools for one workflow.**

## R4 — ETCSLV One-Page Summary


|                  | Question              | Onboarding analogy            |
| ---------------- | --------------------- | ----------------------------- |
| **E** Execution  | Multi-step reasoning? | How hard is the desk job?     |
| **T** Tools      | Which systems?        | Email, Sheet, CRM…            |
| **C** Context    | Always know what?     | Product + tone + taboos       |
| **S** State      | What persists?        | Last file, ticket ID, prefs   |
| **L** Limits     | Never alone?          | No send / no money / no legal |
| **V** Validation | Correct how?          | Checklist + human sign-off    |


**Harness** = ETCSLV with a shipping name for the live process.

## R5 — AI Decision Tree (pocket)

```
Finished output = ONE thing?
  ├─ Needs company files? ─ No  → Type 1 Quick helper
  │                        └ Yes → Type 2 Company brain
  └─ MANY steps?
        ├─ I approve each step     → Type 3 Work buddy
        ├─ Overnight many items    → Type 6 Batch
        └─ Two specialist roles    → Type 5 Handoff

Special cases: coding → Type 4 · rubric QA → Type 7
```

---

*Become a Manager of AI Agents · Participant Workbook · Sec 27*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 28** · Reference · R6 Ethics & Privacy · R9 Glossary

## R6 — AI Ethics & Privacy Checklist

**Before you paste**

- [ ] No full NID / passport / card / salary / medical details unless approved channel
- [ ] No passwords, OTPs, or system credentials
- [ ] No confidential contracts, credit files, or unreleased board packs in personal tool accounts
- [ ] Minimize personal data — mask where possible
- [ ] Respect employer AI / data policy

**Before you publish or send**

- [ ] No invented policy, legal, or regulatory claims
- [ ] Marketing / employer-brand claims checked
- [ ] Respectful language for staff, candidates, customers, vendors
- [ ] Human accountable name on external messages
- [ ] Sources retained for audit if needed

**If unsure:** ask compliance / IT / your manager — do not “just try it” with live employee or customer data.

## R9 — Glossary (one line each)


| Term                   | Meaning                                              |
| ---------------------- | ---------------------------------------------------- |
| Generative AI          | AI that creates new text/media from prompts          |
| Prompt                 | Your work brief to the AI                            |
| Hallucination          | Confident false detail                               |
| Human-in-the-loop      | Person must approve risky steps                      |
| Project / Settings     | Standing job brief + files                           |
| Knowledge assistant    | Answers from your documents                          |
| RAG                    | Find relevant file passages, then answer             |
| Workflow               | Trigger → steps → output                             |
| Automation             | Path starts without you remembering                  |
| ETCSLV                 | Execution, Tools, Context, State, Limits, Validation |
| Harness                | ETCSLV structure to manage agents                    |
| Agent (workshop sense) | AI following a routed process with rules             |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 28*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 29** · Reference · R7 — 30-Day Personal AI Adoption Plan

## R7 — 30-Day Personal AI Adoption Plan

**Theme for 30 days:** *e.g. “One Friday workflow I can re-run without thinking”* _______________________________


| Week       | Focus                  | Concrete actions                                                          | Done |
| ---------- | ---------------------- | ------------------------------------------------------------------------- | ---- |
| **Week 1** | WITH — daily helper    | Use Work Assistant on 3 real tasks; CTAO prompts; Stop→Read→Decide        | ☐    |
| **Week 2** | Memory & tools         | Attach 3 key files; cut tool stack to ≤3; one NotebookLM or Project brain | ☐    |
| **Week 3** | THROUGH — one workflow | Map steps; ETCSLV; run trigger→AI→output once per week                    | ☐    |
| **Week 4** | BY — manage            | Failure drill; peer review; decide keep / kill / improve                  | ☐    |


**Cadence**


| Ritual              | When              | Notes |
| ------------------- | ----------------- | ----- |
| 15-min AI practice  | ☐ Daily ☐ 3× week |       |
| Weekly workflow run | Day: ________     |       |
| Review L & V        | Every Friday      |       |
| Share one win       | With: ________    |       |


**Metrics (pick 2)**

- [ ] Hours saved on __________________
- [ ] Cycle time for __________________
- [ ] Error / rewrite rate down
- [ ] Team adoption (people using the assistant): ____

**Month-end decision**


| Keep | Improve | Stop |
| ---- | ------- | ---- |
|      |         |      |


**Signature (optional commitment)**
I will treat AI as staff I manage — briefed, limited, and reviewed.

Name: ________________________ Date: ____________

---

*Become a Manager of AI Agents · Participant Workbook · Sec 29*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 30** · Reference · R8 — Corporate Scenario Bank

## R8 — Corporate office scenario bank (inspiration only)

Pick a row close to your job. Banking/finance people can still use the Finance / Credit row.


| Domain                        | WITH AI (help at your desk)                      | THROUGH AI (path that runs)                      | Human approval                        |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------- |
| **HR / Admin**                | Offer / joining letter from template + sheet row | Form → onboarding checklist Doc → HR queue       | HR verifies compensation & dates      |
| **Team lead / Manager**       | Weekly update from Slack/WhatsApp notes          | Friday Sheet bullets → manager email draft       | You send after number check           |
| **Operations**                | Meeting notes → owners + deadlines               | Shared inbox / Form → tagged queue + draft reply | Ops owner sends / assigns             |
| **Customer / vendor support** | Rewrite angry email calmly                       | Ticket → SOP draft reply                         | Agent sends                           |
| **Marketing / Comms**         | 3 caption options; slide outline from brief      | Brief → draft pack → brand review folder         | Brand / compliance approves           |
| **Sales / BD**                | Visit notes → polite follow-up                   | Lead Form → welcome pack draft → CRM note        | RM / AE personalizes & sends          |
| **Analyst / Strategy**        | “What changed vs last month?” from export        | Dirty CSV → cleaned table → insight bullets      | Analyst owns the numbers              |
| **Finance / Accounts**        | Narrative for P&L bullets; vendor chase email    | Receipt photos / Sheet → exception list          | Finance lead confirms totals          |
| **Learning / L&D · IT**       | Lesson plan from PDF; access FAQ from SOP        | Ticket form → category + first reply draft       | Facilitator / IT agent owns edge cases |
| **Finance institutions**      | Document chase; product FAQ draft                | Inquiry Form → checklist Doc → RM queue          | RM sends; credit decision stays human |


**Everyday Bangladesh workplace patterns (any industry)**


| Familiar pattern                    | How AI helps                  | Still human                    |
| ----------------------------------- | ----------------------------- | ------------------------------ |
| Office WhatsApp chaos → Monday plan | Clean action list by owner    | You assign & chase             |
| Vendor / procurement follow-ups     | Polite reminder drafts        | Commercial terms stay yours    |
| New employee first-week confusion   | Handbook Q&A with citations   | HR owns exceptions             |
| Leadership Friday review            | Slide outline + speaker notes | Leaders own the story          |
| Shared mailbox overload             | Tag + draft; batch overnight  | Spot-check sample before trust |

---

*Become a Manager of AI Agents · Participant Workbook · Sec 30*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 31** · Big picture · Day Roadmap — How every piece connects

# Day Roadmap — How every piece connects

*One page. Same job all day. Escalate — don’t restart.*

```
  OPEN          WITH AI              THROUGH AI                 BY AI
  0.0–0.4       1.1–1.6              2.0–2.6                    3.0–3.6
     │             │                    │                          │
  Hire coach   Hire helper         Make the JOB run          Manage the team
  + name roles + lock ONE job      on a clear path           + ship + demo
```

| Stage | You learn | You build | Why the next step exists |
|-------|-----------|-----------|---------------------------|
| **0 Open** | What AI is · chat vs assistant vs agent | Teacher Project (Settings once) + kickoff chat | You need a coach before you hire a worker |
| **1 WITH** | Brief · feedback once · **lock one job** · tools ≤3 · memory | Work Assistant + **locked process (1.4)** | You must feel AI at your elbow *and* commit one job before automating |
| **2 THROUGH** | Map 🟢🔵🔴 · ETCSLV · pattern · brain · run | Trigger → AI → output → human approval | The locked job becomes a **path that runs**, not a blank chat every time |
| **3 BY** | Roles · harness (= ETCSLV for shipping) · failure · demo | Minimum AI roster + re-runnable capstone | Managers don’t do every draft — they set roles, limits, and quality |

### Task chain at a glance

| | Tasks | Connection |
|--|-------|------------|
| 🧠🖥️📘🤝💬 | **0.0→0.4** | Orient → open desk → hire Teacher → contract → name chat/assistant/agent |
| 📝🧑‍💼🔁🔒🧰📁 | **1.1→1.6** | Brief → hire Work Assistant → feedback once → **lock job** → tools → memory *for that job* |
| 🪜🗺️✍️🔍🌳🧬⚡ | **2.0→2.6** | How tall? → map → draft E–V → critique → pick pattern → brain → **run once** |
| 👔👥🛡️💥🚀🎤📅 | **3.0→3.6** | Manager mindset → roster → harness → break it → ship → demo → 30-day plan |

> **Remember:** Product of the day = one **running** workflow for the process you locked at **1.4**. Notes alone are not enough.

---

*Become a Manager of AI Agents · Participant Workbook · Sec 31*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 32** · Notes · Notes page

## Notes

```
_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________
```

---

*Become a Manager of AI Agents · Participant Workbook · Sec 32*


<div class="page-break" style="page-break-before: always; break-before: page;"></div>

**Sec 33** · Notes · Parking Lot, Wins & Closing

## Parking lot (questions for instructor / IT / compliance)

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

## Wins to tell my team on Monday

1. ___________________________________________________________________________

2. ___________________________________________________________________________

3. ___________________________________________________________________________

## Closing reminder

```
Work WITH AI    →  brief clearly, review always
Work THROUGH AI →  one path that runs
Work BY AI      →  roles + limits + evaluation

You are the manager.
AI is the workforce.
Final approval is still yours.
```

**Thank you for investing a day in building your personal AI workforce.**

---

*Participant Workbook · Become a Manager of AI Agents · Build Your Personal AI Workforce*
