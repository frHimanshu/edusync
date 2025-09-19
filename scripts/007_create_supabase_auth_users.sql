-- Create actual Supabase Auth users for testing
-- This script creates users in the auth.users table that Supabase Auth can recognize

-- Note: In a real environment, these would be created through the Supabase Auth API
-- For testing purposes, we're inserting directly into auth.users

-- Insert test users into Supabase's auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES 
-- Student 1: student1@edusync.edu / TEMP1234
(
  '550e8400-e29b-41d4-a716-446655440010',
  '00000000-0000-0000-0000-000000000000',
  'student1@edusync.edu',
  '$2a$10$8K1p/a0dhrxiH8Tf2aHzSuIXiLysqVFqkqAD/8t4qJ8qGjZQJ/Ezi', -- TEMP1234
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
),
-- Student 2: student2@edusync.edu / TEMP5678  
(
  '550e8400-e29b-41d4-a716-446655440011',
  '00000000-0000-0000-0000-000000000000',
  'student2@edusync.edu',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- TEMP5678
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
),
-- Student 3: student3@edusync.edu / password123
(
  '550e8400-e29b-41d4-a716-446655440012',
  '00000000-0000-0000-0000-000000000000',
  'student3@edusync.edu',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye.IcnJIz.UqRxFJdhuHpyEWoOEBq54EO', -- password123
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
),
-- Accountant: accountant@edusync.edu / admin123
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'accountant@edusync.edu',
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ4uUiaj6eqkE8mvuDamOWLskb8.ESm6', -- admin123
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- Also ensure our users table has the corresponding entries
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
),
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
