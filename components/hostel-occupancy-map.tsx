"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Building, Users, Bed } from "lucide-react"

// Mock room data - in real app would come from database
const mockRoomData = [
  // Ground Floor (G)
  { floor: "G", roomNumber: "G-101", status: "full", occupants: ["John Doe (STU001)", "Mike Smith (STU002)"] },
  { floor: "G", roomNumber: "G-102", status: "partial", occupants: ["Sarah Johnson (STU003)"] },
  { floor: "G", roomNumber: "G-103", status: "empty", occupants: [] },
  { floor: "G", roomNumber: "G-104", status: "full", occupants: ["Alex Brown (STU004)", "Chris Wilson (STU005)"] },
  { floor: "G", roomNumber: "G-105", status: "partial", occupants: ["Emma Davis (STU006)"] },
  { floor: "G", roomNumber: "G-106", status: "full", occupants: ["Ryan Miller (STU007)", "Jake Taylor (STU008)"] },
  { floor: "G", roomNumber: "G-107", status: "empty", occupants: [] },
  { floor: "G", roomNumber: "G-108", status: "full", occupants: ["Tom Anderson (STU009)", "Ben Clark (STU010)"] },

  // First Floor (1)
  { floor: "1", roomNumber: "1-101", status: "full", occupants: ["Lisa White (STU011)", "Amy Green (STU012)"] },
  { floor: "1", roomNumber: "1-102", status: "full", occupants: ["David Lee (STU013)", "Mark Hall (STU014)"] },
  { floor: "1", roomNumber: "1-103", status: "partial", occupants: ["Kevin Young (STU015)"] },
  { floor: "1", roomNumber: "1-104", status: "empty", occupants: [] },
  { floor: "1", roomNumber: "1-105", status: "full", occupants: ["Steve King (STU016)", "Paul Wright (STU017)"] },
  { floor: "1", roomNumber: "1-106", status: "partial", occupants: ["Nina Lopez (STU018)"] },
  { floor: "1", roomNumber: "1-107", status: "full", occupants: ["Carl Hill (STU019)", "Dan Scott (STU020)"] },
  { floor: "1", roomNumber: "1-108", status: "empty", occupants: [] },

  // Second Floor (2)
  { floor: "2", roomNumber: "2-101", status: "full", occupants: ["Grace Adams (STU021)", "Helen Baker (STU022)"] },
  { floor: "2", roomNumber: "2-102", status: "partial", occupants: ["Ian Carter (STU023)"] },
  { floor: "2", roomNumber: "2-103", status: "full", occupants: ["Jack Evans (STU024)", "Luke Foster (STU025)"] },
  { floor: "2", roomNumber: "2-104", status: "full", occupants: ["Mia Gray (STU026)", "Nora Hayes (STU027)"] },
  { floor: "2", roomNumber: "2-105", status: "empty", occupants: [] },
  { floor: "2", roomNumber: "2-106", status: "partial", occupants: ["Owen James (STU028)"] },
  { floor: "2", roomNumber: "2-107", status: "full", occupants: ["Quinn Kelly (STU029)", "Ruby Lewis (STU030)"] },
  { floor: "2", roomNumber: "2-108", status: "empty", occupants: [] },
]

interface HostelOccupancyMapProps {
  className?: string
}

export function HostelOccupancyMap({ className }: HostelOccupancyMapProps) {
  const [selectedRoom, setSelectedRoom] = useState<(typeof mockRoomData)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "full":
        return "Full (2/2)"
      case "partial":
        return "Partial (1/2)"
      case "empty":
        return "Empty (0/2)"
      default:
        return "Unknown"
    }
  }

  const handleRoomClick = (room: (typeof mockRoomData)[0]) => {
    setSelectedRoom(room)
    setIsDialogOpen(true)
  }

  // Group rooms by floor
  const roomsByFloor = mockRoomData.reduce(
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

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Visual Hostel Occupancy Map
          </CardTitle>
          <CardDescription>Interactive room occupancy grid - click on any room for details</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded border"></div>
              <span className="text-sm">Full (2/2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
              <span className="text-sm">Partial (1/2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded border"></div>
              <span className="text-sm">Empty (0/2)</span>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalRooms}</div>
              <div className="text-sm text-muted-foreground">Total Rooms</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{fullRooms}</div>
              <div className="text-sm text-muted-foreground">Full Rooms</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{partialRooms}</div>
              <div className="text-sm text-muted-foreground">Partial Rooms</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{emptyRooms}</div>
              <div className="text-sm text-muted-foreground">Empty Rooms</div>
            </div>
          </div>

          {/* Room Grid by Floor */}
          <TooltipProvider>
            <div className="space-y-6">
              {Object.entries(roomsByFloor)
                .sort(([a], [b]) => {
                  // Sort floors: G, 1, 2, etc.
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
                              <div className="text-sm">{getStatusText(room.status)}</div>
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

      {/* Room Details Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Room {selectedRoom?.roomNumber}
            </DialogTitle>
            <DialogDescription>Room occupancy details and resident information</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${getRoomColor(selectedRoom.status).split(" ")[0]}`}></div>
                  <span className="font-medium">Status</span>
                </div>
                <Badge variant="outline">{getStatusText(selectedRoom.status)}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Occupants ({selectedRoom.occupants.length}/2)</span>
                </div>

                {selectedRoom.occupants.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRoom.occupants.map((occupant, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium">{occupant.split(" (")[0]}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {occupant.split("(")[1]?.replace(")", "")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground bg-muted rounded-lg">
                    No occupants currently assigned
                  </div>
                )}
              </div>

              {selectedRoom.status === "partial" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Available:</strong> This room has space for 1 more student
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
