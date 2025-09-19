-- =====================================================
-- EDU-SYNC ERP SYSTEM - COMPREHENSIVE DATA SEEDING
-- =====================================================
-- This script seeds the database with comprehensive test data
-- Run this script AFTER running 002_comprehensive_rls.sql

-- =====================================================
-- INSERT DEPARTMENTS
-- =====================================================

INSERT INTO public.departments (id, name, code, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Computer Science and Engineering', 'CSE', 'Department of Computer Science and Engineering'),
('550e8400-e29b-41d4-a716-446655440002', 'Electronics and Communication Engineering', 'ECE', 'Department of Electronics and Communication Engineering'),
('550e8400-e29b-41d4-a716-446655440003', 'Mechanical Engineering', 'ME', 'Department of Mechanical Engineering'),
('550e8400-e29b-41d4-a716-446655440004', 'Civil Engineering', 'CE', 'Department of Civil Engineering'),
('550e8400-e29b-41d4-a716-446655440005', 'Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
('550e8400-e29b-41d4-a716-446655440006', 'Business Administration', 'MBA', 'Department of Business Administration');

-- =====================================================
-- INSERT ACADEMIC SESSIONS
-- =====================================================

INSERT INTO public.academic_sessions (id, session_name, start_date, end_date, is_current) VALUES
('650e8400-e29b-41d4-a716-446655440001', '2024-25', '2024-07-01', '2025-06-30', true),
('650e8400-e29b-41d4-a716-446655440002', '2023-24', '2023-07-01', '2024-06-30', false);

-- =====================================================
-- INSERT HOSTEL ROOMS
-- =====================================================

INSERT INTO public.hostel_rooms (id, room_number, floor, block, capacity, current_occupancy, room_type, amenities) VALUES
-- Block A - Ground Floor
('750e8400-e29b-41d4-a716-446655440001', 'A-101', 1, 'A', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440002', 'A-102', 1, 'A', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440003', 'A-103', 1, 'A', 2, 0, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440004', 'A-104', 1, 'A', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440005', 'A-105', 1, 'A', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),

-- Block A - First Floor
('750e8400-e29b-41d4-a716-446655440006', 'A-201', 2, 'A', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440007', 'A-202', 2, 'A', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440008', 'A-203', 2, 'A', 2, 0, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440009', 'A-204', 2, 'A', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440010', 'A-205', 2, 'A', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),

-- Block B - Ground Floor
('750e8400-e29b-41d4-a716-446655440011', 'B-101', 1, 'B', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440012', 'B-102', 1, 'B', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440013', 'B-103', 1, 'B', 2, 0, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440014', 'B-104', 1, 'B', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440015', 'B-105', 1, 'B', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),

-- Block B - First Floor
('750e8400-e29b-41d4-a716-446655440016', 'B-201', 2, 'B', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440017', 'B-202', 2, 'B', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440018', 'B-203', 2, 'B', 2, 0, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440019', 'B-204', 2, 'B', 2, 2, 'double', ARRAY['AC', 'WiFi', 'Study Table']),
('750e8400-e29b-41d4-a716-446655440020', 'B-205', 2, 'B', 2, 1, 'double', ARRAY['AC', 'WiFi', 'Study Table']);

-- =====================================================
-- INSERT SUBJECTS
-- =====================================================

INSERT INTO public.subjects (id, name, code, department_id, credits, semester) VALUES
-- CSE Subjects
('850e8400-e29b-41d4-a716-446655440001', 'Data Structures and Algorithms', 'CS201', '550e8400-e29b-41d4-a716-446655440001', 4, 3),
('850e8400-e29b-41d4-a716-446655440002', 'Database Management Systems', 'CS301', '550e8400-e29b-41d4-a716-446655440001', 4, 5),
('850e8400-e29b-41d4-a716-446655440003', 'Computer Networks', 'CS401', '550e8400-e29b-41d4-a716-446655440001', 4, 7),
('850e8400-e29b-41d4-a716-446655440004', 'Software Engineering', 'CS402', '550e8400-e29b-41d4-a716-446655440001', 3, 7),
('850e8400-e29b-41d4-a716-446655440005', 'Machine Learning', 'CS501', '550e8400-e29b-41d4-a716-446655440001', 3, 9),

-- ECE Subjects
('850e8400-e29b-41d4-a716-446655440006', 'Digital Electronics', 'EC201', '550e8400-e29b-41d4-a716-446655440002', 4, 3),
('850e8400-e29b-41d4-a716-446655440007', 'Communication Systems', 'EC301', '550e8400-e29b-41d4-a716-446655440002', 4, 5),
('850e8400-e29b-41d4-a716-446655440008', 'Microprocessors', 'EC401', '550e8400-e29b-41d4-a716-446655440002', 4, 7),

-- ME Subjects
('850e8400-e29b-41d4-a716-446655440009', 'Thermodynamics', 'ME201', '550e8400-e29b-41d4-a716-446655440003', 4, 3),
('850e8400-e29b-41d4-a716-446655440010', 'Machine Design', 'ME301', '550e8400-e29b-41d4-a716-446655440003', 4, 5),

-- CE Subjects
('850e8400-e29b-41d4-a716-446655440011', 'Structural Analysis', 'CE201', '550e8400-e29b-41d4-a716-446655440004', 4, 3),
('850e8400-e29b-41d4-a716-446655440012', 'Concrete Technology', 'CE301', '550e8400-e29b-41d4-a716-446655440004', 4, 5),

-- EE Subjects
('850e8400-e29b-41d4-a716-446655440013', 'Power Systems', 'EE201', '550e8400-e29b-41d4-a716-446655440005', 4, 3),
('850e8400-e29b-41d4-a716-446655440014', 'Control Systems', 'EE301', '550e8400-e29b-41d4-a716-446655440005', 4, 5);

-- =====================================================
-- INSERT LIBRARY BOOKS
-- =====================================================

INSERT INTO public.library_books (id, title, author, isbn, publisher, publication_year, category, total_copies, available_copies, location) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'MIT Press', 2009, 'Computer Science', 5, 3, 'CS-Section-A1'),
('950e8400-e29b-41d4-a716-446655440002', 'Database System Concepts', 'Abraham Silberschatz', '978-0073523323', 'McGraw-Hill', 2019, 'Computer Science', 3, 2, 'CS-Section-A2'),
('950e8400-e29b-41d4-a716-446655440003', 'Computer Networks', 'Andrew S. Tanenbaum', '978-0132126953', 'Prentice Hall', 2010, 'Computer Science', 4, 4, 'CS-Section-A3'),
('950e8400-e29b-41d4-a716-446655440004', 'Digital Design', 'M. Morris Mano', '978-0132774208', 'Prentice Hall', 2012, 'Electronics', 3, 2, 'EC-Section-B1'),
('950e8400-e29b-41d4-a716-446655440005', 'Thermodynamics: An Engineering Approach', 'Yunus A. Cengel', '978-0073398174', 'McGraw-Hill', 2014, 'Mechanical Engineering', 2, 1, 'ME-Section-C1'),
('950e8400-e29b-41d4-a716-446655440006', 'Structural Analysis', 'R. C. Hibbeler', '978-0133942842', 'Prentice Hall', 2016, 'Civil Engineering', 3, 3, 'CE-Section-D1'),
('950e8400-e29b-41d4-a716-446655440007', 'Power System Analysis', 'John J. Grainger', '978-0070612938', 'McGraw-Hill', 2017, 'Electrical Engineering', 2, 1, 'EE-Section-E1'),
('950e8400-e29b-41d4-a716-446655440008', 'Principles of Marketing', 'Philip Kotler', '978-0132167123', 'Prentice Hall', 2019, 'Business', 4, 4, 'MBA-Section-F1');

-- =====================================================
-- INSERT PLACEMENT DRIVES
-- =====================================================

INSERT INTO public.placement_drives (id, company_name, job_title, job_description, requirements, salary_range, location, drive_date, application_deadline, eligibility_criteria, is_active, created_by) VALUES
('1050e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Software Engineer', 'Full-stack development role with focus on web applications', 'B.Tech CSE/IT, 7+ CGPA, Strong programming skills', '6-12 LPA', 'Bangalore', '2024-12-15', '2024-12-10', 'B.Tech CSE/IT with 7+ CGPA', true, '00000000-0000-0000-0000-000000000000'),
('1050e8400-e29b-41d4-a716-446655440002', 'DataFlow Systems', 'Data Analyst', 'Data analysis and visualization role', 'B.Tech any branch, 6.5+ CGPA, SQL knowledge', '4-8 LPA', 'Mumbai', '2024-12-20', '2024-12-15', 'B.Tech any branch with 6.5+ CGPA', true, '00000000-0000-0000-0000-000000000000'),
('1050e8400-e29b-41d4-a716-446655440003', 'InnovateTech', 'Product Manager', 'Product management and strategy role', 'MBA/B.Tech, 7+ CGPA, Leadership skills', '8-15 LPA', 'Delhi', '2024-12-25', '2024-12-20', 'MBA or B.Tech with 7+ CGPA', true, '00000000-0000-0000-0000-000000000000');

-- =====================================================
-- INSERT SYSTEM SETTINGS
-- =====================================================

INSERT INTO public.system_settings (id, setting_key, setting_value, description, category, is_public) VALUES
('1150e8400-e29b-41d4-a716-446655440001', 'institute_name', 'Edu-Sync Institute of Technology', 'Name of the educational institute', 'general', true),
('1150e8400-e29b-41d4-a716-446655440002', 'institute_address', '123 Education Street, Knowledge City, KC 123456', 'Address of the institute', 'general', true),
('1150e8400-e29b-41d4-a716-446655440003', 'academic_year', '2024-25', 'Current academic year', 'academic', true),
('1150e8400-e29b-41d4-a716-446655440004', 'max_attendance_days', '90', 'Maximum attendance days per semester', 'academic', false),
('1150e8400-e29b-41d4-a716-446655440005', 'min_attendance_percentage', '75', 'Minimum attendance percentage required', 'academic', true),
('1150e8400-e29b-41d4-a716-446655440006', 'library_fine_per_day', '5', 'Library fine per day for overdue books', 'library', true),
('1150e8400-e29b-41d4-a716-446655440007', 'max_book_issue_days', '14', 'Maximum days for book issue', 'library', true),
('1150e8400-e29b-41d4-a716-446655440008', 'hostel_fee_per_month', '15000', 'Monthly hostel fee', 'financial', false),
('1150e8400-e29b-41d4-a716-446655440009', 'tuition_fee_per_semester', '50000', 'Tuition fee per semester', 'financial', false);

-- =====================================================
-- CREATE TEST USERS (These will be created via Supabase Auth)
-- =====================================================

-- Note: The following users will be created through Supabase Auth API
-- We'll insert their profile data here assuming they exist in auth.users

-- Sample user IDs (these should match actual auth.users IDs after creation)
-- For testing purposes, we'll use placeholder UUIDs

-- =====================================================
-- INSERT SAMPLE ANNOUNCEMENTS
-- =====================================================

INSERT INTO public.announcements (id, title, content, author_id, channel, priority, is_active) VALUES
('1250e8400-e29b-41d4-a716-446655440001', 'Welcome to New Academic Session 2024-25', 'Welcome all students to the new academic session. Classes will commence from July 1st, 2024.', '00000000-0000-0000-0000-000000000000', 'all', 'high', true),
('1250e8400-e29b-41d4-a716-446655440002', 'Hostel Room Allotment', 'Hostel room allotment for new students will be done on June 25th, 2024. Please report to the hostel office.', '00000000-0000-0000-0000-000000000000', 'hostel_residents', 'medium', true),
('1250e8400-e29b-41d4-a716-446655440003', 'Library Timings', 'Library will remain open from 8 AM to 10 PM on weekdays and 9 AM to 6 PM on weekends.', '00000000-0000-0000-0000-000000000000', 'all', 'low', true),
('1250e8400-e29b-41d4-a716-446655440004', 'Placement Drive - TechCorp Solutions', 'TechCorp Solutions is conducting a placement drive on December 15th. Eligible students can apply.', '00000000-0000-0000-0000-000000000000', 'placement', 'high', true),
('1250e8400-e29b-41d4-a716-446655440005', 'CSE Department Meeting', 'All CSE students are requested to attend the department meeting on July 5th at 2 PM in the main auditorium.', '00000000-0000-0000-0000-000000000000', 'department_specific', 'medium', true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC COMPREHENSIVE DATA SEEDING COMPLETED SUCCESSFULLY!';
    RAISE NOTICE 'Next step: Create test users via Supabase Auth and run 004_create_test_users.sql';
    RAISE NOTICE 'Database is now ready for the Edu-Sync ERP system!';
END $$;
