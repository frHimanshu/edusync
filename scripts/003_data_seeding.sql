-- =====================================================
-- EDU-SYNC ERP SYSTEM - DATA SEEDING
-- =====================================================
-- This script seeds the database with comprehensive test data
-- Run this script AFTER running 001_schema_creation.sql and 002_rls_security.sql

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('academic_year', '2024-25', 'Current academic year'),
('semester', 'Spring 2024', 'Current semester'),
('library_fine_per_day', '5.00', 'Fine amount per day for overdue books'),
('hostel_fee_per_semester', '25000.00', 'Hostel fee per semester'),
('tuition_fee_per_semester', '50000.00', 'Tuition fee per semester');

-- =====================================================
-- TEST USERS (AUTHORITIES)
-- =====================================================

-- Note: These users will be created through Supabase Auth
-- The following are the credentials that will be used:

-- ADMIN USERS
-- Email: admin@test.edu, Password: Admin123!, Role: administrator
-- Email: admin1@test.edu, Password: test123, Role: administrator

-- FACULTY USERS  
-- Email: faculty1@test.edu, Password: test123, Role: faculty
-- Email: faculty1@university.edu, Password: FacultyPass123!, Role: faculty
-- Email: faculty2@university.edu, Password: FacultyPass123!, Role: faculty

-- HOD USERS
-- Email: hod@university.edu, Password: HODPass123!, Role: hod

-- ACCOUNTANT USERS
-- Email: accountant@test.edu, Password: Account123!, Role: accountant
-- Email: accountant1@test.edu, Password: test123, Role: accountant
-- Email: accountant@university.edu, Password: AccountPass123!, Role: accountant

-- HOSTEL AUTHORITY USERS
-- Email: hostel@test.edu, Password: Hostel123!, Role: hostel_authority
-- Email: hostel1@test.edu, Password: test123, Role: hostel_authority
-- Email: hostel@university.edu, Password: HostelPass123!, Role: hostel_authority

-- LIBRARIAN USERS
-- Email: librarian@test.edu, Password: Library123!, Role: librarian
-- Email: librarian@university.edu, Password: LibraryPass123!, Role: librarian

-- PLACEMENT USERS
-- Email: placement@test.edu, Password: Placement123!, Role: placement
-- Email: placement@university.edu, Password: PlacementPass123!, Role: placement

-- STUDENT USERS
-- Email: student1@test.edu, Password: Student123!, Role: student
-- Email: student2@test.edu, Password: Student456!, Role: student
-- Email: student1@university.edu, Password: TempPass123!, Role: student (first-time login)
-- Email: student2@university.edu, Password: StudentPass123!, Role: student

-- =====================================================
-- SAMPLE AUTHORITIES DATA
-- =====================================================

-- Insert sample authorities (these will be linked to auth users when they sign up)
INSERT INTO public.authorities (authority_id, department, designation, specialization, experience_years) VALUES
('FAC001', 'Computer Science', 'Professor', 'Data Structures & Algorithms', 15),
('FAC002', 'Computer Science', 'Associate Professor', 'Database Systems', 10),
('FAC003', 'Electronics', 'Assistant Professor', 'Digital Electronics', 8),
('HOD001', 'Computer Science', 'Head of Department', 'Computer Science', 20),
('ACC001', 'Administration', 'Chief Accountant', 'Financial Management', 12),
('ACC002', 'Administration', 'Accountant', 'Student Accounts', 8),
('HST001', 'Administration', 'Hostel Warden', 'Hostel Management', 10),
('HST002', 'Administration', 'Assistant Warden', 'Hostel Operations', 5),
('LIB001', 'Administration', 'Chief Librarian', 'Library Science', 15),
('LIB002', 'Administration', 'Assistant Librarian', 'Digital Resources', 7),
('PLC001', 'Administration', 'Placement Officer', 'Career Services', 12),
('PLC002', 'Administration', 'Training Coordinator', 'Industry Relations', 9),
('ADM001', 'Administration', 'System Administrator', 'IT Management', 10);

-- =====================================================
-- SAMPLE STUDENTS DATA
-- =====================================================

