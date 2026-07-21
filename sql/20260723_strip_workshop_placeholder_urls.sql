-- Remove broken placeholder URLs from the agentic AI workshop roadmap.
-- Forward-fix after sql/20260721_become_manager_of_ai_agents_roadmap_rerun.sql and
-- sql/20260722_workshop_resource_catalog_seed.sql seeded dummy Google/YouTube links.
-- Keeps real links (ChatGPT, Claude, Perplexity, in-app decision tree path, etc.).
-- Idempotent: safe to re-run.

-- Task links: drop any URL containing "placeholder"
UPDATE public.roadmap_tasks t
SET relevant_links = filtered.links
FROM (
  SELECT
    t2.id,
    COALESCE(
      (
        SELECT array_agg(link ORDER BY ord)
        FROM unnest(t2.relevant_links) WITH ORDINALITY AS u(link, ord)
        WHERE link NOT ILIKE '%placeholder%'
      ),
      ARRAY[]::TEXT[]
    ) AS links
  FROM public.roadmap_tasks t2
  JOIN public.roadmap_weeks w ON w.id = t2.week_id
  JOIN public.roadmaps r ON r.id = w.roadmap_id
  WHERE r.title = 'Become a Manager of AI Agents'
    AND t2.relevant_links IS NOT NULL
) AS filtered
WHERE t.id = filtered.id
  AND t.relevant_links IS DISTINCT FROM filtered.links;

-- Slide decks: deactivate placeholder rows (slides_url is NOT NULL on roadmap_slide_decks)
UPDATE public.roadmap_slide_decks sd
SET
  is_active = false,
  is_default_enabled = false,
  updated_at = NOW()
FROM public.roadmaps r
WHERE sd.roadmap_id = r.id
  AND r.title = 'Become a Manager of AI Agents'
  AND sd.slides_url ILIKE '%placeholder%';

UPDATE public.batch_slide_decks bsd
SET
  is_enabled = false,
  updated_at = NOW()
FROM public.roadmap_slide_decks sd
JOIN public.roadmaps r ON r.id = sd.roadmap_id
WHERE bsd.slide_deck_id = sd.id
  AND r.title = 'Become a Manager of AI Agents'
  AND sd.slides_url ILIKE '%placeholder%';

UPDATE public.roadmaps r
SET slides_url = NULL,
    updated_at = NOW()
WHERE r.title = 'Become a Manager of AI Agents'
  AND r.slides_url ILIKE '%placeholder%';

-- ============ VERIFICATION ============
-- SELECT t.task_name, t.relevant_links
-- FROM public.roadmap_tasks t
-- JOIN public.roadmap_weeks w ON w.id = t.week_id
-- JOIN public.roadmaps r ON r.id = w.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents'
-- ORDER BY w.week_number, t.task_name;

-- SELECT sd.title, sd.slides_url, sd.is_active, sd.is_default_enabled
-- FROM public.roadmap_slide_decks sd
-- JOIN public.roadmaps r ON r.id = sd.roadmap_id
-- WHERE r.title = 'Become a Manager of AI Agents';
