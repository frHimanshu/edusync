"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Building, Users, Bed, Search, RefreshCw, Download, Eye, UserPlus, UserMinus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AccessControl } from "@/components/auth/access-control"

// Enhanced room data with more details
const mockRoomData = [
  // Ground Floor (G)
  {
    floor: "G",
    roomNumber: "G-101",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "John Doe",
        id: "STU001",
        course: "Computer Science",
        semester: "6th",
        phone: "+91 9876543210",
        joinDate: "2024-01-15",
      },
      {
        name: "Mike Smith",
        id: "STU002",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543211",
        joinDate: "2024-01-15",
      },
    ],
  },
  {
    floor: "G",
    roomNumber: "G-102",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Sarah Johnson",
        id: "STU003",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543212",
        joinDate: "2024-02-01",
      },
    ],
  },
  { floor: "G", roomNumber: "G-103", status: "empty", capacity: 2, occupants: [] },
  {
    floor: "G",
    roomNumber: "G-104",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Alex Brown",
        id: "STU004",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543213",
        joinDate: "2024-01-20",
      },
      {
        name: "Chris Wilson",
        id: "STU005",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543214",
        joinDate: "2024-01-20",
      },
    ],
  },
  {
    floor: "G",
    roomNumber: "G-105",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Emma Davis",
        id: "STU006",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543215",
        joinDate: "2024-02-10",
      },
    ],
  },
  {
    floor: "G",
    roomNumber: "G-106",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Ryan Miller",
        id: "STU007",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543216",
        joinDate: "2024-01-25",
      },
      {
        name: "Jake Taylor",
        id: "STU008",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543217",
        joinDate: "2024-01-25",
      },
    ],
  },
  { floor: "G", roomNumber: "G-107", status: "empty", capacity: 2, occupants: [] },
  {
    floor: "G",
    roomNumber: "G-108",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Tom Anderson",
        id: "STU009",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543218",
        joinDate: "2024-02-05",
      },
      {
        name: "Ben Clark",
        id: "STU010",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543219",
        joinDate: "2024-02-05",
      },
    ],
  },

  // First Floor (1)
  {
    floor: "1",
    roomNumber: "1-101",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Lisa White",
        id: "STU011",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543220",
        joinDate: "2024-01-30",
      },
      {
        name: "Amy Green",
        id: "STU012",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543221",
        joinDate: "2024-01-30",
      },
    ],
  },
  {
    floor: "1",
    roomNumber: "1-102",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "David Lee",
        id: "STU013",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543222",
        joinDate: "2024-02-15",
      },
      {
        name: "Mark Hall",
        id: "STU014",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543223",
        joinDate: "2024-02-15",
      },
    ],
  },
  {
    floor: "1",
    roomNumber: "1-103",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Kevin Young",
        id: "STU015",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543224",
        joinDate: "2024-02-20",
      },
    ],
  },
  { floor: "1", roomNumber: "1-104", status: "empty", capacity: 2, occupants: [] },
  {
    floor: "1",
    roomNumber: "1-105",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Steve King",
        id: "STU016",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543225",
        joinDate: "2024-01-18",
      },
      {
        name: "Paul Wright",
        id: "STU017",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543226",
        joinDate: "2024-01-18",
      },
    ],
  },
  {
    floor: "1",
    roomNumber: "1-106",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Nina Lopez",
        id: "STU018",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543227",
        joinDate: "2024-02-25",
      },
    ],
  },
  {
    floor: "1",
    roomNumber: "1-107",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Carl Hill",
        id: "STU019",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543228",
        joinDate: "2024-02-08",
      },
      {
        name: "Dan Scott",
        id: "STU020",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543229",
        joinDate: "2024-02-08",
      },
    ],
  },
  { floor: "1", roomNumber: "1-108", status: "empty", capacity: 2, occupants: [] },

  // Second Floor (2)
  {
    floor: "2",
    roomNumber: "2-101",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Grace Adams",
        id: "STU021",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543230",
        joinDate: "2024-01-22",
      },
      {
        name: "Helen Baker",
        id: "STU022",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543231",
        joinDate: "2024-01-22",
      },
    ],
  },
  {
    floor: "2",
    roomNumber: "2-102",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Ian Carter",
        id: "STU023",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543232",
        joinDate: "2024-02-12",
      },
    ],
  },
  {
    floor: "2",
    roomNumber: "2-103",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Jack Evans",
        id: "STU024",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543233",
        joinDate: "2024-01-28",
      },
      {
        name: "Luke Foster",
        id: "STU025",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543234",
        joinDate: "2024-01-28",
      },
    ],
  },
  {
    floor: "2",
    roomNumber: "2-104",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Mia Gray",
        id: "STU026",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543235",
        joinDate: "2024-02-03",
      },
      {
        name: "Nora Hayes",
        id: "STU027",
        course: "Mechanical",
        semester: "4th",
        phone: "+91 9876543236",
        joinDate: "2024-02-03",
      },
    ],
  },
  { floor: "2", roomNumber: "2-105", status: "empty", capacity: 2, occupants: [] },
  {
    floor: "2",
    roomNumber: "2-106",
    status: "partial",
    capacity: 2,
    occupants: [
      {
        name: "Owen James",
        id: "STU028",
        course: "Civil",
        semester: "6th",
        phone: "+91 9876543237",
        joinDate: "2024-02-18",
      },
    ],
  },
  {
    floor: "2",
    roomNumber: "2-107",
    status: "full",
    capacity: 2,
    occupants: [
      {
        name: "Quinn Kelly",
        id: "STU029",
        course: "Computer Science",
        semester: "4th",
        phone: "+91 9876543238",
        joinDate: "2024-01-12",
      },
      {
        name: "Ruby Lewis",
        id: "STU030",
        course: "Electronics",
        semester: "6th",
        phone: "+91 9876543239",
        joinDate: "2024-01-12",
      },
    ],
  },
  { floor: "2", roomNumber: "2-108", status: "empty", capacity: 2, occupants: [] },
]

