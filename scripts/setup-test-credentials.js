import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupTestCredentials() {
  console.log("Setting up test credentials...")

  try {
    // Create student test user
    console.log("Creating student test user...")
    const { data: studentUser, error: studentError } = await supabase.auth.admin.createUser({
      email: "student1@edu.com",
      password: "password1234",
      email_confirm: true,
    })

    if (studentError) {
      console.error("Error creating student user:", studentError)
    } else {
      console.log("Student user created:", studentUser.user.id)

      // Insert student profile
      const { error: studentProfileError } = await supabase.from("profiles").upsert({
        id: studentUser.user.id,
        email: "student1@edu.com",
        full_name: "Test Student",
        role: "student",
        student_id: "STU001",
        department: "Computer Science",
        year: 2,
        semester: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (studentProfileError) {
        console.error("Error creating student profile:", studentProfileError)
      } else {
        console.log("Student profile created successfully")
      }
    }

    // Create authority test user
    console.log("Creating authority test user...")
    const { data: authorityUser, error: authorityError } = await supabase.auth.admin.createUser({
      email: "authority@edu.com",
      password: "password1234",
      email_confirm: true,
    })

    if (authorityError) {
      console.error("Error creating authority user:", authorityError)
    } else {
      console.log("Authority user created:", authorityUser.user.id)

      // Insert authority profile
      const { error: authorityProfileError } = await supabase.from("profiles").upsert({
        id: authorityUser.user.id,
        email: "authority@edu.com",
        full_name: "Test Authority",
        role: "admin",
        employee_id: "EMP001",
        department: "Administration",
        position: "System Administrator",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (authorityProfileError) {
        console.error("Error creating authority profile:", authorityProfileError)
      } else {
        console.log("Authority profile created successfully")
      }
    }

    console.log("\n=== TEST CREDENTIALS READY ===")
    console.log("Student Login:")
    console.log("  Email: student1@edu.com")
    console.log("  Password: password1234")
    console.log("  Login URL: /student-login")
    console.log("")
    console.log("Authority Login:")
    console.log("  Email: authority@edu.com")
    console.log("  Password: password1234")
    console.log("  Login URL: /authority-login")
    console.log("  (Works for all authority roles)")
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

setupTestCredentials()
