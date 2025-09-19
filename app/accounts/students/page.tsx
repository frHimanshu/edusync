"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Eye, Edit, Download, UserPlus } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

const mockStudents = [
  {
    id: 1,
    studentId: "DTE24CS001",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Computer Science",
    year: 1,
    admissionYear: 2024,
    contactNumber: "+91 9876543210",
    isHostelResident: true,
    status: "active",
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    studentId: "DTE24EC002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Electronics",
    year: 2,
    admissionYear: 2023,
    contactNumber: "+91 9876543211",
    isHostelResident: false,
    status: "active",
    registrationDate: "2023-01-20",
  },
  {
    id: 3,
    studentId: "DTE24ME003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    department: "Mechanical",
    year: 3,
    admissionYear: 2022,
    contactNumber: "+91 9876543212",
    isHostelResident: true,
    status: "active",
    registrationDate: "2022-01-18",
  },
  {
    id: 4,
    studentId: "DTE24CS004",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    department: "Computer Science",
    year: 1,
    admissionYear: 2024,
    contactNumber: "+91 9876543213",
    isHostelResident: false,
    status: "inactive",
    registrationDate: "2024-01-22",
  },
]

export default function StudentsPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel" | "accountant">("accountant")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as
        | "student"
        | "teacher"
        | "admin"
        | "hostel"
        | "accountant"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || student.department.toLowerCase().includes(departmentFilter)
    const matchesYear = yearFilter === "all" || student.year.toString() === yearFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesDepartment && matchesYear && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "graduated":
        return <Badge className="bg-blue-100 text-blue-800">Graduated</Badge>
      case "dropped":
        return <Badge variant="destructive">Dropped</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter((s) => s.status === "active").length,
    hostelResidents: mockStudents.filter((s) => s.isHostelResident).length,
    newThisYear: mockStudents.filter((s) => s.admissionYear === 2024).length,
  }

  return (
    <AccessControl allowedRoles={["accountant", "administrator"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Student Records</h1>
            <p className="text-muted-foreground mt-1">Manage and view comprehensive student information</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Registered students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Currently enrolled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hostel Residents</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.hostelResidents}</div>
                <p className="text-xs text-muted-foreground">Living on campus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.newThisYear}</div>
                <p className="text-xs text-muted-foreground">This academic year</p>
              </CardContent>
            </Card>
          </div>

          {/* Student Records */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Database</CardTitle>
                  <CardDescription>Search and manage student records</CardDescription>
                </div>
                <Button onClick={() => (window.location.href = "/accounts/register-student")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, student ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="computer">Computer Science</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full md:w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Students Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>Year {student.year}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{student.email}</div>
                            <div className="text-sm text-muted-foreground">{student.contactNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.isHostelResident ? "default" : "secondary"}>
                            {student.isHostelResident ? "Resident" : "Day Scholar"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AccessControl>
  )
}
