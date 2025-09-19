"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Bed, Users, Search, Filter, Plus, Edit, Trash2 } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

export default function RoomsPage() {
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("hostel")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const rooms = [
    {
      id: "R101",
      floor: 1,
      capacity: 2,
      occupied: 2,
      status: "occupied",
      type: "double",
      residents: ["John Doe", "Mike Smith"],
    },
    { id: "R102", floor: 1, capacity: 2, occupied: 1, status: "partial", type: "double", residents: ["Sarah Wilson"] },
    { id: "R103", floor: 1, capacity: 1, occupied: 0, status: "vacant", type: "single", residents: [] },
    {
      id: "R201",
      floor: 2,
      capacity: 2,
      occupied: 2,
      status: "occupied",
      type: "double",
      residents: ["Alex Johnson", "Chris Brown"],
    },
    { id: "R202", floor: 2, capacity: 2, occupied: 0, status: "vacant", type: "double", residents: [] },
    {
      id: "R301",
      floor: 3,
      capacity: 4,
      occupied: 3,
      status: "partial",
      type: "quad",
      residents: ["Emma Davis", "Lisa Garcia", "Amy Martinez"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "vacant":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.residents.some((resident) => resident.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === "all" || room.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <AccessControl userType={userType} allowedRoles={["hostel"]}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-muted-foreground">Manage hostel rooms and occupancy</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search rooms or residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="partial">Partially Occupied</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.id}</CardTitle>
                      <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                    </div>
                    <CardDescription>
                      Floor {room.floor} • {room.type} room
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {room.occupied}/{room.capacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{room.residents.length} residents</span>
                      </div>
                    </div>

                    {room.residents.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Residents:</p>
                        <div className="space-y-1">
                          {room.residents.map((resident, index) => (
                            <p key={index} className="text-sm text-muted-foreground">
                              {resident}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Building className="mr-2 h-3 w-3" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Room List</CardTitle>
                <CardDescription>Detailed view of all rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium">{room.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Floor {room.floor} • {room.type}
                          </p>
                        </div>
                        <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {room.occupied}/{room.capacity} occupied
                          </p>
                          <p className="text-sm text-muted-foreground">{room.residents.length} residents</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AccessControl>
  )
}
