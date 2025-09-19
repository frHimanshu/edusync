"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText, TrendingUp, BookOpen, Users, DollarSign, Calendar, Filter } from "lucide-react"
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

interface LibraryStats {
  total_books: number
  total_copies: number
  available_books: number
  issued_books: number
  overdue_books: number
  total_students: number
  active_issuances: number
  total_fines: number
  collection_value: number
}

interface PopularBook {
  id: string
  title: string
  author: string
  category: string
  total_issues: number
  available_copies: number
  total_copies: number
}

interface DepartmentStats {
  department: string
  total_students: number
  total_issues: number
  overdue_count: number
  total_fines: number
}

const REPORT_TYPES = [
  "Book Inventory Report",
  "Issuance Summary Report",
  "Overdue Books Report",
  "Student Activity Report",
  "Department-wise Report",
  "Popular Books Report",
  "Fine Collection Report",
  "Monthly Statistics Report"
]

const DATE_RANGES = [
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last year",
  "Custom range"
]

export default function LibraryReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null)
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([])
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockReports: ReportData[] = [
          {
            id: "report1",
            title: "Monthly Book Inventory Report - January 2024",
            type: "Book Inventory Report",
            description: "Complete inventory summary for January 2024",
            generated_at: "2024-02-01T10:00:00Z",
            generated_by: "Librarian",
            file_url: "/reports/book_inventory_jan_2024.pdf",
            status: "Completed"
          },
          {
            id: "report2",
            title: "Issuance Summary Report - Q1 2024",
            type: "Issuance Summary Report",
            description: "Book issuance summary for Q1 2024",
            generated_at: "2024-04-01T14:30:00Z",
            generated_by: "Librarian",
            file_url: "/reports/issuance_summary_q1_2024.pdf",
            status: "Completed"
          },
          {
            id: "report3",
            title: "Overdue Books Report",
            type: "Overdue Books Report",
            description: "Current overdue books and fines",
            generated_at: "2024-02-15T09:15:00Z",
            generated_by: "Librarian",
            status: "Generating"
          }
        ]

        const mockLibraryStats: LibraryStats = {
          total_books: 2847,
          total_copies: 5680,
          available_books: 2340,
          issued_books: 3340,
          overdue_books: 23,
          total_students: 500,
          active_issuances: 342,
          total_fines: 1250,
          collection_value: 12500000
        }

        const mockPopularBooks: PopularBook[] = [
          {
            id: "book1",
            title: "Data Structures and Algorithms",
            author: "Thomas H. Cormen",
            category: "Computer Science",
            total_issues: 45,
            available_copies: 8,
            total_copies: 15
          },
          {
            id: "book2",
            title: "Engineering Mathematics",
            author: "K.A. Stroud",
            category: "Mathematics",
            total_issues: 38,
            available_copies: 12,
            total_copies: 20
          },
          {
            id: "book3",
            title: "Introduction to Database Systems",
            author: "C.J. Date",
            category: "Computer Science",
            total_issues: 32,
            available_copies: 10,
            total_copies: 10
          }
        ]

        const mockDepartmentStats: DepartmentStats[] = [
          {
            department: "Computer Science Engineering",
            total_students: 150,
            total_issues: 450,
            overdue_count: 8,
            total_fines: 400
          },
          {
            department: "Electronics Engineering",
            total_students: 120,
            total_issues: 320,
            overdue_count: 5,
            total_fines: 250
          },
          {
            department: "Mechanical Engineering",
            total_students: 100,
            total_issues: 280,
            overdue_count: 6,
            total_fines: 300
          }
        ]

        setReports(mockReports)
        setLibraryStats(mockLibraryStats)
        setPopularBooks(mockPopularBooks)
        setDepartmentStats(mockDepartmentStats)
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
        generated_by: user?.name || "Librarian",
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
          <h1 className="text-3xl font-bold">Library Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage library reports and statistics</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryStats?.total_books || 0}</div>
            <p className="text-xs text-gray-600">Unique titles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Copies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{libraryStats?.total_copies || 0}</div>
            <p className="text-xs text-gray-600">Physical copies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Issuances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{libraryStats?.active_issuances || 0}</div>
            <p className="text-xs text-gray-600">Currently issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(libraryStats?.collection_value || 0)}</div>
            <p className="text-xs text-gray-600">Total worth</p>
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
        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Most Popular Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.map((book, index) => (
                <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-xs text-gray-500">{book.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{book.total_issues} issues</div>
                    <div className="text-xs text-gray-500">{book.available_copies}/{book.total_copies} available</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Department Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.department} className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">{dept.department}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Students:</span>
                      <span className="ml-2 font-medium">{dept.total_students}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Issues:</span>
                      <span className="ml-2 font-medium">{dept.total_issues}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Overdue:</span>
                      <span className="ml-2 font-medium text-red-600">{dept.overdue_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fines:</span>
                      <span className="ml-2 font-medium text-yellow-600">{formatCurrency(dept.total_fines)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Library Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Library Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{libraryStats?.available_books || 0}</div>
              <div className="text-sm text-gray-600">Available Books</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{libraryStats?.issued_books || 0}</div>
              <div className="text-sm text-gray-600">Issued Books</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{libraryStats?.overdue_books || 0}</div>
              <div className="text-sm text-gray-600">Overdue Books</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(libraryStats?.total_fines || 0)}</div>
              <div className="text-sm text-gray-600">Outstanding Fines</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
