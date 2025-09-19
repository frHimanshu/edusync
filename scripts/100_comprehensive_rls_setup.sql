-- Comprehensive RLS Setup for Edu-Sync ERP System
-- This script ensures all tables have proper RLS policies and security

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_admin_access" ON users;

DROP POLICY IF EXISTS "students_select_own" ON students;
DROP POLICY IF EXISTS "students_update_own" ON students;
DROP POLICY IF EXISTS "students_admin_access" ON students;
DROP POLICY IF EXISTS "students_faculty_access" ON students;

DROP POLICY IF EXISTS "authorities_select_own" ON authorities;
DROP POLICY IF EXISTS "authorities_update_own" ON authorities;
DROP POLICY IF EXISTS "authorities_admin_access" ON authorities;

DROP POLICY IF EXISTS "subjects_select_all" ON subjects;
DROP POLICY IF EXISTS "subjects_faculty_manage" ON subjects;
DROP POLICY IF EXISTS "subjects_admin_manage" ON subjects;

DROP POLICY IF EXISTS "timetable_select_all" ON timetable;
DROP POLICY IF EXISTS "timetable_faculty_manage" ON timetable;
DROP POLICY IF EXISTS "timetable_admin_manage" ON timetable;

DROP POLICY IF EXISTS "attendance_student_view" ON attendance;
DROP POLICY IF EXISTS "attendance_faculty_manage" ON attendance;
DROP POLICY IF EXISTS "attendance_admin_access" ON attendance;

DROP POLICY IF EXISTS "announcements_select_all" ON announcements;
DROP POLICY IF EXISTS "announcements_faculty_manage" ON announcements;
DROP POLICY IF EXISTS "announcements_admin_manage" ON announcements;

DROP POLICY IF EXISTS "announcement_signups_student_manage" ON announcement_signups;
DROP POLICY IF EXISTS "announcement_signups_faculty_view" ON announcement_signups;

DROP POLICY IF EXISTS "hostel_rooms_select_all" ON hostel_rooms;
DROP POLICY IF EXISTS "hostel_rooms_hostel_manage" ON hostel_rooms;
DROP POLICY IF EXISTS "hostel_rooms_admin_manage" ON hostel_rooms;

DROP POLICY IF EXISTS "student_documents_student_manage" ON student_documents;
DROP POLICY IF EXISTS "student_documents_admin_access" ON student_documents;

DROP POLICY IF EXISTS "student_onboarding_student_view" ON student_onboarding;
DROP POLICY IF EXISTS "student_onboarding_admin_manage" ON student_onboarding;

DROP POLICY IF EXISTS "wallet_transactions_student_view" ON wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_faculty_award" ON wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_admin_manage" ON wallet_transactions;

DROP POLICY IF EXISTS "user_sessions_own_access" ON user_sessions;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role FROM users WHERE id = user_uuid;
    RETURN COALESCE(user_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_admin_access" ON users
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

-- Students table policies
CREATE POLICY "students_select_own" ON students
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'faculty', 'hod', 'hostel_authority')
        )
    );

CREATE POLICY "students_update_own" ON students
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "students_admin_manage" ON students
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

-- Authorities table policies
CREATE POLICY "authorities_select_own" ON authorities
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

CREATE POLICY "authorities_update_own" ON authorities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "authorities_admin_manage" ON authorities
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

-- Subjects table policies
CREATE POLICY "subjects_select_all" ON subjects
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "subjects_faculty_manage" ON subjects
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin')
        )
    );

-- Timetable table policies
CREATE POLICY "timetable_select_all" ON timetable
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "timetable_faculty_manage" ON timetable
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin')
        )
    );

-- Attendance table policies
CREATE POLICY "attendance_student_view" ON attendance
    FOR SELECT USING (
        auth.uid() = student_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin')
        )
    );

CREATE POLICY "attendance_faculty_manage" ON attendance
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin')
        )
    );

-- Announcements table policies
CREATE POLICY "announcements_select_all" ON announcements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "announcements_faculty_manage" ON announcements
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin', 'hostel_authority')
        )
    );

CREATE POLICY "announcements_update_own" ON announcements
    FOR UPDATE USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

CREATE POLICY "announcements_delete_own" ON announcements
    FOR DELETE USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'hod')
        )
    );

-- Announcement signups table policies
CREATE POLICY "announcement_signups_student_manage" ON announcement_signups
    FOR ALL USING (
        auth.uid() = student_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin')
        )
    );

-- Hostel rooms table policies
CREATE POLICY "hostel_rooms_select_all" ON hostel_rooms
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "hostel_rooms_hostel_manage" ON hostel_rooms
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('hostel_authority', 'administrator', 'admin')
        )
    );

