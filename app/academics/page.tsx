"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { AccessControl } from "@/components/auth/access-control"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, FileText, GraduationCap, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

// Mock academic data
const mockAcademicData = {
  currentSemester: {
    semester: "6th Semester",
    subjects: [
      {
        code: "CS601",
        name: "Machine Learning",
        credits: 4,
        instructor: "Dr. Smith",
        attendance: 88,
        grade: "A",
        status: "ongoing",
      },
      {
        code: "CS602",
        name: "Database Systems",
        credits: 3,
        instructor: "Prof. Johnson",
        attendance: 92,
        grade: "A+",
        status: "ongoing",
      },
      {
        code: "CS603",
        name: "Software Engineering",
        credits: 4,
        instructor: "Dr. Brown",
        attendance: 85,
        grade: "B+",
        status: "ongoing",
      },
      {
        code: "CS604",
        name: "Computer Networks",
        credits: 3,
        instructor: "Prof. Davis",
        attendance: 90,
        grade: "A",
        status: "ongoing",
      },
      {
        code: "CS605",
        name: "Web Technologies",
        credits: 3,
        instructor: "Dr. Wilson",
        attendance: 95,
        grade: "A+",
        status: "ongoing",
      },
    ],
  },
  assignments: [
    {
      id: 1,
      subject: "Machine Learning",
      title: "Linear Regression Project",
      dueDate: "2024-03-20",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      subject: "Database Systems",
      title: "ER Diagram Assignment",
      dueDate: "2024-03-18",
      status: "submitted",
      priority: "medium",
    },
    {
      id: 3,
      subject: "Software Engineering",
      title: "UML Design Document",
      dueDate: "2024-03-25",
      status: "pending",
      priority: "medium",
    },
    {
      id: 4,
      subject: "Web Technologies",
      title: "React Application",
      dueDate: "2024-03-22",
      status: "in-progress",
      priority: "high",
    },
  ],
  examSchedule: [
    { subject: "Machine Learning", type: "Mid-term", date: "2024-03-15", time: "10:00 AM", room: "Hall A" },
    { subject: "Database Systems", type: "Mid-term", date: "2024-03-16", time: "2:00 PM", room: "Hall B" },
    { subject: "Software Engineering", type: "Mid-term", date: "2024-03-18", time: "10:00 AM", room: "Hall C" },
    { subject: "Computer Networks", type: "Mid-term", date: "2024-03-19", time: "2:00 PM", room: "Hall A" },
  ],
  timetable: [
    {
      day: "Monday",
      slots: [
        { time: "9:00-10:00", subject: "Machine Learning", room: "CS-101", type: "lecture" },
        { time: "10:00-11:00", subject: "Database Systems", room: "CS-102", type: "lecture" },
        { time: "11:00-12:00", subject: "Break", room: "", type: "break" },
        { time: "12:00-1:00", subject: "Software Engineering", room: "CS-103", type: "lab" },
      ],
    },
    {
      day: "Tuesday",
      slots: [
        { time: "9:00-10:00", subject: "Computer Networks", room: "CS-104", type: "lecture" },
        { time: "10:00-11:00", subject: "Web Technologies", room: "CS-105", type: "lecture" },
        { time: "11:00-12:00", subject: "Break", room: "", type: "break" },
        { time: "12:00-1:00", subject: "Machine Learning", room: "CS-Lab1", type: "lab" },
      ],
    },
  ],
  gradeHistory: [
    { semester: "5th Semester", gpa: 8.7, credits: 20, status: "completed" },
    { semester: "4th Semester", gpa: 8.5, credits: 22, status: "completed" },
    { semester: "3rd Semester", gpa: 8.2, credits: 21, status: "completed" },
    { semester: "2nd Semester", gpa: 8.0, credits: 20, status: "completed" },
  ],
}

export default function Academics() {
  const [academicData] = useState(mockAcademicData)
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("student")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "submitted":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getOverallAttendance = () => {
    const total = academicData.currentSemester.subjects.reduce((sum, subject) => sum + subject.attendance, 0)
    return Math.round(total / academicData.currentSemester.subjects.length)
  }

  const getTotalCredits = () => {
    return academicData.currentSemester.subjects.reduce((sum, subject) => sum + subject.credits, 0)
  }

  return (
    <AccessControl userType={userType} allowedRoles={["student", "teacher", "admin"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Academic Management</h1>
              <p className="text-muted-foreground mt-1">Track your academic progress, assignments, and schedule</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{academicData.currentSemester.semester}</div>
                  <p className="text-xs text-muted-foreground">{getTotalCredits()} Credits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{getOverallAttendance()}%</div>
                  <Progress value={getOverallAttendance()} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {academicData.assignments.filter((a) => a.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Due this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{academicData.examSchedule.length}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="subjects" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="timetable">Timetable</TabsTrigger>
                <TabsTrigger value="exams">Exams</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
              </TabsList>

              <TabsContent value="subjects">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Semester Subjects</CardTitle>
                    <CardDescription>Your enrolled subjects and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {academicData.currentSemester.subjects.map((subject) => (
                          <TableRow key={subject.code}>
                            <TableCell className="font-medium">{subject.code}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell>{subject.credits}</TableCell>
                            <TableCell>{subject.instructor}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{subject.attendance}%</span>
                                <Progress value={subject.attendance} className="w-16" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{subject.grade}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>Track your assignment submissions and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {academicData.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {assignment.status === "submitted" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : assignment.status === "pending" ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-muted-foreground">{assignment.subject}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">Due: {assignment.dueDate}</div>
                              <div className="flex gap-2">
                                <Badge variant={getStatusColor(assignment.status) as any}>{assignment.status}</Badge>
                                <Badge variant={getPriorityColor(assignment.priority) as any}>
                                  {assignment.priority}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              {assignment.status === "submitted" ? "View" : "Submit"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timetable">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Timetable</CardTitle>
                    <CardDescription>Your class schedule for the current semester</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {academicData.timetable.map((day) => (
                        <div key={day.day}>
                          <h3 className="font-semibold text-lg mb-3">{day.day}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {day.slots.map((slot, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  slot.type === "break"
                                    ? "bg-muted/50 border-muted"
                                    : slot.type === "lab"
                                      ? "bg-accent/10 border-accent"
                                      : "bg-card border-border"
                                }`}
                              >
                                <div className="font-medium text-sm">{slot.time}</div>
                                <div className="font-semibold">{slot.subject}</div>
                                {slot.room && <div className="text-sm text-muted-foreground">{slot.room}</div>}
                                {slot.type !== "break" && (
                                  <Badge variant="outline" className="mt-1">
                                    {slot.type}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exams">
                <Card>
                  <CardHeader>
                    <CardTitle>Exam Schedule</CardTitle>
                    <CardDescription>Upcoming examinations and important dates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Exam Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {academicData.examSchedule.map((exam, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{exam.subject}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{exam.type}</Badge>
                            </TableCell>
                            <TableCell>{exam.date}</TableCell>
                            <TableCell>{exam.time}</TableCell>
                            <TableCell>{exam.room}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Add to Calendar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grades">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade History</CardTitle>
                    <CardDescription>Your academic performance over previous semesters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {academicData.gradeHistory.map((semester, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{semester.semester}</div>
                              <div className="text-sm text-muted-foreground">{semester.credits} Credits</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{semester.gpa}</div>
                              <div className="text-sm text-muted-foreground">GPA</div>
                            </div>
                            <Badge variant="secondary">{semester.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
