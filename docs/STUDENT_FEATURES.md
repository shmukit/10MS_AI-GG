# Student Dashboard Features

## Overview
The student dashboard provides a comprehensive view of learning progress, tasks, and community interactions for AI-Enabled Group Guidance Program participants.

## User Acceptance & Registration

### Registration Process
- **Sign Up**: Students can create accounts with email, password, and full name
- **Email Verification**: Basic email verification system
- **Profile Creation**: Automatic student profile creation upon registration
- **Batch Assignment**: Students are assigned to batches by administrators/mentors

### Login Process
- **Email/Password**: Standard email and password authentication
- **Auto-redirect**: All users are redirected to student dashboard after login
- **Session Management**: Persistent login sessions with Supabase
- **Role-based Access**: Students can access both student and mentor features

## User Flow

### 1. Registration & Onboarding
```
Sign Up → Email Verification → Profile Creation → Batch Assignment → Dashboard Access
```

### 2. Daily Usage Flow
```
Login → Dashboard → View Tasks → Navigate to Roadmap → Mark Tasks Complete → Return to Dashboard
```

### 3. Community Interaction
```
Dashboard → Community → View Batch Members → Access Communication Links → Copy Contact Info
```

### 4. Progress Tracking
```
Dashboard → Roadmap → View Week Progress → Complete Tasks → Mark Week Complete → Update Progress
```

### 5. Session discussion (per roadmap node)
```
Roadmap → Open session → Discussion Board → Post question → Peers reply (1 nest) → Collapse/expand thread
```

## Database Tables Used

### Core User Tables
- **`users`**: Basic user information (id, email, password_hash, role, first_name, last_name)
- **`student_profiles`**: Student-specific information (institute, year, subject, degree)
- **`student_batch_assignments`**: Student enrollment in batches with progress tracking

### Learning & Progress Tables
- **`roadmaps`**: Learning program definitions (title, description, total_weeks, node_unit_label, slides_url, difficulty)
- **`roadmap_weeks`**: Weekly learning modules (week_number, title, description, domain)
- **`roadmap_tasks`**: Individual learning tasks (task_name, task_type, deadline, points)
- **`student_progress`**: Task completion tracking (status, completed_at, score, feedback)

### Communication Tables
- **`notices`**: Announcements and updates (title, content, batch_id, priority)
- **`batches`**: Group information (name, roadmap_id, whatsapp_link, discord_link)
- **`roadmap_discussions`**: Per-session Q&A threads (`entity_type` = week/session, `entity_id` = week id; `parent_id` null = root question, set = reply)

### Session Management
- **`user_sessions`**: Authentication session tracking (session_token, expires_at)

## Core Features

### 📊 Dashboard
- **Welcome Section**: Personalized greeting with roadmap selection dropdown
- **Navigation Cards**: Quick access to Roadmap and Community
- **This Week's Tasks**: View current week assignments (read-only, no mark as done)
- **Upcoming Tasks**: Preview of next week's tasks
- **Week Streaks**: Visual progress tracking across weeks
- **Notice Board**: Important announcements and updates
- **Next Zoom Call**: Upcoming meeting details with join button
- **Mentor Information**: View assigned mentors and their expertise

### 🗺️ Roadmap
- **Week-by-Week Progress**: Visual representation of learning journey (label may be Session/Week/etc. via `node_unit_label`)
- **Workshop slides**: When slides are enabled for the batch/roadmap, a **Slides** control opens the deck (Google Slides embed or PDF viewer)
- **Decision tree tab**: Interactive AI pattern finder on roadmaps that include it (e.g. workshop)
- **Task Management**: Mark individual tasks complete or incomplete; order stays fixed (`sort_order`) — checking a task does **not** move it to the bottom
- **Hands-on tasks**: `project` type shown with a **Hands-on** badge (and often titled `Hands-on: …`)
- **Progress Tracking**: Real-time completion statistics
- **Status Indicators**: Locked, Active, and Completed node states
- **Task Types**: watch, read, project (hands-on), attend, MCQ, written
- **Node Completion**: Mark entire session/week complete when all required tasks are done

### 💬 Discussion Board (on each roadmap session/week panel)
Per-session Q&A attached to the open roadmap node (`DiscussionBoard` + `roadmap_discussions`).

**UACs**
- Signed-in students can **post a root question** (“Post Question”)
- Other students (and the author) can **reply** to that question
- Nesting is **exactly one layer**: root question → flat replies (no reply-to-reply trees)
- Authors can **delete** their own root question (cascades replies)
- Authors can **edit** or **delete** their own replies via **Edit** / **Delete** CTA buttons on the reply row
- Threads with replies are **collapsible like Reddit**:
  - Click the **chevron**, the **root comment header/body**, the **Collapse/Expand** control, or the **vertical line** beside replies
  - Collapsed state shows `[N replies hidden — click to expand]`
- Must be signed in to post/reply; clear error if the session user id is missing

**Technical notes**
- Authors loaded from `public.users` (not a broken PostgREST embed on `auth.users`)
- Replies always attach to the top-level question (`createPost` hoists if a nested parent is passed)
- Older multi-level data is flattened under the root when rendering

### 👥 Community
- **Batch Information**: View batch details and member count
- **Communication Links**: WhatsApp, Discord, and emergency contact buttons
- **Group Members**: List of students in the same batch with progress
- **Student Profiles**: Basic student information (name, degree, institute, year)
- **Progress Display**: Individual student progress percentages
- **Email Copy**: Copy student emails to clipboard

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Live progress tracking
- **Professional UI**: Modern, polished interface with smooth animations

## Task Types
- **Watch**: Optional video materials (e.g. Session 4 go-deeper)
- **Read**: Documentation and articles
- **Project / Hands-on**: Practice activities (prompting, tools, builds) — UI label **Hands-on**
- **Attend**: Live / facilitated discussion blocks
- **MCQ**: Multiple choice assessments
- **Written**: Reflections and written assignments

## Navigation
- **Dashboard**: `/student/dashboard`
- **Roadmap**: `/student/roadmap/{roadmap-slug}`
- **Community**: `/student/community/{batch-slug}`
- **Profile**: Accessible via header dropdown

## Limitations
- **No Direct Messaging**: Students cannot DM each other in-app
- **No Resource Sharing**: No built-in file upload for peer sharing
- **Discussion depth**: Only one reply layer under each root question (by design)
- **Task Management**: Tasks are marked complete from the roadmap session panel (not the dashboard task list)

## Data Relationships
- **User → Student Profile**: One-to-one relationship
- **Student → Batch Assignments**: One-to-many relationship (can be in multiple batches)
- **Batch → Roadmap**: Many-to-one relationship
- **Roadmap → Weeks/Sessions**: One-to-many relationship
- **Week → Tasks**: One-to-many relationship (`sort_order` within week)
- **Student → Progress**: One-to-many relationship (one record per task)
- **Week → Discussions**: One-to-many root questions; each root → many flat replies
