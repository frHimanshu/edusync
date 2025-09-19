"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Bell, MapPin, Calendar, TrendingUp, FileText, Wallet, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DEMO_STUDENT_DATA } from "@/lib/demo-auth"

interface StudentData {
  id: string
  student_id: string
  department_id: string
  semester: number
  year_of_admission: number
  date_of_birth: string
  address: string
  guardian_name: string
  guardian_phone: string
  blood_group: string
  hostel_room_id?: string
  ec_wallet_balance: number
  tags: string[]
  fee_status: string
  room_number?: string
  department_name?: string
}

interface DashboardStats {
  attendance_percentage: number
  total_credits: number
  unread_notifications: number
  wallet_balance: number
  upcoming_classes: number
}

interface Announcement {
  id: string
  title: string
  content: string
  channel: string
  priority: string
  created_at: string
  author_name: string
}

interface TodayClass {
  id: string
  subject_name: string
  subject_code: string
  start_time: string
  end_time: string
  room: string
  faculty_name: string
  day_of_week: number
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Check if we're in demo mode
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo') || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
          // Use demo data
          setStudentData({
            id: user.id,
            student_id: user.profile?.student_id || 'STU001',
            department_id: 'demo-dept-1',
            semester: user.profile?.semester || 3,
            year_of_admission: user.profile?.year_of_admission || 2022,
            date_of_birth: '2004-01-15',
            address: '123 Main St, City',
            guardian_name: 'John Smith',
            guardian_phone: '9876543210',
            blood_group: 'A+',
            hostel_room_id: 'demo-room-1',
            ec_wallet_balance: DEMO_STUDENT_DATA.wallet.balance,
            tags: ['hostel_resident'],
            fee_status: 'paid',
            room_number: 'H-101',
            department_name: user.profile?.department || 'Computer Science',
          })

          setDashboardStats({
            attendance_percentage: DEMO_STUDENT_DATA.attendance.percentage,
            total_credits: 18,
            unread_notifications: 2,
            wallet_balance: DEMO_STUDENT_DATA.wallet.balance,
            upcoming_classes: 3,
          })

          setAnnouncements(DEMO_STUDENT_DATA.announcements.map(ann => ({
            id: ann.id,
            title: ann.title,
            content: ann.content,
            channel: 'General',
            priority: ann.priority,
            created_at: ann.created_at,
            author_name: 'Admin'
          })))

          setTodayClasses([
            {
              id: '1',
              subject_name: 'Data Structures',
              subject_code: 'CS301',
              start_time: '09:00:00',
              end_time: '10:00:00',
              room_number: 'LH-101',
              faculty_name: 'Dr. Carol Davis'
            },
            {
              id: '2',
              subject_name: 'Database Management',
              subject_code: 'CS302',
              start_time: '11:00:00',
              end_time: '12:00:00',
              room_number: 'LH-102',
              faculty_name: 'Dr. Carol Davis'
            }
          ])

