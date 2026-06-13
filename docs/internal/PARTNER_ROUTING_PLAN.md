# Partner Email → Roadmap Routing — Known Limitation & Future Plan

**Status:** Deferred (not blocking open source release)  
**Last updated:** 2026-06-13

---

## Current state (intentional for now)

When a student signs up or is assigned to a batch, the app can **auto-route** users whose email matches configured partner domains to a roadmap whose title/description contains a configured keyword.

Configuration (optional — feature is **off** if unset):

```env
VITE_PARTNER_EMAIL_DOMAINS=10minuteschool.com,lightcastlepartners.com
VITE_PARTNER_ROADMAP_KEYWORD=augmedix
```

These are read at **build time** via Vite (`import.meta.env`) and baked into the frontend bundle, same as other `VITE_*` vars.

### What this is *not*

This is **not** a multi-partner routing system. It preserves a **single-partner hack** from early production:

| Old hardcoded behaviour (removed from source) | Env var replacement |
| --------------------------------------------- | ------------------- |
| Email contains `@10minuteschool.com` or `@lightcastlepartners.com` | `VITE_PARTNER_EMAIL_DOMAINS` (comma-separated list) |
| Search roadmaps for title containing `"augmedix"` | `VITE_PARTNER_ROADMAP_KEYWORD` |

**Why "augmedix" appears in DevOps notes:** that was the only partner program using this auto-assignment path in production at the time of the open source refactor. It does **not** mean the platform only supports one partner — it means **this env-based mechanism only supports one domain-group → one keyword → one roadmap**.

**Decision (2026-06-13):** Externalize the hack into env vars for OSS (remove 10MS-specific strings from git). Do **not** redesign multi-partner routing as part of the open source release. Track a proper mapping system as follow-up work.

---

## How it works today

### 1. Partner detection — `src/config/partnerConfig.ts`

- Parses `VITE_PARTNER_EMAIL_DOMAINS` into a list.
- `isPartnerEmail(email)` returns true if the email contains `@<domain>` for any configured domain.
- If the domain list is **empty**, partner logic is disabled everywhere.

### 2. Batch auto-assignment — `src/services/db/batch/batchAssignments.ts`

When `assignUserToAvailableBatch(userId)` runs:

1. If `isPartnerEmail(user.email)`:
   - Search active roadmaps where title ILIKE `%<keyword>%`.
   - Fallback: search title/description for keyword; then fallback to first AI/ML roadmap.
2. Prefer an active batch on that roadmap; otherwise use default batch assignment.

### 3. Dashboard batch prioritization — `src/services/db/dashboardService.ts`

If a partner user is enrolled in **multiple** batches and no batch is explicitly selected:

1. Prefer batch whose name or roadmap title contains `VITE_PARTNER_ROADMAP_KEYWORD`.
2. Else prefer AI/ML roadmap batch.
3. Else prefer non-Python roadmap.
4. Else first enrolled batch.

### 4. Roadmap list ordering — `src/services/db/roadmapService.ts`

If a partner user has multiple enrolled roadmaps, sort with hardcoded priority scoring:

- `augmedix` in title/description → highest (score 4) — **still hardcoded, not env-driven**
- AI/ML keywords → score 3
- Python → score 1 (lowest for "company" users)

This is **inconsistent** with the env-based keyword elsewhere and is leftover technical debt.

---

## Known problems

| Issue | Impact |
| ----- | ------ |
| One keyword for all partner domains | Cannot map `partner-a.com` → Roadmap A and `partner-b.com` → Roadmap B |
| Keyword search is fuzzy (ILIKE / includes) | Wrong roadmap if titles overlap (e.g. two roadmaps mention "AI") |
| Env vars baked into frontend bundle | Domains/keyword visible in built JS; not suitable for secret routing rules |
| Variable names still say "partner" but logic says "company user" | Confusing code comments (`augmedixRoadmap`, `isCompanyUser`) |
| `roadmapService.ts` still hardcodes `augmedix` in sort scoring | Partial migration — behaviour diverges if keyword env is changed |
| Fallback to AI/ML/Python heuristics | Magic behaviour unrelated to explicit partner config |

---

## What was done in open source prep

- Created `src/config/partnerConfig.ts` with `isPartnerEmail()` and `partnerConfig`
- Removed hardcoded `@10minuteschool.com`, `@lightcastlepartners.com`, and inline `"augmedix"` search from `batchAssignments.ts` and `dashboardService.ts`
- Documented optional vars in `.env.example`, `README.md`, `CONTRIBUTING.md`
- **Did not** implement multi-partner mapping or remove all Augmedix-specific heuristics

