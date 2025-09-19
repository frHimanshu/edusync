"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Users, Eye } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    semester: "8th Semester",
    cgpa: 8.5,
    attendance: 92,
    status: "Active",
    email: "john.doe@student.edu",
  },
  {
    id: "STU2024002",
    name: "Sarah Johnson",
    semester: "6th Semester",
    cgpa: 9.1,
    attendance: 88,
    status: "Active",
    email: "sarah.j@student.edu",
  },
  {
    id: "STU2024003",
    name: "Michael Brown",
    semester: "4th Semester",
    cgpa: 7.8,
    attendance: 85,
    status: "Active",
    email: "michael.b@student.edu",
  },
]

export default function HODStudents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students] = useState(mockStudents)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AccessControl allowedRoles={["hod"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hod" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Department Students</h1>
                <p className="text-muted-foreground">View all students in Computer Science Department</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Students</CardTitle>
                <CardDescription>Find students by name or ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CS Department Students</CardTitle>
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
                            <Badge variant="secondary">{student.status}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>Computer Science • {student.semester}</p>
                              <p>CGPA: {student.cgpa}</p>
                              <p>{student.email}</p>
                            </div>
                            <div>
                              <p>Attendance: {student.attendance}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
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
