import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createWorkingTestUsers() {
  try {
    console.log("[v0] Creating working test users for login...")

    // Simple test users that will definitely work
    const testUsers = [
      {
        email: "student1@test.edu",
        password: "Student123!",
        role: "student",
        first_name: "Alex",
        last_name: "Johnson",
        student_id: "STU2024001",
        department: "Computer Science",
      },
      {
        email: "student2@test.edu",
        password: "Student456!",
        role: "student",
        first_name: "Sarah",
        last_name: "Williams",
        student_id: "STU2024002",
        department: "Electronics",
      },
      {
        email: "admin@test.edu",
        password: "Admin123!",
        role: "administrator",
        first_name: "David",
        last_name: "Wilson",
        department: "Administration",
      },
    ]

    for (const user of testUsers) {
      console.log(`[v0] Creating user: ${user.email}`)

      try {
        // First, try to delete existing user if any
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.email)
        if (deleteError && !deleteError.message.includes("User not found")) {
          console.log(`[v0] Note: Could not delete existing user ${user.email}:`, deleteError.message)
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
          console.error(`[v0] Auth error for ${user.email}:`, authError.message)
          continue
        }

        console.log(`[v0] ✅ Auth user created: ${user.email} (ID: ${authUser.user.id})`)

        // Create user in users table
        const { error: userError } = await supabase.from("users").upsert({
          id: authUser.user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          student_id: user.student_id || null,
          department: user.department,
          password_set: true,
          first_login: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (userError) {
          console.error(`[v0] User table error for ${user.email}:`, userError.message)
          continue
        }

        console.log(`[v0] ✅ Database record created for: ${user.email}`)

        // For students, create student record
        if (user.role === "student") {
          const { error: studentError } = await supabase.from("students").upsert({
            id: authUser.user.id,
            user_id: authUser.user.id,
            student_id: user.student_id,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            course_department: user.department,
            admission_year: 2024,
            is_hostel_resident: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (studentError) {
            console.error(`[v0] Student table error for ${user.email}:`, studentError.message)
          } else {
            console.log(`[v0] ✅ Student record created for: ${user.email}`)
          }
        }
      } catch (userError) {
        console.error(`[v0] Error creating ${user.email}:`, userError)
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log("🎉 TEST USERS CREATED SUCCESSFULLY!")
    console.log("=".repeat(50))

    console.log("\n📚 STUDENT LOGIN CREDENTIALS:")
    console.log("Go to: /student-login")
    console.log("1. Email: student1@test.edu")
    console.log("   Password: Student123!")
    console.log("   Student ID: STU2024001")
    console.log("")
    console.log("2. Email: student2@test.edu")
    console.log("   Password: Student456!")
    console.log("   Student ID: STU2024002")

    console.log("\n👨‍💼 ADMIN LOGIN CREDENTIALS:")
    console.log("Go to: /authority-login")
    console.log("1. Email: admin@test.edu")
    console.log("   Password: Admin123!")
    console.log("   Role: Administrator")

    console.log("\n🔧 TESTING INSTRUCTIONS:")
    console.log("1. Try logging in with student1@test.edu / Student123!")
    console.log("2. If you get 'Invalid login credentials', wait 30 seconds and try again")
    console.log("3. Make sure you're using the correct login page (/student-login for students)")
    console.log("4. Check browser console for detailed error messages")
  } catch (error) {
    console.error("[v0] Script error:", error)
  }
}

createWorkingTestUsers()
