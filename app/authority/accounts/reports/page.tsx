"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText, TrendingUp, Users, DollarSign, Calendar, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ReportData {
  id: string
  title: string
  type: string
  description: string
  generated_at: string
  generated_by: string
  file_url?: string
  status: string
}

interface FeeSummary {
  total_fees: number
  total_paid: number
  total_pending: number
  overdue_count: number
  collection_rate: number
}

interface StudentStats {
  total_students: number
  active_students: number
  graduated_students: number
  new_registrations: number
}

const REPORT_TYPES = [
  "Fee Collection Report",
  "Student Registration Report",
  "Document Verification Report",
  "Financial Summary",
  "Department-wise Report",
  "Monthly Collection Report",
  "Outstanding Fees Report",
  "Custom Report"
]

const DATE_RANGES = [
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last year",
  "Custom range"
]

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [feeSummary, setFeeSummary] = useState<FeeSummary | null>(null)
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockReports: ReportData[] = [
          {
            id: "report1",
            title: "Monthly Fee Collection Report - January 2024",
            type: "Fee Collection Report",
            description: "Complete fee collection summary for January 2024",
            generated_at: "2024-02-01T10:00:00Z",
            generated_by: "Accountant",
            file_url: "/reports/fee_collection_jan_2024.pdf",
            status: "Completed"
          },
          {
            id: "report2",
            title: "Student Registration Report - Q1 2024",
            type: "Student Registration Report",
            description: "New student registrations for Q1 2024",
            generated_at: "2024-04-01T14:30:00Z",
            generated_by: "Accountant",
            file_url: "/reports/student_registration_q1_2024.pdf",
            status: "Completed"
          },
          {
            id: "report3",
            title: "Document Verification Status",
            type: "Document Verification Report",
            description: "Current status of all student documents",
            generated_at: "2024-02-15T09:15:00Z",
            generated_by: "Accountant",
            status: "Generating"
          }
        ]

        const mockFeeSummary: FeeSummary = {
          total_fees: 2500000,
          total_paid: 2000000,
          total_pending: 500000,
          overdue_count: 25,
          collection_rate: 80
        }

        const mockStudentStats: StudentStats = {
          total_students: 500,
          active_students: 450,
          graduated_students: 50,
          new_registrations: 75
        }

        setReports(mockReports)
        setFeeSummary(mockFeeSummary)
        setStudentStats(mockStudentStats)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load reports data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      toast.error("Please select a report type")
      return
    }

    setGenerating(true)

    try {
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${selectedReportType} - ${new Date().toLocaleDateString()}`,
        type: selectedReportType,
        description: `Generated ${selectedReportType.toLowerCase()} for ${selectedDateRange || "current period"}`,
        generated_at: new Date().toISOString(),
        generated_by: user?.name || "Accountant",
        status: "Generating"
      }

      setReports(prev => [newReport, ...prev])
      toast.success("Report generation started")

      // Simulate report generation
      setTimeout(() => {
        setReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { 
                ...report, 
                status: "Completed",
                file_url: `/reports/${selectedReportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`
              }
            : report
        ))
        toast.success("Report generated successfully")
      }, 3000)

    } catch (error) {
      console.error("Error generating report:", error)
      toast.error("Failed to generate report")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadReport = (report: ReportData) => {
    if (report.file_url) {
      // In a real app, this would trigger a download
      toast.success(`Downloading ${report.title}`)
    } else {
      toast.error("Report file not available")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "generating":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage financial and student reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(feeSummary?.total_fees || 0)}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{feeSummary?.collection_rate || 0}%</div>
            <p className="text-xs text-gray-600">Current period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats?.total_students || 0}</div>
            <p className="text-xs text-gray-600">All departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(feeSummary?.total_pending || 0)}</div>
            <p className="text-xs text-gray-600">Outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Generate New Report
          </CardTitle>
          <CardDescription>Create custom reports for analysis and record keeping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type *</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateReport}
                disabled={generating || !selectedReportType}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                {generating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
          {selectedDateRange === "Custom range" && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Recent Reports ({reports.length})
          </CardTitle>
          <CardDescription>Generated reports and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Type: {report.type}</span>
                          <span>Generated: {formatDate(report.generated_at)}</span>
                          <span>By: {report.generated_by}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {report.status === "Completed" && report.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {report.status === "Generating" && (
                      <div className="flex items-center text-sm text-yellow-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        Generating...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-600">Generate your first report to get started with analytics.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Fee Collection Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Fees:</span>
                <span className="font-medium">{formatCurrency(feeSummary?.total_fees || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Collected:</span>
                <span className="font-medium text-green-600">{formatCurrency(feeSummary?.total_paid || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium text-yellow-600">{formatCurrency(feeSummary?.total_pending || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue Records:</span>
                <span className="font-medium text-red-600">{feeSummary?.overdue_count || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${feeSummary?.collection_rate || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Collection Rate: {feeSummary?.collection_rate || 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Student Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Students:</span>
                <span className="font-medium">{studentStats?.total_students || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Students:</span>
                <span className="font-medium text-green-600">{studentStats?.active_students || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Graduated:</span>
                <span className="font-medium text-blue-600">{studentStats?.graduated_students || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>New Registrations:</span>
                <span className="font-medium text-purple-600">{studentStats?.new_registrations || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
