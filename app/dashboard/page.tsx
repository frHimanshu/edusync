"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HostelOccupancyMap } from "@/components/hostel-occupancy-map"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Calendar,
  Clock,
  GraduationCap,
  Bell,
  CheckCircle,
  AlertCircle,
  Wallet,
  Building,
  Users,
  Bed,
  MapPin,
  BookOpen,
  Award,
  FileText,
  Search,
  TrendingUp,
  DollarSign,
  UserPlus,
  ChevronRight,
  MessageSquare,
  CalendarIcon,
} from "lucide-react"

const mockStudentData = {
  id: "STU2024001",
  name: "John Doe",
  course: "Computer Science Engineering",
  semester: "6th Semester",
  walletBalance: 2500,
  profileImage: "/diverse-student-profiles.png",
  upcomingClasses: [
    {
      subject: "Data Structures",
      time: "10:00 AM - 11:00 AM",
      room: "Room 301, Block A",
      date: "Today",
      professor: "Dr. Smith",
      type: "Lecture",
    },
    {
      subject: "Database Management",
      time: "2:00 PM - 3:00 PM",
      room: "Lab 205, Block B",
      date: "Today",
      professor: "Prof. Johnson",
      type: "Lab",
    },
    {
      subject: "Software Engineering",
      time: "9:00 AM - 10:00 AM",
      room: "Room 102, Block A",
      date: "Tomorrow",
      professor: "Dr. Williams",
      type: "Lecture",
    },
  ],
  recentAnnouncements: [
    { id: 1, title: "Library Hours Extended", date: "2024-03-10", priority: "info", category: "General" },
    { id: 2, title: "Mid-term Exam Schedule Released", date: "2024-03-08", priority: "urgent", category: "Academic" },
    { id: 3, title: "Tech Fest Registration Open", date: "2024-03-05", priority: "info", category: "Events" },
    { id: 4, title: "Hostel Maintenance Notice", date: "2024-03-03", priority: "info", category: "Hostel" },
  ],
  myClubs: [
    {
      id: 1,
      name: "Coding Club",
      icon: "💻",
      latestPost: "Hackathon registration starts tomorrow!",
      postDate: "2 hours ago",
    },
    { id: 2, name: "Cricket Team", icon: "🏏", latestPost: "Practice session moved to 5 PM", postDate: "1 day ago" },
    {
      id: 3,
      name: "Photography Society",
      icon: "📸",
      latestPost: "Photo walk this weekend at campus lake",
      postDate: "3 days ago",
    },
  ],
  attendancePercentage: 87,
  creditsEarned: 156,
  totalCredits: 180,
}

const mockHostelData = {
  id: "HST001",
  name: "Sarah Johnson",
  role: "Hostel Warden",
  block: "Block A",
  totalRooms: 50,
  occupiedRooms: 42,
  totalResidents: 84,
  pendingRequests: 5,
  maintenanceIssues: 3,
  recentAnnouncements: [
    { id: 1, title: "Room Inspection Schedule", date: "2024-03-10", priority: "info" },
    { id: 2, title: "Maintenance Work Block B", date: "2024-03-08", priority: "urgent" },
    { id: 3, title: "New Resident Check-in", date: "2024-03-05", priority: "info" },
  ],
  upcomingTasks: [
    { id: 1, title: "Room Inspection - Floor 2", date: "2024-03-15", type: "inspection" },
    { id: 2, title: "Maintenance Check", date: "2024-03-18", type: "maintenance" },
    { id: 3, title: "New Resident Orientation", date: "2024-03-20", type: "orientation" },
  ],
}

