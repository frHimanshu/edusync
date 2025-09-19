-- =====================================================
-- EDU-SYNC ERP SYSTEM - COMPREHENSIVE ROW LEVEL SECURITY
-- =====================================================
-- This script enables RLS and creates comprehensive security policies
-- Run this script AFTER running 001_comprehensive_schema.sql

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_issuances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR POLICIES
-- =====================================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is authority
CREATE OR REPLACE FUNCTION is_authority()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('faculty', 'admin', 'accountant', 'hostel_authority', 'librarian', 'tnp', 'sports', 'hod');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's department (for HOD access)
CREATE OR REPLACE FUNCTION get_user_department()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT COALESCE(s.department_id, f.department_id)
        FROM public.users u
        LEFT JOIN public.students s ON u.id = s.id
        LEFT JOIN public.faculty f ON u.id = f.id
        WHERE u.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is hostel resident
CREATE OR REPLACE FUNCTION is_hostel_resident()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.students 
        WHERE id = auth.uid() AND hostel_room_id IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own record
CREATE POLICY "Users can read own record" ON public.users
    FOR SELECT USING (id = auth.uid());

-- Users can update their own record (limited fields)
CREATE POLICY "Users can update own record" ON public.users
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Authorities can read user records (for management purposes)
CREATE POLICY "Authorities can read user records" ON public.users
    FOR SELECT USING (is_authority());

-- Administrators can manage all user records
CREATE POLICY "Administrators can manage users" ON public.users
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- DEPARTMENTS TABLE POLICIES
-- =====================================================

-- Everyone can read departments
CREATE POLICY "Everyone can read departments" ON public.departments
    FOR SELECT USING (true);

-- HODs can update their own department
CREATE POLICY "HODs can update own department" ON public.departments
    FOR UPDATE USING (hod_id = auth.uid())
    WITH CHECK (hod_id = auth.uid());

-- Administrators can manage all departments
CREATE POLICY "Administrators can manage departments" ON public.departments
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- SUBJECTS TABLE POLICIES
-- =====================================================

-- Everyone can read subjects
CREATE POLICY "Everyone can read subjects" ON public.subjects
    FOR SELECT USING (true);

-- Faculty can manage subjects they teach
CREATE POLICY "Faculty can manage own subjects" ON public.subjects
    FOR ALL USING (faculty_id = auth.uid());

-- Administrators can manage all subjects
CREATE POLICY "Administrators can manage subjects" ON public.subjects
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- STUDENTS TABLE POLICIES
-- =====================================================

-- Students can read their own record
CREATE POLICY "Students can read own record" ON public.students
    FOR SELECT USING (id = auth.uid());

-- Students can update their own record (limited fields)
CREATE POLICY "Students can update own record" ON public.students
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Authorities can read student records
CREATE POLICY "Authorities can read students" ON public.students
    FOR SELECT USING (is_authority());

-- Accountants can manage student records
CREATE POLICY "Accountants can manage students" ON public.students
    FOR ALL USING (has_role('accountant') OR has_role('admin'));

-- HODs can read students in their department
CREATE POLICY "HODs can read department students" ON public.students
    FOR SELECT USING (has_role('hod') AND department_id = get_user_department());

-- Hostel authorities can read hostel residents
CREATE POLICY "Hostel authorities can read residents" ON public.students
    FOR SELECT USING (has_role('hostel_authority') AND hostel_room_id IS NOT NULL);

-- =====================================================
-- FACULTY TABLE POLICIES
-- =====================================================

-- Faculty can read their own record
CREATE POLICY "Faculty can read own record" ON public.faculty
    FOR SELECT USING (id = auth.uid());

-- Faculty can update their own record
CREATE POLICY "Faculty can update own record" ON public.faculty
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Administrators can manage faculty records
CREATE POLICY "Administrators can manage faculty" ON public.faculty
    FOR ALL USING (has_role('admin'));

-- All authorities can read faculty records (for collaboration)
CREATE POLICY "Authorities can read faculty" ON public.faculty
    FOR SELECT USING (is_authority());

