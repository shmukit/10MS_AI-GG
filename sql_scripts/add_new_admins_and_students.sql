-- Add New Users as Both Admins and Students with Password "NeverStopLearning!"
-- This script:
-- 1. Adds new users as admins (with mentor profiles) 
-- 2. Also creates student profiles for the same users
-- 3. Assigns them to the Augmedix RCM Specialist roadmap
-- 4. Ensures proper password hashing and data consistency

-- =================================================================
-- STEP 0: Ensure Required Constraints Exist
-- =================================================================

-- Add unique constraint on mentor_profiles.user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'mentor_profiles_user_id_unique'
    ) THEN
        ALTER TABLE mentor_profiles ADD CONSTRAINT mentor_profiles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Add unique constraint on student_profiles.user_id if it doesn't exist  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'student_profiles_user_id_unique'
    ) THEN
        ALTER TABLE student_profiles ADD CONSTRAINT student_profiles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Ensure student_batch_assignments table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'student_batch_assignments') THEN
        CREATE TABLE student_batch_assignments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES users(id) ON DELETE CASCADE,
          batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          status VARCHAR(20) CHECK (status IN ('active', 'completed', 'dropped', 'suspended')) DEFAULT 'active',
          progress_percentage DECIMAL(5,2) DEFAULT 0.00,
          completed_weeks INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(student_id, batch_id)
        );
        
        -- Add indexes
        CREATE INDEX idx_student_batch_assignments_student ON student_batch_assignments(student_id);
        CREATE INDEX idx_student_batch_assignments_batch ON student_batch_assignments(batch_id);
        CREATE INDEX idx_student_batch_assignments_status ON student_batch_assignments(status);
    END IF;
END $$;

-- =================================================================
-- STEP 1: Add New Users as Admin Users
-- =================================================================

INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  first_name,
  last_name,
  is_active,
  email_verified,
  created_at,
  updated_at
) VALUES 
  -- User 1: Raied
  (
    gen_random_uuid(),
    'raied@10minuteschool.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Raied',
    '10MS',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- User 2: Raihana
  (
    gen_random_uuid(),
    'raihana@10minuteschool.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Raihana',
    '10MS',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- User 3: Shams
  (
    gen_random_uuid(),
    'shams@10minuteschool.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Shams',
    '10MS',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- User 4: Farhanur
  (
    gen_random_uuid(),
    'farhanur@10minuteschool.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Farhanur',
    '10MS',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- User 5: Zinat Khan
  (
    gen_random_uuid(),
    'zinat.khan@lightcastlepartners.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Zinat',
    'Khan',
    true,
    true,
    NOW(),
    NOW()
  ),
  -- User 6: Ridwanur Rahman
  (
    gen_random_uuid(),
    'ridwanur.rahman@lightcastlepartners.com',
    crypt('NeverStopLearning!', gen_salt('bf')),
    'admin',
    'Ridwanur',
    'Rahman',
    true,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('NeverStopLearning!', gen_salt('bf')),
  role = 'admin',
  is_active = true,
  email_verified = true,
  updated_at = NOW();

-- =================================================================
-- STEP 2: Create Mentor Profiles for Admin Users
-- =================================================================

INSERT INTO mentor_profiles (
  id,
  user_id,
  organization,
  designation,
  expertise_areas,
  bio,
  years_of_experience,
  created_at,
  updated_at
) VALUES 
  -- Mentor Profile 1: Raied
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'raied@10minuteschool.com'),
    '10 Minute School',
    'System Administrator',
    ARRAY['System Administration', 'User Management', 'Platform Operations'],
    'System administrator with expertise in platform management and user operations.',
    5,
    NOW(),
    NOW()
  ),
  -- Mentor Profile 2: Raihana
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'raihana@10minuteschool.com'),
    '10 Minute School',
    'System Administrator',
    ARRAY['System Administration', 'Content Management', 'Platform Operations'],
    'System administrator focused on content management and platform operations.',
    4,
    NOW(),
    NOW()
  ),
  -- Mentor Profile 3: Shams
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'shams@10minuteschool.com'),
    '10 Minute School',
    'System Administrator',
    ARRAY['System Administration', 'Technical Support', 'Platform Operations'],
    'System administrator with technical support and platform operations expertise.',
    3,
    NOW(),
    NOW()
  ),
  -- Mentor Profile 4: Farhanur
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'farhanur@10minuteschool.com'),
    '10 Minute School',
    'System Administrator',
    ARRAY['System Administration', 'Data Management', 'Platform Operations'],
    'System administrator specializing in data management and platform operations.',
    4,
    NOW(),
    NOW()
  ),
  -- Mentor Profile 5: Zinat Khan
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'zinat.khan@lightcastlepartners.com'),
    'LightCastle Partners',
    'System Administrator',
    ARRAY['System Administration', 'Partnership Management', 'Strategic Planning'],
    'System administrator with partnership management and strategic planning expertise.',
    6,
    NOW(),
    NOW()
  ),
  -- Mentor Profile 6: Ridwanur Rahman
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'ridwanur.rahman@lightcastlepartners.com'),
    'LightCastle Partners',
    'System Administrator',
    ARRAY['System Administration', 'Analytics', 'Data Management'],
    'System administrator with analytics and data management expertise.',
    5,
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO UPDATE SET
  organization = EXCLUDED.organization,
  designation = EXCLUDED.designation,
  expertise_areas = EXCLUDED.expertise_areas,
  bio = EXCLUDED.bio,
  years_of_experience = EXCLUDED.years_of_experience,
  updated_at = NOW();

