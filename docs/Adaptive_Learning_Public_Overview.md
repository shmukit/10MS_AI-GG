# Adaptive Learning & Intelligence System: Public Overview

## Overview
The **Intelligence Layer** of the 10MS AI-GG platform is designed to personalize the educational experience using two core methodologies: **Teaching at the Right Level (TaRL)** and **Spaced Repetition System (SRS)**. This system ensures students progress based on mastery rather than a fixed calendar and maximizes long-term retention.

---

## 1. Teaching at the Right Level (TaRL)

### Core Philosophy
**"Asymmetry is absorbed safely."**
We recognize that every student learns at a different pace. The system decouples progress from time, allowing students to move forward only when they have mastered the current concepts.

### User Journey
1.  **Diagnostic Entry**: Upon joining, students take a diagnostic quiz. The AI analyzes their performance to place them at the appropriate starting week, skipping content they already know.
2.  **Mastery-Based Unlock**:
    *   The **Dashboard** displays tasks for the *Current Level*.
    *   Future content (Week 3, 4, etc.) remains **Locked 🔒** to prevent cognitive overload.
    *   **Progression**: Completing **>80%** of the current week's tasks triggers an immediate unlock of the next level.
3.  **Dynamic Clinics**:
    *   Instead of generic "Week 3 Classes," teachers host data-driven **Clinics** (e.g., "Module 2 Remedial").
    *   The system recommends these sessions to specific students stuck at that level, ensuring live time is used efficiently.

### Algorithm: Sequential Unlocking
The system continuously evaluates the `Current Level` using a sequential check:
*   *Is the previous week completed?* (Yes)
*   *Is the current week completion > Threshold?* (No -> **Current Level**)

---

## 2. Spaced Repetition System (SRS)

### Core Philosophy
**"Memory is efficient."**
To prevent the "forgetting curve," the system strategically schedules reviews. Concepts are revisited just as a student is about to forget them, converting short-term knowledge into long-term memory.

### User Journey
1.  **Active Learning**: Students engage with video/text content and take an immediate practice quiz to initialize mastery.
2.  **Smart Review Scheduling**:
    *   The **Dashboard** treats review as a first-class citizen with a "Due for Review" banner.
    *   Students launch the **DeckPlayer** to practice due cards.
3.  **Adaptive Feedback Loop**:
    *   After each card, the student rates difficulty: **Easy**, **Good**, or **Hard**.
    *   The system immediately reschedules the card:
        *   *Easy* → Review in **2.5x** days (e.g., 4 days).
        *   *Good* → Review in **1.5x** days (e.g., 2 days).
        *   *Hard* → Review in **0.5x** days (e.g., 10 mins).

### Algorithm: SM-2 (Detailed Logic)
The algorithm uses a combination of **Hardcoded Rules** for the first two steps and a **Math Multiplier** for all subsequent steps.

**1. The Multiplier ("Ease Factor")**
Every card starts with a "Easiness Factor" (EF) of **2.5**. Every time you answer "Easy", the system **adds 0.1** to this multiplier.

**2. The Step-by-Step Calculation**
Here is the progression for consecutive "Easy" answers:
*   **Attempt 1**: Interval is **1 day** (Hardcoded). Multiplier becomes `2.6`.
*   **Attempt 2**: Interval is **6 days** (Hardcoded). Multiplier becomes `2.7`.
*   **Attempt 3**: `6 days × 2.7` = **16 days**. Multiplier becomes `2.8`.
*   **Attempt 4**: `16 days × 2.8` = **45 days**. Multiplier becomes `2.9`.
*   **Attempt 5**: `45 days × 2.9` = **130 days** (~4 months).

> The "secret" is that the interval is the result of the previous interval multiplied by an ever-increasing easiness factor.


Here is the exact code logic broken down:

1. The Multiplier ("Ease Factor")
Every card starts with a "Easiness Factor" (EF) of 2.5. Every time you answer "Easy" (Quality 5), the system adds 0.1 to this multiplier. This represents that because you found it easy, the concept is "sticking" well, so we can wait even longer next time.

2. The Step-by-Step Calculation
Here is the math running for consecutive "Easy" answers:

Attempt 1 (First Practice)
Rule: If it's the first time (repetition = 0), the interval is always 1 day.
Multiplier Update: 2.5 + 0.1 = 2.6
Result: See you tomorrow.

Attempt 2
Rule: If it's the second time (repetition = 1), the interval is always 6 days.
Multiplier Update: 2.6 + 0.1 = 2.7
Result: See you in 6 days.

Attempt 3
Rule: No more hard rules. Now we do Previous Interval × Multiplier.
Math: 6 days × 2.7 = 16.2 days (rounded to 16).
Multiplier Update: 2.7 + 0.1 = 2.8
Result: See you in ~2 weeks.

Attempt 4
Math: 16 days × 2.8 = 44.8 days (rounded to 45).
Multiplier Update: 2.8 + 0.1 = 2.9
Result: See you in ~1.5 months.

Attempt 5
Math: 45 days × 2.9 = 130.5 days.
Result: See you in ~4 months.

So, the "secret" is that the interval is the result of the previous interval multiplied by an ever-increasing easiness factor.