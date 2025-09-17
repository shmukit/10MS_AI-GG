-- Step 5: Create Week 3 and its tasks

-- Create Week 3
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
  3,
  'Week 3: Mid-Stage Development',
  'Advanced SQL joins, Excel assessment, English writing, and midterm evaluation',
  'Multiple',
  NOW()
);

-- Task 1: SQL Joins
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
   AND week_number = 3),
  'SQL Joins',
  'Learn about INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.',
  'watch',
  ARRAY['SQL Joins - W3Schools'],
  '2025-09-23',
  4,
  20,
  true,
  NOW()
);

-- Task 2: Excel Quiz 2
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
   AND week_number = 3),
  'Excel Quiz 2',
  'Quiz covering Week 2 to Week 3 content. Focus on advanced functions and data analysis.',
  'mcq',
  ARRAY['Excel Quiz'],
  '2025-09-23',
  1,
  20,
  true,
  NOW()
);

-- Task 3: Writing Emails
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
   AND week_number = 3),
  'Writing Emails',
  'Focus on writing formal and informal emails with proper tone and structure.',
  'written',
  ARRAY['Writing Emails - BBC Learning English'],
  '2025-09-23',
  3,
  15,
  true,
  NOW()
);

-- Task 4: Mid Stage Session (ZOOM)
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
   AND week_number = 3),
          'Mid Stage Session',
        'Mid-stage review and progress discussion with mentor.',
        'attend',
        ARRAY[]::text[],
        '2025-09-23',
  1,
  15,
  true,
  NOW()
);

-- Task 5: Conversation Practice
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
   AND week_number = 3),
  'Conversation Practice',
  'Practice common conversation phrases and responses in English.',
  'watch',
  ARRAY['Speaking English - British Council'],
  '2025-09-23',
  2,
  10,
  true,
  NOW()
);

-- Task 6: English Quiz 1
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
   AND week_number = 3),
          'English Quiz 1',
        'Assessment of English skills covered so far.',
        'mcq',
        ARRAY[]::text[],
        '2025-09-23',
  1,
  15,
  true,
  NOW()
);

-- Task 7: Midterm Assessment
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
   AND week_number = 3),
          'Midterm Assessment (All Topics)',
        'Comprehensive practical/case-based test: Excel data exercise, SQL query set, English writing (sample cover letter or formal email), oral communication.',
        'written',
        ARRAY[]::text[],
        '2025-09-23',
  3,
  30,
  true,
  NOW()
);

-- Verify Week 3 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 3 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
