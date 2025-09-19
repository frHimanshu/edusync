"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Plus, Edit, Phone, Mail, Building } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

export default function ResidentsPage() {
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("hostel")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRoom, setFilterRoom] = useState("all")

  const residents = [
    {
      id: "STU001",
      name: "John Doe",
      email: "john.doe@university.edu",
      phone: "+1 234-567-8901",
      room: "R101",
      floor: 1,
      checkIn: "2024-08-15",
      status: "active",
      course: "Computer Science",
      year: "3rd Year",
    },
    {
      id: "STU002",
      name: "Mike Smith",
      email: "mike.smith@university.edu",
      phone: "+1 234-567-8902",
      room: "R101",
      floor: 1,
      checkIn: "2024-08-15",
      status: "active",
      course: "Engineering",
      year: "2nd Year",
    },
    {
      id: "STU003",
      name: "Sarah Wilson",
      email: "sarah.wilson@university.edu",
      phone: "+1 234-567-8903",
      room: "R102",
      floor: 1,
      checkIn: "2024-08-20",
      status: "active",
      course: "Business",
      year: "1st Year",
    },
    {
      id: "STU004",
      name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      phone: "+1 234-567-8904",
      room: "R201",
      floor: 2,
      checkIn: "2024-08-10",
      status: "active",
      course: "Medicine",
      year: "4th Year",
    },
    {
      id: "STU005",
      name: "Chris Brown",
      email: "chris.brown@university.edu",
      phone: "+1 234-567-8905",
      room: "R201",
      floor: 2,
      checkIn: "2024-08-12",
      status: "active",
      course: "Law",
      year: "2nd Year",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoom = filterRoom === "all" || resident.room === filterRoom
    return matchesSearch && matchesRoom
  })

  const uniqueRooms = [...new Set(residents.map((r) => r.room))].sort()

  return (
    <AccessControl userType={userType} allowedRoles={["hostel"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Residents Management</h1>
            <p className="text-muted-foreground">Manage hostel residents and their information</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Resident
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRoom} onValueChange={setFilterRoom}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {uniqueRooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResidents.map((resident) => (
                <Card key={resident.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${resident.name}`} />
                        <AvatarFallback>
                          {resident.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resident.name}</CardTitle>
                        <CardDescription>{resident.id}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(resident.status)}>{resident.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Room {resident.room} (Floor {resident.floor})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{resident.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{resident.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Course:</span> {resident.course}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Year:</span> {resident.year}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Check-in:</span> {new Date(resident.checkIn).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Users className="mr-2 h-3 w-3" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Residents List</CardTitle>
                <CardDescription>Detailed table view of all residents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Resident</th>
                        <th className="text-left p-2">Room</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Course</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResidents.map((resident) => (
                        <tr key={resident.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/abstract-geometric-shapes.png?height=32&width=32&query=${resident.name}`}
                                />
                                <AvatarFallback className="text-xs">
                                  {resident.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{resident.name}</p>
                                <p className="text-sm text-muted-foreground">{resident.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <p className="font-medium">{resident.room}</p>
                            <p className="text-sm text-muted-foreground">Floor {resident.floor}</p>
                          </td>
                          <td className="p-2">
                            <p className="text-sm">{resident.email}</p>
                            <p className="text-sm text-muted-foreground">{resident.phone}</p>
                          </td>
                          <td className="p-2">
                            <p className="text-sm">{resident.course}</p>
                            <p className="text-sm text-muted-foreground">{resident.year}</p>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusColor(resident.status)}>{resident.status}</Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Users className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AccessControl>
  )
}