const mockFacultyData = {
  id: "FAC001",
  name: "Dr. Sarah Johnson",
  department: "Computer Science",
  designation: "Associate Professor",
  coursesTeaching: [
    { id: "CS101", name: "Data Structures", students: 45 },
    { id: "CS201", name: "Computer Networks", students: 38 },
    { id: "CS301", name: "Database Management", students: 42 },
  ],
  todaysClasses: [
    { time: "10:00 AM - 11:00 AM", subject: "Data Structures", room: "Room 301", students: 45 },
    { time: "2:00 PM - 3:00 PM", subject: "Computer Networks", room: "Room 205", students: 38 },
  ],
  recentAnnouncements: [
    { id: 1, title: "Mid-term Exam Schedule", date: "2024-03-10", course: "Data Structures" },
    { id: 2, title: "Assignment Submission", date: "2024-03-08", course: "Computer Networks" },
  ],
  pendingTasks: [
    { id: 1, task: "Grade Assignment 3", course: "Data Structures", dueDate: "2024-03-15" },
    { id: 2, task: "Prepare Lecture Notes", course: "Database Management", dueDate: "2024-03-12" },
  ],
}

const mockAdminData = {
  id: "ADM001",
  name: "Dr. Michael Anderson",
  role: "System Administrator",
  department: "Administration",
  totalStudents: 480,
  totalFeesCollected: 2450000,
  hostelOccupancy: 84,
  kpiData: {
    totalStudents: 480,
    feesCollected: 2450000,
    hostelOccupancy: 84,
    newAdmissions: 125,
  },
  admissionData: [
    { department: "Computer Science", students: 120 },
    { department: "Electronics", students: 95 },
    { department: "Mechanical", students: 110 },
    { department: "Civil", students: 85 },
    { department: "Chemical", students: 70 },
  ],
  hostelData: [
    { name: "Occupied", value: 420, color: "#3b82f6" },
    { name: "Vacant", value: 80, color: "#e5e7eb" },
  ],
  feeData: [
    { date: "Week 1", amount: 125000 },
    { date: "Week 2", amount: 180000 },
    { date: "Week 3", amount: 220000 },
    { date: "Week 4", amount: 195000 },
  ],
}

const mockAccountantData = {
  id: "ACC001",
  name: "Ms. Jennifer Smith",
  role: "Senior Accountant",
  department: "Accounts Department",
  totalStudents: 480,
  newRegistrations: 25,
  pendingFees: 45,
  totalFeesCollected: 2450000,
  recentRegistrations: [
    { id: 1, name: "Alex Johnson", studentId: "DTE24CSE101", date: "2024-03-10", course: "Computer Science" },
    { id: 2, name: "Sarah Williams", studentId: "DTE24ECE102", date: "2024-03-09", course: "Electronics" },
    { id: 3, name: "Michael Brown", studentId: "DTE24MEE103", date: "2024-03-08", course: "Mechanical" },
  ],
  feeStats: [
    { status: "Paid", count: 435, color: "#10b981" },
    { status: "Pending", count: 45, color: "#f59e0b" },
  ],
  monthlyRegistrations: [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 95 },
    { month: "Mar", count: 85 },
  ],
}

