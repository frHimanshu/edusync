"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Calendar, TrendingUp, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function TNPDashboard() {
  return (
    <AccessControl allowedRoles={["placement"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="placement" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">T&P Cell Dashboard</h1>
                  <p className="text-muted-foreground">Training & Placement management portal</p>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Upcoming Placement Drives</p>
                      <p className="text-3xl font-bold text-primary">8</p>
                      <p className="text-xs text-muted-foreground mt-1">Next drive: Tech Corp (Jan 25)</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Students Placed</p>
                      <p className="text-3xl font-bold text-secondary">142</p>
                      <p className="text-xs text-muted-foreground mt-1">85% placement rate</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common T&P Cell tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/authority/tnp/student-database">
                      <Users className="h-6 w-6" />
                      Student Database
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/tnp/announcements">
                      <MessageSquare className="h-6 w-6" />
                      Post Announcements
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/tnp/placement-drives">
                      <Calendar className="h-6 w-6" />
                      Placement Drives
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Placements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Placements</CardTitle>
                <CardDescription>Latest student placements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">Computer Science • STU2024001</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Tech Corp</p>
                      <p className="text-xs text-muted-foreground">₹12 LPA</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Electronics • STU2024002</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Innovation Labs</p>
                      <p className="text-xs text-muted-foreground">₹10 LPA</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Drives */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Placement Drives</CardTitle>
                <CardDescription>Scheduled company visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Tech Corp</p>
                      <p className="text-sm text-muted-foreground">Software Development Roles</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Jan 25, 2024</p>
                      <p className="text-xs text-muted-foreground">45 students registered</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Innovation Labs</p>
                      <p className="text-sm text-muted-foreground">Product Management</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Feb 2, 2024</p>
                      <p className="text-xs text-muted-foreground">28 students registered</p>
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
