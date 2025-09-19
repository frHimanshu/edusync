"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AccessControl } from "@/components/auth/access-control"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Home, CreditCard } from "lucide-react"
import Link from "next/link"

interface StudentProfile {
  id: string
  student_id: string
  name: string
  photo?: string
  room_number?: string
  fee_status: "paid" | "unpaid" | "partial"
}

export default function HostelStudentProfile() {
  const params = useParams()
  const studentId = params.id as string
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch(`/api/hostel/student/${studentId}`)
        if (response.ok) {
          const data = await response.json()
          setStudent(data.data)
        } else {
          setError("Failed to load student profile")
        }
      } catch (err) {
        setError("Error loading student profile")
        console.error("Error fetching student profile:", err)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchStudentProfile()
    }
  }, [studentId])

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <AccessControl allowedRoles={["hostel"]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AccessControl>
    )
  }

  if (error || !student) {
    return (
      <AccessControl allowedRoles={["hostel"]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
            <p className="text-gray-600 mb-4">{error || "The requested student profile could not be found."}</p>
            <Button asChild>
              <Link href="/authority/hostel/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </AccessControl>
    )
  }

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4 bg-transparent">
              <Link href="/authority/hostel/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-gray-600">Hostel resident information (limited view)</p>
          </div>

          {/* Student Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                Student Information
              </CardTitle>
              <CardDescription>Basic information available to hostel authorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {/* Student Photo */}
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={student.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                    alt={student.name}
                  />
                  <AvatarFallback className="text-lg">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Student Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <p className="text-gray-600">Student ID: {student.student_id}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Number */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Home className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Room Number</p>
                        <p className="text-lg font-semibold text-blue-600">{student.room_number || "Not Assigned"}</p>
                      </div>
                    </div>

                    {/* Fee Status */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fee Status</p>
                        <Badge className={`mt-1 ${getFeeStatusColor(student.fee_status)}`}>
                          {student.fee_status.charAt(0).toUpperCase() + student.fee_status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">Privacy Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                As a hostel authority, you have access to limited student information necessary for hostel management.
                Academic records, personal contact details, and other sensitive information are not accessible through
                this interface to maintain student privacy and data security.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessControl>
  )
}
