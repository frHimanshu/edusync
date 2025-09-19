"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Eye, BookOpen, Clock, AlertTriangle, User, Calendar, Hash, Mail, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  semester: number
  department_name: string
  enrollment_date: string
  status: string
  total_books_issued: number
  current_books: number
  overdue_books: number
  total_fines: number
  last_activity: string
}

interface BookIssuance {
  id: string
  book_title: string
  book_isbn: string
  issued_date: string
  due_date: string
  return_date?: string
  status: string
  fine_amount?: number
}

const DEPARTMENT_FILTERS = [
  "All Departments",
  "Computer Science Engineering",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering"
]

const STATUS_FILTERS = [
  "All Status",
  "Active",
  "Inactive",
  "Graduated",
  "Suspended"
]

export default function StudentSearch() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentIssuances, setStudentIssuances] = useState<BookIssuance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [viewStudentOpen, setViewStudentOpen] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockStudents: Student[] = [
          {
            id: "student1",
            student_id: "STU2024001",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@college.edu",
            phone: "+91 98765 43210",
            semester: 3,
            department_name: "Computer Science Engineering",
            enrollment_date: "2022-08-15",
            status: "Active",
            total_books_issued: 15,
            current_books: 2,
            overdue_books: 0,
            total_fines: 0,
            last_activity: "2024-02-15T10:30:00Z"
          },
          {
            id: "student2",
            student_id: "STU2024002",
            first_name: "Sarah",
            last_name: "Johnson",
            email: "sarah.johnson@college.edu",
            phone: "+91 98765 43211",
            semester: 5,
            department_name: "Electronics Engineering",
            enrollment_date: "2021-08-15",
            status: "Active",
            total_books_issued: 22,
            current_books: 1,
            overdue_books: 1,
            total_fines: 25,
            last_activity: "2024-02-14T14:20:00Z"
          },
          {
            id: "student3",
            student_id: "STU2024003",
            first_name: "Michael",
            last_name: "Brown",
            email: "michael.brown@college.edu",
            phone: "+91 98765 43212",
            semester: 7,
            department_name: "Mechanical Engineering",
            enrollment_date: "2020-08-15",
            status: "Active",
            total_books_issued: 18,
            current_books: 3,
            overdue_books: 2,
            total_fines: 50,
            last_activity: "2024-02-13T09:15:00Z"
          },
          {
            id: "student4",
            student_id: "STU2024004",
            first_name: "Emily",
            last_name: "Davis",
            email: "emily.davis@college.edu",
            phone: "+91 98765 43213",
            semester: 1,
            department_name: "Computer Science Engineering",
            enrollment_date: "2023-08-15",
            status: "Active",
            total_books_issued: 5,
            current_books: 1,
            overdue_books: 0,
            total_fines: 0,
            last_activity: "2024-02-12T16:45:00Z"
          }
        ]

        setStudents(mockStudents)
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("Failed to load students")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStudents()
    }
  }, [user])

  const fetchStudentIssuances = async (studentId: string) => {
    try {
      // Mock data for demo
      const mockIssuances: BookIssuance[] = [
        {
          id: "issue1",
          book_title: "Data Structures and Algorithms",
          book_isbn: "978-0262033848",
          issued_date: "2024-01-15",
          due_date: "2024-01-29",
          status: "Issued"
        },
        {
          id: "issue2",
          book_title: "Introduction to Database Systems",
          book_isbn: "978-0321197849",
          issued_date: "2024-01-10",
          due_date: "2024-01-24",
          return_date: "2024-01-22",
          status: "Returned"
        },
        {
          id: "issue3",
          book_title: "Engineering Mathematics",
          book_isbn: "978-1137031204",
          issued_date: "2024-01-05",
          due_date: "2024-01-19",
          status: "Overdue",
          fine_amount: 25
        }
      ]

      setStudentIssuances(mockIssuances)
    } catch (error) {
      console.error("Error fetching student issuances:", error)
      toast.error("Failed to load student issuances")
    }
  }

  const openStudentView = (student: Student) => {
    setSelectedStudent(student)
    fetchStudentIssuances(student.id)
    setViewStudentOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIssuanceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "issued":
        return "bg-blue-100 text-blue-800"
      case "returned":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !selectedDepartment || 
      selectedDepartment === "All Departments" ||
      student.department_name === selectedDepartment
    
    const matchesStatus = !selectedStatus || 
      selectedStatus === "All Status" ||
      student.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const totalStudents = students.length
  const activeStudents = students.filter(student => student.status === "Active").length
  const studentsWithOverdue = students.filter(student => student.overdue_books > 0).length
  const totalFines = students.reduce((sum, student) => sum + student.total_fines, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Search</h1>
          <p className="text-gray-600">Search and manage student library records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{studentsWithOverdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalFines)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="departmentFilter">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_FILTERS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Students ({filteredStudents.length})
          </CardTitle>
          <CardDescription>All students with library access</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {student.first_name[0]}{student.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.first_name} {student.last_name}</h4>
                          <p className="text-sm text-gray-600">{student.student_id}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {student.email}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {student.phone}
                            </span>
                            <span>Sem {student.semester}</span>
                            <span>{student.department_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Books Issued: {student.total_books_issued}</div>
                          <div>Current: {student.current_books}</div>
                          {student.overdue_books > 0 && (
                            <div className="text-red-600">Overdue: {student.overdue_books}</div>
                          )}
                          {student.total_fines > 0 && (
                            <div className="text-yellow-600">Fines: {formatCurrency(student.total_fines)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openStudentView(student)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDepartment || selectedStatus
                  ? "Try adjusting your filters to see more students."
                  : "No students have been registered yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      {selectedStudent && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${viewStudentOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Student Details</h2>
              <Button variant="outline" onClick={() => setViewStudentOpen(false)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                      </h3>
                      <p className="text-gray-600">{selectedStudent.student_id}</p>
                      <Badge className={getStatusColor(selectedStudent.status)}>
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span>{selectedStudent.department_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Semester:</span>
                      <span>{selectedStudent.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment Date:</span>
                      <span>{formatDate(selectedStudent.enrollment_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity:</span>
                      <span>{formatDate(selectedStudent.last_activity)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Library Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Library Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedStudent.total_books_issued}</div>
                      <div className="text-sm text-gray-600">Total Books Issued</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedStudent.current_books}</div>
                      <div className="text-sm text-gray-600">Currently Issued</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{selectedStudent.overdue_books}</div>
                      <div className="text-sm text-gray-600">Overdue Books</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{formatCurrency(selectedStudent.total_fines)}</div>
                      <div className="text-sm text-gray-600">Total Fines</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Issuance History */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Book Issuance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentIssuances.length > 0 ? (
                  <div className="space-y-3">
                    {studentIssuances.map((issuance) => (
                      <div key={issuance.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{issuance.book_title}</h4>
                          <p className="text-sm text-gray-600">ISBN: {issuance.book_isbn}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>Issued: {formatDate(issuance.issued_date)}</span>
                            <span>Due: {formatDate(issuance.due_date)}</span>
                            {issuance.return_date && (
                              <span>Returned: {formatDate(issuance.return_date)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getIssuanceStatusColor(issuance.status)}>
                            {issuance.status}
                          </Badge>
                          {issuance.fine_amount && issuance.fine_amount > 0 && (
                            <div className="text-sm text-yellow-600 mt-1">
                              Fine: {formatCurrency(issuance.fine_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No book issuances found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
