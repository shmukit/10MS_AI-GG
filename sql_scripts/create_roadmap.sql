-- Step 1: Create the main roadmap
INSERT INTO roadmaps (
  id,
  title,
  description,
  total_weeks,
  difficulty_level,
  category,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Revenue Cycle Management Specialist, Augmedix',
  'Comprehensive training program covering Excel, SQL, and English skills for revenue cycle management roles at Augmedix. The program includes hands-on practice, assessments, and real-world applications.',
  6,
  'intermediate',
  'Healthcare Technology',
  true,
  NOW(),
  NOW()
);

-- Get the roadmap ID for reference
SELECT id, title FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix';
