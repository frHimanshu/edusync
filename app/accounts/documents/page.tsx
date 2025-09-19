"use client"

import type React from "react"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, Search, Eye, Trash2, User } from "lucide-react"

const mockStudents = [
  { id: "STU2024001", name: "John Doe", course: "Computer Science Engineering" },
  { id: "STU2024002", name: "Sarah Johnson", course: "Electronics Engineering" },
  { id: "STU2024003", name: "Michael Brown", course: "Mechanical Engineering" },
]

const mockDocuments = [
  {
    id: 1,
    studentId: "STU2024001",
    studentName: "John Doe",
    name: "Admission Letter",
    category: "Academic",
    uploadDate: "2024-01-15",
    uploadedBy: "Admin User",
    status: "Active",
  },
  {
    id: 2,
    studentId: "STU2024002",
    studentName: "Sarah Johnson",
    name: "Fee Receipt - Semester 1",
    category: "Financial",
    uploadDate: "2024-01-20",
    uploadedBy: "Admin User",
    status: "Active",
  },
]

export default function DocumentManagement() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [documents] = useState(mockDocuments)
  const [students] = useState(mockStudents)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle document upload
    console.log("Uploading document:", {
      studentId: selectedStudent,
      name: documentName,
      category,
      description,
    })
    // Reset form
    setSelectedStudent("")
    setDocumentName("")
    setCategory("")
    setDescription("")
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "default"
      case "Financial":
        return "secondary"
      case "Hostel":
        return "outline"
      case "Personal":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <AccessControl allowedRoles={["accountant"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="accountant" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
                <p className="text-muted-foreground">Upload and manage student documents</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Student Document
                  </CardTitle>
                  <CardDescription>Add official documents for students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student">Select Student</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {student.name} ({student.id})
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Enter document name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Hostel">Hostel</SelectItem>
                          <SelectItem value="Personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add any additional notes"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Upload File</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your file here, or click to browse
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supported formats: PDF, DOC, DOCX, JPG, PNG
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Document management overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{documents.length}</div>
                      <div className="text-sm text-muted-foreground">Total Documents</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        {new Set(documents.map((d) => d.studentId)).size}
                      </div>
                      <div className="text-sm text-muted-foreground">Students with Documents</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Documents by Category</h4>
                    <div className="space-y-2">
                      {["Academic", "Financial", "Hostel", "Personal"].map((cat) => {
                        const count = documents.filter((d) => d.category === cat).length
                        return (
                          <div key={cat} className="flex items-center justify-between">
                            <Badge variant={getCategoryColor(cat) as any}>{cat}</Badge>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Recently uploaded student documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, ID, or document name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-medium text-balance">{document.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {document.studentName} ({document.studentId})
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getCategoryColor(document.category) as any} className="text-xs">
                                {document.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{document.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
