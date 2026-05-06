# Adaptive Learning & Intelligence System

## 1. Overview
This document outlines the architecture, user flows, and database structures for the **Intelligence Layer** of the platform, specifically implementing **TaRL (Teaching at the Right Level)** and **Spaced Repetition**.

---

## 2. TaRL (Teaching at the Right Level)

### 2.1 Core Principle
**"Asymmetry is absorbed safely."**
Students are not forced to move synchronously. The system detects their "Current Level" based on mastery, not a calendar.

### 2.2 User Flows

#### Student Entry & Placement
1.  **Diagnostic**: (Planned) Student takes an initial quiz.
2.  **Placement**: System sets initial `completed_weeks`.
    *   *Implementation*: `tarlService.calculateStudentLevel` scans sequential completion.

#### Daily Learning (AI-Led)
1.  **Dashboard**: Shows **Current Level** tasks (e.g., Week 2).
2.  **Locking**: Future levels (Week 3+) are locked 🔒.
3.  **Unlocking**:
    *   Student completes >80% of Week 2 tasks.
    *   System unlocks Week 3 immediately.
    *   Dashboard updates "Current Level" to Week 3.

#### Teacher Involvement (Dynamic Sessions)
*   **Clinics**: Teachers schedule "Module 2 Clinic" instead of "Week 3 Class".
*   **Recommendation**:
    *   System matches `live_sessions.target_audience` (e.g., `{"level": 2}`) with `student.current_level`.
    *   Dashboard highlights relevant sessions: "Recommended for You".
    *   Warns for mismatches: "This session is for Level 3 (Advanced)".
*   **Data-Driven**: (Planned) Teacher dashboard shows "15 students stuck in Module 2".

### 2.3 Database Structure
**Table**: `student_progress`
*   `status`: 'completed' | 'in_progress'
*   `score`: Assessment results.

**Table**: `live_sessions`
*   `session_type`: 'clinic' | 'anchor' | 'workshop'
*   `target_audience`: `JSONB`
    *   Structure: `{ "min_level": 2, "max_level": 3, "specific_modules": ["react-basics"] }`

**Service**: [tarlService.ts](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/services/db/tarlService.ts)
*   [calculateStudentLevel(studentId)](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/services/db/tarlService.ts#15-104): Returns integer level.

---

## 3. Spaced Repetition System (SRS)

### 3.1 Core Principle
**"Memory is efficient."**
Review intervals expand exponentially for known concepts (SM-2 Algorithm).

### 3.2 User Flows

#### Learning Phase
1.  Student learns concept (Video/Text).
2.  Takes immediate practice quiz.
3.  Result initialized in `student_card_mastery`.

#### Review Phase
1.  **Dashboard**: "Due for Review" banner appears if `next_review_at <= NOW`.
2.  **Session**: Student clicks banner -> Launches [DeckPlayer](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/components/Student/DeckPlayer.tsx#18-301) in Review Mode.
3.  **Feedback**:
    *   **Easy**: Interval * 2.5
    *   **Good**: Interval * 1.5
    *   **Hard**: Interval / 2 (or reset)
4.  **Update**: Card rescheduled.

### 3.3 Database Structure
**Table**: `student_card_mastery`
*   `mastery_level`: Float (0-5)
*   `streak_count`: Integer
*   `last_practiced_at`: Timestamp
*   `next_review_at`: Timestamp

**Service**: [spacedRepetitionService.ts](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/services/db/spacedRepetitionService.ts)
*   [getDueCards()](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/services/db/spacedRepetitionService.ts#124-153): Fetches cards where `next_review_at <= NOW`.
*   [processCardReview()](file:///Users/mukit_10ms/Documents/GitHub/10MS_AI-GG/src/services/db/spacedRepetitionService.ts#58-123): Applies SM-2 logic.

---

## 4. Algorithms

### 4.1 SM-2 (Detailed Implementation)

The algorithm uses a combination of **Hardcoded Rules** for the first two steps and a **Math Multiplier** for all subsequent steps.

#### 1. The Multiplier ("Ease Factor")
Every card starts with a "Easiness Factor" (EF) of **2.5**.
Every time a student answers "Easy" (Quality 5), the system **adds 0.1** to this multiplier. This represents that because the concept effectively "stuck," the system can wait even longer next time.

#### 2. The Step-by-Step Calculation (Example)
Here is the math running for consecutive "Easy" answers:

**Attempt 1 (First Practice)**
*   **Rule**: If it's the first time (`repetition = 0`), the interval is **always 1 day**.
*   **Multiplier Update**: `2.5 + 0.1` = **2.6**
*   **Result**: Review tomorrow.

**Attempt 2**
*   **Rule**: If it's the second time (`repetition = 1`), the interval is **always 6 days**.
*   **Multiplier Update**: `2.6 + 0.1` = **2.7**
*   **Result**: Review in 6 days.

**Attempt 3**
*   **Rule**: No more hard rules. Now we do `Previous Interval × Multiplier`.
*   **Math**: `6 days × 2.7` = **16.2 days** (rounded to 16).
*   **Multiplier Update**: `2.7 + 0.1` = **2.8**
*   **Result**: Review in ~2 weeks.

**Attempt 4**
*   **Math**: `16 days × 2.8` = **44.8 days** (rounded to 45).
*   **Multiplier Update**: `2.8 + 0.1` = **2.9**
*   **Result**: Review in ~1.5 months.

**Attempt 5**
*   **Math**: `45 days × 2.9` = **130.5 days**.
*   **Result**: Review in ~4 months. 

> The "secret" is that the interval is the result of the previous interval multiplied by an ever-increasing easiness factor.

### 4.2 Sequential Unlocking (TaRL)
```typescript
CurrentLevel = 1
For Week[i] in Roadmap:
  If (Week[i-1].isCompleted):
     If (Week[i].completion < Threshold):
        Return Week[i] // This is the stuck point
  Else:
     Lock Week[i]
```
