# Platform Expansion Plan

## 1. Executive Summary
This document outlines the strategic plan to expand the `10MS_AI-GG` platform. The goal is to evolve from a linear group guidance platform into a comprehensive, AI-powered educational ecosystem that supports dynamic learning (TaRL), advanced mentorship, community interaction, and varied business models (B2B/B2C).

## 2. Requirements & Gap Analysis

### 2.1 Mentors
| Feature | Current State | New Requirement | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| **Roadmaps** | Manual creation of Weeks/Tasks. | Create roadmaps **with or without AI**. | **Add AI Service**: Integrate LLM to generate roadmap structures (weeks/tasks) from a prompt (e.g., "Full Stack Dev"). <br> **UI**: "Generate with AI" button in Roadmap Creator. |
| **Assessments** | Basic Task types (MCQ). | Create assessments. | **Expand Task Schema**: Add robust "Assessment" builder (Question Banks, multiple formats, time limits). |
| **Progress** | Basic batch/task tracking. | Track student progress. | **Enhance Analytics**: Dashboard with completion rates, time-spent (estimated), and performance alerts. |
| **Notifications** | "Notices" table exists. | Send Notifications. | **Multi-channel**: Integrate Push Notifications & Email (e.g., SendGrid/Firebase) alongside in-app Notices. |
| **Online Classes** | Static links in Batch settings. | Take online class by sharing/creating links. | **Live Session Module**: Teachers can schedule specific "Live Class" events in the calendar, generating/pasting Zoom/Meet links. |

### 2.2 Students
| Feature | Current State | New Requirement | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| **Roadmaps** | View static roadmaps. | See roadmaps. | **Maintain**: Core functionality remains. |
| **Community** | External (WhatsApp/Discord). | Community discussion in content roadmaps. | **Internal Forum**: Add `Discussions` feature directly attached to Roadmaps/Weeks/Tasks. |
| **Peer Progress** | N/A (Privacy focused?). | Community Students progress. | **Leaderboard/Batch View**: "Classmates" tab showing activity feeds or progress bars of peers (gamification). |
| **Practice** | Graded Tasks. | Micro-learning Cards (7taps style). | **Micro-learning Engine**: "Decks" of cards (Text, Image, Video, Quiz). Tap-to-advance UI. Mobile-first overlay. |

### 2.3 Algorithm & Intelligence
| Feature | New Requirement | Implementation Strategy |
| :--- | :--- | :--- |
| **Spaced Repetition** | Spaced Repetition of assessments. | **Modified SM-2 Algorithm**: <br>1. **Intervals**: Day 1, Day 6, then `I(n) = I(n-1) * EF` (where EF starts at 2.5). <br>2. **Wrong**: Reset to Day 1. <br>3. **Mastery**: 4 consecutive correct answers -> "Mastered". <br>4. **Expiry**: Mastered items re-appear after 30 days (Concept Decay check). |
| **Tracking** | Progress Tracking. | **Skill Graph**: Map tasks to "Skills". Track mastery % per skill, not just roadmaps. |
| **TaRL (Dynamic)** | Dynamic roadmaps (Teaching at the Right Level). | **Adaptive Engine**: Instead of fixed "Weeks", unlock content based on assessment capabilities. If specific weak area found -> insert remedial module. |

#### Spaced Repetition Logic Details
*   **Space (Days)**:
    *   Right Answer (Streak 0 -> 1): **1 Day**
    *   Right Answer (Streak 1 -> 2): **6 Days**
    *   Right Answer (Streak 2+): **Previous Interval × 2.5** (e.g., 6 -> 15 -> 37 days)
    *   Wrong Answer: **Reset to 1 Day** immediate review.
*   **Mastery Threshold**: **4 Consecutive Correct Attempts** (implies ~20 days retention).
*   **Expiry**: Even "Mastered" cards expire after **90 Days** to force a "Refresh Review".

### 2.4 Admin
| Feature | New Requirement | Implementation Strategy |
| :--- | :--- | :--- |
| **CMS** | AI CMS. | **AI Content Studio**: Admin tool to bulk-create content, ingest PDFs/Youtube URLs and automatically generate Tasks/Notes/Quizzes. |

