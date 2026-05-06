-- Remove old batch_id column from student_profiles
-- This should be run AFTER the data migration is complete and verified

-- Step 1: Verify that all data has been migrated successfully
SELECT 
  'student_profiles with batch_id' as table_name,
  COUNT(*) as record_count
FROM student_profiles 
WHERE batch_id IS NOT NULL

UNION ALL

SELECT 
  'student_batch_assignments' as table_name,
  COUNT(*) as record_count
FROM student_batch_assignments;

-- Step 2: Double-check that no data will be lost
SELECT 
  sp.user_id,
  sp.batch_id,
  sba.student_id,
  sba.batch_id as new_batch_id
FROM student_profiles sp
LEFT JOIN student_batch_assignments sba ON sp.user_id = sba.student_id AND sp.batch_id = sba.batch_id
WHERE sp.batch_id IS NOT NULL
  AND (sba.student_id IS NULL OR sba.batch_id IS NULL);

-- Step 3: If the above query returns no rows, it's safe to proceed
-- Remove the batch_id column from student_profiles
ALTER TABLE student_profiles DROP COLUMN IF EXISTS batch_id;

-- Step 4: Verify the column has been removed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'student_profiles' 
ORDER BY ordinal_position;

-- Step 5: Update the database schema documentation
-- The student_profiles table no longer has a batch_id field
-- Students are now linked to batches through the student_batch_assignments table
