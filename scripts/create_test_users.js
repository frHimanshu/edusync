// =====================================================
// EDU-SYNC ERP SYSTEM - CREATE TEST USERS VIA SUPABASE AUTH
// =====================================================
// This script creates test users in Supabase Auth and populates their profiles
// Run this script after setting up the database schema

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test user data
const testUsers = [
  // Students
  {
    email: 'student1@edusync.edu',
    password: 'Student123!',
    role: 'student',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+91-9876543210',
    is_first_login: true,
    profile: {
      student_id: 'CSE24S001',
      department_id: '550e8400-e29b-41d4-a716-446655440001',
      semester: 1,
      year_of_admission: 2024,
      date_of_birth: '2005-03-15',
      address: '123 Main St, City',
      guardian_name: 'Robert Doe',
      guardian_phone: '+91-9876543210',
      blood_group: 'O+',
      hostel_room_id: '750e8400-e29b-41d4-a716-446655440001',
      ec_wallet_balance: 500.00,
      tags: ['scholarship'],
      fee_status: 'paid'
    }
  },
  {
    email: 'student2@edusync.edu',
    password: 'Student123!',
    role: 'student',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+91-9876543211',
    is_first_login: false,
    profile: {
      student_id: 'CSE24S002',
      department_id: '550e8400-e29b-41d4-a716-446655440001',
      semester: 1,
      year_of_admission: 2024,
      date_of_birth: '2005-07-22',
      address: '456 Oak Ave, City',
      guardian_name: 'Mary Smith',
      guardian_phone: '+91-9876543211',
      blood_group: 'A+',
      hostel_room_id: '750e8400-e29b-41d4-a716-446655440002',
      ec_wallet_balance: 750.00,
      tags: ['sports'],
      fee_status: 'paid'
    }
  },
  {
    email: 'student3@edusync.edu',
    password: 'Student123!',
    role: 'student',
    first_name: 'Mike',
    last_name: 'Johnson',
    phone: '+91-9876543212',
    is_first_login: false,
    profile: {
      student_id: 'ECE24S001',
      department_id: '550e8400-e29b-41d4-a716-446655440002',
      semester: 3,
      year_of_admission: 2023,
      date_of_birth: '2004-11-08',
      address: '789 Pine Rd, City',
      guardian_name: 'John Johnson',
      guardian_phone: '+91-9876543212',
      blood_group: 'B+',
      hostel_room_id: '750e8400-e29b-41d4-a716-446655440003',
      ec_wallet_balance: 300.00,
      tags: ['hostel_resident'],
      fee_status: 'pending'
    }
  },
  {
    email: 'student4@edusync.edu',
    password: 'Student123!',
    role: 'student',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone: '+91-9876543213',
    is_first_login: false,
    profile: {
      student_id: 'CSE23S001',
      department_id: '550e8400-e29b-41d4-a716-446655440001',
      semester: 3,
      year_of_admission: 2023,
      date_of_birth: '2004-05-12',
      address: '321 Elm St, City',
      guardian_name: 'Susan Wilson',
      guardian_phone: '+91-9876543213',
      blood_group: 'AB+',
      hostel_room_id: '750e8400-e29b-41d4-a716-446655440004',
      ec_wallet_balance: 1000.00,
      tags: ['scholarship', 'hostel_resident'],
      fee_status: 'paid'
    }
  },
  {
    email: 'student5@edusync.edu',
    password: 'Student123!',
    role: 'student',
    first_name: 'David',
    last_name: 'Brown',
    phone: '+91-9876543214',
    is_first_login: false,
    profile: {
      student_id: 'ECE23S002',
      department_id: '550e8400-e29b-41d4-a716-446655440002',
      semester: 3,
      year_of_admission: 2023,
      date_of_birth: '2004-09-30',
      address: '654 Maple Dr, City',
      guardian_name: 'Tom Brown',
      guardian_phone: '+91-9876543214',
      blood_group: 'O-',
      hostel_room_id: '750e8400-e29b-41d4-a716-446655440005',
      ec_wallet_balance: 250.00,
      tags: ['hostel_resident'],
      fee_status: 'overdue'
    }
  },
  // Faculty
  {
    email: 'faculty1@edusync.edu',
    password: 'Faculty123!',
    role: 'faculty',
    first_name: 'Dr. Robert',
    last_name: 'Taylor',
    phone: '+91-9876543220',
    is_first_login: false,
    profile: {
      employee_id: 'FAC001',
      department_id: '550e8400-e29b-41d4-a716-446655440001',
      designation: 'Professor',
      qualification: 'Ph.D. Computer Science',
      experience_years: 15,
      subjects_assigned: ['850e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002']
    }
  },
  {
    email: 'faculty2@edusync.edu',
    password: 'Faculty123!',
    role: 'faculty',
    first_name: 'Prof. Lisa',
    last_name: 'Anderson',
    phone: '+91-9876543221',
    is_first_login: false,
    profile: {
      employee_id: 'FAC002',
      department_id: '550e8400-e29b-41d4-a716-446655440001',
      designation: 'Associate Professor',
      qualification: 'M.Tech Computer Science',
      experience_years: 10,
      subjects_assigned: ['850e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440004']
    }
  },
  {
    email: 'faculty3@edusync.edu',
    password: 'Faculty123!',
    role: 'faculty',
    first_name: 'Dr. Michael',
    last_name: 'Davis',
    phone: '+91-9876543222',
    is_first_login: false,
    profile: {
      employee_id: 'FAC003',
      department_id: '550e8400-e29b-41d4-a716-446655440002',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. Electronics',
      experience_years: 8,
      subjects_assigned: ['850e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440007']
    }
  },
  // HOD
  {
    email: 'hod.cse@edusync.edu',
    password: 'Hod123!',
    role: 'hod',
    first_name: 'Dr. James',
    last_name: 'Miller',
    phone: '+91-9876543230',
    is_first_login: false,
    profile: {}
  },
  {
    email: 'hod.ece@edusync.edu',
    password: 'Hod123!',
    role: 'hod',
    first_name: 'Dr. Emily',
    last_name: 'Garcia',
    phone: '+91-9876543231',
    is_first_login: false,
    profile: {}
  },
  // Accountant
  {
    email: 'accountant@edusync.edu',
    password: 'Accountant123!',
    role: 'accountant',
    first_name: 'Ms. Patricia',
    last_name: 'Martinez',
    phone: '+91-9876543240',
    is_first_login: false,
    profile: {}
  },
  // Hostel Authority
  {
    email: 'hostel@edusync.edu',
    password: 'Hostel123!',
    role: 'hostel_authority',
    first_name: 'Mr. William',
    last_name: 'Rodriguez',
    phone: '+91-9876543250',
    is_first_login: false,
    profile: {}
  },
  // Librarian
  {
    email: 'librarian@edusync.edu',
    password: 'Librarian123!',
    role: 'librarian',
    first_name: 'Ms. Jennifer',
    last_name: 'Lee',
    phone: '+91-9876543260',
    is_first_login: false,
    profile: {}
  },
  // T&P Officer
  {
    email: 'tnp@edusync.edu',
    password: 'Tnp123!',
    role: 'tnp',
    first_name: 'Mr. Christopher',
    last_name: 'White',
    phone: '+91-9876543270',
    is_first_login: false,
    profile: {}
  },
  // Sports Authority
  {
    email: 'sports@edusync.edu',
    password: 'Sports123!',
    role: 'sports',
    first_name: 'Mr. Daniel',
    last_name: 'Harris',
    phone: '+91-9876543280',
    is_first_login: false,
    profile: {}
  },
  // Admin
  {
    email: 'admin@edusync.edu',
    password: 'Admin123!',
    role: 'admin',
    first_name: 'Dr. Admin',
    last_name: 'User',
    phone: '+91-9876543290',
    is_first_login: false,
    profile: {}
  }
];

