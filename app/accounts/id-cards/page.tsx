"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Award as IdCard, Download, Printer, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

const mockIdCardRequests = [
  {
    id: 1,
    studentId: "DTE24CS001",
    studentName: "John Doe",
    department: "Computer Science",
    year: 1,
    requestDate: "2024-03-10",
    status: "completed",
    cardType: "student",
    reason: "new_admission",
    completedDate: "2024-03-15",
  },
  {
    id: 2,
    studentId: "DTE24EC002",
    studentName: "Jane Smith",
    department: "Electronics",
    year: 2,
    requestDate: "2024-03-12",
    status: "in_progress",
    cardType: "student",
    reason: "lost_card",
    completedDate: null,
  },
  {
    id: 3,
    studentId: "DTE24ME003",
    studentName: "Mike Johnson",
    department: "Mechanical",
    year: 3,
    requestDate: "2024-03-08",
    status: "pending",
    cardType: "student",
    reason: "damaged_card",
    completedDate: null,
  },
  {
    id: 4,
    studentId: "DTE24CS004",
    studentName: "Sarah Wilson",
    department: "Computer Science",
    year: 1,
    requestDate: "2024-03-14",
    status: "completed",
    cardType: "student",
    reason: "new_admission",
    completedDate: "2024-03-18",
  },
]

export default function IdCardsPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel" | "accountant">("accountant")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequests, setSelectedRequests] = useState<number[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as
        | "student"
        | "teacher"
        | "admin"
        | "hostel"
        | "accountant"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  const filteredRequests = mockIdCardRequests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleSelectRequest = (requestId: number) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId],
    )
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map((r) => r.id))
    }
  }

  const stats = {
    total: mockIdCardRequests.length,
    completed: mockIdCardRequests.filter((r) => r.status === "completed").length,
    inProgress: mockIdCardRequests.filter((r) => r.status === "in_progress").length,
    pending: mockIdCardRequests.filter((r) => r.status === "pending").length,
  }

  return (
    <AccessControl allowedRoles={["accountant", "administrator"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">ID Card Generation</h1>
            <p className="text-muted-foreground mt-1">Manage student ID card requests and generation</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <IdCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Cards generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
            </Card>
          </div>

          {/* ID Card Requests */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ID Card Requests</CardTitle>
                  <CardDescription>Manage and process student ID card generation requests</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={selectedRequests.length === 0}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Selected ({selectedRequests.length})
                  </Button>
                  <Button disabled={selectedRequests.length === 0}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, ID, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Requests Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRequests.includes(request.id)}
                            onCheckedChange={() => handleSelectRequest(request.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.studentName}</div>
                            <div className="text-sm text-muted-foreground">{request.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{request.department}</div>
                            <div className="text-sm text-muted-foreground">Year {request.year}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.reason.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {getStatusBadge(request.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === "pending" && <Button size="sm">Start Processing</Button>}
                            {request.status === "in_progress" && <Button size="sm">Mark Complete</Button>}
                            {request.status === "completed" && (
                              <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No ID card requests found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AccessControl>
  )
}
