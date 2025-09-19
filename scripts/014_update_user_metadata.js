// Update existing users to have role metadata in Supabase auth
// This eliminates the need to query the users table during authentication

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

async function updateUserMetadata() {
  try {
    console.log("🔄 Updating user metadata to avoid RLS recursion...")

    // Get all users from auth
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error("❌ Error listing users:", listError.message)
      return
    }

    console.log(`📋 Found ${users.length} users to update`)

    // Update each user's metadata with their role
    for (const user of users) {
      let role = "student" // default role

      // Determine role based on email
      if (user.email?.includes("admin")) {
        role = "admin"
      } else if (user.email?.includes("hostel")) {
        role = "hostel_authority"
      } else if (user.email?.includes("accountant")) {
        role = "accountant"
      } else if (user.email?.includes("authority")) {
        role = "authority"
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          role: role,
          email: user.email,
          updated_at: new Date().toISOString(),
        },
      })

      if (updateError) {
        console.error(`❌ Error updating user ${user.email}:`, updateError.message)
      } else {
        console.log(`✅ Updated ${user.email} with role: ${role}`)
      }
    }

    console.log("🎉 User metadata update complete!")
    console.log("📝 Users can now login without RLS recursion issues")
  } catch (error) {
    console.error("❌ Script error:", error.message)
  }
}

updateUserMetadata()
