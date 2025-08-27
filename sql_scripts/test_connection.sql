-- Test Database Connection and User Data for 10MS SheSTEM
-- Run this in your Supabase SQL editor to verify the setup

-- 1. Test basic connection
SELECT 'Database connection successful' as status;

-- 2. Check if user exists
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at
FROM users 
WHERE email = 'mukit@10minuteschool.com';

-- 3. Check if student profile exists
SELECT 
  sp.id,
  sp.user_id,
  sp.institute,
  sp.year,
  sp.subject,
  sp.degree,
  sp.batch_id,
  sp.completed_weeks,
  sp.progress_percentage,
  sp.enrollment_date
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
WHERE u.email = 'mukit@10minuteschool.com';

-- 4. Check if batch exists
SELECT 
  b.id,
  b.name,
  b.roadmap_id,
  b.mentor_id,
  b.max_students,
  b.current_students,
  b.status,
  b.created_at
FROM batches b
WHERE b.id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- 5. Check if roadmap exists
SELECT 
  r.id,
  r.title,
  r.description,
  r.total_weeks,
  r.difficulty_level,
  r.category,
  r.is_active
FROM roadmaps r
WHERE r.id IN (
  SELECT roadmap_id FROM batches WHERE id = 'da36d58c-9850-4f78-948f-5ce4866d50a3'
);

-- 6. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND table_name IN ('users', 'student_profiles', 'batches', 'roadmaps')
ORDER BY tablename, policyname;

-- 7. Test inserting a test notice (to verify RLS)
INSERT INTO notices (
  title,
  content,
  type,
  priority,
  is_published,
  created_at,
  updated_at
) VALUES (
  'Test Notice - Database Connection Working',
  'This is a test notice to verify the database connection and RLS policies are working correctly.',
  'announcement',
  'medium',
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 8. Verify the test notice was created
SELECT 
  id,
  title,
  content,
  type,
  priority,
  is_published,
  created_at
FROM notices 
WHERE title = 'Test Notice - Database Connection Working'
ORDER BY created_at DESC
LIMIT 1;

-- 9. Clean up test data (optional)
-- DELETE FROM notices WHERE title = 'Test Notice - Database Connection Working';