-- Student documents table policies
CREATE POLICY "student_documents_student_manage" ON student_documents
    FOR ALL USING (
        auth.uid() = student_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'faculty', 'hod')
        )
    );

-- Student onboarding table policies
CREATE POLICY "student_onboarding_student_view" ON student_onboarding
    FOR SELECT USING (
        auth.uid() = student_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin')
        )
    );

CREATE POLICY "student_onboarding_student_update" ON student_onboarding
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "student_onboarding_admin_manage" ON student_onboarding
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin')
        )
    );

-- Wallet transactions table policies
CREATE POLICY "wallet_transactions_student_view" ON wallet_transactions
    FOR SELECT USING (
        auth.uid() = student_id OR
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin', 'accountant')
        )
    );

CREATE POLICY "wallet_transactions_faculty_award" ON wallet_transactions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('faculty', 'hod', 'administrator', 'admin', 'accountant')
        )
    );

CREATE POLICY "wallet_transactions_admin_manage" ON wallet_transactions
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE role IN ('administrator', 'admin', 'accountant')
        )
    );

-- User sessions table policies
CREATE POLICY "user_sessions_own_access" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_authorities_user_id ON authorities(user_id);
CREATE INDEX IF NOT EXISTS idx_authorities_employee_id ON authorities(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_student_id ON wallet_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_timetable_faculty_id ON timetable(faculty_id);
CREATE INDEX IF NOT EXISTS idx_timetable_subject_id ON timetable(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_rooms_status ON hostel_rooms(status);

-- Add constraints for data integrity
ALTER TABLE students ADD CONSTRAINT chk_admission_year 
    CHECK (admission_year >= 2000 AND admission_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

ALTER TABLE wallet_transactions ADD CONSTRAINT chk_amount_positive 
    CHECK (amount > 0);

ALTER TABLE hostel_rooms ADD CONSTRAINT chk_capacity_positive 
    CHECK (capacity > 0);

ALTER TABLE hostel_rooms ADD CONSTRAINT chk_occupancy_valid 
    CHECK (current_occupancy >= 0 AND current_occupancy <= capacity);

ALTER TABLE attendance ADD CONSTRAINT chk_attendance_status 
    CHECK (status IN ('present', 'absent', 'late'));

ALTER TABLE announcements ADD CONSTRAINT chk_announcement_type 
    CHECK (announcement_type IN ('general', 'academic', 'hostel', 'sports', 'placement', 'library'));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create function to automatically create student/authority profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Insert into users table with basic info
    INSERT INTO public.users (id, email, role, first_name, last_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW();

    -- If student, create student profile
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
        INSERT INTO public.students (
            id, user_id, email, full_name, student_id, 
            admission_year, course_department, created_at, updated_at
        )
        VALUES (
            gen_random_uuid(),
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)) || ' ' || 
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'student_id', 'STU' || EXTRACT(YEAR FROM NOW()) || LPAD(floor(random() * 10000)::text, 4, '0')),
            COALESCE((NEW.raw_user_meta_data->>'admission_year')::integer, EXTRACT(YEAR FROM NOW())),
            COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;

        -- Create onboarding record
        INSERT INTO public.student_onboarding (
            id, student_id, registration_completed, password_setup_completed,
            profile_completed, documents_uploaded, orientation_attended,
            onboarding_completed, created_at, updated_at
        )
        VALUES (
            gen_random_uuid(),
            NEW.id,
            true, false, false, false, false, false,
            NOW(), NOW()
        )
        ON CONFLICT (student_id) DO NOTHING;
    END IF;

    -- If authority, create authority profile
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') IN ('faculty', 'administrator', 'admin', 'hostel_authority', 'accountant', 'hod') THEN
        INSERT INTO public.authorities (
            id, user_id, full_name, employee_id, department, designation,
            contact_number, created_at, updated_at
        )
        VALUES (
            gen_random_uuid(),
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)) || ' ' || 
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP' || EXTRACT(YEAR FROM NOW()) || LPAD(floor(random() * 1000)::text, 3, '0')),
            COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
            COALESCE(NEW.raw_user_meta_data->>'designation', 'Staff'),
            COALESCE(NEW.raw_user_meta_data->>'contact_number', ''),
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user metadata
CREATE OR REPLACE FUNCTION update_user_metadata()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_metadata();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_user_metadata();

DROP TRIGGER IF EXISTS update_authorities_updated_at ON authorities;
CREATE TRIGGER update_authorities_updated_at
    BEFORE UPDATE ON authorities
    FOR EACH ROW EXECUTE FUNCTION update_user_metadata();

-- Success message
SELECT 'Comprehensive RLS setup completed successfully!' as status;
