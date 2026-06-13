# Password Management — Known Limitation & Future Plan

**Status:** Deferred (not blocking open source release)  
**Last updated:** 2026-06-13

---

## Current state (intentional for now)

The mentor dashboard uses a **single shared default password** when adding new students via `upsert_student_user` RPC. The value is read from:

```env
VITE_DEFAULT_STUDENT_PASSWORD=<shared platform default>
```

This is configured in:

- **Local dev:** `.env` / `.env.local`
- **Production:** AWS SSM parameter `prod-tenms-ai-gg` (build-time, baked into the Vite bundle)

### Known problems

| Issue | Impact |
| ----- | ------ |
| One password for all new students | No per-user credential isolation |
| Password visible in mentor UI (auto-filled) | Mentors see the shared default |
| Password baked into frontend bundle | Anyone with browser devtools can read `VITE_*` from built JS |
| No forced reset on first login | Students keep the shared password indefinitely |
| No self-service password change | Students cannot update their own password in-app |

**Decision (2026-06-13):** Keep the current shared-default behaviour for production. Do **not** change the password policy as part of the open source release. Track proper individual password management as a follow-up project.

---

## What was done in open source prep

- Removed hardcoded password string from source code
- Moved value to `VITE_DEFAULT_STUDENT_PASSWORD` env var (still shared, but not in git)
- DevOps sets the **existing production default** in SSM — no password rotation required for this release

---

## Future plan: individual password management

### Phase 1 — Stop exposing password in the frontend (P1)

- [ ] Remove `VITE_DEFAULT_STUDENT_PASSWORD` from the Vite bundle entirely
- [ ] Mentor enters a password per student in the UI (or system generates a one-time random password)
- [ ] Call `upsert_student_user` RPC with mentor-provided password only — never from env
- [ ] Show generated password once with copy-to-clipboard; do not store in client config

### Phase 2 — Server-side user creation (P1)

- [ ] Move student creation to a Supabase Edge Function or backend using **service role key** (never in frontend)
- [ ] Edge function: create auth user + public profile + batch assignment in one transaction
- [ ] RLS + role check: only mentors/admins for their batches can invoke

### Phase 3 — Student self-service (P2)

- [ ] "Change password" in student profile settings
- [ ] "Forgot password" flow via Supabase Auth email reset
- [ ] Optional: force password change on first login (`auth.users` metadata flag)

### Phase 4 — Bulk import & onboarding (P3)

- [ ] CSV import with per-row passwords or invite links
- [ ] Magic-link / invite email instead of shared default
- [ ] Audit log: who created which account, when

### Phase 5 — Security hardening (P3)

- [ ] Password strength validation (min length, complexity)
- [ ] Rate limiting on student creation RPC
- [ ] Remove any legacy SQL/scripts that set bulk shared passwords
- [ ] Security review of `upsert_student_user` RPC permissions

---

## Files involved (when work starts)

| File | Change needed |
| ---- | ------------- |
| `src/components/Mentor/tabs/hooks/useStudentsTab.ts` | Per-student password input; remove env default |
| `sql/secure_rpc_upsert_student_user.sql` | Review permissions; possibly restrict to service role only |
| New: `supabase/functions/create-student/` | Server-side user creation |
| `.env.example` | Remove `VITE_DEFAULT_STUDENT_PASSWORD` after Phase 1 |
| AWS SSM `prod-tenms-ai-gg` | Remove `VITE_DEFAULT_STUDENT_PASSWORD` after Phase 1 |

---

## DevOps note (current production)

Until Phase 1 is implemented, SSM **must** include:

```env
VITE_DEFAULT_STUDENT_PASSWORD=<current shared platform default — unchanged>
```

Use the same value production already uses today. This is **not** a rotation — it preserves existing behaviour after the code moved the secret out of git.

---

## Tracking

- Checklist: [OPEN_SOURCE_CHECKLIST.md](../OPEN_SOURCE_CHECKLIST.md) §8
- Related: [PARTNER_ROUTING_PLAN.md](./PARTNER_ROUTING_PLAN.md) (same "deferred hack → proper system" pattern)
- Related RPC: `sql/secure_rpc_upsert_student_user.sql`
- Auth: Supabase `auth.users` + `public.users` sync via `sync_auth_users.sql`
