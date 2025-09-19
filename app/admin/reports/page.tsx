"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { HostelOccupancyMap } from "@/components/hostel-occupancy-map"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { FileText, Download, Calendar } from "lucide-react"

const mockAdmissionData = [
  { department: "Computer Science", students: 120 },
  { department: "Electronics", students: 95 },
  { department: "Mechanical", students: 110 },
  { department: "Civil", students: 85 },
  { department: "Chemical", students: 70 },
]

const mockHostelData = [
  { name: "Occupied", value: 420, color: "#3b82f6" },
  { name: "Vacant", value: 80, color: "#e5e7eb" },
]

const mockFeeData = [
  { date: "Week 1", amount: 125000 },
  { date: "Week 2", amount: 180000 },
  { date: "Week 3", amount: 220000 },
  { date: "Week 4", amount: 195000 },
]

const mockReports = [
  {
    id: 1,
    title: "Student Enrollment Report",
    description: "Comprehensive report on student admissions and enrollment statistics",
    type: "Academic",
    generatedDate: "2024-03-10",
    status: "Ready",
  },
  {
    id: 2,
    title: "Fee Collection Summary",
    description: "Monthly fee collection report with payment status breakdown",
    type: "Financial",
    generatedDate: "2024-03-08",
    status: "Ready",
  },
  {
    id: 3,
    title: "Hostel Occupancy Analysis",
    description: "Detailed analysis of hostel room occupancy and utilization",
    type: "Infrastructure",
    generatedDate: "2024-03-05",
    status: "Ready",
  },
  {
    id: 4,
    title: "Academic Performance Report",
    description: "Student performance metrics across all departments",
    type: "Academic",
    generatedDate: "2024-03-03",
    status: "Processing",
  },
]

export default function ReportsPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel">("admin")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as "student" | "teacher" | "admin" | "hostel"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "default"
      case "Processing":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Academic":
        return "bg-blue-100 text-blue-800"
      case "Financial":
        return "bg-green-100 text-green-800"
      case "Infrastructure":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and view comprehensive institutional reports</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ec">Electronics</SelectItem>
                    <SelectItem value="me">Mechanical</SelectItem>
                    <SelectItem value="ce">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Admissions by Department */}
          <Card>
            <CardHeader>
              <CardTitle>New Admissions by Department</CardTitle>
              <CardDescription>Current semester enrollment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAdmissionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hostel Occupancy */}
          <HostelOccupancyMap />

          {/* Fee Collection Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fee Collection Over Last 30 Days</CardTitle>
              <CardDescription>Weekly fee collection trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockFeeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]} />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Pre-generated reports ready for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{report.title}</h3>
                      <Badge variant={getStatusColor(report.status) as any}>{report.status}</Badge>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Generated: {report.generatedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "Ready" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                    {report.status === "Processing" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