-- =====================================================
-- HOSTEL ROOMS TABLE POLICIES
-- =====================================================

-- Everyone can read hostel rooms
CREATE POLICY "Everyone can read hostel rooms" ON public.hostel_rooms
    FOR SELECT USING (true);

-- Hostel authorities can manage hostel rooms
CREATE POLICY "Hostel authorities can manage rooms" ON public.hostel_rooms
    FOR ALL USING (has_role('hostel_authority') OR has_role('admin'));

-- =====================================================
-- ATTENDANCE TABLE POLICIES
-- =====================================================

-- Students can read their own attendance
CREATE POLICY "Students can read own attendance" ON public.attendance
    FOR SELECT USING (student_id = auth.uid());

-- Faculty can manage attendance for their subjects
CREATE POLICY "Faculty can manage subject attendance" ON public.attendance
    FOR ALL USING (
        subject_id IN (
            SELECT s.id FROM public.subjects s
            WHERE s.faculty_id = auth.uid()
        )
    );

-- Administrators can manage all attendance
CREATE POLICY "Administrators can manage attendance" ON public.attendance
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- TIMETABLE TABLE POLICIES
-- =====================================================

-- Everyone can read timetable
CREATE POLICY "Everyone can read timetable" ON public.timetable
    FOR SELECT USING (true);

-- Faculty can manage their own timetable
CREATE POLICY "Faculty can manage own timetable" ON public.timetable
    FOR ALL USING (faculty_id = auth.uid());

-- Administrators can manage all timetable
CREATE POLICY "Administrators can manage timetable" ON public.timetable
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- ACADEMIC SESSIONS TABLE POLICIES
-- =====================================================

-- Everyone can read academic sessions
CREATE POLICY "Everyone can read academic sessions" ON public.academic_sessions
    FOR SELECT USING (true);

-- Administrators can manage academic sessions
CREATE POLICY "Administrators can manage academic sessions" ON public.academic_sessions
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- GRADES TABLE POLICIES
-- =====================================================

-- Students can read their own grades
CREATE POLICY "Students can read own grades" ON public.grades
    FOR SELECT USING (student_id = auth.uid());

-- Faculty can manage grades for their subjects
CREATE POLICY "Faculty can manage subject grades" ON public.grades
    FOR ALL USING (
        subject_id IN (
            SELECT s.id FROM public.subjects s
            WHERE s.faculty_id = auth.uid()
        )
    );

-- Administrators can manage all grades
CREATE POLICY "Administrators can manage grades" ON public.grades
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- ANNOUNCEMENTS TABLE POLICIES
-- =====================================================

-- Students can read announcements targeted to them
CREATE POLICY "Students can read targeted announcements" ON public.announcements
    FOR SELECT USING (
        is_student() AND (
            channel = 'all' OR
            (channel = 'department_specific' AND department_id = get_user_department()) OR
            (channel = 'hostel_residents' AND is_hostel_resident())
        )
    );

-- Authorities can read all announcements
CREATE POLICY "Authorities can read announcements" ON public.announcements
    FOR SELECT USING (is_authority());

-- Faculty can create general announcements
CREATE POLICY "Faculty can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('faculty') AND author_id = auth.uid());

-- HODs can create department-specific announcements
CREATE POLICY "HODs can create department announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('hod') AND author_id = auth.uid());

-- Hostel authorities can create hostel announcements
CREATE POLICY "Hostel authorities can create hostel announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('hostel_authority') AND author_id = auth.uid());

-- T&P officers can create placement announcements
CREATE POLICY "T&P officers can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('tnp') AND author_id = auth.uid());

-- Sports authorities can create sports announcements
CREATE POLICY "Sports authorities can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('sports') AND author_id = auth.uid());

-- Authors can update their own announcements
CREATE POLICY "Authors can update own announcements" ON public.announcements
    FOR UPDATE USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

-- Administrators can manage all announcements
CREATE POLICY "Administrators can manage announcements" ON public.announcements
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- WALLET TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Students can read their own wallet transactions
CREATE POLICY "Students can read own transactions" ON public.wallet_transactions
    FOR SELECT USING (student_id = auth.uid());

