"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Edit, Eye } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    course: "Computer Science Engineering",
    semester: "8th Semester",
    cgpa: 8.5,
    internshipStatus: "Completed",
    placementStatus: "Placed",
    company: "Tech Corp",
    email: "john.doe@student.edu",
    phone: "+91 9876543210",
  },
  {
    id: "STU2024002",
    name: "Sarah Johnson",
    course: "Electronics Engineering",
    semester: "8th Semester",
    cgpa: 9.1,
    internshipStatus: "In Progress",
    placementStatus: "Applied",
    company: null,
    email: "sarah.j@student.edu",
    phone: "+91 9876543211",
  },
  {
    id: "STU2024003",
    name: "Michael Brown",
    course: "Mechanical Engineering",
    semester: "8th Semester",
    cgpa: 7.8,
    internshipStatus: "Not Started",
    placementStatus: "Registered",
    company: null,
    email: "michael.b@student.edu",
    phone: "+91 9876543212",
  },
]

export default function PlacementStudents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [students] = useState(mockStudents)

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || student.placementStatus.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "default"
      case "Applied":
        return "secondary"
      case "Registered":
        return "outline"
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Not Started":
        return "destructive"
      default:
        return "outline"
    }
  }

  const updateInternshipStatus = (studentId: string, newStatus: string) => {
    // Handle internship status update
    console.log("Updating internship status:", studentId, newStatus)
  }

  return (
    <AccessControl allowedRoles={["placement"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="placement" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Student Database</h1>
                <p className="text-muted-foreground">Manage student profiles and placement status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {students.filter((s) => s.placementStatus === "Placed").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-secondary">
                    {students.filter((s) => s.internshipStatus === "Completed").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Internships Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">{students.length}</div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, ID, or course..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="registered">Registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Records</CardTitle>
                <CardDescription>{filteredStudents.length} students found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-balance">{student.name}</h3>
                            <Badge variant="outline">{student.id}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>
                                {student.course} • {student.semester}
                              </p>
                              <p>CGPA: {student.cgpa}</p>
                              <p>{student.email}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span>Placement:</span>
                                <Badge variant={getStatusColor(student.placementStatus) as any}>
                                  {student.placementStatus}
                                </Badge>
                                {student.company && <span className="text-xs">@ {student.company}</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Internship:</span>
                                <Badge variant={getStatusColor(student.internshipStatus) as any}>
                                  {student.internshipStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(value) => updateInternshipStatus(student.id, value)}>
                            <SelectTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Update Status
                              </Button>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
