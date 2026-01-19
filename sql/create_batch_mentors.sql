-- Create batch_mentors junction table to support multiple mentors per batch
CREATE TABLE IF NOT EXISTS batch_mentors (
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (batch_id, mentor_id)
);

-- Enable RLS
ALTER TABLE batch_mentors ENABLE ROW LEVEL SECURITY;

-- Policies for batch_mentors
CREATE POLICY "Public read access to batch_mentors" 
    ON batch_mentors FOR SELECT 
    USING (true);

CREATE POLICY "Admins can manage batch_mentors" 
    ON batch_mentors FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Migrate existing mentor_id data from batches to batch_mentors if any
INSERT INTO batch_mentors (batch_id, mentor_id)
SELECT id, mentor_id FROM batches WHERE mentor_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_batch_mentors_batch_id ON batch_mentors(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_mentors_mentor_id ON batch_mentors(mentor_id);
