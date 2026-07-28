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
8. **Curriculum sync (Sessions 0–4):** [`sql/20260725_agentic_curriculum_sync_sessions_0_to_4.sql`](../sql/20260725_agentic_curriculum_sync_sessions_0_to_4.sql)  
9. **Less-paste curriculum (Session 1 = 1.1–1.6, no Working Pack):** [`sql/20260725_agentic_curriculum_less_paste_v2.sql`](../sql/20260725_agentic_curriculum_less_paste_v2.sql)  
10. **Embed prompts into roadmap tasks (Copy modal):** [`sql/20260725_agentic_task_prompts_in_roadmap_fix.sql`](../sql/20260725_agentic_task_prompts_in_roadmap_fix.sql)  
   *(Skip the broken `…_task_prompts_in_roadmap.sql` — it errors on `GET DIAGNOSTICS`.)*  
11. Later curriculum tweaks as needed (`0.0`, Session 1 lock-before-tools, serial sync, plain-language rename).  
12. **Simplify task copy (Goal → Steps):** [`sql/20260728_simplify_task_details_leader_ux.sql`](../sql/20260728_simplify_task_details_leader_ux.sql)  
13. **Round task times to 5/10/15/20/30:** [`sql/20260728_round_task_times_to_nice_minutes.sql`](../sql/20260728_round_task_times_to_nice_minutes.sql)  
   Master: [`docs/PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md`](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md)

**Edit prompts later (mentors):** Mentor → Roadmap → edit task → **Task details / student prompt**. Prefer `Goal` + numbered `Steps` + optional `——— COPY BELOW ———` boxes. Students never need WHERE / BECAUSE / ANALOGY in the modal.

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

## Verify (after curriculum sync)

```sql
SELECT id, title, node_unit_label, total_weeks, decision_tree_enabled
FROM roadmaps
WHERE title = 'Become a Manager of AI Agents';

SELECT week_number, title FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = 'Become a Manager of AI Agents'
ORDER BY week_number;

SELECT w.week_number, t.sort_order, t.task_name, t.estimated_hours AS minutes
FROM roadmap_tasks t
JOIN roadmap_weeks w ON w.id = t.week_id
JOIN roadmaps r ON r.id = w.roadmap_id
WHERE r.title = 'Become a Manager of AI Agents'
ORDER BY w.week_number, t.sort_order;
```

Expected after **less_paste_v2** SQL: **`total_weeks = 5`**, sessions **`week_number` 0–4**, Session 1 tasks **`1.1`…`1.6`** only (no 1.7/1.8). See curriculum master.

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

- [PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md](./PRACTICAL_AGENTIC_AI_CURRICULUM_MASTER.md) — task IDs + times (source of truth)
- [PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md](./PRACTICAL_AGENTIC_AI_FACILITATOR_GUIDE.md)
- [PRACTICAL_AGENTIC_AI_PROMPT_PACK.md](./PRACTICAL_AGENTIC_AI_PROMPT_PACK.md)
- [PRACTICAL_AGENTIC_AI_SLIDE_PLAN.md](./PRACTICAL_AGENTIC_AI_SLIDE_PLAN.md)
- [ROADMAP_SLIDES.md](./ROADMAP_SLIDES.md) — slides + cohort toggles
- [MENTOR_FEATURES.md](./MENTOR_FEATURES.md) — duplicate roadmap, resource library
