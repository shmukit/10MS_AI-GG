-- Step 2: Create Week 1 and its tasks
-- First, get the roadmap ID (replace with actual ID from step 1)
-- SET @roadmap_id = 'YOUR_ROADMAP_ID_HERE';

-- Create Week 1
INSERT INTO roadmap_weeks (
  id,
  roadmap_id,
  week_number,
  title,
  description,
  domain,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'),
  1,
  'Week 1: Foundation & Orientation',
  'Kick-off week with orientation session, Excel basics, SQL fundamentals, and English foundation',
  'Multiple',
  NOW()
);

-- Get the week ID for reference
SELECT id, week_number, title FROM roadmap_weeks 
WHERE roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix') 
AND week_number = 1;
