import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/auth"

// Server-side authentication functions
export const serverAuth = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (profileError) {
      console.error("[v0] Server profile fetch error:", profileError)
      // Return basic user info even if profile fetch fails
      return {
        id: user.id,
        email: user.email!,
        role: "student" as any, // Default role
        profile: undefined,
      }
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role,
      profile: {
        full_name:
          profile.first_name && profile.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : user.email?.split("@")[0],
        student_id: profile.student_id,
        department: profile.department,
        year: profile.year,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        is_first_login: profile.first_login,
      },
    }
  },
}
