"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  Receipt,
  Award as IdCard,
} from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

interface AccountantData {
  id: string
  name: string
  email: string
  employee_id: string
  department: string
  phone?: string
}

const mockStats = {
  totalStudents: 1247,
  pendingRegistrations: 23,
  feesCollected: 2450000,
  pendingFees: 185000,
  documentsVerified: 1180,
  pendingDocuments: 67,
  idCardsGenerated: 1156,
  pendingIdCards: 91,
}

const mockRecentActivities = [
  {
    id: 1,
    type: "registration",
    description: "New student registration: John Smith (CS Dept)",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "fee",
    description: "Fee payment received: ₹45,000 from Sarah Johnson",
    timestamp: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "document",
    description: "Document verification pending for 5 students",
    timestamp: "6 hours ago",
    status: "pending",
  },
  {
    id: 4,
    type: "id_card",
    description: "ID card generation request for 12 students",
    timestamp: "1 day ago",
    status: "in_progress",
  },
]

const mockPendingTasks = [
  {
    id: 1,
    title: "Verify admission documents",
    count: 15,
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Process fee payments",
    count: 8,
    priority: "medium",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "Generate ID cards",
    count: 23,
    priority: "low",
    dueDate: "This week",
  },
  {
    id: 4,
    title: "Update student records",
    count: 6,
    priority: "medium",
    dueDate: "This week",
  },
]

export default function AccountsDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [accountantData, setAccountantData] = useState<AccountantData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/authority-login")
      return
    }

    if (user && user.role !== "accountant") {
      router.replace("/")
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchAccountantData = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/authority/profile?id=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setAccountantData(data)
        } else {
          console.error("Failed to fetch accountant data")
        }
      } catch (error) {
        console.error("Error fetching accountant data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAccountantData()
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !accountantData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <AccessControl allowedRoles={["accountant"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${accountantData.name}`} />
                  <AvatarFallback>
                    {accountantData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome, {accountantData.name}</h1>
                  <p className="text-gray-600">Employee ID: {accountantData.employee_id}</p>
                  <Badge variant="secondary">Accountant</Badge>
                </div>
              </div>
              <Button onClick={() => router.push("/authority/profile")}>View Profile</Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{mockStats.pendingRegistrations}</span> pending registrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(mockStats.feesCollected / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">₹{(mockStats.pendingFees / 1000).toFixed(0)}K</span> pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.documentsVerified}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">{mockStats.pendingDocuments}</span> pending verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ID Cards</CardTitle>
                <IdCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.idCardsGenerated}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">{mockStats.pendingIdCards}</span> pending generation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push("/authority/accounts/register-student")}
                >
                  <UserPlus className="h-6 w-6" />
                  <span>New Student Registration</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/authority/accounts/manage-students")}
                >
                  <Users className="h-6 w-6" />
                  <span>Manage Students</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-transparent"
                  onClick={() => router.push("/authority/accounts/fees")}
                >
                  <Receipt className="h-6 w-6" />
                  <span>Fee Management</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest administrative actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {activity.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{task.title}</p>
                          <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{task.count}</p>
                        <p className="text-xs text-muted-foreground">items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccessControl>
  )
}
