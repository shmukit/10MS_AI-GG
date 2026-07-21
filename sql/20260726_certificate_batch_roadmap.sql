-- Forward-fix: associate certificates with batch/roadmap enrollments.
-- Prior scripts: add_certificates_table.sql (student_id only, no cohort context).
-- Enables one certificate per student per batch for multi-roadmap students.

ALTER TABLE public.student_certificates
  ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_student_certificates_batch
  ON public.student_certificates (batch_id);

CREATE INDEX IF NOT EXISTS idx_student_certificates_roadmap
  ON public.student_certificates (roadmap_id);

-- At most one certificate of any type per student per batch (when batch is set).
CREATE UNIQUE INDEX IF NOT EXISTS student_certificates_student_batch_unique
  ON public.student_certificates (student_id, batch_id)
  WHERE batch_id IS NOT NULL;

-- Verification:
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'student_certificates'
-- ORDER BY ordinal_position;
--
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'student_certificates';
