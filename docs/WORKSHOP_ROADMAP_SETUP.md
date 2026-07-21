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
