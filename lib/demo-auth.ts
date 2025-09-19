// Demo Authentication System - No Database Required
export interface DemoUser {
  id: string
  email: string
  role: string
  profile: {
    full_name: string
    first_name: string
    last_name: string
    student_id?: string
    employee_id?: string
    department?: string
    semester?: number
    year_of_admission?: number
  }
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-student-1',
    email: 'student@demo.com',
    role: 'student',
    profile: {
      full_name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      student_id: 'STU2024001',
      department: 'Computer Science',
      semester: 3,
      year_of_admission: 2022
    }
  },
  {
    id: 'demo-faculty-1',
    email: 'faculty@demo.com',
    role: 'faculty',
    profile: {
      full_name: 'Dr. Sarah Johnson',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      employee_id: 'EMP001',
      department: 'Computer Science'
    }
  },
  {
    id: 'demo-hod-1',
    email: 'hod@demo.com',
    role: 'hod',
    profile: {
      full_name: 'Dr. Michael Brown',
      first_name: 'Dr. Michael',
      last_name: 'Brown',
      employee_id: 'EMP002',
      department: 'Computer Science'
    }
  },
  {
    id: 'demo-accountant-1',
    email: 'accountant@demo.com',
    role: 'accountant',
    profile: {
      full_name: 'Ms. Emily Davis',
      first_name: 'Ms. Emily',
      last_name: 'Davis',
      employee_id: 'EMP003',
      department: 'Accounts'
    }
  },
  {
    id: 'demo-librarian-1',
    email: 'librarian@demo.com',
    role: 'librarian',
    profile: {
      full_name: 'Mr. Robert Wilson',
      first_name: 'Mr. Robert',
      last_name: 'Wilson',
      employee_id: 'EMP004',
      department: 'Library'
    }
  },
  {
    id: 'demo-tnp-1',
    email: 'tnp@demo.com',
    role: 'tnp',
    profile: {
      full_name: 'Ms. Lisa Anderson',
      first_name: 'Ms. Lisa',
      last_name: 'Anderson',
      employee_id: 'EMP005',
      department: 'Training & Placement'
    }
  },
  {
    id: 'demo-hostel-1',
    email: 'hostel@demo.com',
    role: 'hostel',
    profile: {
      full_name: 'Mr. James Taylor',
      first_name: 'Mr. James',
      last_name: 'Taylor',
      employee_id: 'EMP006',
      department: 'Hostel Management'
    }
  }
]

export function validateDemoCredentials(email: string, password: string): DemoUser | null {
  // Simple demo validation - use 'password123' for all demo users
  const user = DEMO_USERS.find(u => u.email === email)
  if (user && password === 'password123') {
    return user
  }
  return null
}

export function getDemoUserById(id: string): DemoUser | null {
  return DEMO_USERS.find(u => u.id === id) || null
}

// Demo data for student dashboard
export const DEMO_STUDENT_DATA = {
  attendance: {
    totalClasses: 45,
    presentClasses: 38,
    absentClasses: 7,
    percentage: 84.4,
    subjects: [
      { name: 'Data Structures', present: 12, total: 15, percentage: 80 },
      { name: 'Database Management', present: 13, total: 15, percentage: 86.7 },
      { name: 'Computer Networks', present: 13, total: 15, percentage: 86.7 }
    ]
  },
  wallet: {
    balance: 1500.00,
    transactions: [
      { id: '1', type: 'credit', amount: 2000.00, description: 'Initial Top-up', date: '2024-01-15' },
      { id: '2', type: 'debit', amount: 500.00, description: 'Canteen Purchase', date: '2024-01-20' }
    ]
  },
  announcements: [
    {
      id: '1',
      title: 'Welcome Freshers!',
      content: 'Orientation program on 1st August.',
      priority: 'high',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Library Hours Update',
      content: 'Library will be open 24/7 during exam period.',
      priority: 'medium',
      created_at: '2024-01-14T15:30:00Z'
    }
  ],
  documents: [
    {
      id: '1',
      name: 'Academic Transcript',
      type: 'transcript',
      status: 'verified',
      uploaded_at: '2024-01-10T09:00:00Z'
    },
    {
      id: '2',
      name: 'ID Card Copy',
      type: 'id_card',
      status: 'pending',
      uploaded_at: '2024-01-12T14:20:00Z'
    }
  ]
}
