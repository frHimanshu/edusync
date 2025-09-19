-- Insert test users for immediate login testing
-- This script ensures we have working test credentials

-- First, let's insert into the users table (our main user table)
INSERT INTO public.users (
  id, email, role, first_name, last_name, student_id, 
  password_set, first_login, temp_password, department, 
  course, admission_year, is_hostel_resident, created_at
) VALUES 
-- Test Student 1 (needs password setup)
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
-- Test Student 2 (needs password setup)
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
-- Test Student 3 (password already set)
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
),
-- Test Accountant
(
  '550e8400-e29b-41d4-a716-446655440003',
  'accountant@edusync.edu',
  'accountant',
  'Jennifer',
  'Smith',
  NULL,
  true,
  false,
  NULL,
  'Accounts Department',
  NULL,
  NULL,
  false,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  student_id = EXCLUDED.student_id,
  password_set = EXCLUDED.password_set,
  first_login = EXCLUDED.first_login,
  temp_password = EXCLUDED.temp_password,
  department = EXCLUDED.department,
  course = EXCLUDED.course,
  admission_year = EXCLUDED.admission_year,
  is_hostel_resident = EXCLUDED.is_hostel_resident;

-- Also insert into auth_users table for compatibility
INSERT INTO public.auth_users (id, email, role, is_first_login, password_hash) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'student1@edusync.edu', 'Student', true, '$2b$10$dummy.hash.for.temp.password.TEMP1234'),
('550e8400-e29b-41d4-a716-446655440011', 'student2@edusync.edu', 'Student', true, '$2b$10$dummy.hash.for.temp.password.TEMP5678'),
('550e8400-e29b-41d4-a716-446655440012', 'student3@edusync.edu', 'Student', false, '$2b$10$dummy.hash.for.set.password'),
('550e8400-e29b-41d4-a716-446655440003', 'accountant@edusync.edu', 'Accountant', false, '$2b$10$dummy.hash.for.accountant')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  is_first_login = EXCLUDED.is_first_login,
  password_hash = EXCLUDED.password_hash;
