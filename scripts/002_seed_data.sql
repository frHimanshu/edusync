-- Insert sample subjects
INSERT INTO public.subjects (name, code, department, credits) VALUES
('Computer Science Fundamentals', 'CS101', 'Computer Science', 4),
('Data Structures', 'CS201', 'Computer Science', 4),
('Database Systems', 'CS301', 'Computer Science', 3),
('Mathematics I', 'MATH101', 'Mathematics', 3),
('Physics I', 'PHY101', 'Physics', 4),
('English Literature', 'ENG101', 'English', 2),
('Business Management', 'BUS101', 'Business', 3),
('Digital Marketing', 'BUS201', 'Business', 3)
ON CONFLICT (code) DO NOTHING;

-- Insert sample users (these will be created when users sign up)
-- This is just for reference - actual users are created through auth

-- Insert sample announcements
INSERT INTO public.announcements (title, content, type, author_id, is_event, event_date, event_location, max_participants) VALUES
('Welcome to New Semester', 'Welcome all students to the new academic semester. Please check your timetables and prepare for classes.', 'general', (SELECT id FROM auth.users LIMIT 1), false, null, null, null),
('Hostel Room Inspection', 'Monthly hostel room inspection will be conducted next week. Please ensure your rooms are clean and organized.', 'hostel', (SELECT id FROM auth.users LIMIT 1), false, null, null, null),
('Tech Fest 2024', 'Annual tech fest is coming up! Register now for various competitions and events.', 'event', (SELECT id FROM auth.users LIMIT 1), true, '2024-03-15 10:00:00+00', 'Main Auditorium', 500),
('Library Hours Extended', 'Library hours have been extended during exam period. New timings: 6 AM to 12 AM.', 'academic', (SELECT id FROM auth.users LIMIT 1), false, null, null, null)
ON CONFLICT DO NOTHING;

-- Insert sample timetable entries
INSERT INTO public.timetable (subject_id, faculty_id, day_of_week, start_time, end_time, room) VALUES
((SELECT id FROM public.subjects WHERE code = 'CS101' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 1, '09:00', '10:30', 'Room 101'),
((SELECT id FROM public.subjects WHERE code = 'CS201' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 1, '11:00', '12:30', 'Room 102'),
((SELECT id FROM public.subjects WHERE code = 'MATH101' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 2, '09:00', '10:30', 'Room 201'),
((SELECT id FROM public.subjects WHERE code = 'PHY101' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 3, '14:00', '15:30', 'Lab 1'),
((SELECT id FROM public.subjects WHERE code = 'ENG101' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 4, '10:00', '11:30', 'Room 301')
ON CONFLICT DO NOTHING;
