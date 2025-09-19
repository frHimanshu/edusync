-- Sample data for Phase 2 features
-- This script adds sample data for testing the new features

-- Insert sample accountant user (this would normally be done through the registration system)
INSERT INTO auth.users (id, email) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'accountant@edusync.edu')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (
  id, email, role, first_name, last_name, employee_id, 
  password_set, first_login, department, created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'accountant@edusync.edu',
  'accountant',
  'Jennifer',
  'Smith',
  'ACC001',
  true,
  false,
  'Accounts Department',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample students with first-time login status
INSERT INTO auth.users (id, email) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'student1@edusync.edu'),
('550e8400-e29b-41d4-a716-446655440011', 'student2@edusync.edu'),
('550e8400-e29b-41d4-a716-446655440012', 'student3@edusync.edu')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (
  id, email, role, first_name, last_name, student_id, 
  password_set, first_login, temp_password, department, 
  course, admission_year, is_hostel_resident, created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  'student1@edusync.edu',
  'student',
  'Alex',
  'Johnson',
  'DTE24CSE101',
  false,
  true,
  'TEMP1234',
  'Computer Science',
  'Bachelor of Technology',
  2024,
  true,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'student2@edusync.edu',
  'student',
  'Sarah',
  'Williams',
  'DTE24ECE102',
  false,
  true,
  'TEMP5678',
  'Electronics',
  'Bachelor of Technology',
  2024,
  true,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'student3@edusync.edu',
  'student',
  'Michael',
  'Brown',
  'DTE24MEE103',
  true,
  false,
  NULL,
  'Mechanical',
  'Bachelor of Technology',
  2024,
  false,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample fee records
INSERT INTO public.fee_records (
  student_id, fee_type, amount, due_date, payment_status, 
  academic_year, semester, created_by
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  'tuition',
  50000.00,
  '2024-04-15',
  'pending',
  '2024-25',
  'Spring',
  '550e8400-e29b-41d4-a716-446655440003'
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'hostel',
  15000.00,
  '2024-04-15',
  'paid',
  '2024-25',
  'Spring',
  '550e8400-e29b-41d4-a716-446655440003'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'tuition',
  50000.00,
  '2024-04-15',
  'paid',
  '2024-25',
  'Spring',
  '550e8400-e29b-41d4-a716-446655440003'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'hostel',
  15000.00,
  '2024-04-15',
  'paid',
  '2024-25',
  'Spring',
  '550e8400-e29b-41d4-a716-446655440003'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'tuition',
  50000.00,
  '2024-04-15',
  'paid',
  '2024-25',
  'Spring',
  '550e8400-e29b-41d4-a716-446655440003'
);

-- Insert student registration records
INSERT INTO public.student_registrations (
  student_id, registered_by, academic_year, admission_type, 
  documents_verified, fees_paid, status
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-25',
  'regular',
  true,
  false,
  'active'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-25',
  'regular',
  true,
  true,
  'active'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-25',
  'regular',
  true,
  true,
  'active'
);

-- Insert room assignments for hostel students
INSERT INTO public.room_assignments (student_id, room_id, is_active) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  (SELECT id FROM public.hostel_rooms WHERE block_name = 'Block A' AND room_number = '101' LIMIT 1),
  true
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  (SELECT id FROM public.hostel_rooms WHERE block_name = 'Block A' AND room_number = '101' LIMIT 1),
  true
);

-- Insert enhanced announcements with priority and targeting
INSERT INTO public.announcements (
  title, content, type, author_id, priority, target_audience, 
  department_filter, is_pinned, created_at
) VALUES 
(
  'Fee Payment Deadline Reminder',
  'This is a reminder that the fee payment deadline for Spring 2024 semester is April 15th, 2024. Please ensure all dues are cleared before the deadline to avoid late fees.',
  'general',
  '550e8400-e29b-41d4-a716-446655440003',
  'urgent',
  'students',
  NULL,
  true,
  NOW() - INTERVAL '2 days'
),
(
  'New Student Orientation - Computer Science',
  'Welcome to all new Computer Science students! Orientation session will be held on March 20th, 2024 at 10:00 AM in the main auditorium.',
  'academic',
  '550e8400-e29b-41d4-a716-446655440003',
  'high',
  'students',
  'Computer Science',
  false,
  NOW() - INTERVAL '1 day'
),
(
  'Hostel Room Inspection Schedule',
  'Room inspections for Block A will be conducted on March 25th, 2024. Please ensure your rooms are clean and organized.',
  'hostel',
  (SELECT id FROM public.users WHERE role = 'hostel_authority' LIMIT 1),
  'normal',
  'students',
  NULL,
  false,
  NOW() - INTERVAL '3 hours'
);
