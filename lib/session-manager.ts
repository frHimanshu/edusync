import { createClient as createServerClient } from "@/lib/supabase/server"

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
  updated_at: string
  user_agent?: string
  ip_address?: string
  is_active: boolean
}

export class SessionManager {
  private static SESSION_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

  static async createServerSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    const supabase = await createServerClient()
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

    const { error } = await supabase.from("user_sessions").insert({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      user_agent: userAgent,
      ip_address: ipAddress,
      is_active: true,
    })

    if (error) {
      console.error("[v0] Failed to create session:", error)
      throw new Error("Failed to create session")
    }

    console.log("[v0] Session created successfully:", sessionToken)
    return sessionToken
  }

  static async validateServerSession(sessionToken: string): Promise<{ user: any; session: UserSession } | null> {
    if (!sessionToken) {
      console.log("[v0] No session token provided")
      return null
    }

    const supabase = await createServerClient()

    // Get session from database
    const { data: session, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .single()

    if (error || !session) {
      console.log("[v0] Session not found or invalid:", error?.message)
      return null
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      console.log("[v0] Session expired")
      await this.invalidateServerSession(sessionToken)
      return null
    }

    // Get user data from Supabase auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user || user.id !== session.user_id) {
      console.log("[v0] User validation failed:", userError?.message)
      return null
    }

    console.log("[v0] Session validated successfully for user:", user.email)
    return { user, session }
  }

  static async invalidateServerSession(sessionToken: string): Promise<void> {
    const supabase = await createServerClient()

    await supabase.from("user_sessions").update({ is_active: false }).eq("session_token", sessionToken)

    console.log("[v0] Session invalidated")
  }

  static async cleanupExpiredSessions(): Promise<void> {
    const supabase = await createServerClient()

    const { error } = await supabase.rpc("cleanup_expired_sessions")

    if (error) {
      console.error("[v0] Failed to cleanup expired sessions:", error)
    } else {
      console.log("[v0] Expired sessions cleaned up")
    }
  }

  static async getUserSessions(userId: string): Promise<UserSession[]> {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Failed to get user sessions:", error)
      return []
    }

    return data || []
  }
}
