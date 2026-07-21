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
    - Role-based redirection (Admins → Admin Dashboard; mentors/students to their dashboards via `roleAccess.ts`).
- **Navigation**:
    - Sidebar navigation for Admin sections (Overview, User Management).
- **User Management**:
    - View list of all users with **Roadmaps** and **Batches** columns (enrollment pills from `student_batch_assignments`).
    - Filter users by role, status, roadmap, and batch.
    - **Add Mentor/Admin**: invite or create accounts via modal.
    - **Deactivate / delete** users with ConfirmDialog.
    - **Issue Certificate**: cohort-aware issuance (batch · roadmap selector for multi-enrollment students).
    - **Manage Certificates**: per-enrollment status + revoke with ConfirmDialog.
    - Award badge on students with certificates (tooltip lists all cohorts when multiple).

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
    - Columns: Name (+ certificate badge), Email, Role, Roadmaps, Batches, Status, Joined Date, Actions.
    - Search bar for filtering by name/email.
    - Filters: Role, Status, Roadmap, Batch.
- **Add User Action**:
    - Modal/Form: Email, First Name, Last Name, Role (Mentor/Admin).
- **User Actions**:
    - Activate / deactivate (ConfirmDialog).
    - Issue Certificate (cohort selector + editable name).
    - Manage Certificates (enrollment matrix + revoke).
    - Delete user (destructive ConfirmDialog).

## 5. Technical Considerations
- **Supabase RLS**: Ensure Row Level Security policies allow `admin` role users to `INSERT`, `UPDATE`, `DELETE` on `users` table.
- **Routing**: Add `AdminRoutes` in `App.tsx` and protect with `useAuth` role check.
- **Components**: Reuse existing UI components (`Table`, `Modal`, `Button`, `Input`) where possible.
