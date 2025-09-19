"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Search, Filter, Plus, Eye, Download, Upload, CheckCircle, Clock, AlertCircle, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface StudentDocument {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  document_type: string
  document_name: string
  file_name: string
  file_size: number
  file_url: string
  uploaded_at: string
  verified: boolean
  verified_at?: string
  verified_by?: string
  remarks?: string
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  semester: number
  department_name: string
}

const DOCUMENT_TYPES = [
  "Aadhar Card",
  "PAN Card",
  "Passport",
  "Birth Certificate",
  "10th Marksheet",
  "12th Marksheet",
  "Graduation Certificate",
  "Transfer Certificate",
  "Migration Certificate",
  "Caste Certificate",
  "Income Certificate",
  "Medical Certificate",
  "Passport Size Photo",
  "Other"
]

const VERIFICATION_STATUS = [
  "All",
  "Verified",
  "Pending",
  "Rejected"
]

export default function DocumentManagement() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockDocuments: StudentDocument[] = [
          {
            id: "doc1",
            student_id: "student1",
            student_name: "John Doe",
            student_id_number: "STU2024001",
            document_type: "Aadhar Card",
            document_name: "Aadhar Card - John Doe",
            file_name: "aadhar_john_doe.pdf",
            file_size: 1024000,
            file_url: "/documents/aadhar_john_doe.pdf",
            uploaded_at: "2024-01-15T00:00:00Z",
            verified: true,
            verified_at: "2024-01-16T00:00:00Z",
            verified_by: "Accountant"
          },
          {
            id: "doc2",
            student_id: "student1",
            student_name: "John Doe",
            student_id_number: "STU2024001",
            document_type: "10th Marksheet",
            document_name: "10th Marksheet - John Doe",
            file_name: "10th_marksheet_john_doe.pdf",
            file_size: 2048000,
            file_url: "/documents/10th_marksheet_john_doe.pdf",
            uploaded_at: "2024-01-15T00:00:00Z",
            verified: false,
            remarks: "Document quality is poor, please resubmit"
          },
          {
            id: "doc3",
            student_id: "student2",
            student_name: "Sarah Johnson",
            student_id_number: "STU2024002",
            document_type: "PAN Card",
            document_name: "PAN Card - Sarah Johnson",
            file_name: "pan_sarah_johnson.pdf",
            file_size: 512000,
            file_url: "/documents/pan_sarah_johnson.pdf",
            uploaded_at: "2024-01-20T00:00:00Z",
            verified: true,
            verified_at: "2024-01-21T00:00:00Z",
            verified_by: "Accountant"
          }
        ]

        const mockStudents: Student[] = [
          { id: "student1", student_id: "STU2024001", first_name: "John", last_name: "Doe", semester: 3, department_name: "Computer Science Engineering" },
          { id: "student2", student_id: "STU2024002", first_name: "Sarah", last_name: "Johnson", semester: 5, department_name: "Electronics Engineering" },
          { id: "student3", student_id: "STU2024003", first_name: "Michael", last_name: "Brown", semester: 7, department_name: "Mechanical Engineering" }
        ]

        setDocuments(mockDocuments)
        setStudents(mockStudents)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load document data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedStudent || !documentType || !documentName) {
      toast.error("Please fill in all required fields")
      return
    }

    setUploading(true)

    try {
      const student = students.find(s => s.id === selectedStudent)
      if (!student) {
        toast.error("Invalid student selection")
        return
      }

      const newDocument: StudentDocument = {
        id: Date.now().toString(),
        student_id: selectedStudent,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id_number: student.student_id,
        document_type: documentType,
        document_name: documentName,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_url: `/documents/${selectedFile.name}`,
        uploaded_at: new Date().toISOString(),
        verified: false
      }

      setDocuments(prev => [newDocument, ...prev])
      toast.success("Document uploaded successfully")
      setUploadOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error("Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleVerify = async (documentId: string, verified: boolean) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              verified, 
              verified_at: verified ? new Date().toISOString() : undefined,
              verified_by: verified ? user?.name || "Accountant" : undefined
            }
          : doc
      ))
      
      toast.success(verified ? "Document verified successfully" : "Document verification removed")
    } catch (error) {
      console.error("Error updating verification:", error)
      toast.error("Failed to update verification status")
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setSelectedStudent("")
    setDocumentType("")
    setDocumentName("")
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-600" />
    )
  }

  const getVerificationColor = (verified: boolean) => {
    return verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.student_id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || 
      (selectedStatus === "Verified" && doc.verified) ||
      (selectedStatus === "Pending" && !doc.verified)
    
    const matchesDocumentType = !selectedDocumentType || doc.document_type === selectedDocumentType
    
    return matchesSearch && matchesStatus && matchesDocumentType
  })

  const totalDocuments = documents.length
  const verifiedDocuments = documents.filter(doc => doc.verified).length
  const pendingDocuments = totalDocuments - verifiedDocuments
  const recentUploads = documents.filter(doc => {
    const uploadDate = new Date(doc.uploaded_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return uploadDate > weekAgo
  }).length

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
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-gray-600">Manage student documents and verification</p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Student Document</DialogTitle>
              <DialogDescription>
                Upload a document for a student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentType">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="file">File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentUploads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Documents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by student, document type, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter">Verification Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {VERIFICATION_STATUS.slice(1).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="documentTypeFilter">Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="All document types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All document types</SelectItem>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Student Documents ({filteredDocuments.length})
          </CardTitle>
          <CardDescription>All student documents and their verification status</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{document.document_name}</h4>
                        <p className="text-sm text-gray-600">{document.document_type}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {document.student_name}
                          </span>
                          <span>{document.student_id_number}</span>
                          <span>{formatFileSize(document.file_size)}</span>
                          <span>Uploaded: {formatDate(document.uploaded_at)}</span>
                        </div>
                        {document.remarks && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            <strong>Remarks:</strong> {document.remarks}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          {getVerificationIcon(document.verified)}
                          <Badge className={getVerificationColor(document.verified)}>
                            {document.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                        {document.verified && document.verified_at && (
                          <div className="text-xs text-gray-500">
                            Verified: {formatDate(document.verified_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {!document.verified ? (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(document.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(document.id, false)}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Unverify
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus || selectedDocumentType
                  ? "Try adjusting your filters to see more documents."
                  : "No documents have been uploaded yet. Upload your first document to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