### 2.5 Products (New Verticals)
The flexible core will support these specific content configurations:
1.  **Study Abroad**: Roadmap types for Applications, Visa prep.
2.  **IELTS Prep**: Heavy focus on "Practice Assessments" (Listening/Reading modules) and Spaced Repetition.
3.  **Admission**: Assessment-heavy roadmaps.
4.  **HSC Last Time Prep**: "Crash Course" style dynamic roadmaps (TaRL focus).
5.  **Mentorship for STEM**: Uses the core "Mentor" features.
6.  **B2B**: Enterprise login/dashboards (see Business Model).

### 2.6 Business Model
| Feature | New Requirement | Implementation Strategy |
| :--- | :--- | :--- |
| **Commission** | Sharing Commission with Teachers/Mentors. | **Finance Module**: Track `revenue` per batch/course. Calculate `payout` using configurable %. |
| **B2B** | B2B Subscription. | **Organizations Table**: Add `organizations` entity. Users belong to Org. Orgs pay subscriptions. Admin dashboard for Org Managers. |

---

## 3. Technical Architecture Updates

### 3.1 Database Schema Additions (Draft)

```sql
-- For Micro-learning (7taps style)
CREATE TABLE practice_decks (
  id UUID PRIMARY KEY,
  roadmap_id UUID, -- Optional linkage
  title VARCHAR,
  cover_image TEXT,
  created_by UUID,
  ...
);

CREATE TABLE practice_cards (
  id UUID PRIMARY KEY,
  deck_id UUID REFERENCES practice_decks(id),
  card_type VARCHAR, -- 'text', 'image', 'video', 'quiz'
  content JSONB, -- Flexible content structure
  order_index INTEGER,
  ...
);

  ...
);

-- Concept Map & Memory
CREATE TABLE concepts (
  id UUID PRIMARY KEY,
  name VARCHAR,
  parent_id UUID REFERENCES concepts(id) -- Hierarchy
);

CREATE TABLE concept_relationships (
  source_id UUID REFERENCES concepts(id),
  target_id UUID REFERENCES concepts(id),
  type VARCHAR -- 'prerequisite', 'related'
);

-- Link Cards to Concepts
ALTER TABLE practice_cards ADD COLUMN concept_id UUID REFERENCES concepts(id);

-- Student Memory (Spaced Repetition Store)
CREATE TABLE student_concept_mastery (
  student_id UUID REFERENCES users(id),
  concept_id UUID REFERENCES concepts(id),
  mastery_level FLOAT, -- 0.0 to 1.0 (Algorithm Score)
  streak_count INTEGER,
  last_practiced_at TIMESTAMP,
  next_review_date TIMESTAMP, -- The core Spaced Repetition field
  PRIMARY KEY (student_id, concept_id)
);

-- For Internal Community
CREATE TABLE roadmap_discussions (
  id UUID PRIMARY KEY,
  entity_type VARCHAR, -- 'roadmap', 'week', 'task'
  entity_id UUID,
  user_id UUID,
  content TEXT,
  parent_id UUID, -- For threaded replies
  ...
);

-- For Live Classes
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY,
  batch_id UUID,
  mentor_id UUID,
  title VARCHAR,
  start_time TIMESTAMP,
  meeting_link TEXT,
  platform VARCHAR, -- 'zoom', 'meet'
  ...
);

-- For Spaced Repetition / Mastery
CREATE TABLE student_skill_mastery (
  student_id UUID,
  skill_tag VARCHAR,
  mastery_level FLOAT,
  last_practiced_at TIMESTAMP,
  next_review_at TIMESTAMP -- Standard Spaced Repetition attribute
);

-- For Finance
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID,
  amount DECIMAL,
  type VARCHAR, -- 'payment', 'payout', 'subscription'
  status VARCHAR
);

-- For B2B
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR,
  subscription_plan VARCHAR,
  ...
);
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
```

### 3.2 AI Integration Layer
*   **Provider**: OpenAI API (GPT-4o) or similar.
*   **Functions**:
    *   `generateRoadmap(topic, level, duration)` -> JSON structure of Weeks/Tasks.
    *   `generateQuiz(topic, difficulty)` -> JSON array of Questions.
    *   `analyzePerformance(student_history)` -> Recommendation for Next Task (TaRL).

---

## 4. Phased Implementation Roadmap

