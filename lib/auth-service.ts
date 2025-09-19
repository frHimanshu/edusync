import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { validateDemoCredentials, type DemoUser } from "@/lib/demo-auth"

export interface LoginCredentials {
  email: string
  password: string
  role?: string
}

export interface AuthUser {
  id: string
  email: string
  role: string
  profile: any
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser; success: boolean; error?: string }> {
    try {
      console.log("[v0] Attempting login for:", credentials.email)

      // Check if we're in demo mode
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo') || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
        // Use demo authentication
        console.log("[v0] Using demo authentication")
        const demoUser = validateDemoCredentials(credentials.email, credentials.password)
        
        if (!demoUser) {
          return { 
            user: null as any, 
            success: false, 
            error: "Invalid credentials. Try: student1@edusync.edu / Student123!" 
          }
        }

        // Validate role if provided
        if (credentials.role && demoUser.role !== credentials.role) {
          console.error("[v0] Role mismatch:", demoUser.role, "vs", credentials.role)
          return { user: null as any, success: false, error: "Invalid role for this login type" }
        }

        const authUser: AuthUser = {
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          profile: {
            id: demoUser.id,
            email: demoUser.email,
            role: demoUser.role,
            first_name: demoUser.profile.first_name,
            last_name: demoUser.profile.last_name,
            full_name: demoUser.profile.full_name,
            student_id: demoUser.profile.student_id,
            employee_id: demoUser.profile.employee_id,
            department: demoUser.profile.department,
            semester: demoUser.profile.semester,
            year_of_admission: demoUser.profile.year_of_admission,
            is_first_login: false,
            student_data: demoUser.role === 'student' ? {
              student_id: demoUser.profile.student_id,
              department: demoUser.profile.department,
              semester: demoUser.profile.semester,
              year_of_admission: demoUser.profile.year_of_admission
            } : null,
            authority_data: demoUser.role !== 'student' ? {
              employee_id: demoUser.profile.employee_id,
              department: demoUser.profile.department
            } : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }

        console.log("[v0] Demo login successful for user:", authUser.email, "with role:", authUser.role)
        return { user: authUser, success: true }
      }

      const supabase = createBrowserClient()

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        console.error("[v0] Login error:", error.message)
        return { user: null as any, success: false, error: this.formatAuthError(error.message) }
      }

      if (!data.user) {
        return { user: null as any, success: false, error: "No user data returned" }
      }

      console.log("[v0] Supabase auth successful for:", data.user.email)

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select(`
          *,
          students(*),
          authorities(*)
        `)
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("[v0] Profile fetch error:", profileError.message)
        await supabase.auth.signOut()
        return { user: null as any, success: false, error: "Failed to load user profile" }
      }

      const userRole = profile.role

      // Validate role if provided
      if (credentials.role && userRole !== credentials.role) {
        console.error("[v0] Role mismatch:", userRole, "vs", credentials.role)
        await supabase.auth.signOut()
        return { user: null as any, success: false, error: "Invalid role for this login type" }
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        role: userRole,
        profile: {
          id: data.user.id,
          email: data.user.email,
          role: userRole,
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email?.split("@")[0],
          is_first_login: profile.is_first_login,
          student_data: profile.students?.[0] || null,
          authority_data: profile.authorities?.[0] || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          ...profile,
        },
      }

      console.log("[v0] Login successful for user:", authUser.email, "with role:", authUser.role)
      return { user: authUser, success: true }
    } catch (error) {
      console.error("[v0] Login exception:", error)
      return {
        user: null as any,
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  static async logout(): Promise<void> {
    try {
      const supabase = createBrowserClient()

      // Sign out from Supabase (this handles all session cleanup)
      await supabase.auth.signOut()

      console.log("[v0] Logout successful")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const supabase = createBrowserClient()

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select(`
          *,
          students(*),
          authorities(*)
        `)
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("[v0] Profile fetch error:", profileError.message)
        return null
      }

      const userRole = profile.role

      return {
        id: user.id,
        email: user.email!,
        role: userRole,
        profile: {
          id: user.id,
          email: user.email,
          role: userRole,
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email?.split("@")[0],
          is_first_login: profile.is_first_login,
          student_data: profile.students?.[0] || null,
          authority_data: profile.authorities?.[0] || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          ...profile,
        },
      }
    } catch (error) {
      console.error("[v0] Get current user error:", error)
      return null
    }
  }

  private static formatAuthError(errorMessage: string): string {
    if (errorMessage.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials."
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Please check your email and click the confirmation link before signing in."
    }
    if (errorMessage.includes("Too many requests")) {
      return "Too many login attempts. Please wait a few minutes before trying again."
    }
    if (errorMessage.includes("User not found")) {
      return "No account found with this email address."
    }
    return errorMessage
  }

  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password reset failed",
      }
    }
  }

  static async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password update failed",
      }
    }
  }
}
