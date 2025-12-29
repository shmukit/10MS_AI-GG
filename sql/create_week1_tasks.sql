-- Step 3: Create Week 1 Tasks
-- First, get the week ID (replace with actual ID from step 2)
-- SET @week1_id = 'YOUR_WEEK1_ID_HERE';

-- Task 1: Initialization/Orientation Session
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
   AND week_number = 1),
  'Initialization/Orientation Session',
  'Kick-off call: mentor-mentee introduction, program overview, goal-setting, resource walkthrough, administration (tracking tools, schedules), soft skill icebreaker (introductions in English).',
  'attend',
  ARRAY[]::text[],
  '2025-09-09',
  2,
  20,
  true,
  NOW()
);

-- Task 2: Introduction to Excel
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
   AND week_number = 1),
  'Introduction to Excel',
  'Introduction to Excel interface, basic functions, and data formatting.',
  'watch',
  ARRAY['The Ultimate Excel Tutorial - Beginner to Advanced - 5 Hours!'],
  '2025-09-09',
  5,
  15,
  true,
  NOW()
);

-- Task 3: Introduction to SQL
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
   AND week_number = 1),
  'Introduction to SQL',
  'Basics of SQL, understanding databases, creating tables, and simple SELECT queries.',
  'watch',
  ARRAY['SQL for Beginners - FreeCodeCamp', 'https://www.youtube.com/watch?v=7S_tz1z_5bA'],
  '2025-09-09',
  4,
  15,
  true,
  NOW()
);

-- Task 4: SQL WHERE Clause
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
   AND week_number = 1),
  'SQL WHERE Clause',
  'Introduction to filtering data using the WHERE clause.',
  'watch',
  ARRAY['SQL WHERE Clause'],
  '2025-09-09',
  2,
  10,
  true,
  NOW()
);

-- Task 5: Basic Speaking Practice
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
   AND week_number = 1),
  'Basic Speaking Practice',
  'Focus on pronunciation and simple conversations.',
  'watch',
  ARRAY['Speaking English - BBC Learning English'],
  '2025-09-09',
  2,
  10,
  true,
  NOW()
);

-- Task 6: Basic Listening Practice
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
   AND week_number = 1),
  'Basic Listening Practice',
  'Listening to podcasts in everyday topics',
  'watch',
  ARRAY['https://youtube.com/playlist?list=PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt&si=KXrPmcIMsB-vPaPq'],
  '2025-09-09',
  2,
  10,
  true,
  NOW()
);

-- Task 7: Basic Excel Formulas
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
   AND week_number = 1),
  'Basic Formulas',
  'Learn SUM, AVERAGE, COUNT, and simple formatting tasks.',
  'watch',
  ARRAY['Excel Practice & Exercises with SUM Function - ExcelDemy'],
  '2025-09-09',
  3,
  15,
  true,
  NOW()
);

-- Verify Week 1 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 1 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
