-- Verification Script for Bulk Student Additions
-- Run this after executing bulk_add_students_and_update_passwords.sql
-- to verify all students were added correctly

-- =================================================================
-- VERIFICATION 1: Check if all new students exist in users table
-- =================================================================

SELECT 
  '1. NEW STUDENTS IN USERS TABLE' as check_name,
  COUNT(*) as found_count,
  '4' as expected_count
FROM users 
WHERE email IN (
  'humayra1393@gmail.com',
  'aninditanitul@gmail.com', 
  'nishattasnim06ce@gmail.com',
  'zebasotota71318@gmail.com'
) AND role = 'student';

-- =================================================================
-- VERIFICATION 2: Check student profiles
-- =================================================================

SELECT 
  '2. NEW STUDENT PROFILES' as check_name,
  COUNT(*) as found_count,
  '4' as expected_count
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
WHERE u.email IN (
  'humayra1393@gmail.com',
  'aninditanitul@gmail.com', 
  'nishattasnim06ce@gmail.com',
  'zebasotota71318@gmail.com'
);

-- =================================================================
-- VERIFICATION 3: Check batch assignments
-- =================================================================

SELECT 
  '3. BATCH ASSIGNMENTS' as check_name,
  COUNT(*) as found_count,
  '4' as expected_count
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
WHERE u.email IN (
  'humayra1393@gmail.com',
  'aninditanitul@gmail.com', 
  'nishattasnim06ce@gmail.com',
  'zebasotota71318@gmail.com'
) AND b.name = 'Augmedix RCM Specialist Batch 1'
  AND sba.status = 'active';

-- =================================================================
-- VERIFICATION 4: Check password updates
-- =================================================================

SELECT 
  '4. STUDENTS WITH NEW PASSWORD' as check_name,
  COUNT(*) as students_with_new_password,
  (SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = true) as total_active_students
FROM users 
WHERE role = 'student' 
  AND password_hash = '$2a$10$NeverStopLearning!' 
  AND is_active = true;

-- =================================================================
-- VERIFICATION 5: Detailed view of new students
-- =================================================================

SELECT 
  '5. DETAILED NEW STUDENT INFO' as check_name,
  u.first_name || ' ' || u.last_name as full_name,
  u.email,
  u.phone,
  sp.institute,
  sp.subject,
  sp.degree,
  sp.year,
  CASE WHEN u.password_hash = '$2a$10$NeverStopLearning!' THEN '✅ Correct Password' ELSE '❌ Wrong Password' END as password_check,
  CASE WHEN sba.student_id IS NOT NULL THEN '✅ Assigned to Batch' ELSE '❌ Not Assigned' END as batch_assignment_check
FROM users u
JOIN student_profiles sp ON u.id = sp.user_id
LEFT JOIN student_batch_assignments sba ON u.id = sba.student_id 
  AND sba.batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
  AND sba.status = 'active'
WHERE u.email IN (
  'humayra1393@gmail.com',
  'aninditanitul@gmail.com', 
  'nishattasnim06ce@gmail.com',
  'zebasotota71318@gmail.com'
)
ORDER BY u.first_name;

-- =================================================================
-- VERIFICATION 6: Updated batch statistics
-- =================================================================

SELECT 
  '6. BATCH STATISTICS' as check_name,
  b.name as batch_name,
  b.current_students as recorded_count,
  actual_count.count as actual_active_students,
  CASE 
    WHEN b.current_students = actual_count.count THEN '✅ Count matches'
    ELSE '❌ Count mismatch'
  END as count_verification
FROM batches b
JOIN (
  SELECT 
    batch_id,
    COUNT(*) as count
  FROM student_batch_assignments 
  WHERE status = 'active'
    AND batch_id = (SELECT id FROM batches WHERE name = 'Augmedix RCM Specialist Batch 1')
  GROUP BY batch_id
) actual_count ON b.id = actual_count.batch_id
WHERE b.name = 'Augmedix RCM Specialist Batch 1';

-- =================================================================
-- VERIFICATION 7: All students in Augmedix batch (for complete overview)
-- =================================================================

SELECT 
  '7. ALL AUGMEDIX BATCH STUDENTS' as check_name,
  u.first_name || ' ' || u.last_name as student_name,
  u.email,
  sp.institute,
  sba.enrollment_date,
  sba.status,
  CASE 
    WHEN u.email IN ('humayra1393@gmail.com', 'aninditanitul@gmail.com', 'nishattasnim06ce@gmail.com', 'zebasotota71318@gmail.com')
    THEN '🆕 New Student'
    ELSE '👤 Existing Student'
  END as student_type
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN student_profiles sp ON u.id = sp.user_id
JOIN batches b ON sba.batch_id = b.id
WHERE b.name = 'Augmedix RCM Specialist Batch 1'
  AND sba.status = 'active'
ORDER BY 
  CASE WHEN u.email IN ('humayra1393@gmail.com', 'aninditanitul@gmail.com', 'nishattasnim06ce@gmail.com', 'zebasotota71318@gmail.com') THEN 0 ELSE 1 END,
  u.first_name;

-- =================================================================
-- FINAL STATUS SUMMARY
-- =================================================================

WITH verification_results AS (
  SELECT 
    (SELECT COUNT(*) FROM users WHERE email IN ('humayra1393@gmail.com', 'aninditanitul@gmail.com', 'nishattasnim06ce@gmail.com', 'zebasotota71318@gmail.com') AND role = 'student') as users_added,
    (SELECT COUNT(*) FROM student_profiles sp JOIN users u ON sp.user_id = u.id WHERE u.email IN ('humayra1393@gmail.com', 'aninditanitul@gmail.com', 'nishattasnim06ce@gmail.com', 'zebasotota71318@gmail.com')) as profiles_created,
    (SELECT COUNT(*) FROM student_batch_assignments sba JOIN users u ON sba.student_id = u.id WHERE u.email IN ('humayra1393@gmail.com', 'aninditanitul@gmail.com', 'nishattasnim06ce@gmail.com', 'zebasotota71318@gmail.com') AND sba.status = 'active') as batch_assignments,
    (SELECT COUNT(*) FROM users WHERE role = 'student' AND password_hash = '$2a$10$NeverStopLearning!' AND is_active = true) as students_with_new_password,
    (SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = true) as total_active_students
)
SELECT 
  'FINAL VERIFICATION SUMMARY' as summary,
  CASE 
    WHEN users_added = 4 AND profiles_created = 4 AND batch_assignments = 4 
    THEN '✅ ALL NEW STUDENTS SUCCESSFULLY ADDED'
    ELSE '❌ SOME STUDENTS MISSING - CHECK INDIVIDUAL VERIFICATIONS ABOVE'
  END as student_addition_status,
  CASE 
    WHEN students_with_new_password = total_active_students
    THEN '✅ ALL STUDENT PASSWORDS UPDATED'
    ELSE '⚠️ SOME PASSWORDS NOT UPDATED'
  END as password_update_status,
  users_added || '/4 users added' as users_status,
  profiles_created || '/4 profiles created' as profiles_status,
  batch_assignments || '/4 batch assignments' as assignments_status,
  students_with_new_password || '/' || total_active_students || ' passwords updated' as password_status
FROM verification_results;

-- Success message
SELECT 
  '🎉 VERIFICATION COMPLETE!' as message,
  'Review the results above to ensure all operations completed successfully.' as instruction;
