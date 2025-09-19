import { createClient } from "@/lib/supabase/client"

export type UserRole = "student" | "faculty" | "hostel_authority" | "accountant" | "hod" | "admin" | "librarian" | "tnp" | "sports"

export interface User {
  id: string
  email: string
  role: UserRole
  profile?: {
    full_name?: string
    first_name?: string
    last_name?: string
    student_id?: string
    employee_id?: string
    department?: string
    semester?: number
    year_of_admission?: number
    is_first_login?: boolean
    created_at?: string
    updated_at?: string
  }
}

// Client-side authentication functions only
export const auth = {
  async signIn(email: string, password: string) {
    const supabase = createClient()
    console.log("[v0] Signing in user:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log("[v0] Sign in error:", error.message)
      throw new Error(error.message)
    }

    if (!data.session) {
      throw new Error("No session created after sign in")
    }

    console.log("[v0] Auth successful, user:", data.user?.email)
    console.log("[v0] Session established:", !!data.session)

    return {
      user: data.user,
      session: data.session,
    }
  },

  async signUp(email: string, password: string, role: UserRole, additionalData?: any) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/setup-password`,
        data: {
          role,
          ...additionalData,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.log("[v0] Session error:", sessionError.message)
      return null
    }

    if (!session?.user) {
      console.log("[v0] No authenticated user found")
      return null
    }

    const user = session.user
    console.log("[v0] Found authenticated user:", user.email)

    try {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select(`
          *,
          students(*),
          faculty(*)
        `)
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.log("[v0] Profile fetch error:", profileError.message)
        // Return basic user info if profile fetch fails
        return {
          id: user.id,
          email: user.email!,
          role: (user.user_metadata?.role as UserRole) || "student",
          profile: {
            full_name: user.email?.split("@")[0],
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        }
      }

      const fullName =
        profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : user.email?.split("@")[0]

      return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole,
        profile: {
          full_name: fullName,
          first_name: profile.first_name,
          last_name: profile.last_name,
          student_id: profile.students?.[0]?.student_id,
          employee_id: profile.faculty?.[0]?.employee_id,
          department: profile.students?.[0]?.department_id || profile.faculty?.[0]?.department_id,
          semester: profile.students?.[0]?.semester,
          year_of_admission: profile.students?.[0]?.year_of_admission,
          is_first_login: profile.is_first_login,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
      }
    } catch (err) {
      console.log("[v0] Unexpected error during getCurrentUser:", err)
      return {
        id: user.id,
        email: user.email!,
        role: "student",
        profile: {
          full_name: user.email?.split("@")[0],
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      }
    }
  },
}
