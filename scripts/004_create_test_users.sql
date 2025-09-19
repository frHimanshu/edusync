-- =====================================================
-- EDU-SYNC ERP SYSTEM - CREATE TEST USERS
-- =====================================================
-- This script creates test users for all roles
-- Run this script AFTER creating users in Supabase Auth

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. This script assumes users have been created in Supabase Auth
-- 2. Replace the placeholder UUIDs with actual auth.users IDs
-- 3. Update the user IDs after creating users via Supabase Auth API
-- 4. The passwords for these users should be set via Supabase Auth

-- =====================================================
-- SAMPLE USER DATA (Replace with actual auth.users IDs)
-- =====================================================

-- Students
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
-- Student 1 - First time login (needs password setup)
('10000000-0000-0000-0000-000000000001', 'student1@edusync.edu', 'student', 'John', 'Doe', '+91-9876543210', true),
-- Student 2 - Already set password
('10000000-0000-0000-0000-000000000002', 'student2@edusync.edu', 'student', 'Jane', 'Smith', '+91-9876543211', false),
-- Student 3 - Hostel resident
('10000000-0000-0000-0000-000000000003', 'student3@edusync.edu', 'student', 'Mike', 'Johnson', '+91-9876543212', false),
-- Student 4 - CSE student
('10000000-0000-0000-0000-000000000004', 'student4@edusync.edu', 'student', 'Sarah', 'Wilson', '+91-9876543213', false),
-- Student 5 - ECE student
('10000000-0000-0000-0000-000000000005', 'student5@edusync.edu', 'student', 'David', 'Brown', '+91-9876543214', false);

-- Faculty
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('20000000-0000-0000-0000-000000000001', 'faculty1@edusync.edu', 'faculty', 'Dr. Robert', 'Taylor', '+91-9876543220', false),
('20000000-0000-0000-0000-000000000002', 'faculty2@edusync.edu', 'faculty', 'Prof. Lisa', 'Anderson', '+91-9876543221', false),
('20000000-0000-0000-0000-000000000003', 'faculty3@edusync.edu', 'faculty', 'Dr. Michael', 'Davis', '+91-9876543222', false);

-- HOD
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('30000000-0000-0000-0000-000000000001', 'hod.cse@edusync.edu', 'hod', 'Dr. James', 'Miller', '+91-9876543230', false),
('30000000-0000-0000-0000-000000000002', 'hod.ece@edusync.edu', 'hod', 'Dr. Emily', 'Garcia', '+91-9876543231', false);

-- Accountant
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('40000000-0000-0000-0000-000000000001', 'accountant@edusync.edu', 'accountant', 'Ms. Patricia', 'Martinez', '+91-9876543240', false);

-- Hostel Authority
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('50000000-0000-0000-0000-000000000001', 'hostel@edusync.edu', 'hostel_authority', 'Mr. William', 'Rodriguez', '+91-9876543250', false);

-- Librarian
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('60000000-0000-0000-0000-000000000001', 'librarian@edusync.edu', 'librarian', 'Ms. Jennifer', 'Lee', '+91-9876543260', false);

-- T&P Officer
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('70000000-0000-0000-0000-000000000001', 'tnp@edusync.edu', 'tnp', 'Mr. Christopher', 'White', '+91-9876543270', false);

-- Sports Authority
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('80000000-0000-0000-0000-000000000001', 'sports@edusync.edu', 'sports', 'Mr. Daniel', 'Harris', '+91-9876543280', false);

-- Admin
INSERT INTO public.users (id, email, role, first_name, last_name, phone, is_first_login) VALUES
('90000000-0000-0000-0000-000000000001', 'admin@edusync.edu', 'admin', 'Dr. Admin', 'User', '+91-9876543290', false);

-- =====================================================
-- INSERT STUDENT PROFILES
-- =====================================================