export default function Dashboard() {
  const [studentData, setStudentData] = useState(mockStudentData)
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel" | "accountant">("student")
  const [hostelData, setHostelData] = useState(mockHostelData)
  const [facultyData, setFacultyData] = useState(mockFacultyData)
  const [adminData, setAdminData] = useState(mockAdminData)
  const [accountantData, setAccountantData] = useState(mockAccountantData)
  const [loading, setLoading] = useState(true)

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("[v0] No authenticated user, redirecting to login")
      router.replace("/")
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const initializeUserType = async () => {
      if (!user) {
        return
      }

      try {
        if (user?.role) {
          const redirectPaths = {
            student: "/student/dashboard",
            faculty: "/faculty-dashboard",
            hostel: "/hostel-dashboard",
            hostel_authority: "/hostel-dashboard",
            administrator: "/admin/dashboard",
            accountant: "/accountant-dashboard",
            hod: "/hod-dashboard",
            librarian: "/librarian-dashboard",
            tnp: "/tnp-dashboard",
          }

          const redirectPath = redirectPaths[user.role as keyof typeof redirectPaths]
          if (redirectPath) {
            console.log(`[v0] Redirecting ${user.role} to ${redirectPath}`)
            router.replace(redirectPath)
            return
          }

          // Map database roles to UI roles for fallback
          const roleMapping = {
            student: "student",
            faculty: "teacher",
            hostel: "hostel",
            hostel_authority: "hostel",
            administrator: "admin",
            accountant: "accountant",
            hod: "hod",
            librarian: "librarian",
            tnp: "placement",
          }

          const mappedRole = roleMapping[user.role as keyof typeof roleMapping]
          if (mappedRole) {
            setUserType(mappedRole as any)
            localStorage.setItem("userType", mappedRole)
          } else {
            console.error("[v0] Unknown role:", user.role)
          }
        } else {
          // Fallback to localStorage if no role in auth
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
      } catch (error) {
        console.error("[v0] Error getting user role:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeUserType()
  }, [user, router])

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <GraduationCap className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "career":
        return <CheckCircle className="h-4 w-4" />
      case "inspection":
        return <CheckCircle className="h-4 w-4" />
      case "maintenance":
        return <Building className="h-4 w-4" />
      case "orientation":
        return <Users className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "info":
        return "secondary"
      default:
        return "outline"
    }
  }

  const renderHostelDashboard = () => (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {hostelData.name}</h1>
        <p className="text-muted-foreground mt-1">
          {hostelData.role} • {hostelData.block} • ID: {hostelData.id}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{hostelData.totalRooms}</div>
            <p className="text-xs text-muted-foreground">In {hostelData.block}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {hostelData.occupiedRooms}/{hostelData.totalRooms}
            </div>
            <Progress value={(hostelData.occupiedRooms / hostelData.totalRooms) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{hostelData.totalResidents}</div>
            <Badge variant="secondary" className="mt-2">
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{hostelData.pendingRequests}</div>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              View All
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Search className="h-6 w-6" />
            Student Search
          </CardTitle>
          <CardDescription>Quickly find student information, room details, and fee payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" asChild>
            <a href="/hostel/search">
              <Search className="h-5 w-5 mr-2" />
              Search Students
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Management Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Room Management Overview</CardTitle>
            <CardDescription>Current status and key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Room Occupancy</span>
                  <span>{Math.round((hostelData.occupiedRooms / hostelData.totalRooms) * 100)}%</span>
                </div>
                <Progress value={(hostelData.occupiedRooms / hostelData.totalRooms) * 100} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{hostelData.maintenanceIssues}</div>
                  <div className="text-sm text-muted-foreground">Maintenance Issues</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {hostelData.totalRooms - hostelData.occupiedRooms}
                  </div>
                  <div className="text-sm text-muted-foreground">Vacant Rooms</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Information */}
        <Card>
          <CardHeader>
            <CardTitle>Block Information</CardTitle>
            <CardDescription>Your assigned block details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-medium">Assigned Block</div>
                <div className="text-sm text-muted-foreground">{hostelData.block}</div>
              </div>
              <div>
                <div className="font-medium">Role</div>
                <div className="text-sm text-muted-foreground">{hostelData.role}</div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                View Block Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Scheduled activities and inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hostelData.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {getEventIcon(task.type)}
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.date}</div>
                  </div>
                  <Badge variant="outline">{task.type}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest updates and notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hostelData.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  {announcement.priority === "urgent" ? (
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  ) : (
                    <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-sm text-muted-foreground">{announcement.date}</div>
                  </div>
                  <Badge variant={getPriorityColor(announcement.priority) as any}>{announcement.priority}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Announcements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderFacultyDashboard = () => (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {facultyData.name}</h1>
        <p className="text-muted-foreground mt-1">
          {facultyData.designation} • {facultyData.department} • ID: {facultyData.id}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Teaching</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{facultyData.coursesTeaching.length}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {facultyData.coursesTeaching.reduce((sum, course) => sum + course.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{facultyData.todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{facultyData.pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Items to complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facultyData.todaysClasses.map((classItem, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-sm text-muted-foreground">{classItem.time}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {classItem.room} • {classItem.students} students
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/faculty/attendance">
                      <Clock className="h-6 w-6" />
                      <span>Mark Attendance</span>
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses Overview</CardTitle>
            <CardDescription>Your teaching assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facultyData.coursesTeaching.map((course) => (
                <div key={course.id} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm text-muted-foreground">{course.students} students enrolled</div>
                  <Badge variant="outline" className="mt-2">
                    {course.id}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/faculty/attendance">
            <Clock className="h-6 w-6" />
            <span>Mark Attendance</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/faculty/announcements">
            <Bell className="h-6 w-6" />
            <span>Post Announcement</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/faculty/credits">
            <Award className="h-6 w-6" />
            <span>Award Credits</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/faculty/timetables">
            <Calendar className="h-6 w-6" />
            <span>Manage Timetables</span>
          </a>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Your recently posted announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facultyData.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {announcement.course} • {announcement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <a href="/faculty/announcements">Create New Announcement</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facultyData.pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{task.task}</div>
                    <div className="text-sm text-muted-foreground">
                      {task.course} • Due: {task.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={studentData.profileImage || "/placeholder.svg"} alt={studentData.name} />
          <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
            {studentData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Welcome back, {studentData.name}!</h1>
          <p className="text-muted-foreground mt-1">
            {studentData.course} • {studentData.semester} • ID: {studentData.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Next Class Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary text-balance">{studentData.upcomingClasses[0].subject}</div>
            <p className="text-sm text-muted-foreground">{studentData.upcomingClasses[0].time}</p>
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{studentData.upcomingClasses[0].room}</span>
            </div>
            <Badge variant="secondary" className="mt-2 text-xs">
              {studentData.upcomingClasses[0].type}
            </Badge>
          </CardContent>
        </Card>

        {/* Edu-Credits Balance Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edu-Credits (EC)</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">₹{studentData.walletBalance}</div>
            <p className="text-xs text-muted-foreground mb-3">Current Balance</p>
            <div className="flex items-center gap-2">
              <Progress value={(studentData.creditsEarned / studentData.totalCredits) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {studentData.creditsEarned}/{studentData.totalCredits}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{studentData.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground mb-3">Overall Attendance</p>
            <Progress value={studentData.attendancePercentage} className="w-full" />
          </CardContent>
        </Card>

        {/* My Clubs Quick Access */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Groups</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-secondary">{studentData.myClubs.length}</div>
            <p className="text-xs text-muted-foreground mb-2">Active Memberships</p>
            <div className="flex -space-x-1">
              {studentData.myClubs.slice(0, 3).map((club, index) => (
                <div
                  key={club.id}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background"
                >
                  {club.icon}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.upcomingClasses.slice(0, 3).map((classItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-balance">{classItem.subject}</div>
                  <div className="text-sm text-muted-foreground">{classItem.professor}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {classItem.time} • {classItem.date}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={classItem.type === "Lab" ? "secondary" : "outline"} className="text-xs">
                    {classItem.type}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {classItem.room}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/student/timetable">View Full Timetable</a>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.recentAnnouncements.slice(0, 4).map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-balance">{announcement.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{announcement.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={announcement.priority === "urgent" ? "destructive" : "secondary"} className="text-xs">
                    {announcement.category}
                  </Badge>
                  {announcement.priority === "urgent" && <AlertCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/student/announcements">View All Announcements</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            My Clubs & Forums
          </CardTitle>
          <CardDescription>Latest updates from your subscribed groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentData.myClubs.map((club) => (
              <div key={club.id} className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{club.icon}</div>
                  <div>
                    <div className="font-medium text-balance">{club.name}</div>
                    <div className="text-xs text-muted-foreground">{club.postDate}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-balance">{club.latestPost}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Latest post</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
            <a href="/student/groups">View All Groups</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/attendance">
                <CheckCircle className="h-6 w-6" />
                <span className="text-xs text-center">View Attendance</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/timetable">
                <Calendar className="h-6 w-6" />
                <span className="text-xs text-center">Timetable</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/wallet">
                <Wallet className="h-6 w-6" />
                <span className="text-xs text-center">Edu-Credits</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/documents">
                <FileText className="h-6 w-6" />
                <span className="text-xs text-center">My Documents</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/faculty">
                <GraduationCap className="h-6 w-6" />
                <span className="text-xs text-center">Faculty Directory</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors bg-transparent"
              asChild
            >
              <a href="/student/groups">
                <Users className="h-6 w-6" />
                <span className="text-xs text-center">My Groups</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {adminData.name}</h1>
        <p className="text-muted-foreground mt-1">
          {adminData.role} • {adminData.department} • ID: {adminData.id}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{adminData.kpiData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹{(adminData.kpiData.feesCollected / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hostel Occupancy</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{adminData.kpiData.hostelOccupancy}%</div>
            <Progress value={adminData.kpiData.hostelOccupancy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{adminData.kpiData.newAdmissions}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Admissions by Department */}
        <Card>
          <CardHeader>
            <CardTitle>New Admissions by Department</CardTitle>
            <CardDescription>Current semester enrollment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminData.admissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hostel Occupancy Map */}
        <HostelOccupancyMap />
      </div>

      {/* Fee Collection Trend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fee Collection Over the Last 30 Days</CardTitle>
          <CardDescription>Weekly collection trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adminData.feeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/admin/reports">
            <FileText className="h-6 w-6" />
            <span>View Reports</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/admin/students">
            <Users className="h-6 w-6" />
            <span>Manage Students</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/admin/system">
            <Building className="h-6 w-6" />
            <span>System Settings</span>
          </a>
        </Button>
      </div>
    </div>
  )

  const renderAccountantDashboard = () => (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {accountantData.name}</h1>
        <p className="text-muted-foreground mt-1">
          {accountantData.role} • {accountantData.department} • ID: {accountantData.id}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{accountantData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{accountantData.newRegistrations}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{accountantData.pendingFees}</div>
            <p className="text-xs text-muted-foreground">Students with pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹{(accountantData.totalFeesCollected / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-6 w-6" />
            Student Registration
          </CardTitle>
          <CardDescription>Register new students and manage admissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" asChild>
            <a href="/accounts/register-student">
              <UserPlus className="h-5 w-5 mr-2" />
              Register New Student
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Registrations</CardTitle>
            <CardDescription>Latest students added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accountantData.recentRegistrations.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                    <UserPlus className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {student.studentId}</div>
                    <div className="text-xs text-muted-foreground">
                      {student.course} • {student.date}
                    </div>
                  </div>
                  <Badge variant="outline">New</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <a href="/accounts/students">View All Students</a>
            </Button>
          </CardContent>
        </Card>

        {/* Fee Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Payment Overview</CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accountantData.feeStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }}></div>
                    <span className="font-medium">{stat.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{stat.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((stat.count / accountantData.totalStudents) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Progress
                value={(accountantData.feeStats[0].count / accountantData.totalStudents) * 100}
                className="h-2"
              />
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <a href="/accounts/fees">Manage Fee Payments</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Registration Trend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Registration Trends</CardTitle>
          <CardDescription>Student registration patterns over the last 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accountantData.monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/accounts/register-student">
            <UserPlus className="h-6 w-6" />
            <span>Register Student</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/accounts/fees">
            <DollarSign className="h-6 w-6" />
            <span>Manage Fees</span>
          </a>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
          <a href="/accounts/students">
            <Users className="h-6 w-6" />
            <span>Student Records</span>
          </a>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-y-auto">
        {userType === "hostel" && renderHostelDashboard()}
        {userType === "teacher" && renderFacultyDashboard()}
        {userType === "student" && renderStudentDashboard()}
        {userType === "admin" && renderAdminDashboard()}
        {userType === "accountant" && renderAccountantDashboard()}
      </main>
    </div>
  )
}
