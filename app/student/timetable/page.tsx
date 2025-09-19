"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"

const mockTimetableData = {
  Monday: [
    { time: "9:00 AM - 10:00 AM", subject: "Data Structures", room: "Room 301, Block A", type: "Lecture" },
    { time: "10:00 AM - 11:00 AM", subject: "Computer Networks", room: "Room 205, Block B", type: "Lecture" },
    { time: "11:30 AM - 12:30 PM", subject: "Database Management", room: "Lab 1, Block C", type: "Lab" },
    { time: "2:00 PM - 3:00 PM", subject: "Software Engineering", room: "Room 401, Block A", type: "Lecture" },
  ],
  Tuesday: [
    { time: "9:00 AM - 10:00 AM", subject: "Operating Systems", room: "Room 302, Block A", type: "Lecture" },
    { time: "10:00 AM - 11:00 AM", subject: "Web Technologies", room: "Lab 2, Block C", type: "Lab" },
    { time: "11:30 AM - 12:30 PM", subject: "Data Structures", room: "Lab 1, Block C", type: "Lab" },
    { time: "2:00 PM - 3:00 PM", subject: "Computer Networks", room: "Room 205, Block B", type: "Tutorial" },
  ],
  Wednesday: [
    { time: "9:00 AM - 10:00 AM", subject: "Database Management", room: "Room 303, Block A", type: "Lecture" },
    { time: "10:00 AM - 11:00 AM", subject: "Software Engineering", room: "Room 401, Block A", type: "Tutorial" },
    { time: "11:30 AM - 12:30 PM", subject: "Operating Systems", room: "Lab 3, Block C", type: "Lab" },
    { time: "2:00 PM - 3:00 PM", subject: "Web Technologies", room: "Room 501, Block B", type: "Lecture" },
  ],
  Thursday: [
    { time: "9:00 AM - 10:00 AM", subject: "Data Structures", room: "Room 301, Block A", type: "Tutorial" },
    { time: "10:00 AM - 11:00 AM", subject: "Computer Networks", room: "Lab 2, Block C", type: "Lab" },
    { time: "11:30 AM - 12:30 PM", subject: "Database Management", room: "Room 303, Block A", type: "Lecture" },
    { time: "2:00 PM - 3:00 PM", subject: "Software Engineering", room: "Room 401, Block A", type: "Lecture" },
  ],
  Friday: [
    { time: "9:00 AM - 10:00 AM", subject: "Operating Systems", room: "Room 302, Block A", type: "Lecture" },
    { time: "10:00 AM - 11:00 AM", subject: "Web Technologies", room: "Room 501, Block B", type: "Lecture" },
    { time: "11:30 AM - 12:30 PM", subject: "Project Work", room: "Lab 4, Block C", type: "Project" },
    { time: "2:00 PM - 3:00 PM", subject: "Seminar", room: "Auditorium", type: "Seminar" },
  ],
  Saturday: [
    { time: "9:00 AM - 10:00 AM", subject: "Extra Classes", room: "Room 201, Block A", type: "Extra" },
    { time: "10:00 AM - 11:00 AM", subject: "Library Session", room: "Central Library", type: "Study" },
  ],
}

export default function TimetablePage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel">("student")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as "student" | "teacher" | "admin" | "hostel"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lecture":
        return "default"
      case "Lab":
        return "secondary"
      case "Tutorial":
        return "outline"
      case "Project":
        return "destructive"
      case "Seminar":
        return "default"
      default:
        return "outline"
    }
  }

  const days = Object.keys(mockTimetableData) as Array<keyof typeof mockTimetableData>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground mt-1">Your weekly class schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {days.map((day) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {day}
                </CardTitle>
                <CardDescription>{mockTimetableData[day].length} classes scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTimetableData[day].map((classItem, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{classItem.subject}</div>
                        <Badge variant={getTypeColor(classItem.type) as any} className="text-xs">
                          {classItem.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{classItem.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Overview of your weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{Object.values(mockTimetableData).flat().length}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {
                    Object.values(mockTimetableData)
                      .flat()
                      .filter((c) => c.type === "Lecture").length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Lectures</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {
                    Object.values(mockTimetableData)
                      .flat()
                      .filter((c) => c.type === "Lab").length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Lab Sessions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {
                    Object.values(mockTimetableData)
                      .flat()
                      .filter((c) => c.type === "Tutorial").length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Tutorials</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