-- Insert sample students (these will be linked to auth users when they sign up)
INSERT INTO public.students (
    student_id, department, course, semester, year_of_admission, 
    date_of_birth, gender, address, emergency_contact_name, 
    emergency_contact_phone, emergency_contact_relation, 
    medical_conditions, blood_group, cgpa, total_credits, 
    is_hostel_resident, room_number, fee_status, tags
) VALUES
('STU2024001', 'Computer Science', 'B.Tech Computer Science', '8th Semester', 2021, 
 '2002-05-15', 'Male', '123 Main St, City, State', 'John Doe Sr.', 
 '+91-9876543210', 'Father', 'None', 'O+', 8.5, 120, 
 true, 'A101', 'paid', ARRAY['hostel_resident', 'scholarship']),

('STU2024002', 'Electronics', 'B.Tech Electronics', '6th Semester', 2022, 
 '2003-08-22', 'Female', '456 Oak Ave, City, State', 'Mary Johnson', 
 '+91-9876543211', 'Mother', 'Asthma', 'A+', 9.1, 90, 
 true, 'B205', 'paid', ARRAY['hostel_resident']),

('STU2024003', 'Mechanical', 'B.Tech Mechanical', '4th Semester', 2023, 
 '2004-01-10', 'Male', '789 Pine Rd, City, State', 'Robert Brown', 
 '+91-9876543212', 'Father', 'None', 'B+', 7.8, 60, 
 false, NULL, 'pending', ARRAY['day_scholar']),

('STU2024004', 'Computer Science', 'B.Tech Computer Science', '8th Semester', 2021, 
 '2002-11-30', 'Female', '321 Elm St, City, State', 'Lisa Wilson', 
 '+91-9876543213', 'Mother', 'None', 'AB+', 8.9, 120, 
 true, 'A203', 'paid', ARRAY['hostel_resident', 'topper']),

('STU2024005', 'Computer Science', 'B.Tech Computer Science', '6th Semester', 2022, 
 '2003-03-18', 'Male', '654 Maple Dr, City, State', 'David Miller', 
 '+91-9876543214', 'Father', 'Diabetes', 'O-', 7.2, 90, 
 true, 'A105', 'overdue', ARRAY['hostel_resident']);

-- =====================================================
-- SUBJECTS DATA
-- =====================================================

INSERT INTO public.subjects (subject_code, subject_name, department, semester, credits) VALUES
('CS301', 'Data Structures and Algorithms', 'Computer Science', '6th Semester', 4),
('CS401', 'Database Management Systems', 'Computer Science', '8th Semester', 4),
('CS302', 'Operating Systems', 'Computer Science', '6th Semester', 3),
('CS402', 'Software Engineering', 'Computer Science', '8th Semester', 3),
('EC301', 'Digital Electronics', 'Electronics', '6th Semester', 4),
('EC401', 'VLSI Design', 'Electronics', '8th Semester', 4),
('ME301', 'Thermodynamics', 'Mechanical', '6th Semester', 3),
('ME401', 'Heat Transfer', 'Mechanical', '8th Semester', 3);

-- =====================================================
-- HOSTEL ROOMS DATA
-- =====================================================

