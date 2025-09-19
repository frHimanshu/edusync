"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

export default function HODDashboard() {
  return (
    <AccessControl allowedRoles={["hod"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hod" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">HOD Dashboard</h1>
                <p className="text-muted-foreground">Department management and oversight</p>
              </div>
            </div>

            {/* Department KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-primary">245</p>
                      <p className="text-xs text-muted-foreground mt-1">Computer Science Department</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                      <p className="text-3xl font-bold text-secondary">87.5%</p>
                      <p className="text-xs text-muted-foreground mt-1">Department-wide average</p>
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
                <CardDescription>Common HOD tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/authority/hod/students">
                      <Eye className="h-6 w-6" />
                      View Department Students
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/hod/announcements">
                      <MessageSquare className="h-6 w-6" />
                      Department Announcements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Key metrics for Computer Science Department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-primary">92%</p>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-secondary">8.2</p>
                    <p className="text-sm text-muted-foreground">Average CGPA</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-accent">85%</p>
                    <p className="text-sm text-muted-foreground">Placement Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Department Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Department Announcements</CardTitle>
                <CardDescription>Latest announcements posted to CS students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">CS Department Seminar Series</p>
                      <p className="text-sm text-muted-foreground">Posted to CS students only</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Project Submission Guidelines</p>
                      <p className="text-sm text-muted-foreground">Posted to CS students only</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
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
