-- Step 11: Create Sample Notices for the Batch

-- Get the batch ID and mentor ID
-- SELECT b.id as batch_id, u.id as mentor_id FROM batches b JOIN users u ON b.mentor_id = u.id WHERE b.name = 'Augmedix RCM Specialist Batch 1';

-- Notice 1: Welcome Message
INSERT INTO notices (
  id,
  title,
  content,
  author_id,
  batch_id,
  tag,
  priority,
  is_published,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Welcome to Revenue Cycle Management Specialist Program!',
  'Welcome everyone to the Augmedix RCM Specialist program! This is an exciting 6-week journey where you will learn Excel, SQL, and English skills essential for revenue cycle management roles. Please review the Week 1 materials and join our orientation session on September 3rd.',
  (SELECT u.id FROM users u JOIN batches b ON b.mentor_id = u.id WHERE b.name = 'Augmedix RCM Specialist Batch 1'),
  (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
  'Welcome',
  'high',
  true,
  NOW(),
  NOW()
);

-- Notice 2: Week 1 Reminder
INSERT INTO notices (
  id,
  title,
  content,
  author_id,
  batch_id,
  tag,
  priority,
  is_published,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Week 1 Materials Available - Deadline: September 9th',
  'All Week 1 materials are now available in your dashboard. Please complete the Excel introduction, SQL basics, and English foundation tasks by September 9th. Don''t forget to join our orientation session!',
  (SELECT u.id FROM users u JOIN batches b ON b.mentor_id = u.id WHERE b.name = 'Augmedix RCM Specialist Batch 1'),
  (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
  'Reminder',
  'medium',
  true,
  NOW(),
  NOW()
);

-- Notice 3: Zoom Session Reminder
INSERT INTO notices (
  id,
  title,
  content,
  author_id,
  batch_id,
  tag,
  priority,
  is_published,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Orientation Session - September 3rd at 3:00 PM',
  'Join us for the program orientation session where we will introduce ourselves, discuss program goals, and walk through the learning resources. This session is mandatory for all participants.',
  (SELECT u.id FROM users u JOIN batches b ON b.mentor_id = u.id WHERE b.name = 'Augmedix RCM Specialist Batch 1'),
  (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1'),
  'Meeting',
  'urgent',
  true,
  NOW(),
  NOW()
);

-- Verify notices were created
SELECT 
  n.title,
  n.tag,
  n.priority,
  n.created_at,
  u.first_name || ' ' || u.last_name as author_name
FROM notices n
JOIN users u ON n.author_id = u.id
WHERE n.batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
ORDER BY n.created_at DESC;