INSERT INTO public.hostel_rooms (room_number, floor, block, capacity, current_occupancy, room_type, amenities, status) VALUES
('A101', 1, 'A', 2, 1, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('A102', 1, 'A', 2, 2, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('A103', 1, 'A', 2, 0, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'available'),
('A104', 1, 'A', 2, 1, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('A105', 1, 'A', 2, 1, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('A201', 2, 'A', 2, 2, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('A202', 2, 'A', 2, 0, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'available'),
('A203', 2, 'A', 2, 1, 'shared', ARRAY['WiFi', 'AC', 'Study Table', 'Wardrobe'], 'occupied'),
('B101', 1, 'B', 2, 2, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'occupied'),
('B102', 1, 'B', 2, 1, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'occupied'),
('B201', 2, 'B', 2, 0, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'maintenance'),
('B202', 2, 'B', 2, 1, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'occupied'),
('B203', 2, 'B', 2, 0, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'available'),
('B204', 2, 'B', 2, 2, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'occupied'),
('B205', 2, 'B', 2, 1, 'shared', ARRAY['WiFi', 'Fan', 'Study Table', 'Wardrobe'], 'occupied');

-- =====================================================
-- LIBRARY BOOKS DATA
-- =====================================================

INSERT INTO public.library_books (isbn, title, author, publisher, publication_year, category, total_copies, available_copies, location, status) VALUES
('978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen', 'MIT Press', 2009, 'Computer Science', 15, 8, 'CS-A1-001', 'available'),
('978-0321197849', 'An Introduction to Database Systems', 'C.J. Date', 'Addison-Wesley', 2003, 'Computer Science', 10, 0, 'CS-A1-002', 'out_of_stock'),
('978-1137031204', 'Engineering Mathematics', 'K.A. Stroud', 'Palgrave Macmillan', 2013, 'Mathematics', 20, 12, 'MATH-A1-001', 'available'),
('978-0132543262', 'Digital Design', 'M. Morris Mano', 'Pearson', 2012, 'Electronics', 8, 3, 'EC-A1-001', 'limited'),
('978-0073398129', 'Thermodynamics: An Engineering Approach', 'Yunus Cengel', 'McGraw-Hill', 2014, 'Mechanical', 12, 7, 'ME-A1-001', 'available'),
('978-0134685991', 'Computer Networking: A Top-Down Approach', 'James Kurose', 'Pearson', 2016, 'Computer Science', 6, 4, 'CS-A1-003', 'available'),
('978-0470128688', 'Operating System Concepts', 'Abraham Silberschatz', 'Wiley', 2012, 'Computer Science', 14, 9, 'CS-A1-004', 'available'),
('978-0133943030', 'Software Engineering: A Practitioner\'s Approach', 'Roger Pressman', 'McGraw-Hill', 2014, 'Computer Science', 8, 5, 'CS-A1-005', 'available');

-- =====================================================
-- SAMPLE ANNOUNCEMENTS
-- =====================================================

INSERT INTO public.announcements (title, content, author_role, priority, category, target_audience, department, tags, is_active) VALUES
('Mid-term Examination Schedule Released', 'The mid-term examination schedule for Spring 2024 has been released. Please check your student portal for detailed timetable and exam venues.', 'faculty', 'urgent', 'academic', 'all', NULL, NULL, true),

('Library Hours Extended During Exams', 'The library will remain open 24/7 during the examination period from March 15-30, 2024. Additional study spaces have been arranged in the conference halls.', 'librarian', 'info', 'library', 'all', NULL, NULL, true),

('Hostel Mess Menu Updated', 'New mess menu has been implemented based on student feedback. Special dietary options are now available. Please contact the mess committee for any concerns.', 'hostel_authority', 'normal', 'hostel', 'hostel_residents', NULL, ARRAY['hostel_resident'], true),

('CS Department Seminar Series', 'Weekly seminar series on "Emerging Technologies in Computer Science" starts from March 20, 2024. All CS students are encouraged to attend.', 'hod', 'normal', 'academic', 'department_specific', 'Computer Science', NULL, true),

('Placement Drive - Tech Corp', 'Tech Corp will be conducting campus placement drive on March 25, 2024. Eligible students (CGPA > 7.0) can register through the placement portal by March 20.', 'placement', 'urgent', 'placement', 'all', NULL, NULL, true),

('Fee Payment Deadline Extended', 'Due to technical issues with the payment gateway, the fee payment deadline has been extended to March 30, 2024. No late fees will be charged until then.', 'accountant', 'urgent', 'financial', 'all', NULL, NULL, true);

-- =====================================================
-- SAMPLE ATTENDANCE DATA
-- =====================================================

-- Generate sample attendance for the last 30 days
DO $$
DECLARE
    student_rec RECORD;
    subject_rec RECORD;
    date_val DATE;
    attendance_status TEXT;
BEGIN
    -- Loop through last 30 days
    FOR i IN 0..29 LOOP
        date_val := CURRENT_DATE - i;
        
        -- Skip weekends
        IF EXTRACT(DOW FROM date_val) NOT IN (0, 6) THEN
            -- Loop through students
            FOR student_rec IN SELECT id FROM public.students LOOP
                -- Loop through subjects
                FOR subject_rec IN SELECT id FROM public.subjects LOOP
                    -- Random attendance (90% present, 10% absent)
                    IF random() < 0.9 THEN
                        attendance_status := 'present';
                    ELSE
                        attendance_status := 'absent';
                    END IF;
                    
                    -- Insert attendance record
                    INSERT INTO public.attendance (student_id, subject_id, date, status)
                    VALUES (student_rec.id, subject_rec.id, date_val, attendance_status)
                    ON CONFLICT (student_id, subject_id, date) DO NOTHING;
                END LOOP;
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- =====================================================
-- SAMPLE WALLET TRANSACTIONS
-- =====================================================

INSERT INTO public.wallet_transactions (student_id, transaction_type, amount, description, category, status) 
SELECT 
    s.id,
    'credit',
    50000.00,
    'Semester fee payment',
    'fees',
    'completed'
FROM public.students s;

INSERT INTO public.wallet_transactions (student_id, transaction_type, amount, description, category, status)
SELECT 
    s.id,
    'debit',
    25000.00,
    'Hostel fee deduction',
    'hostel',
    'completed'
FROM public.students s WHERE is_hostel_resident = true;

-- =====================================================
-- SAMPLE FEE RECORDS
-- =====================================================

INSERT INTO public.fee_records (student_id, fee_type, amount, due_date, paid_date, status, payment_method)
SELECT 
    s.id,
    'tuition',
    50000.00,
    '2024-03-15',
    CASE WHEN s.fee_status = 'paid' THEN '2024-03-10' ELSE NULL END,
    s.fee_status,
    CASE WHEN s.fee_status = 'paid' THEN 'online' ELSE NULL END
FROM public.students s;

INSERT INTO public.fee_records (student_id, fee_type, amount, due_date, paid_date, status, payment_method)
SELECT 
    s.id,
    'hostel',
    25000.00,
    '2024-03-15',
    CASE WHEN s.fee_status = 'paid' THEN '2024-03-10' ELSE NULL END,
    s.fee_status,
    CASE WHEN s.fee_status = 'paid' THEN 'online' ELSE NULL END
FROM public.students s WHERE is_hostel_resident = true;

-- =====================================================
-- SAMPLE BOOK ISSUANCES
-- =====================================================

INSERT INTO public.book_issuances (book_id, student_id, issued_date, due_date, status)
SELECT 
    b.id,
    s.id,
    CURRENT_DATE - (random() * 20)::int,
    CURRENT_DATE + 14,
    CASE 
        WHEN random() < 0.8 THEN 'active'
        WHEN random() < 0.9 THEN 'returned'
        ELSE 'overdue'
    END
FROM public.library_books b
CROSS JOIN public.students s
WHERE random() < 0.3  -- 30% chance each student has each book
LIMIT 20;

-- =====================================================
-- SAMPLE PLACEMENT DRIVES
-- =====================================================

INSERT INTO public.placement_drives (company_name, job_title, job_description, eligibility_criteria, salary_package, drive_date, registration_deadline, venue, contact_person, contact_email, status) VALUES
('Tech Corp', 'Software Developer', 'Full-stack development role working on cutting-edge web applications using modern technologies.', 'CGPA >= 7.0, CS/IT background', '₹12 LPA', '2024-03-25', '2024-03-20', 'Auditorium A', 'John Smith', 'john.smith@techcorp.com', 'upcoming'),

('Innovation Labs', 'Product Manager', 'Lead product development initiatives and work closely with engineering teams to deliver innovative solutions.', 'CGPA >= 7.5, Any Engineering background', '₹15 LPA', '2024-04-02', '2024-03-28', 'Conference Hall B', 'Sarah Davis', 'sarah.davis@innovationlabs.com', 'upcoming'),

('DataTech Solutions', 'Data Analyst', 'Analyze large datasets and provide insights to drive business decisions using advanced analytics tools.', 'CGPA >= 7.0, CS/IT/Math background', '₹10 LPA', '2024-04-10', '2024-04-05', 'Seminar Hall C', 'Mike Johnson', 'mike.johnson@datatech.com', 'upcoming'),

('Global Systems', 'System Engineer', 'Design and maintain enterprise-level systems and infrastructure for global clients.', 'CGPA >= 6.5, Any Engineering background', '₹8 LPA', '2024-02-15', '2024-02-10', 'Auditorium A', 'Lisa Wilson', 'lisa.wilson@globalsystems.com', 'completed');

-- =====================================================
-- SAMPLE STUDENT PLACEMENTS
-- =====================================================

INSERT INTO public.student_placements (student_id, company_name, job_title, salary_package, placement_date, status)
SELECT 
    s.id,
    'Global Systems',
    'System Engineer',
    '₹8 LPA',
    '2024-02-15',
    'placed'
FROM public.students s 
WHERE s.student_id IN ('STU2024001', 'STU2024004')
LIMIT 2;

-- =====================================================
-- SAMPLE HOSTEL MAINTENANCE REQUESTS
-- =====================================================

INSERT INTO public.hostel_maintenance (room_id, student_id, issue_type, description, priority, status, assigned_to)
SELECT 
    hr.id,
    s.id,
    'Electrical',
    'AC not working properly, making noise',
    'high',
    'pending',
    'Maintenance Team A'
FROM public.hostel_rooms hr
JOIN public.students s ON s.room_number = hr.room_number
WHERE hr.room_number = 'A101'
LIMIT 1;

INSERT INTO public.hostel_maintenance (room_id, student_id, issue_type, description, priority, status, assigned_to, resolved_at)
SELECT 
    hr.id,
    s.id,
    'Plumbing',
    'Tap in bathroom is leaking',
    'normal',
    'completed',
    'Maintenance Team B',
    NOW() - INTERVAL '2 days'
FROM public.hostel_rooms hr
JOIN public.students s ON s.room_number = hr.room_number
WHERE hr.room_number = 'B205'
LIMIT 1;

-- =====================================================
-- UPDATE BOOK AVAILABILITY BASED ON ISSUANCES
-- =====================================================

UPDATE public.library_books 
SET available_copies = total_copies - (
    SELECT COUNT(*) 
    FROM public.book_issuances bi 
    WHERE bi.book_id = library_books.id 
    AND bi.status = 'active'
);

UPDATE public.library_books 
SET status = CASE 
    WHEN available_copies = 0 THEN 'out_of_stock'
    WHEN available_copies <= 2 THEN 'limited'
    ELSE 'available'
END;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'EDU-SYNC DATABASE SEEDED SUCCESSFULLY!';
    RAISE NOTICE '';
    RAISE NOTICE '=== TEST CREDENTIALS ===';
    RAISE NOTICE 'STUDENTS:';
    RAISE NOTICE '  student1@test.edu / Student123!';
    RAISE NOTICE '  student2@test.edu / Student456!';
    RAISE NOTICE '  student1@university.edu / TempPass123! (first-time login)';
    RAISE NOTICE '  student2@university.edu / StudentPass123!';
    RAISE NOTICE '';
    RAISE NOTICE 'AUTHORITIES:';
    RAISE NOTICE '  admin@test.edu / Admin123! (Administrator)';
    RAISE NOTICE '  faculty1@test.edu / test123 (Faculty)';
    RAISE NOTICE '  accountant@test.edu / Account123! (Accountant)';
    RAISE NOTICE '  hostel@test.edu / Hostel123! (Hostel Authority)';
    RAISE NOTICE '  librarian@test.edu / Library123! (Librarian)';
    RAISE NOTICE '  placement@test.edu / Placement123! (T&P Officer)';
    RAISE NOTICE '  hod@university.edu / HODPass123! (HOD)';
    RAISE NOTICE '';
    RAISE NOTICE 'Your Edu-Sync ERP system is ready for testing!';
END $$;
