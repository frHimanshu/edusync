"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText, TrendingUp, Users, Building2, Calendar, DollarSign, Target, Award } from "lucide-react"
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

interface PlacementStats {
  total_students: number
  placed_students: number
  placement_rate: number
  total_companies: number
  total_drives: number
  average_package: number
  highest_package: number
  department_wise_placements: DepartmentPlacement[]
  company_wise_placements: CompanyPlacement[]
}

interface DepartmentPlacement {
  department: string
  total_students: number
  placed_students: number
  placement_rate: number
  average_package: number
}

interface CompanyPlacement {
  company_name: string
  total_placements: number
  average_package: number
  last_drive_date: string
}

const REPORT_TYPES = [
  "Placement Summary Report",
  "Department-wise Placement Report",
  "Company-wise Placement Report",
  "Package Analysis Report",
  "Drive Performance Report",
  "Student Placement History",
  "Monthly Placement Report",
  "Annual Placement Report"
]

const DATE_RANGES = [
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last year",
  "Custom range"
]

export default function PlacementReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [placementStats, setPlacementStats] = useState<PlacementStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockReports: ReportData[] = [
          {
            id: "report1",
            title: "Annual Placement Report 2023-24",
            type: "Annual Placement Report",
            description: "Complete placement summary for academic year 2023-24",
            generated_at: "2024-02-01T10:00:00Z",
            generated_by: "T&P Officer",
            file_url: "/reports/annual_placement_2023_24.pdf",
            status: "Completed"
          },
          {
            id: "report2",
            title: "Department-wise Placement Analysis - Q1 2024",
            type: "Department-wise Placement Report",
            description: "Placement analysis by department for Q1 2024",
            generated_at: "2024-04-01T14:30:00Z",
            generated_by: "T&P Officer",
            file_url: "/reports/department_placement_q1_2024.pdf",
            status: "Completed"
          },
          {
            id: "report3",
            title: "Company Performance Report",
            type: "Company-wise Placement Report",
            description: "Performance analysis of all partner companies",
            generated_at: "2024-02-15T09:15:00Z",
            generated_by: "T&P Officer",
            status: "Generating"
          }
        ]

        const mockPlacementStats: PlacementStats = {
          total_students: 500,
          placed_students: 425,
          placement_rate: 85,
          total_companies: 25,
          total_drives: 45,
          average_package: 850000,
          highest_package: 1800000,
          department_wise_placements: [
            {
              department: "Computer Science Engineering",
              total_students: 150,
              placed_students: 135,
              placement_rate: 90,
              average_package: 950000
            },
            {
              department: "Electronics Engineering",
              total_students: 120,
              placed_students: 102,
              placement_rate: 85,
              average_package: 800000
            },
            {
              department: "Mechanical Engineering",
              total_students: 100,
              placed_students: 85,
              placement_rate: 85,
              average_package: 750000
            },
            {
              department: "Civil Engineering",
              total_students: 80,
              placed_students: 68,
              placement_rate: 85,
              average_package: 700000
            },
            {
              department: "Electrical Engineering",
              total_students: 50,
              placed_students: 35,
              placement_rate: 70,
              average_package: 750000
            }
          ],
          company_wise_placements: [
            {
              company_name: "Tech Corp",
              total_placements: 45,
              average_package: 1200000,
              last_drive_date: "2024-01-25"
            },
            {
              company_name: "Global Finance Ltd",
              total_placements: 35,
              average_package: 1500000,
              last_drive_date: "2024-01-20"
            },
            {
              company_name: "Innovation Labs",
              total_placements: 28,
              average_package: 1000000,
              last_drive_date: "2024-02-02"
            },
            {
              company_name: "DataTech Solutions",
              total_placements: 25,
              average_package: 900000,
              last_drive_date: "2024-01-15"
            }
          ]
        }

        setReports(mockReports)
        setPlacementStats(mockPlacementStats)
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
        generated_by: user?.name || "T&P Officer",
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
          <h1 className="text-3xl font-bold">Placement Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage placement reports and statistics</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{placementStats?.total_students || 0}</div>
            <p className="text-xs text-gray-600">Eligible for placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{placementStats?.placement_rate || 0}%</div>
            <p className="text-xs text-gray-600">Successfully placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(placementStats?.average_package || 0)}</div>
            <p className="text-xs text-gray-600">Annual CTC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(placementStats?.highest_package || 0)}</div>
            <p className="text-xs text-gray-600">Annual CTC</p>
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

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department-wise Placements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Department-wise Placements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {placementStats?.department_wise_placements.map((dept) => (
                <div key={dept.department} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.department}</h4>
                    <Badge variant="outline">{dept.placement_rate}%</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Students:</span>
                      <span className="ml-2 font-medium">{dept.placed_students}/{dept.total_students}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Package:</span>
                      <span className="ml-2 font-medium">{formatCurrency(dept.average_package)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${dept.placement_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Top Performing Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {placementStats?.company_wise_placements.map((company, index) => (
                <div key={company.company_name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{company.company_name}</h4>
                      <p className="text-sm text-gray-600">{company.total_placements} placements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(company.average_package)}</div>
                    <div className="text-xs text-gray-500">avg package</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Placement Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{placementStats?.placed_students || 0}</div>
              <div className="text-sm text-gray-600">Students Placed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{placementStats?.total_companies || 0}</div>
              <div className="text-sm text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{placementStats?.total_drives || 0}</div>
              <div className="text-sm text-gray-600">Placement Drives</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{placementStats?.placement_rate || 0}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
