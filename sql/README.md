# Database Scripts

SQL migrations and setup scripts for the 10MS SheSTEM platform.

## Fresh setup (recommended order)

1. **`create_tables.sql`** — base schema, RLS policies, and sample seed data
2. **`security_hardening_2026.sql`** — production security policies
3. **`sync_auth_users.sql`** — trigger to sync `auth.users` → `public.users` on signup
4. Dated migration files (`YYYYMMDD_*.sql`) — apply in chronological order

## Environment

- Run scripts in the **Supabase SQL Editor** (staging first, then production)
- Replace placeholder emails in seed scripts (`admin@example.com`, `mentor@example.com`) with your own test accounts
- Never commit real user data or passwords into SQL files

## Historical operational scripts

One-off fixes and user-specific scripts that were used during internal development are **not included** in this repository. They contained production user PII (emails, phone numbers) and have been removed for privacy compliance.

If you are a team member who needs access to those scripts for reference, check the git history on a private machine before the open source release commit, or contact tech@10minuteschool.com.

## Migration policy

When adding new database changes:

1. Create a **new** dated file: `sql/YYYYMMDD_short_description.sql`
2. Do not edit scripts that were already deployed to production
3. Make scripts idempotent where possible (`DROP POLICY IF EXISTS`, etc.)
4. Add commented verification queries at the bottom

See [`.cursor/rules/sql-migrations.mdc`](../.cursor/rules/sql-migrations.mdc) for full policy.
