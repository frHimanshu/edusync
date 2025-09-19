-- =====================================================
-- EDU-SYNC ERP SYSTEM - ROW LEVEL SECURITY (RLS)
-- =====================================================
-- This script enables RLS and creates security policies
-- Run this script AFTER running 001_schema_creation.sql

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_maintenance ENABLE ROW LEVEL SECURITY;
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
    RETURN get_user_role() IN ('faculty', 'administrator', 'accountant', 'hostel_authority', 'librarian', 'placement', 'sports', 'hod');
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
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT COALESCE(s.department, a.department)
        FROM public.users u
        LEFT JOIN public.students s ON u.id = s.user_id
        LEFT JOIN public.authorities a ON u.id = a.user_id
        WHERE u.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own record
CREATE POLICY "Users can read own record" ON public.users
    FOR SELECT USING (id = auth.uid());

-- Users can update their own record
CREATE POLICY "Users can update own record" ON public.users
    FOR UPDATE USING (id = auth.uid());

-- Authorities can read user records (for management purposes)
CREATE POLICY "Authorities can read user records" ON public.users
    FOR SELECT USING (is_authority());

-- Administrators can manage all user records
CREATE POLICY "Administrators can manage users" ON public.users
    FOR ALL USING (has_role('administrator'));

-- =====================================================
-- STUDENTS TABLE POLICIES
-- =====================================================

-- Students can read their own record
CREATE POLICY "Students can read own record" ON public.students
    FOR SELECT USING (user_id = auth.uid());

-- Students can update their own record (limited fields)
CREATE POLICY "Students can update own record" ON public.students
    FOR UPDATE USING (user_id = auth.uid());

-- Authorities can read student records
CREATE POLICY "Authorities can read students" ON public.students
    FOR SELECT USING (is_authority());

-- Accountants can manage student records
CREATE POLICY "Accountants can manage students" ON public.students
    FOR ALL USING (has_role('accountant') OR has_role('administrator'));

-- HODs can read students in their department
CREATE POLICY "HODs can read department students" ON public.students
    FOR SELECT USING (has_role('hod') AND department = get_user_department());

-- Hostel authorities can read hostel residents
CREATE POLICY "Hostel authorities can read residents" ON public.students
    FOR SELECT USING (has_role('hostel_authority') AND is_hostel_resident = true);

-- =====================================================
-- AUTHORITIES TABLE POLICIES
-- =====================================================

-- Authorities can read their own record
CREATE POLICY "Authorities can read own record" ON public.authorities
    FOR SELECT USING (user_id = auth.uid());

-- Authorities can update their own record
CREATE POLICY "Authorities can update own record" ON public.authorities
    FOR UPDATE USING (user_id = auth.uid());

-- Administrators can manage authority records
CREATE POLICY "Administrators can manage authorities" ON public.authorities
    FOR ALL USING (has_role('administrator'));

-- All authorities can read other authority records (for collaboration)
CREATE POLICY "Authorities can read other authorities" ON public.authorities
    FOR SELECT USING (is_authority());

-- =====================================================
-- SUBJECTS TABLE POLICIES
-- =====================================================

-- Everyone can read subjects
CREATE POLICY "Everyone can read subjects" ON public.subjects
    FOR SELECT USING (true);

-- Faculty can manage subjects they teach
CREATE POLICY "Faculty can manage own subjects" ON public.subjects
    FOR ALL USING (
        faculty_id IN (
            SELECT id FROM public.authorities WHERE user_id = auth.uid()
        )
    );

-- Administrators can manage all subjects
CREATE POLICY "Administrators can manage subjects" ON public.subjects
    FOR ALL USING (has_role('administrator'));

-- =====================================================
-- ATTENDANCE TABLE POLICIES
-- =====================================================

-- Students can read their own attendance
CREATE POLICY "Students can read own attendance" ON public.attendance
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Faculty can manage attendance for their subjects
CREATE POLICY "Faculty can manage subject attendance" ON public.attendance
    FOR ALL USING (
        subject_id IN (
            SELECT s.id FROM public.subjects s
            JOIN public.authorities a ON s.faculty_id = a.id
            WHERE a.user_id = auth.uid()
        )
    );

-- Administrators can manage all attendance
CREATE POLICY "Administrators can manage attendance" ON public.attendance
    FOR ALL USING (has_role('administrator'));

-- =====================================================
-- ANNOUNCEMENTS TABLE POLICIES
-- =====================================================

