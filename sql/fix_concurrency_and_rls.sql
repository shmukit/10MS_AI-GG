-- =====================================================
-- Phase 1: Concurrency & Security Hardening
-- =====================================================

BEGIN;

-- 1. Create Atomic XP Increment Function
CREATE OR REPLACE FUNCTION increment_student_xp(
    p_student_id UUID,
    p_batch_id UUID,
    p_points INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.student_batch_assignments
    SET 
        xp_points = COALESCE(xp_points, 0) + p_points,
        updated_at = NOW()
    WHERE student_id = p_student_id
      AND batch_id = p_batch_id
      AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Harden RLS Policies for student_progress
DROP POLICY IF EXISTS "Student progress viewable by owner, staff, or peers" ON public.student_progress;

CREATE POLICY "Student progress viewable by owner, staff, peers, or public" ON public.student_progress
FOR SELECT TO authenticated, anon
USING (
    (SELECT auth.uid()) = student_id 
    OR is_admin_or_mentor()
    OR (
        -- Peers in the same active batch
        auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM public.student_batch_assignments s1
            WHERE s1.student_id = (SELECT auth.uid())
              AND s1.batch_id IN (
                  SELECT batch_id FROM public.student_batch_assignments s2 
                  WHERE s2.student_id = student_progress.student_id AND s2.status = 'active'
              )
              AND s1.status = 'active'
        )
    )
);

-- 3. Harden RLS Policies for student_profiles
DROP POLICY IF EXISTS "Student profiles viewable by owner, staff, or peers" ON public.student_profiles;

CREATE POLICY "Student profiles viewable by owner, staff, peers, or public" ON public.student_profiles
FOR SELECT TO authenticated, anon
USING (
    (SELECT auth.uid()) = user_id 
    OR is_admin_or_mentor()
    OR auth.role() = 'anon' -- Allow public to see basic profile for certificates
    OR (
        -- Peers in same batch
        auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM public.student_batch_assignments s1
            WHERE s1.student_id = (SELECT auth.uid())
              AND s1.batch_id IN (
                  SELECT batch_id FROM public.student_batch_assignments s2 
                  WHERE s2.student_id = student_profiles.user_id AND s2.status = 'active'
              )
              AND s1.status = 'active'
        )
    )
);

-- 4. Harden RLS Policies for student_batch_assignments
DROP POLICY IF EXISTS "Assignments viewable by owner, staff, or peers" ON public.student_batch_assignments;

CREATE POLICY "Assignments viewable by owner, staff, peers, or public" ON public.student_batch_assignments
FOR SELECT TO authenticated, anon
USING (
    (SELECT auth.uid()) = student_id 
    OR is_admin_or_mentor()
    OR auth.role() = 'anon' -- Allow public verification
    OR (
        -- Peer check
        auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM public.student_batch_assignments s1
            WHERE s1.student_id = (SELECT auth.uid())
              AND s1.batch_id = student_batch_assignments.batch_id
              AND s1.status = 'active'
              AND student_batch_assignments.status = 'active'
        )
    )
);

COMMIT;
