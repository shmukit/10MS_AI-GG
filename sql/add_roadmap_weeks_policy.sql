-- Allow mentors/admins to update roadmap_weeks (for updating Domain)
-- Check if policy exists first to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'roadmap_weeks' 
        AND policyname = 'Mentors and Admins can update roadmap weeks'
    ) THEN
        CREATE POLICY "Mentors and Admins can update roadmap weeks" 
        ON roadmap_weeks 
        FOR UPDATE 
        USING (
            auth.role() = 'authenticated' AND (
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
            )
        )
        WITH CHECK (
            auth.role() = 'authenticated' AND (
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
            )
        );
        RAISE NOTICE 'Created update policy for roadmap_weeks';
    ELSE
        RAISE NOTICE 'Update policy for roadmap_weeks already exists';
    END IF;
    
    -- Also ensure insert policy exists if they need to create weeks
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'roadmap_weeks' 
        AND policyname = 'Mentors and Admins can insert roadmap weeks'
    ) THEN
        CREATE POLICY "Mentors and Admins can insert roadmap weeks" 
        ON roadmap_weeks 
        FOR INSERT 
        WITH CHECK (
            auth.role() = 'authenticated' AND (
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
            )
        );
        RAISE NOTICE 'Created insert policy for roadmap_weeks';
    END IF;
END $$;
