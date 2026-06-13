# PostHog Events Management Documentation

## Overview

This document provides a comprehensive guide to all PostHog events being tracked in the 10MS AI GG application. The events are organized by category and include detailed definitions, properties, and segmentation strategies.

## Table of Contents

1. [Configuration](#configuration)
2. [Event Summary](#event-summary)
3. [Authentication Events](#authentication-events)
4. [Page View Events](#page-view-events)
5. [User Interaction Events](#user-interaction-events)
6. [Progress Tracking Events](#progress-tracking-events)
7. [Engagement Metrics](#engagement-metrics)
8. [Event Segments](#event-segments)
9. [Implementation Guidelines](#implementation-guidelines)
10. [Monitoring & Alerts](#monitoring--alerts)

## Configuration

### PostHog Setup
- **API Key**: Set via `VITE_POSTHOG_KEY` in `.env.local` (never commit)
- **Region**: US 🇺🇸
- **Host**: `VITE_POSTHOG_HOST` (default: `https://us.i.posthog.com`)
- **Person Profiles**: `identified_only`
- **Page View Capture**: `false` (manual tracking)

### Files Modified
- `src/lib/posthog.ts` - PostHog configuration
- `src/main.tsx` - PostHog initialization
- `src/App.tsx` - PostHogProvider wrapper
- `src/components/Auth/LoginPage.tsx` - Authentication event tracking
- `src/components/Student/StudentDashboard.tsx` - Student dashboard tracking
- `src/components/Roadmap/RoadmapInterface.tsx` - Roadmap tracking
- `src/components/Community/CommunityPage.tsx` - Community tracking

## Event Summary

### **Total Events Implemented: 20**

| Category | Count | Events |
|----------|-------|--------|
| **Authentication** | 9 | login_attempt, login_success, login_failed, signup_attempt, signup_success, signup_failed, email_confirmation_required, auth_error, $pageview (auth) |
| **Page Views** | 3 | student_dashboard_view, roadmap_view, community_view |
| **User Interactions** | 6 | weekly_streak_clicked, current_week_task_clicked, upcoming_task_clicked, notice_clicked, whatsapp_group_clicked, student_contact_clicked |
| **Progress Tracking** | 2 | week_completed, task_overdue |
| **Engagement Metrics** | 3 | DAU, WAU, MAU |

### **Components with Tracking**
- ✅ `LoginPage.tsx` - Authentication events
- ✅ `StudentDashboard.tsx` - Dashboard, progress, streaks
- ✅ `RoadmapInterface.tsx` - Roadmap engagement
- ✅ `CommunityPage.tsx` - Community engagement

## Authentication Events

### Current Implementation

#### 1. `$pageview` - Page View Tracking
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When login/signup page loads
**Properties**:
```typescript
{
  page: 'login' | 'signup'
}
```
**Description**: Tracks when users visit the authentication pages.

#### 2. `login_attempt` - Login Attempt
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When user submits login form
**Properties**:
```typescript
{
  email: string
}
```
**Description**: Tracks login attempts for analytics and security monitoring.

#### 3. `login_success` - Successful Login
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When login is successful
**Properties**:
```typescript
{
  email: string
}
```
**Description**: Tracks successful logins and triggers user identification.

#### 4. `login_failed` - Failed Login
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When login fails
**Properties**:
```typescript
{
  email: string,
  error: string
}
```
**Description**: Tracks failed login attempts for security analysis.

#### 5. `signup_attempt` - Signup Attempt
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When user submits signup form
**Properties**:
```typescript
{
  email: string,
  name: string
}
```
**Description**: Tracks new user registration attempts.

#### 6. `signup_success` - Successful Signup
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When signup is successful
**Properties**:
```typescript
{
  email: string,
  name: string
}
```
**Description**: Tracks successful user registrations and triggers user identification.

#### 7. `signup_failed` - Failed Signup
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When signup fails
**Properties**:
```typescript
{
  email: string,
  error: string
}
```
**Description**: Tracks failed signup attempts for debugging.

#### 8. `email_confirmation_required` - Email Confirmation
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When signup requires email confirmation
**Properties**:
```typescript
{
  email: string
}
```
**Description**: Tracks when users need to confirm their email.

#### 9. `auth_error` - Authentication Error
**Location**: `src/components/Auth/LoginPage.tsx`
**Trigger**: When authentication process throws an error
**Properties**:
```typescript
{
  action: 'login' | 'signup',
  email: string,
  error: string
}
```
**Description**: Tracks unexpected errors during authentication.

## Page View Events

### Current Implementation

#### 1. `student_dashboard_view` - Student Dashboard
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When student dashboard loads
**Properties**:
```typescript
{
  user_id: string,
  batch_id?: string,
  roadmap_id?: string
}
```
**Description**: Tracks when students view their dashboard.

#### 2. `roadmap_view` - Roadmap Interface
**Location**: `src/components/Roadmap/RoadmapInterface.tsx`
**Trigger**: When roadmap interface loads
**Properties**:
```typescript
{
  user_id: string,
  roadmap_slug: string,
  batch_id?: string,
  viewed_at: string
}
```
**Description**: Tracks when users view roadmap interfaces.

#### 3. `community_view` - Community Page
**Location**: `src/components/Community/CommunityPage.tsx`
**Trigger**: When community page loads
**Properties**:
```typescript
{
  user_id: string,
  viewed_at: string
}
```
**Description**: Tracks when users view the community page.

## User Interaction Events

### Current Implementation

#### 1. `weekly_streak_clicked` - Weekly Streak Click
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When user clicks on a weekly streak indicator
**Properties**:
```typescript
{
  user_id: string,
  week_number: number,
  streak_status: 'done' | 'current' | 'incomplete',
  roadmap_id: string,
  batch_id?: string,
  clicked_at: string
}
```
**Description**: Tracks user engagement with weekly progress indicators.

#### 2. `current_week_task_clicked` - Current Week Task Click
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When user clicks on a current week task
**Properties**:
```typescript
{
  user_id: string,
  task_id: string,
  task_name: string,
  task_type: string,
  week_number: number,
  roadmap_id: string,
  batch_id?: string,
  clicked_at: string
}
```
**Description**: Tracks user engagement with current week tasks.

#### 3. `upcoming_task_clicked` - Upcoming Task Click
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When user clicks on an upcoming task
**Properties**:
```typescript
{
  user_id: string,
  task_id: string,
  task_name: string,
  task_type: string,
  week_number: number,
  roadmap_id: string,
  batch_id?: string,
  clicked_at: string
}
```
**Description**: Tracks user engagement with upcoming tasks.

#### 4. `notice_clicked` - Notice Click
**Location**: `src/components/NoticeBoard/NoticeBoard.tsx`
**Trigger**: When user clicks on a notice
**Properties**:
```typescript
{
  user_id: string,
  notice_id: string,
  notice_title: string,
  notice_tag: string,
  roadmap_id: string,
  batch_id?: string,
  clicked_at: string
}
```
**Description**: Tracks user engagement with notices and announcements.

#### 5. `whatsapp_group_clicked` - WhatsApp Group Click
**Location**: `src/components/Community/CommunityPage.tsx`
**Trigger**: When user clicks on WhatsApp group link
**Properties**:
```typescript
{
  user_id: string,
  group_type: 'community',
  clicked_at: string
}
```
**Description**: Tracks user engagement with community WhatsApp groups.

#### 6. `student_contact_clicked` - Student Contact Click
**Location**: `src/components/Community/CommunityPage.tsx`
**Trigger**: When user clicks on student email or emergency contact
**Properties**:
```typescript
{
  user_id: string,
  contact_type: 'email' | 'phone',
  student_email?: string,
  student_name?: string,
  contact_number?: string,
  contact_purpose?: string,
  clicked_at: string
}
```
**Description**: Tracks user engagement with student contact information.

## Progress Tracking Events

### Current Implementation

#### 1. `week_completed` - Week Completion
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When a week is marked as completed
**Properties**:
```typescript
{
  user_id: string,
  week_number: number,
  roadmap_id: string,
  batch_id?: string,
  completed_at: string,
  completion_percentage: number
}
```
**Description**: Tracks when students complete a full week of tasks.

#### 2. `task_overdue` - Task Overdue
**Location**: `src/components/Student/StudentDashboard.tsx`
**Trigger**: When tasks are detected as overdue
**Properties**:
```typescript
{
  user_id: string,
  overdue_count: number,
  overdue_tasks: Array<{
    task_id: string,
    task_name: string,
    deadline: string,
    days_overdue: number
  }>,
  roadmap_id: string,
  batch_id?: string,
  detected_at: string
}
```
**Description**: Tracks when students have overdue tasks for intervention.

## Engagement Metrics

### **DAU/WAU/MAU Tracking**

#### 1. **Daily Active Users (DAU)**
- **Location**: `StudentDashboard.tsx`
- **Event**: `$pageview`
- **Properties**: `{ page: 'student_dashboard', user_id: string }`
- **Purpose**: Track daily user engagement

#### 2. **Weekly Active Users (WAU)**
- **Location**: `RoadmapInterface.tsx`
- **Event**: `$pageview`
- **Properties**: `{ page: 'roadmap_interface', user_id: string, roadmap_slug: string }`
- **Purpose**: Track weekly user engagement

#### 3. **Monthly Active Users (MAU)**
- **Location**: `CommunityPage.tsx`
- **Event**: `$pageview`
- **Properties**: `{ page: 'community', user_id: string }`
- **Purpose**: Track monthly user engagement

## Event Segments

### User Segments

#### 1. **New Users** (0-7 days)
- Users who signed up in the last 7 days
- Events: `signup_success`, `first_login`, `onboarding_started`

#### 2. **Active Students** (7+ days)
- Users who have completed tasks in the last 30 days
- Events: `task_completed`, `roadmap_view`, `student_dashboard_view`

#### 3. **Mentors**
- Users with mentor role
- Events: `notice_created`, `batch_created`, `student_added`, `mentor_dashboard_view`

#### 4. **Engaged Users** (High Activity)
- Users with 10+ events in the last 30 days
- Events: Multiple interaction events

#### 5. **At-Risk Users** (Low Activity)
- Users with <3 events in the last 30 days
- Events: Low frequency of all events

#### 6. **Overdue Users**
- Users with overdue tasks
- Events: `task_overdue`

#### 7. **Streak Users**
- Users who click on weekly streaks
- Events: `weekly_streak_clicked`

### Feature Segments

#### 1. **Roadmap Users**
- Users who have viewed roadmaps
- Events: `roadmap_view`, `week_completed`

#### 2. **Community Users**
- Users who have accessed community features
- Events: `community_view`

#### 3. **Progress Trackers**
- Users who complete weeks
- Events: `week_completed`, `weekly_streak_clicked`

## Implementation Guidelines

### 1. Event Naming Convention
- Use snake_case for event names
- Be descriptive and specific
- Group related events with prefixes (e.g., `auth_`, `task_`, `roadmap_`)

### 2. Property Guidelines
- Always include `user_id` when available
- Include contextual information (page, component, etc.)
- Use consistent data types for similar properties
- Include timestamps for time-sensitive events

### 3. User Identification
- Identify users on successful login/signup
- Update user properties when profile changes
- Use consistent user identification across all events

### 4. Error Handling
- Always capture error details
- Include context about where the error occurred
- Don't expose sensitive information in error properties

### 5. DAU/WAU/MAU Implementation
- DAU: Track through primary dashboard visits
- WAU: Track through feature-specific page views
- MAU: Track through community and engagement features

## Monitoring & Alerts

### **Key Metrics to Monitor**

| Metric | Calculation | Alert Threshold |
|--------|-------------|-----------------|
| **Auth Success Rate** | `login_success` / (`login_attempt` + `login_success`) | < 90% |
| **Week Completion Rate** | `week_completed` events per week | Monitor trends |
| **Overdue Task Rate** | `task_overdue` frequency | Increasing trend |
| **DAU** | Daily unique users | Monitor growth |
| **WAU** | Weekly unique users | Monitor retention |
| **MAU** | Monthly unique users | Monitor growth |

### **Recommended Dashboards**

1. **User Journey** - Signup → First completion flow
2. **Progress Tracking** - Week completion & overdue trends  
3. **Engagement** - DAU/WAU/MAU patterns
4. **Error Monitoring** - Auth & system error rates

## Future Event Recommendations

### **High Priority**
- `task_started`, `task_paused`, `task_resumed` - Task management
- `video_watched`, `article_read` - Content engagement
- `peer_interaction`, `help_requested` - Social features

### **Medium Priority**  
- `search_performed`, `filter_applied` - Navigation
- `page_load_time`, `api_response_time` - Performance
- `badge_earned`, `level_up` - Gamification

## Implementation Status

### ✅ **Implemented: 20 Events**
- **Authentication**: 9 events
- **Page Views**: 3 events  
- **User Interactions**: 6 events
- **Progress Tracking**: 2 events
- **Engagement Metrics**: 3 events

### 🔄 **Ready for Implementation**
- Task completion tracking
- Content interaction events
- Social feature events
- Performance monitoring events

---

**This documentation provides a complete framework for PostHog event tracking in the 10MS AI GG application, covering authentication, user interactions, progress tracking, and engagement metrics.**

## Active Learning Events (DeckPlayer)

#### 1. `deck_session_started`
**Location**: `src/components/Student/DeckPlayer.tsx`
**Trigger**: When a student starts a flashcard deck session
**Properties**:
- `deck_id`: string
- `deck_title`: string
- `total_cards`: number

#### 2. `deck_card_viewed`
**Location**: `src/components/Student/DeckPlayer.tsx`
**Trigger**: When a student views a specific card
**Properties**:
- `deck_id`: string
- `card_id`: string
- `card_index`: number

#### 3. `deck_card_answered`
**Location**: `src/components/Student/DeckPlayer.tsx`
**Trigger**: When a student submits an answer for a card
**Properties**:
- `deck_id`: string
- `card_id`: string
- `is_correct`: boolean
- `time_spent_ms`: number

#### 4. `deck_session_completed`
**Location**: `src/components/Student/DeckPlayer.tsx`
**Trigger**: When a student finishes a deck session
**Properties**:
- `deck_id`: string
- `score`: number
- `total_cards`: number
- `accuracy`: number
- `total_time_ms`: number

## Social Learning Events (DiscussionBoard)

#### 1. `discussion_board_viewed`
**Location**: `src/components/Discussion/DiscussionBoard.tsx`
**Trigger**: When a user views a discussion board
**Properties**:
- `entity_type`: string
- `entity_id`: string

#### 2. `discussion_post_created`
**Location**: `src/components/Discussion/DiscussionBoard.tsx`
**Trigger**: When a user creates a new discussion post
**Properties**:
- `entity_type`: string
- `entity_id`: string
- `has_attachment`: boolean

#### 3. `discussion_reply_created`
**Location**: `src/components/Discussion/DiscussionThread.tsx`
**Trigger**: When a user replies to a discussion thread
**Properties**:
- `parent_id`: string

## Gamification Events (Certificates/Profile)

#### 1. `profile_viewed`
**Location**: `src/components/Student/StudentProfile.tsx`
**Trigger**: When a user views a profile
**Properties**:
- `target_user_id`: string
- `is_own_profile`: boolean

#### 2. `certificate_viewed`
**Location**: `src/components/Student/Certificates/CertificateCard.tsx`
**Trigger**: When a user views a certificate
**Properties**:
- `certificate_id`: string
- `course_name`: string

#### 3. `certificate_downloaded`
**Location**: `src/components/Student/Certificates/CertificateCard.tsx`
**Trigger**: When a user downloads a certificate
**Properties**:
- `certificate_id`: string
- `course_name`: string

#### 4. `certificate_shared`
**Location**: `src/components/Student/Certificates/CertificateCard.tsx`
**Trigger**: When a user shares a certificate
**Properties**:
- `certificate_id`: string
- `course_name`: string
- `platform`: 'linkedin' | 'link'

## Mentorship Events

#### 1. `mentor_dashboard_viewed`
**Location**: `src/components/Mentor/MentorDashboard.tsx`
**Trigger**: When a mentor views their dashboard
**Properties**: (none)

#### 2. `mentor_session_scheduled`
**Location**: `src/components/Mentor/ScheduleSessionModal.tsx`
**Trigger**: When a mentor schedules a live session
**Properties**:
- `mentor_id`: string
- `batch_id`: string
- `session_type`: string
- `topic`: string

## Granular Task Engagement Events

#### 1. `task_started`
**Location**: `src/components/Roadmap/NodeContentPanel.tsx`
**Trigger**: When a user clicks on an external task link
**Properties**:
- `task_id`: string
- `task_name`: string
- `task_type`: string
- `roadmap_id`: string

#### 2. `task_completed`
**Location**: `src/components/Roadmap/NodeContentPanel.tsx`
**Trigger**: When a user confirms a task as completed
**Properties**:
- `task_id`: string
- `task_name`: string
- `task_type`: string
- `roadmap_id`: string
