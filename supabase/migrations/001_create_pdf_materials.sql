-- Create pdf_materials table
CREATE TABLE IF NOT EXISTS pdf_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  lecturer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lecturer_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  download_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pdf_materials_lecturer_id ON pdf_materials(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_pdf_materials_course_id ON pdf_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_pdf_materials_status ON pdf_materials(status);
CREATE INDEX IF NOT EXISTS idx_pdf_materials_upload_date ON pdf_materials(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_materials_lecturer_status ON pdf_materials(lecturer_id, status);
CREATE INDEX IF NOT EXISTS idx_pdf_materials_course_status ON pdf_materials(course_id, status);

-- Create function to increment download count atomically
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE pdf_materials
  SET download_count = download_count + 1,
      updated_at = NOW()
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE pdf_materials ENABLE ROW LEVEL SECURITY;

-- Policy: Lecturers can insert their own materials
CREATE POLICY "Lecturers can insert materials"
  ON pdf_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = lecturer_id);

-- Policy: Lecturers can view their own materials
CREATE POLICY "Lecturers can view own materials"
  ON pdf_materials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = lecturer_id);

-- Policy: Students can view materials from enrolled courses
-- Note: This assumes you have a user_courses table or similar
-- Adjust based on your actual schema
CREATE POLICY "Students can view course materials"
  ON pdf_materials
  FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND
    course_id IN (
      SELECT course_id FROM user_courses WHERE user_id = auth.uid()
    )
  );

-- Policy: Lecturers can update their own materials
CREATE POLICY "Lecturers can update own materials"
  ON pdf_materials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = lecturer_id)
  WITH CHECK (auth.uid() = lecturer_id);

-- Policy: Lecturers can delete (soft delete) their own materials
CREATE POLICY "Lecturers can delete own materials"
  ON pdf_materials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = lecturer_id AND status = 'active')
  WITH CHECK (auth.uid() = lecturer_id);

-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf-materials', 'pdf-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Lecturers can upload to their own folder
CREATE POLICY "Lecturers can upload PDFs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pdf-materials' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: Anyone authenticated can read PDFs
CREATE POLICY "Authenticated users can read PDFs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'pdf-materials');

-- Storage policy: Lecturers can delete their own PDFs
CREATE POLICY "Lecturers can delete own PDFs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pdf-materials' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
