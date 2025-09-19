"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, TrendingUp, Users, Home } from "lucide-react"

export default function OccupancyReports() {
  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hostel" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Occupancy Reports</h1>
                  <p className="text-muted-foreground">Generate and view hostel occupancy analytics</p>
                </div>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Occupancy</p>
                      <p className="text-3xl font-bold text-primary">91%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-secondary">284</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                      <p className="text-3xl font-bold text-green-600">14</p>
                    </div>
                    <Home className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-3xl font-bold text-destructive">8</p>
                    </div>
                    <Users className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Block-wise Occupancy */}
            <Card>
              <CardHeader>
                <CardTitle>Block-wise Occupancy</CardTitle>
                <CardDescription>Occupancy rates by hostel blocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Block A</h3>
                      <p className="text-sm text-muted-foreground">52 rooms • 44 occupied</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">85%</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Block B</h3>
                      <p className="text-sm text-muted-foreground">52 rooms • 48 occupied</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-secondary">92%</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Block C</h3>
                      <p className="text-sm text-muted-foreground">52 rooms • 50 occupied</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-destructive">96%</p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-destructive h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department-wise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Distribution</CardTitle>
                <CardDescription>Student distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Computer Science</span>
                      <span className="font-medium">95 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Electronics</span>
                      <span className="font-medium">78 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "27%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mechanical</span>
                      <span className="font-medium">65 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Civil</span>
                      <span className="font-medium">46 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{ width: "17%" }}></div>
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
