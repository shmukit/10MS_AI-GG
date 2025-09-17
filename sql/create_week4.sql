-- Step 6: Create Week 4 and its tasks

-- Create Week 4
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
  4,
  'Week 4: Advanced Skills & Google Tools',
  'Introduction to Google Sheets, SQL project, and advanced English grammar',
  'Multiple',
  NOW()
);

-- Task 1: Introduction to Google Sheets
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
   AND week_number = 4),
  'Introduction to Google Sheets',
  'Introduction to Google Sheets interface, basic functions, and data formatting.',
  'watch',
  ARRAY['Google Sheets Tutorial for Beginners'],
  '2025-09-30',
  3,
  15,
  true,
  NOW()
);

-- Task 2: SQL Database Project
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
   AND week_number = 4),
  'SQL Database Project',
  'Create a sample database, insert data, and run queries to extract meaningful insights in Google BigQuery',
  'project',
  ARRAY['https://cloud.google.com/bigquery'],
  '2025-09-30',
  6,
  25,
  true,
  NOW()
);

-- Task 3: SQL Quiz 2
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
   AND week_number = 4),
  'SQL Quiz 2',
  'Quiz covering Joins, SELECT queries, and filtering.',
  'mcq',
  ARRAY['SQL Joins Quiz'],
  '2025-09-30',
  1,
  20,
  true,
  NOW()
);

-- Task 4: Advanced Grammar Practice
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
   AND week_number = 4),
  'Advanced Grammar Practice',
  'Focus on advanced grammar: conditional sentences, passive voice, and reported speech.',
  'watch',
  ARRAY['Advanced Grammar - English Club'],
  '2025-09-30',
  3,
  15,
  true,
  NOW()
);

-- Task 5: Basic English Grammar
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
   AND week_number = 4),
  'Basic English Grammar',
  'Focus on sentence structure, parts of speech, and tenses.',
  'read',
  ARRAY['BBC Learning English - Easy grammar guide'],
  '2025-09-30',
  2,
  10,
  true,
  NOW()
);

-- Task 6: English Quiz 2
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
   AND week_number = 4),
          'English Quiz 2',
        'Assessment of advanced English grammar and writing skills.',
        'mcq',
        ARRAY[]::text[],
        '2025-09-30',
  1,
  15,
  true,
  NOW()
);

-- Verify Week 4 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 4 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
