-- Row Level Security (RLS) Policies for Edu-Sync ERP
-- This script enables RLS and creates security policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's department (for students and faculty)
CREATE OR REPLACE FUNCTION get_user_department()
RETURNS UUID AS $$
BEGIN
  RETURN CASE 
    WHEN get_user_role() = 'student' THEN (SELECT department_id FROM public.students WHERE id = auth.uid())
    WHEN get_user_role() = 'faculty' THEN (SELECT department_id FROM public.faculty WHERE id = auth.uid())
    ELSE NULL
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authorities can view users in their scope" ON public.users
  FOR SELECT USING (
    get_user_role() IN ('admin', 'accountant', 'hod', 'faculty', 'hostel_authority')
  );

-- DEPARTMENTS table policies
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Only admin and HOD can modify departments" ON public.departments
  FOR ALL USING (get_user_role() IN ('admin', 'hod'));

-- SUBJECTS table policies
CREATE POLICY "Everyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Faculty and admin can modify subjects" ON public.subjects
  FOR ALL USING (get_user_role() IN ('admin', 'faculty', 'hod'));

-- STUDENTS table policies
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile" ON public.students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authorities can view students" ON public.students
  FOR SELECT USING (
    get_user_role() IN ('admin', 'accountant', 'faculty', 'hod', 'hostel_authority')
  );

CREATE POLICY "Accountant and admin can modify students" ON public.students
  FOR ALL USING (get_user_role() IN ('admin', 'accountant'));

-- FACULTY table policies
CREATE POLICY "Faculty can view their own data" ON public.faculty
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Faculty can update their own profile" ON public.faculty
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authorities can view faculty" ON public.faculty
  FOR SELECT USING (
    get_user_role() IN ('admin', 'hod', 'faculty')
  );

CREATE POLICY "Admin and HOD can modify faculty" ON public.faculty
  FOR ALL USING (get_user_role() IN ('admin', 'hod'));

-- HOSTEL_ROOMS table policies
CREATE POLICY "Students can view hostel rooms" ON public.hostel_rooms
  FOR SELECT USING (get_user_role() = 'student');

CREATE POLICY "Hostel authority can manage rooms" ON public.hostel_rooms
  FOR ALL USING (get_user_role() IN ('admin', 'hostel_authority'));

-- ATTENDANCE table policies
CREATE POLICY "Students can view their own attendance" ON public.attendance
  FOR SELECT USING (
    get_user_role() = 'student' AND student_id = auth.uid()
  );

CREATE POLICY "Faculty can view and mark attendance for their subjects" ON public.attendance
  FOR ALL USING (
    get_user_role() = 'faculty' AND faculty_id = auth.uid()
  );

CREATE POLICY "Authorities can view attendance" ON public.attendance
  FOR SELECT USING (
    get_user_role() IN ('admin', 'hod', 'accountant')
  );

-- TIMETABLE table policies
CREATE POLICY "Students can view timetable" ON public.timetable
  FOR SELECT USING (
    get_user_role() = 'student' AND 
    (department_id = get_user_department() OR department_id IS NULL)
  );

CREATE POLICY "Faculty can view and manage timetable" ON public.timetable
  FOR ALL USING (
    get_user_role() IN ('faculty', 'admin', 'hod')
  );

-- ANNOUNCEMENTS table policies
CREATE POLICY "Users can view relevant announcements" ON public.announcements
  FOR SELECT USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > NOW()) AND
    (
      target_audience = 'all' OR
      (target_audience = 'students' AND get_user_role() = 'student') OR
      (target_audience = 'faculty' AND get_user_role() = 'faculty') OR
      (target_audience = 'hostel_residents' AND get_user_role() = 'student' AND 
       EXISTS(SELECT 1 FROM public.students WHERE id = auth.uid() AND hostel_room_id IS NOT NULL)) OR
      (target_audience = 'department_specific' AND department_id = get_user_department()) OR
      get_user_role() IN ('admin', 'hod', 'accountant', 'hostel_authority', 'faculty')
    )
  );

CREATE POLICY "Authorities can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    get_user_role() IN ('admin', 'faculty', 'hod', 'hostel_authority', 'accountant') AND
    auth.uid() = author_id
  );

CREATE POLICY "Authors can update their announcements" ON public.announcements
  FOR UPDATE USING (auth.uid() = author_id);

-- WALLET_TRANSACTIONS table policies
CREATE POLICY "Students can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (
    get_user_role() = 'student' AND student_id = auth.uid()
  );

CREATE POLICY "Accountant can manage all transactions" ON public.wallet_transactions
  FOR ALL USING (get_user_role() IN ('admin', 'accountant'));

-- STUDENT_DOCUMENTS table policies
CREATE POLICY "Students can view their own documents" ON public.student_documents
  FOR SELECT USING (
    get_user_role() = 'student' AND student_id = auth.uid()
  );

CREATE POLICY "Students can upload their documents" ON public.student_documents
  FOR INSERT WITH CHECK (
    get_user_role() = 'student' AND student_id = auth.uid()
  );

CREATE POLICY "Authorities can view and verify documents" ON public.student_documents
  FOR ALL USING (
    get_user_role() IN ('admin', 'accountant', 'hod')
  );

-- ACADEMIC_SESSIONS table policies
CREATE POLICY "Everyone can view academic sessions" ON public.academic_sessions
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage academic sessions" ON public.academic_sessions
  FOR ALL USING (get_user_role() = 'admin');

-- GRADES table policies
CREATE POLICY "Students can view their own grades" ON public.grades
  FOR SELECT USING (
    get_user_role() = 'student' AND student_id = auth.uid()
  );

CREATE POLICY "Faculty can manage grades for their subjects" ON public.grades
  FOR ALL USING (
    get_user_role() = 'faculty' AND entered_by = auth.uid()
  );

CREATE POLICY "Authorities can view all grades" ON public.grades
  FOR SELECT USING (
    get_user_role() IN ('admin', 'hod', 'accountant')
  );
