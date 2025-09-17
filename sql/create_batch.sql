-- Step 9: Create Batch and Assign Mentor

-- First, get Uttam Deb's user ID (assuming he already exists)
-- You'll need to replace this with his actual user ID from the users table
-- SELECT id, first_name, last_name, email FROM users WHERE email = 'uttam.deb@10minuteschool.com';

-- Create the batch
INSERT INTO batches (
  id,
  name,
  roadmap_id,
  mentor_id,
  max_students,
  current_students,
  start_date,
  end_date,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Augmedix RCM Specialist Batch 1',
  (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'),
  (SELECT id FROM users WHERE email = 'uttam.deb@10minuteschool.com'),
  30,
  1,
  '2025-09-03',
  '2025-10-14',
  'active',
  NOW(),
  NOW()
);

-- Verify batch was created
SELECT 
  b.name,
  b.start_date,
  b.end_date,
  b.status,
  r.title as roadmap_title,
  u.first_name || ' ' || u.last_name as mentor_name
FROM batches b
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u ON b.mentor_id = u.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1';