          setLoading(false)
          return
        }

        const supabase = createClient()

        const { data: student, error: studentError } = await supabase
          .from("students")
          .select(`
            *,
            hostel_rooms(room_number),
            departments(name)
          `)
          .eq("id", user.id)
          .single()

        if (studentError) {
          console.error("Error fetching student data:", studentError)
          return
        }

        const [attendanceResult, walletResult, announcementsResult] = await Promise.all([
          // Get attendance percentage
          supabase
            .from("attendance")
            .select("status")
            .eq("student_id", user.id),

          // Get wallet balance
          supabase
            .from("wallet_transactions")
            .select("amount, transaction_type")
            .eq("student_id", user.id),

          // Get recent announcements
          supabase
            .from("announcements")
            .select(`
              *,
              users!announcements_author_id_fkey(first_name, last_name)
            `)
            .order("created_at", { ascending: false })
            .limit(5),
        ])

        let attendancePercentage = 0
        if (attendanceResult.data && attendanceResult.data.length > 0) {
          const presentCount = attendanceResult.data.filter((a) => a.status === "present").length
          attendancePercentage = Math.round((presentCount / attendanceResult.data.length) * 100)
        }

        let walletBalance = student.ec_wallet_balance || 0

        const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
        const { data: todaySchedule } = await supabase
          .from("timetable")
          .select(`
            *,
            subjects(name, code),
            faculty!timetable_faculty_id_fkey(first_name, last_name)
          `)
          .eq("day_of_week", today)
          .order("start_time")

        setStudentData({
          id: student.id,
          student_id: student.student_id,
          department_id: student.department_id,
          semester: student.semester,
          year_of_admission: student.year_of_admission,
          date_of_birth: student.date_of_birth,
          address: student.address,
          guardian_name: student.guardian_name,
          guardian_phone: student.guardian_phone,
          blood_group: student.blood_group,
          hostel_room_id: student.hostel_room_id,
          ec_wallet_balance: student.ec_wallet_balance,
          tags: student.tags,
          fee_status: student.fee_status,
          room_number: student.hostel_rooms?.room_number,
          department_name: student.departments?.name,
        })

        setDashboardStats({
          attendance_percentage: attendancePercentage,
          total_credits: 0, // Will be calculated from enrolled subjects
          unread_notifications: 3, // Mock data for now
          wallet_balance: walletBalance,
          upcoming_classes: todaySchedule?.length || 0,
        })

        if (announcementsResult.data) {
          const formattedAnnouncements = announcementsResult.data.map((ann) => ({
            id: ann.id,
            title: ann.title,
            content: ann.content,
            channel: ann.channel,
            priority: ann.priority,
            created_at: ann.created_at,
            author_name: `${ann.users?.first_name || ""} ${ann.users?.last_name || ""}`.trim(),
          }))
          setAnnouncements(formattedAnnouncements)
        }

        if (todaySchedule) {
          const formattedClasses = todaySchedule.map((cls) => ({
            id: cls.id,
            subject_name: cls.subjects?.name || "Unknown Subject",
            subject_code: cls.subjects?.code || "",
            start_time: cls.start_time,
            end_time: cls.end_time,
            room: cls.room_number,
            faculty_name: `${cls.faculty?.first_name || ""} ${cls.faculty?.last_name || ""}`.trim(),
            day_of_week: cls.day_of_week,
          }))
          setTodayClasses(formattedClasses)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "all":
        return "bg-blue-50 border-blue-500 text-blue-900"
      case "students":
        return "bg-green-50 border-green-500 text-green-900"
      case "hostel_residents":
        return "bg-purple-50 border-purple-500 text-purple-900"
      case "placement":
        return "bg-orange-50 border-orange-500 text-orange-900"
      case "department_specific":
        return "bg-indigo-50 border-indigo-500 text-indigo-900"
      default:
        return "bg-gray-50 border-gray-500 text-gray-900"
    }
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`)
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!studentData) {
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.profile?.first_name || "Student"}`} />
              <AvatarFallback className="bg-blue-500 text-white">
                {(user.profile?.first_name || "S")[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.profile?.first_name || "Student"}!</h1>
              <p className="text-blue-100">Student ID: {studentData.student_id}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {studentData.department_name}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  Batch {studentData.year_of_admission}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  Semester {studentData.semester}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => router.push("/student/profile")}>
            View Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.attendance_percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {(dashboardStats?.attendance_percentage || 0) >= 75 ? "Good standing" : "Below requirement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edu-Credits</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardStats?.wallet_balance || 0}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hostel Room</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.room_number || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {studentData.hostel_room_id ? "Resident" : "Day Scholar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest updates from your department and college</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${getChannelColor(announcement.channel)}`}
                  >
                    <Bell className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <p className="text-sm">{announcement.content.substring(0, 100)}...</p>
                      <p className="text-xs mt-1">
                        {new Date(announcement.created_at).toLocaleDateString()} • {announcement.channel}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No announcements available</p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={() => router.push("/student/announcements")}
            >
              View All Announcements
            </Button>
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
                onClick={() => router.push("/student/timetable")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Timetable
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/student/attendance")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Check Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/student/wallet")}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Edu-Credits Wallet
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/student/documents")}
              >
                <FileText className="mr-2 h-4 w-4" />
                My Documents
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/student/faculty")}
              >
                <Users className="mr-2 h-4 w-4" />
                Faculty Directory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your classes and activities for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todayClasses.map((classItem, index) => (
                <div key={classItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-2 h-12 rounded ${
                      index % 3 === 0 ? "bg-blue-500" : index % 3 === 1 ? "bg-green-500" : "bg-purple-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-semibold">{classItem.subject_name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                    </p>
                    <p className="text-xs text-gray-500">{classItem.room}</p>
                    <p className="text-xs text-gray-500">{classItem.faculty_name}</p>
                  </div>
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
    </div>
  )
}
