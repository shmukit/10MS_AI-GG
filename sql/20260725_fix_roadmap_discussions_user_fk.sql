-- Forward-fix: roadmap_discussions.user_id pointed at auth.users, so PostgREST
-- could not embed public.users profile fields → GET .../roadmap_discussions 400.
-- Also ensures RLS insert (auth.uid() = user_id) aligns with public.users ids.
-- Idempotent.

-- Drop any existing user_id FK (auth.users or otherwise)
DO $body$
DECLARE
  con_name TEXT;
BEGIN
  SELECT c.conname INTO con_name
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
    AND t.relname = 'roadmap_discussions'
    AND c.contype = 'f'
    AND pg_get_constraintdef(c.oid) ILIKE '%user_id%';

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.roadmap_discussions DROP CONSTRAINT %I', con_name);
  END IF;
END
$body$;

-- Orphan rows that cannot point at public.users
UPDATE public.roadmap_discussions d
SET user_id = NULL
WHERE d.user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = d.user_id);

DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'roadmap_discussions_user_id_fkey'
      AND conrelid = 'public.roadmap_discussions'::regclass
  ) THEN
    ALTER TABLE public.roadmap_discussions
      ADD CONSTRAINT roadmap_discussions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$body$;

-- Keep grants / RLS usable for authenticated app users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_discussions TO authenticated;

DROP POLICY IF EXISTS "View discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Create discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Update own discussions" ON public.roadmap_discussions;
DROP POLICY IF EXISTS "Delete own discussions" ON public.roadmap_discussions;

CREATE POLICY "View discussions" ON public.roadmap_discussions
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Create discussions" ON public.roadmap_discussions
FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Update own discussions" ON public.roadmap_discussions
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Delete own discussions" ON public.roadmap_discussions
FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ============ VERIFICATION ============
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'public.roadmap_discussions'::regclass AND contype = 'f';
--
-- SELECT polname, cmd FROM pg_policies WHERE tablename = 'roadmap_discussions';
