# UX/UI Audit Report — SheSTEM AI-GG (2026)

**Scope:** Student, mentor, and admin surfaces + shared chrome.  
**Benchmark:** `docs/DESIGN_SYSTEM.md`, evolved token spec, premium SaaS UX.  
**Severity:** P0 = broken/confusing · P1 = unpolished · P2 = nice-to-have

---

## Executive summary

The platform has a solid design spec but **~92% of UI bypasses shared primitives**. Two visual skins coexist (token-based vs legacy gray/blue). Trust-breaking fake data, native `alert()`/`confirm()` dialogs, and accessibility gaps block a premium feel.

**Confirmed example bugs:** Completed pill wrap, floating roadmap dot, low-contrast lock copy, Play icon on practice decks, ambiguous leaderboard medals.

---

## Cross-cutting (all roles)

| Pri | Issue | Fix |
|-----|-------|-----|
| P0 | Fake data in production UI | Remove fallbacks; honest empty states |
| P0 | `alert()`/`confirm()` everywhere | Toast + ConfirmDialog |
| P1 | Only 5 files use `ui/Button`, 3 use `ui/Card` | Migrate to primitives |
| P1 | 21 copy-pasted modal shells | Single `ui/Modal` |
| P1 | ~250 `gray-*` hits, hardcoded hex | Semantic tokens |
| P1 | `shadow-sm` at rest on 22 card files | Border only; hover shadow |
| P1 | `backdrop-blur` on 12 files | Solid overlays |
| P1 | Emoji as icons | Lucide icons |
| P2 | No breadcrumbs on deep pages | Add `Breadcrumbs` primitive |

---

## Student surfaces

### Dashboard
- P0: Misleading Play overlay on practice cards (`PracticeDeckList.tsx`)
- P0: Ambiguous medal icons on leaderboard
- P1: No mobile welcome/batch context (`DashboardHeader.tsx`)
- P1: Lock reasons hover-only on tasks (`TasksSection.tsx`)
- P1: Hardcoded mentor "Uttam Deb" (`MentorsSection.tsx`)

### Roadmap
- P0: Completed pill wraps (`RoadmapNode.tsx` L91–94)
- P0: Floating spine dot on mobile (`RoadmapCanvas.tsx` L77)
- P0: Low-contrast lock copy (`RoadmapNode.tsx` L166–168)
- P1: Green gradient avatar + rainbow task colors (`NodeContentPanel.tsx`)
- P1: Six `alert()` calls in node panel

### Profile & Community
- P0: Fake classmates when empty (`StudentCommunity.tsx`)
- P0: Placeholder profile defaults BSc/CS/University (`StudentProfile.tsx`)
- P1: Certificates hidden when empty

### Other
- P1: DeckPlayer no session summary on completion
- P1: Mobile bottom nav wrong user ID for batch data

---

## Mentor surfaces

- P0: Stub routes with placeholder content (`MentorRoadmaps.tsx`, etc.)
- P0: Mobile dashboard largely non-functional (`MentorDashboardMobile.tsx`)
- P0: Draft notices invisible to mentors
- P1: Multiple primary CTAs per toolbar (`RoadmapControls`, `BatchHeader`)
- P1: Hardcoded `/6` week progress
- P1: Tab bar not accessible tablist
- P1: `SharedComponents.Modal` exists but unused

---

## Admin / auth / marketing / chrome

- P0: `/signup` shows login form; no password confirm validation
- P0: Post-login always redirects to student dashboard
- P0: Fake marketing stats `2,500+`, `95%`
- P0: Password field `type="text"` in AddUserModal
- P1: Admin page title always "Admin Dashboard"
- P1: Notice board "1 of 0" when empty
- P1: `TopNavDesktop`/`TopNavMobile` built but never mounted
- P1: Notification "From: Mentor" hardcoded

---

## Systemic fixes (implementation order)

1. Visual tokens + Plus Jakarta Sans + refined neutrals
2. Shared primitives + Toast provider
3. Legacy skin migration
4. P0 trust fixes
5. Student → Mentor → Admin surface passes
6. Cross-cutting a11y + microcopy

See `.cursor/plans/ux_rehaul_and_audit_ee5d7162.plan.md` for wireframes and color spec.
