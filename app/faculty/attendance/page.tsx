"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  department_name: string
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  department_name: string
  semester: number
}

interface AttendanceRecord {
  student_id: string
  status: 'present' | 'absent' | 'late'
  remarks?: string
}

interface TimetableEntry {
  id: string
  subject_id: string
  subject_name: string
  subject_code: string
  start_time: string
  end_time: string
  room_number: string
  day_of_week: number
}

export default function FacultyAttendance() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({})
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bulkMarkOpen, setBulkMarkOpen] = useState(false)
  const [bulkStatus, setBulkStatus] = useState<'present' | 'absent' | 'late'>('present')

  useEffect(() => {
    const fetchFacultyData = async () => {
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

        // Fetch timetable
        const { data: timetableData, error: timetableError } = await supabase
          .from("timetable")
          .select(`
            *,
            subjects(name, code)
          `)
          .eq("faculty_id", user.id)

        if (timetableData) {
          const formattedTimetable = timetableData.map(entry => ({
            id: entry.id,
            subject_id: entry.subject_id,
            subject_name: entry.subjects?.name || "Unknown",
            subject_code: entry.subjects?.code || "",
            start_time: entry.start_time,
            end_time: entry.end_time,
            room_number: entry.room_number,
            day_of_week: entry.day_of_week
          }))
          setTimetable(formattedTimetable)
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error)
        toast.error("Failed to load faculty data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchFacultyData()
    }
  }, [user])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSubject) {
        setStudents([])
        return
      }

      try {
        const supabase = createClient()

        // Get the subject details to find students in the same department and semester
        const subject = subjects.find(s => s.id === selectedSubject)
        if (!subject) return

        // Fetch students in the same department and semester
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(`
            *,
            departments(name)
          `)
          .eq("department_id", subject.department_id || "")
          .eq("semester", subject.semester)

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
            department_name: student.departments?.name || "Unknown",
            semester: student.semester
          }))
          setStudents(formattedStudents)

          // Initialize attendance records
          const initialRecords: Record<string, AttendanceRecord> = {}
          formattedStudents.forEach(student => {
            initialRecords[student.id] = {
              student_id: student.id,
              status: 'present',
              remarks: ''
            }
          })
          setAttendanceRecords(initialRecords)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("Failed to load students")
      }
    }

    if (selectedSubject) {
      fetchStudents()
    }
  }, [selectedSubject, subjects])

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }))
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }))
  }

  const handleBulkMark = () => {
    const updatedRecords = { ...attendanceRecords }
    students.forEach(student => {
      updatedRecords[student.id] = {
        ...updatedRecords[student.id],
        status: bulkStatus
      }
    })
    setAttendanceRecords(updatedRecords)
    setBulkMarkOpen(false)
    toast.success(`Marked all students as ${bulkStatus}`)
  }

  const handleSaveAttendance = async () => {
    if (!selectedSubject || !selectedDate) {
      toast.error("Please select subject and date")
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()

      // Check if attendance already exists for this date and subject
      const { data: existingAttendance } = await supabase
        .from("attendance")
        .select("id")
        .eq("subject_id", selectedSubject)
        .eq("date", selectedDate)

      if (existingAttendance && existingAttendance.length > 0) {
        toast.error("Attendance already marked for this date and subject")
        setSaving(false)
        return
      }

      // Prepare attendance records
      const attendanceData = Object.values(attendanceRecords).map(record => ({
        student_id: record.student_id,
        subject_id: selectedSubject,
        faculty_id: user.id,
        date: selectedDate,
        status: record.status,
        remarks: record.remarks || null
      }))

      // Insert attendance records
      const { error } = await supabase
        .from("attendance")
        .insert(attendanceData)

      if (error) {
        throw error
      }

      toast.success("Attendance saved successfully")
      
      // Reset form
      setSelectedSubject("")
      setSelectedDate(new Date().toISOString().split('T')[0])
      setStudents([])
      setAttendanceRecords({})
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error("Failed to save attendance")
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
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

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`)
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const todayClasses = timetable.filter(entry => {
    const today = new Date().getDay()
    return entry.day_of_week === today
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
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-gray-600">Record student attendance for your classes</p>
        </div>

      {/* Today's Classes */}
      {todayClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your scheduled classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{classItem.subject_name}</h4>
                  <p className="text-sm text-gray-600">{classItem.subject_code}</p>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <span>Room: {classItem.room_number}</span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => setSelectedSubject(classItem.subject_id)}
                  >
                    Mark Attendance
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Attendance Form
          </CardTitle>
          <CardDescription>Select subject and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Dialog open={bulkMarkOpen} onOpenChange={setBulkMarkOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={students.length === 0}>
                    Bulk Mark
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Mark Attendance</DialogTitle>
                    <DialogDescription>
                      Mark all students with the same status
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={bulkStatus} onValueChange={(value: 'present' | 'absent' | 'late') => setBulkStatus(value)}>
                  <SelectTrigger>
                          <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setBulkMarkOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBulkMark}>
                        Apply to All
                      </Button>
                </div>
              </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {students.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Students ({students.length})
                </h3>
                <Button
                  onClick={handleSaveAttendance}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Attendance"}
                    </Button>
                  </div>

                <div className="space-y-3">
                  {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                      <h4 className="font-medium">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {student.student_id} • {student.department_name} • Sem {student.semester}
                      </p>
                      </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={attendanceRecords[student.id]?.status === 'present' ? 'default' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={attendanceRecords[student.id]?.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendanceRecords[student.id]?.status === 'late' ? 'default' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'late')}
                        className={attendanceRecords[student.id]?.status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant={attendanceRecords[student.id]?.status === 'absent' ? 'default' : 'outline'}
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={attendanceRecords[student.id]?.status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Absent
                      </Button>
                    </div>

                    <div className="w-48">
                      <Textarea
                        placeholder="Remarks (optional)"
                        value={attendanceRecords[student.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="min-h-[60px]"
                      />
                </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSubject && students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students found for this subject</p>
              <p className="text-sm">Students will appear here once you select a subject</p>
            </div>
          )}

          {!selectedSubject && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a subject to mark attendance</p>
                </div>
          )}
              </CardContent>
            </Card>
    </div>
  )
}