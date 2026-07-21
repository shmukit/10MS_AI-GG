# Become a Manager of AI Agents — Setup Guide

Run these scripts in the **Supabase SQL Editor** in order:

1. [`sql/20260721_roadmap_node_unit_label.sql`](../sql/20260721_roadmap_node_unit_label.sql) — adds `node_unit_label` to roadmaps
2. [`sql/20260721_roadmap_slides_url.sql`](../sql/20260721_roadmap_slides_url.sql) — adds optional `slides_url` for instructor decks
3. [`sql/20260721_become_manager_of_ai_agents_roadmap.sql`](../sql/20260721_become_manager_of_ai_agents_roadmap.sql) — seeds the workshop roadmap

## Verify

```sql
SELECT id, title, node_unit_label, total_weeks
FROM roadmaps
WHERE title = 'Become a Manager of AI Agents';

SELECT w.week_number, w.title, COUNT(t.id) AS tasks
FROM roadmap_weeks w
JOIN roadmaps r ON r.id = w.roadmap_id
LEFT JOIN roadmap_tasks t ON t.week_id = w.id
WHERE r.title = 'Become a Manager of AI Agents'
GROUP BY w.week_number, w.title
ORDER BY w.week_number;
```

Expected: **3 sessions**, **20 tasks** total (7 + 6 + 7).

Student URL slug: `/student/roadmap/become_a_manager_of_ai_agents`

Decision tree: embedded on the roadmap page — **Decision Tree** tab, or `/student/roadmap/become_a_manager_of_ai_agents?view=decision-tree`

Standalone route (still works): `/student/playbooks/agentic-decision`

## Placeholder links to replace (before workshop)

Replace `docs.google.com/.../placeholder-*` and `youtube.com/watch?v=placeholder-*` URLs via **Mentor dashboard → Roadmaps** or a forward-fix SQL script.

| Template | Used in |
| -------- | ------- |
| `placeholder-prompt-cheatsheet` | Session 1 — Prompting Properly |
| `placeholder-opportunity-map` | Session 1 — Reflection |
| `placeholder-thinking-brain` | Session 1 — Thinking brain |
| `placeholder-workflow-catalog` | Session 2 — Workflow catalog |
| `placeholder-workflow-canvas` | Session 2 — Breakdown + annotation |
| `placeholder-harness-card` | Session 3 — Harness Card |
| `placeholder-ai-workforce-canvas` | Session 3 — AI workforce |
| `placeholder-failure-lab` | Session 3 — Failure lab |
| `placeholder-capstone-template` | Session 3 — Capstone |
| `placeholder-adoption-plan` | Session 3 — 30-day plan |
| `placeholder-demo-feedback` | Session 3 — Demo day form |

## Instructor slides

After migrations, add your workshop deck via **Mentor dashboard → Roadmaps → Edit Roadmap → Slides URL**.

- **PDF:** Upload to Google Drive → share “Anyone with the link” → paste link
- **Google Slides:** File → Publish to web → paste publish or embed URL

Students then see **View Slides** at the top of the roadmap page. See [ROADMAP_SLIDES.md](./ROADMAP_SLIDES.md).

## Mentor features

- **Node label**: Edit roadmap → set Week / Session / Month / Module / custom
- **Slides URL**: Edit roadmap → optional PDF / Google Slides / PPT link
- **Rename nodes**: Roadmaps tab → Session Nodes panel → Edit
- **Add nodes**: "Add Session" (label follows roadmap setting)

## Optional: assign to a batch

```sql
-- After creating a batch, point it at the workshop roadmap:
-- UPDATE batches SET roadmap_id = (
--   SELECT id FROM roadmaps WHERE title = 'Become a Manager of AI Agents'
-- ) WHERE name = 'Your Workshop Batch Name';
```
