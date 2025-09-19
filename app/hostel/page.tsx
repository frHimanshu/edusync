"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building, Users, Wrench, AlertTriangle, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"

// Mock hostel data
const mockHostelData = {
  currentAllocation: {
    block: "Block A",
    roomNumber: "205",
    roomType: "Double Sharing",
    floor: "2nd Floor",
    allocatedDate: "2024-01-15",
    roommates: [
      {
        id: "STU2024002",
        name: "Mike Johnson",
        course: "Mechanical Engineering",
        semester: "6th Semester",
        phone: "+91 9876543210",
        email: "mike.johnson@college.edu",
      },
    ],
    facilities: ["Wi-Fi", "Study Table", "Wardrobe", "Attached Bathroom", "Balcony"],
    warden: {
      name: "Dr. Sarah Wilson",
      phone: "+91 9876543211",
      email: "sarah.wilson@college.edu",
      office: "Block A - Ground Floor",
    },
  },
  maintenanceRequests: [
    {
      id: 1,
      type: "Electrical",
      description: "Ceiling fan not working properly",
      priority: "medium",
      status: "in-progress",
      submittedDate: "2024-03-10",
      expectedResolution: "2024-03-15",
    },
    {
      id: 2,
      type: "Plumbing",
      description: "Bathroom tap leaking",
      priority: "high",
      status: "pending",
      submittedDate: "2024-03-12",
      expectedResolution: "2024-03-14",
    },
    {
      id: 3,
      type: "Furniture",
      description: "Study chair needs repair",
      priority: "low",
      status: "completed",
      submittedDate: "2024-03-05",
      completedDate: "2024-03-08",
    },
  ],
  messMenu: {
    currentWeek: [
      {
        day: "Monday",
        breakfast: "Poha, Tea/Coffee, Banana",
        lunch: "Rice, Dal, Sabzi, Roti, Pickle",
        snacks: "Samosa, Tea",
        dinner: "Rice, Rajma, Roti, Salad",
      },
      {
        day: "Tuesday",
        breakfast: "Upma, Tea/Coffee, Apple",
        lunch: "Rice, Sambar, Sabzi, Roti, Curd",
        snacks: "Pakora, Tea",
        dinner: "Rice, Chicken Curry, Roti, Salad",
      },
      {
        day: "Wednesday",
        breakfast: "Paratha, Curd, Tea/Coffee",
        lunch: "Rice, Dal, Aloo Gobi, Roti, Pickle",
        snacks: "Biscuits, Tea",
        dinner: "Rice, Paneer Curry, Roti, Salad",
      },
      {
        day: "Thursday",
        breakfast: "Idli, Sambar, Tea/Coffee",
        lunch: "Rice, Rasam, Sabzi, Roti, Curd",
        snacks: "Sandwich, Tea",
        dinner: "Rice, Fish Curry, Roti, Salad",
      },
      {
        day: "Friday",
        breakfast: "Dosa, Chutney, Tea/Coffee",
        lunch: "Rice, Dal, Bhindi, Roti, Pickle",
        snacks: "Cake, Tea",
        dinner: "Rice, Mutton Curry, Roti, Salad",
      },
    ],
  },
  hostelRules: [
    "Visitors allowed only between 10 AM - 6 PM",
    "No loud music or noise after 10 PM",
    "Keep common areas clean",
    "Report maintenance issues promptly",
    "No smoking or alcohol in hostel premises",
    "Respect roommates and other residents",
  ],
  payments: [
    {
      id: 1,
      type: "Hostel Fee",
      amount: 15000,
      dueDate: "2024-03-31",
      status: "paid",
      paidDate: "2024-03-01",
    },
    {
      id: 2,
      type: "Mess Fee",
      amount: 8000,
      dueDate: "2024-03-31",
      status: "pending",
    },
    {
      id: 3,
      type: "Security Deposit",
      amount: 5000,
      dueDate: "2024-01-15",
      status: "paid",
      paidDate: "2024-01-10",
    },
  ],
}

