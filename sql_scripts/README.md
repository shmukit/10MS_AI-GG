# SQL Scripts for Student-Batch Relationship Fix

## Overview
This directory contains SQL scripts to fix the student-batch relationship issue and enable students to be enrolled in multiple batches simultaneously.

## Problem Description
The original database schema had a limitation where students could only be enrolled in one batch at a time through the `student_profiles.batch_id` field. This prevented students from participating in multiple roadmaps or programs concurrently.

## Solution
We've implemented a many-to-many relationship between students and batches using a new junction table called `student_batch_assignments`.

## Scripts Execution Order

### 1. First, run the main fix script:
```bash
psql -h your_host -U your_user -d your_database -f fix_student_batch_relationship.sql
```

This script will:
- Create the new `student_batch_assignments` table
- Migrate existing data from `student_profiles.batch_id`
- Add Mukit to the Augmedix RCM Specialist Batch 1
- Update batch student counts

### 2. Verify the migration was successful:
```bash
psql -h your_host -U your_user -d your_database -f add_mukit_to_augmedix_batch.sql
```

This script will:
- Verify Mukit's enrollment in the specified batch
- Show all batches Mukit is enrolled in
- Display updated batch information

### 3. (Optional) Remove the old column after verification:
```bash
psql -h your_host -U your_user -d your_database -f remove_old_batch_id_column.sql
```

**⚠️ WARNING**: Only run this after confirming all data has been successfully migrated!

## What Each Script Does

### `fix_student_batch_relationship.sql`
- Creates the new `student_batch_assignments` table
- Migrates existing student-batch relationships
- Adds Mukit to the Augmedix RCM Specialist Batch 1
- Updates batch student counts

### `add_mukit_to_augmedix_batch.sql`
- Specifically handles adding Mukit to the specified batch
- Includes comprehensive verification queries
- Shows enrollment status and progress

### `remove_old_batch_id_column.sql`
- Safely removes the old `batch_id` column from `student_profiles`
- Includes safety checks to prevent data loss
- Should only be run after successful migration verification

## New Database Structure

### Before (Old Structure)
```
student_profiles
├── user_id
├── batch_id (single batch only)
├── progress_percentage
├── completed_weeks
└── ...
```

### After (New Structure)
```
student_profiles (no batch_id field)
└── user_id, institute, year, subject, degree, ...

student_batch_assignments (NEW TABLE)
├── student_id
├── batch_id
├── enrollment_date
├── status
├── progress_percentage
├── completed_weeks
└── ...
```

## Benefits of New Structure

1. **Multiple Enrollments**: Students can join multiple batches simultaneously
2. **Independent Progress**: Each enrollment maintains its own progress metrics
3. **Flexible Status**: Each enrollment can have different statuses (active, completed, dropped, suspended)
4. **Scalability**: Easy to add new enrollments without affecting existing ones
5. **Better Analytics**: Track student participation across multiple programs

## Verification Queries

After running the scripts, you can verify the setup with these queries:

### Check Mukit's enrollments:
```sql
SELECT 
  u.first_name || ' ' || u.last_name as student_name,
  b.name as batch_name,
  r.title as roadmap_title,
  sba.status as enrollment_status
FROM student_batch_assignments sba
JOIN users u ON sba.student_id = u.id
JOIN batches b ON sba.batch_id = b.id
JOIN roadmaps r ON b.roadmap_id = r.id
WHERE u.email = 'mukit@10minuteschool.com';
```

### Check batch student counts:
```sql
SELECT 
  b.name as batch_name,
  b.current_students,
  b.max_students
FROM batches b
WHERE b.name = 'Augmedix RCM Specialist Batch 1';
```

## Rollback Plan

If you need to rollback the changes:

1. **Restore the old structure**:
   ```sql
   ALTER TABLE student_profiles ADD COLUMN batch_id UUID REFERENCES batches(id);
   ```

2. **Migrate data back**:
   ```sql
   UPDATE student_profiles sp
   SET batch_id = sba.batch_id
   FROM student_batch_assignments sba
   WHERE sp.user_id = sba.student_id
     AND sba.status = 'active';
   ```

3. **Drop the new table**:
   ```sql
   DROP TABLE IF EXISTS student_batch_assignments;
   ```

## Support

If you encounter any issues during the migration:
1. Check the PostgreSQL logs for error messages
2. Verify that all required tables exist
3. Ensure you have the necessary permissions
4. Test the scripts on a development database first
