"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { auth, type User } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import { validateDemoCredentials, getDemoUserById, type DemoUser } from "@/lib/demo-auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, role: any, additionalData?: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're in demo mode
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (isDemoMode || !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
      console.log("[v0] Demo mode detected - skipping authentication")
      setUser(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    const getInitialSession = async () => {
      try {
        console.log("[v0] Getting initial session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[v0] Session error:", error)
          setUser(null)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log("[v0] Found existing session for:", session.user.email)
          const currentUser = await auth.getCurrentUser()
          console.log("[v0] Initial user:", currentUser?.email || "none")
          setUser(currentUser)
        } else {
          console.log("[v0] No existing session found")
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Initial session error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, session?.user?.email || "none")

      if (event === "SIGNED_IN" && session?.user) {
        setLoading(true)
        try {
          // Wait for session to be fully established
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const currentUser = await auth.getCurrentUser()
          console.log("[v0] Updated user after sign in:", currentUser?.email || "none")
          setUser(currentUser)
        } catch (error) {
          console.error("[v0] Auth state change error:", error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      } else if (event === "SIGNED_OUT") {
        console.log("[v0] User signed out")
        setUser(null)
        setLoading(false)
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        console.log("[v0] Token refreshed for:", session.user.email)
        try {
          const currentUser = await auth.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error("[v0] Token refresh error:", error)
        }
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log("[v0] Signing in user:", email)
      
      // Check if we're in demo mode
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (isDemoMode || !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
        // Use demo authentication
        const demoUser = validateDemoCredentials(email, password)
        if (demoUser) {
          // Convert demo user to User format
          const user: User = {
            id: demoUser.id,
            email: demoUser.email,
            role: demoUser.role as any,
            profile: demoUser.profile
          }
          setUser(user)
          console.log("[v0] Demo user signed in:", user.email)
        } else {
          throw new Error('Invalid credentials. Use demo credentials: student@demo.com / password123')
        }
      } else {
        // Use real Supabase authentication
        await auth.signIn(email, password)
        console.log("[v0] Sign in initiated, waiting for auth state change...")
      }
    } catch (error) {
      console.error("[v0] Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // Check if we're in demo mode
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (isDemoMode || !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
        // Demo mode - just clear user
        setUser(null)
        console.log("[v0] Demo user signed out")
      } else {
        // Real Supabase sign out
        await auth.signOut()
        setUser(null)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: any, additionalData?: any) => {
    setLoading(true)
    try {
      await auth.signUp(email, password, role, additionalData)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
