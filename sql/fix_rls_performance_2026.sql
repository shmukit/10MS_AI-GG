-- =====================================================
-- Fix RLS Performance (auth_rls_initplan & multiple_permissive_policies)
-- =====================================================

BEGIN;

-- =====================================================
-- 1. DROP ALL OVERLAPPING POLICIES
-- =====================================================

-- users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile by email" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

-- student_profiles
DROP POLICY IF EXISTS "Insert student profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles insertable by authenticated" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles insertable by owner and admin" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles viewable by authenticated" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles viewable by owner and admin" ON public.student_profiles;
DROP POLICY IF EXISTS "View student profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles updatable by owner and admin" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles updatable by owner or email match" ON public.student_profiles;
DROP POLICY IF EXISTS "Update student profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are viewable by owner" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are insertable by owner" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles are updatable by owner" ON public.student_profiles;

-- mentor_profiles
DROP POLICY IF EXISTS "Mentor profiles are viewable by everyone" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles viewable by owner and admin" ON public.mentor_profiles;
DROP POLICY IF EXISTS "View mentor profiles" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles updatable by owner and admin" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Update mentor profiles" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Insert mentor profiles" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are viewable by all authenticated users" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are insertable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are updatable by owner" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles are viewable by owner" ON public.mentor_profiles;

-- student_progress
DROP POLICY IF EXISTS "Insert student progress" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress insertable by owner and admin" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress viewable by owner and admin" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress viewable by owner and mentors" ON public.student_progress;
DROP POLICY IF EXISTS "View student progress" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress updatable by owner and admin" ON public.student_progress;
DROP POLICY IF EXISTS "Update student progress" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is insertable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is updatable by owner" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress is viewable by owner" ON public.student_progress;

-- student_batch_assignments
DROP POLICY IF EXISTS "Admins can manage batch assignments" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments managed by mentors and admins" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Manage student batch assignments" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Admins can view all batch assignments" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by owner and staff" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "View student batch assignments" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by owner" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments viewable by mentors and admins" ON public.student_batch_assignments;

-- student_card_mastery
DROP POLICY IF EXISTS "Users can update own card mastery" ON public.student_card_mastery;
DROP POLICY IF EXISTS "Users can view own card mastery" ON public.student_card_mastery;

-- student_certificates
DROP POLICY IF EXISTS "Mentors and admins can issue certificates" ON public.student_certificates;
DROP POLICY IF EXISTS "Public read access to certificates" ON public.student_certificates;
DROP POLICY IF EXISTS "Students can view their own certificates" ON public.student_certificates;

-- batches
DROP POLICY IF EXISTS "Batches are managed by mentors and admins" ON public.batches;
DROP POLICY IF EXISTS "Manage batches" ON public.batches;
DROP POLICY IF EXISTS "Batches are viewable by everyone" ON public.batches;
DROP POLICY IF EXISTS "Batches viewable by authenticated users" ON public.batches;
DROP POLICY IF EXISTS "View batches" ON public.batches;

-- batch_mentors
DROP POLICY IF EXISTS "Admins can manage batch_mentors" ON public.batch_mentors;
DROP POLICY IF EXISTS "Manage batch mentors" ON public.batch_mentors;
DROP POLICY IF EXISTS "Public read access to batch_mentors" ON public.batch_mentors;
DROP POLICY IF EXISTS "View batch mentors" ON public.batch_mentors;

-- batch_task_deadlines
DROP POLICY IF EXISTS "Allow admins to manage batch deadlines" ON public.batch_task_deadlines;
DROP POLICY IF EXISTS "Allow authenticated users to read batch deadlines" ON public.batch_task_deadlines;

-- roadmaps
DROP POLICY IF EXISTS "Admins can insert roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Manage roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps are viewable by everyone" ON public.roadmaps;
DROP POLICY IF EXISTS "View roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Admins can update roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps are viewable by all authenticated users" ON public.roadmaps;

-- roadmap_weeks
DROP POLICY IF EXISTS "Manage roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Mentors and Admins can insert roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap weeks are viewable by everyone" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "View roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Mentors and Admins can update roadmap weeks" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap weeks are viewable by all authenticated users" ON public.roadmap_weeks;

-- roadmap_tasks
DROP POLICY IF EXISTS "Admins can insert roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Manage roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Roadmap tasks are viewable by everyone" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "View roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Admins can update roadmap tasks" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Roadmap tasks are viewable by all authenticated users" ON public.roadmap_tasks;