INSERT INTO public.students (id, student_id, department_id, semester, year_of_admission, date_of_birth, address, guardian_name, guardian_phone, blood_group, hostel_room_id, ec_wallet_balance, tags, fee_status) VALUES
('10000000-0000-0000-0000-000000000001', 'CSE24S001', '550e8400-e29b-41d4-a716-446655440001', 1, 2024, '2005-03-15', '123 Main St, City', 'Robert Doe', '+91-9876543210', 'O+', '750e8400-e29b-41d4-a716-446655440001', 500.00, ARRAY['scholarship'], 'paid'),
('10000000-0000-0000-0000-000000000002', 'CSE24S002', '550e8400-e29b-41d4-a716-446655440001', 1, 2024, '2005-07-22', '456 Oak Ave, City', 'Mary Smith', '+91-9876543211', 'A+', '750e8400-e29b-41d4-a716-446655440002', 750.00, ARRAY['sports'], 'paid'),
('10000000-0000-0000-0000-000000000003', 'ECE24S001', '550e8400-e29b-41d4-a716-446655440002', 3, 2023, '2004-11-08', '789 Pine Rd, City', 'John Johnson', '+91-9876543212', 'B+', '750e8400-e29b-41d4-a716-446655440003', 300.00, ARRAY['hostel_resident'], 'pending'),
('10000000-0000-0000-0000-000000000004', 'CSE23S001', '550e8400-e29b-41d4-a716-446655440001', 3, 2023, '2004-05-12', '321 Elm St, City', 'Susan Wilson', '+91-9876543213', 'AB+', '750e8400-e29b-41d4-a716-446655440004', 1000.00, ARRAY['scholarship', 'hostel_resident'], 'paid'),
('10000000-0000-0000-0000-000000000005', 'ECE23S002', '550e8400-e29b-41d4-a716-446655440002', 3, 2023, '2004-09-30', '654 Maple Dr, City', 'Tom Brown', '+91-9876543214', 'O-', '750e8400-e29b-41d4-a716-446655440005', 250.00, ARRAY['hostel_resident'], 'overdue');

-- =====================================================
-- INSERT FACULTY PROFILES
-- =====================================================

INSERT INTO public.faculty (id, employee_id, department_id, designation, qualification, experience_years, subjects_assigned) VALUES
('20000000-0000-0000-0000-000000000001', 'FAC001', '550e8400-e29b-41d4-a716-446655440001', 'Professor', 'Ph.D. Computer Science', 15, ARRAY['850e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002']),
('20000000-0000-0000-0000-000000000002', 'FAC002', '550e8400-e29b-41d4-a716-446655440001', 'Associate Professor', 'M.Tech Computer Science', 10, ARRAY['850e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440004']),
('20000000-0000-0000-0000-000000000003', 'FAC003', '550e8400-e29b-41d4-a716-446655440002', 'Assistant Professor', 'Ph.D. Electronics', 8, ARRAY['850e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440007']);

-- =====================================================
-- UPDATE SUBJECTS WITH FACULTY ASSIGNMENTS
-- =====================================================

UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000001' WHERE id = '850e8400-e29b-41d4-a716-446655440001';
UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000001' WHERE id = '850e8400-e29b-41d4-a716-446655440002';
UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000002' WHERE id = '850e8400-e29b-41d4-a716-446655440003';
UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000002' WHERE id = '850e8400-e29b-41d4-a716-446655440004';
UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000003' WHERE id = '850e8400-e29b-41d4-a716-446655440006';
UPDATE public.subjects SET faculty_id = '20000000-0000-0000-0000-000000000003' WHERE id = '850e8400-e29b-41d4-a716-446655440007';

-- =====================================================
-- UPDATE DEPARTMENTS WITH HOD ASSIGNMENTS
-- =====================================================

UPDATE public.departments SET hod_id = '30000000-0000-0000-0000-000000000001' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE public.departments SET hod_id = '30000000-0000-0000-0000-000000000002' WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC TEST USERS CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Test users created for all roles with sample data';
    RAISE NOTICE 'Next step: Update the user IDs with actual auth.users IDs from Supabase Auth';
    RAISE NOTICE 'Database is now fully populated and ready for testing!';
END $$;