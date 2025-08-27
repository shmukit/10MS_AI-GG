-- Verify Uttam Deb's mentor assignment to the batch/roadmap

-- 1. Check if Uttam Deb exists as a user
SELECT 
  'USER CHECK' as check_type,
  id,
  first_name,
  last_name,
  email,
  role,
  is_active
FROM users 
WHERE email = 'uttam.deb@10minuteschool.com';

-- 2. Check if Uttam Deb is assigned as mentor to the batch
SELECT 
  'MENTOR ASSIGNMENT' as check_type,
  b.id as batch_id,
  b.name as batch_name,
  b.mentor_id,
  u.first_name || ' ' || u.last_name as mentor_name,
  u.email as mentor_email,
  b.status as batch_status,
  b.start_date,
  b.end_date
FROM batches b
JOIN users u ON b.mentor_id = u.id
WHERE u.email = 'uttam.deb@10minuteschool.com';

-- 3. Check the specific Augmedix RCM batch and its mentor
SELECT 
  'SPECIFIC BATCH CHECK' as check_type,
  b.id as batch_id,
  b.name as batch_name,
  b.mentor_id,
  u.first_name || ' ' || u.last_name as mentor_name,
  u.email as mentor_email,
  r.title as roadmap_title,
  r.total_weeks,
  b.current_students,
  b.max_students,
  b.status as batch_status
FROM batches b
JOIN users u ON b.mentor_id = u.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1';

-- 4. Check all batches where Uttam Deb is the mentor
SELECT 
  'ALL MENTOR BATCHES' as check_type,
  b.id as batch_id,
  b.name as batch_name,
  b.status as batch_status,
  r.title as roadmap_title,
  b.start_date,
  b.end_date,
  b.current_students,
  b.max_students
FROM batches b
JOIN users u ON b.mentor_id = u.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE u.email = 'uttam.deb@10minuteschool.com'
ORDER BY b.created_at DESC;

-- 5. Check if there are any batches without a mentor
SELECT 
  'BATCHES WITHOUT MENTOR' as check_type,
  b.id as batch_id,
  b.name as batch_name,
  b.mentor_id,
  b.status as batch_status
FROM batches b
WHERE b.mentor_id IS NULL;
