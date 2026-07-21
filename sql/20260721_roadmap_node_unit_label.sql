-- Forward-fix: allow mentors to label roadmap nodes as Week, Session, Month, etc.
-- Run in Supabase SQL Editor before the workshop roadmap seed.

ALTER TABLE roadmaps
  ADD COLUMN IF NOT EXISTS node_unit_label VARCHAR(50) NOT NULL DEFAULT 'Week';

COMMENT ON COLUMN roadmaps.node_unit_label IS
  'Display label for roadmap nodes (e.g. Week, Session, Month, Module). Used in student UI copy.';

-- Verification
-- SELECT id, title, total_weeks, node_unit_label FROM roadmaps ORDER BY created_at DESC LIMIT 10;
