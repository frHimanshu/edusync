"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, BarChart3, Calendar, Clock, Award, Bell } from "lucide-react"

export default function FacultyDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AccessControl allowedRoles={["faculty"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="faculty" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.profile?.full_name || 'Faculty Member'}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">180</div>
                    <p className="text-xs text-muted-foreground">Across 6 classes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">This semester</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Next: 10:00 AM</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.7/5</div>
                    <p className="text-xs text-muted-foreground">+0.1 from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common faculty tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Users className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Mark Attendance</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">View Classes</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Bell className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Announcements</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">View Reports</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your classes and meetings for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Data Structures - CS301</p>
                          <p className="text-xs text-gray-500">9:00 AM - 10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Algorithms - CS302</p>
                          <p className="text-xs text-gray-500">11:00 AM - 12:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Faculty Meeting</p>
                          <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
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