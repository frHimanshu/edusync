import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables")
  console.error("Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createWorkingLoginCredentials() {
  try {
    console.log("🚀 Creating working test users for ERP system...")
    console.log("=".repeat(60))

    // Comprehensive test users with known passwords
    const testUsers = [
      // STUDENTS
      {
        email: "student1@test.edu",
        password: "Student123!",
        role: "student",
        first_name: "Alex",
        last_name: "Johnson",
        student_id: "STU2024001",
        department: "Computer Science",
        year: 2,
        semester: 3,
        is_hostel_resident: true,
      },
      {
        email: "student2@test.edu",
        password: "Student456!",
        role: "student",
        first_name: "Sarah",
        last_name: "Williams",
        student_id: "STU2024002",
        department: "Electronics",
        year: 3,
        semester: 5,
        is_hostel_resident: true,
      },
      {
        email: "student1@university.edu",
        password: "TempPass123!",
        role: "student",
        first_name: "Rahul",
        last_name: "Sharma",
        student_id: "STU2024003",
        department: "Computer Science",
        year: 1,
        semester: 1,
        is_first_login: true,
        is_hostel_resident: false,
      },
      {
        email: "student2@university.edu",
        password: "StudentPass123!",
        role: "student",
        first_name: "Priya",
        last_name: "Patel",
        student_id: "STU2024004",
        department: "Electronics",
        year: 2,
        semester: 3,
        is_hostel_resident: true,
      },

      // AUTHORITY USERS
      {
        email: "admin@test.edu",
        password: "Admin123!",
        role: "administrator",
        first_name: "David",
        last_name: "Wilson",
        department: "Administration",
        employee_id: "EMPADMIN001",
      },
      {
        email: "admin1@test.edu",
        password: "test123",
        role: "administrator",
        first_name: "Admin",
        last_name: "User",
        department: "Administration",
        employee_id: "EMPADMIN002",
      },
      {
        email: "hostel@test.edu",
        password: "Hostel123!",
        role: "hostel_authority",
        first_name: "Michael",
        last_name: "Brown",
        department: "Hostel Management",
        employee_id: "EMPHOSTEL001",
      },
      {
        email: "hostel1@test.edu",
        password: "test123",
        role: "hostel_authority",
        first_name: "Hostel",
        last_name: "Manager",
        department: "Hostel Management",
        employee_id: "EMPHOSTEL002",
      },
      {
        email: "hostel@university.edu",
        password: "HostelPass123!",
        role: "hostel_authority",
        first_name: "Meera",
        last_name: "Joshi",
        department: "Hostel Management",
        employee_id: "EMPHOSTEL003",
      },
      {
        email: "accountant@test.edu",
        password: "Account123!",
        role: "accountant",
        first_name: "Jennifer",
        last_name: "Smith",
        department: "Accounts Department",
        employee_id: "EMPACCOUNT001",
      },
      {
        email: "accountant1@test.edu",
        password: "test123",
        role: "accountant",
        first_name: "Accountant",
        last_name: "User",
        department: "Accounts Department",
        employee_id: "EMPACCOUNT002",
      },
      {
        email: "accountant@university.edu",
        password: "AccountPass123!",
        role: "accountant",
        first_name: "Rajesh",
        last_name: "Gupta",
        department: "Accounts Department",
        employee_id: "EMPACCOUNT003",
      },
      {
        email: "faculty1@test.edu",
        password: "test123",
        role: "faculty",
        first_name: "Faculty",
        last_name: "Member",
        department: "Computer Science",
        employee_id: "EMPFACULTY001",
      },
      {
        email: "faculty1@university.edu",
        password: "FacultyPass123!",
        role: "faculty",
        first_name: "Dr. Amit",
        last_name: "Kumar",
        department: "Computer Science",
        employee_id: "EMPFACULTY002",
      },
      {
        email: "faculty2@university.edu",
        password: "FacultyPass123!",
        role: "faculty",
        first_name: "Prof. Sunita",
        last_name: "Singh",
        department: "Electronics",
        employee_id: "EMPFACULTY003",
      },
      {
        email: "hod@university.edu",
        password: "HODPass123!",
        role: "hod",
        first_name: "Dr. Vikram",
        last_name: "Agarwal",
        department: "Computer Science",
        employee_id: "EMPHOD001",
      },
    ]

    let successCount = 0
    let errorCount = 0

    for (const user of testUsers) {
      try {
        console.log(`\n📝 Creating user: ${user.email}`)

        // Delete existing user if any (cleanup)
        try {
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers.users.find((u) => u.email === user.email)
          if (existingUser) {
            await supabase.auth.admin.deleteUser(existingUser.id)
            console.log(`   🗑️  Cleaned up existing user`)
          }
        } catch (cleanupError) {
          // Ignore cleanup errors
        }

        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        })

        if (authError) {
          console.error(`   ❌ Auth error: ${authError.message}`)
          errorCount++
          continue
        }

        console.log(`   ✅ Auth user created (ID: ${authUser.user.id})`)

        // Insert into users table
        const { error: userError } = await supabase.from("users").upsert({
          id: authUser.user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          student_id: user.student_id || null,
          department: user.department,
          year: user.year || null,
          semester: user.semester || null,
          is_first_login: user.is_first_login || false,
          password_set: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (userError) {
          console.error(`   ❌ User table error: ${userError.message}`)
          errorCount++
          continue
        }

        console.log(`   ✅ User profile created`)

        // Create role-specific records
        if (user.role === "student") {
          const { error: studentError } = await supabase.from("students").upsert({
            id: authUser.user.id,
            user_id: authUser.user.id,
            student_id: user.student_id,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            course_department: user.department,
            admission_year: 2024,
            current_semester: user.semester || 1,
            is_hostel_resident: user.is_hostel_resident || false,
            ec_wallet_balance: 500.0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (studentError) {
            console.error(`   ⚠️  Student record error: ${studentError.message}`)
          } else {
            console.log(`   ✅ Student record created`)
          }
        } else {
          // Create authority record
          const { error: authorityError } = await supabase.from("authorities").upsert({
            id: authUser.user.id,
            user_id: authUser.user.id,
            employee_id: user.employee_id || `EMP${user.role.toUpperCase()}${Date.now()}`,
            full_name: `${user.first_name} ${user.last_name}`,
            designation: user.role.charAt(0).toUpperCase() + user.role.slice(1).replace("_", " "),
            department: user.department,
            contact_number: "+1234567890",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (authorityError) {
            console.error(`   ⚠️  Authority record error: ${authorityError.message}`)
          } else {
            console.log(`   ✅ Authority record created`)
          }
        }

        successCount++
        console.log(`   🎉 Successfully created: ${user.email}`)
      } catch (userError) {
        console.error(`   💥 Unexpected error for ${user.email}:`, userError)
        errorCount++
      }
    }

    console.log("\n" + "=".repeat(60))
    console.log(`🎯 CREATION SUMMARY: ${successCount} successful, ${errorCount} errors`)
    console.log("=".repeat(60))

    // Display all login credentials
    console.log("\n🔐 COMPLETE LOGIN CREDENTIALS FOR ERP SYSTEM")
    console.log("=".repeat(60))

    console.log("\n🎓 STUDENT LOGIN CREDENTIALS")
    console.log("Login URL: /student-login")
    console.log("-".repeat(40))
    console.log("1. Email: student1@test.edu")
    console.log("   Password: Student123!")
    console.log("   Student ID: STU2024001")
    console.log("   Department: Computer Science")
    console.log("")
    console.log("2. Email: student2@test.edu")
    console.log("   Password: Student456!")
    console.log("   Student ID: STU2024002")
    console.log("   Department: Electronics")
    console.log("")
    console.log("3. Email: student1@university.edu")
    console.log("   Password: TempPass123!")
    console.log("   Student ID: STU2024003")
    console.log("   Note: First-time login (requires password change)")
    console.log("")
    console.log("4. Email: student2@university.edu")
    console.log("   Password: StudentPass123!")
    console.log("   Student ID: STU2024004")

    console.log("\n👨‍💼 AUTHORITY LOGIN CREDENTIALS")
    console.log("Login URL: /authority-login")
    console.log("-".repeat(40))

    console.log("\n🔧 ADMIN ACCOUNTS:")
    console.log("1. Email: admin@test.edu")
    console.log("   Password: Admin123!")
    console.log("   Role: Administrator")
    console.log("")
    console.log("2. Email: admin1@test.edu")
    console.log("   Password: test123")
    console.log("   Role: Administrator")

    console.log("\n🏠 HOSTEL AUTHORITY ACCOUNTS:")
    console.log("1. Email: hostel@test.edu")
    console.log("   Password: Hostel123!")
    console.log("   Role: Hostel Authority")
    console.log("")
    console.log("2. Email: hostel1@test.edu")
    console.log("   Password: test123")
    console.log("   Role: Hostel Authority")
    console.log("")
    console.log("3. Email: hostel@university.edu")
    console.log("   Password: HostelPass123!")
    console.log("   Role: Hostel Authority")

    console.log("\n💰 ACCOUNTANT ACCOUNTS:")
    console.log("1. Email: accountant@test.edu")
    console.log("   Password: Account123!")
    console.log("   Role: Accountant")
    console.log("")
    console.log("2. Email: accountant1@test.edu")
    console.log("   Password: test123")
    console.log("   Role: Accountant")
    console.log("")
    console.log("3. Email: accountant@university.edu")
    console.log("   Password: AccountPass123!")
    console.log("   Role: Accountant")

    console.log("\n👩‍🏫 FACULTY ACCOUNTS:")
    console.log("1. Email: faculty1@test.edu")
    console.log("   Password: test123")
    console.log("   Role: Faculty")
    console.log("")
    console.log("2. Email: faculty1@university.edu")
    console.log("   Password: FacultyPass123!")
    console.log("   Role: Faculty")
    console.log("")
    console.log("3. Email: faculty2@university.edu")
    console.log("   Password: FacultyPass123!")
    console.log("   Role: Faculty")

    console.log("\n🎯 HOD ACCOUNT:")
    console.log("1. Email: hod@university.edu")
    console.log("   Password: HODPass123!")
    console.log("   Role: HOD")

    console.log("\n📋 TESTING INSTRUCTIONS")
    console.log("=".repeat(60))
    console.log("1. 🎓 For Students:")
    console.log("   - Navigate to /student-login")
    console.log("   - Use any student email and password from above")
    console.log("   - Student dashboard will load automatically")
    console.log("")
    console.log("2. 👨‍💼 For Authority Users:")
    console.log("   - Navigate to /authority-login")
    console.log("   - Use any authority email and password from above")
    console.log("   - IMPORTANT: Select the correct role from dropdown")
    console.log("   - Authority dashboard will load based on role")
    console.log("")
    console.log("3. 🔄 If Login Fails:")
    console.log("   - Wait 30 seconds and try again")
    console.log("   - Check browser console for detailed errors")
    console.log("   - Ensure you're using the correct login page")
    console.log("   - For authority users, verify role selection")
    console.log("")
    console.log("4. 🎯 Quick Test Accounts:")
    console.log("   - Student: student1@test.edu / Student123!")
    console.log("   - Admin: admin@test.edu / Admin123!")
    console.log("   - Hostel: hostel@test.edu / Hostel123!")
    console.log("   - Accountant: accountant@test.edu / Account123!")

    console.log("\n🚀 ERP SYSTEM IS READY FOR TESTING!")
    console.log("=".repeat(60))
  } catch (error) {
    console.error("💥 Script execution error:", error)
  }
}

createWorkingLoginCredentials()
