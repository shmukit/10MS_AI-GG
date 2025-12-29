-- Fix Student-Batch Relationship to Support Multiple Batch Assignments
-- This script creates a many-to-many relationship between students and batches

-- Step 1: Create a new junction table for student-batch assignments
CREATE TABLE IF NOT EXISTS student_batch_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) CHECK (status IN ('active', 'completed', 'dropped', 'suspended')) DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  completed_weeks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, batch_id) -- Prevent duplicate assignments
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_batch_assignments_student ON student_batch_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_batch_assignments_batch ON student_batch_assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_student_batch_assignments_status ON student_batch_assignments(status);

-- Step 3: Migrate existing data from student_profiles to the new table
INSERT INTO student_batch_assignments (
  student_id,
  batch_id,
  enrollment_date,
  progress_percentage,
  completed_weeks,
  created_at,
  updated_at
)
SELECT 
  sp.user_id,
  sp.batch_id,
  sp.enrollment_date,
  sp.progress_percentage,
  sp.completed_weeks,
  sp.created_at,
  sp.updated_at
FROM student_profiles sp
WHERE sp.batch_id IS NOT NULL
ON CONFLICT (student_id, batch_id) DO NOTHING;

-- Step 4: Remove the batch_id column from student_profiles (after data migration)
-- Note: This will be done in a separate step to ensure data safety

-- Step 5: Add Mukit to the Augmedix RCM Specialist Batch 1
INSERT INTO student_batch_assignments (
  student_id,
  batch_id,
  enrollment_date,
  status,
  created_at,
  updated_at
) VALUES (
  '95595c17-d5dd-4449-96d6-1699977f27c3', -- Mukit's user ID
  'da36d58c-9850-4f78-948f-5ce4866d50a3', -- Augmedix RCM Specialist Batch 1 ID
  CURRENT_DATE,
  'active',
  NOW(),
  NOW()
) ON CONFLICT (student_id, batch_id) DO UPDATE SET
  status = 'active',
  updated_at = NOW();

-- Step 6: Update batch current_students count
UPDATE batches 
SET current_students = (
  SELECT COUNT(*) 
  FROM student_batch_assignments 
  WHERE batch_id = 'da36d58c-9850-4f78-948f-5ce4866d50a3'
  AND status = 'active'
)
WHERE id = 'da36d58c-9850-4f78-948f-5ce4866d50a3';

-- Step 7: Verify the assignment
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
WHERE u.email = 'mukit@10minuteschool.com';

-- Step 8: Show all batches Mukit is enrolled in
SELECT 
  u.first_name || ' ' || u.last_name as student_name,
  u.email as student_email,
  b.name as batch_name,
  r.title as roadmap_title,
  sba.status as enrollment_status,
  sba.enrollment_date
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE u.email = 'mukit@10minuteschool.com'
ORDER BY sba.enrollment_date DESC;
