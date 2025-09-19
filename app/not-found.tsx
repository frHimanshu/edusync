"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Construction, Home, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  faculty: "/faculty-dashboard",
  hostel: "/hostel-dashboard",
  hostel_authority: "/hostel-dashboard",
  administrator: "/admin/dashboard",
  accountant: "/accountant-dashboard",
  hod: "/hod-dashboard",
  librarian: "/librarian-dashboard",
  tnp: "/tnp-dashboard",
} as const

export default function NotFound() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [countdown, setCountdown] = useState(10)

  const getDashboardPath = () => {
    if (user?.role && user.role in ROLE_DASHBOARDS) {
      return ROLE_DASHBOARDS[user.role as keyof typeof ROLE_DASHBOARDS]
    }
    return "/dashboard"
  }

  useEffect(() => {
    if (!loading && user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push(getDashboardPath())
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [user, loading, router])

  const handleGoToDashboard = () => {
    if (user) {
      router.push(getDashboardPath())
    } else {
      router.push("/")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Construction className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Page Under Development</CardTitle>
          <CardDescription className="text-base">
            Oops! The page you're looking for is currently being built or doesn't exist yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              We're constantly improving the Edu-Sync ERP system. This page will be available soon!
            </p>
            {!loading && user && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Redirecting to your dashboard in <span className="font-bold">{countdown}</span> seconds...
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleGoToDashboard} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              {user ? "Go to Dashboard" : "Go to Home"}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleGoBack} className="flex-1 bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="outline" onClick={handleRefresh} className="flex-1 bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact the system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
