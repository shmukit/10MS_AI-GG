-- Add optional instructor slides URL (PDF, Google Slides, or PPT link) per roadmap.
-- Forward-fix: run after sql/20260721_roadmap_node_unit_label.sql

ALTER TABLE roadmaps
  ADD COLUMN IF NOT EXISTS slides_url TEXT;

COMMENT ON COLUMN roadmaps.slides_url IS
  'Optional URL to workshop slides (PDF, Google Slides publish/embed, or PPT). When set, students see a View Slides CTA on the roadmap page.';

-- Verification
-- SELECT id, title, slides_url FROM roadmaps WHERE slides_url IS NOT NULL;
