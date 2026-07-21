# Roadmap Slides — PRD

Optional instructor slides (PDF / Google Slides / PPT link) per roadmap. Built externally; embedded in the student roadmap experience.

## Problem

Workshop facilitators build decks in PowerPoint or Google Slides. Participants need one place to follow the session agenda **and** open slides without leaving the platform.

## Solution

- Mentors paste a **public slides URL** on the roadmap (create/edit roadmap modal).
- If `slides_url` is empty → **nothing shown** (no button, no empty state).
- If set → students see **View Slides** at the top of `/student/roadmap/{slug}`.
- Click opens a **modal**: previous/next (PDF pages), zoom in/out, close (×).

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
3. Mentor dashboard → **Roadmaps** → **Edit Roadmap** → **Slides URL (optional)** → paste link → save.

## Student UX

```
Roadmap page top bar
├── Back to Dashboard
└── [View Slides]   ← only when slides_url is set

Modal
├── Title + close (×)
├── Toolbar: ← → | zoom − | 100% | zoom +
└── Content: PDF pages OR embedded presentation
```

- **PDF:** Arrow keys and toolbar advance pages.
- **Embed (Slides/PPT):** In-deck navigation; platform zoom scales the iframe.

## Data model

```sql
ALTER TABLE roadmaps ADD COLUMN slides_url TEXT;
```

Migration: [`sql/20260721_roadmap_slides_url.sql`](../sql/20260721_roadmap_slides_url.sql)

## Code

| Path | Role |
| ---- | ---- |
| `src/components/Roadmap/RoadmapSlidesModal.tsx` | Modal viewer |
| `src/components/Roadmap/RoadmapInterface.tsx` | View Slides CTA |
| `src/utils/slidesUtils.ts` | URL normalize + mode detection |
| `src/components/Mentor/tabs/roadmap/RoadmapModal.tsx` | Mentor slides URL field |

## Out of scope (v1)

- File upload to Supabase Storage (URL-only)
- Multiple decks per session
- Slide sync with facilitator “current slide”
- In-app slide authoring

## Related docs

- [MENTOR_FEATURES.md](./MENTOR_FEATURES.md) — mentor configuration
- [STUDENT_FEATURES.md](./STUDENT_FEATURES.md) — student roadmap UX
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — `slides_url` column
- [WORKSHOP_ROADMAP_SETUP.md](./WORKSHOP_ROADMAP_SETUP.md) — workshop setup
