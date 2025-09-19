-- Fix infinite recursion in RLS policies for users table
-- The problem: policies that query the same table they're protecting create infinite loops

-- First, drop all the problematic recursive policies
DROP POLICY IF EXISTS "Faculty and admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Faculty, admin, and accountant can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

-- Create a function to check user roles without triggering RLS
-- This function runs with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION auth.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.users 
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create safe RLS policies that don't cause recursion
-- Users can always view their own profile (no recursion)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (no recursion)  
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Use the security definer function to check roles safely
CREATE POLICY "Privileged users can view all users" ON public.users
  FOR SELECT USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
  );

-- Allow privileged users to insert new users
CREATE POLICY "Privileged users can insert users" ON public.users
  FOR INSERT WITH CHECK (
    auth.get_user_role(auth.uid()) IN ('administrator', 'accountant')
  );

-- Fix other tables that might have similar issues
-- Drop and recreate policies for subjects table
DROP POLICY IF EXISTS "Faculty and admin can manage subjects" ON public.subjects;
CREATE POLICY "Privileged users can manage subjects" ON public.subjects
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator')
  );

-- Drop and recreate policies for attendance table  
DROP POLICY IF EXISTS "Faculty can view and manage attendance" ON public.attendance;
CREATE POLICY "Privileged users can manage attendance" ON public.attendance
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator')
  );

-- Drop and recreate policies for announcements table
DROP POLICY IF EXISTS "Faculty and admin can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Faculty, admin, hostel, and accountant can manage announcements" ON public.announcements;
CREATE POLICY "Privileged users can manage announcements" ON public.announcements
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator', 'hostel_authority', 'accountant')
  );

-- Drop and recreate policies for announcement signups table
DROP POLICY IF EXISTS "Faculty can view all signups" ON public.announcement_signups;
CREATE POLICY "Privileged users can view all signups" ON public.announcement_signups
  FOR SELECT USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator') OR student_id = auth.uid()
  );

-- Drop and recreate policies for wallet transactions table
DROP POLICY IF EXISTS "Faculty and admin can manage transactions" ON public.wallet_transactions;
CREATE POLICY "Privileged users can manage transactions" ON public.wallet_transactions
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator') OR student_id = auth.uid()
  );

-- Drop and recreate policies for timetable table
DROP POLICY IF EXISTS "Faculty and admin can manage timetable" ON public.timetable;
CREATE POLICY "Privileged users can manage timetable" ON public.timetable
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('faculty', 'administrator')
  );

-- Fix policies for new tables from phase 2
DROP POLICY IF EXISTS "Hostel authority and admin can manage rooms" ON public.hostel_rooms;
CREATE POLICY "Privileged users can manage rooms" ON public.hostel_rooms
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('hostel_authority', 'administrator')
  );

DROP POLICY IF EXISTS "Hostel authority and admin can manage room assignments" ON public.room_assignments;
CREATE POLICY "Privileged users can manage room assignments" ON public.room_assignments
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('hostel_authority', 'administrator') OR student_id = auth.uid()
  );

DROP POLICY IF EXISTS "Accountant and admin can manage fee records" ON public.fee_records;
CREATE POLICY "Privileged users can manage fee records" ON public.fee_records
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('accountant', 'administrator') OR student_id = auth.uid()
  );

DROP POLICY IF EXISTS "Accountant and admin can manage registrations" ON public.student_registrations;
CREATE POLICY "Privileged users can manage registrations" ON public.student_registrations
  FOR ALL USING (
    auth.get_user_role(auth.uid()) IN ('accountant', 'administrator') OR student_id = auth.uid()
  );

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION auth.get_user_role(UUID) TO authenticated;

-- Add some debugging to help with future issues
CREATE OR REPLACE FUNCTION auth.debug_user_access()
RETURNS TABLE (
  current_user_id UUID,
  current_user_role TEXT,
  can_access_users BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.uid() as current_user_id,
    auth.get_user_role(auth.uid()) as current_user_role,
    (auth.get_user_role(auth.uid()) IN ('faculty', 'administrator', 'hostel_authority', 'accountant')) as can_access_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION auth.debug_user_access() TO authenticated;
