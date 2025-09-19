"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Users, Calendar, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Course {
  id: string
  name: string
  code: string
  semester: number
  credits: number
  description?: string
  faculty_name: string
  faculty_id: string
  enrolled_students: number
  max_students: number
  status: string
  created_at: string
}

interface Faculty {
  id: string
  name: string
  designation: string
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const STATUS_OPTIONS = ["Active", "Inactive", "Draft"]

export default function HODCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Form state
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [semester, setSemester] = useState("")
  const [credits, setCredits] = useState("")
  const [description, setDescription] = useState("")
  const [assignedFaculty, setAssignedFaculty] = useState("")
  const [maxStudents, setMaxStudents] = useState("")
  const [status, setStatus] = useState("Active")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockCourses: Course[] = [
          {
            id: "course1",
            name: "Data Structures and Algorithms",
            code: "CS201",
            semester: 3,
            credits: 4,
            description: "Fundamental concepts of data structures and algorithm design",
            faculty_name: "Dr. John Smith",
            faculty_id: "faculty1",
            enrolled_students: 45,
            max_students: 50,
            status: "Active",
            created_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "course2",
            name: "Database Management Systems",
            code: "CS301",
            semester: 5,
            credits: 3,
            description: "Introduction to database design and management",
            faculty_name: "Dr. Sarah Johnson",
            faculty_id: "faculty2",
            enrolled_students: 38,
            max_students: 40,
            status: "Active",
            created_at: "2024-01-20T00:00:00Z"
          },
          {
            id: "course3",
            name: "Software Engineering",
            code: "CS401",
            semester: 7,
            credits: 4,
            description: "Software development methodologies and practices",
            faculty_name: "Dr. Michael Brown",
            faculty_id: "faculty3",
            enrolled_students: 32,
            max_students: 35,
            status: "Active",
            created_at: "2024-02-01T00:00:00Z"
          }
        ]

        const mockFaculty: Faculty[] = [
          { id: "faculty1", name: "Dr. John Smith", designation: "Professor" },
          { id: "faculty2", name: "Dr. Sarah Johnson", designation: "Associate Professor" },
          { id: "faculty3", name: "Dr. Michael Brown", designation: "Assistant Professor" }
        ]

        setCourses(mockCourses)
        setFaculty(mockFaculty)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load course data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateCourse = async () => {
    if (!courseName || !courseCode || !semester || !credits || !assignedFaculty) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseName,
        code: courseCode,
        semester: parseInt(semester),
        credits: parseInt(credits),
        description: description || undefined,
        faculty_name: faculty.find(f => f.id === assignedFaculty)?.name || "",
        faculty_id: assignedFaculty,
        enrolled_students: 0,
        max_students: parseInt(maxStudents) || 50,
        status: status,
        created_at: new Date().toISOString()
      }

      setCourses(prev => [newCourse, ...prev])
      toast.success("Course created successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error("Failed to create course")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCourse = async () => {
    if (!editingCourse || !courseName || !courseCode || !semester || !credits || !assignedFaculty) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const updatedCourse = {
        ...editingCourse,
        name: courseName,
        code: courseCode,
        semester: parseInt(semester),
        credits: parseInt(credits),
        description: description || undefined,
        faculty_name: faculty.find(f => f.id === assignedFaculty)?.name || "",
        faculty_id: assignedFaculty,
        max_students: parseInt(maxStudents) || 50,
        status: status
      }

      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id ? updatedCourse : course
      ))
      
      toast.success("Course updated successfully")
      setEditingCourse(null)
      resetForm()
    } catch (error) {
      console.error("Error updating course:", error)
      toast.error("Failed to update course")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return
    }

    try {
      setCourses(prev => prev.filter(course => course.id !== courseId))
      toast.success("Course deleted successfully")
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    }
  }

  const resetForm = () => {
    setCourseName("")
    setCourseCode("")
    setSemester("")
    setCredits("")
    setDescription("")
    setAssignedFaculty("")
    setMaxStudents("")
    setStatus("Active")
  }

  const openEditDialog = (course: Course) => {
    setEditingCourse(course)
    setCourseName(course.name)
    setCourseCode(course.code)
    setSemester(course.semester.toString())
    setCredits(course.credits.toString())
    setDescription(course.description || "")
    setAssignedFaculty(course.faculty_id)
    setMaxStudents(course.max_students.toString())
    setStatus(course.status)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEnrollmentColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !selectedSemester || course.semester.toString() === selectedSemester
    const matchesStatus = !selectedStatus || course.status === selectedStatus
    
    return matchesSearch && matchesSemester && matchesStatus
  })

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
          <h1 className="text-3xl font-bold">Department Courses</h1>
          <p className="text-gray-600">Manage courses offered by your department</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your department's curriculum
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS201"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semester *</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="credits">Credits *</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="3"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="assignedFaculty">Assigned Faculty *</Label>
                <Select value={assignedFaculty} onValueChange={setAssignedFaculty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty.map((fac) => (
                      <SelectItem key={fac.id} value={fac.id}>
                        {fac.name} ({fac.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    placeholder="50"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Course description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(c => c.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.enrolled_students, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.credits, 0)}
            </div>
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
              <Label htmlFor="search">Search Courses</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, code, or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="semesterFilter">Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All semesters</SelectItem>
                  {SEMESTERS.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
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
                  <SelectItem value="">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
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

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Courses ({filteredCourses.length})
          </CardTitle>
          <CardDescription>All courses offered by your department</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCourses.length > 0 ? (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-gray-600">{course.code}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Sem {course.semester}
                          </span>
                          <span className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {course.credits} credits
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.faculty_name}
                          </span>
                        </div>
                        {course.description && (
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getEnrollmentColor(course.enrolled_students, course.max_students)}`}>
                            {course.enrolled_students}/{course.max_students}
                          </div>
                          <div className="text-xs text-gray-500">students</div>
                        </div>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedSemester || selectedStatus
                  ? "Try adjusting your filters to see more courses."
                  : "No courses have been created yet. Create your first course to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCourseName">Course Name *</Label>
              <Input
                id="editCourseName"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editCourseCode">Course Code *</Label>
              <Input
                id="editCourseCode"
                placeholder="e.g., CS201"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editSemester">Semester *</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCredits">Credits *</Label>
                <Input
                  id="editCredits"
                  type="number"
                  placeholder="3"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editAssignedFaculty">Assigned Faculty *</Label>
              <Select value={assignedFaculty} onValueChange={setAssignedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((fac) => (
                    <SelectItem key={fac.id} value={fac.id}>
                      {fac.name} ({fac.designation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editMaxStudents">Max Students</Label>
                <Input
                  id="editMaxStudents"
                  type="number"
                  placeholder="50"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((stat) => (
                      <SelectItem key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Course description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCourse(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditCourse}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Updating..." : "Update Course"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
