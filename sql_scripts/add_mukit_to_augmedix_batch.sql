-- Add Mukit to Augmedix RCM Specialist Batch 1
-- This script specifically handles adding mukit@10minuteschool.com to the specified batch

-- Step 1: Verify Mukit's user record exists
SELECT 
  id,
  first_name,
  last_name,
  email,
  role
FROM users 
WHERE email = 'mukit@10minuteschool.com';

-- Step 2: Verify the batch exists
SELECT 
  id,
  name,
  roadmap_id,
  mentor_id,
  max_students,
  current_students,
  status
FROM batches 
WHERE id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Step 3: Check if Mukit is already enrolled in this batch
SELECT 
  sba.id,
  sba.student_id,
  sba.batch_id,
  sba.status,
  sba.enrollment_date
FROM student_batch_assignments sba
WHERE sba.student_id = '95595c17-d5dd-4449-96d6-1699977f27c3'
  AND sba.batch_id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Step 4: Add Mukit to the batch (if not already enrolled)
INSERT INTO student_batch_assignments (
  id,
  student_id,
  batch_id,
  enrollment_date,
  status,
  progress_percentage,
  completed_weeks,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '95595c17-d5dd-4449-96d6-1699977f27c3', -- Mukit's user ID
  'da36d58c-9850-4f78-948f-5ce4866d50a3', -- Augmedix RCM Specialist Batch 1 ID
  CURRENT_DATE,
  'active',
  0.00,
  0,
  NOW(),
  NOW()
) ON CONFLICT (student_id, batch_id) DO UPDATE SET
  status = 'active',
  updated_at = NOW()
RETURNING *;

-- Step 5: Update the batch current_students count
UPDATE batches 
SET 
  current_students = (
    SELECT COUNT(*) 
    FROM student_batch_assignments 
    WHERE batch_id = 'da36d58c-9850-4f78-948f-5ce4866d50a3'
      AND status = 'active'
  ),
  updated_at = NOW()
WHERE id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Step 6: Verify the enrollment
SELECT 
  u.first_name || ' ' || u.last_name as student_name,
  u.email as student_email,
  b.name as batch_name,
  r.title as roadmap_title,
  sba.status as enrollment_status,
  sba.enrollment_date,
  sba.progress_percentage,
  sba.completed_weeks,
  u2.first_name || ' ' || u2.last_name as mentor_name
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u2 ON b.mentor_id = u2.id
WHERE u.email = 'mukit@10minuteschool.com'
  AND b.id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Step 7: Show all batches Mukit is currently enrolled in
SELECT 
  u.first_name || ' ' || u.last_name as student_name,
  u.email as student_email,
  b.name as batch_name,
  r.title as roadmap_title,
  sba.status as enrollment_status,
  sba.enrollment_date,
  sba.progress_percentage,
  sba.completed_weeks
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE u.email = 'mukit@10minuteschool.com'
  AND sba.status = 'active'
ORDER BY sba.enrollment_date DESC;

-- Step 8: Show updated batch information
SELECT 
  b.name as batch_name,
  b.current_students,
  b.max_students,
  r.title as roadmap_title,
  u.first_name || ' ' || u.last_name as mentor_name
FROM batches b
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u ON b.mentor_id = u.id
WHERE b.id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';
