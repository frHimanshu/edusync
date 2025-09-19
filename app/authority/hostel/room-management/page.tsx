"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Search, Plus, Edit, Users, Bed } from "lucide-react"

const mockRooms = [
  {
    id: "A-101",
    block: "Block A",
    floor: 1,
    capacity: 2,
    currentOccupancy: 2,
    status: "Occupied",
    type: "Double",
    amenities: ["AC", "WiFi", "Attached Bathroom"],
  },
  {
    id: "A-102",
    block: "Block A",
    floor: 1,
    capacity: 2,
    currentOccupancy: 1,
    status: "Partially Occupied",
    type: "Double",
    amenities: ["AC", "WiFi", "Attached Bathroom"],
  },
  {
    id: "B-205",
    block: "Block B",
    floor: 2,
    capacity: 3,
    currentOccupancy: 3,
    status: "Occupied",
    type: "Triple",
    amenities: ["WiFi", "Attached Bathroom"],
  },
  {
    id: "C-301",
    block: "Block C",
    floor: 3,
    capacity: 2,
    currentOccupancy: 0,
    status: "Available",
    type: "Double",
    amenities: ["AC", "WiFi", "Attached Bathroom", "Balcony"],
  },
]

export default function RoomManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBlock, setFilterBlock] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [rooms] = useState(mockRooms)

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.block.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBlock = filterBlock === "all" || room.block === filterBlock
    const matchesStatus = filterStatus === "all" || room.status === filterStatus

    return matchesSearch && matchesBlock && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "default"
      case "Partially Occupied":
        return "secondary"
      case "Occupied":
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
                <Home className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
                  <p className="text-muted-foreground">Manage hostel rooms, capacity, and amenities</p>
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Room
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by room ID or block..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterBlock} onValueChange={setFilterBlock}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      <SelectItem value="Block A">Block A</SelectItem>
                      <SelectItem value="Block B">Block B</SelectItem>
                      <SelectItem value="Block C">Block C</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Partially Occupied">Partially Occupied</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Inventory</CardTitle>
                <CardDescription>{filteredRooms.length} rooms found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-balance">Room {room.id}</h3>
                              <Badge variant={getStatusColor(room.status) as any}>{room.status}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p>{room.block} • Floor {room.floor}</p>
                                <p>Type: {room.type}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Users className="h-4 w-4" />
                                  <span>{room.currentOccupancy}/{room.capacity} occupied</span>
                                </div>
                              </div>
                              <div>
                                <p className="font-medium mb-1">Amenities:</p>
                                <div className="flex flex-wrap gap-1">
                                  {room.amenities.map((amenity, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
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
