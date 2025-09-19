"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, BookOpen, Award, Calendar, UserCheck, Target } from "lucide-react"

export default function HodDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AccessControl allowedRoles={["hod"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType="hod" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Head of Department Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.profile?.full_name || 'HOD'}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25</div>
                    <p className="text-xs text-muted-foreground">+2 new hires</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,250</div>
                    <p className="text-xs text-muted-foreground">+45 new admissions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">3 new courses added</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Department Rating</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8/5</div>
                    <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common department management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Users className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Manage Faculty</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <UserCheck className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Student Records</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Course Management</span>
                      </button>
                      <button 
                        onClick={() => router.push('/under-development')}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Department KPIs</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Highlights</CardTitle>
                    <CardDescription>Recent achievements and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Department ranked #1 in university</p>
                          <p className="text-xs text-gray-500">This semester</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New research lab inaugurated</p>
                          <p className="text-xs text-gray-500">Last week</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Faculty conference scheduled</p>
                          <p className="text-xs text-gray-500">Next Friday</p>
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