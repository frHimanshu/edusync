"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, DollarSign, Receipt, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"

const mockFeeRecords = [
  {
    id: 1,
    studentId: "DTE24CS001",
    studentName: "John Doe",
    department: "Computer Science",
    year: 1,
    feeType: "Tuition",
    amount: 45000,
    dueDate: "2024-03-15",
    paidDate: "2024-03-10",
    status: "paid",
    paymentMethod: "online",
    receiptNumber: "RCP001234",
  },
  {
    id: 2,
    studentId: "DTE24EC002",
    studentName: "Jane Smith",
    department: "Electronics",
    year: 2,
    feeType: "Hostel",
    amount: 25000,
    dueDate: "2024-03-20",
    paidDate: null,
    status: "pending",
    paymentMethod: null,
    receiptNumber: null,
  },
  {
    id: 3,
    studentId: "DTE24ME003",
    studentName: "Mike Johnson",
    department: "Mechanical",
    year: 3,
    feeType: "Lab",
    amount: 8000,
    dueDate: "2024-03-12",
    paidDate: null,
    status: "overdue",
    paymentMethod: null,
    receiptNumber: null,
  },
  {
    id: 4,
    studentId: "DTE24CS004",
    studentName: "Sarah Wilson",
    department: "Computer Science",
    year: 1,
    feeType: "Library",
    amount: 3000,
    dueDate: "2024-03-25",
    paidDate: "2024-03-18",
    status: "paid",
    paymentMethod: "cash",
    receiptNumber: "RCP001235",
  },
]

export default function FeesPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel" | "accountant">("accountant")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [feeTypeFilter, setFeeTypeFilter] = useState("all")

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

  const filteredRecords = mockFeeRecords.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesFeeType = feeTypeFilter === "all" || record.feeType.toLowerCase() === feeTypeFilter

    return matchesSearch && matchesStatus && matchesFeeType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const totalAmount = filteredRecords.reduce((sum, record) => sum + record.amount, 0)
  const paidAmount = filteredRecords.filter((r) => r.status === "paid").reduce((sum, record) => sum + record.amount, 0)
  const pendingAmount = totalAmount - paidAmount

  return (
    <AccessControl allowedRoles={["accountant", "administrator"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage student fee payments and records</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{filteredRecords.length} fee records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredRecords.filter((r) => r.status === "paid").length} payments received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredRecords.filter((r) => r.status !== "paid").length} pending payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
              <CardDescription>Search and filter student fee records</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tuition">Tuition</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Fee Records Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.studentName}</div>
                            <div className="text-sm text-muted-foreground">{record.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{record.department}</div>
                            <div className="text-sm text-muted-foreground">Year {record.year}</div>
                          </div>
                        </TableCell>
                        <TableCell>{record.feeType}</TableCell>
                        <TableCell className="font-medium">₹{record.amount.toLocaleString()}</TableCell>
                        <TableCell>{record.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            {getStatusBadge(record.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {record.status === "paid" && record.receiptNumber && (
                              <Button variant="outline" size="sm">
                                <Receipt className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            )}
                            {record.status !== "paid" && <Button size="sm">Mark Paid</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No fee records found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AccessControl>
  )
}