-- Students can read announcements targeted to them
CREATE POLICY "Students can read targeted announcements" ON public.announcements
    FOR SELECT USING (
        is_student() AND (
            target_audience = 'all' OR
            (target_audience = 'department_specific' AND department = get_user_department()) OR
            (target_audience = 'hostel_residents' AND EXISTS (
                SELECT 1 FROM public.students 
                WHERE user_id = auth.uid() AND is_hostel_resident = true
            ))
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

-- Placement officers can create placement announcements
CREATE POLICY "Placement officers can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (has_role('placement') AND author_id = auth.uid());

-- Authors can update their own announcements
CREATE POLICY "Authors can update own announcements" ON public.announcements
    FOR UPDATE USING (author_id = auth.uid());

-- Administrators can manage all announcements
CREATE POLICY "Administrators can manage announcements" ON public.announcements
    FOR ALL USING (has_role('administrator'));

-- =====================================================
-- HOSTEL TABLES POLICIES
-- =====================================================

-- Hostel authorities can manage hostel rooms
CREATE POLICY "Hostel authorities can manage rooms" ON public.hostel_rooms
    FOR ALL USING (has_role('hostel_authority') OR has_role('administrator'));

-- Students can read hostel room information
CREATE POLICY "Students can read hostel rooms" ON public.hostel_rooms
    FOR SELECT USING (is_student());

-- Students can create maintenance requests for their room
CREATE POLICY "Students can create maintenance requests" ON public.hostel_maintenance
    FOR INSERT WITH CHECK (
        is_student() AND student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Students can read their own maintenance requests
CREATE POLICY "Students can read own maintenance requests" ON public.hostel_maintenance
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Hostel authorities can manage all maintenance requests
CREATE POLICY "Hostel authorities can manage maintenance" ON public.hostel_maintenance
    FOR ALL USING (has_role('hostel_authority') OR has_role('administrator'));

-- =====================================================
-- FINANCIAL TABLES POLICIES
-- =====================================================

-- Students can read their own wallet transactions
CREATE POLICY "Students can read own transactions" ON public.wallet_transactions
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Accountants can manage all wallet transactions
CREATE POLICY "Accountants can manage transactions" ON public.wallet_transactions
    FOR ALL USING (has_role('accountant') OR has_role('administrator'));

-- Students can read their own fee records
CREATE POLICY "Students can read own fee records" ON public.fee_records
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Accountants can manage all fee records
CREATE POLICY "Accountants can manage fee records" ON public.fee_records
    FOR ALL USING (has_role('accountant') OR has_role('administrator'));

-- =====================================================
-- DOCUMENT MANAGEMENT POLICIES
-- =====================================================

-- Students can read their own documents
CREATE POLICY "Students can read own documents" ON public.student_documents
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Accountants can manage student documents
CREATE POLICY "Accountants can manage documents" ON public.student_documents
    FOR ALL USING (has_role('accountant') OR has_role('administrator'));

-- =====================================================
-- LIBRARY POLICIES
-- =====================================================

-- Everyone can read library books
CREATE POLICY "Everyone can read library books" ON public.library_books
    FOR SELECT USING (true);

-- Librarians can manage library books
CREATE POLICY "Librarians can manage books" ON public.library_books
    FOR ALL USING (has_role('librarian') OR has_role('administrator'));

-- Students can read their own book issuances
CREATE POLICY "Students can read own issuances" ON public.book_issuances
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Librarians can manage all book issuances
CREATE POLICY "Librarians can manage issuances" ON public.book_issuances
    FOR ALL USING (has_role('librarian') OR has_role('administrator'));

-- =====================================================
-- PLACEMENT POLICIES
-- =====================================================

-- Students can read placement drives
CREATE POLICY "Students can read placement drives" ON public.placement_drives
    FOR SELECT USING (is_student());

-- Placement officers can manage placement drives
CREATE POLICY "Placement officers can manage drives" ON public.placement_drives
    FOR ALL USING (has_role('placement') OR has_role('administrator'));

-- Students can read their own placement records
CREATE POLICY "Students can read own placements" ON public.student_placements
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Placement officers can manage student placements
CREATE POLICY "Placement officers can manage placements" ON public.student_placements
    FOR ALL USING (has_role('placement') OR has_role('administrator'));

-- =====================================================
-- SYSTEM TABLES POLICIES
-- =====================================================

-- Only administrators can manage system settings
CREATE POLICY "Administrators can manage settings" ON public.system_settings
    FOR ALL USING (has_role('administrator'));

-- Authorities can read system settings
CREATE POLICY "Authorities can read settings" ON public.system_settings
    FOR SELECT USING (is_authority());

-- Only administrators can read audit logs
CREATE POLICY "Administrators can read audit logs" ON public.audit_logs
    FOR SELECT USING (has_role('administrator'));

-- System can insert audit logs (for triggers)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC ROW LEVEL SECURITY POLICIES CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Next step: Run 003_data_seeding.sql to populate with test data';
END $$;
