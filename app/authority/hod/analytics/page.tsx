"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, Users, BookOpen, Award, Calendar, BarChart3, PieChart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DepartmentStats {
  totalStudents: number
  totalFaculty: number
  totalCourses: number
  averageAttendance: number
  averageGPA: number
  graduationRate: number
  placementRate: number
}

interface AttendanceTrend {
  month: string
  attendance: number
}

interface GPADistribution {
  range: string
  count: number
  percentage: number
}

interface FacultyPerformance {
  id: string
  name: string
  courses: number
  students: number
  averageRating: number
  attendanceRate: number
}

const TIME_PERIODS = [
  { value: "current", label: "Current Semester" },
  { value: "last", label: "Last Semester" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" }
]

export default function HODAnalytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [stats, setStats] = useState<DepartmentStats | null>(null)
  const [attendanceTrend, setAttendanceTrend] = useState<AttendanceTrend[]>([])
  const [gpaDistribution, setGpaDistribution] = useState<GPADistribution[]>([])
  const [facultyPerformance, setFacultyPerformance] = useState<FacultyPerformance[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo - in real implementation, this would fetch from database
        const mockStats: DepartmentStats = {
          totalStudents: 450,
          totalFaculty: 12,
          totalCourses: 24,
          averageAttendance: 87.5,
          averageGPA: 3.2,
          graduationRate: 94.2,
          placementRate: 88.7
        }

        const mockAttendanceTrend: AttendanceTrend[] = [
          { month: "Jan", attendance: 85.2 },
          { month: "Feb", attendance: 87.1 },
          { month: "Mar", attendance: 89.3 },
          { month: "Apr", attendance: 86.8 },
          { month: "May", attendance: 88.5 },
          { month: "Jun", attendance: 90.1 }
        ]

        const mockGpaDistribution: GPADistribution[] = [
          { range: "3.5-4.0", count: 120, percentage: 26.7 },
          { range: "3.0-3.5", count: 180, percentage: 40.0 },
          { range: "2.5-3.0", count: 100, percentage: 22.2 },
          { range: "2.0-2.5", count: 40, percentage: 8.9 },
          { range: "Below 2.0", count: 10, percentage: 2.2 }
        ]

        const mockFacultyPerformance: FacultyPerformance[] = [
          {
            id: "faculty1",
            name: "Dr. John Smith",
            courses: 4,
            students: 120,
            averageRating: 4.5,
            attendanceRate: 92.3
          },
          {
            id: "faculty2",
            name: "Dr. Sarah Johnson",
            courses: 3,
            students: 90,
            averageRating: 4.3,
            attendanceRate: 89.7
          },
          {
            id: "faculty3",
            name: "Dr. Michael Brown",
            courses: 2,
            students: 60,
            averageRating: 4.1,
            attendanceRate: 87.2
          }
        ]

        setStats(mockStats)
        setAttendanceTrend(mockAttendanceTrend)
        setGpaDistribution(mockGpaDistribution)
        setFacultyPerformance(mockFacultyPerformance)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast.error("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAnalytics()
    }
  }, [user, selectedPeriod])

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) {
      return "text-green-600"
    } else if (current < previous) {
      return "text-red-600"
    }
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-600">Analytics data will appear here once available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into department performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="period">Time Period:</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Average Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Average GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGPA}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.1 from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Placement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.placementRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +3.2% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Attendance Trend
            </CardTitle>
            <CardDescription>Monthly attendance percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceTrend.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${data.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium w-12 text-right">
                    {data.attendance}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GPA Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              GPA Distribution
            </CardTitle>
            <CardDescription>Distribution of student GPAs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gpaDistribution.map((data) => (
                <div key={data.range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-20 text-sm font-medium">{data.range}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium w-16 text-right">
                    {data.count} ({data.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Faculty Performance
          </CardTitle>
          <CardDescription>Performance metrics for faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facultyPerformance.map((faculty) => (
              <div key={faculty.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{faculty.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>{faculty.courses} courses</span>
                    <span>{faculty.students} students</span>
                    <span>Rating: {faculty.averageRating}/5.0</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{faculty.attendanceRate}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Excellent
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Courses offered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Graduation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graduationRate}%</div>
            <p className="text-xs text-muted-foreground">Students graduating on time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
