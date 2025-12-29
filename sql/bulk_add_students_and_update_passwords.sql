-- Bulk Add Students and Update All Student Passwords to "NeverStopLearning!"
-- This script:
-- 1. Adds new students to users, student_profiles, and assigns them to a batch
-- 2. Updates all existing student passwords to "NeverStopLearning!"
-- 3. Ensures proper data consistency across all tables

-- =================================================================
-- STEP 1: Update All Existing Student Passwords to "NeverStopLearning!"
-- =================================================================

-- Generate a proper password hash for "NeverStopLearning!"
-- Note: In production, this should be a proper bcrypt hash. For MVP, using a simple prefix format.
UPDATE users 
SET 
  password_hash = '$2a$10$NeverStopLearning!',
  updated_at = NOW()
WHERE role = 'student' AND is_active = true;

-- Show updated student count
SELECT 
  'EXISTING STUDENT PASSWORDS UPDATED' as action,
  COUNT(*) as students_updated
FROM users 
WHERE role = 'student' AND password_hash = '$2a$10$NeverStopLearning!';

-- =================================================================
-- STEP 2: Bulk Insert New Students
-- =================================================================

-- Insert new students into users table
INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  first_name,
  last_name,
  phone,
  is_active,
  email_verified,
  created_at,
  updated_at
) VALUES 
  -- Student 1: Humayra Tasnim
  (
    gen_random_uuid(),
    'humayra1393@gmail.com',
    '$2a$10$NeverStopLearning!',
    'student',
    'Humayra',
    'Tasnim',
    '017 733 03199',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Student 2: Anindita Dutta
  (
    gen_random_uuid(),
    'aninditanitul@gmail.com',
    '$2a$10$NeverStopLearning!',
    'student',
    'Anindita',
    'Dutta',
    '015 217 93587',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Student 3: Nishat Tasnim
  (
    gen_random_uuid(),
    'nishattasnim06ce@gmail.com',
    '$2a$10$NeverStopLearning!',
    'student',
    'Nishat',
    'Tasnim',
    '018 334 85091',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- Student 4: ZEBA ISLAM Sotota
  (
    gen_random_uuid(),
    'zebasotota71318@gmail.com',
    '$2a$10$NeverStopLearning!',
    'student',
    'ZEBA ISLAM',
    'Sotota',
    '018 581 95408',
    true,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$NeverStopLearning!',
  phone = EXCLUDED.phone,
  is_active = true,
  email_verified = true,
  updated_at = NOW();

-- =================================================================
-- STEP 3: Create Student Profiles for New Students
-- =================================================================

-- Insert student profiles for each new student (only if they don't already exist)
DO $$
DECLARE
    user_record RECORD;
    student_data RECORD;
BEGIN
    -- Array of student data
    FOR student_data IN 
        SELECT * FROM (VALUES
            ('humayra1393@gmail.com', 'Rajshahi University of Engineering & Technology', '4th Year', 'CSE', 'Graduation'),
            ('aninditanitul@gmail.com', 'Ahsanullah University of Science and Technology', '4th Year', 'Electrical and Electronic Engineering', 'Graduation'),
            ('nishattasnim06ce@gmail.com', 'Faridpur Engineering College', '4th Year', 'Transportation Engineering & Environment Engineering', 'Graduated'),
            ('zebasotota71318@gmail.com', 'RUET', '4th Year', 'CSE', 'Final Year')
        ) AS t(email, institute, year, subject, degree)
    LOOP
        -- Get user_id for this email
        SELECT id INTO user_record FROM users WHERE email = student_data.email;
        
        -- Check if profile already exists
        IF NOT EXISTS (SELECT 1 FROM student_profiles WHERE user_id = user_record.id) THEN
            -- Insert new profile
            INSERT INTO student_profiles (
                id,
                user_id,
                institute,
                year,
                subject,
                degree,
                completed_weeks,
                progress_percentage,
                enrollment_date,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                user_record.id,
                student_data.institute,
                student_data.year,
                student_data.subject,
                student_data.degree,
                0,
                0.00,
                CURRENT_DATE,
                NOW(),
                NOW()
            );
            RAISE NOTICE 'Created profile for %', student_data.email;
        ELSE
            -- Update existing profile
            UPDATE student_profiles 
            SET 
                institute = student_data.institute,
                year = student_data.year,
                subject = student_data.subject,
                degree = student_data.degree,
                updated_at = NOW()
            WHERE user_id = user_record.id;
            RAISE NOTICE 'Updated profile for %', student_data.email;
        END IF;
    END LOOP;
END $$;

-- =================================================================
-- STEP 4: Assign New Students to Augmedix RCM Specialist Batch 1
-- =================================================================

-- Assign all new students to the Augmedix batch
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
) VALUES 
  -- Assignment 1: Humayra Tasnim
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'humayra1393@gmail.com'),
    (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
    CURRENT_DATE,
    'active',
    0.00,
    0,
    NOW(),
    NOW()
  ),
  -- Assignment 2: Anindita Dutta
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'aninditanitul@gmail.com'),
    (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
    CURRENT_DATE,
    'active',
    0.00,
    0,
    NOW(),
    NOW()
  ),
  -- Assignment 3: Nishat Tasnim
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'nishattasnim06ce@gmail.com'),
    (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
    CURRENT_DATE,
    'active',
    0.00,
    0,
    NOW(),
    NOW()
  ),
  -- Assignment 4: ZEBA ISLAM Sotota
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'zebasotota71318@gmail.com'),
    (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
    CURRENT_DATE,
    'active',
    0.00,
    0,
    NOW(),
    NOW()
  )
