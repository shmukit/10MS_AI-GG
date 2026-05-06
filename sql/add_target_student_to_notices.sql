-- Migration script to allow sending targeted notices to specific students
ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS target_student_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- This column allows the system to send direct notifications (like Certificate Issuance) 
-- that will only show up in the specific student's notice board, even if batch_id is NULL or set.
