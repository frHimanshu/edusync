// Script to retrieve existing authority login credentials
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getAuthorityCredentials() {
  try {
    console.log("Fetching authority users...")

    // Get all authority users from auth_users table
    const { data: authUsers, error: authError } = await supabase
      .from("auth_users")
      .select("*")
      .in("role", ["faculty", "administrator", "hostel_authority", "accountant"])

    if (authError) {
      console.error("Error fetching auth users:", authError)
      return
    }

    console.log("\n=== AUTHORITY LOGIN CREDENTIALS ===\n")

    for (const user of authUsers) {
      console.log(`Role: ${user.role.toUpperCase()}`)
      console.log(`Email: ${user.email}`)
      console.log(`Password: test123`) // Default password for all test users
      console.log(`First Login: ${user.is_first_login ? "Yes" : "No"}`)
      console.log("---")
    }

    // Also get authority profiles for additional context
    const { data: authorities, error: authoritiesError } = await supabase.from("authorities").select("*")

    if (!authoritiesError && authorities.length > 0) {
      console.log("\n=== AUTHORITY PROFILES ===\n")
      for (const authority of authorities) {
        console.log(`Name: ${authority.full_name}`)
        console.log(`Employee ID: ${authority.employee_id}`)
        console.log(`Designation: ${authority.designation}`)
        console.log(`Department: ${authority.department}`)
        console.log("---")
      }
    }
  } catch (error) {
    console.error("Script error:", error)
  }
}

getAuthorityCredentials()
