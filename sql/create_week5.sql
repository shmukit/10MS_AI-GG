-- Step 7: Create Week 5 and its tasks

-- Create Week 5
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
  5,
  'Week 5: Final Skills & Resume Building',
  'Final assessments, resume building, and comprehensive skill evaluation',
  'Multiple',
  NOW()
);

-- Task 1: Building Your Final Resume
INSERT INTO roadmap_tasks (
  id,
  week_id,
  task_name,
  task_details,
  task_type,
  relevant_links,
  deadline,
  estimated_hours,
  points,
  is_required,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM roadmap_weeks 
   WHERE roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix') 
   AND week_number = 5),
  'Building Your Final Resume',
  'Apply Excel functions to analyze real-world data and present findings in a dashboard.',
  'project',
  ARRAY['https://youtu.be/Tt08KmFfIYQ?si=Xe481Bk2a2CY5-l3', 'https://youtu.be/nWHLmdteEhU?si=zT6bdZwZAClCJ-Li'],
  '2025-10-07',
  4,
  25,
  true,
  NOW()
);

-- Task 2: SQL Quiz 3
INSERT INTO roadmap_tasks (
  id,
  week_id,
  task_name,
  task_details,
  task_type,
  relevant_links,
  deadline,
  estimated_hours,
  points,
  is_required,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM roadmap_weeks 
   WHERE roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix') 
   AND week_number = 5),
  'SQL Quiz 3',
  'Final quiz covering all SQL topics, including database creation, queries, and joins.',
  'mcq',
  ARRAY['SQL Quiz - GeeksforGeeks'],
  '2025-10-07',
  1,
  20,
  true,
  NOW()
);

-- Task 3: Final Speaking Test
INSERT INTO roadmap_tasks (
  id,
  week_id,
  task_name,
  task_details,
  task_type,
  relevant_links,
  deadline,
  estimated_hours,
  points,
  is_required,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM roadmap_weeks 
   WHERE roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix') 
   AND week_number = 5),
  'Final Speaking Test',
  'Assess English speaking skills with a focus on fluency and clarity.',
  'attend',
  ARRAY['Speaking Test - British Council'],
  '2025-10-07',
  1,
  20,
  true,
  NOW()
);

-- Task 4: Excel Quiz 3
INSERT INTO roadmap_tasks (
  id,
  week_id,
  task_name,
  task_details,
  task_type,
  relevant_links,
  deadline,
  estimated_hours,
  points,
  is_required,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM roadmap_weeks 
   WHERE roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix') 
   AND week_number = 5),
  'Excel Quiz 3',
  'Final quiz covering everything from Week 1 to Week 5.',
  'mcq',
  ARRAY['Excel Quiz - ProProfs'],
  '2025-10-07',
  1,
  20,
  true,
  NOW()
);

-- Verify Week 5 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 5 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
