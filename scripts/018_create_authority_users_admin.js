import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] Missing Supabase environment variables")
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const authorityUsers = [
  {
    email: "hostel1@test.edu",
    password: "test123",
    role: "hostel",
    name: "Hostel Manager",
    designation: "Hostel Warden",
  },
  {
    email: "admin1@test.edu",
    password: "test123",
    role: "administrator",
    name: "System Administrator",
    designation: "Admin",
  },
  {
    email: "faculty1@test.edu",
    password: "test123",
    role: "faculty",
    name: "Faculty Member",
    designation: "Professor",
  },
  {
    email: "accountant1@test.edu",
    password: "test123",
    role: "accountant",
    name: "Accounts Manager",
    designation: "Accountant",
  },
]

async function createAuthorityUsers() {
  console.log("[v0] Creating authority users...")

  for (const user of authorityUsers) {
    try {
      console.log(`[v0] Creating user: ${user.email}`)

      // Create user in Supabase Auth using Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          name: user.name,
          designation: user.designation,
        },
      })

      if (authError) {
        console.error(`[v0] Auth error for ${user.email}:`, authError.message)
        continue
      }

      console.log(`[v0] Auth user created: ${authData.user.id}`)

      // Insert into users table
      const { error: userError } = await supabase.from("users").upsert({
        id: authData.user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        created_at: new Date().toISOString(),
      })

      if (userError) {
        console.error(`[v0] User table error for ${user.email}:`, userError.message)
        continue
      }

      // Insert into authorities table
      const { error: authorityError } = await supabase.from("authorities").upsert({
        user_id: authData.user.id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        department: user.role === "faculty" ? "Computer Science" : "Administration",
        created_at: new Date().toISOString(),
      })

      if (authorityError) {
        console.error(`[v0] Authority table error for ${user.email}:`, authorityError.message)
        continue
      }

      console.log(`[v0] Successfully created authority user: ${user.email}`)
    } catch (error) {
      console.error(`[v0] Exception creating ${user.email}:`, error.message)
    }
  }

  console.log("[v0] Authority user creation completed!")
}

// Run the function
createAuthorityUsers().catch(console.error)
