-- Step 1: Create the main roadmap
INSERT INTO roadmaps (
  id,
  title,
  description,
  total_weeks,
  difficulty_level,
  category,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Revenue Cycle Management Specialist, Augmedix',
  'Comprehensive training program covering Excel, SQL, and English skills for revenue cycle management roles at Augmedix. The program includes hands-on practice, assessments, and real-world applications.',
  6,
  'intermediate',
  'Healthcare Technology',
  true,
  NOW(),
  NOW()
);

-- Get the roadmap ID for reference
SELECT id, title FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix';

-- Step 2: Create a batch for this roadmap
INSERT INTO batches (
  name,
  roadmap_id,
  mentor_id,
  max_students,
  current_students,
  start_date,
  status,
  whatsapp_link,
  discord_link,
  emergency_contact,
  created_at,
  updated_at
) VALUES (
  'Augmedix Revenue Cycle Management - Batch 1',
  (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'),
  (SELECT id FROM users WHERE email = 'uttam.deb@10minuteschool.com'),
  30,
  0,
  '2025-01-01',
  'active',
  'https://chat.whatsapp.com/augmedix-batch1',
  'https://discord.gg/augmedix-batch1',
  '+8801234567890',
  NOW(),
  NOW()
);

-- Step 3: Create roadmap weeks for the Augmedix program
INSERT INTO roadmap_weeks (roadmap_id, week_number, title, description, domain) VALUES
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 1, 'Excel Fundamentals', 'Master Excel basics for data analysis and reporting', 'Excel Skills'),
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 2, 'SQL Database Management', 'Learn SQL for healthcare data querying and analysis', 'SQL Skills'),
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 3, 'Healthcare Revenue Cycle', 'Understanding the revenue cycle process and workflows', 'Healthcare Knowledge'),
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 4, 'Data Analysis & Reporting', 'Creating reports and analyzing healthcare data', 'Analytics'),
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 5, 'Communication Skills', 'Professional communication for healthcare settings', 'Soft Skills'),
((SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix'), 6, 'Final Project', 'Capstone project applying all learned skills', 'Project Work');

-- Step 4: Create sample tasks for Week 1
INSERT INTO roadmap_tasks (week_id, task_name, task_details, task_type, relevant_links, deadline, points) VALUES
((SELECT id FROM roadmap_weeks WHERE week_number = 1 AND roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')), 
 'Excel Basics Tutorial', 'Complete Excel fundamentals course', 'watch', ARRAY['https://youtube.com/excel-basics'], '2025-01-15', 10),
((SELECT id FROM roadmap_weeks WHERE week_number = 1 AND roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')), 
 'Excel Practice Exercise', 'Complete Excel practice workbook', 'exercise', ARRAY['https://example.com/excel-practice'], '2025-01-17', 15);

-- Success message
SELECT 'Augmedix roadmap and batch created successfully!' as status;
