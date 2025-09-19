"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, User } from "lucide-react"

const mockIssuedBooks = [
  {
    id: 1,
    bookTitle: "Data Structures and Algorithms",
    studentName: "John Doe",
    studentId: "STU2024001",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "Active",
  },
  {
    id: 2,
    bookTitle: "Engineering Mathematics",
    studentName: "Sarah Johnson",
    studentId: "STU2024002",
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
    status: "Overdue",
  },
  {
    id: 3,
    bookTitle: "Digital Electronics",
    studentName: "Michael Brown",
    studentId: "STU2024003",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    status: "Active",
  },
]

export default function IssuedRecords() {
  const [searchTerm, setSearchTerm] = useState("")
  const [records] = useState(mockIssuedBooks)

  const filteredRecords = records.filter(
    (record) =>
      record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Overdue":
        return "destructive"
      case "Returned":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <AccessControl allowedRoles={["librarian"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="librarian" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Issued Records</h1>
                <p className="text-muted-foreground">Track all issued books with student details</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Issued Books</CardTitle>
                <CardDescription>Find records by book title, student name, or ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issued records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issued Books</CardTitle>
                <CardDescription>{filteredRecords.length} records found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                              <h3 className="font-medium text-balance">{record.bookTitle}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {record.studentName} ({record.studentId})
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(record.status) as any}>{record.status}</Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              <div>Issued: {new Date(record.issueDate).toLocaleDateString()}</div>
                              <div>Due: {new Date(record.dueDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
