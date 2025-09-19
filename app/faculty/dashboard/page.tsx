"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Bell, Clock, Award, AlertCircle, MapPin, Calendar, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface FacultyData {
  id: string
  full_name: string
  email: string
  employee_id: string
  department: string
  designation: string
  specialization?: string
  experience_years: number
  contact_number?: string
  is_first_login?: boolean
}

interface CourseData {
  id: string
  name: string
  code: string
  credits: number
  semester: number
  student_count: number
}

interface TodayClass {
  id: string
  subject_name: string
  subject_code: string
  start_time: string
  end_time: string
  room: string
  student_count: number
  day_of_week: number
}

interface DashboardStats {
  total_courses: number
  total_students: number
  todays_classes: number
  pending_tasks: number
  average_attendance: number
}

export default function FacultyDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch faculty profile
        const { data: faculty, error: facultyError } = await supabase
          .from("faculty")
          .select(`
            *,
            departments(name)
          `)
          .eq("id", user.id)
          .single()

        if (facultyError) {
          console.error("Error fetching faculty data:", facultyError)
          return
        }

        // Fetch courses taught by this faculty
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select(`
            *,
            departments(name)
          `)
          .eq("faculty_id", user.id)

        // Get today's classes
        const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
        const { data: todaySchedule, error: scheduleError } = await supabase
          .from("timetable")
          .select(`
            *,
            subjects(name, code)
          `)
          .eq("faculty_id", user.id)
          .eq("day_of_week", today)
          .order("start_time")

        // Calculate attendance statistics
        const { data: attendanceData } = await supabase
          .from("attendance")
          .select("status")
          .in("subject_id", subjectsData?.map((s) => s.id) || [])

        let averageAttendance = 0
        if (attendanceData && attendanceData.length > 0) {
          const presentCount = attendanceData.filter((a) => a.status === "present").length
          averageAttendance = Math.round((presentCount / attendanceData.length) * 100)
        }

        setFacultyData({
          id: faculty.id,
          full_name: `${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`.trim(),
          email: user.email,
          employee_id: faculty.employee_id,
          department: faculty.departments?.name || "Unknown",
          designation: faculty.designation,
          specialization: faculty.qualification,
          experience_years: faculty.experience_years || 0,
          contact_number: user.profile?.phone,
          is_first_login: user.profile?.is_first_login,
        })

        if (subjectsData) {
          const coursesWithStats = subjectsData.map((subject) => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            semester: subject.semester,
            student_count: 0, // Will be calculated from attendance records
          }))
          setCourses(coursesWithStats)
        }

        if (todaySchedule) {
          const formattedClasses = todaySchedule.map((cls) => ({
            id: cls.id,
            subject_name: cls.subjects?.name || "Unknown Subject",
            subject_code: cls.subjects?.code || "",
            start_time: cls.start_time,
            end_time: cls.end_time,
            room: cls.room_number,
            student_count: 0, // Will be calculated from enrollments
            day_of_week: cls.day_of_week,
          }))
          setTodayClasses(formattedClasses)
        }

        const totalStudents = courses.reduce((sum, course) => sum + course.student_count, 0)

        setDashboardStats({
          total_courses: subjectsData?.length || 0,
          total_students: totalStudents,
          todays_classes: todaySchedule?.length || 0,
          pending_tasks: 2, // Mock data for now
          average_attendance: averageAttendance,
        })
      } catch (error) {
        console.error("Error fetching faculty dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchFacultyData()
    }
  }, [user, courses])

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`)
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const pendingTasks = [
    { id: 1, task: "Grade Assignment 3", course: "Data Structures", dueDate: "2024-03-15" },
    { id: 2, task: "Prepare Lecture Notes", course: "Database Management", dueDate: "2024-03-12" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!facultyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Unable to load dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${facultyData.full_name}`} />
              <AvatarFallback className="bg-green-500 text-white">
                {facultyData.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {facultyData.designation} {facultyData.full_name.split(" ")[0]}!
              </h1>
              <p className="text-green-100">Employee ID: {facultyData.employee_id}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {facultyData.department}
                </Badge>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {facultyData.experience_years} years experience
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => router.push("/faculty/profile")}>
            View Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Teaching</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_courses || 0}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_students || 0}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.average_attendance || 0}%</div>
            <p className="text-xs text-muted-foreground">Class attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayClasses.length > 0 ? (
              <div className="space-y-4">
                {todayClasses.map((classItem, index) => (
                  <div
                    key={classItem.id}
                    className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"
                  >
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">{classItem.subject_name}</h4>
                      <p className="text-sm text-green-700">
                        {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-green-600 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{classItem.room}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/faculty/attendance")}>
                      Mark Attendance
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/faculty/attendance")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/faculty/announcements")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Post Announcement
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/faculty/credits")}
              >
                <Award className="mr-2 h-4 w-4" />
                Award Credits
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/faculty/timetable")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Timetable
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/faculty/students")}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Courses Overview</CardTitle>
          <CardDescription>Your teaching assignments for this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-12 bg-green-500 rounded"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{course.name}</h4>
                    <p className="text-sm text-gray-600">Code: {course.code}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{course.credits} Credits</Badge>
                      <Badge variant="outline">Sem {course.semester}</Badge>
                      <Badge variant="outline">{course.student_count} Students</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses assigned</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                >
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900">{task.task}</h4>
                    <p className="text-sm text-yellow-700">{task.course}</p>
                    <p className="text-xs text-yellow-600 mt-1">Due: {task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your teaching statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Class Attendance</span>
                <span className="text-sm font-bold">{dashboardStats?.average_attendance || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${dashboardStats?.average_attendance || 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Student Satisfaction</span>
                <span className="text-sm font-bold">4.6/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Completion</span>
                <span className="text-sm font-bold">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
