# Become a Manager of AI Agents — Setup Guide

Run these scripts in the **Supabase SQL Editor** in order:

1. [`sql/20260721_roadmap_node_unit_label.sql`](../sql/20260721_roadmap_node_unit_label.sql)
2. [`sql/20260721_roadmap_slides_url.sql`](../sql/20260721_roadmap_slides_url.sql)
3. [`sql/20260721_roadmap_decision_tree_enabled.sql`](../sql/20260721_roadmap_decision_tree_enabled.sql)
4. [`sql/20260721_become_manager_of_ai_agents_roadmap_rerun.sql`](../sql/20260721_become_manager_of_ai_agents_roadmap_rerun.sql) — workshop seed (self-contained)
5. Resource library (required for multi-deck + cohort toggles):
   - [`sql/20260722_roadmap_resource_catalog.sql`](../sql/20260722_roadmap_resource_catalog.sql)
   - [`sql/20260722_batch_resource_enablement.sql`](../sql/20260722_batch_resource_enablement.sql)
   - [`sql/20260722_migrate_roadmap_resources_from_legacy.sql`](../sql/20260722_migrate_roadmap_resources_from_legacy.sql)
   - [`sql/20260722_roadmap_resource_rls.sql`](../sql/20260722_roadmap_resource_rls.sql)
6. Optional: [`sql/20260722_workshop_resource_catalog_seed.sql`](../sql/20260722_workshop_resource_catalog_seed.sql) — 3 session deck placeholders + agentic tree
7. If the **Decision Tree** tab is missing but slide decks exist: [`sql/20260723_agentic_decision_tree_catalog_fix.sql`](../sql/20260723_agentic_decision_tree_catalog_fix.sql)

## Troubleshooting

### Decision Tree tab missing (partial catalog migration)

**Symptom:** Student roadmap loads sessions, but there is no **Decision Tree** tab even though `decision_tree_enabled = true`.

**Cause:** Slide deck catalog rows exist (`roadmap_slide_decks`) but `roadmap_decision_trees` / `batch_decision_trees` rows were never seeded. The app skips legacy fallback when any catalog row exists.

**Fix:** Run [`sql/20260723_agentic_decision_tree_catalog_fix.sql`](../sql/20260723_agentic_decision_tree_catalog_fix.sql), or enable the tree in **Mentor → Students → batch resources**.

### URL slug vs cohort dropdown mismatch

**Symptom:** URL shows one roadmap slug while the header dropdown shows a different cohort.

**Fix:** Always navigate with matching `?batch_id=` (e.g. `/student/roadmap/become_a_manager_of_ai_agents?batch_id={uuid}`). Switch cohort from the dashboard dropdown before opening Roadmap.

### Practice cards from another roadmap

**Symptom:** Daily review shows unrelated cards (e.g. medical terminology).

**Cause:** Spaced repetition mastery is global unless filtered by roadmap. Cards from other roadmaps appear if the student practiced them before.

**Fix:** App now scopes due cards to the selected roadmap. Clear stale mastery rows in Supabase if demo seed data persists.

## Manual QA checklist (multi-cohort student)

| Scenario | Expected |
|----------|----------|
| Dashboard → select Agentic cohort → Roadmap card | URL includes `batch_id`; dropdown shows Agentic roadmap title |
| Open `/student/roadmap/become_a_manager_of_ai_agents` with wrong `batch_id` | Resolves to Agentic enrollment, not Python cohort |
| Dashboard dropdown open | Menu fully visible (portaled), not clipped by cards |
| Agentic cohort → Practice | No unrelated review cards; decks scoped to roadmap |
| Start daily review / deck | Full-screen overlay, body scroll locked, no flicker |
| Agentic roadmap page | Decision Tree tab visible when enabled for cohort |

## Verify

```sql
SELECT id, title, node_unit_label, total_weeks, decision_tree_enabled
FROM roadmaps
WHERE title = 'Become a Manager of AI Agents';

SELECT sd.title, sd.slides_url, dt.title AS tree_title, dt.tree_key
FROM roadmaps r
LEFT JOIN roadmap_slide_decks sd ON sd.roadmap_id = r.id
LEFT JOIN roadmap_decision_trees dt ON dt.roadmap_id = r.id
WHERE r.title = 'Become a Manager of AI Agents';
```

Expected: **3 sessions**, **20 tasks**, resource catalog rows after optional seed.

Student URL: `/student/roadmap/become_a_manager_of_ai_agents?batch_id={batch_uuid}`

Decision tree: **Decision Tree** tab when enabled for the student's cohort.

## Mentor setup after SQL

1. **Roadmaps tab → Resource library** — add/replace slide deck URLs (Session 1–3).
2. **Students tab → Create batch** — assign roadmap; check which decks/trees this cohort gets.
3. **Duplicate** roadmap if you need a variant program with the same content.

## Placeholder links to replace

Replace task placeholder URLs via **Mentor dashboard → Roadmaps** or forward-fix SQL.

| Template | Used in |
| -------- | ------- |
| `placeholder-prompt-cheatsheet` | Session 1 — Prompting Properly |
| `placeholder-opportunity-map` | Session 1 — Reflection |
| `placeholder-workflow-catalog` | Session 2 — Workflow catalog |
| `placeholder-harness-card` | Session 3 — Harness Card |
| `placeholder-session-1/2/3` | Resource library slide decks (optional seed) |

## Related docs

- [ROADMAP_SLIDES.md](./ROADMAP_SLIDES.md) — slides + cohort toggles
- [MENTOR_FEATURES.md](./MENTOR_FEATURES.md) — duplicate roadmap, resource library
