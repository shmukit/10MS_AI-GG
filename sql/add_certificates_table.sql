-- SQL Script to create certificates feature

-- 1. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.student_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    certificate_type VARCHAR(255) NOT NULL DEFAULT 'SheSTEM_Zoom_Completion',
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    public_url_slug VARCHAR(255) UNIQUE,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create RLS Policies
ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;

-- Mentors/Admins can insert
CREATE POLICY "Mentors and admins can issue certificates" ON public.student_certificates 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);

-- Students can read their own
CREATE POLICY "Students can view their own certificates" ON public.student_certificates 
FOR SELECT USING (auth.uid() = student_id);

-- Public can read any certificate (for the public sharing feature)
CREATE POLICY "Public read access to certificates" ON public.student_certificates 
FOR SELECT USING (true);

-- 3. Storage Bucket for Certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Certificates Bucket
-- Public read
CREATE POLICY "Public read for certificates bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'certificates');

-- Mentors/Admins can upload
CREATE POLICY "Mentors can upload certificates" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
CREATE POLICY "Mentors can update certificates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
CREATE POLICY "Mentors can delete certificates" ON storage.objects
FOR DELETE USING (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
);
