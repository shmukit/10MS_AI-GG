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
- **Week-by-Week Progress**: Visual representation of learning journey
- **Workshop slides**: When the mentor adds a slides URL, a **View Slides** button appears at the top of the roadmap page; opens a modal with prev/next (PDF), zoom in/out, and close
- **Decision tree tab**: Interactive AI pattern finder on roadmaps that include it (e.g. workshop)
- **Task Management**: Mark individual tasks as complete
- **Progress Tracking**: Real-time completion statistics
- **Status Indicators**: Locked, Active, and Completed week states
- **Task Types**: Different icons for watch, read, project, attend, MCQ, written tasks
- **Week Completion**: Mark entire weeks as complete when all tasks done

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
- **Watch**: Video content and tutorials
- **Read**: Documentation and articles
- **Project**: Hands-on coding assignments
- **Attend**: Live sessions and meetings
- **MCQ**: Multiple choice assessments
- **Written**: Essay and written assignments

## Navigation
- **Dashboard**: `/student/dashboard`
- **Roadmap**: `/student/roadmap/{roadmap-slug}`
- **Community**: `/student/community/{batch-slug}`
- **Profile**: Accessible via header dropdown

## Limitations
- **No Direct Messaging**: Students cannot directly message each other
- **No Resource Sharing**: No built-in file or resource sharing system
- **No Discussion Forums**: Community is primarily informational, not interactive
- **Task Management**: Tasks can only be marked complete from roadmap, not dashboard

## Data Relationships
- **User → Student Profile**: One-to-one relationship
- **Student → Batch Assignments**: One-to-many relationship (can be in multiple batches)
- **Batch → Roadmap**: Many-to-one relationship
- **Roadmap → Weeks**: One-to-many relationship
- **Week → Tasks**: One-to-many relationship
- **Student → Progress**: One-to-many relationship (one record per task)
