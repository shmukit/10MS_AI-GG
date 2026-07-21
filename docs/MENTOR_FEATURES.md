# Mentor Dashboard Features

## Overview
The mentor dashboard provides tools for managing student progress, creating content, and overseeing the AI-Enabled Group Guidance Program.

## User Acceptance & Registration

### Registration Process
- **Sign Up**: Mentors create accounts with email, password, and full name
- **Email Verification**: Basic email verification system
- **Profile Creation**: Automatic mentor profile creation upon registration
- **Role Assignment**: Users are assigned 'mentor' role by administrators
- **Batch Assignment**: Mentors are assigned to specific batches by administrators

### Login Process
- **Email/Password**: Standard email and password authentication
- **Auto-redirect**: All users are redirected to student dashboard after login
- **Manual Navigation**: Mentors must navigate to `/mentor/dashboard` manually
- **Session Management**: Persistent login sessions with Supabase
- **Access Control**: Mentors can access both student and mentor features

## User Flow

### 1. Registration & Onboarding
```
Sign Up → Email Verification → Profile Creation → Role Assignment → Batch Assignment → Dashboard Access
```

### 2. Daily Management Flow
```
Login → Navigate to Mentor Dashboard → View Student Progress → Create/Edit Tasks → Send Notices → Monitor Analytics
```

### 3. Student Management Flow
```
Dashboard → Students Tab → Select Batch → View Student List → Add New Students → Monitor Progress
```

### 4. Content Management Flow
```
Dashboard → Roadmaps Tab → Select Roadmap → Create/Edit Weeks → Add/Modify Tasks → Set Deadlines
```

### 5. Communication Flow
```
Dashboard → Notices Tab → Create Notice → Select Batch → Set Priority → Schedule/Publish → Track Delivery
```

## Database Tables Used

### Core User Tables
- **`users`**: Basic user information (id, email, password_hash, role, first_name, last_name)
- **`mentor_profiles`**: Mentor-specific information (organization, designation, expertise_areas, bio)
- **`batches`**: Batch management (name, roadmap_id, mentor_id, max_students, status)

### Learning & Content Tables
- **`roadmaps`**: Learning program definitions (title, description, total_weeks, node_unit_label, slides_url, difficulty, category)
- **`roadmap_weeks`**: Weekly learning modules (week_number, title, description, domain)
- **`roadmap_tasks`**: Individual learning tasks (task_name, task_type, deadline, estimated_hours, points)

### Student Management Tables
- **`student_profiles`**: Student information (institute, year, subject, degree)
- **`student_batch_assignments`**: Student enrollment tracking (enrollment_date, status, progress_percentage)
- **`student_progress`**: Task completion tracking (status, completed_at, score, feedback)

### Communication & Analytics Tables
- **`notices`**: Announcements and updates (title, content, batch_id, priority, scheduled_date)
- **`user_sessions`**: Authentication session tracking (session_token, expires_at)

## Core Features

### 📊 Dashboard
- **Overview Statistics**: Total students, active batches, completion rates
- **Recent Activity**: Latest student submissions and progress updates
- **Quick Actions**: Create tasks, send notices, manage batches
- **Performance Metrics**: Batch-wise and individual student analytics

### 👥 Student Management
- **Student List**: View all assigned students with progress status
- **Batch Assignment**: Assign students to specific batches
- **Progress Tracking**: Monitor task completion and week progress
- **Student Addition**: Add new students to batches

### 🗺️ Roadmap Management
- **Week Creation**: Add new learning weeks with descriptions
- **Node labeling**: Set node unit label (Week, Session, Month, Module, or custom) and rename individual nodes
- **Workshop slides**: Optional `slides_url` on each roadmap — PDF, Google Slides publish/embed, or PPT link; students see **View Slides** when set
- **Task Management**: Create and edit tasks with different types
- **Content Upload**: Add relevant links, resources, and materials
- **Progress Monitoring**: Track completion rates across batches
- **Status Updates**: Modify week and task statuses

### 📝 Notice Board
- **Create Notices**: Send announcements to specific batches
- **Notice Management**: Edit, delete, and track notice read status
- **Targeted Communication**: Send notices to specific student groups
- **Notice History**: View all sent notices

### 📚 Content Management
- **Task Types**: Create watch, read, project, attend, MCQ, written tasks
- **Resource Links**: Add external resources and learning materials
- **Deadline Setting**: Configure task deadlines and time estimates

### 📈 Analytics & Reporting
- **Batch Performance**: Overall completion rates and statistics
- **Student Progress**: Individual and comparative progress tracking
- **Week Completion**: Monitor week-wise completion across batches

### ⚙️ Settings & Configuration
- **Profile Management**: Basic mentor information display
- **Batch Configuration**: Manage batch settings and student assignments
- **System Preferences**: Basic configuration options

## Task Management
- **Create Tasks**: Add new learning activities with detailed descriptions
- **Edit Tasks**: Modify existing tasks and requirements
- **Delete Tasks**: Remove outdated or incorrect tasks

## Student Support
- **Progress Monitoring**: Track individual student advancement
- **Batch Management**: Create and manage student batches
- **Communication**: Send notices and announcements

## Navigation
- **Dashboard**: `/mentor/dashboard`
- **Students**: `/mentor/students`
- **Roadmaps**: `/mentor/roadmaps`
- **Notices**: `/mentor/notices`
- **Settings**: `/mentor/settings` (basic placeholder)
- **Profile**: Accessible via header dropdown

## Limitations
- **No Individual Student Profiles**: Cannot view detailed individual student information
- **No Bulk Operations**: Cannot perform bulk actions on multiple students
- **No Point System**: Tasks do not have point assignments
- **No Notice Effectiveness Tracking**: Cannot measure notice read rates or effectiveness
- **Basic Settings**: Settings page is mostly a placeholder
- **No Advanced Analytics**: Limited reporting and trend analysis capabilities

## Data Relationships
- **User → Mentor Profile**: One-to-one relationship
- **Mentor → Batches**: One-to-many relationship (can manage multiple batches)
- **Batch → Students**: Many-to-many relationship through student_batch_assignments
- **Batch → Roadmap**: Many-to-one relationship
- **Roadmap → Weeks**: One-to-many relationship
- **Week → Tasks**: One-to-many relationship
- **Student → Progress**: One-to-many relationship (one record per task)
- **Mentor → Notices**: One-to-many relationship (can send multiple notices)

## Access Control
- **Role-based**: Mentors have 'mentor' role in users table
- **Batch-scoped**: Mentors can only manage assigned batches
- **Cross-access**: Mentors can access student features for testing/monitoring
- **No Admin Rights**: Mentors cannot modify system settings or user roles
