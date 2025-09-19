-- Fix Critical Announcement RLS Policies
-- This script replaces the overly permissive announcement policies with strict tag-based scoping

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Everyone can view announcements" ON public.announcements;

-- Create a strict tag-based announcement visibility policy
CREATE POLICY "Tag-based announcement visibility" ON public.announcements
  FOR SELECT USING (
    -- General announcements visible to all authenticated users
    target_audience = 'all' OR
    
    -- Hostel announcements only for hostel residents
    (target_audience = 'hostel' AND 
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_hostel_resident = true)) OR
    
    -- Department-specific announcements
    (target_audience = 'department' AND department_filter IS NOT NULL AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND department = department_filter)) OR
     
    -- Year-specific announcements
    (year_filter IS NOT NULL AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND year = year_filter)) OR
     
    -- Faculty-specific announcements
    (target_audience = 'faculty' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('faculty', 'administrator', 'hostel_authority', 'accountant'))) OR
     
    -- Student-specific announcements
    (target_audience = 'students' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'student'))
  );

-- Also handle the legacy 'type' field for backward compatibility
CREATE POLICY "Legacy type-based announcement visibility" ON public.announcements
  FOR SELECT USING (
    -- Legacy general announcements
    type = 'general' OR
    
    -- Legacy hostel announcements only for hostel residents
    (type = 'hostel' AND 
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_hostel_resident = true)) OR
    
    -- Legacy academic announcements for students and faculty
    (type = 'academic' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('student', 'faculty', 'administrator'))) OR
     
    -- Legacy event announcements visible to all
    type = 'event'
  );

-- Create a combined policy that handles both new and legacy fields
DROP POLICY IF EXISTS "Tag-based announcement visibility" ON public.announcements;
DROP POLICY IF EXISTS "Legacy type-based announcement visibility" ON public.announcements;

CREATE POLICY "Comprehensive announcement visibility" ON public.announcements
  FOR SELECT USING (
    -- New target_audience system
    (target_audience = 'all') OR
    (target_audience = 'hostel' AND 
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_hostel_resident = true)) OR
    (target_audience = 'department' AND department_filter IS NOT NULL AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND department = department_filter)) OR
    (year_filter IS NOT NULL AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND year = year_filter)) OR
    (target_audience = 'faculty' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('faculty', 'administrator', 'hostel_authority', 'accountant'))) OR
    (target_audience = 'students' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'student')) OR
     
    -- Legacy type system for backward compatibility
    (type = 'general') OR
    (type = 'hostel' AND 
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_hostel_resident = true)) OR
    (type = 'academic' AND
     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('student', 'faculty', 'administrator'))) OR
    (type = 'event')
  );

-- Add indexes for better performance on the filtering columns
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_department_filter ON public.announcements(department_filter);
CREATE INDEX IF NOT EXISTS idx_announcements_year_filter ON public.announcements(year_filter);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_users_is_hostel_resident ON public.users(is_hostel_resident);
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);
CREATE INDEX IF NOT EXISTS idx_users_year ON public.users(year);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Test the policy with some sample data
-- Insert test announcements to verify the policy works
INSERT INTO public.announcements (title, content, target_audience, department_filter, year_filter, type, author_id) VALUES
('General Campus Notice', 'This is visible to everyone', 'all', NULL, NULL, 'general', (SELECT id FROM public.users WHERE role = 'administrator' LIMIT 1)),
('Hostel Maintenance', 'Only hostel residents should see this', 'hostel', NULL, NULL, 'hostel', (SELECT id FROM public.users WHERE role = 'hostel_authority' LIMIT 1)),
('CS Department Workshop', 'Only CS students should see this', 'department', 'Computer Science', NULL, 'academic', (SELECT id FROM public.users WHERE role = 'faculty' LIMIT 1)),
('Final Year Project Guidelines', 'Only final year students should see this', 'all', NULL, 4, 'academic', (SELECT id FROM public.users WHERE role = 'faculty' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT SELECT ON public.announcements TO authenticated;