-- practice_decks
DROP POLICY IF EXISTS "Manage practice decks" ON public.practice_decks;
DROP POLICY IF EXISTS "Mentors can create decks" ON public.practice_decks;
DROP POLICY IF EXISTS "Anyone can view public decks" ON public.practice_decks;
DROP POLICY IF EXISTS "View practice decks" ON public.practice_decks;

-- practice_cards
DROP POLICY IF EXISTS "Manage practice cards" ON public.practice_cards;
DROP POLICY IF EXISTS "Mentors manage cards" ON public.practice_cards;
DROP POLICY IF EXISTS "View cards if deck is visible" ON public.practice_cards;
DROP POLICY IF EXISTS "View practice cards" ON public.practice_cards;

-- live_sessions
DROP POLICY IF EXISTS "Manage live sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "Mentors manage sessions" ON public.live_sessions;
DROP POLICY IF EXISTS "View live sessions" ON public.live_sessions;

-- notices
DROP POLICY IF EXISTS "Manage notices" ON public.notices;
DROP POLICY IF EXISTS "Notices are managed by mentors and admins" ON public.notices;
DROP POLICY IF EXISTS "View notices" ON public.notices;
DROP POLICY IF EXISTS "Notices are viewable by all authenticated users" ON public.notices;

-- Drop policies created by this script (for idempotency)
DROP POLICY IF EXISTS "Users viewable by authenticated users" ON public.users;
DROP POLICY IF EXISTS "Users updatable by owner, email, or admin" ON public.users;
DROP POLICY IF EXISTS "Student profiles viewable by authenticated users" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles insertable by owner or admin" ON public.student_profiles;
DROP POLICY IF EXISTS "Student profiles updatable by owner or admin" ON public.student_profiles;
DROP POLICY IF EXISTS "Mentor profiles viewable by authenticated users" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles insertable by owner or admin" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor profiles updatable by owner or admin" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Student progress viewable by authenticated users" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress insertable by owner or staff" ON public.student_progress;
DROP POLICY IF EXISTS "Student progress updatable by owner or staff" ON public.student_progress;
DROP POLICY IF EXISTS "Assignments viewable by authenticated users" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Assignments managed by staff" ON public.student_batch_assignments;
DROP POLICY IF EXISTS "Mastery viewable by owner" ON public.student_card_mastery;
DROP POLICY IF EXISTS "Mastery insertable by owner" ON public.student_card_mastery;
DROP POLICY IF EXISTS "Mastery updatable by owner" ON public.student_card_mastery;
DROP POLICY IF EXISTS "Certificates viewable by everyone" ON public.student_certificates;
DROP POLICY IF EXISTS "Certificates managed by staff" ON public.student_certificates;
DROP POLICY IF EXISTS "Batches viewable by authenticated users" ON public.batches;
DROP POLICY IF EXISTS "Batches managed by staff" ON public.batches;
DROP POLICY IF EXISTS "Batch mentors viewable by authenticated users" ON public.batch_mentors;
DROP POLICY IF EXISTS "Batch mentors managed by admins" ON public.batch_mentors;
DROP POLICY IF EXISTS "Batch task deadlines viewable by authenticated users" ON public.batch_task_deadlines;
DROP POLICY IF EXISTS "Batch task deadlines managed by admins" ON public.batch_task_deadlines;
DROP POLICY IF EXISTS "Roadmaps viewable by authenticated users" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps managed by admins" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmap weeks viewable by authenticated users" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap weeks managed by staff" ON public.roadmap_weeks;
DROP POLICY IF EXISTS "Roadmap tasks viewable by authenticated users" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Roadmap tasks managed by admins" ON public.roadmap_tasks;
DROP POLICY IF EXISTS "Practice decks viewable by authenticated users" ON public.practice_decks;
DROP POLICY IF EXISTS "Practice decks managed by staff" ON public.practice_decks;
DROP POLICY IF EXISTS "Practice cards viewable by authenticated users" ON public.practice_cards;
DROP POLICY IF EXISTS "Practice cards managed by staff" ON public.practice_cards;
DROP POLICY IF EXISTS "Live sessions viewable by authenticated users" ON public.live_sessions;
DROP POLICY IF EXISTS "Live sessions managed by staff" ON public.live_sessions;
DROP POLICY IF EXISTS "Notices viewable by authenticated users" ON public.notices;
DROP POLICY IF EXISTS "Notices managed by staff" ON public.notices;
DROP POLICY IF EXISTS "Student progress viewable by owner or staff" ON public.student_progress;
DROP POLICY IF EXISTS "Assignments viewable by owner or staff" ON public.student_batch_assignments;

