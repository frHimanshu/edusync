-- Insert sample departments
INSERT INTO public.departments (id, name, code, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CSE', 'Computer Science and Engineering'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Electronics', 'ECE', 'Electronics and Communication Engineering'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mechanical', 'ME', 'Mechanical Engineering'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Civil', 'CE', 'Civil Engineering'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Accounts', 'ACC', 'Accounts Department'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Library', 'LIB', 'Library Services'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Training & Placement', 'TNP', 'Training and Placement Cell'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Hostel Management', 'HOSTEL', 'Hostel Management Services');

-- Insert sample courses
INSERT INTO public.courses (id, course_code, course_name, department_id, credits, semester, description) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'CS101', 'Data Structures', '550e8400-e29b-41d4-a716-446655440001', 4, 3, 'Introduction to data structures and algorithms'),
  ('650e8400-e29b-41d4-a716-446655440002', 'CS102', 'Database Management', '550e8400-e29b-41d4-a716-446655440001', 4, 3, 'Database design and management systems'),
  ('650e8400-e29b-41d4-a716-446655440003', 'CS103', 'Computer Networks', '550e8400-e29b-41d4-a716-446655440001', 3, 4, 'Network protocols and communication'),
  ('650e8400-e29b-41d4-a716-446655440004', 'EC101', 'Digital Electronics', '550e8400-e29b-41d4-a716-446655440002', 4, 3, 'Digital circuit design and analysis'),
  ('650e8400-e29b-41d4-a716-446655440005', 'ME101', 'Thermodynamics', '550e8400-e29b-41d4-a716-446655440003', 4, 3, 'Thermodynamic principles and applications');

-- Insert sample books
INSERT INTO public.books (id, title, author, isbn, category, publisher, publication_year, total_copies, available_copies) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Data Structures and Algorithms', 'Thomas H. Cormen', '978-0262033848', 'Computer Science', 'MIT Press', 2009, 15, 8),
  ('750e8400-e29b-41d4-a716-446655440002', 'Introduction to Database Systems', 'C.J. Date', '978-0321197849', 'Computer Science', 'Addison-Wesley', 2003, 10, 0),
  ('750e8400-e29b-41d4-a716-446655440003', 'Engineering Mathematics', 'K.A. Stroud', '978-1137031204', 'Mathematics', 'Palgrave Macmillan', 2013, 20, 12),
  ('750e8400-e29b-41d4-a716-446655440004', 'Digital Design', 'M. Morris Mano', '978-0132774208', 'Electronics', 'Pearson', 2012, 12, 5),
  ('750e8400-e29b-41d4-a716-446655440005', 'Thermodynamics: An Engineering Approach', 'Yunus A. Cengel', '978-0073398174', 'Mechanical', 'McGraw-Hill', 2014, 8, 3);

-- Insert sample rooms
INSERT INTO public.rooms (id, room_number, block, floor, capacity, room_type, amenities, status) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'A-101', 'Block A', 1, 2, 'Double', ARRAY['AC', 'WiFi', 'Attached Bathroom'], 'occupied'),
  ('850e8400-e29b-41d4-a716-446655440002', 'A-102', 'Block A', 1, 2, 'Double', ARRAY['AC', 'WiFi', 'Attached Bathroom'], 'available'),
  ('850e8400-e29b-41d4-a716-446655440003', 'B-205', 'Block B', 2, 3, 'Triple', ARRAY['WiFi', 'Attached Bathroom'], 'occupied'),
  ('850e8400-e29b-41d4-a716-446655440004', 'C-301', 'Block C', 3, 2, 'Double', ARRAY['AC', 'WiFi', 'Attached Bathroom', 'Balcony'], 'available'),
  ('850e8400-e29b-41d4-a716-446655440005', 'A-103', 'Block A', 1, 2, 'Double', ARRAY['AC', 'WiFi', 'Attached Bathroom'], 'maintenance');

