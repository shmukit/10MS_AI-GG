-- Add unique constraint to prevent duplicate progress records
-- This will prevent the 409 conflict errors when students try to update tasks

-- First, check if there are any remaining duplicates
SELECT 
  student_id, 
  task_id, 
  COUNT(*) as duplicate_count
FROM student_progress 
GROUP BY student_id, task_id 
HAVING COUNT(*) > 1;

-- Add unique constraint on student_id and task_id combination
-- This ensures only one progress record per student per task
ALTER TABLE student_progress 
ADD CONSTRAINT unique_student_task_progress 
UNIQUE (student_id, task_id);

-- Verify the constraint was added
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'student_progress'::regclass 
  AND conname = 'unique_student_task_progress';
