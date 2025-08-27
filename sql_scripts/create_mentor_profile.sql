-- Step 1: Create Mentor Profile for Uttam Deb
-- This script creates the mentor user and profile

-- First, let's create the user record
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
) VALUES (
  gen_random_uuid(),
  'uttam@10minuteschool.com',
  crypt('NeverStopLearning!', gen_salt('bf')),
  'mentor',
  'Uttam',
  'Deb',
  true,
  true,
  NOW(),
  NOW()
);

-- Get the user ID we just created
DO $$
DECLARE
  mentor_user_id UUID;
BEGIN
  -- Get the user ID for Uttam
  SELECT id INTO mentor_user_id 
  FROM users 
  WHERE email = 'uttam@10minuteschool.com';
  
  -- Create the mentor profile
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
  ) VALUES (
    gen_random_uuid(),
    mentor_user_id,
    '10 Minute School',
    'Senior BI Executive',
    ARRAY['Python', 'Data Analysis', 'SQL'],
    'Experienced BI Executive with expertise in data analysis, Python programming, and SQL database management.',
    5,
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Mentor profile created successfully for user ID: %', mentor_user_id;
END $$;

-- Verify the mentor was created
SELECT 
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  mp.organization,
  mp.designation,
  mp.expertise_areas,
  mp.years_of_experience
FROM users u
JOIN mentor_profiles mp ON u.id = mp.user_id
WHERE u.email = 'uttam@10minuteschool.com';
