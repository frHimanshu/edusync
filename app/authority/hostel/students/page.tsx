"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Users, MapPin, Phone, Mail } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

interface Student {
  id: string
  name: string
  student_id: string
  email: string
  phone?: string
  room_number: string
  department: string
  year: number
  status: "active" | "inactive"
}

export default function HostelStudentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "inactive">("all")

  // Mock student data
  const students: Student[] = [
    {
      id: "1",
      name: "John Smith",
      student_id: "STU2024001",
      email: "john.smith@university.edu",
      phone: "+1234567890",
      room_number: "G-101",
      department: "Computer Science",
      year: 2,
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      student_id: "STU2024002",
      email: "sarah.johnson@university.edu",
      phone: "+1234567891",
      room_number: "1-102",
      department: "Electrical Engineering",
      year: 3,
      status: "active",
    },
    {
      id: "3",
      name: "Mike Wilson",
      student_id: "STU2024003",
      email: "mike.wilson@university.edu",
      room_number: "2-105",
      department: "Mechanical Engineering",
      year: 1,
      status: "inactive",
    },
    {
      id: "4",
      name: "Emma Davis",
      student_id: "STU2024004",
      email: "emma.davis@university.edu",
      phone: "+1234567893",
      room_number: "G-105",
      department: "Civil Engineering",
      year: 4,
      status: "active",
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.room_number.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = selectedFilter === "all" || student.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push("/authority/hostel/dashboard")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                  <p className="text-gray-600">Manage hostel residents and their information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, student ID, or room number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("all")}
                  >
                    All ({students.length})
                  </Button>
                  <Button
                    variant={selectedFilter === "active" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("active")}
                  >
                    Active ({students.filter((s) => s.status === "active").length})
                  </Button>
                  <Button
                    variant={selectedFilter === "inactive" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("inactive")}
                  >
                    Inactive ({students.filter((s) => s.status === "inactive").length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hostel Residents ({filteredStudents.length})
              </CardTitle>
              <CardDescription>Complete list of students residing in the hostel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.student_id}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              Room {student.room_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.department} - Year {student.year}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(student.status)}>{student.status}</Badge>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessControl>
  )
}
