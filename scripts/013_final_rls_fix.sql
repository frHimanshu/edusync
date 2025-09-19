-- FINAL FIX: Remove all recursive RLS policies and replace with safe ones
-- This completely eliminates the infinite recursion issue

-- Drop ALL problematic policies that cause recursion
DROP POLICY IF EXISTS "Faculty and admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Faculty, admin, and accountant can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Faculty and admin can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Faculty can view and manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Faculty and admin can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Faculty, admin, hostel, and accountant can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Faculty can view all signups" ON public.announcement_signups;
DROP POLICY IF EXISTS "Faculty and admin can manage transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Faculty and admin can manage timetable" ON public.timetable;
DROP POLICY IF EXISTS "Hostel authority and admin can manage rooms" ON public.hostel_rooms;
DROP POLICY IF EXISTS "Hostel authority and admin can manage room assignments" ON public.room_assignments;
DROP POLICY IF EXISTS "Accountant and admin can manage fee records" ON public.fee_records;
DROP POLICY IF EXISTS "Accountant and admin can manage registrations" ON public.student_registrations;

-- Create a secure function to check user roles without RLS recursion
CREATE OR REPLACE FUNCTION auth.get_user_role_safe(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- This function runs with SECURITY DEFINER to bypass RLS
  SELECT role INTO user_role 
  FROM public.users 
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auth.get_user_role_safe(UUID) TO authenticated;

-- Create SAFE RLS policies that don't cause recursion

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Using security definer function to avoid recursion
CREATE POLICY "Privileged users can view all users" ON public.users
  FOR SELECT USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
  );

CREATE POLICY "Privileged users can insert users" ON public.users
  FOR INSERT WITH CHECK (
    auth.get_user_role_safe(auth.uid()) IN ('administrator', 'accountant')
  );

-- Subjects table policies
CREATE POLICY "Everyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Privileged users can manage subjects" ON public.subjects
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator')
  );

-- Attendance table policies
CREATE POLICY "Students can view own attendance" ON public.attendance
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Privileged users can manage attendance" ON public.attendance
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator')
  );

-- Announcements table policies
CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "Privileged users can manage announcements" ON public.announcements
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
  );

-- Announcement signups table policies
CREATE POLICY "Students can manage own signups" ON public.announcement_signups
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Privileged users can view all signups" ON public.announcement_signups
  FOR SELECT USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator') OR student_id = auth.uid()
  );

-- Wallet transactions table policies
CREATE POLICY "Students can view own transactions" ON public.wallet_transactions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Privileged users can manage transactions" ON public.wallet_transactions
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator') OR student_id = auth.uid()
  );

-- Timetable table policies
CREATE POLICY "Everyone can view timetable" ON public.timetable
  FOR SELECT USING (true);

CREATE POLICY "Privileged users can manage timetable" ON public.timetable
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('faculty', 'administrator')
  );

-- Hostel rooms table policies
CREATE POLICY "Everyone can view hostel rooms" ON public.hostel_rooms
  FOR SELECT USING (true);

CREATE POLICY "Privileged users can manage rooms" ON public.hostel_rooms
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('hostel_authority', 'administrator')
  );

-- Room assignments table policies
CREATE POLICY "Students can view own room assignments" ON public.room_assignments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Privileged users can manage room assignments" ON public.room_assignments
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('hostel_authority', 'administrator') OR student_id = auth.uid()
  );

-- Fee records table policies
CREATE POLICY "Students can view own fee records" ON public.fee_records
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Privileged users can manage fee records" ON public.fee_records
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('accountant', 'administrator') OR student_id = auth.uid()
  );

-- Student registrations table policies
CREATE POLICY "Students can view own registration" ON public.student_registrations
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Privileged users can manage registrations" ON public.student_registrations
  FOR ALL USING (
    auth.get_user_role_safe(auth.uid()) IN ('accountant', 'administrator') OR student_id = auth.uid()
  );
