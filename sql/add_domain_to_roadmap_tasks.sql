-- Add domain column to roadmap_tasks
ALTER TABLE roadmap_tasks 
ADD COLUMN IF NOT EXISTS domain VARCHAR(255);

-- Backfill domain from roadmap_weeks for existing tasks
UPDATE roadmap_tasks rt
SET domain = rw.domain
FROM roadmap_weeks rw
WHERE rt.week_id = rw.id
AND rt.domain IS NULL;

-- Set a default for any tasks that might still be null (optional, fallback)
UPDATE roadmap_tasks
SET domain = 'General'
WHERE domain IS NULL;

-- Verify the changes
SELECT id, task_name, domain FROM roadmap_tasks LIMIT 5;
