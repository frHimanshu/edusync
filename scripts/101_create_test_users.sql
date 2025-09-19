-- Create comprehensive test users for all roles
-- This script creates test users with proper authentication and profiles

-- Test credentials for development
-- Students: student1@college.edu / password123, student2@college.edu / password123
-- Faculty: faculty1@college.edu / password123
-- Admin: admin@college.edu / password123
-- Hostel: hostel@college.edu / password123
-- Accountant: accountant@college.edu / password123
-- HOD: hod@college.edu / password123

-- Insert test users into auth.users (bypassing email confirmation for development)
INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at, 
    created_at, updated_at, raw_user_meta_data, is_super_admin
) VALUES 
-- Students
(
    '11111111-1111-1111-1111-111111111111',
    'student1@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "student", "first_name": "John", "last_name": "Doe", "student_id": "STU2024001", "department": "Computer Science", "admission_year": 2024}',
    false
),
(
    '22222222-2222-2222-2222-222222222222',
    'student2@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "student", "first_name": "Jane", "last_name": "Smith", "student_id": "STU2024002", "department": "Electronics", "admission_year": 2024}',
    false
),
-- Faculty
(
    '33333333-3333-3333-3333-333333333333',
    'faculty1@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "faculty", "first_name": "Dr. Robert", "last_name": "Johnson", "employee_id": "FAC001", "department": "Computer Science", "designation": "Professor"}',
    false
),
-- Administrator
(
    '44444444-4444-4444-4444-444444444444',
    'admin@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "administrator", "first_name": "Admin", "last_name": "User", "employee_id": "ADM001", "department": "Administration", "designation": "Administrator"}',
    false
),
-- Hostel Authority
(
    '55555555-5555-5555-5555-555555555555',
    'hostel@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "hostel_authority", "first_name": "Hostel", "last_name": "Warden", "employee_id": "HST001", "department": "Hostel", "designation": "Warden"}',
    false
),
-- Accountant
(
    '66666666-6666-6666-6666-666666666666',
    'accountant@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "accountant", "first_name": "Finance", "last_name": "Officer", "employee_id": "ACC001", "department": "Accounts", "designation": "Accountant"}',
    false
),
-- HOD
(
    '77777777-7777-7777-7777-777777777777',
    'hod@college.edu',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"role": "hod", "first_name": "Dr. Head", "last_name": "Department", "employee_id": "HOD001", "department": "Computer Science", "designation": "HOD"}',
    false
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = NOW(),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- The trigger will automatically create profiles in users, students, and authorities tables

-- Add some sample subjects
INSERT INTO subjects (id, code, name, credits, department, created_at) VALUES
(gen_random_uuid(), 'CS101', 'Introduction to Programming', 4, 'Computer Science', NOW()),
(gen_random_uuid(), 'CS201', 'Data Structures', 4, 'Computer Science', NOW()),
(gen_random_uuid(), 'EC101', 'Basic Electronics', 3, 'Electronics', NOW()),
(gen_random_uuid(), 'MA101', 'Mathematics I', 4, 'Mathematics', NOW()),
(gen_random_uuid(), 'PH101', 'Physics I', 3, 'Physics', NOW())
ON CONFLICT (code) DO NOTHING;

-- Add sample hostel rooms
INSERT INTO hostel_rooms (id, room_number, floor_number, capacity, current_occupancy, status, created_at, updated_at) VALUES
(gen_random_uuid(), '101', '1', 2, 1, 'occupied', NOW(), NOW()),
(gen_random_uuid(), '102', '1', 2, 0, 'available', NOW(), NOW()),
(gen_random_uuid(), '103', '1', 2, 2, 'full', NOW(), NOW()),
(gen_random_uuid(), '201', '2', 2, 1, 'occupied', NOW(), NOW()),
(gen_random_uuid(), '202', '2', 2, 0, 'available', NOW(), NOW())
ON CONFLICT (room_number) DO NOTHING;

-- Add sample announcements
INSERT INTO announcements (id, title, content, announcement_type, category, created_by, created_at, updated_at) VALUES
(
    gen_random_uuid(),
    'Welcome to New Academic Year',
    'Welcome all students to the new academic year 2024-25. Classes will begin from Monday.',
    'general',
    'academic',
    '44444444-4444-4444-4444-444444444444',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Hostel Room Allocation',
    'New students can collect their hostel room keys from the hostel office.',
    'general',
    'hostel',
    '55555555-5555-5555-5555-555555555555',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Fee Payment Reminder',
    'All students are reminded to pay their semester fees by the end of this month.',
    'general',
    'academic',
    '66666666-6666-6666-6666-666666666666',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add sample timetable entries
INSERT INTO timetable (id, subject_id, faculty_id, day_of_week, start_time, end_time, room, created_at) VALUES
(
    gen_random_uuid(),
    (SELECT id FROM subjects WHERE code = 'CS101' LIMIT 1),
    '33333333-3333-3333-3333-333333333333',
    1, -- Monday
    '09:00:00',
    '10:00:00',
    'Room 101',
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM subjects WHERE code = 'CS201' LIMIT 1),
    '33333333-3333-3333-3333-333333333333',
    2, -- Tuesday
    '10:00:00',
    '11:00:00',
    'Room 102',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add sample wallet transactions
INSERT INTO wallet_transactions (id, student_id, type, amount, description, awarded_by, created_at, expires_at) VALUES
(
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    'credit',
    100.00,
    'Welcome bonus for new students',
    '44444444-4444-4444-4444-444444444444',
    NOW(),
    NOW() + INTERVAL '1 year'
),
(
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'credit',
    50.00,
    'Attendance bonus',
    '33333333-3333-3333-3333-333333333333',
    NOW(),
    NOW() + INTERVAL '6 months'
)
ON CONFLICT (id) DO NOTHING;

-- Success message with login credentials
SELECT 
    'Test users created successfully!' as status,
    'Login Credentials:' as info,
    'Students: student1@college.edu / password123, student2@college.edu / password123' as student_logins,
    'Faculty: faculty1@college.edu / password123' as faculty_login,
    'Admin: admin@college.edu / password123' as admin_login,
    'Hostel: hostel@college.edu / password123' as hostel_login,
    'Accountant: accountant@college.edu / password123' as accountant_login,
    'HOD: hod@college.edu / password123' as hod_login;
