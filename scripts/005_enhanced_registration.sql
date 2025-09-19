-- Enhanced Registration System Updates
-- Adds support for comprehensive student registration with emergency contacts

-- Add emergency contact fields to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS emergency_contact_email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_guardian_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_guardian_phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_guardian_email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS blood_group TEXT;

-- Create student documents table for document management
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('admission_letter', 'fee_receipt', 'id_card', 'transcript', 'certificate', 'medical', 'other')),
  file_url TEXT,
  uploaded_by UUID REFERENCES public.users(id),
  upload_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.users(id),
  verification_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding tracking table
CREATE TABLE IF NOT EXISTS public.student_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  registration_completed BOOLEAN DEFAULT FALSE,
  password_setup_completed BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  documents_uploaded BOOLEAN DEFAULT FALSE,
  orientation_attended BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for new tables
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_documents table
CREATE POLICY "Students can view their own documents" ON public.student_documents
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Accountant and admin can manage all documents" ON public.student_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('accountant', 'administrator')
    )
  );

-- RLS Policies for student_onboarding table
CREATE POLICY "Students can view their own onboarding status" ON public.student_onboarding
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Accountant and admin can manage onboarding" ON public.student_onboarding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('accountant', 'administrator')
    )
  );

-- Create function to automatically create onboarding record for new students
CREATE OR REPLACE FUNCTION create_student_onboarding()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' THEN
    INSERT INTO public.student_onboarding (student_id, registration_completed)
    VALUES (NEW.id, TRUE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create onboarding record
DROP TRIGGER IF EXISTS trigger_create_student_onboarding ON public.users;
CREATE TRIGGER trigger_create_student_onboarding
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_student_onboarding();

-- Create function to update onboarding progress
CREATE OR REPLACE FUNCTION update_onboarding_progress(
  student_id_param UUID,
  step_name TEXT,
  completed BOOLEAN DEFAULT TRUE
)
RETURNS VOID AS $$
BEGIN
  CASE step_name
    WHEN 'password_setup' THEN
      UPDATE public.student_onboarding 
      SET password_setup_completed = completed, updated_at = NOW()
      WHERE student_id = student_id_param;
    WHEN 'profile' THEN
      UPDATE public.student_onboarding 
      SET profile_completed = completed, updated_at = NOW()
      WHERE student_id = student_id_param;
    WHEN 'documents' THEN
      UPDATE public.student_onboarding 
      SET documents_uploaded = completed, updated_at = NOW()
      WHERE student_id = student_id_param;
    WHEN 'orientation' THEN
      UPDATE public.student_onboarding 
      SET orientation_attended = completed, updated_at = NOW()
      WHERE student_id = student_id_param;
  END CASE;

  -- Check if all steps are completed and update overall status
  UPDATE public.student_onboarding 
  SET 
    onboarding_completed = (
      password_setup_completed AND 
      profile_completed AND 
      documents_uploaded AND 
      orientation_attended
    ),
    completion_date = CASE 
      WHEN (password_setup_completed AND profile_completed AND documents_uploaded AND orientation_attended) 
      THEN CURRENT_DATE 
      ELSE NULL 
    END,
    updated_at = NOW()
  WHERE student_id = student_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON public.student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_type ON public.student_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_student_onboarding_student_id ON public.student_onboarding(student_id);
CREATE INDEX IF NOT EXISTS idx_student_onboarding_completed ON public.student_onboarding(onboarding_completed);

-- Insert sample document types for reference
INSERT INTO public.student_documents (student_id, document_name, document_type, uploaded_by, is_verified)
SELECT 
  u.id,
  'Sample Admission Letter',
  'admission_letter',
  (SELECT id FROM public.users WHERE role = 'accountant' LIMIT 1),
  TRUE
FROM public.users u 
WHERE u.role = 'student' 
AND NOT EXISTS (
  SELECT 1 FROM public.student_documents sd 
  WHERE sd.student_id = u.id AND sd.document_type = 'admission_letter'
)
LIMIT 3;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
