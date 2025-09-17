-- SQL Script to make user mukit@10minuteschool.com a mentor
-- Run this script in your Supabase SQL editor

-- Step 1: Update user role to mentor
UPDATE users 
SET role = 'mentor' 
WHERE email = 'mukit@10minuteschool.com';

-- Step 2: Create mentor profile
INSERT INTO mentor_profiles (
  user_id,
  organization,
  designation,
  expertise_areas,
  bio,
  years_of_experience,
  created_at,
  updated_at
)
SELECT 
  id,
  '10 Minute School',
  'Senior Python Developer & Educator',
  ARRAY['Python Programming', 'Data Science', 'Web Development', 'Machine Learning'],
  'Experienced Python developer and educator with expertise in programming fundamentals and data analysis.',
  3,
  NOW(),
  NOW()
FROM users 
WHERE email = 'mukit@10minuteschool.com'
ON CONFLICT DO NOTHING;

-- Step 3: Verify the changes
SELECT 
  u.email,
  u.role,
  u.first_name,
  u.last_name,
  mp.organization,
  mp.designation,
  mp.expertise_areas,
  mp.bio,
  mp.years_of_experience
FROM users u
LEFT JOIN mentor_profiles mp ON u.id = mp.user_id
WHERE u.email = 'mukit@10minuteschool.com';

-- Step 4: If you want to assign this mentor to a specific batch, uncomment and modify:
-- UPDATE batches 
-- SET mentor_id = (SELECT id FROM users WHERE email = 'mukit@10minuteschool.com')
-- WHERE name LIKE '%Python%' OR name LIKE '%Batch%'
-- LIMIT 1;
