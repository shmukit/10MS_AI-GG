# Roadmap Slides — PRD

Optional instructor slide decks (PDF / Google Slides / PPT link) per roadmap, with **per-cohort enablement**. Built externally; embedded in the student roadmap experience.

## Problem

Workshop facilitators build decks in PowerPoint or Google Slides. Participants need one place to follow the session agenda **and** open slides without leaving the platform. Different cohorts may need different decks from the same program.

## Solution (v2)

- Mentors manage a **resource library** on each roadmap: multiple slide decks + decision trees.
- Mentors enable/disable which resources each **batch (cohort)** sees.
- Students see **View Slides** only for decks enabled for their cohort.
- Multiple decks → picker modal; single deck → opens directly.
- Legacy `roadmaps.slides_url` still works as fallback when no catalog entries exist.

## Supported URLs

| Source | Example | Viewer |
| ------ | ------- | ------ |
| PDF (direct link) | `https://…/deck.pdf` | Page-by-page with prev/next + zoom |
| Google Drive PDF | Share link to PDF file | Normalized to download URL |
| Google Slides | Publish or `/presentation/d/…/edit` | Embedded iframe + zoom |
| PPT/PPTX URL | Public file URL | Google Docs viewer iframe + zoom |

**Recommendation:** Export workshop deck to **PDF** or **Google Slides → File → Publish to web** for best results.

## Mentor workflow

1. Build slides externally (PowerPoint, Google Slides, Canva, etc.).
2. Publish: PDF upload to Drive (anyone with link) **or** Google Slides publish URL.
3. **Roadmaps tab → Resource library** → Add deck(s) with title + URL.
4. **Students tab → Create/Edit Batch** → Check which decks this cohort gets.
5. Optional: **Duplicate** roadmap to reuse curriculum + resource catalog for a new program.

## Student UX

```
Roadmap page top bar
├── Back to Dashboard
└── [View Slides ▾]   ← when ≥1 deck enabled for cohort

Multiple decks → picker → modal viewer
Single deck    → modal viewer directly
```

Modal: title + close (×), toolbar (← → | zoom), PDF pages or embedded presentation.

## Data model

**Catalog (roadmap level):**

- `roadmap_slide_decks` — title, slides_url, sort_order, is_default_enabled
- `roadmap_decision_trees` — title, tree_key, sort_order, is_default_enabled

**Cohort selection:**

- `batch_slide_decks` — batch_id + slide_deck_id + is_enabled
- `batch_decision_trees` — batch_id + decision_tree_id + is_enabled

**Legacy fallback:**

- `roadmaps.slides_url` — used when catalog is empty

Migrations (run in order):

1. [`sql/20260722_roadmap_resource_catalog.sql`](../sql/20260722_roadmap_resource_catalog.sql)
2. [`sql/20260722_batch_resource_enablement.sql`](../sql/20260722_batch_resource_enablement.sql)
3. [`sql/20260722_migrate_roadmap_resources_from_legacy.sql`](../sql/20260722_migrate_roadmap_resources_from_legacy.sql)
4. [`sql/20260722_roadmap_resource_rls.sql`](../sql/20260722_roadmap_resource_rls.sql)

## Code

| Path | Role |
| ---- | ---- |
| `src/components/Roadmap/RoadmapSlidesModal.tsx` | Modal viewer |
| `src/components/Roadmap/RoadmapInterface.tsx` | View Slides CTA + deck picker + batch resolution |
| `src/utils/slidesUtils.ts` | URL normalize + mode detection |
| `src/components/Mentor/tabs/roadmap/RoadmapResourcesPanel.tsx` | Mentor slide deck catalog |
| `src/components/Mentor/tabs/students/BatchResourceToggles.tsx` | Per-cohort enable/disable |
| `src/services/db/roadmapResourceService.ts` | Catalog + batch resolution |

## Related docs

- [MENTOR_FEATURES.md](./MENTOR_FEATURES.md) — mentor configuration
- [STUDENT_FEATURES.md](./STUDENT_FEATURES.md) — student roadmap UX
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — resource tables
- [WORKSHOP_ROADMAP_SETUP.md](./WORKSHOP_ROADMAP_SETUP.md) — workshop setup
