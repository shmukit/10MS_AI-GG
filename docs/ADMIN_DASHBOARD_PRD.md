# Admin Dashboard PRD

## 1. Overview
The Admin Dashboard provides a centralized interface for platform administrators to manage users (Mentors, Students, Admins), batches, and content. The initial MVP will focus on User Management, specifically the ability to add and remove Mentors and other Admins.

## 2. User Roles
- **Admin**: Has full access to all dashboard features.
- **Mentor**: Access to Mentor Dashboard (managed by Admin).
- **Student**: Access to Student Dashboard (managed by Admin/Mentor).

## 3. Scope & Phasing

### Phase 1: MVP (Current Focus)
- **Authentication & Routing**:
    - Secure access to `/admin` routes.
    - Role-based redirection (Admins -> Admin Dashboard).
- **Navigation**:
    - Sidebar navigation for Admin sections.
- **User Management**:
    - View list of all users.
    - Filter users by role (Student, Mentor, Admin).
    - **Add Mentor/Admin**: functionality to invite or create new Mentor/Admin accounts.
    - **Remove/Deactivate User**: Ability to deactivate or delete users.

### Phase 2: Enhanced Management (Suggested)
- **Batch Management**: Create, edit, archive batches. Assign mentors to batches.
- **Content Management**: Editor for Roadmaps, Weeks, and Tasks.
- **Notice Board**: Post system-wide or batch-specific notices.
- **Analytics Overview**: High-level stats (Total Students, Active Batches, etc.).

## 4. Functional Requirements (MVP)

### 4.1. Dashboard Layout
- Consistent with existing Mentor/Student dashboards.
- Sidebar with links: "Overview", "User Management".

### 4.2. User Management
- **User List Table**:
    - Columns: Name, Email, Role, Status (Active/Inactive), Joined Date, Actions.
    - Search bar for filtering by name/email.
    - Filter dropdown for Role.
- **Add User Action**:
    - Modal/Form to input: Email, First Name, Last Name, Role (Mentor/Admin).
    - On submit: Creates user record (likely via Supabase Auth invite or direct DB insertion if using custom auth flow).
- **User Actions**:
    - Edit Role.
    - Deactivate/Re-activate user.

## 5. Technical Considerations
- **Supabase RLS**: Ensure Row Level Security policies allow `admin` role users to `INSERT`, `UPDATE`, `DELETE` on `users` table.
- **Routing**: Add `AdminRoutes` in `App.tsx` and protect with `useAuth` role check.
- **Components**: Reuse existing UI components (`Table`, `Modal`, `Button`, `Input`) where possible.
