-- Secure RLS Implementation
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on all tables where it was missing or disabled
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_batch_assignments ENABLE ROW LEVEL SECURITY;

-- Lock down backup tables (RLS enabled with no policies = no access)
ALTER TABLE public."public_users_backup_$" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."auth_users_backup_$" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure a clean slate and avoid conflicts
-- (We use IF EXISTS to make this script re-runnable)

-- Batches
DROP POLICY IF EXISTS "Batches are viewable by all authenticated users" ON public.batches;
DROP POLICY IF EXISTS "Batches are insertable by authenticated users" ON public.batches;

-- Mentor Profiles
DROP POLICY IF EXISTS "Mentor profiles are viewable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are insertable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are updatable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are viewable by all authenticated users" ON public.mentor_profiles;

-- Notices
DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON public.notices;
DROP POLICY IF EXISTS "Notices are deletable by authors and mentors" ON public.notices;
DROP POLICY IF EXISTS "Notices are insertable by authenticated users" ON public.notices;
DROP POLICY IF EXISTS "Notices are updatable by authors and mentors" ON public.notices;

-- Roadmaps & Content
DROP POLICY IF EXISTS "Public read access to roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps are viewable by all authenticated users" ON public.roadmaps;
DROP POLICY IF EXISTS "Public read access to roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap weeks are viewable by all authenticated users" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Public read access to roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Roadmap tasks are viewable by all authenticated users" ON public.roadmap_tasks;

-- Student Progress
DROP POLICY IF EXISTS "Student progress is viewable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is insertable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is updatable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress viewable by owner and mentors" ON public.student_progress;

-- Student Batch Assignments (New policies)
DROP POLICY IF EXISTS "Assignments viewable by owner" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by mentors and admins" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments managed by mentors and admins" ON public.student_batch_assignments;


-- 3. Create New Policies

-- === MENTOR PROFILES ===
-- Allow everyone to view mentors (required for student dashboard)
CREATE POLICY "Mentor profiles are viewable by all authenticated users" 
ON public.mentor_profiles FOR SELECT 
USING (auth.role() = 'authenticated');

-- Keep owner access for editing
CREATE POLICY "Mentor profiles are insertable by owner" 
ON public.mentor_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentor profiles are updatable by owner" 
ON public.mentor_profiles FOR UPDATE 
USING (auth.uid() = user_id);


-- === STUDENT PROGRESS ===
-- Requirement: Viewable by Owner (Student) AND Mentors/Admins
CREATE POLICY "Student progress viewable by owner and mentors" 
ON public.student_progress FOR SELECT 
USING (
    auth.uid() = student_id 
    OR 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('mentor', 'admin')
    )
);

-- Owner can insert/update their own progress
CREATE POLICY "Student progress is insertable by owner" 
ON public.student_progress FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Student progress is updatable by owner" 
ON public.student_progress FOR UPDATE 
USING (auth.uid() = student_id);


-- === STUDENT BATCH ASSIGNMENTS ===
-- New policies to ensure functionality
CREATE POLICY "Assignments viewable by owner" 
ON public.student_batch_assignments FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Assignments viewable by mentors and admins" 
ON public.student_batch_assignments FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('mentor', 'admin')
    )
);

CREATE POLICY "Assignments managed by mentors and admins" 
ON public.student_batch_assignments FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('mentor', 'admin')
    )
);


-- === BATCHES ===
-- Viewable by everyone
CREATE POLICY "Batches are viewable by all authenticated users" 
ON public.batches FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insertable/Updatable by Mentors/Admins only
CREATE POLICY "Batches are managed by mentors and admins"
ON public.batches FOR ALL
USING (
   EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('mentor', 'admin')
    )
);


-- === ROADMAPS & CONTENT ===
-- Viewable by everyone
CREATE POLICY "Roadmaps are viewable by all authenticated users" 
ON public.roadmaps FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Roadmap weeks are viewable by all authenticated users" 
ON public.roadmap_weeks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Roadmap tasks are viewable by all authenticated users" 
ON public.roadmap_tasks FOR SELECT USING (auth.role() = 'authenticated');


-- === NOTICES ===
-- Viewable by everyone
CREATE POLICY "Notices are viewable by all authenticated users" 
ON public.notices FOR SELECT USING (auth.role() = 'authenticated');

-- Manageable by Mentors/Admins
CREATE POLICY "Notices are managed by mentors and admins"
ON public.notices FOR ALL
USING (
   EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('mentor', 'admin')
    )
);


-- 4. Verification Query
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('student_progress', 'mentor_profiles', 'student_batch_assignments')
ORDER BY tablename;
