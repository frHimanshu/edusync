-- Seed the database with sample data for testing

-- Insert sample hostel rooms (Ground floor and First floor)
INSERT INTO hostel_rooms (room_number, floor_number, capacity, current_occupancy, status) VALUES
-- Ground Floor
('G-101', 'Ground', 2, 2, 'Full'),
('G-102', 'Ground', 2, 1, 'Partially Occupied'),
('G-103', 'Ground', 2, 0, 'Empty'),
('G-104', 'Ground', 2, 2, 'Full'),
('G-105', 'Ground', 2, 1, 'Partially Occupied'),
('G-106', 'Ground', 2, 0, 'Empty'),
('G-107', 'Ground', 2, 2, 'Full'),
('G-108', 'Ground', 2, 0, 'Empty'),
-- First Floor
('F-201', 'First', 2, 2, 'Full'),
('F-202', 'First', 2, 1, 'Partially Occupied'),
('F-203', 'First', 2, 0, 'Empty'),
('F-204', 'First', 2, 2, 'Full'),
('F-205', 'First', 2, 1, 'Partially Occupied'),
('F-206', 'First', 2, 0, 'Empty'),
('F-207', 'First', 2, 2, 'Full'),
('F-208', 'First', 2, 0, 'Empty');

-- Insert sample auth users
INSERT INTO auth_users (email, role, is_first_login) VALUES
-- Students
('john.doe@student.edu', 'Student', false),
('jane.smith@student.edu', 'Student', false),
('mike.wilson@student.edu', 'Student', true), -- First time login
-- Faculty
('prof.johnson@college.edu', 'Faculty', false),
('dr.brown@college.edu', 'Faculty', false),
-- Hostel Authority
('hostel.warden@college.edu', 'Hostel Authority', false),
-- Administrator
('admin@college.edu', 'Administrator', false),
-- Accountant
('accounts@college.edu', 'Accountant', false);

-- Insert sample students
INSERT INTO students (student_id, user_id, full_name, date_of_birth, contact_number, email, course_department, admission_year, is_hostel_resident, hostel_room_id) VALUES
('DTE24S101', (SELECT id FROM auth_users WHERE email = 'john.doe@student.edu'), 'John Doe', '2005-03-15', '+91-9876543210', 'john.doe@student.edu', 'Computer Science', 2024, true, (SELECT id FROM hostel_rooms WHERE room_number = 'G-101')),
('DTE24S102', (SELECT id FROM auth_users WHERE email = 'jane.smith@student.edu'), 'Jane Smith', '2005-07-22', '+91-9876543211', 'jane.smith@student.edu', 'Electronics', 2024, false, NULL),
('DTE25S103', (SELECT id FROM auth_users WHERE email = 'mike.wilson@student.edu'), 'Mike Wilson', '2006-01-10', '+91-9876543212', 'mike.wilson@student.edu', 'Mechanical', 2025, true, (SELECT id FROM hostel_rooms WHERE room_number = 'G-102'));

-- Insert sample authorities
INSERT INTO authorities (user_id, full_name, employee_id, department, designation, contact_number) VALUES
((SELECT id FROM auth_users WHERE email = 'prof.johnson@college.edu'), 'Prof. Robert Johnson', 'FAC001', 'Computer Science', 'Professor', '+91-9876543220'),
((SELECT id FROM auth_users WHERE email = 'dr.brown@college.edu'), 'Dr. Sarah Brown', 'FAC002', 'Electronics', 'Associate Professor', '+91-9876543221'),
((SELECT id FROM auth_users WHERE email = 'hostel.warden@college.edu'), 'Mr. David Wilson', 'HST001', 'Hostel', 'Warden', '+91-9876543222'),
((SELECT id FROM auth_users WHERE email = 'admin@college.edu'), 'Ms. Lisa Anderson', 'ADM001', 'Administration', 'Administrator', '+91-9876543223'),
((SELECT id FROM auth_users WHERE email = 'accounts@college.edu'), 'Mr. James Miller', 'ACC001', 'Accounts', 'Accountant', '+91-9876543224');

-- Insert sample announcements
INSERT INTO announcements (title, content, category, announcement_type, created_by) VALUES
('Hackathon 2025 Registration Open', 'The annual college hackathon registration is now open. Students can register at the computer lab.', 'Event', 'General', (SELECT id FROM auth_users WHERE email = 'prof.johnson@college.edu')),
('Mid-term Exam Schedule', 'Mid-term examinations will commence from March 15th, 2025. Check your respective department notice boards for detailed schedules.', 'Academic', 'General', (SELECT id FROM auth_users WHERE email = 'dr.brown@college.edu')),
('Hostel Maintenance Notice', 'Water supply will be temporarily suspended on Sunday from 10 AM to 2 PM for maintenance work.', 'Maintenance', 'Hostel', (SELECT id FROM auth_users WHERE email = 'hostel.warden@college.edu')),
('New Hostel Rules', 'Updated hostel rules are now in effect. Please check the hostel notice board for complete details.', 'Rules', 'Hostel', (SELECT id FROM auth_users WHERE email = 'hostel.warden@college.edu'));
