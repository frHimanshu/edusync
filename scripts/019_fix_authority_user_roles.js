import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log("[v0] Starting authority user role fix...")

// Role mapping from UI selection to database role
const roleMapping = {
  hostel: "hostel_authority",
  teacher: "faculty",
  admin: "administrator",
  accountant: "accountant",
  sports: "faculty",
  librarian: "faculty",
  placement: "faculty",
}

try {
  // Get all users from auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error("[v0] Error fetching auth users:", authError)
    throw authError
  }

  console.log(`[v0] Found ${authUsers.users.length} auth users`)

  // Update users with incorrect roles
  for (const user of authUsers.users) {
    const currentRole = user.user_metadata?.role

    if (currentRole && Object.keys(roleMapping).includes(currentRole)) {
      const correctRole = roleMapping[currentRole]

      if (currentRole !== correctRole) {
        console.log(`[v0] Updating user ${user.email}: ${currentRole} -> ${correctRole}`)

        // Update user metadata with correct role
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            role: correctRole,
          },
        })

        if (updateError) {
          console.error(`[v0] Error updating user ${user.email}:`, updateError)
        } else {
          console.log(`[v0] Successfully updated user ${user.email} role to ${correctRole}`)
        }
      } else {
        console.log(`[v0] User ${user.email} already has correct role: ${correctRole}`)
      }
    }
  }

  // Also update the users table to match
  console.log("[v0] Updating users table roles...")

  for (const [oldRole, newRole] of Object.entries(roleMapping)) {
    if (oldRole !== newRole) {
      const { error: updateError } = await supabase.from("users").update({ role: newRole }).eq("role", oldRole)

      if (updateError) {
        console.error(`[v0] Error updating users table for role ${oldRole}:`, updateError)
      } else {
        console.log(`[v0] Updated users table: ${oldRole} -> ${newRole}`)
      }
    }
  }

  // Also update the authorities table
  console.log("[v0] Updating authorities table roles...")

  for (const [oldRole, newRole] of Object.entries(roleMapping)) {
    if (oldRole !== newRole) {
      const { error: updateError } = await supabase.from("authorities").update({ role: newRole }).eq("role", oldRole)

      if (updateError) {
        console.error(`[v0] Error updating authorities table for role ${oldRole}:`, updateError)
      } else {
        console.log(`[v0] Updated authorities table: ${oldRole} -> ${newRole}`)
      }
    }
  }

  console.log("[v0] Authority user role fix completed successfully!")

  // Verify the changes
  console.log("[v0] Verifying updated roles...")
  const { data: updatedUsers, error: verifyError } = await supabase.auth.admin.listUsers()

  if (!verifyError) {
    updatedUsers.users.forEach((user) => {
      if (user.user_metadata?.role) {
        console.log(`[v0] User ${user.email}: role = ${user.user_metadata.role}`)
      }
    })
  }
} catch (error) {
  console.error("[v0] Script failed:", error)
  throw error
}
