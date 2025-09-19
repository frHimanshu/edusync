"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Plus, Wrench, Clock, CheckCircle } from "lucide-react"

const mockMaintenanceRequests = [
  {
    id: "MNT001",
    roomId: "A-101",
    issue: "AC not working",
    priority: "High",
    status: "In Progress",
    reportedBy: "John Doe",
    reportedDate: "2024-01-20",
    assignedTo: "Maintenance Team A",
    estimatedCompletion: "2024-01-22",
  },
  {
    id: "MNT002",
    roomId: "B-205",
    issue: "Leaky faucet",
    priority: "Medium",
    status: "Pending",
    reportedBy: "Sarah Johnson",
    reportedDate: "2024-01-21",
    assignedTo: null,
    estimatedCompletion: null,
  },
  {
    id: "MNT003",
    roomId: "C-301",
    issue: "WiFi connectivity issues",
    priority: "Low",
    status: "Completed",
    reportedBy: "Michael Brown",
    reportedDate: "2024-01-18",
    assignedTo: "IT Support",
    estimatedCompletion: "2024-01-19",
  },
]

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [requests] = useState(mockMaintenanceRequests)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Pending":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
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
                <AlertTriangle className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
                  <p className="text-muted-foreground">Track and manage hostel maintenance requests</p>
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by room, issue, or reporter..."
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
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>{filteredRequests.length} requests found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-balance">Request #{request.id}</h3>
                              <Badge variant={getStatusColor(request.status) as any}>{request.status}</Badge>
                              <Badge variant={getPriorityColor(request.priority) as any}>{request.priority}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <p className="font-medium">{request.issue}</p>
                                <p>Room: {request.roomId}</p>
                                <p>Reported by: {request.reportedBy}</p>
                                <p>Date: {request.reportedDate}</p>
                              </div>
                              <div>
                                {request.assignedTo && (
                                  <p>Assigned to: {request.assignedTo}</p>
                                )}
                                {request.estimatedCompletion && (
                                  <p>Est. completion: {request.estimatedCompletion}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  {request.status === "Completed" && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {request.status === "In Progress" && (
                                    <Wrench className="h-4 w-4 text-blue-600" />
                                  )}
                                  {request.status === "Pending" && (
                                    <Clock className="h-4 w-4 text-orange-600" />
                                  )}
                                  <span className="text-xs">
                                    {request.status === "Completed" && "Completed"}
                                    {request.status === "In Progress" && "In Progress"}
                                    {request.status === "Pending" && "Awaiting Assignment"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {request.status === "Pending" && (
                          <Button variant="outline" size="sm">
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-3xl font-bold text-destructive">5</p>
                    </div>
                    <Clock className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-secondary">3</p>
                    </div>
                    <Wrench className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed This Month</p>
                      <p className="text-3xl font-bold text-green-600">24</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}