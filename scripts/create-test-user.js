import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createTestUser() {
  console.log("[v0] Creating test user...")

  try {
    const testEmail = "test.student@edusync.edu"
    const testPassword = "TEST1234"

    // Create Supabase Auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    })

    if (error) {
      console.error("Auth user creation failed:", error)
      return
    }

    console.log("[v0] Auth user created:", data.user?.id)

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        role: "student",
        full_name: "Test Student",
        student_id: "DTE24CSE999",
        department: "Computer Science",
        year: 1,
        contact_number: "+1234567890",
        date_of_birth: "2000-01-01",
        course: "Bachelor of Technology",
        is_hostel_resident: false,
        emergency_contact_name: "Emergency Contact",
        emergency_contact_relation: "parent",
        emergency_contact_phone: "+1234567891",
        parent_guardian_name: "Parent Name",
        parent_guardian_phone: "+1234567892",
        first_login: true,
        temp_password: testPassword,
      })

      if (profileError) {
        console.error("Profile creation failed:", profileError)
        return
      }

      console.log("[v0] Test user created successfully!")
      console.log("Email:", testEmail)
      console.log("Password:", testPassword)
      console.log("Student ID: DTE24CSE999")
    }
  } catch (error) {
    console.error("Test user creation failed:", error)
  }
}

// Run the function
createTestUser()
