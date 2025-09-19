"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserCheck, Save } from "lucide-react"

const mockClasses = [
  { id: 1, name: "Data Structures & Algorithms", code: "CS301", students: 45 },
  { id: 2, name: "Database Management Systems", code: "CS401", students: 38 },
]

const mockStudents = [
  { id: "STU2024001", name: "John Doe", rollNo: "CS001" },
  { id: "STU2024002", name: "Sarah Johnson", rollNo: "CS002" },
  { id: "STU2024003", name: "Michael Brown", rollNo: "CS003" },
]

export default function MarkAttendance() {
  const [selectedClass, setSelectedClass] = useState("")
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance((prev) => ({ ...prev, [studentId]: present }))
  }

  const handleSubmit = () => {
    if (!selectedClass) {
      alert("Please select a class first")
      return
    }

    console.log("[v0] Attendance submitted:", { class: selectedClass, attendance })
    alert("Attendance marked successfully!")
    setAttendance({})
  }

  return (
    <AccessControl allowedRoles={["faculty"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="faculty" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
                <p className="text-muted-foreground">Mark attendance for your assigned classes</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Class</CardTitle>
                <CardDescription>Choose the class to mark attendance for</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.code}>
                        {cls.name} ({cls.code}) - {cls.students} students
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedClass && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>Mark present/absent for each student</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.rollNo} • {student.id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={student.id}
                            checked={attendance[student.id] || false}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, checked as boolean)}
                          />
                          <label htmlFor={student.id} className="text-sm font-medium">
                            Present
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleSubmit} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
