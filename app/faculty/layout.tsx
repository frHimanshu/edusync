"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FacultySidebar } from "@/components/layout/faculty-sidebar"
import { FacultyHeader } from "@/components/layout/faculty-header"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/authority-login")
      return
    }

    if (user && user.role !== "faculty") {
      router.replace("/")
      return
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || user.role !== "faculty") {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <FacultySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FacultyHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
