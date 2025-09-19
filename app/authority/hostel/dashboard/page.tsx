"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Bed, AlertTriangle, Plus, Eye, Search } from "lucide-react"
import Link from "next/link"

export default function HostelDashboard() {
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
                  <h1 className="text-3xl font-bold text-foreground">Hostel Management Dashboard</h1>
                  <p className="text-muted-foreground">Manage hostel occupancy, rooms, and student accommodations</p>
                </div>
              </div>
            </div>

            {/* Primary Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search students, rooms, or occupancy records..." className="pl-12 h-12 text-lg" />
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                      <p className="text-3xl font-bold text-primary">156</p>
                    </div>
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupied Rooms</p>
                      <p className="text-3xl font-bold text-secondary">142</p>
                    </div>
                    <Bed className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-green-600">284</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                      <p className="text-3xl font-bold text-destructive">14</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common hostel management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/authority/hostel/room-management">
                      <Home className="h-6 w-6" />
                      Room Management
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/hostel/student-allocation">
                      <Users className="h-6 w-6" />
                      Student Allocation
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/hostel/occupancy-reports">
                      <Eye className="h-6 w-6" />
                      Occupancy Reports
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/hostel/maintenance">
                      <AlertTriangle className="h-6 w-6" />
                      Maintenance
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Allocations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Room Allocations</CardTitle>
                <CardDescription>Latest student room assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">STU2024001 • Computer Science</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Room A-101</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">STU2024002 • Electronics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Room B-205</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Room Status Overview</CardTitle>
                <CardDescription>Current occupancy status by block</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Block A</h3>
                      <Badge variant="default">85% Occupied</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Total Rooms: 52</p>
                      <p>Occupied: 44</p>
                      <p>Available: 8</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Block B</h3>
                      <Badge variant="secondary">92% Occupied</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Total Rooms: 52</p>
                      <p>Occupied: 48</p>
                      <p>Available: 4</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Block C</h3>
                      <Badge variant="destructive">96% Occupied</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Total Rooms: 52</p>
                      <p>Occupied: 50</p>
                      <p>Available: 2</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}