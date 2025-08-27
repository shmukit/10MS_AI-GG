-- Step 12: Comprehensive Verification

-- 1. Verify Roadmap
SELECT 
  'ROADMAP' as entity,
  id,
  title,
  total_weeks,
  difficulty_level,
  category,
  is_active
FROM roadmaps 
WHERE title = 'Revenue Cycle Management Specialist, Augmedix';

-- 2. Verify All Weeks
SELECT 
  'WEEKS' as entity,
  w.week_number,
  w.title,
  w.domain,
  COUNT(t.id) as task_count
FROM roadmap_weeks w
LEFT JOIN roadmap_tasks t ON w.id = t.week_id
WHERE w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
GROUP BY w.id, w.week_number, w.title, w.domain
ORDER BY w.week_number;

-- 3. Verify Task Distribution
SELECT 
  'TASK SUMMARY' as entity,
  t.task_type,
  COUNT(*) as count,
  SUM(t.points) as total_points,
  AVG(t.estimated_hours) as avg_hours
FROM roadmap_tasks t
JOIN roadmap_weeks w ON t.week_id = w.id
WHERE w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix')
GROUP BY t.task_type
ORDER BY count DESC;

-- 4. Verify Batch Setup
SELECT 
  'BATCH' as entity,
  b.name,
  b.start_date,
  b.end_date,
  b.status,
  b.current_students,
  b.max_students,
  r.title as roadmap_title,
  u.first_name || ' ' || u.last_name as mentor_name
FROM batches b
JOIN roadmaps r ON b.roadmap_id = r.id
JOIN users u ON b.mentor_id = u.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1';

-- 5. Verify Student Assignment
SELECT 
  'STUDENT' as entity,
  u.first_name || ' ' || u.last_name as student_name,
  u.email,
  sp.institute,
  sp.degree,
  sp.enrollment_date,
  sp.progress_percentage,
  b.name as batch_name
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
JOIN batches b ON sp.batch_id = b.id
WHERE u.email = 'mukit@10minuteschool.com';

-- 6. Verify Notices
SELECT 
  'NOTICES' as entity,
  n.title,
  n.tag,
  n.priority,
  n.created_at,
  u.first_name || ' ' || u.last_name as author_name
FROM notices n
JOIN users u ON n.author_id = u.id
WHERE n.batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
ORDER BY n.created_at DESC;

-- 7. Total Program Statistics
SELECT 
  'PROGRAM STATS' as entity,
  COUNT(DISTINCT w.id) as total_weeks,
  COUNT(t.id) as total_tasks,
  SUM(t.points) as total_points,
  SUM(t.estimated_hours) as total_hours,
  COUNT(DISTINCT t.task_type) as unique_task_types
FROM roadmap_weeks w
LEFT JOIN roadmap_tasks t ON w.id = t.week_id
WHERE w.roadmap_id = (SELECT id FROM roadmaps WHERE title = 'Revenue Cycle Management Specialist, Augmedix');
