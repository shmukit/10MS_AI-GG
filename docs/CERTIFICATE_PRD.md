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
2. Selects a student (or multiple students) who have completed 2 Zoom sessions.
3. Clicks on "Issue Certificate".
4. A modal appears showing the student's pre-filled name. The Admin can edit this name if corrections or full names are needed before issuance. Email address is specifically hidden to keep the UI clean.
5. The Admin clicks "Issue Certificate". The system automatically reads the `public/shestem_certificate_template.png` template, perfectly draws the confirmed student name in a cursive signature font using HTML5 Canvas, and uploads it to Supabase Storage.
6. The system generates a certificate record for the student in the database linking to the generated PNG URL.
7. The system automatically dispatches a direct, high-priority notification to that specific student's Notice Board alerting them that their certificate has been issued.

### 3.2 Mentor/Admin Flow (Revoking & Viewing Status)
1. Admin/Mentor navigates to the User Management dashboard.
2. Students who have been issued a certificate display a small blue "Award" icon/badge next to their name in the user list.
3. Selects a student who has been issued a certificate.
4. Clicks on "Manage Certificates" in the action menu.
5. A modal appears showing all issued certificates for that student.
6. Admin clicks the "Trash" icon to immediately revoke it. The system deletes the database record and removes the generated PNG from Supabase storage.

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
- **UAC 1:** An Admin/Mentor can manually issue a certificate to a student.
- **UAC 2:** An Admin/Mentor is presented with an editable text input to correct or complete the student's name before the certificate is generated. No email ID is displayed in the modal.
- **UAC 3:** When issued, the student receives an automatic, targeted notification in their dashboard alerting them of the new certificate.
- **UAC 4:** A student can view their issued certificate(s) on their profile platform under "My Certificates & Achievements".
- **UAC 5:** The certificate dynamically overlays the student's final confirmed name onto the provided template (PNG/PDF).
- **UAC 4:** Each certificate has a unique, publicly accessible URL (e.g., `app.domain.com/certificate/:uuid`).
- **UAC 5:** The public URL displays correctly with OG meta tags so that when shared on LinkedIn, a nice preview of the certificate is shown.
- **UAC 6:** The certificate page has functional CTAs to Download, Share, and Copy Link.
- **UAC 7:** An Admin/Mentor can view a list of a student's issued certificates and immediately revoke/delete them.
- **UAC 8:** The student's name is rendered in an elegant cursive font (e.g., "Great Vibes" or "Dancing Script") centered exactly above the blue line in the template.

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

### APIs Needed (Supabase RPCs or direct DB operations)
- `issue_certificate(student_id, type)`: Issues a certificate.
- `get_my_certificates()`: Fetches certificates for the logged-in student.
- `get_public_certificate(id)`: Fetches certificate details for public viewing without auth.
