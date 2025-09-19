"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, BarChart3, AlertTriangle, Home, Calendar } from "lucide-react"

export default function HostelDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="hostel" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Hostel Management Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.profile?.full_name || 'Hostel Authority'}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">120</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98</div>
                    <p className="text-xs text-muted-foreground">81.7% occupancy rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">392</div>
                    <p className="text-xs text-muted-foreground">+12 new allocations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Issues</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">2 pending, 1 in progress</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common hostel management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Users className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Allocate Room</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">View Reports</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Report Issue</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Calendar className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Check Schedule</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest hostel management activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Room 101 allocated to John Doe</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Maintenance request for Room 205</p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Monthly occupancy report generated</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AccessControl>
  )
}