-- =====================================================
-- 2. RECREATE CONSOLIDATED AND OPTIMIZED POLICIES
--    - Target explicitly to 'authenticated' to avoid anon overlaps
--    - Wrap auth functions in (SELECT ...)
-- =====================================================

-- users
CREATE POLICY "Users viewable by authenticated users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users updatable by owner, email, or admin" ON public.users FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = id OR (SELECT auth.jwt()->>'email') = email OR is_admin()
);

-- student_profiles
CREATE POLICY "Student profiles viewable by authenticated users" ON public.student_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Student profiles insertable by owner or admin" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);
CREATE POLICY "Student profiles updatable by owner or admin" ON public.student_profiles FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = user_id OR is_admin()
);

-- mentor_profiles
CREATE POLICY "Mentor profiles viewable by authenticated users" ON public.mentor_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mentor profiles insertable by owner or admin" ON public.mentor_profiles FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = user_id OR is_admin()
);
CREATE POLICY "Mentor profiles updatable by owner or admin" ON public.mentor_profiles FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = user_id OR is_admin()
);

-- student_progress
CREATE POLICY "Student progress viewable by authenticated users" ON public.student_progress FOR SELECT TO authenticated USING (true);
CREATE POLICY "Student progress insertable by owner or staff" ON public.student_progress FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = student_id OR is_admin_or_mentor()
);
CREATE POLICY "Student progress updatable by owner or staff" ON public.student_progress FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = student_id OR is_admin_or_mentor()
);

-- student_batch_assignments
CREATE POLICY "Assignments viewable by authenticated users" ON public.student_batch_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Assignments managed by staff" ON public.student_batch_assignments FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- student_card_mastery
CREATE POLICY "Mastery viewable by owner" ON public.student_card_mastery FOR SELECT TO authenticated USING (
    (SELECT auth.uid()) = student_id
);
CREATE POLICY "Mastery insertable by owner" ON public.student_card_mastery FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = student_id
);
CREATE POLICY "Mastery updatable by owner" ON public.student_card_mastery FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = student_id
);

-- student_certificates
CREATE POLICY "Certificates viewable by everyone" ON public.student_certificates FOR SELECT TO public USING (true);
CREATE POLICY "Certificates managed by staff" ON public.student_certificates FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- batches
CREATE POLICY "Batches viewable by authenticated users" ON public.batches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Batches managed by staff" ON public.batches FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- batch_mentors
CREATE POLICY "Batch mentors viewable by authenticated users" ON public.batch_mentors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Batch mentors managed by admins" ON public.batch_mentors FOR ALL TO authenticated USING (
    is_admin()
);

-- batch_task_deadlines
CREATE POLICY "Batch task deadlines viewable by authenticated users" ON public.batch_task_deadlines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Batch task deadlines managed by admins" ON public.batch_task_deadlines FOR ALL TO authenticated USING (
    is_admin()
);

-- roadmaps
CREATE POLICY "Roadmaps viewable by authenticated users" ON public.roadmaps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roadmaps managed by admins" ON public.roadmaps FOR ALL TO authenticated USING (
    is_admin()
);

-- roadmap_weeks
CREATE POLICY "Roadmap weeks viewable by authenticated users" ON public.roadmap_weeks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roadmap weeks managed by staff" ON public.roadmap_weeks FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- roadmap_tasks
CREATE POLICY "Roadmap tasks viewable by authenticated users" ON public.roadmap_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roadmap tasks managed by admins" ON public.roadmap_tasks FOR ALL TO authenticated USING (
    is_admin()
);

-- practice_decks
CREATE POLICY "Practice decks viewable by authenticated users" ON public.practice_decks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Practice decks managed by staff" ON public.practice_decks FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- practice_cards
CREATE POLICY "Practice cards viewable by authenticated users" ON public.practice_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Practice cards managed by staff" ON public.practice_cards FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- live_sessions
CREATE POLICY "Live sessions viewable by authenticated users" ON public.live_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Live sessions managed by staff" ON public.live_sessions FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

-- notices
CREATE POLICY "Notices viewable by authenticated users" ON public.notices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Notices managed by staff" ON public.notices FOR ALL TO authenticated USING (
    is_admin_or_mentor()
);

COMMIT;