### Phase 1: Interaction & Content (Mentors + Students)
*   [ ] Implement **Internal Discussions/Community** features.
*   [ ] Build **Live Class Scheduler** for Mentors.
*   [ ] Build **Micro-learning Engine** (7taps style decks/cards).

### Phase 2: The Logic Core (Algorithm/AI)
*   [ ] Implement **AI Roadmap Generator** (Mentor Tool).
*   [ ] Develop **Spaced Repetition Scheduler** (Backend Job).
*   [ ] Build **TaRL/Dynamic Engine** (Adaptive Task unlocking).

### 5. TaRL & Asymmetrical Learning Strategy
**First Principle**: TaRL ≠ everyone moves together. TaRL = everyone is taught at their current level.

#### 5.1 Core Building Blocks (4 Layers)
1.  **Diagnostic Placement**: Continuous assessment, not just one-time.
2.  **Self-Paced Core (AI-Led)**: Students move through modules at their own speed. Practice/Feedback is automated.
3.  **Level-Based Touchpoints**: Teachers facilitate *levels*, not *calendar weeks*.
4.  **Dynamic Regrouping**: Students move between "Level Groups" based on weekly micro-assessments.

#### 5.2 User Flow (Student)
1.  **Entry**: Diagnostic Test -> Placed in **Module X** (State, not identity).
2.  **Daily**: Follows AI-led module path. Asymmetry is absorbed here.
3.  **Re-evaluation**: Bi-weekly checks. Pass -> Move to next Module Group. Fail -> Stay.

#### 5.3 Teacher Workflow (The Solution to Asymmetry)
Teachers do **NOT** teach "Week 3 Material" to everyone. They use **Global Patterns**:

*   **Pattern A: Level-Based Clinics (Primary Model)**
    *   Teacher schedules: *"Level 1 Clinic"* and *"Level 2 Clinic"*.
    *   Students self-select or are invited based on their current Module.
    *   *Result*: 5 students attend Level 1, 8 students attend Level 2. No confusion.
*   **Pattern B: Rotational Teaching**
    *   Live session with breakout rooms. Teacher visits "Group M1" while "Group M2" works with AI.
*   **Pattern C: Anchor + Breakout**
    *   10min Broad Concept (Cross-level) -> Breakouts by Module.

#### 5.4 Platform Logic & UX
*   **Teacher Dashboard**: specific "Distribution Graph" (e.g., Mod 1: 4 students, Mod 2: 8 students).
    *   *System Nudge*: "Most students are in Mod 2. Schedule a Mod 2 Clinic."
*   **Session Tagging**: Sessions are tagged `Target: Module 2`.
    *   *Student View*: "Best for Module 2". Warning if M1 student tries to join ("This may be advanced").

#### 5.5 Gamification Strategy
**Goal**: Motivate consistency without distraction.
*   **Point Sources**:
    1.  **Correct Practice Answer**: **+10 XP** (Encourages accuracy in micro-learning).
    2.  **Finish a Module**: **+100 XP** (Encourages substantial progress).
    3.  **Daily Streak**: **+50 XP** (Encourages consistency).
*   **Leaderboard**: "Weekly Learners" (XP earned this week) visible in the Batch Community tab.

### 6. Database Schema Overview
| Category | **Current Tables** (Existing) | **New Tables** (To Build) |
| :--- | :--- | :--- |
| **Users & Core** | `users`, `user_sessions` | `organizations` (B2B) |
| **Profiles** | `student_profiles`, `mentor_profiles` | - |
| **Roadmaps** | `roadmaps`, `roadmap_weeks`, `roadmap_tasks` | `roadmap_discussions` (Community) |
| **Learning** | `batches`, `student_batch_assignments`, `student_progress` | `live_sessions` (Tagged Clinics) |
| **Practice (New)** | - | `practice_decks`, `practice_cards` |
| **Intelligence** | - | `concepts`, `concept_relationships`, `student_concept_mastery` |
| **Business** | - | `transactions` (Commissions/Subs) |

### Phase 3: Business & Scale
*   [ ] **B2B Architecture** (Organizations, Subscriptions).
*   [ ] **Finance/Commission** System.
*   [ ] Launch new Product Verticals (IELTS, HSC layout configs).
