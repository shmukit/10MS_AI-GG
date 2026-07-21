# Product Requirements Document (PRD): Certificate Feature

## 1. Background / Context
There is a new requirement from LCP to provide certificates to students who complete at least 2 live Zoom sessions. 
Upon investigation, the platform currently tracks scheduled `live_sessions` (with a Zoom link), but does **not** track student attendance automatically. Therefore, until automated Zoom attendance tracking is implemented via Zoom Webhooks/API, certificates will be issued **manually** to students. 
Irrespective of the automation, the platform needs a foundational Certificate feature to generate, display, and share SheSTEM certificates.

## 2. Objective
Enable the platform to issue certificates to students, displaying a dynamic certificate image (with their name) and providing a unique, public URL for external sharing.

## 3. User Flow
### 3.1 Mentor/Admin Flow (Manual Issuance)
1. Admin/Mentor navigates to the User Management or Batch Management dashboard.
2. Selects a student who has completed 2 Zoom sessions for a **specific batch enrollment**.
3. Clicks on "Issue Certificate".
4. A modal appears showing:
   - **Cohort selector** (batch · roadmap) when the student is enrolled in multiple batches; auto-selected when there is only one enrollment.
   - The student's pre-filled name (editable). Email is hidden to keep the UI clean.
5. The Admin clicks "Issue Certificate". The system reads `public/shestem_certificate_template.png`, draws the confirmed name on canvas, and uploads to Supabase Storage.
6. The system creates a certificate record linked to the student **and their batch/roadmap enrollment** (`batch_id`, `roadmap_id`, plus cohort labels in `metadata`).
7. A targeted notification is sent to the student mentioning which cohort the certificate is for.

**Constraints:**
- One certificate per student **per batch** (enforced by DB unique index when `batch_id` is set).
- Students with no batch enrollment cannot receive a certificate until assigned to a batch.

### 3.2 Mentor/Admin Flow (Revoking & Viewing Status)
1. Admin/Mentor navigates to the User Management dashboard.
2. Students with at least one issued certificate show an **Award** badge next to their name (tooltip lists each cohort and issue date when multiple exist).
3. Selects a student and clicks **Manage Certificates** in the action menu.
4. A modal shows:
   - **Enrollments** — each batch · roadmap with issued / not issued status.
   - **Issued certificates** — list with cohort label, preview, public link, and revoke action.
5. Admin revokes via the trash icon; the DB record and storage PNG are deleted (ConfirmDialog, not native `confirm()`).

### 3.3 Student Flow (Viewing & Sharing)
1. Student logs into the platform.
2. Navigates to a "Certificates" or "Achievements" tab in their profile.
3. Sees the issued SheSTEM certificate.
4. The certificate view includes:
   - A visual render of the certificate with their name placed dynamically.
   - **CTA: Download** (Downloads as PNG).
   - **CTA: LinkedIn Share** (Opens LinkedIn post creation with the URL).
   - **CTA: Email Share** (Opens default mail client to share the certificate link).
   - **CTA: Copy Link** (Copies the unique public URL to the clipboard).
   - *Note: This section is displayed at the bottom of the `StudentProfile.tsx` page under "My Certificates & Achievements".*
5. When a non-authenticated user visits the unique public URL, they see a public verification page displaying the certificate, student name, and metadata (OpenGraph tags for rich previews on social media).

## 4. User Acceptance Criteria (UAC)
- **UAC 1:** An Admin/Mentor can manually issue a certificate to a student for a chosen batch enrollment.
- **UAC 2:** When a student has multiple batch enrollments, the issue modal requires selecting the cohort (batch · roadmap) before issuance.
- **UAC 3:** An Admin/Mentor is presented with an editable text input to correct or complete the student's name before the certificate is generated. No email ID is displayed in the modal.
- **UAC 4:** When issued, the student receives an automatic, targeted notification naming the cohort the certificate belongs to.
- **UAC 5:** A student can view all issued certificate(s) on their profile under "My Certificates & Achievements", each labeled with batch · roadmap context.
- **UAC 6:** The certificate dynamically overlays the student's final confirmed name onto the provided template (PNG).
- **UAC 7:** Each certificate has a unique, publicly accessible URL (e.g., `app.domain.com/certificate/:uuid`).
- **UAC 8:** The public URL displays cohort context (batch · roadmap) and OG-friendly metadata for social sharing.
- **UAC 9:** The certificate page has functional CTAs to Download, Share, and Copy Link.
- **UAC 10:** An Admin/Mentor can view enrollments vs issued certificates per cohort and revoke individual certificates.
- **UAC 11:** Duplicate issuance for the same student + batch is blocked (UI and database).
- **UAC 12:** The student's name is rendered in an elegant cursive font centered above the blue line in the template.

## 5. Technical Requirements & Dynamic Generation Approach
Since the certificate template is provided in PNG/Canva format, we will use the **PNG template** as the base.
- **Generation Approach:** 
  - **Frontend Canvas Rendering + Storage Upload:** When the Mentor issues the certificate, the browser loads the `public/shestem_certificate_template.png` into an HTML5 `<canvas>`. It calculates the center coordinates and a `0.58` Y-axis percentage to perfectly align the name on the blue line. It draws the text using a cursive font, flattens the image into a PNG Blob, and uploads it directly to the `certificates` Supabase storage bucket. The resulting URL is saved to the database. This guarantees a physical image URL exists for OpenGraph link previews on social media.

## 6. Data Schema / API
We will need a new table in the database to track certificates.

### Table: `student_certificates`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, default gen_random_uuid() | Unique identifier for the certificate |
| `student_id` | `UUID` | Foreign Key (auth.users) | The student receiving the certificate |
| `issued_by` | `UUID` | Foreign Key (auth.users) | Admin/Mentor who issued it |
| `certificate_type` | `VARCHAR` | | e.g., 'SheSTEM_Zoom_Completion' |
| `issued_at` | `TIMESTAMP` | Default NOW() | When it was issued |
| `public_url_slug` | `VARCHAR` | Unique | A unique short slug or just use the ID |
| `image_url` | `TEXT` | Nullable | URL of the generated image in storage (if pre-generated) |
| `batch_id` | `UUID` | FK → `batches(id)`, nullable | Batch enrollment this certificate belongs to |
| `roadmap_id` | `UUID` | FK → `roadmaps(id)`, nullable | Roadmap for the enrollment (denormalized for queries) |
| `metadata` | `JSONB` | Default `{}` | `student_name`, `batch_name`, `roadmap_title`, etc. |

**Indexes:** Unique `(student_id, batch_id)` where `batch_id IS NOT NULL` — one certificate per student per batch.

**Migration:** Run `sql/20260726_certificate_batch_roadmap.sql` in Supabase SQL Editor.

### APIs Needed (Supabase RPCs or direct DB operations)
- `issue_certificate(student_id, type)`: Issues a certificate.
- `get_my_certificates()`: Fetches certificates for the logged-in student.
- `get_public_certificate(id)`: Fetches certificate details for public viewing without auth.
