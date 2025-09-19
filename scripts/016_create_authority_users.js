import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAuthorityUsers() {
  console.log("[v0] Creating authority users...")

  // Authority users to create
  const authorityUsers = [
    {
      email: "admin1@test.edu",
      password: "test123",
      role: "administrator",
      name: "System Administrator",
      designation: "Administrator",
    },
    {
      email: "faculty1@test.edu",
      password: "test123",
      role: "faculty",
      name: "Dr. John Smith",
      designation: "Professor",
    },
    {
      email: "hostel1@test.edu",
      password: "test123",
      role: "hostel",
      name: "Hostel Warden",
      designation: "Hostel Authority",
    },
    {
      email: "accountant1@test.edu",
      password: "test123",
      role: "accountant",
      name: "Finance Manager",
      designation: "Accountant",
    },
  ]

  for (const user of authorityUsers) {
    try {
      console.log(`[v0] Creating user: ${user.email}`)

      // Create user in Supabase Auth
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

      console.log(`[v0] Auth user created: ${user.email}`)

      // Insert into users table
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (dbError) {
        console.error(`[v0] Database error for ${user.email}:`, dbError.message)
        continue
      }

      // Insert into authorities table if not student
      if (user.role !== "student") {
        const { error: authError } = await supabase.from("authorities").insert({
          id: authData.user.id,
          name: user.name,
          email: user.email,
          designation: user.designation,
          department: user.role === "faculty" ? "Computer Science" : "Administration",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (authError) {
          console.error(`[v0] Authority table error for ${user.email}:`, authError.message)
        }
      }

      console.log(`[v0] Successfully created: ${user.email} with role: ${user.role}`)
    } catch (error) {
      console.error(`[v0] Exception creating ${user.email}:`, error.message)
    }
  }

  // List all users to verify
  console.log("\n[v0] Listing all authority users:")
  const { data: users, error } = await supabase.from("users").select("email, role, name").neq("role", "student")

  if (error) {
    console.error("[v0] Error fetching users:", error.message)
  } else {
    users.forEach((user) => {
      console.log(`[v0] User: ${user.email} | Role: ${user.role} | Name: ${user.name}`)
    })
  }
}

createAuthorityUsers().catch(console.error)
