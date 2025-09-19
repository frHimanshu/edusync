import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkTestUsers() {
  try {
    console.log("Checking existing test users...")

    // Check auth_users table
    const { data: authUsers, error: authError } = await supabase.from("auth_users").select("*")

    if (authError) {
      console.error("Error fetching auth users:", authError)
      return
    }

    console.log("\n=== AUTH USERS ===")
    authUsers.forEach((user) => {
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`ID: ${user.id}`)
      console.log("---")
    })

    // Check users table
    const { data: users, error: usersError } = await supabase.from("users").select("*")

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return
    }

    console.log("\n=== USERS TABLE ===")
    users.forEach((user) => {
      console.log(`Name: ${user.first_name} ${user.last_name}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Student ID: ${user.student_id}`)
      console.log(`Employee ID: ${user.employee_id}`)
      console.log(`Temp Password: ${user.temp_password}`)
      console.log("---")
    })
  } catch (error) {
    console.error("Error:", error)
  }
}

checkTestUsers()
