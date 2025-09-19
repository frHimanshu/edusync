-- Create a direct test user in Supabase Auth
-- This needs to be run manually in Supabase SQL editor or through API

-- First, let's create the auth user (this would normally be done through Supabase Auth API)
-- For now, let's create a user profile that matches what would be created

-- Insert test user profile
INSERT INTO users (
  id,
  email,
  role,
  full_name,
  student_id,
  department,
  year,
  contact_number,
  date_of_birth,
  course,
  is_hostel_resident,
  emergency_contact_name,
  emergency_contact_relation,
  emergency_contact_phone,
  parent_guardian_name,
  parent_guardian_phone,
  first_login,
  temp_password,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test.student@edusync.edu',
  'student',
  'Test Student',
  'DTE24CSE999',
  'Computer Science',
  1,
  '+1234567890',
  '2000-01-01',
  'Bachelor of Technology',
  false,
  'Emergency Contact',
  'parent',
  '+1234567891',
  'Parent Name',
  '+1234567892',
  true,
  'TEST1234',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert accountant test user
INSERT INTO users (
  id,
  email,
  role,
  full_name,
  contact_number,
  first_login,
  temp_password,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'accountant.test@edusync.edu',
  'accountant',
  'Test Accountant',
  '+1234567893',
  false,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
