-- Fix roadmap_tasks table schema for mentor task creation
-- This script adds missing columns that the frontend expects

-- =================================================================
-- Add missing columns to roadmap_tasks table
-- =================================================================

-- Add is_active column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'roadmap_tasks' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE roadmap_tasks ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to roadmap_tasks table';
    ELSE
        RAISE NOTICE 'is_active column already exists in roadmap_tasks table';
    END IF;
END $$;

-- Add meeting_time column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'roadmap_tasks' AND column_name = 'meeting_time'
    ) THEN
        ALTER TABLE roadmap_tasks ADD COLUMN meeting_time TIME;
        RAISE NOTICE 'Added meeting_time column to roadmap_tasks table';
    ELSE
        RAISE NOTICE 'meeting_time column already exists in roadmap_tasks table';
    END IF;
END $$;

-- Update existing tasks to have is_active = true by default
DO $$
BEGIN
    -- Update any existing tasks to be active
    UPDATE roadmap_tasks SET is_active = true WHERE is_active IS NULL;
    RAISE NOTICE 'Updated existing tasks to be active';
END $$;

-- =================================================================
-- Verify the schema changes
-- =================================================================

-- Show the current schema of roadmap_tasks table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'roadmap_tasks' 
ORDER BY ordinal_position;

-- Success message
SELECT '✅ roadmap_tasks schema updated successfully!' as status;
