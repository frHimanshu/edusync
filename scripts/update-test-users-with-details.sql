-- Update student1 with specific details
UPDATE users 
SET 
  name = 'John Smith',
  student_id = 'STU2024001',
  department = 'Computer Science',
  year = '3',
  semester = '6',
  cgpa = 8.5,
  hostel_room = '204A',
  phone = '+91-9876543210'
WHERE email = 'student1@test.edu';

-- Update student2 with different details
UPDATE users 
SET 
  name = 'Sarah Johnson',
  student_id = 'STU2024002',
  department = 'Electronics Engineering',
  year = '2',
  semester = '4',
  cgpa = 9.1,
  hostel_room = '156B',
  phone = '+91-9876543211'
WHERE email = 'student2@test.edu';

-- Update hostel authority with details
UPDATE users 
SET 
  name = 'Michael Brown',
  employee_id = 'EMP2024001',
  department = 'Hostel Administration',
  phone = '+91-9876543212'
WHERE email = 'hostel@test.edu';

-- Update accountant with details
UPDATE users 
SET 
  name = 'Lisa Davis',
  employee_id = 'EMP2024002',
  department = 'Finance Department',
  phone = '+91-9876543213'
WHERE email = 'accountant@test.edu';

-- Update admin with details
UPDATE users 
SET 
  name = 'Robert Wilson',
  employee_id = 'EMP2024003',
  department = 'Administration',
  phone = '+91-9876543214'
WHERE email = 'admin@test.edu';
