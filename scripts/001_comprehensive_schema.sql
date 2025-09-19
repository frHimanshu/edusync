-- =====================================================
-- EDU-SYNC ERP SYSTEM - COMPREHENSIVE DATABASE SCHEMA
-- =====================================================
-- This script creates all necessary tables for the complete ERP system
-- Run this script first to set up the database structure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'hostel_authority', 'accountant', 'hod', 'admin', 'librarian', 'tnp', 'sports')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_first_login BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hod_id UUID REFERENCES public.users(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 3,
  semester INTEGER,
  faculty_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STUDENT MANAGEMENT TABLES
-- =====================================================

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  semester INTEGER,
  year_of_admission INTEGER,
  date_of_birth DATE,
  address TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  blood_group TEXT,
  hostel_room_id UUID,
  ec_wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  tags TEXT[], -- For categorization (scholarship, sports, hostel_resident, etc.)
  fee_status TEXT CHECK (fee_status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty table
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  designation TEXT,
  qualification TEXT,
  experience_years INTEGER,
  subjects_assigned UUID[], -- Array of subject IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HOSTEL MANAGEMENT TABLES
-- =====================================================

-- Hostel Rooms table
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT NOT NULL UNIQUE,
  floor INTEGER,
  block TEXT,
  capacity INTEGER DEFAULT 2,
  current_occupancy INTEGER DEFAULT 0,
  room_type TEXT CHECK (room_type IN ('single', 'double', 'triple')) DEFAULT 'double',
  amenities TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update students table to reference hostel_rooms
ALTER TABLE public.students 
ADD CONSTRAINT fk_hostel_room 
FOREIGN KEY (hostel_room_id) REFERENCES public.hostel_rooms(id);

-- =====================================================
-- ACADEMIC MANAGEMENT TABLES
-- =====================================================

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id),
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  remarks TEXT,
  UNIQUE(student_id, subject_id, date)
);

-- Timetable table
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  semester INTEGER,
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic Sessions table
CREATE TABLE IF NOT EXISTS public.academic_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_name TEXT NOT NULL, -- e.g., "2024-25"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grades/Marks table
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.academic_sessions(id),
  exam_type TEXT CHECK (exam_type IN ('internal', 'mid_term', 'final', 'assignment', 'project')),
  marks_obtained DECIMAL(5,2),
  total_marks DECIMAL(5,2),
  grade TEXT,
  remarks TEXT,
  entered_by UUID REFERENCES public.faculty(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMUNICATION TABLES
-- =====================================================

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id),
  channel TEXT CHECK (channel IN ('all', 'students', 'faculty', 'hostel_residents', 'department_specific', 'placement', 'sports')) DEFAULT 'all',
  department_id UUID REFERENCES public.departments(id), -- For department-specific announcements
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FINANCIAL MANAGEMENT TABLES
-- =====================================================

