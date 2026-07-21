-- Per-cohort enablement for roadmap slide decks and decision trees.

CREATE TABLE IF NOT EXISTS public.batch_slide_decks (
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  slide_deck_id UUID NOT NULL REFERENCES public.roadmap_slide_decks(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (batch_id, slide_deck_id)
);

CREATE TABLE IF NOT EXISTS public.batch_decision_trees (
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  decision_tree_id UUID NOT NULL REFERENCES public.roadmap_decision_trees(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (batch_id, decision_tree_id)
);

CREATE INDEX IF NOT EXISTS idx_batch_slide_decks_batch_id
  ON public.batch_slide_decks(batch_id);

CREATE INDEX IF NOT EXISTS idx_batch_decision_trees_batch_id
  ON public.batch_decision_trees(batch_id);

COMMENT ON TABLE public.batch_slide_decks IS
  'Which slide decks are active for a cohort. Missing rows fall back to is_default_enabled on catalog.';

COMMENT ON TABLE public.batch_decision_trees IS
  'Which decision trees are active for a cohort. Missing rows fall back to is_default_enabled on catalog.';

DROP TRIGGER IF EXISTS update_batch_slide_decks_updated_at ON public.batch_slide_decks;
CREATE TRIGGER update_batch_slide_decks_updated_at
  BEFORE UPDATE ON public.batch_slide_decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_batch_decision_trees_updated_at ON public.batch_decision_trees;
CREATE TRIGGER update_batch_decision_trees_updated_at
  BEFORE UPDATE ON public.batch_decision_trees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verification:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name IN ('batch_slide_decks', 'batch_decision_trees');
