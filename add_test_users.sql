-- Add Test User for 10MS SheSTEM
-- Run this in your Supabase SQL Editor

-- 1. Add mukit as admin user (can access both student and mentor functions)
-- Note: You'll need to generate a proper password hash for 'NeverStopLearning!'
-- For now, using a placeholder. You can update this after running the script.
INSERT INTO users (email, password_hash, role, first_name, last_name, email_verified) VALUES
('mukit@10minuteschool.com', '$2a$10$example_hash_here', 'admin', 'Mukit', '10MS', true);

-- 2. Create admin profile for mukit
INSERT INTO mentor_profiles (user_id, organization, designation, expertise_areas, years_of_experience) VALUES
((SELECT id FROM users WHERE email = 'mukit@10minuteschool.com'), 
 '10 Minute School', 'System Administrator', 
 ARRAY['System Administration', 'Product Management', 'Vibe Coding'], 5);

-- 3. Create student profile for mukit (same user, different role context)
INSERT INTO student_profiles (user_id, institute, year, subject, degree, batch_id) VALUES
((SELECT id FROM users WHERE email = 'mukit@10minuteschool.com'), 
 '10 Minute School', 'Admin', 'Lead PM', 'MSc', 
 (SELECT id FROM batches LIMIT 1));

-- Success message
SELECT 'Test user created successfully!' as status;
