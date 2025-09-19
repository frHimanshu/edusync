import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
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

console.log("[v0] Creating authority users...")

const authorityUsers = [
  {
    email: "hostel1@test.edu",
    password: "test123",
    role: "hostel_authority",
    name: "Hostel Manager",
    department: "Hostel Administration",
  },
  {
    email: "admin1@test.edu",
    password: "test123",
    role: "administrator",
    name: "System Administrator",
    department: "Administration",
  },
  {
    email: "faculty1@test.edu",
    password: "test123",
    role: "faculty",
    name: "Dr. Faculty Member",
    department: "Computer Science",
  },
  {
    email: "accountant1@test.edu",
    password: "test123",
    role: "accountant",
    name: "Finance Manager",
    department: "Accounts",
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
        department: user.department,
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log(`[v0] User ${user.email} already exists in auth`)
        continue
      }
      throw authError
    }

    console.log(`[v0] Created auth user: ${user.email} with ID: ${authData.user.id}`)

    // Insert into users table
    const { error: dbError } = await supabase.from("users").upsert({
      id: authData.user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error(`[v0] Database error for ${user.email}:`, dbError)
    } else {
      console.log(`[v0] Added ${user.email} to users table`)
    }

    // Insert into authorities table if not administrator
    if (user.role !== "administrator") {
      const { error: authError } = await supabase.from("authorities").upsert({
        id: authData.user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        designation:
          user.role === "faculty"
            ? "Professor"
            : user.role === "hostel_authority"
              ? "Hostel Warden"
              : user.role === "accountant"
                ? "Finance Officer"
                : "Staff",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (authError) {
        console.error(`[v0] Authorities table error for ${user.email}:`, authError)
      } else {
        console.log(`[v0] Added ${user.email} to authorities table`)
      }
    }
  } catch (error) {
    console.error(`[v0] Error creating user ${user.email}:`, error)
  }
}

console.log("[v0] Authority users creation completed!")

// List all created users
console.log("\n[v0] Available authority login credentials:")
authorityUsers.forEach((user) => {
  console.log(`Email: ${user.email} | Password: ${user.password} | Role: ${user.role}`)
})
