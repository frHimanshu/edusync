"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCheck, Users, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"

export default function FacultyDashboard() {
  return (
    <AccessControl allowedRoles={["faculty"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="faculty" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
                <p className="text-muted-foreground">Manage classes, attendance, and announcements</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned Classes</p>
                      <p className="text-3xl font-bold text-primary">5</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                      <p className="text-3xl font-bold text-secondary">3</p>
                    </div>
                    <Calendar className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                      <p className="text-3xl font-bold text-accent">12</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common faculty tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/authority/faculty/mark-attendance">
                      <UserCheck className="h-6 w-6" />
                      Mark Attendance
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/faculty/announcements">
                      <MessageSquare className="h-6 w-6" />
                      Create Announcements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent General Announcements</CardTitle>
                <CardDescription>Latest announcements posted to all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mid-term Examination Schedule</p>
                      <p className="text-sm text-muted-foreground">Posted to all students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Library Hours Extended</p>
                      <p className="text-sm text-muted-foreground">Posted to all students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Classes</CardTitle>
                <CardDescription>Classes you are teaching this semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Data Structures & Algorithms</p>
                      <p className="text-sm text-muted-foreground">CS 3rd Year • 45 students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Mon, Wed, Fri</p>
                      <p className="text-xs text-muted-foreground">10:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Database Management Systems</p>
                      <p className="text-sm text-muted-foreground">CS 4th Year • 38 students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Tue, Thu</p>
                      <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM</p>
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