export default function HostelOccupancyPage() {
  const { user } = useAuth()
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFloor, setFilterFloor] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getRoomColor = (status: string) => {
    switch (status) {
      case "full":
        return "bg-red-500 hover:bg-red-600 border-red-600"
      case "partial":
        return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600"
      case "empty":
        return "bg-green-500 hover:bg-green-600 border-green-600"
      default:
        return "bg-gray-300 hover:bg-gray-400 border-gray-400"
    }
  }

  const getStatusText = (status: string, occupants: number, capacity: number) => {
    switch (status) {
      case "full":
        return `Full (${occupants}/${capacity})`
      case "partial":
        return `Partial (${occupants}/${capacity})`
      case "empty":
        return `Empty (${occupants}/${capacity})`
      default:
        return "Unknown"
    }
  }

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room)
    setIsDialogOpen(true)
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
    // In real app, would fetch fresh data from API
  }

  const handleExportData = () => {
    // In real app, would generate and download occupancy report
    console.log("[v0] Exporting occupancy data...")
  }

  // Filter rooms based on search and filters
  const filteredRooms = mockRoomData.filter((room) => {
    const matchesSearch =
      searchTerm === "" ||
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.occupants.some(
        (occupant) =>
          occupant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          occupant.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    const matchesFloor = filterFloor === "all" || room.floor === filterFloor
    const matchesStatus = filterStatus === "all" || room.status === filterStatus

    return matchesSearch && matchesFloor && matchesStatus
  })

  // Group rooms by floor
  const roomsByFloor = filteredRooms.reduce(
    (acc, room) => {
      if (!acc[room.floor]) {
        acc[room.floor] = []
      }
      acc[room.floor].push(room)
      return acc
    },
    {} as Record<string, typeof mockRoomData>,
  )

  // Calculate statistics
  const totalRooms = mockRoomData.length
  const fullRooms = mockRoomData.filter((room) => room.status === "full").length
  const partialRooms = mockRoomData.filter((room) => room.status === "partial").length
  const emptyRooms = mockRoomData.filter((room) => room.status === "empty").length
  const totalOccupants = mockRoomData.reduce((sum, room) => sum + room.occupants.length, 0)
  const totalCapacity = mockRoomData.reduce((sum, room) => sum + room.capacity, 0)
  const occupancyRate = Math.round((totalOccupants / totalCapacity) * 100)

  return (
    <AccessControl allowedRoles={["hostel", "admin"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hostel" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Hostel Occupancy Map</h1>
                <p className="text-muted-foreground mt-1">
                  Real-time visual overview of room occupancy • Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
              <CardDescription>Filter rooms by floor, status, or search for specific rooms/students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search rooms, students, or IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterFloor} onValueChange={setFilterFloor}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="G">Ground Floor</SelectItem>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="empty">Empty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="map" className="space-y-6">
            <TabsList>
              <TabsTrigger value="map">Visual Map</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Interactive Room Map
                  </CardTitle>
                  <CardDescription>Click on any room for detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded border"></div>
                      <span className="text-sm">Full</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                      <span className="text-sm">Partial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded border"></div>
                      <span className="text-sm">Empty</span>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      Showing {filteredRooms.length} of {totalRooms} rooms
                    </div>
                  </div>

                  {/* Room Grid by Floor */}
                  <TooltipProvider>
                    <div className="space-y-6">
                      {Object.entries(roomsByFloor)
                        .sort(([a], [b]) => {
                          if (a === "G") return -1
                          if (b === "G") return 1
                          return Number.parseInt(a) - Number.parseInt(b)
                        })
                        .map(([floor, rooms]) => (
                          <div key={floor} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-sm font-medium">
                                {floor === "G" ? "Ground Floor" : `Floor ${floor}`}
                              </Badge>
                              <span className="text-sm text-muted-foreground">({rooms.length} rooms)</span>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                              {rooms.map((room) => (
                                <Tooltip key={room.roomNumber}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleRoomClick(room)}
                                      className={`
                                        aspect-square p-2 rounded-lg border-2 transition-all duration-200 
                                        flex flex-col items-center justify-center text-white font-medium text-xs
                                        hover:scale-105 hover:shadow-md cursor-pointer
                                        ${getRoomColor(room.status)}
                                      `}
                                    >
                                      <Bed className="h-3 w-3 mb-1" />
                                      <span>{room.roomNumber.split("-")[1]}</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-center">
                                      <div className="font-medium">{room.roomNumber}</div>
                                      <div className="text-sm">
                                        {getStatusText(room.status, room.occupants.length, room.capacity)}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{totalRooms}</div>
                    <p className="text-xs text-muted-foreground">Across all floors</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{occupancyRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {totalOccupants}/{totalCapacity} beds
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                    <Bed className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{emptyRooms + partialRooms}</div>
                    <p className="text-xs text-muted-foreground">
                      {emptyRooms} empty, {partialRooms} partial
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Full Rooms</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{fullRooms}</div>
                    <p className="text-xs text-muted-foreground">At maximum capacity</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Floor-wise Distribution</CardTitle>
                    <CardDescription>Room occupancy by floor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["G", "1", "2"].map((floor) => {
                        const floorRooms = mockRoomData.filter((room) => room.floor === floor)
                        const floorFull = floorRooms.filter((room) => room.status === "full").length
                        const floorPartial = floorRooms.filter((room) => room.status === "partial").length
                        const floorEmpty = floorRooms.filter((room) => room.status === "empty").length

                        return (
                          <div key={floor} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{floor === "G" ? "Ground Floor" : `Floor ${floor}`}</span>
                              <span className="text-sm text-muted-foreground">{floorRooms.length} rooms</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 bg-red-100 rounded-full h-2 relative">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${(floorFull / floorRooms.length) * 100}%` }}
                                />
                              </div>
                              <div className="flex-1 bg-yellow-100 rounded-full h-2 relative">
                                <div
                                  className="bg-yellow-500 h-2 rounded-full"
                                  style={{ width: `${(floorPartial / floorRooms.length) * 100}%` }}
                                />
                              </div>
                              <div className="flex-1 bg-green-100 rounded-full h-2 relative">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${(floorEmpty / floorRooms.length) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Full: {floorFull}</span>
                              <span>Partial: {floorPartial}</span>
                              <span>Empty: {floorEmpty}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest room assignments and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">New Assignment</div>
                          <div className="text-xs text-muted-foreground">Owen James assigned to Room 2-106</div>
                        </div>
                        <div className="text-xs text-muted-foreground">2h ago</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <UserMinus className="h-4 w-4 text-red-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Room Vacated</div>
                          <div className="text-xs text-muted-foreground">Room G-107 became available</div>
                        </div>
                        <div className="text-xs text-muted-foreground">5h ago</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Room Transfer</div>
                          <div className="text-xs text-muted-foreground">Student moved from 1-104 to 2-105</div>
                        </div>
                        <div className="text-xs text-muted-foreground">1d ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Room Details Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Room {selectedRoom?.roomNumber}
                </DialogTitle>
                <DialogDescription>Detailed room information and resident details</DialogDescription>
              </DialogHeader>
              {selectedRoom && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${getRoomColor(selectedRoom.status).split(" ")[0]}`}></div>
                      <span className="font-medium">Status</span>
                    </div>
                    <Badge variant="outline">
                      {getStatusText(selectedRoom.status, selectedRoom.occupants.length, selectedRoom.capacity)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Occupants ({selectedRoom.occupants.length}/{selectedRoom.capacity})
                      </span>
                    </div>

                    {selectedRoom.occupants.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRoom.occupants.map((occupant: any, index: number) => (
                          <div key={index} className="p-4 bg-muted rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-medium">{occupant.name}</div>
                                <div className="text-sm text-muted-foreground">{occupant.course}</div>
                              </div>
                              <Badge variant="outline">{occupant.id}</Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>Semester: {occupant.semester}</div>
                              <div>Phone: {occupant.phone}</div>
                              <div>Joined: {occupant.joinDate}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground bg-muted rounded-lg">
                        <Bed className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div>No occupants currently assigned</div>
                        <div className="text-sm">This room is available for new assignments</div>
                      </div>
                    )}
                  </div>

                  {selectedRoom.status === "partial" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Eye className="h-4 w-4" />
                        <strong>Available Space:</strong>
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        This room has space for {selectedRoom.capacity - selectedRoom.occupants.length} more student(s)
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {selectedRoom.status !== "full" && (
                      <Button className="flex-1">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Student
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </AccessControl>
  )
}
