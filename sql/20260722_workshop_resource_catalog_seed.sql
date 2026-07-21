-- Optional: seed resource catalog for Become a Manager of AI Agents workshop.
-- Prerequisite: run catalog + enablement + migrate scripts first.
-- Mentors replace placeholder slide URLs in the dashboard.

INSERT INTO public.roadmap_decision_trees (roadmap_id, title, tree_key, sort_order, is_default_enabled, is_active)
SELECT r.id, 'AI agent decision tree', 'agentic', 0, true, true
FROM public.roadmaps r
WHERE r.title = 'Become a Manager of AI Agents'
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_decision_trees dt
    WHERE dt.roadmap_id = r.id AND dt.tree_key = 'agentic'
  );

INSERT INTO public.roadmap_slide_decks (roadmap_id, title, slides_url, sort_order, is_default_enabled, is_active)
SELECT r.id, deck.title, deck.slides_url, deck.sort_order, true, true
FROM public.roadmaps r
CROSS JOIN (
  VALUES
    ('Session 1 deck', 'https://docs.google.com/presentation/d/placeholder-session-1', 1),
    ('Session 2 deck', 'https://docs.google.com/presentation/d/placeholder-session-2', 2),
    ('Session 3 deck', 'https://docs.google.com/presentation/d/placeholder-session-3', 3)
) AS deck(title, slides_url, sort_order)
WHERE r.title = 'Become a Manager of AI Agents'
  AND NOT EXISTS (
    SELECT 1 FROM public.roadmap_slide_decks sd
    WHERE sd.roadmap_id = r.id AND sd.title = deck.title
  );

INSERT INTO public.batch_slide_decks (batch_id, slide_deck_id, is_enabled)
SELECT b.id, sd.id, true
FROM public.batches b
JOIN public.roadmaps r ON r.id = b.roadmap_id
JOIN public.roadmap_slide_decks sd ON sd.roadmap_id = r.id
WHERE r.title = 'Become a Manager of AI Agents'
ON CONFLICT (batch_id, slide_deck_id) DO NOTHING;

INSERT INTO public.batch_decision_trees (batch_id, decision_tree_id, is_enabled)
SELECT b.id, dt.id, true
FROM public.batches b
JOIN public.roadmaps r ON r.id = b.roadmap_id
JOIN public.roadmap_decision_trees dt ON dt.roadmap_id = r.id
WHERE r.title = 'Become a Manager of AI Agents'
ON CONFLICT (batch_id, decision_tree_id) DO NOTHING;

-- Verification:
-- SELECT sd.title, sd.slides_url FROM roadmap_slide_decks sd
-- JOIN roadmaps r ON r.id = sd.roadmap_id WHERE r.title = 'Become a Manager of AI Agents';
