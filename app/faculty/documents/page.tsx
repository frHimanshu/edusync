"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Upload, Download, Eye, Plus, Search, Filter, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface FacultyDocument {
  id: string
  document_type: string
  document_name: string
  file_url?: string
  file_size?: number
  mime_type?: string
  description?: string
  uploaded_by: string
  uploaded_by_name?: string
  created_at: string
  updated_at?: string
}

const DOCUMENT_TYPES = [
  "Syllabus",
  "Lecture Notes",
  "Assignment",
  "Quiz Paper",
  "Exam Paper",
  "Reference Material",
  "Lab Manual",
  "Project Guidelines",
  "Course Outline",
  "Other"
]

export default function FacultyDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<FacultyDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch faculty documents
        const { data: documentsData, error: documentsError } = await supabase
          .from("faculty_documents")
          .select(`
            *,
            users!faculty_documents_uploaded_by_fkey(first_name, last_name)
          `)
          .eq("faculty_id", user.id)
          .order("created_at", { ascending: false })

        if (documentsError) {
          console.error("Error fetching documents:", documentsError)
          // For demo purposes, use mock data
          const mockDocuments: FacultyDocument[] = [
            {
              id: "1",
              document_type: "Syllabus",
              document_name: "Data Structures Syllabus 2024",
              file_url: "#",
              file_size: 1024000,
              mime_type: "application/pdf",
              description: "Complete syllabus for Data Structures course",
              uploaded_by: user.id,
              uploaded_by_name: "Dr. John Smith",
              created_at: "2024-01-15T10:00:00Z"
            },
            {
              id: "2",
              document_type: "Lecture Notes",
              document_name: "Introduction to Algorithms - Chapter 1",
              file_url: "#",
              file_size: 2048000,
              mime_type: "application/pdf",
              description: "Lecture notes covering basic algorithm concepts",
              uploaded_by: user.id,
              uploaded_by_name: "Dr. John Smith",
              created_at: "2024-01-20T14:30:00Z"
            }
          ]
          setDocuments(mockDocuments)
          return
        }

        if (documentsData) {
          const formattedDocuments = documentsData.map(doc => ({
            ...doc,
            uploaded_by_name: doc.users ? 
              `${doc.users.first_name} ${doc.users.last_name}` : 
              'Unknown'
          }))
          setDocuments(formattedDocuments)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Failed to load documents")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDocuments()
    }
  }, [user])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDocumentName(file.name)
    }
  }

  const handleUpload = async () => {
    if (!user || !selectedFile || !documentType || !documentName) {
      toast.error("Please fill in all required fields and select a file")
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `faculty/${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('faculty-documents')
        .upload(fileName, selectedFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('faculty-documents')
        .getPublicUrl(fileName)

      // Save document record
      const { error: insertError } = await supabase
        .from("faculty_documents")
        .insert({
          faculty_id: user.id,
          document_type: documentType,
          document_name: documentName,
          file_url: urlData.publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          description: description || null,
          uploaded_by: user.id
        })

      if (insertError) {
        throw insertError
      }

      toast.success("Document uploaded successfully")
      setUploadOpen(false)
      setSelectedFile(null)
      setDocumentType("")
      setDocumentName("")
      setDescription("")
      
      // Refresh documents list
      window.location.reload()
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error("Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("faculty_documents")
        .delete()
        .eq("id", documentId)

      if (error) {
        throw error
      }

      toast.success("Document deleted successfully")
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "syllabus":
        return "bg-blue-100 text-blue-800"
      case "lecture notes":
        return "bg-green-100 text-green-800"
      case "assignment":
        return "bg-purple-100 text-purple-800"
      case "quiz paper":
        return "bg-orange-100 text-orange-800"
      case "exam paper":
        return "bg-red-100 text-red-800"
      case "reference material":
        return "bg-yellow-100 text-yellow-800"
      case "lab manual":
        return "bg-pink-100 text-pink-800"
      case "project guidelines":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = !selectedType || doc.document_type === selectedType
    
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-gray-600">Manage your course documents and materials</p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload course materials and documents for your students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the document (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="file">Select File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
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
                  disabled={uploading || !selectedFile || !documentType || !documentName}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(documents.map(d => d.document_type)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0))}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Documents</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="typeFilter">Document Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
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
            Document Library ({filteredDocuments.length})
          </CardTitle>
          <CardDescription>All your uploaded documents and course materials</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{document.document_name}</h4>
                      <p className="text-sm text-gray-600">{document.document_type}</p>
                      {document.description && (
                        <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(document.created_at)}
                        </span>
                        <span>Size: {formatFileSize(document.file_size)}</span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {document.uploaded_by_name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDocumentTypeColor(document.document_type)}>
                      {document.document_type}
                    </Badge>
                    {document.file_url && (
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.file_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = document.file_url!
                            link.download = document.document_name
                            link.click()
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents found</p>
              <p className="text-sm">
                {searchTerm || selectedType
                  ? "Try adjusting your filters to see more documents."
                  : "Upload your first document to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <FileText className="mr-2 h-5 w-5" />
            Document Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, JPEG, PNG</li>
            <li>• Maximum file size: 50MB per document</li>
            <li>• Documents are accessible to students enrolled in your courses</li>
            <li>• Organize documents by type for better student navigation</li>
            <li>• Keep documents updated and current</li>
            <li>• Use descriptive names and descriptions for better searchability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