---

## Future plan: proper multi-partner routing

### Phase 1 — Consistency cleanup (P1)

- [ ] Use `partnerConfig.roadmapKeyword` in `roadmapService.ts` sort scoring instead of hardcoded `augmedix`
- [ ] Rename variables/comments: `augmedixRoadmap` → `partnerRoadmap`, `isCompanyUser` → `isPartnerUser`
- [ ] Remove or gate AI/ML/Python fallback heuristics behind explicit config (or document as intentional defaults)

### Phase 2 — Database-driven mapping (P1)

- [ ] New table, e.g. `partner_routing_rules`:

  | column | type | notes |
  | ------ | ---- | ----- |
  | `email_domain` | text | e.g. `augmedix.com` |
  | `roadmap_id` | uuid FK | explicit target, no fuzzy search |
  | `priority` | int | when multiple rules could match |
  | `is_active` | bool | soft disable |

- [ ] RLS: readable by authenticated users (or service only); writable by admins
- [ ] Replace env-based keyword search with DB lookup in `batchAssignments.ts` and dashboard prioritization
- [ ] Migration SQL under `sql/YYYYMMDD_partner_routing_rules.sql`

### Phase 3 — Admin UI (P2)

- [ ] Mentor/admin screen to manage domain → roadmap mappings
- [ ] Optional: assign default batch per rule (not just roadmap)
- [ ] Audit log for rule changes

### Phase 4 — Server-side routing (P2)

- [ ] Move auto-assignment to Edge Function or RPC using service role (routing rules not in client bundle)
- [ ] Trigger on signup / invite acceptance, not only on client-side batch assignment

### Phase 5 — Remove env hack (P3)

- [ ] Deprecate `VITE_PARTNER_EMAIL_DOMAINS` and `VITE_PARTNER_ROADMAP_KEYWORD`
- [ ] Remove from SSM, `.env.example`, smoke test required-var list (or mark optional permanently)
- [ ] Update CHANGELOG with migration guide for forks using the old env vars

---

## Alternative: disable auto-routing entirely

If manual mentor assignment is sufficient:

- [ ] Remove partner env vars from production SSM
- [ ] Delete or no-op partner branches in `batchAssignments.ts`, `dashboardService.ts`, `roadmapService.ts`
- [ ] Keep `partnerConfig.ts` as optional extension point for forks, or remove in a major version

This is valid for deployments with **multiple partners** where fuzzy keyword matching causes more harm than good.

---

## Files involved (when work starts)

| File | Role today | Change needed |
| ---- | ---------- | ------------- |
| `src/config/partnerConfig.ts` | Env parsing + `isPartnerEmail()` | Replace with DB client or remove |
| `src/services/db/batch/batchAssignments.ts` | Auto-assign partner users to keyword-matched roadmap | Use DB rule lookup |
| `src/services/db/dashboardService.ts` | Prioritize partner batch on dashboard | Use DB rule lookup |
| `src/services/db/roadmapService.ts` | Sort roadmaps; **hardcoded augmedix score** | Use config/DB; fix debt |
| `.env.example` | Documents optional hack | Remove after Phase 5 |
| AWS SSM `prod-tenms-ai-gg` | Production values for hack | Remove after Phase 5 |

---

## DevOps note (current production)

Partner routing is **optional**. PostHog rotation is required for OSS; partner vars are not.

**Only add to SSM if you want to preserve today's auto-assignment behaviour:**

```env
VITE_PARTNER_EMAIL_DOMAINS=10minuteschool.com,lightcastlepartners.com
VITE_PARTNER_ROADMAP_KEYWORD=augmedix
```

- **Omit both lines:** app works normally; mentors assign students to batches manually; no automatic Augmedix/company-email routing.
- **Set domains but omit keyword:** partner detection runs but keyword search is empty — unreliable; avoid this state.
- **Forks / new deployments:** use generic placeholders in `.env.example` (`example.com`, `partner`) or leave unset.

---

## Tracking

- Checklist: [OPEN_SOURCE_CHECKLIST.md](../OPEN_SOURCE_CHECKLIST.md) §5, §8, §9
- Related: [PASSWORD_MANAGEMENT_PLAN.md](./PASSWORD_MANAGEMENT_PLAN.md) (same "deferred hack → proper system" pattern)
