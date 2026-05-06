-- Step 8: Create Week 6 and its tasks

-- Create Week 6
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
  6,
  'Week 6: Final Assessment & Interview Preparation',
  'Final assessments, interview preparation, and program completion',
  'Multiple',
  NOW()
);

-- Task 1: Prepare for Job Interview in Tech Field
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
   AND week_number = 6),
  'Prepare for Job Interview in Tech Field',
  'Learn what happens in a tech interview',
  'watch',
  ARRAY['https://youtu.be/ld0cvWnrVsU?si=j_To3wKKKbTfWOn1'],
  '2025-10-14',
  2,
  15,
  true,
  NOW()
);

-- Task 2: SQL Quiz 4
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
   AND week_number = 6),
  'SQL Quiz 4',
  'Final quiz covering all SQL topics, including SELECT, JOINS, and database management.',
  'mcq',
  ARRAY['Final SQL Quiz - W3Schools'],
  '2025-10-14',
  1,
  20,
  true,
  NOW()
);

-- Task 3: English Quiz 3
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
   AND week_number = 6),
          'English Quiz 3',
        'Final assessment of English skills including grammar, writing, and speaking.',
        'mcq',
        ARRAY[]::text[],
        '2025-10-14',
  1,
  20,
  true,
  NOW()
);

-- Task 4: Final Assessment
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
   AND week_number = 6),
          'Final Assessment',
        'Comprehensive final assessment covering all topics from the program.',
        'written',
        ARRAY[]::text[],
        '2025-10-14',
  3,
  30,
  true,
  NOW()
);

-- Task 5: Final Session (ZOOM)
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
   AND week_number = 6),
          'Final Session',
        'Final program review, feedback session, and graduation discussion.',
        'attend',
        ARRAY[]::text[],
        '2025-10-14',
  1,
  15,
  true,
  NOW()
);

-- Verify Week 6 tasks were created
SELECT 
  t.task_name,
  t.task_type,
  t.points,
  t.deadline
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.week_number = 6 
AND w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
ORDER BY t.created_at;
