import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUsers() {
  try {
    console.log("[v0] Creating comprehensive test users...")

    // Test users with known passwords
    const testUsers = [
      // Students
      {
        id: "550e8400-e29b-41d4-a716-446655440101",
        email: "student1@test.edu",
        password: "Student123!",
        role: "student",
        first_name: "Alex",
        last_name: "Johnson",
        student_id: "STU2024001",
        department: "Computer Science",
        year: 2,
        is_hostel_resident: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440102",
        email: "student2@test.edu",
        password: "Student456!",
        role: "student",
        first_name: "Sarah",
        last_name: "Williams",
        student_id: "STU2024002",
        department: "Electronics",
        year: 3,
        is_hostel_resident: true,
      },
      // Authority Users - Updated role mappings to match database schema
      {
        id: "550e8400-e29b-41d4-a716-446655440201",
        email: "hostel@test.edu",
        password: "Hostel123!",
        role: "hostel_authority",
        first_name: "Michael",
        last_name: "Brown",
        department: "Hostel Management",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440202",
        email: "accountant@test.edu",
        password: "Account123!",
        role: "accountant",
        first_name: "Jennifer",
        last_name: "Smith",
        department: "Accounts Department",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440203",
        email: "admin@test.edu",
        password: "Admin123!",
        role: "administrator",
        first_name: "David",
        last_name: "Wilson",
        department: "Administration",
      },
    ]

    // Create users in Supabase Auth
    for (const user of testUsers) {
      console.log(`[v0] Creating user: ${user.email}`)

      // Create in Supabase Auth
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
        console.error(`[v0] Auth error for ${user.email}:`, authError.message)
        continue
      }

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (userError) {
        console.error(`[v0] User table error for ${user.email}:`, userError.message)
        continue
      }

      // For students, also create student record
      if (user.role === "student") {
        const { error: studentError } = await supabase.from("students").upsert({
          id: authUser.user.id,
          user_id: authUser.user.id,
          student_id: user.student_id,
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          course_department: user.department,
          admission_year: 2024,
          is_hostel_resident: user.is_hostel_resident || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (studentError) {
          console.error(`[v0] Student table error for ${user.email}:`, studentError.message)
        }
      }

      // For authorities, create authority record
      if (user.role !== "student") {
        const { error: authorityError } = await supabase.from("authorities").upsert({
          id: authUser.user.id,
          user_id: authUser.user.id,
          employee_id: `EMP${user.role.toUpperCase()}001`,
          full_name: `${user.first_name} ${user.last_name}`,
          designation: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          department: user.department,
          contact_number: "+1234567890",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (authorityError) {
          console.error(`[v0] Authority table error for ${user.email}:`, authorityError.message)
        }
      }

      console.log(`[v0] ✅ Successfully created: ${user.email}`)
    }

    console.log("\n=== TEST LOGIN CREDENTIALS ===\n")

    console.log("🎓 STUDENT LOGINS (Use /student-login):")
    console.log("1. Email: student1@test.edu | Password: Student123! | ID: STU2024001")
    console.log("2. Email: student2@test.edu | Password: Student456! | ID: STU2024002")

    console.log("\n👨‍💼 AUTHORITY LOGINS (Use /authority-login):")
    console.log("1. Email: hostel@test.edu | Password: Hostel123! | Role: Hostel")
    console.log("2. Email: accountant@test.edu | Password: Account123! | Role: Accountant")
    console.log("3. Email: admin@test.edu | Password: Admin123! | Role: Admin")

    console.log("\n=== TESTING INSTRUCTIONS ===")
    console.log("1. Students: Go to /student-login and use student credentials")
    console.log("2. Authority: Go to /authority-login and use authority credentials")
    console.log("3. Make sure to select the correct role in the dropdown for authority users")
    console.log("4. All passwords follow the pattern: [Role]123!")
  } catch (error) {
    console.error("[v0] Script error:", error)
  }
}

createTestUsers()