export default function Hostel() {
  const [hostelData] = useState(mockHostelData)
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("student")
  const [newRequest, setNewRequest] = useState({ type: "", description: "", priority: "medium" })

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "in-progress":
        return "default"
      case "pending":
        return "destructive"
      case "paid":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleSubmitRequest = () => {
    console.log("[v0] Submitting maintenance request:", newRequest)
    // In real app, would make API call to submit request
    setNewRequest({ type: "", description: "", priority: "medium" })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Hostel Management</h1>
            <p className="text-muted-foreground mt-1">Manage your accommodation, maintenance, and hostel services</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Room</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {hostelData.currentAllocation.block} - {hostelData.currentAllocation.roomNumber}
                </div>
                <p className="text-xs text-muted-foreground">{hostelData.currentAllocation.roomType}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Roommates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{hostelData.currentAllocation.roommates.length}</div>
                <p className="text-xs text-muted-foreground">Active roommates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {hostelData.maintenanceRequests.filter((r) => r.status !== "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Active requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {hostelData.payments.filter((p) => p.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">Due payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="room-info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="room-info">Room Info</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="mess-menu">Mess Menu</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="room-info">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Details</CardTitle>
                    <CardDescription>Your current accommodation information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Block</div>
                          <div className="text-lg font-semibold">{hostelData.currentAllocation.block}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Room Number</div>
                          <div className="text-lg font-semibold">{hostelData.currentAllocation.roomNumber}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Floor</div>
                          <div className="text-lg font-semibold">{hostelData.currentAllocation.floor}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Room Type</div>
                          <div className="text-lg font-semibold">{hostelData.currentAllocation.roomType}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Facilities</div>
                        <div className="flex flex-wrap gap-2">
                          {hostelData.currentAllocation.facilities.map((facility, index) => (
                            <Badge key={index} variant="secondary">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Allocated Date</div>
                        <div className="text-lg font-semibold">{hostelData.currentAllocation.allocatedDate}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Roommate Information</CardTitle>
                    <CardDescription>Details about your roommates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hostelData.currentAllocation.roommates.map((roommate) => (
                        <div key={roommate.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{roommate.name}</div>
                              <div className="text-sm text-muted-foreground">{roommate.course}</div>
                              <div className="text-sm text-muted-foreground">{roommate.semester}</div>
                            </div>
                            <Badge variant="outline">{roommate.id}</Badge>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              {roommate.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" />
                              {roommate.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Warden Information</CardTitle>
                    <CardDescription>Contact details for your hostel warden</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{hostelData.currentAllocation.warden.name}</div>
                        <div className="text-sm text-muted-foreground mb-3">Hostel Warden</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            {hostelData.currentAllocation.warden.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4" />
                            {hostelData.currentAllocation.warden.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            {hostelData.currentAllocation.warden.office}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">Contact Warden</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Maintenance Requests</CardTitle>
                      <CardDescription>Track and manage your maintenance requests</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>New Request</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Maintenance Request</DialogTitle>
                          <DialogDescription>Describe the issue you're experiencing in your room</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="type">Request Type</Label>
                            <select
                              id="type"
                              className="w-full mt-1 p-2 border rounded-md"
                              value={newRequest.type}
                              onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                            >
                              <option value="">Select type</option>
                              <option value="Electrical">Electrical</option>
                              <option value="Plumbing">Plumbing</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Cleaning">Cleaning</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe the issue in detail..."
                              value={newRequest.description}
                              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="priority">Priority</Label>
                            <select
                              id="priority"
                              className="w-full mt-1 p-2 border rounded-md"
                              value={newRequest.priority}
                              onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <Button onClick={handleSubmitRequest} className="w-full">
                            Submit Request
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hostelData.maintenanceRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <div className="font-medium">
                                {request.type} - {request.description}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Submitted: {request.submittedDate}
                                {request.expectedResolution && ` • Expected: ${request.expectedResolution}`}
                                {request.completedDate && ` • Completed: ${request.completedDate}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(request.priority) as any}>{request.priority}</Badge>
                            <Badge variant={getStatusColor(request.status) as any}>{request.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mess-menu">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Mess Menu</CardTitle>
                  <CardDescription>Current week's meal schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {hostelData.messMenu.currentWeek.map((day) => (
                      <div key={day.day} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-4">{day.day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-2">Breakfast</div>
                            <div className="text-sm">{day.breakfast}</div>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-2">Lunch</div>
                            <div className="text-sm">{day.lunch}</div>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-2">Snacks</div>
                            <div className="text-sm">{day.snacks}</div>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-2">Dinner</div>
                            <div className="text-sm">{day.dinner}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Hostel Payments</CardTitle>
                  <CardDescription>Track your hostel and mess fee payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostelData.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.type}</TableCell>
                          <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(payment.status) as any}>{payment.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {payment.status === "pending" ? (
                              <Button size="sm">Pay Now</Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                View Receipt
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Hostel Rules & Regulations</CardTitle>
                  <CardDescription>Important guidelines for hostel residents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hostelData.hostelRules.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="text-sm">{rule}</div>
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
  )
}
