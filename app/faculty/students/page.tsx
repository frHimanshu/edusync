"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Eye, Mail, Phone, MapPin, Calendar, BookOpen, Award, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  semester: number
  department_name: string
  enrollment_date: string
  attendance_percentage?: number
  gpa?: number
  status: string
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  department_name: string
}

interface AttendanceRecord {
  id: string
  student_id: string
  subject_id: string
  date: string
  status: 'present' | 'absent' | 'late'
  remarks?: string
}

export default function FacultyStudents() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]
  const departments = [
    "Computer Science Engineering",
    "Electronics Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering"
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch subjects taught by this faculty
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select(`
            *,
            departments(name)
          `)
          .eq("faculty_id", user.id)

        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError)
          return
        }

        if (subjectsData) {
          const formattedSubjects = subjectsData.map(subject => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            semester: subject.semester,
            department_name: subject.departments?.name || "Unknown"
          }))
          setSubjects(formattedSubjects)
        }

        // Fetch students (initially all students, will be filtered by subject selection)
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(`
            *,
            departments(name)
          `)
          .order("first_name")

        if (studentsError) {
          console.error("Error fetching students:", studentsError)
          return
        }

        if (studentsData) {
          const formattedStudents = studentsData.map(student => ({
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            email: student.email || "",
            phone: student.phone,
            semester: student.semester,
            department_name: student.departments?.name || "Unknown",
            enrollment_date: student.enrollment_date || student.created_at,
            attendance_percentage: Math.floor(Math.random() * 40) + 60, // Mock data
            gpa: Math.round((Math.random() * 2 + 6) * 10) / 10, // Mock data
            status: student.status || "active"
          }))
          setStudents(formattedStudents)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load student data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleViewStudentDetails = async (student: Student) => {
    setSelectedStudent(student)
    
    try {
      const supabase = createClient()

      // Fetch attendance records for this student
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select(`
          *,
          subjects(name, code)
        `)
        .eq("student_id", student.id)
        .order("date", { ascending: false })
        .limit(10)

      if (attendanceError) {
        console.error("Error fetching attendance:", attendanceError)
        return
      }

      if (attendanceData) {
        const formattedAttendance = attendanceData.map(record => ({
          id: record.id,
          student_id: record.student_id,
          subject_id: record.subject_id,
          date: record.date,
          status: record.status,
          remarks: record.remarks
        }))
        setAttendanceRecords(formattedAttendance)
      }

      setStudentDetailsOpen(true)
    } catch (error) {
      console.error("Error fetching student details:", error)
      toast.error("Failed to load student details")
    }
  }

  const handleViewAttendance = async (student: Student) => {
    setSelectedStudent(student)
    
    try {
      const supabase = createClient()

      // Fetch all attendance records for this student
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select(`
          *,
          subjects(name, code)
        `)
        .eq("student_id", student.id)
        .order("date", { ascending: false })

      if (attendanceError) {
        console.error("Error fetching attendance:", attendanceError)
        return
      }

      if (attendanceData) {
        const formattedAttendance = attendanceData.map(record => ({
          id: record.id,
          student_id: record.student_id,
          subject_id: record.subject_id,
          date: record.date,
          status: record.status,
          remarks: record.remarks
        }))
        setAttendanceRecords(formattedAttendance)
      }

      setAttendanceOpen(true)
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast.error("Failed to load attendance records")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !selectedSemester || student.semester.toString() === selectedSemester
    const matchesDepartment = !selectedDepartment || student.department_name === selectedDepartment
    
    // Filter by subject if selected
    let matchesSubject = true
    if (selectedSubject) {
      const subject = subjects.find(s => s.id === selectedSubject)
      if (subject) {
        matchesSubject = student.semester === subject.semester && 
                        student.department_name === subject.department_name
      }
    }
    
    return matchesSearch && matchesSemester && matchesDepartment && matchesSubject
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-gray-600">View and manage students in your courses</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label htmlFor="subjectFilter">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="semesterFilter">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All semesters</SelectItem>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="departmentFilter">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Students ({filteredStudents.length})
            </div>
          </CardTitle>
          <CardDescription>Students enrolled in your courses</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback>
                        {student.first_name[0]}{student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{student.student_id}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {student.department_name}
                        </span>
                        <span>Sem {student.semester}</span>
                        <span className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          GPA: {student.gpa}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {student.attendance_percentage}% attendance
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewStudentDetails(student)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewAttendance(student)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Attendance
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
                {searchTerm || selectedSemester || selectedDepartment || selectedSubject
                  ? "Try adjusting your filters to see more students."
                  : "No students are currently enrolled in your courses."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={studentDetailsOpen} onOpenChange={setStudentDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Student Details - {selectedStudent?.first_name} {selectedStudent?.last_name}
            </DialogTitle>
            <DialogDescription>
              Complete information about the student
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder-user.jpg`} />
                  <AvatarFallback className="text-lg">
                    {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedStudent.student_id}</p>
                  <Badge className={getStatusColor(selectedStudent.status)}>
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedStudent.email}</span>
                  </div>
                  {selectedStudent.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedStudent.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedStudent.department_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Semester {selectedStudent.semester}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">GPA: {selectedStudent.gpa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Attendance: {selectedStudent.attendance_percentage}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Enrolled: {formatDate(selectedStudent.enrollment_date)}</span>
                  </div>
                </div>
              </div>

              {/* Recent Attendance */}
              <div>
                <h4 className="font-medium mb-3">Recent Attendance</h4>
                {attendanceRecords.length > 0 ? (
                  <div className="space-y-2">
                    {attendanceRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="text-sm font-medium">{formatDate(record.date)}</span>
                        </div>
                        <Badge className={getAttendanceColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendance records found</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Records Dialog */}
      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Attendance Records - {selectedStudent?.first_name} {selectedStudent?.last_name}
            </DialogTitle>
            <DialogDescription>
              Complete attendance history for this student
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{formatDate(record.date)}</span>
                      {record.remarks && (
                        <p className="text-sm text-gray-600 mt-1">{record.remarks}</p>
                      )}
                    </div>
                    <Badge className={getAttendanceColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records found for this student</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
