"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserCheck,
  Users,
  Building,
  Eye,
  EyeOff,
  Calculator,
  AlertCircle,
  Trophy,
  BookOpen,
  Briefcase,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function AuthorityLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { signIn, loading } = useAuth()
  const router = useRouter()

  const roleMapping = {
    teacher: "faculty",
    admin: "administrator",
    hostel: "hostel",
    accountant: "accountant",
    sports: "faculty",
    librarian: "librarian",
    placement: "tnp",
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      console.log("[v0] Authority login attempt for:", email, "as", userType)

      // Map UI role to database role
      const dbRole = roleMapping[userType as keyof typeof roleMapping]

      if (!dbRole) {
        setError("Invalid role selected")
        return
      }

      await signIn(email, password)

      console.log("[v0] Authority login successful, redirecting to dashboard")

      // Get the mapped role and redirect directly
      const mappedRole = roleMapping[userType as keyof typeof roleMapping]
      console.log("[v0] Mapped role:", mappedRole)
      
      // Redirect based on role
      const roleDashboards = {
        faculty: "/faculty-dashboard",
        administrator: "/admin/dashboard", 
        hostel: "/hostel-dashboard",
        accountant: "/accountant-dashboard",
        librarian: "/librarian-dashboard",
        tnp: "/tnp-dashboard",
        hod: "/hod-dashboard"
      }
      
      const dashboardPath = roleDashboards[mappedRole as keyof typeof roleDashboards]
      if (dashboardPath) {
        console.log("[v0] Redirecting to:", dashboardPath)
        router.push(dashboardPath)
      } else {
        // Fallback to general dashboard
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("[v0] Authority login error:", err)
      if (err.message.includes("Invalid credentials")) {
        setError("Invalid email or password. Try: faculty1@edusync.edu / Faculty123!")
      } else if (err.message.includes("Invalid role")) {
        setError("Your account role does not match the selected authority type. Please contact the administrator.")
      } else {
        setError(err.message || "Login failed. Please try again.")
      }
    }
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "teacher":
        return <UserCheck className="h-4 w-4" />
      case "admin":
        return <Users className="h-4 w-4" />
      case "hostel":
        return <Building className="h-4 w-4" />
      case "accountant":
        return <Calculator className="h-4 w-4" />
      case "sports":
        return <Trophy className="h-4 w-4" />
      case "librarian":
        return <BookOpen className="h-4 w-4" />
      case "placement":
        return <Briefcase className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Users className="h-8 w-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary">Edu-Sync Authority Portal</CardTitle>
          <CardDescription>Sign in to access your administrative dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="userType">Authority Type</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Faculty
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Administrator
                    </div>
                  </SelectItem>
                  <SelectItem value="hostel">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Hostel Authority
                    </div>
                  </SelectItem>
                  <SelectItem value="accountant">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Accountant
                    </div>
                  </SelectItem>
                  <SelectItem value="sports">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Sports Faculty
                    </div>
                  </SelectItem>
                  <SelectItem value="librarian">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Librarian
                    </div>
                  </SelectItem>
                  <SelectItem value="placement">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      T&P Officer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your institutional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-200">
              <strong>First-time login?</strong> Use your institutional email and the temporary password provided by the
              administrator.
            </div>

            <div className="text-right">
              <Link href="#" className="text-sm text-secondary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={!userType || loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  {getUserTypeIcon(userType)}
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Are you a student?{" "}
              <Link href="/student-login" className="text-primary hover:underline">
                Student Portal
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