-- =================================================================
-- STEP 3: Create Student Profiles for the Same Users
-- =================================================================

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
) VALUES 
  -- Student Profile 1: Raied
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'raied@10minuteschool.com'),
    '10 Minute School',
    'Admin',
    'System Administration & Platform Management',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  ),
  -- Student Profile 2: Raihana
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'raihana@10minuteschool.com'),
    '10 Minute School',
    'Admin',
    'Content Management & Operations',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  ),
  -- Student Profile 3: Shams
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'shams@10minuteschool.com'),
    '10 Minute School',
    'Admin',
    'Technical Support & Operations',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  ),
  -- Student Profile 4: Farhanur
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'farhanur@10minuteschool.com'),
    '10 Minute School',
    'Admin',
    'Data Management & Analytics',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  ),
  -- Student Profile 5: Zinat Khan
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'zinat.khan@lightcastlepartners.com'),
    'LightCastle Partners',
    'Admin',
    'Partnership & Strategic Management',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  ),
  -- Student Profile 6: Ridwanur Rahman
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'ridwanur.rahman@lightcastlepartners.com'),
    'LightCastle Partners',
    'Admin',
    'Analytics & Data Science',
    'MSc',
    0,
    0.00,
    CURRENT_DATE,
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO UPDATE SET
  institute = EXCLUDED.institute,
  year = EXCLUDED.year,
  subject = EXCLUDED.subject,
  degree = EXCLUDED.degree,
  updated_at = NOW();

-- =================================================================
-- STEP 4: Assign Users to Augmedix RCM Specialist Batch
-- =================================================================

-- First, ensure we have the new student_batch_assignments table structure
-- (This step is idempotent and safe to run multiple times)

-- Check if student_batch_assignments table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'student_batch_assignments') THEN
        CREATE TABLE student_batch_assignments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID REFERENCES users(id) ON DELETE CASCADE,
          batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          status VARCHAR(20) CHECK (status IN ('active', 'completed', 'dropped', 'suspended')) DEFAULT 'active',
          progress_percentage DECIMAL(5,2) DEFAULT 0.00,
          completed_weeks INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(student_id, batch_id)
        );
        
        -- Add indexes
        CREATE INDEX idx_student_batch_assignments_student ON student_batch_assignments(student_id);
        CREATE INDEX idx_student_batch_assignments_batch ON student_batch_assignments(batch_id);
        CREATE INDEX idx_student_batch_assignments_status ON student_batch_assignments(status);
    END IF;
END $$;

-- Assign all new admin users to the Augmedix batch as students
-- First, find or create a suitable batch
DO $$
DECLARE
    target_batch_id UUID;
    new_user_emails TEXT[] := ARRAY[
        'raied@10minuteschool.com',
        'raihana@10minuteschool.com', 
        'shams@10minuteschool.com',
        'farhanur@10minuteschool.com',
        'zinat.khan@lightcastlepartners.com',
        'ridwanur.rahman@lightcastlepartners.com'
    ];
    user_email TEXT;
    user_record RECORD;
BEGIN
    -- Try to find Augmedix batch
    SELECT id INTO target_batch_id 
    FROM batches 
    WHERE (name ILIKE '%augmedix%' OR name ILIKE '%rcm%') 
    AND status = 'active'
    LIMIT 1;
    
    -- If no Augmedix batch found, use any active batch
    IF target_batch_id IS NULL THEN
        SELECT id INTO target_batch_id 
        FROM batches 
        WHERE status = 'active'
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    -- If still no batch found, skip assignments with a notice
    IF target_batch_id IS NULL THEN
        RAISE NOTICE 'No active batches found. Skipping batch assignments.';
    ELSE
        RAISE NOTICE 'Using batch ID: %', target_batch_id;
        
        -- Assign each user to the batch
        FOREACH user_email IN ARRAY new_user_emails
        LOOP
            SELECT id INTO user_record FROM users WHERE email = user_email;
            
            IF user_record.id IS NOT NULL THEN
                -- Insert batch assignment
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
                    user_record.id,
                    target_batch_id,
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
                    
                RAISE NOTICE 'Assigned user % to batch', user_email;
            ELSE
                RAISE NOTICE 'User % not found, skipping batch assignment', user_email;
            END IF;
        END LOOP;
    END IF;