-- Accountants can manage all wallet transactions
CREATE POLICY "Accountants can manage transactions" ON public.wallet_transactions
    FOR ALL USING (has_role('accountant') OR has_role('admin'));

-- =====================================================
-- FEE RECORDS TABLE POLICIES
-- =====================================================

-- Students can read their own fee records
CREATE POLICY "Students can read own fee records" ON public.fee_records
    FOR SELECT USING (student_id = auth.uid());

-- Accountants can manage all fee records
CREATE POLICY "Accountants can manage fee records" ON public.fee_records
    FOR ALL USING (has_role('accountant') OR has_role('admin'));

-- =====================================================
-- STUDENT DOCUMENTS TABLE POLICIES
-- =====================================================

-- Students can read their own documents
CREATE POLICY "Students can read own documents" ON public.student_documents
    FOR SELECT USING (student_id = auth.uid());

-- Students can upload their own documents
CREATE POLICY "Students can upload own documents" ON public.student_documents
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- Accountants can manage student documents
CREATE POLICY "Accountants can manage documents" ON public.student_documents
    FOR ALL USING (has_role('accountant') OR has_role('admin'));

-- =====================================================
-- LIBRARY BOOKS TABLE POLICIES
-- =====================================================

-- Everyone can read library books
CREATE POLICY "Everyone can read library books" ON public.library_books
    FOR SELECT USING (true);

-- Librarians can manage library books
CREATE POLICY "Librarians can manage books" ON public.library_books
    FOR ALL USING (has_role('librarian') OR has_role('admin'));

-- =====================================================
-- BOOK ISSUANCES TABLE POLICIES
-- =====================================================

-- Students can read their own book issuances
CREATE POLICY "Students can read own issuances" ON public.book_issuances
    FOR SELECT USING (student_id = auth.uid());

-- Librarians can manage all book issuances
CREATE POLICY "Librarians can manage issuances" ON public.book_issuances
    FOR ALL USING (has_role('librarian') OR has_role('admin'));

-- =====================================================
-- PLACEMENT DRIVES TABLE POLICIES
-- =====================================================

-- Students can read placement drives
CREATE POLICY "Students can read placement drives" ON public.placement_drives
    FOR SELECT USING (is_student() AND is_active = true);

-- T&P officers can manage placement drives
CREATE POLICY "T&P officers can manage drives" ON public.placement_drives
    FOR ALL USING (has_role('tnp') OR has_role('admin'));

-- =====================================================
-- STUDENT PLACEMENTS TABLE POLICIES
-- =====================================================

-- Students can read their own placement records
CREATE POLICY "Students can read own placements" ON public.student_placements
    FOR SELECT USING (student_id = auth.uid());

-- Students can apply for placements
CREATE POLICY "Students can apply for placements" ON public.student_placements
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- T&P officers can manage student placements
CREATE POLICY "T&P officers can manage placements" ON public.student_placements
    FOR ALL USING (has_role('tnp') OR has_role('admin'));

-- =====================================================
-- SYSTEM SETTINGS TABLE POLICIES
-- =====================================================

-- Everyone can read public system settings
CREATE POLICY "Everyone can read public settings" ON public.system_settings
    FOR SELECT USING (is_public = true);

-- Authorities can read all system settings
CREATE POLICY "Authorities can read settings" ON public.system_settings
    FOR SELECT USING (is_authority());

-- Only administrators can manage system settings
CREATE POLICY "Administrators can manage settings" ON public.system_settings
    FOR ALL USING (has_role('admin'));

-- =====================================================
-- AUDIT LOGS TABLE POLICIES
-- =====================================================

-- Only administrators can read audit logs
CREATE POLICY "Administrators can read audit logs" ON public.audit_logs
    FOR SELECT USING (has_role('admin'));

-- System can insert audit logs (for triggers)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC COMPREHENSIVE ROW LEVEL SECURITY POLICIES CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Next step: Run 003_comprehensive_seeding.sql to populate with test data';
END $$;
