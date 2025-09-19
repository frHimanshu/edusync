"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log("[v0] Logging out user...")
      await AuthService.logout()
      console.log("[v0] Logout successful, redirecting to home")
      router.push("/")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      // Force redirect even if logout fails
      router.push("/")
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}
