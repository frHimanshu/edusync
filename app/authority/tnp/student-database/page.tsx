"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Eye } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    department: "Computer Science",
    year: "4th Year",
    cgpa: 8.5,
    placementStatus: "Placed",
    company: "Tech Corp",
    email: "john.doe@student.edu",
  },
  {
    id: "STU2024002",
    name: "Sarah Johnson",
    department: "Electronics",
    year: "4th Year",
    cgpa: 9.1,
    placementStatus: "Applied",
    company: null,
    email: "sarah.j@student.edu",
  },
  {
    id: "STU2024003",
    name: "Michael Brown",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 7.8,
    placementStatus: "Eligible",
    company: null,
    email: "michael.b@student.edu",
  },
]

export default function TNPStudentDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterYear, setFilterYear] = useState("all")
  const [students] = useState(mockStudents)

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment
    const matchesYear = filterYear === "all" || student.year === filterYear

    return matchesSearch && matchesDepartment && matchesYear
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "default"
      case "Applied":
        return "secondary"
      case "Eligible":
        return "outline"
      default:
        return "outline"
    }
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
                <p className="text-muted-foreground">Search and filter students for placement opportunities</p>
              </div>
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
                      placeholder="Search by name or student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
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
                                {student.department} • {student.year}
                              </p>
                              <p>CGPA: {student.cgpa}</p>
                              <p>{student.email}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span>Status:</span>
                                <Badge variant={getStatusColor(student.placementStatus) as any}>
                                  {student.placementStatus}
                                </Badge>
                                {student.company && <span className="text-xs">@ {student.company}</span>}
                              </div>
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
