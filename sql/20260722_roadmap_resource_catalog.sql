-- Roadmap resource catalog: multiple slide decks and decision trees per roadmap.
-- Forward-fix: extends roadmaps.slides_url and decision_tree_enabled with a proper catalog.

CREATE TABLE IF NOT EXISTS public.roadmap_slide_decks (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slides_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default_enabled BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.roadmap_decision_trees (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  tree_key VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default_enabled BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  UNIQUE (roadmap_id, tree_key)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_slide_decks_roadmap_id
  ON public.roadmap_slide_decks(roadmap_id);

CREATE INDEX IF NOT EXISTS idx_roadmap_decision_trees_roadmap_id
  ON public.roadmap_decision_trees(roadmap_id);

COMMENT ON TABLE public.roadmap_slide_decks IS
  'Slide deck catalog attached to a roadmap. Cohorts enable subsets via batch_slide_decks.';

COMMENT ON TABLE public.roadmap_decision_trees IS
  'Decision tree catalog attached to a roadmap. tree_key maps to in-app playbook registry.';

DROP TRIGGER IF EXISTS update_roadmap_slide_decks_updated_at ON public.roadmap_slide_decks;
CREATE TRIGGER update_roadmap_slide_decks_updated_at
  BEFORE UPDATE ON public.roadmap_slide_decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roadmap_decision_trees_updated_at ON public.roadmap_decision_trees;
CREATE TRIGGER update_roadmap_decision_trees_updated_at
  BEFORE UPDATE ON public.roadmap_decision_trees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verification:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('roadmap_slide_decks', 'roadmap_decision_trees');
