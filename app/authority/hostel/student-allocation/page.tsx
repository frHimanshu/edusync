"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Plus, UserCheck, Home, Calendar } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    department: "Computer Science",
    year: "4th Year",
    currentRoom: "A-101",
    allocationDate: "2024-01-15",
    status: "Allocated",
    preferences: ["AC", "WiFi"],
  },
  {
    id: "STU2024002",
    name: "Sarah Johnson",
    department: "Electronics",
    year: "3rd Year",
    currentRoom: "B-205",
    allocationDate: "2024-01-16",
    status: "Allocated",
    preferences: ["Attached Bathroom"],
  },
  {
    id: "STU2024003",
    name: "Michael Brown",
    department: "Mechanical",
    year: "2nd Year",
    currentRoom: null,
    allocationDate: null,
    status: "Pending",
    preferences: ["AC", "Balcony"],
  },
]

const mockAvailableRooms = [
  { id: "A-102", block: "Block A", capacity: 2, currentOccupancy: 1, type: "Double" },
  { id: "C-301", block: "Block C", capacity: 2, currentOccupancy: 0, type: "Double" },
  { id: "B-103", block: "Block B", capacity: 3, currentOccupancy: 2, type: "Triple" },
]

export default function StudentAllocation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [students] = useState(mockStudents)
  const [availableRooms] = useState(mockAvailableRooms)

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || student.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Allocated":
        return "default"
      case "Pending":
        return "secondary"
      case "Rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hostel" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Student Allocation</h1>
                  <p className="text-muted-foreground">Manage student room assignments and allocations</p>
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Allocation
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Allocated">Allocated</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Allocations</CardTitle>
                <CardDescription>{filteredStudents.length} students found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-balance">{student.name}</h3>
                              <Badge variant="outline">{student.id}</Badge>
                              <Badge variant={getStatusColor(student.status) as any}>{student.status}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p>{student.department} • {student.year}</p>
                                {student.currentRoom && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Home className="h-4 w-4" />
                                    <span>Room {student.currentRoom}</span>
                                  </div>
                                )}
                                {student.allocationDate && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Allocated: {student.allocationDate}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium mb-1">Preferences:</p>
                                <div className="flex flex-wrap gap-1">
                                  {student.preferences.map((preference, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {preference}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {student.status === "Pending" && (
                          <Button variant="outline" size="sm">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Home className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
                <CardDescription>Rooms available for new allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableRooms.map((room) => (
                    <div key={room.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Room {room.id}</h3>
                        <Badge variant="default">{room.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{room.block}</p>
                        <p>Capacity: {room.currentOccupancy}/{room.capacity}</p>
                        <p className="text-green-600 font-medium">
                          {room.capacity - room.currentOccupancy} spots available
                        </p>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        Allocate Student
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