-- Wallet Transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT, -- For external payment references
  processed_by UUID REFERENCES public.users(id), -- Staff who processed the transaction
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee Records table
CREATE TABLE IF NOT EXISTS public.fee_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.academic_sessions(id),
  fee_type TEXT NOT NULL, -- 'tuition', 'hostel', 'library', 'examination', etc.
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0.00,
  paid_date DATE,
  status TEXT CHECK (status IN ('pending', 'partial', 'paid', 'overdue')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DOCUMENT MANAGEMENT TABLES
-- =====================================================

-- Student Documents table
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'transcript', 'certificate', 'id_card', 'photo', etc.
  document_name TEXT NOT NULL,
  file_url TEXT, -- Supabase Storage URL
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LIBRARY MANAGEMENT TABLES
-- =====================================================

-- Library Books table
CREATE TABLE IF NOT EXISTS public.library_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  publisher TEXT,
  publication_year INTEGER,
  category TEXT,
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  location TEXT, -- Shelf location
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Issuances table
CREATE TABLE IF NOT EXISTS public.book_issuances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  issued_by UUID REFERENCES public.users(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE,
  status TEXT CHECK (status IN ('issued', 'returned', 'overdue', 'lost')) DEFAULT 'issued',
  fine_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PLACEMENT & CAREER SERVICES TABLES
-- =====================================================

-- Placement Drives table
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  requirements TEXT,
  salary_range TEXT,
  location TEXT,
  drive_date DATE,
  application_deadline DATE,
  eligibility_criteria TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Placements table
CREATE TABLE IF NOT EXISTS public.student_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES public.placement_drives(id) ON DELETE CASCADE,
  application_status TEXT CHECK (application_status IN ('applied', 'shortlisted', 'selected', 'rejected')) DEFAULT 'applied',
  interview_date DATE,
  offer_letter_url TEXT,
  package_offered DECIMAL(10,2),
  joining_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SYSTEM MANAGEMENT TABLES
-- =====================================================

-- System Settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

-- Student indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_semester ON public.students(semester);
CREATE INDEX IF NOT EXISTS idx_students_hostel_room ON public.students(hostel_room_id);
CREATE INDEX IF NOT EXISTS idx_students_fee_status ON public.students(fee_status);

-- Faculty indexes
CREATE INDEX IF NOT EXISTS idx_faculty_employee_id ON public.faculty(employee_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty(department_id);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_subject_date ON public.attendance(subject_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_faculty_date ON public.attendance(faculty_id, date);

-- Announcement indexes
CREATE INDEX IF NOT EXISTS idx_announcements_channel_active ON public.announcements(channel, is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_department ON public.announcements(department_id);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);

-- Financial indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_student ON public.wallet_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON public.wallet_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_fee_records_student ON public.fee_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_status ON public.fee_records(status);

-- Library indexes
CREATE INDEX IF NOT EXISTS idx_library_books_title ON public.library_books(title);
CREATE INDEX IF NOT EXISTS idx_library_books_author ON public.library_books(author);
CREATE INDEX IF NOT EXISTS idx_library_books_category ON public.library_books(category);
CREATE INDEX IF NOT EXISTS idx_book_issuances_student ON public.book_issuances(student_id);
CREATE INDEX IF NOT EXISTS idx_book_issuances_book ON public.book_issuances(book_id);
CREATE INDEX IF NOT EXISTS idx_book_issuances_status ON public.book_issuances(status);

-- Placement indexes
CREATE INDEX IF NOT EXISTS idx_placement_drives_company ON public.placement_drives(company_name);
CREATE INDEX IF NOT EXISTS idx_placement_drives_active ON public.placement_drives(is_active);
CREATE INDEX IF NOT EXISTS idx_student_placements_student ON public.student_placements(student_id);
CREATE INDEX IF NOT EXISTS idx_student_placements_drive ON public.student_placements(drive_id);

-- Timetable indexes
CREATE INDEX IF NOT EXISTS idx_timetable_day_time ON public.timetable(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_timetable_subject ON public.timetable(subject_id);
CREATE INDEX IF NOT EXISTS idx_timetable_faculty ON public.timetable(faculty_id);

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create audit log trigger function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- =====================================================
-- APPLY TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fee_records_updated_at BEFORE UPDATE ON public.fee_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON public.library_books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_issuances_updated_at BEFORE UPDATE ON public.book_issuances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_placement_drives_updated_at BEFORE UPDATE ON public.placement_drives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_placements_updated_at BEFORE UPDATE ON public.student_placements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log triggers (for critical tables)
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_students AFTER INSERT OR UPDATE OR DELETE ON public.students FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_faculty AFTER INSERT OR UPDATE OR DELETE ON public.faculty FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_wallet_transactions AFTER INSERT OR UPDATE OR DELETE ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_fee_records AFTER INSERT OR UPDATE OR DELETE ON public.fee_records FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC COMPREHENSIVE DATABASE SCHEMA CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Next step: Run 002_comprehensive_rls.sql to set up security policies';
END $$;
