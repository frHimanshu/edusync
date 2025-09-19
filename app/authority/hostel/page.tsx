"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Users, AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react"

interface HostelAuthorityData {
  id: string
  name: string
  email: string
  employee_id: string
  department: string
  phone?: string
}

export default function HostelAuthorityDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [authorityData, setAuthorityData] = useState<HostelAuthorityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/authority-login")
      return
    }

    if (user && user.role !== "hostel") {
      router.replace("/")
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchAuthorityData = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/authority/profile?id=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setAuthorityData(data)
        } else {
          console.error("Failed to fetch authority data")
        }
      } catch (error) {
        console.error("Error fetching authority data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAuthorityData()
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !authorityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${authorityData.name}`} />
                <AvatarFallback>
                  {authorityData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {authorityData.name}</h1>
                <p className="text-gray-600">Employee ID: {authorityData.employee_id}</p>
                <Badge variant="secondary">Hostel Authority</Badge>
              </div>
            </div>
            <Button onClick={() => router.push("/authority/profile")}>View Profile</Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">240</div>
              <p className="text-xs text-muted-foreground">Across all hostels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">218</div>
              <p className="text-xs text-muted-foreground">91% occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Maintenance requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Issues resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Issues */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Maintenance Requests</CardTitle>
              <CardDescription>Latest issues reported by students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Room 204A - Water Leakage</h4>
                    <p className="text-sm text-gray-600">Reported by: John Smith (STU2024001)</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge variant="destructive">High Priority</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Room 156B - AC Not Working</h4>
                    <p className="text-sm text-gray-600">Reported by: Sarah Johnson (STU2024002)</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                  <Badge variant="secondary">Medium Priority</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Common Room - WiFi Issues</h4>
                    <p className="text-sm text-gray-600">Reported by: Multiple students</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge variant="outline">Low Priority</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Hostel management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/authority/hostel/rooms")}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Manage Rooms
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/authority/hostel/maintenance")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Maintenance Requests
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/authority/hostel/students")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Student Management
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/authority/hostel/reports")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
