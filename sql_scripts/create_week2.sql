-- Step 4: Create Week 2 and its tasks

-- Create Week 2
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
  2,
  'Week 2: Practice & Assessment',
  'Focus on Excel and SQL practice, quizzes, and English writing skills',
  'Multiple',
  NOW()
);

-- Task 1: Excel Quiz 1
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
   AND week_number = 2),
  'Excel Quiz 1',
  'Quiz covering Week 1 to Week 2 content. Focus on formulas, data manipulation, and formatting.',
  'mcq',
  ARRAY['Excel Quiz'],
  '2025-09-16',
  1,
  20,
  true,
  NOW()
);

-- Task 2: SQL SELECT Queries Practice
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
   AND week_number = 2),
  'SQL SELECT Queries',
  'Practice more complex SELECT queries with WHERE, ORDER BY, and LIMIT clauses.',
  'written',
  ARRAY['SQL Practice - W3Schools'],
  '2025-09-16',
  3,
  15,
  true,
  NOW()
);

-- Task 3: SQL Quiz 1
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
   AND week_number = 2),
  'SQL Quiz 1',
  'Quiz covering SELECT queries, WHERE clauses, and basic joins.',
  'mcq',
  ARRAY['SQL Quiz'],
  '2025-09-16',
  1,
  20,
  true,
  NOW()
);

-- Task 4: Writing Short Paragraphs
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
   AND week_number = 2),
  'Writing Short Paragraphs',
  'Emphasis on constructing clear and concise paragraphs. Focus on coherence and clarity.',
  'written',
  ARRAY['Writing Paragraphs - British Council'],
  '2025-09-16',
  2,
  15,
  true,
  NOW()
);

-- Task 5: Listening Practice
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
   AND week_number = 2),
  'Listening Practice',
  'Practice listening comprehension and note-taking using podcasts.',
  'watch',
  ARRAY['Listening Practice - TED Talks'],
  '2025-09-16',
  2,
  10,
  true,
  NOW()
);

-- Verify Week 2 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 2 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