async function createTestUsers() {
  console.log('🚀 Starting to create test users...');
  
  const createdUsers = [];
  
  for (const userData of testUsers) {
    try {
      console.log(`Creating user: ${userData.email}`);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          role: userData.role,
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      });
      
      if (authError) {
        console.error(`❌ Error creating auth user ${userData.email}:`, authError.message);
        continue;
      }
      
      const userId = authData.user.id;
      console.log(`✅ Created auth user: ${userData.email} (ID: ${userId})`);
      
      // Create user profile in public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          role: userData.role,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          is_first_login: userData.is_first_login
        });
      
      if (userError) {
        console.error(`❌ Error creating user profile ${userData.email}:`, userError.message);
        continue;
      }
      
      // Create role-specific profile
      if (userData.role === 'student' && userData.profile) {
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: userId,
            ...userData.profile
          });
        
        if (studentError) {
          console.error(`❌ Error creating student profile ${userData.email}:`, studentError.message);
        } else {
          console.log(`✅ Created student profile: ${userData.email}`);
        }
      } else if (userData.role === 'faculty' && userData.profile) {
        const { error: facultyError } = await supabase
          .from('faculty')
          .insert({
            id: userId,
            ...userData.profile
          });
        
        if (facultyError) {
          console.error(`❌ Error creating faculty profile ${userData.email}:`, facultyError.message);
        } else {
          console.log(`✅ Created faculty profile: ${userData.email}`);
        }
      }
      
      createdUsers.push({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        userId: userId
      });
      
    } catch (error) {
      console.error(`❌ Unexpected error creating user ${userData.email}:`, error.message);
    }
  }
  
  console.log('\n🎉 Test user creation completed!');
  console.log('\n📋 Created Users Summary:');
  console.log('========================');
  
  createdUsers.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Role: ${user.role}`);
    console.log(`User ID: ${user.userId}`);
    console.log('---');
  });
  
  console.log('\n🔐 Login Credentials:');
  console.log('====================');
  console.log('Students:');
  createdUsers.filter(u => u.role === 'student').forEach(user => {
    console.log(`  ${user.email} / ${user.password}`);
  });
  
  console.log('\nFaculty:');
  createdUsers.filter(u => u.role === 'faculty').forEach(user => {
    console.log(`  ${user.email} / ${user.password}`);
  });
  
  console.log('\nAuthorities:');
  createdUsers.filter(u => ['hod', 'accountant', 'hostel_authority', 'librarian', 'tnp', 'sports', 'admin'].includes(u.role)).forEach(user => {
    console.log(`  ${user.email} / ${user.password}`);
  });
  
  return createdUsers;
}

// Run the script
if (require.main === module) {
  createTestUsers()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestUsers, testUsers };
