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
import { BookOpen, Users, Clock, Calendar, Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Course {
  id: string
  name: string
  code: string
  semester: number
  department_name: string
  credits: number
  description?: string
  total_students: number
  created_at: string
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  semester: number
  department_name: string
}

export default function FacultyCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [studentsOpen, setStudentsOpen] = useState(false)
  const [selectedCourseStudents, setSelectedCourseStudents] = useState<Student[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Form state
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [semester, setSemester] = useState("")
  const [credits, setCredits] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]
  const departments = [
    "Computer Science Engineering",
    "Electronics Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering"
  ]

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        const { data: coursesData, error: coursesError } = await supabase
          .from("subjects")
          .select(`
            *,
            departments(name)
          `)
          .eq("faculty_id", user.id)
          .order("created_at", { ascending: false })

        if (coursesError) {
          console.error("Error fetching courses:", coursesError)
          return
        }

        if (coursesData) {
          const formattedCourses = coursesData.map(course => ({
            id: course.id,
            name: course.name,
            code: course.code,
            semester: course.semester,
            department_name: course.departments?.name || "Unknown",
            credits: course.credits || 3,
            description: course.description,
            total_students: 0, // Will be calculated separately
            created_at: course.created_at
          }))
          setCourses(formattedCourses)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast.error("Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourses()
    }
  }, [user])

  const handleCreateCourse = async () => {
    if (!user || !courseName || !courseCode || !semester || !credits) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("subjects")
        .insert({
          name: courseName,
          code: courseCode,
          semester: parseInt(semester),
          credits: parseInt(credits),
          description: description || null,
          faculty_id: user.id,
          department_id: "1" // Default department, should be dynamic
        })

      if (error) {
        throw error
      }

      toast.success("Course created successfully")
      setCreateOpen(false)
      resetForm()
      
      // Refresh courses list
      window.location.reload()
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error("Failed to create course")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCourse = async () => {
    if (!editingCourse || !courseName || !courseCode || !semester || !credits) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("subjects")
        .update({
          name: courseName,
          code: courseCode,
          semester: parseInt(semester),
          credits: parseInt(credits),
          description: description || null
        })
        .eq("id", editingCourse.id)

      if (error) {
        throw error
      }

      toast.success("Course updated successfully")
      setEditingCourse(null)
      resetForm()
      
      // Refresh courses list
      window.location.reload()
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
      const supabase = createClient()

      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", courseId)

      if (error) {
        throw error
      }

      toast.success("Course deleted successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    }
  }

  const handleViewStudents = async (course: Course) => {
    setSelectedCourse(course)
    
    try {
      const supabase = createClient()

      // Get students enrolled in this course (same department and semester)
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(`
          *,
          departments(name)
        `)
        .eq("semester", course.semester)
        // Add department filter when available

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
          semester: student.semester,
          department_name: student.departments?.name || "Unknown"
        }))
        setSelectedCourseStudents(formattedStudents)
        setStudentsOpen(true)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Failed to load students")
    }
  }

  const resetForm = () => {
    setCourseName("")
    setCourseCode("")
    setSemester("")
    setCredits("")
    setDescription("")
  }

  const openEditDialog = (course: Course) => {
    setEditingCourse(course)
    setCourseName(course.name)
    setCourseCode(course.code)
    setSemester(course.semester.toString())
    setCredits(course.credits.toString())
    setDescription(course.description || "")
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = !selectedSemester || course.semester.toString() === selectedSemester
    const matchesDepartment = !selectedDepartment || course.department_name === selectedDepartment
    
    return matchesSearch && matchesSemester && matchesDepartment
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-gray-600">Manage your courses and view enrolled students</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your teaching portfolio
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
                  placeholder="e.g., CS101"
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
                      {semesters.map((sem) => (
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  placeholder="Search by name or code..."
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

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </div>
                <div className="flex space-x-1">
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
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Semester:</span>
                  <Badge variant="outline">Sem {course.semester}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{course.department_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{course.total_students}</span>
                </div>
                {course.description && (
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{course.description}</p>
                  </div>
                )}
                <Button
                  onClick={() => handleViewStudents(course)}
                  className="w-full"
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Students
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedSemester || selectedDepartment
                ? "Try adjusting your filters to see more courses."
                : "You haven't created any courses yet. Create your first course to get started."}
            </p>
          </CardContent>
        </Card>
      )}

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
                placeholder="e.g., CS101"
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
                    {semesters.map((sem) => (
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
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Updating..." : "Update Course"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Students Dialog */}
      <Dialog open={studentsOpen} onOpenChange={setStudentsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Students in {selectedCourse?.name} ({selectedCourse?.code})
            </DialogTitle>
            <DialogDescription>
              Students enrolled in this course
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {selectedCourseStudents.length > 0 ? (
              <div className="space-y-3">
                {selectedCourseStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {student.student_id} • {student.department_name} • Sem {student.semester}
                      </p>
                    </div>
                    <Badge variant="outline">Enrolled</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No students enrolled in this course</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
