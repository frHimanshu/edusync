"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AccessControlProps {
  allowedRoles: ("student" | "faculty" | "hostel" | "hostel_authority" | "administrator" | "accountant" | "admin" | "hod" | "librarian" | "tnp")[]
  children: React.ReactNode
  redirectTo?: string
}

const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  faculty: "/faculty-dashboard",
  hostel: "/hostel-dashboard",
  hostel_authority: "/hostel-dashboard",
  administrator: "/admin/dashboard",
  admin: "/admin/dashboard",
  accountant: "/accountant-dashboard",
  hod: "/hod-dashboard",
  librarian: "/librarian-dashboard",
  tnp: "/tnp-dashboard",
} as const

export function AccessControl({ allowedRoles, children, redirectTo }: AccessControlProps) {
  const router = useRouter()
  const { user, loading } = useAuth()

  const getRedirectPath = () => {
    if (redirectTo) return redirectTo
    if (user?.role && user.role in ROLE_DASHBOARDS) {
      return ROLE_DASHBOARDS[user.role as keyof typeof ROLE_DASHBOARDS]
    }
    return "/dashboard"
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    if (!loading && user && !allowedRoles.includes(user.role as any)) {
      // Auto-redirect after 3 seconds
      const timer = setTimeout(() => {
        router.push(getRedirectPath())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user, loading, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!allowedRoles.includes(user.role as any)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access this page. This area is restricted to{" "}
              {allowedRoles.length === 1
                ? `${allowedRoles[0]} users only`
                : `${allowedRoles.slice(0, -1).join(", ")} and ${allowedRoles.slice(-1)} users only`}
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Your current role: <span className="font-medium capitalize">{user.role.replace("_", " ")}</span>
            </div>
            <div className="text-sm text-muted-foreground text-center">Redirecting to dashboard in 3 seconds...</div>
            <Button onClick={() => router.push(getRedirectPath())} className="w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
