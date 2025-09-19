import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getLoginCredentials() {
  try {
    console.log("[v0] Fetching test user credentials...")

    // Get all users from the users table
    const { data: users, error } = await supabase.from("users").select("*").order("role", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return
    }

    console.log("\n=== LOGIN CREDENTIALS ===\n")

    const studentUsers = users.filter((user) => user.role === "student")
    const authorityUsers = users.filter((user) => user.role !== "student")

    if (studentUsers.length > 0) {
      console.log("🎓 STUDENT LOGINS:")
      studentUsers.forEach((user) => {
        console.log(`Email: ${user.email}`)
        console.log(`Role: ${user.role}`)
        console.log(`Student ID: ${user.student_id || "N/A"}`)
        console.log(`Department: ${user.department || "N/A"}`)
        console.log("Password: Use the password you set during registration")
        console.log("---")
      })
    }

    if (authorityUsers.length > 0) {
      console.log("\n👨‍💼 AUTHORITY LOGINS:")
      authorityUsers.forEach((user) => {
        console.log(`Email: ${user.email}`)
        console.log(`Role: ${user.role}`)
        console.log(`Name: ${user.full_name || "N/A"}`)
        console.log(`Department: ${user.department || "N/A"}`)
        console.log("Password: Use the password you set during registration")
        console.log("---")
      })
    }

    if (users.length === 0) {
      console.log("❌ No test users found in database.")
      console.log("You may need to run the user creation scripts first.")
    }

    console.log("\n=== HOW TO TEST LOGIN ===")
    console.log("1. For Students: Go to /student-login")
    console.log("2. For Authority: Go to /authority-login")
    console.log("3. Use the email and password from above")
    console.log("4. For authority users, select the correct role from dropdown")
  } catch (error) {
    console.error("[v0] Script error:", error)
  }
}

getLoginCredentials()
