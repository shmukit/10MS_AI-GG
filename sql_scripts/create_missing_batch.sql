-- Create the missing batch that the user mentioned
-- Run this in your Supabase SQL editor

-- 1. First, create a roadmap if it doesn't exist
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
  'da36d58c-9850-4f78-948f-5ce4866d50a4', -- Different UUID for roadmap
  'Python Learning Path',
  'Comprehensive Python programming course covering fundamentals to advanced concepts',
  6,
  'beginner',
  'Programming',
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 2. Create the batch with the exact ID you mentioned
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
  'da36d58c-9850-4f78-948f-5ce4866d50a3', -- Exact ID you mentioned
  'Python Learning Cohort - Demo Batch',
  'da36d58c-9850-4f78-948f-5ce4866d50a4', -- Reference to roadmap
  '95595c17-d5dd-4449-96d6-1699977f27c3', -- Your user ID as mentor
  30,
  1, -- You as the first student
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '6 months',
  'active',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 3. Create a student profile for you linked to this batch
INSERT INTO student_profiles (
  user_id,
  institute,
  year,
  subject,
  degree,
  batch_id,
  completed_weeks,
  progress_percentage,
  enrollment_date,
  created_at,
  updated_at
) VALUES (
  '95595c17-d5dd-4449-96d6-1699977f27c3', -- Your user ID
  '10 Minute School',
  '2025',
  'Computer Science',
  'Bachelor',
  'da36d58c-9850-4f78-948f-5ce4866d50a3', -- The batch ID
  0,
  0.00,
  CURRENT_DATE,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  batch_id = EXCLUDED.batch_id,
  updated_at = NOW();

-- 4. Create roadmap weeks
INSERT INTO roadmap_weeks (
  roadmap_id,
  week_number,
  title,
  description,
  domain
) VALUES 
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 1, 'Python Fundamentals', 'Basic syntax, variables, data types', 'Programming'),
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 2, 'Control Structures', 'Loops, conditionals, functions', 'Programming'),
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 3, 'Data Structures', 'Lists, tuples, dictionaries, sets', 'Programming'),
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 4, 'Object-Oriented Programming', 'Classes, objects, inheritance', 'Programming'),
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 5, 'File Handling & Modules', 'Working with files and importing modules', 'Programming'),
  ('da36d58c-9850-4f78-948f-5ce4866d50a4', 6, 'Final Project', 'Build a complete Python application', 'Programming')
ON CONFLICT DO NOTHING;

-- 5. Verify everything was created
SELECT 
  'Batch' as type,
  b.id,
  b.name,
  b.status
FROM batches b
WHERE b.id = 'da36d58c-9850-4f78-948f-5ce4866d50a3'

UNION ALL

SELECT 
  'Student Profile' as type,
  sp.user_id::text as id,
  u.first_name || ' ' || u.last_name as name,
  sp.batch_id::text as status
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
WHERE sp.batch_id = 'da36d58c-9850-4f78-948f-5ce4866d50a3'

UNION ALL

SELECT 
  'Roadmap Weeks' as type,
  COUNT(*)::text as id,
  'Total weeks created' as name,
  r.title as status
FROM roadmap_weeks rw
JOIN roadmaps r ON rw.roadmap_id = r.id
WHERE r.id = 'da36d58c-9850-4f78-948f-5ce4866d50a4'
GROUP BY r.title;
