-- Forward-fix: ensure Agentic AI decision tree catalog rows exist when slide catalog
-- was migrated but roadmap_decision_trees / batch_decision_trees were missing.
-- Prior scripts: 20260722_workshop_resource_catalog_seed.sql, 20260722_migrate_roadmap_resources_from_legacy.sql

INSERT INTO public.roadmap_decision_trees (roadmap_id, title, tree_key, sort_order, is_default_enabled, is_active)
SELECT r.id, 'Agentic decision tree', 'agentic', 0, true, true
FROM public.roadmaps r
WHERE r.title = 'Become a Manager of AI Agents'
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_decision_trees dt
    WHERE dt.roadmap_id = r.id AND dt.tree_key = 'agentic'
  );

INSERT INTO public.batch_decision_trees (batch_id, decision_tree_id, is_enabled)
SELECT b.id, dt.id, true
FROM public.batches b
JOIN public.roadmaps r ON r.id = b.roadmap_id
JOIN public.roadmap_decision_trees dt ON dt.roadmap_id = r.id AND dt.tree_key = 'agentic'
WHERE r.title = 'Become a Manager of AI Agents'
  AND NOT EXISTS (
    SELECT 1 FROM public.batch_decision_trees bdt
    WHERE bdt.batch_id = b.id AND bdt.decision_tree_id = dt.id
  );

-- Verification:
-- SELECT r.title, dt.title, dt.tree_key, dt.is_default_enabled
-- FROM public.roadmaps r
-- LEFT JOIN public.roadmap_decision_trees dt ON dt.roadmap_id = r.id
-- WHERE r.title = 'Become a Manager of AI Agents';
--
-- SELECT b.name, dt.tree_key, bdt.is_enabled
-- FROM public.batches b
-- JOIN public.roadmaps r ON r.id = b.roadmap_id
-- JOIN public.batch_decision_trees bdt ON bdt.batch_id = b.id
-- JOIN public.roadmap_decision_trees dt ON dt.id = bdt.decision_tree_id
-- WHERE r.title = 'Become a Manager of AI Agents';
