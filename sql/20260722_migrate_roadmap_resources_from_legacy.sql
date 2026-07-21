-- Migrate legacy roadmaps.slides_url and decision_tree_enabled into resource catalog.
-- Prerequisite: run 20260722_roadmap_resource_catalog.sql and 20260722_batch_resource_enablement.sql
-- Idempotent: skips rows that already exist.

-- Ensure legacy columns exist (may already be present from prior migrations)
ALTER TABLE public.roadmaps
  ADD COLUMN IF NOT EXISTS slides_url TEXT;

ALTER TABLE public.roadmaps
  ADD COLUMN IF NOT EXISTS decision_tree_enabled BOOLEAN NOT NULL DEFAULT false;

-- Slide decks from legacy slides_url
INSERT INTO public.roadmap_slide_decks (roadmap_id, title, slides_url, sort_order, is_default_enabled, is_active)
SELECT
  r.id,
  'Main deck',
  r.slides_url,
  0,
  true,
  true
FROM public.roadmaps r
WHERE r.slides_url IS NOT NULL
  AND trim(r.slides_url) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_slide_decks sd
    WHERE sd.roadmap_id = r.id AND sd.slides_url = r.slides_url
  );

-- Decision trees from legacy decision_tree_enabled
INSERT INTO public.roadmap_decision_trees (roadmap_id, title, tree_key, sort_order, is_default_enabled, is_active)
SELECT
  r.id,
  'AI agent decision tree',
  'agentic',
  0,
  true,
  true
FROM public.roadmaps r
WHERE r.decision_tree_enabled = true
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_decision_trees dt
    WHERE dt.roadmap_id = r.id AND dt.tree_key = 'agentic'
  );

-- Seed batch junction rows for all catalog items on each batch (preserve current behavior)
INSERT INTO public.batch_slide_decks (batch_id, slide_deck_id, is_enabled)
SELECT b.id, sd.id, true
FROM public.batches b
JOIN public.roadmap_slide_decks sd ON sd.roadmap_id = b.roadmap_id
WHERE sd.is_active = true
ON CONFLICT (batch_id, slide_deck_id) DO NOTHING;

INSERT INTO public.batch_decision_trees (batch_id, decision_tree_id, is_enabled)
SELECT b.id, dt.id, true
FROM public.batches b
JOIN public.roadmap_decision_trees dt ON dt.roadmap_id = b.roadmap_id
WHERE dt.is_active = true
ON CONFLICT (batch_id, decision_tree_id) DO NOTHING;

-- Verification:
-- SELECT r.title, count(sd.id) AS slide_decks, count(dt.id) AS decision_trees
-- FROM roadmaps r
-- LEFT JOIN roadmap_slide_decks sd ON sd.roadmap_id = r.id
-- LEFT JOIN roadmap_decision_trees dt ON dt.roadmap_id = r.id
-- GROUP BY r.id, r.title
-- ORDER BY r.title;