-- Insert sample companies
INSERT INTO public.companies (id, name, industry, website, contact_email, contact_phone, address, description) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'Tech Corp', 'Technology', 'https://techcorp.com', 'hr@techcorp.com', '+1-555-0123', '123 Tech Street, Silicon Valley', 'Leading technology company specializing in software development'),
  ('950e8400-e29b-41d4-a716-446655440002', 'Innovation Labs', 'Product Development', 'https://innovationlabs.com', 'careers@innovationlabs.com', '+1-555-0456', '456 Innovation Drive, Tech City', 'Innovative product development and management company'),
  ('950e8400-e29b-41d4-a716-446655440003', 'Global Solutions', 'Consulting', 'https://globalsolutions.com', 'jobs@globalsolutions.com', '+1-555-0789', '789 Global Avenue, Business District', 'Global consulting and solutions provider'),
  ('950e8400-e29b-41d4-a716-446655440004', 'Data Dynamics', 'Data Analytics', 'https://datadynamics.com', 'recruitment@datadynamics.com', '+1-555-0321', '321 Data Lane, Analytics Hub', 'Data analytics and business intelligence company');

-- Insert sample announcements
INSERT INTO public.announcements (id, title, content, priority, channel, target_audience, created_at) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'Welcome Freshers!', 'Orientation program scheduled for 1st August. All new students are required to attend.', 'high', 'general', ARRAY['student'], NOW() - INTERVAL '5 days'),
  ('a50e8400-e29b-41d4-a716-446655440002', 'Library Hours Update', 'Library will be open 24/7 during the exam period starting next week.', 'medium', 'library', ARRAY['student'], NOW() - INTERVAL '3 days'),
  ('a50e8400-e29b-41d4-a716-446655440003', 'Placement Drive - Tech Corp', 'Tech Corp is conducting a placement drive on 25th January. Register by 20th January.', 'high', 'placement', ARRAY['student'], NOW() - INTERVAL '1 day'),
  ('a50e8400-e29b-41d4-a716-446655440004', 'Hostel Maintenance', 'Scheduled maintenance for Block A rooms 101-110 on 30th January.', 'medium', 'hostel', ARRAY['student'], NOW() - INTERVAL '2 days'),
  ('a50e8400-e29b-41d4-a716-446655440005', 'Faculty Meeting', 'Monthly faculty meeting scheduled for 28th January at 2 PM in Conference Room A.', 'medium', 'faculty', ARRAY['faculty', 'hod'], NOW() - INTERVAL '1 day');

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_placement_drives_updated_at BEFORE UPDATE ON public.placement_drives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_placements_updated_at BEFORE UPDATE ON public.student_placements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create student wallet when student is created
CREATE OR REPLACE FUNCTION create_student_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.student_wallets (student_id, balance)
    VALUES (NEW.id, 0.00);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_wallet_on_student_insert
    AFTER INSERT ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION create_student_wallet();

-- Create function to update room occupancy when allocation changes
CREATE OR REPLACE FUNCTION update_room_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE public.rooms 
        SET current_occupancy = current_occupancy + 1,
            status = CASE 
                WHEN current_occupancy + 1 >= capacity THEN 'occupied'::room_status
                ELSE 'available'::room_status
            END
        WHERE id = NEW.room_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active' THEN
        UPDATE public.rooms 
        SET current_occupancy = current_occupancy - 1,
            status = CASE 
                WHEN current_occupancy - 1 <= 0 THEN 'available'::room_status
                ELSE 'occupied'::room_status
            END
        WHERE id = NEW.room_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'active' AND NEW.status = 'active' THEN
        UPDATE public.rooms 
        SET current_occupancy = current_occupancy + 1,
            status = CASE 
                WHEN current_occupancy + 1 >= capacity THEN 'occupied'::room_status
                ELSE 'available'::room_status
            END
        WHERE id = NEW.room_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_room_occupancy_trigger
    AFTER INSERT OR UPDATE ON public.room_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_room_occupancy();

-- Create function to update book availability when issuance changes
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.books 
        SET available_copies = available_copies - 1,
            status = CASE 
                WHEN available_copies - 1 <= 0 THEN 'issued'::book_status
                ELSE 'available'::book_status
            END
        WHERE id = NEW.book_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'issued' AND NEW.status = 'returned' THEN
        UPDATE public.books 
        SET available_copies = available_copies + 1,
            status = CASE 
                WHEN available_copies + 1 > 0 THEN 'available'::book_status
                ELSE 'issued'::book_status
            END
        WHERE id = NEW.book_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_book_availability_trigger
    AFTER INSERT OR UPDATE ON public.book_issuances
    FOR EACH ROW
    EXECUTE FUNCTION update_book_availability();
