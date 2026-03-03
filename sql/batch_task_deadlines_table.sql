-- Create table for batch-specific roadmap task deadlines
CREATE TABLE IF NOT EXISTS public.batch_task_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.roadmap_tasks(id) ON DELETE CASCADE,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(batch_id, task_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batch_task_deadlines_batch ON public.batch_task_deadlines(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_task_deadlines_task ON public.batch_task_deadlines(task_id);

-- Enable RLS
ALTER TABLE public.batch_task_deadlines ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read batch deadlines"
    ON public.batch_task_deadlines FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admins to manage batch deadlines"
    ON public.batch_task_deadlines FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND (users.role = 'admin' OR users.role = 'mentor')
        )
    );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_batch_task_deadlines_updated_at ON public.batch_task_deadlines;
CREATE TRIGGER update_batch_task_deadlines_updated_at
    BEFORE UPDATE ON public.batch_task_deadlines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
