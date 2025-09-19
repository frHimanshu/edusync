-- Phase 2 Database Schema Updates
-- This script adds support for accountant role, first-time login workflow, and enhanced features

-- Update users table to support accountant role and first-time login
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('student', 'faculty', 'hostel_authority', 'administrator', 'accountant'));

-- Add first-time login and password management fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS temp_password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS home_address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS course TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS admission_year INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_hostel_resident BOOLEAN DEFAULT FALSE;

-- Create hostel rooms table for occupancy tracking
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_name TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  capacity INTEGER DEFAULT 2,
  occupied_count INTEGER DEFAULT 0,
  room_type TEXT DEFAULT 'double' CHECK (room_type IN ('single', 'double', 'triple')),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(block_name, room_number)
);

-- Create room assignments table
CREATE TABLE IF NOT EXISTS public.room_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  checkout_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee management table
CREATE TABLE IF NOT EXISTS public.fee_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('tuition', 'hostel', 'library', 'lab', 'exam', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'partial')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online', 'bank_transfer')),
  receipt_number TEXT,
  academic_year TEXT NOT NULL,
  semester TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student registration log table
CREATE TABLE IF NOT EXISTS public.student_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  registered_by UUID NOT NULL REFERENCES public.users(id),
  registration_date DATE DEFAULT CURRENT_DATE,
  academic_year TEXT NOT NULL,
  admission_type TEXT DEFAULT 'regular' CHECK (admission_type IN ('regular', 'lateral', 'transfer')),
  documents_verified BOOLEAN DEFAULT FALSE,
  fees_paid BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'dropped')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update announcements table to support priority and enhanced features
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' 
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'all'
  CHECK (target_audience IN ('all', 'students', 'faculty', 'hostel', 'department'));
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS department_filter TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS year_filter INTEGER;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security for new tables
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hostel_rooms table
CREATE POLICY "Everyone can view hostel rooms" ON public.hostel_rooms
  FOR SELECT USING (true);

CREATE POLICY "Hostel authority and admin can manage rooms" ON public.hostel_rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('hostel_authority', 'administrator')
    )
  );

-- RLS Policies for room_assignments table
CREATE POLICY "Students can view their own room assignments" ON public.room_assignments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Hostel authority and admin can manage room assignments" ON public.room_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('hostel_authority', 'administrator')
    )
  );

-- RLS Policies for fee_records table
CREATE POLICY "Students can view their own fee records" ON public.fee_records
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Accountant and admin can manage fee records" ON public.fee_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('accountant', 'administrator')
    )
  );

-- RLS Policies for student_registrations table
CREATE POLICY "Students can view their own registration" ON public.student_registrations
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Accountant and admin can manage registrations" ON public.student_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('accountant', 'administrator')
    )
  );

-- Update existing RLS policies to include accountant role where appropriate
DROP POLICY IF EXISTS "Faculty and admin can view all users" ON public.users;
CREATE POLICY "Faculty, admin, and accountant can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
    )
  );

DROP POLICY IF EXISTS "Faculty and admin can manage announcements" ON public.announcements;
CREATE POLICY "Faculty, admin, hostel, and accountant can manage announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
    )
  );

-- Insert sample hostel rooms data
INSERT INTO public.hostel_rooms (block_name, room_number, floor, capacity, occupied_count, room_type) VALUES
('Block A', '101', 1, 2, 2, 'double'),
('Block A', '102', 1, 2, 1, 'double'),
('Block A', '103', 1, 2, 0, 'double'),
('Block A', '201', 2, 2, 2, 'double'),
('Block A', '202', 2, 2, 1, 'double'),
('Block A', '203', 2, 2, 2, 'double'),
('Block B', '101', 1, 2, 1, 'double'),
('Block B', '102', 1, 2, 0, 'double'),
('Block B', '103', 1, 2, 2, 'double'),
('Block B', '201', 2, 2, 1, 'double'),
('Block B', '202', 2, 2, 2, 'double'),
('Block B', '203', 2, 2, 0, 'double'),
('Block C', '101', 1, 1, 1, 'single'),
('Block C', '102', 1, 1, 0, 'single'),
('Block C', '103', 1, 1, 1, 'single'),
('Block C', '201', 2, 3, 2, 'triple'),
('Block C', '202', 2, 3, 3, 'triple'),
('Block C', '203', 2, 3, 1, 'triple')
ON CONFLICT (block_name, room_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON public.users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON public.users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_first_login ON public.users(first_login);
CREATE INDEX IF NOT EXISTS idx_fee_records_student_id ON public.fee_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_status ON public.fee_records(payment_status);
CREATE INDEX IF NOT EXISTS idx_room_assignments_student_id ON public.room_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_room_assignments_active ON public.room_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_audience);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_hostel_occupancy_stats()
RETURNS TABLE (
  total_rooms INTEGER,
  occupied_rooms INTEGER,
  available_rooms INTEGER,
  occupancy_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_rooms,
    COUNT(CASE WHEN occupied_count > 0 THEN 1 END)::INTEGER as occupied_rooms,
    COUNT(CASE WHEN occupied_count = 0 THEN 1 END)::INTEGER as available_rooms,
    ROUND((COUNT(CASE WHEN occupied_count > 0 THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as occupancy_percentage
  FROM public.hostel_rooms;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_fee_collection_stats(academic_year_param TEXT DEFAULT NULL)
RETURNS TABLE (
  total_students INTEGER,
  fees_collected DECIMAL,
  pending_fees INTEGER,
  collection_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT student_id)::INTEGER as total_students,
    COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE 0 END), 0) as fees_collected,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END)::INTEGER as pending_fees,
    ROUND((COUNT(CASE WHEN payment_status = 'paid' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as collection_percentage
  FROM public.fee_records
  WHERE academic_year_param IS NULL OR academic_year = academic_year_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
