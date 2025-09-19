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
import { BookOpen, Search, Filter, Plus, Eye, CheckCircle, Clock, AlertTriangle, User, Calendar, Hash, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface BookIssuance {
  id: string
  book_id: string
  book_title: string
  book_isbn: string
  student_id: string
  student_name: string
  student_id_number: string
  issued_date: string
  due_date: string
  return_date?: string
  status: string
  fine_amount?: number
  issued_by: string
  returned_by?: string
  remarks?: string
}

interface Book {
  id: string
  title: string
  isbn: string
  available_copies: number
  total_copies: number
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  semester: number
  department_name: string
}

const ISSUANCE_STATUS = [
  "All",
  "Issued",
  "Returned",
  "Overdue",
  "Lost"
]

const MAX_ISSUANCE_DAYS = 14
const FINE_PER_DAY = 5

export default function BookIssuance() {
  const { user } = useAuth()
  const [issuances, setIssuances] = useState<BookIssuance[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [issueOpen, setIssueOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [selectedIssuance, setSelectedIssuance] = useState<BookIssuance | null>(null)

  // Form state
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState("")
  const [remarks, setRemarks] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Return form state
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0])
  const [fineAmount, setFineAmount] = useState("")
  const [returnRemarks, setReturnRemarks] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockIssuances: BookIssuance[] = [
          {
            id: "issue1",
            book_id: "book1",
            book_title: "Data Structures and Algorithms",
            book_isbn: "978-0262033848",
            student_id: "student1",
            student_name: "John Doe",
            student_id_number: "STU2024001",
            issued_date: "2024-01-15",
            due_date: "2024-01-29",
            status: "Issued",
            issued_by: "Librarian"
          },
          {
            id: "issue2",
            book_id: "book2",
            book_title: "Introduction to Database Systems",
            book_isbn: "978-0321197849",
            student_id: "student2",
            student_name: "Sarah Johnson",
            student_id_number: "STU2024002",
            issued_date: "2024-01-10",
            due_date: "2024-01-24",
            return_date: "2024-01-22",
            status: "Returned",
            issued_by: "Librarian",
            returned_by: "Librarian"
          },
          {
            id: "issue3",
            book_id: "book3",
            book_title: "Engineering Mathematics",
            book_isbn: "978-1137031204",
            student_id: "student3",
            student_name: "Michael Brown",
            student_id_number: "STU2024003",
            issued_date: "2024-01-05",
            due_date: "2024-01-19",
            status: "Overdue",
            fine_amount: 25,
            issued_by: "Librarian",
            remarks: "Student contacted, will return soon"
          }
        ]

        const mockBooks: Book[] = [
          { id: "book1", title: "Data Structures and Algorithms", isbn: "978-0262033848", available_copies: 7, total_copies: 15 },
          { id: "book2", title: "Introduction to Database Systems", isbn: "978-0321197849", available_copies: 10, total_copies: 10 },
          { id: "book3", title: "Engineering Mathematics", isbn: "978-1137031204", available_copies: 11, total_copies: 20 }
        ]

        const mockStudents: Student[] = [
          { id: "student1", student_id: "STU2024001", first_name: "John", last_name: "Doe", semester: 3, department_name: "Computer Science Engineering" },
          { id: "student2", student_id: "STU2024002", first_name: "Sarah", last_name: "Johnson", semester: 5, department_name: "Electronics Engineering" },
          { id: "student3", student_id: "STU2024003", first_name: "Michael", last_name: "Brown", semester: 7, department_name: "Mechanical Engineering" }
        ]

        setIssuances(mockIssuances)
        setBooks(mockBooks)
        setStudents(mockStudents)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load issuance data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  useEffect(() => {
    if (issueDate) {
      const issue = new Date(issueDate)
      const due = new Date(issue)
      due.setDate(due.getDate() + MAX_ISSUANCE_DAYS)
      setDueDate(due.toISOString().split('T')[0])
    }
  }, [issueDate])

  const handleIssueBook = async () => {
    if (!selectedBook || !selectedStudent || !issueDate || !dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const book = books.find(b => b.id === selectedBook)
      const student = students.find(s => s.id === selectedStudent)
      
      if (!book || !student) {
        toast.error("Invalid book or student selection")
        return
      }

      if (book.available_copies <= 0) {
        toast.error("No copies available for this book")
        return
      }

      const newIssuance: BookIssuance = {
        id: Date.now().toString(),
        book_id: selectedBook,
        book_title: book.title,
        book_isbn: book.isbn,
        student_id: selectedStudent,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id_number: student.student_id,
        issued_date: issueDate,
        due_date: dueDate,
        status: "Issued",
        issued_by: user?.name || "Librarian",
        remarks
      }

      setIssuances(prev => [newIssuance, ...prev])
      
      // Update book availability
      setBooks(prev => prev.map(b => 
        b.id === selectedBook 
          ? { ...b, available_copies: b.available_copies - 1 }
          : b
      ))

      toast.success("Book issued successfully")
      setIssueOpen(false)
      resetIssueForm()
    } catch (error) {
      console.error("Error issuing book:", error)
      toast.error("Failed to issue book")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReturnBook = async () => {
    if (!selectedIssuance || !returnDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const returnDateObj = new Date(returnDate)
      const dueDateObj = new Date(selectedIssuance.due_date)
      const daysOverdue = Math.max(0, Math.ceil((returnDateObj.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24)))
      const calculatedFine = daysOverdue * FINE_PER_DAY

      const updatedIssuance = {
        ...selectedIssuance,
        return_date: returnDate,
        status: "Returned",
        returned_by: user?.name || "Librarian",
        fine_amount: calculatedFine,
        remarks: returnRemarks || selectedIssuance.remarks
      }

      setIssuances(prev => prev.map(issuance => 
        issuance.id === selectedIssuance.id ? updatedIssuance : issuance
      ))

      // Update book availability
      setBooks(prev => prev.map(book => 
        book.id === selectedIssuance.book_id 
          ? { ...book, available_copies: book.available_copies + 1 }
          : book
      ))

      toast.success("Book returned successfully")
      setReturnOpen(false)
      setSelectedIssuance(null)
      resetReturnForm()
    } catch (error) {
      console.error("Error returning book:", error)
      toast.error("Failed to return book")
    } finally {
      setSubmitting(false)
    }
  }

  const openReturnDialog = (issuance: BookIssuance) => {
    setSelectedIssuance(issuance)
    setReturnDate(new Date().toISOString().split('T')[0])
    setFineAmount("")
    setReturnRemarks("")
    setReturnOpen(true)
  }

  const resetIssueForm = () => {
    setSelectedBook("")
    setSelectedStudent("")
    setIssueDate(new Date().toISOString().split('T')[0])
    setRemarks("")
  }

  const resetReturnForm = () => {
    setReturnDate(new Date().toISOString().split('T')[0])
    setFineAmount("")
    setReturnRemarks("")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "issued":
        return "bg-blue-100 text-blue-800"
      case "returned":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "lost":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "issued":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "returned":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "lost":
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const filteredIssuances = issuances.filter(issuance => {
    const matchesSearch = 
      issuance.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issuance.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issuance.student_id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issuance.book_isbn.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || 
      (selectedStatus === "All") ||
      (selectedStatus === "Issued" && issuance.status === "Issued") ||
      (selectedStatus === "Returned" && issuance.status === "Returned") ||
      (selectedStatus === "Overdue" && issuance.status === "Overdue") ||
      (selectedStatus === "Lost" && issuance.status === "Lost")
    
    return matchesSearch && matchesStatus
  })

  const totalIssuances = issuances.length
  const activeIssuances = issuances.filter(issuance => issuance.status === "Issued").length
  const overdueIssuances = issuances.filter(issuance => issuance.status === "Overdue").length
  const totalFines = issuances.reduce((sum, issuance) => sum + (issuance.fine_amount || 0), 0)

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
          <h1 className="text-3xl font-bold">Book Issuance</h1>
          <p className="text-gray-600">Manage book issuance and returns</p>
        </div>
        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Issue Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Book to Student</DialogTitle>
              <DialogDescription>
                Issue a book to a student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="book">Book *</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.filter(book => book.available_copies > 0).map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} ({book.available_copies} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  placeholder="Optional remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIssueOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleIssueBook}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Issuing..." : "Issue Book"}
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
            <CardTitle className="text-sm font-medium">Total Issuances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssuances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Issuances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeIssuances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueIssuances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalFines)}</div>
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
              <Label htmlFor="search">Search Issuances</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by book, student, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUANCE_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issuances List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Book Issuances ({filteredIssuances.length})
          </CardTitle>
          <CardDescription>All book issuances and returns</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredIssuances.length > 0 ? (
            <div className="space-y-4">
              {filteredIssuances.map((issuance) => (
                <div key={issuance.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{issuance.book_title}</h4>
                        <p className="text-sm text-gray-600">by {issuance.student_name}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Hash className="h-4 w-4 mr-1" />
                            {issuance.book_isbn}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {issuance.student_id_number}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Issued: {formatDate(issuance.issued_date)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {formatDate(issuance.due_date)}
                          </span>
                          {issuance.return_date && (
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Returned: {formatDate(issuance.return_date)}
                            </span>
                          )}
                        </div>
                        {issuance.remarks && (
                          <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                            <strong>Remarks:</strong> {issuance.remarks}
                          </div>
                        )}
                        {issuance.fine_amount && issuance.fine_amount > 0 && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            <strong>Fine:</strong> {formatCurrency(issuance.fine_amount)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(issuance.status)}
                          <Badge className={getStatusColor(issuance.status)}>
                            {issuance.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Issued by: {issuance.issued_by}
                        </div>
                        {issuance.returned_by && (
                          <div className="text-xs text-gray-500">
                            Returned by: {issuance.returned_by}
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
                    {issuance.status === "Issued" && (
                      <Button
                        size="sm"
                        onClick={() => openReturnDialog(issuance)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Return
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issuances found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus
                  ? "Try adjusting your filters to see more issuances."
                  : "No books have been issued yet. Issue your first book to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Dialog */}
      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Return book for {selectedIssuance?.student_name}
            </DialogDescription>
          </DialogHeader>
          {selectedIssuance && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Book:</span>
                  <span className="font-medium">{selectedIssuance.book_title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Student:</span>
                  <span className="font-medium">{selectedIssuance.student_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Due Date:</span>
                  <span className="font-medium">{formatDate(selectedIssuance.due_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Issued Date:</span>
                  <span className="font-medium">{formatDate(selectedIssuance.issued_date)}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="returnDate">Return Date *</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="returnRemarks">Return Remarks</Label>
                <Input
                  id="returnRemarks"
                  placeholder="Condition of book, etc."
                  value={returnRemarks}
                  onChange={(e) => setReturnRemarks(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setReturnOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleReturnBook}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Returning..." : "Return Book"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
