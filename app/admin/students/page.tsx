"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Edit, Trash2, Plus, Filter, Download, Mail, Phone } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    rollNo: "CS21001",
    email: "john.doe@college.edu",
    phone: "+91 9876543210",
    department: "Computer Science",
    semester: "6th",
    status: "Active",
    feeStatus: "Paid",
    hostelRoom: "A-205",
    gpa: 8.5,
    attendance: 85,
  },
  {
    id: "STU2024002",
    name: "Jane Smith",
    rollNo: "CS21002",
    email: "jane.smith@college.edu",
    phone: "+91 9876543211",
    department: "Computer Science",
    semester: "6th",
    status: "Active",
    feeStatus: "Pending",
    hostelRoom: "B-301",
    gpa: 9.2,
    attendance: 92,
  },
  {
    id: "STU2024003",
    name: "Mike Johnson",
    rollNo: "EC21001",
    email: "mike.johnson@college.edu",
    phone: "+91 9876543212",
    department: "Electronics",
    semester: "4th",
    status: "Active",
    feeStatus: "Paid",
    hostelRoom: "A-107",
    gpa: 7.8,
    attendance: 78,
  },
  {
    id: "STU2024004",
    name: "Sarah Wilson",
    rollNo: "ME21001",
    email: "sarah.wilson@college.edu",
    phone: "+91 9876543213",
    department: "Mechanical",
    semester: "2nd",
    status: "Active",
    feeStatus: "Paid",
    hostelRoom: "C-402",
    gpa: 8.9,
    attendance: 88,
  },
  {
    id: "STU2024005",
    name: "David Brown",
    rollNo: "CE21001",
    email: "david.brown@college.edu",
    phone: "+91 9876543214",
    department: "Civil",
    semester: "8th",
    status: "Inactive",
    feeStatus: "Pending",
    hostelRoom: "B-203",
    gpa: 7.2,
    attendance: 65,
  },
]

export default function StudentManagementPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel">("admin")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [filteredStudents, setFilteredStudents] = useState(mockStudents)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as "student" | "teacher" | "admin" | "hostel"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  useEffect(() => {
    let filtered = mockStudents

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((student) => student.department === selectedDepartment)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((student) => student.status === selectedStatus)
    }

    setFilteredStudents(filtered)
  }, [searchQuery, selectedDepartment, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "default"
      case "Pending":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 8.5) return "text-green-600"
    if (gpa >= 7.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 85) return "text-green-600"
    if (attendance >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
              <p className="text-muted-foreground mt-1">Manage student records and information</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Student List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle>Students ({filteredStudents.length})</CardTitle>
                <CardDescription>Manage student records and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-lg">{student.name}</h3>
                              <Badge variant={getStatusColor(student.status) as any}>{student.status}</Badge>
                              <Badge variant={getFeeStatusColor(student.feeStatus) as any}>
                                Fee: {student.feeStatus}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Roll No:</span>
                                <div className="font-medium">{student.rollNo}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Department:</span>
                                <div className="font-medium">{student.department}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Semester:</span>
                                <div className="font-medium">{student.semester}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Room:</span>
                                <div className="font-medium">{student.hostelRoom}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{student.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{student.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">GPA: </span>
                                <span className={`font-medium ${getGPAColor(student.gpa)}`}>{student.gpa}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Attendance: </span>
                                <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                                  {student.attendance}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mockStudents.length}</div>
                  <p className="text-xs text-muted-foreground">Across all departments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {mockStudents.filter((s) => s.status === "Active").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fee Pending</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {mockStudents.filter((s) => s.feeStatus === "Pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Require follow-up</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {(mockStudents.reduce((sum, s) => sum + s.gpa, 0) / mockStudents.length).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Overall performance</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
