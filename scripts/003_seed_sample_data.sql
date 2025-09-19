-- Sample Data for Edu-Sync ERP System
-- This script populates the database with test data

-- Insert Academic Session
INSERT INTO public.academic_sessions (session_name, start_date, end_date, is_current) VALUES
('2024-25', '2024-07-01', '2025-06-30', true);

-- Insert Departments
INSERT INTO public.departments (name, code) VALUES
('Computer Science Engineering', 'CSE'),
('Electronics and Communication', 'ECE'),
('Mechanical Engineering', 'ME'),
('Civil Engineering', 'CE'),
('Information Technology', 'IT');

-- Insert Subjects for CSE Department
INSERT INTO public.subjects (name, code, department_id, credits, semester) VALUES
('Data Structures and Algorithms', 'CSE201', (SELECT id FROM public.departments WHERE code = 'CSE'), 4, 3),
('Database Management Systems', 'CSE301', (SELECT id FROM public.departments WHERE code = 'CSE'), 3, 5),
('Operating Systems', 'CSE302', (SELECT id FROM public.departments WHERE code = 'CSE'), 3, 5),
('Computer Networks', 'CSE401', (SELECT id FROM public.departments WHERE code = 'CSE'), 3, 7),
('Software Engineering', 'CSE402', (SELECT id FROM public.departments WHERE code = 'CSE'), 3, 7);

-- Insert Subjects for ECE Department
INSERT INTO public.subjects (name, code, department_id, credits, semester) VALUES
('Digital Electronics', 'ECE201', (SELECT id FROM public.departments WHERE code = 'ECE'), 4, 3),
('Microprocessors', 'ECE301', (SELECT id FROM public.departments WHERE code = 'ECE'), 3, 5),
('Communication Systems', 'ECE302', (SELECT id FROM public.departments WHERE code = 'ECE'), 3, 5);

-- Insert Hostel Rooms
INSERT INTO public.hostel_rooms (room_number, floor, block, capacity, room_type, amenities) VALUES
('A101', 1, 'A', 2, 'double', ARRAY['WiFi', 'AC', 'Study Table']),
('A102', 1, 'A', 2, 'double', ARRAY['WiFi', 'Fan', 'Study Table']),
('A201', 2, 'A', 1, 'single', ARRAY['WiFi', 'AC', 'Study Table', 'Balcony']),
('B101', 1, 'B', 3, 'triple', ARRAY['WiFi', 'Fan', 'Study Table']),
('B102', 1, 'B', 2, 'double', ARRAY['WiFi', 'AC', 'Study Table']);

-- Note: Actual user creation will be handled by Supabase Auth
-- The following are placeholder entries that will be updated with real auth user IDs

-- Sample Announcements
INSERT INTO public.announcements (title, content, target_audience, priority) VALUES
('Welcome to New Academic Session', 'Welcome to the 2024-25 academic session. Please check your timetables and report to your respective departments.', 'all', 'high'),
('Library Timings Updated', 'The library will now be open from 8 AM to 10 PM on weekdays and 9 AM to 6 PM on weekends.', 'students', 'medium'),
('Faculty Meeting Scheduled', 'All faculty members are requested to attend the monthly meeting on Friday at 3 PM in the conference hall.', 'faculty', 'high'),
('Hostel Mess Menu Updated', 'New mess menu has been uploaded. Please check the hostel notice board for details.', 'hostel_residents', 'low');

-- Sample Timetable entries (will be updated with actual IDs after user creation)
-- These are placeholder entries
INSERT INTO public.timetable (day_of_week, start_time, end_time, room_number, semester, department_id) VALUES
(1, '09:00', '10:00', 'CSE-101', 3, (SELECT id FROM public.departments WHERE code = 'CSE')),
(1, '10:00', '11:00', 'CSE-102', 3, (SELECT id FROM public.departments WHERE code = 'CSE')),
(2, '09:00', '10:00', 'ECE-101', 3, (SELECT id FROM public.departments WHERE code = 'ECE')),
(2, '10:00', '11:00', 'ECE-102', 3, (SELECT id FROM public.departments WHERE code = 'ECE'));

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
