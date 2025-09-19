"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if we're in demo mode (no Supabase configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo')) {
      setIsDemoMode(true)
      return
    }

    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading && !isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user && !isDemoMode) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Edu-Sync</h1>
          <p className="text-xl text-muted-foreground">Integrated College ERP System</p>
          <p className="text-sm text-muted-foreground mt-2">Choose your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Student Portal</CardTitle>
              <CardDescription>Access your academic dashboard, attendance, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student-login">
                <Button className="w-full">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Student Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Authority Portal</CardTitle>
              <CardDescription>Faculty, admin, and hostel staff access</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/authority-login">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  <Users className="mr-2 h-4 w-4" />
                  Authority Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mt-8 text-center">
            <Card className="max-w-2xl mx-auto border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">🚀 Demo Mode Active</CardTitle>
                <CardDescription className="text-amber-700">
                  Supabase is not configured. View the demo to see all features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/demo">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Eye className="mr-2 h-4 w-4" />
                    View Demo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
