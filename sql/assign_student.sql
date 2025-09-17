-- Step 10: Assign Student to Batch

-- First, get Mukit's user ID
-- SELECT id, first_name, last_name, email FROM users WHERE email = 'mukit@10minuteschool.com';

-- Create student profile for Mukit (if it doesn't exist)
-- First check if profile already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE user_id = (SELECT id FROM users WHERE email = 'mukit@10minuteschool.com')
  ) THEN
    -- Insert new profile
    INSERT INTO student_profiles (
      id,
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
      gen_random_uuid(),
      (SELECT id FROM users WHERE email = 'mukit@10minuteschool.com'),
      '10 Minute School',
      '2025',
      'Revenue Cycle Management',
      'Specialist Program',
      (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
      0,
      0.00,
      CURRENT_DATE,
      NOW(),
      NOW()
    );
  ELSE
    -- Update existing profile
    UPDATE student_profiles 
    SET 
      batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
      updated_at = NOW()
    WHERE user_id = (SELECT id FROM users WHERE email = 'mukit@10minuteschool.com');
  END IF;
END $$;

-- Update batch current_students count
UPDATE batches 
SET current_students = (
  SELECT COUNT(*) 
  FROM student_profiles 
  WHERE batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
)
WHERE name = 'Augmedix RCM Specialist Batch 1';

-- Verify student assignment
SELECT 
  u.first_name || ' ' || u.last_name as student_name,
  u.email as student_email,
  sp.institute,
  sp.degree,
  b.name as batch_name,
  r.title as roadmap_title,
  u2.first_name || ' ' || u2.last_name as mentor_name
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
JOIN batches b ON sp.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u2 ON b.mentor_id = u2.id
WHERE u.email = 'mukit@10minuteschool.com';
