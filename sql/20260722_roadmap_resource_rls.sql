-- RLS for roadmap resource catalog and batch enablement tables.
-- Prerequisite: catalog and batch enablement tables exist.

ALTER TABLE public.roadmap_slide_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_decision_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_slide_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_decision_trees ENABLE ROW LEVEL SECURITY;

-- Slide decks
DROP POLICY IF EXISTS "Roadmap slide decks viewable by authenticated" ON public.roadmap_slide_decks;
CREATE POLICY "Roadmap slide decks viewable by authenticated"
  ON public.roadmap_slide_decks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Roadmap slide decks insertable by staff" ON public.roadmap_slide_decks;
CREATE POLICY "Roadmap slide decks insertable by staff"
  ON public.roadmap_slide_decks FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Roadmap slide decks updatable by staff" ON public.roadmap_slide_decks;
CREATE POLICY "Roadmap slide decks updatable by staff"
  ON public.roadmap_slide_decks FOR UPDATE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Roadmap slide decks deletable by staff" ON public.roadmap_slide_decks;
CREATE POLICY "Roadmap slide decks deletable by staff"
  ON public.roadmap_slide_decks FOR DELETE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

-- Decision trees
DROP POLICY IF EXISTS "Roadmap decision trees viewable by authenticated" ON public.roadmap_decision_trees;
CREATE POLICY "Roadmap decision trees viewable by authenticated"
  ON public.roadmap_decision_trees FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Roadmap decision trees insertable by staff" ON public.roadmap_decision_trees;
CREATE POLICY "Roadmap decision trees insertable by staff"
  ON public.roadmap_decision_trees FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Roadmap decision trees updatable by staff" ON public.roadmap_decision_trees;
CREATE POLICY "Roadmap decision trees updatable by staff"
  ON public.roadmap_decision_trees FOR UPDATE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Roadmap decision trees deletable by staff" ON public.roadmap_decision_trees;
CREATE POLICY "Roadmap decision trees deletable by staff"
  ON public.roadmap_decision_trees FOR DELETE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

-- Batch slide decks
DROP POLICY IF EXISTS "Batch slide decks viewable by authenticated" ON public.batch_slide_decks;
CREATE POLICY "Batch slide decks viewable by authenticated"
  ON public.batch_slide_decks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Batch slide decks insertable by staff" ON public.batch_slide_decks;
CREATE POLICY "Batch slide decks insertable by staff"
  ON public.batch_slide_decks FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Batch slide decks updatable by staff" ON public.batch_slide_decks;
CREATE POLICY "Batch slide decks updatable by staff"
  ON public.batch_slide_decks FOR UPDATE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Batch slide decks deletable by staff" ON public.batch_slide_decks;
CREATE POLICY "Batch slide decks deletable by staff"
  ON public.batch_slide_decks FOR DELETE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

-- Batch decision trees
DROP POLICY IF EXISTS "Batch decision trees viewable by authenticated" ON public.batch_decision_trees;
CREATE POLICY "Batch decision trees viewable by authenticated"
  ON public.batch_decision_trees FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Batch decision trees insertable by staff" ON public.batch_decision_trees;
CREATE POLICY "Batch decision trees insertable by staff"
  ON public.batch_decision_trees FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Batch decision trees updatable by staff" ON public.batch_decision_trees;
CREATE POLICY "Batch decision trees updatable by staff"
  ON public.batch_decision_trees FOR UPDATE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

DROP POLICY IF EXISTS "Batch decision trees deletable by staff" ON public.batch_decision_trees;
CREATE POLICY "Batch decision trees deletable by staff"
  ON public.batch_decision_trees FOR DELETE TO authenticated
  USING ((SELECT is_admin_or_mentor()));

-- Verification:
-- SELECT tablename, policyname FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('roadmap_slide_decks', 'roadmap_decision_trees', 'batch_slide_decks', 'batch_decision_trees');
