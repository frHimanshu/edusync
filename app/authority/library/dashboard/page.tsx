"use client"

import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Users, AlertTriangle, Plus, Eye } from "lucide-react"
import Link from "next/link"

export default function LibraryDashboard() {
  return (
    <AccessControl allowedRoles={["librarian"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="librarian" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Library Dashboard</h1>
                  <p className="text-muted-foreground">Manage books, track issuances, and monitor library operations</p>
                </div>
              </div>
            </div>

            {/* Primary Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search books, students, or issued records..." className="pl-12 h-12 text-lg" />
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                      <p className="text-3xl font-bold text-primary">2,847</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Books Issued</p>
                      <p className="text-3xl font-bold text-secondary">342</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overdue Books</p>
                      <p className="text-3xl font-bold text-destructive">23</p>
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
                <CardDescription>Common library management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button asChild className="h-20 flex-col gap-2">
                    <Link href="/authority/library/manage-books">
                      <Plus className="h-6 w-6" />
                      Manage Books
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/library/issued-records">
                      <Eye className="h-6 w-6" />
                      Issued Records
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/library/overdue">
                      <AlertTriangle className="h-6 w-6" />
                      Overdue Books
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Link href="/authority/library/reports">
                      <BookOpen className="h-6 w-6" />
                      Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest book issuances and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Data Structures and Algorithms</p>
                      <p className="text-sm text-muted-foreground">Issued to John Doe (STU2024001)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Issued</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Engineering Mathematics</p>
                      <p className="text-sm text-muted-foreground">Returned by Sarah Johnson (STU2024002)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">Returned</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
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
