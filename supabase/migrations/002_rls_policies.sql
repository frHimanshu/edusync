-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_issuances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get student ID from user ID
CREATE OR REPLACE FUNCTION public.get_student_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.students WHERE user_id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get faculty ID from user ID
CREATE OR REPLACE FUNCTION public.get_faculty_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.faculty WHERE user_id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Departments policies
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Admins and HODs can manage departments" ON public.departments
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

-- Students policies
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Faculty can view students in their courses" ON public.students
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('faculty', 'hod', 'admin', 'accountant', 'librarian', 'tnp', 'hostel')
  );

CREATE POLICY "Admins and accountants can manage students" ON public.students
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'accountant')
  );

-- Faculty policies
CREATE POLICY "Faculty can view their own data" ON public.faculty
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Everyone can view faculty" ON public.faculty
  FOR SELECT USING (true);

CREATE POLICY "Admins and HODs can manage faculty" ON public.faculty
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

-- Courses policies
CREATE POLICY "Everyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admins and HODs can manage courses" ON public.courses
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

-- Course assignments policies
CREATE POLICY "Faculty can view their course assignments" ON public.course_assignments
  FOR SELECT USING (
    faculty_id = public.get_faculty_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

CREATE POLICY "Admins and HODs can manage course assignments" ON public.course_assignments
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

-- Student enrollments policies
CREATE POLICY "Students can view their enrollments" ON public.student_enrollments
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hod', 'faculty', 'accountant')
  );

CREATE POLICY "Admins and faculty can manage enrollments" ON public.student_enrollments
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'hod', 'faculty')
  );

-- Attendance policies
CREATE POLICY "Students can view their own attendance" ON public.attendance
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hod', 'faculty')
  );

CREATE POLICY "Faculty can manage attendance for their courses" ON public.attendance
  FOR ALL USING (
    faculty_id = public.get_faculty_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hod')
  );

-- Documents policies
CREATE POLICY "Students can view their own documents" ON public.documents
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'accountant')
  );

CREATE POLICY "Students can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (
    student_id = public.get_student_id(auth.uid()) AND
    uploaded_by = auth.uid()
  );

CREATE POLICY "Accountants can manage all documents" ON public.documents
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'accountant' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Wallet transactions policies
CREATE POLICY "Students can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'accountant')
  );

CREATE POLICY "Accountants can manage all transactions" ON public.wallet_transactions
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'accountant' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Student wallets policies
CREATE POLICY "Students can view their own wallet" ON public.student_wallets
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'accountant')
  );

CREATE POLICY "Accountants can manage all wallets" ON public.student_wallets
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'accountant' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Announcements policies
CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (
    is_active = true AND (
      target_audience IS NULL OR
      public.get_user_role(auth.uid()) = ANY(target_audience) OR
      public.get_user_role(auth.uid()) = 'admin'
    )
  );

CREATE POLICY "Authorized users can create announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    public.get_user_role(auth.uid()) IN ('admin', 'hod', 'faculty', 'tnp')
  );

CREATE POLICY "Authors can update their announcements" ON public.announcements
  FOR UPDATE USING (
    created_by = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Books policies (Library)
CREATE POLICY "Everyone can view books" ON public.books
  FOR SELECT USING (true);

CREATE POLICY "Librarians can manage books" ON public.books
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'librarian' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Book issuances policies
CREATE POLICY "Students can view their book issuances" ON public.book_issuances
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'librarian')
  );

CREATE POLICY "Librarians can manage book issuances" ON public.book_issuances
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'librarian' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Rooms policies (Hostel)
CREATE POLICY "Everyone can view rooms" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "Hostel authority can manage rooms" ON public.rooms
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'hostel' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Room allocations policies
CREATE POLICY "Students can view their room allocation" ON public.room_allocations
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hostel')
  );

CREATE POLICY "Hostel authority can manage room allocations" ON public.room_allocations
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'hostel' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Companies policies (T&P)
CREATE POLICY "Everyone can view companies" ON public.companies
  FOR SELECT USING (is_active = true);

CREATE POLICY "T&P can manage companies" ON public.companies
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'tnp' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Placement drives policies
CREATE POLICY "Everyone can view placement drives" ON public.placement_drives
  FOR SELECT USING (true);

CREATE POLICY "T&P can manage placement drives" ON public.placement_drives
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'tnp' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Student placements policies
CREATE POLICY "Students can view their placements" ON public.student_placements
  FOR SELECT USING (
    student_id = public.get_student_id(auth.uid()) OR
    public.get_user_role(auth.uid()) IN ('admin', 'tnp')
  );

CREATE POLICY "T&P can manage student placements" ON public.student_placements
  FOR ALL USING (
    public.get_user_role(auth.uid()) = 'tnp' OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Maintenance requests policies
CREATE POLICY "Students can view maintenance requests for their room" ON public.maintenance_requests
  FOR SELECT USING (
    room_id IN (
      SELECT ra.room_id FROM public.room_allocations ra 
      WHERE ra.student_id = public.get_student_id(auth.uid()) 
      AND ra.status = 'active'
    ) OR
    public.get_user_role(auth.uid()) IN ('admin', 'hostel')
  );

CREATE POLICY "Students can create maintenance requests" ON public.maintenance_requests
  FOR INSERT WITH CHECK (
    reported_by = auth.uid() AND
    room_id IN (
      SELECT ra.room_id FROM public.room_allocations ra 
      WHERE ra.student_id = public.get_student_id(auth.uid()) 
      AND ra.status = 'active'
    )
  );

CREATE POLICY "Hostel authority can manage maintenance requests" ON public.maintenance_requests
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'hostel' OR
    public.get_user_role(auth.uid()) = 'admin'
  );