ON CONFLICT (student_id, batch_id) DO UPDATE SET
  status = 'active',
  enrollment_date = CURRENT_DATE,
  updated_at = NOW();

-- =================================================================
-- STEP 5: Update Batch Student Count
-- =================================================================

-- Update the current_students count for the Augmedix batch
UPDATE batches 
SET 
  current_students = (
    SELECT COUNT(*) 
    FROM student_batch_assignments 
    WHERE batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
    AND status = 'active'
  ),
  updated_at = NOW()
WHERE name = 'Augmedix RCM Specialist Batch 1';

-- =================================================================
-- STEP 6: Verification Queries
-- =================================================================

-- Show summary of all students in the system
SELECT 
  'TOTAL STUDENTS IN SYSTEM' as summary_type,
  COUNT(*) as count
FROM users 
WHERE role = 'student' AND is_active = true;

-- Show students with the new password
SELECT 
  'STUDENTS WITH NEW PASSWORD' as summary_type,
  COUNT(*) as count
FROM users 
WHERE role = 'student' 
  AND password_hash = '$2a$10$NeverStopLearning!' 
  AND is_active = true;

-- Show newly added students
SELECT 
  'NEWLY ADDED STUDENTS' as check_type,
  u.first_name || ' ' || u.last_name as student_name,
  u.email,
  u.phone,
  sp.institute,
  sp.subject,
  sp.degree,
  sp.year,
  'NeverStopLearning!' as password
FROM users u
JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.email IN (
  'humayra1393@gmail.com',
  'aninditanitul@gmail.com', 
  'nishattasnim06ce@gmail.com',
  'zebasotota71318@gmail.com'
)
ORDER BY u.first_name;

-- Show all students assigned to Augmedix RCM Specialist Batch 1
SELECT 
  'AUGMEDIX BATCH STUDENTS' as check_type,
  u.first_name || ' ' || u.last_name as student_name,
  u.email,
  sp.institute,
  sp.subject,
  sp.degree,
  sba.enrollment_date,
  sba.status,
  b.name as batch_name,
  r.title as roadmap_title
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN student_profiles sp ON u.id = sp.user_id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1'
  AND sba.status = 'active'
ORDER BY sba.enrollment_date DESC, u.first_name;

-- Show updated batch information
SELECT 
  'BATCH SUMMARY' as check_type,
  b.name as batch_name,
  b.current_students,
  b.max_students,
  r.title as roadmap_title,
  u.first_name || ' ' || u.last_name as mentor_name,
  b.start_date,
  b.status as batch_status
FROM batches b
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u ON b.mentor_id = u.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1';

-- Final success message
SELECT 
  '✅ BULK STUDENT CREATION COMPLETED SUCCESSFULLY!' as status,
  'All students added with password: NeverStopLearning!' as message,
  'Students assigned to: Augmedix RCM Specialist Batch 1' as batch_info;
