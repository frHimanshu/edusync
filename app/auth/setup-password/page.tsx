"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, User } from "lucide-react"

export default function SetupPasswordPage() {
  const [userId, setUserId] = useState("")
  const [userType, setUserType] = useState("")
  const [tempPassword, setTempPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    // Get user info from URL params or localStorage
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const userIdParam = urlParams.get("userId") || localStorage.getItem("tempUserId")
      const userTypeParam = urlParams.get("userType") || localStorage.getItem("tempUserType")

      if (userIdParam) setUserId(userIdParam)
      if (userTypeParam) setUserType(userTypeParam)
    }
  }, [])

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    setPasswordRequirements(requirements)

    const score = Object.values(requirements).filter(Boolean).length
    setPasswordStrength((score / 5) * 100)
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setNewPassword(password)
    checkPasswordStrength(password)
  }

  const handleVerifyTempPassword = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock verification - in real app would verify against database
    console.log("[v0] Verifying temporary password for:", { userId, userType, tempPassword })

    // Simulate verification success
    if (tempPassword.length > 0) {
      setStep(2)
    } else {
      alert("Please enter your temporary password")
    }
  }

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password requirements
    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)
    if (!allRequirementsMet) {
      alert("Please ensure your password meets all requirements")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // Mock password setup - in real app would update database
    console.log("[v0] Setting up new password for:", { userId, userType })

    if (typeof window !== "undefined") {
      localStorage.setItem("userType", userType)
      localStorage.setItem("userId", userId)
      localStorage.setItem("passwordSetup", "completed")
      localStorage.removeItem("tempUserId")
      localStorage.removeItem("tempUserType")
    }

    alert("Password setup successful! Welcome to Edu-Sync ERP. Redirecting to your dashboard...")

    const dashboardUrl = userType === "student" ? "/student/dashboard" : "/dashboard"
    window.location.href = dashboardUrl
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 80) return "Medium"
    return "Strong"
  }

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case "student":
        return "Student"
      case "teacher":
        return "Faculty"
      case "admin":
        return "Administrator"
      case "hostel":
        return "Hostel Authority"
      case "accountant":
        return "Accountant"
      default:
        return "User"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {step === 1 ? "First-Time Login" : "Setup New Password"}
          </CardTitle>
          <CardDescription>
            {step === 1 ? "Verify your temporary credentials to continue" : "Create a secure password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Info Display */}
          {userId && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{userId}</div>
                  <Badge variant="outline" className="mt-1">
                    {getUserTypeDisplay(userType)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {step === 1 ? (
            // Step 1: Verify Temporary Password
            <form onSubmit={handleVerifyTempPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tempPassword">Temporary Password</Label>
                <div className="relative">
                  <Input
                    id="tempPassword"
                    type={showTempPassword ? "text" : "password"}
                    placeholder="Enter your temporary password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowTempPassword(!showTempPassword)}
                  >
                    {showTempPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your temporary password was provided during account creation. Contact your administrator if you don't
                  have it.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full">
                Verify & Continue
              </Button>
            </form>
          ) : (
            // Step 2: Setup New Password
            <form onSubmit={handleSetupPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password Strength</span>
                    <span
                      className={`font-medium ${passwordStrength >= 80 ? "text-green-600" : passwordStrength >= 40 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-2">
                    <div
                      className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </Progress>
                </div>
              )}

              {/* Password Requirements */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Password Requirements</Label>
                <div className="space-y-1 text-sm">
                  {Object.entries(passwordRequirements).map(([key, met]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 ${met ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <CheckCircle className={`h-3 w-3 ${met ? "text-green-600" : "text-muted-foreground"}`} />
                      <span>
                        {key === "length" && "At least 8 characters"}
                        {key === "uppercase" && "One uppercase letter"}
                        {key === "lowercase" && "One lowercase letter"}
                        {key === "number" && "One number"}
                        {key === "special" && "One special character"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`text-sm ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                  {newPassword === confirmPassword ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!Object.values(passwordRequirements).every(Boolean) || newPassword !== confirmPassword}
              >
                Setup Password & Continue
              </Button>
            </form>
          )}

          {/* Progress Indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-8 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