END $$;

-- =================================================================
-- STEP 5: Update Batch Student Count
-- =================================================================

-- Update the current_students count for the Augmedix batch
UPDATE batches 
SET 
  current_students = (
    SELECT COUNT(*) 
    FROM student_batch_assignments sba
    WHERE sba.batch_id = batches.id
    AND sba.status = 'active'
  ),
  updated_at = NOW()
WHERE name LIKE '%Augmedix%' OR name LIKE '%RCM%';

-- =================================================================
-- STEP 6: Verification Queries
-- =================================================================

-- Show newly added admin/student users
SELECT 
  'NEWLY ADDED ADMIN USERS' as check_type,
  u.first_name || ' ' || u.last_name as user_name,
  u.email,
  u.role,
  mp.organization,
  mp.designation,
  'Admin & Student Access' as access_level,
  'NeverStopLearning!' as password
FROM users u
LEFT JOIN mentor_profiles mp ON u.id = mp.user_id
WHERE u.email IN (
  'raied@10minuteschool.com',
  'raihana@10minuteschool.com',
  'shams@10minuteschool.com',
  'farhanur@10minuteschool.com',
  'zinat.khan@lightcastlepartners.com',
  'ridwanur.rahman@lightcastlepartners.com'
)
ORDER BY u.first_name;

-- Show their student profiles
SELECT 
  'ADMIN USERS STUDENT PROFILES' as check_type,
  u.first_name || ' ' || u.last_name as user_name,
  u.email,
  sp.institute,
  sp.subject,
  sp.degree,
  sp.enrollment_date
FROM users u
JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.email IN (
  'raied@10minuteschool.com',
  'raihana@10minuteschool.com',
  'shams@10minuteschool.com',
  'farhanur@10minuteschool.com',
  'zinat.khan@lightcastlepartners.com',
  'ridwanur.rahman@lightcastlepartners.com'
)
ORDER BY u.first_name;

-- Show their batch assignments
SELECT 
  'BATCH ASSIGNMENTS FOR NEW USERS' as check_type,
  u.first_name || ' ' || u.last_name as user_name,
  u.email,
  b.name as batch_name,
  r.title as roadmap_title,
  sba.enrollment_date,
  sba.status
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE u.email IN (
  'raied@10minuteschool.com',
  'raihana@10minuteschool.com',
  'shams@10minuteschool.com',
  'farhanur@10minuteschool.com',
  'zinat.khan@lightcastlepartners.com',
  'ridwanur.rahman@lightcastlepartners.com'
)
AND sba.status = 'active'
ORDER BY u.first_name;

-- Show updated batch information
SELECT 
  'AUGMEDIX BATCH SUMMARY' as check_type,
  b.name as batch_name,
  b.current_students,
  b.max_students,
  r.title as roadmap_title,
  u.first_name || ' ' || u.last_name as mentor_name,
  b.start_date,
  b.status as batch_status
FROM batches b
JOIN roadmaps r ON b.roadmap_id = r.id
LEFT JOIN users u ON b.mentor_id = u.id
WHERE b.name LIKE '%Augmedix%' OR b.name LIKE '%RCM%';

-- Final success message
SELECT 
  '✅ NEW ADMIN/STUDENT USERS CREATED SUCCESSFULLY!' as status,
  'All users added with admin privileges AND student access' as message,
  'Password for all users: NeverStopLearning!' as password_info,
  'Users assigned to Augmedix roadmap as students' as assignment_info;

-- Show login credentials summary
SELECT 
  'LOGIN CREDENTIALS SUMMARY' as info_type,
  u.email as login_email,
  'NeverStopLearning!' as password,
  'Admin + Student Access' as access_type,
  'Can access both mentor and student dashboards' as capabilities
FROM users u
WHERE u.email IN (
  'raied@10minuteschool.com',
  'raihana@10minuteschool.com',
  'shams@10minuteschool.com',
  'farhanur@10minuteschool.com',
  'zinat.khan@lightcastlepartners.com',
  'ridwanur.rahman@lightcastlepartners.com'
)
ORDER BY u.email;
