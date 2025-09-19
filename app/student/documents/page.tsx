"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface StudentDocument {
  id: string
  document_type: string
  document_name: string
  file_url?: string
  file_size?: number
  mime_type?: string
  uploaded_by?: string
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  created_at: string
  uploaded_by_name?: string
  verified_by_name?: string
}

export default function StudentDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [loading, setLoading] = useState(true)
  // Students can only view documents, not upload them

  const documentTypes = [
    { value: "transcript", label: "Academic Transcript" },
    { value: "certificate", label: "Certificate" },
    { value: "id_card", label: "ID Card" },
    { value: "photo", label: "Passport Photo" },
    { value: "birth_certificate", label: "Birth Certificate" },
    { value: "aadhar_card", label: "Aadhar Card" },
    { value: "pan_card", label: "PAN Card" },
    { value: "bank_details", label: "Bank Details" },
    { value: "medical_certificate", label: "Medical Certificate" },
    { value: "other", label: "Other" }
  ]

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        const { data: documentsData, error: documentsError } = await supabase
          .from("student_documents")
          .select(`
            *,
            users!student_documents_uploaded_by_fkey(first_name, last_name),
            users!student_documents_verified_by_fkey(first_name, last_name)
          `)
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })

        if (documentsError) {
          console.error("Error fetching documents:", documentsError)
          return
        }

        if (documentsData) {
          const formattedDocuments = documentsData.map(doc => ({
            ...doc,
            uploaded_by_name: doc.users ? 
              `${doc.users.first_name} ${doc.users.last_name}` : 
              'Self',
            verified_by_name: doc.users ? 
              `${doc.users.first_name} ${doc.users.last_name}` : 
              undefined
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

  // Upload functionality removed - students can only view documents

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-600" />
    )
  }

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type)
    return docType ? docType.label : type
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
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-gray-600">Manage your academic and personal documents</p>
        </div>
        {/* Students can only view documents, not upload them */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-800">Document Upload Policy</p>
          <p>Students can only view their documents. To upload new documents, please contact the accounts department.</p>
        </div>
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
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.is_verified).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => !d.is_verified).length}
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* Documents List */}
            <Card>
              <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Document Library
          </CardTitle>
          <CardDescription>All your uploaded documents and their verification status</CardDescription>
              </CardHeader>
              <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getVerificationIcon(document.is_verified)}
                              <div>
                      <h4 className="font-medium">{document.document_name}</h4>
                      <p className="text-sm text-gray-600">
                        {getDocumentTypeLabel(document.document_type)}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Uploaded: {formatDate(document.created_at)}</span>
                        <span>Size: {formatFileSize(document.file_size)}</span>
                        {document.verified_at && (
                          <span>Verified: {formatDate(document.verified_at)}</span>
                        )}
                              </div>
                            </div>
                            </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getVerificationColor(document.is_verified)}>
                      {document.is_verified ? 'Verified' : 'Pending'}
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload your first document to get started</p>
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
            <li>• Students can only view their documents</li>
            <li>• Document uploads must be done through the accounts department</li>
            <li>• All documents are reviewed and verified by the accounts department</li>
            <li>• Verified documents are marked with a green checkmark</li>
            <li>• Contact the accounts department to upload new documents</li>
            <li>• Contact the accounts department for any document-related queries</li>
          </ul>
              </CardContent>
            </Card>
          </div>
  )
}