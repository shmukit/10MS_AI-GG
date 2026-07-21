-- Per-roadmap opt-in for embedded AI agent decision tree (student tab).
-- Default false: other roadmaps are unaffected until a mentor enables it.

ALTER TABLE roadmaps
ADD COLUMN IF NOT EXISTS decision_tree_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN roadmaps.decision_tree_enabled IS
  'When true, students see the Decision Tree tab on this roadmap. Off by default.';

-- Enable for the workshop roadmap if it already exists.
UPDATE roadmaps
SET decision_tree_enabled = true
WHERE title = 'Become a Manager of AI Agents';

-- Verification:
-- SELECT title, decision_tree_enabled, slides_url FROM roadmaps ORDER BY title;
