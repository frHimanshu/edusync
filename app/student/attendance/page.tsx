"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AttendanceRecord {
  id: string
  subject_id: string
  subject_name: string
  subject_code: string
  date: string
  status: 'present' | 'absent' | 'late'
  remarks?: string
  faculty_name: string
}

interface SubjectAttendance {
  subject_id: string
  subject_name: string
  subject_code: string
  total_classes: number
  present_classes: number
  absent_classes: number
  late_classes: number
  attendance_percentage: number
}

interface AttendanceStats {
  overall_percentage: number
  total_classes: number
  present_classes: number
  absent_classes: number
  late_classes: number
  subjects_count: number
}

export default function StudentAttendance() {
  const { user } = useAuth()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Get attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select(`
            *,
            subjects(name, code),
            faculty!attendance_faculty_id_fkey(first_name, last_name)
          `)
          .eq("student_id", user.id)
          .order("date", { ascending: false })

        if (attendanceError) {
          console.error("Error fetching attendance:", attendanceError)
          return
        }

        if (attendanceData) {
          const formattedRecords = attendanceData.map(record => ({
            id: record.id,
            subject_id: record.subject_id,
            subject_name: record.subjects?.name || "Unknown Subject",
            subject_code: record.subjects?.code || "",
            date: record.date,
            status: record.status,
            remarks: record.remarks,
            faculty_name: record.faculty ? 
              `${record.faculty.first_name} ${record.faculty.last_name}` : 
              "Unknown Faculty"
          }))

          setAttendanceRecords(formattedRecords)

          // Calculate subject-wise attendance
          const subjectMap = new Map<string, SubjectAttendance>()
          
          formattedRecords.forEach(record => {
            const key = record.subject_id
            if (!subjectMap.has(key)) {
              subjectMap.set(key, {
                subject_id: record.subject_id,
                subject_name: record.subject_name,
                subject_code: record.subject_code,
                total_classes: 0,
                present_classes: 0,
                absent_classes: 0,
                late_classes: 0,
                attendance_percentage: 0
              })
            }

            const subject = subjectMap.get(key)!
            subject.total_classes++
            
            switch (record.status) {
              case 'present':
                subject.present_classes++
                break
              case 'absent':
                subject.absent_classes++
                break
              case 'late':
                subject.late_classes++
                break
            }
          })

          // Calculate percentages
          const subjectAttendanceArray = Array.from(subjectMap.values()).map(subject => ({
            ...subject,
            attendance_percentage: subject.total_classes > 0 ? 
              Math.round(((subject.present_classes + subject.late_classes * 0.5) / subject.total_classes) * 100) : 0
          }))

          setSubjectAttendance(subjectAttendanceArray)

          // Calculate overall stats
          const totalClasses = formattedRecords.length
          const presentClasses = formattedRecords.filter(r => r.status === 'present').length
          const absentClasses = formattedRecords.filter(r => r.status === 'absent').length
          const lateClasses = formattedRecords.filter(r => r.status === 'late').length
          const overallPercentage = totalClasses > 0 ? 
            Math.round(((presentClasses + lateClasses * 0.5) / totalClasses) * 100) : 0

          setAttendanceStats({
            overall_percentage: overallPercentage,
            total_classes: totalClasses,
            present_classes: presentClasses,
            absent_classes: absentClasses,
            late_classes: lateClasses,
            subjects_count: subjectAttendanceArray.length
          })
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAttendanceData()
    }
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredRecords = attendanceRecords.filter(record => {
    const subjectMatch = selectedSubject === "all" || record.subject_id === selectedSubject
    const monthMatch = selectedMonth === "all" || 
      new Date(record.date).getMonth() === parseInt(selectedMonth)
    return subjectMatch && monthMatch
  })

  const uniqueSubjects = Array.from(new Set(attendanceRecords.map(r => r.subject_id)))
    .map(id => {
      const record = attendanceRecords.find(r => r.subject_id === id)
      return {
        id,
        name: record?.subject_name || "Unknown",
        code: record?.subject_code || ""
      }
    })

  const months = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" }
  ]

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
      <div>
        <h1 className="text-3xl font-bold">Attendance Records</h1>
        <p className="text-gray-600">Track your class attendance and performance</p>
      </div>

      {/* Overall Stats */}
      {attendanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPercentageColor(attendanceStats.overall_percentage)}`}>
                {attendanceStats.overall_percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats.overall_percentage >= 75 ? "Good standing" : "Below requirement"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.total_classes}</div>
              <p className="text-xs text-muted-foreground">Classes attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present_classes}</div>
              <p className="text-xs text-muted-foreground">On time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent_classes}</div>
              <p className="text-xs text-muted-foreground">Missed classes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Subject-wise Attendance
          </CardTitle>
          <CardDescription>Your attendance percentage for each subject</CardDescription>
                </CardHeader>
                <CardContent>
          {subjectAttendance.length > 0 ? (
                  <div className="space-y-4">
              {subjectAttendance.map((subject) => (
                <div key={subject.subject_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{subject.subject_name}</h4>
                    <p className="text-sm text-gray-600">{subject.subject_code}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Total: {subject.total_classes}</span>
                      <span className="text-green-600">Present: {subject.present_classes}</span>
                      <span className="text-yellow-600">Late: {subject.late_classes}</span>
                      <span className="text-red-600">Absent: {subject.absent_classes}</span>
                    </div>
                    </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getPercentageColor(subject.attendance_percentage)}`}>
                      {subject.attendance_percentage}%
                    </div>
                    <Badge className={subject.attendance_percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {subject.attendance_percentage >= 75 ? 'Good' : 'Low'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found</p>
            </div>
          )}
                </CardContent>
              </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Filter by Subject</label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Filter by Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>

      {/* Attendance Records */}
      <Card>
          <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Attendance Records
          </CardTitle>
          <CardDescription>Detailed attendance history</CardDescription>
          </CardHeader>
          <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <h4 className="font-medium">{record.subject_name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(record.date)} • {record.faculty_name}
                      </p>
                      {record.remarks && (
                        <p className="text-xs text-gray-500 mt-1">{record.remarks}</p>
                      )}
                </div>
              </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              ))}
              </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Attendance Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Minimum 75% attendance is required to be eligible for examinations</li>
            <li>• Late attendance is counted as 0.5 present (half day)</li>
            <li>• Medical certificates can be submitted for excused absences</li>
            <li>• Attendance is marked by faculty members during class hours</li>
            <li>• Contact your faculty or HOD for any attendance-related queries</li>
          </ul>
          </CardContent>
        </Card>
    </div>
  )
}