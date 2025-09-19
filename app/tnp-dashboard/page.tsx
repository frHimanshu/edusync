"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, BarChart3, Briefcase, Target, Award, Calendar } from "lucide-react"

export default function TnpDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AccessControl allowedRoles={["tnp"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="placement" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Training & Placement Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.profile?.full_name || 'T&P Authority'}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,250</div>
                    <p className="text-xs text-muted-foreground">+45 new registrations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85</div>
                    <p className="text-xs text-muted-foreground">+3 this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Placement Drives</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 scheduled this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">+5% from last year</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common T&P management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Users className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Student Database</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Building className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Company Relations</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Target className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Placement Drives</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Reports</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Recent and upcoming placement activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Google Campus Drive - Tomorrow</p>
                          <p className="text-xs text-gray-500">9:00 AM - Computer Lab</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Microsoft Interview Session</p>
                          <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Amazon Pre-Placement Talk</p>
                          <p className="text-xs text-gray-500">Next Monday, 10:00 AM</p>
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