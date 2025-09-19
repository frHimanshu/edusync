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
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Copy, Calendar, User, Tag, Hash } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publisher: string
  publication_year: number
  category: string
  subcategory?: string
  total_copies: number
  available_copies: number
  location: string
  description?: string
  language: string
  pages: number
  price: number
  status: string
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Literature",
  "History",
  "Philosophy",
  "Economics",
  "Business",
  "Art & Design",
  "Other"
]

const LANGUAGES = [
  "English",
  "Hindi",
  "Sanskrit",
  "French",
  "German",
  "Spanish",
  "Other"
]

const STATUS_OPTIONS = [
  "Available",
  "Limited",
  "Out of Stock",
  "Maintenance",
  "Lost"
]

export default function BookCatalog() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [isbn, setIsbn] = useState("")
  const [publisher, setPublisher] = useState("")
  const [publicationYear, setPublicationYear] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [totalCopies, setTotalCopies] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("")
  const [pages, setPages] = useState("")
  const [price, setPrice] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockBooks: Book[] = [
          {
            id: "book1",
            title: "Data Structures and Algorithms",
            author: "Thomas H. Cormen",
            isbn: "978-0262033848",
            publisher: "MIT Press",
            publication_year: 2009,
            category: "Computer Science",
            subcategory: "Algorithms",
            total_copies: 15,
            available_copies: 8,
            location: "CS-001",
            description: "Comprehensive introduction to algorithms and data structures",
            language: "English",
            pages: 1312,
            price: 2500,
            status: "Available",
            created_at: "2024-01-15T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "book2",
            title: "Introduction to Database Systems",
            author: "C.J. Date",
            isbn: "978-0321197849",
            publisher: "Addison-Wesley",
            publication_year: 2003,
            category: "Computer Science",
            subcategory: "Database",
            total_copies: 10,
            available_copies: 0,
            location: "CS-002",
            description: "Fundamental concepts of database systems",
            language: "English",
            pages: 1024,
            price: 1800,
            status: "Out of Stock",
            created_at: "2024-01-10T00:00:00Z",
            updated_at: "2024-01-10T00:00:00Z"
          },
          {
            id: "book3",
            title: "Engineering Mathematics",
            author: "K.A. Stroud",
            isbn: "978-1137031204",
            publisher: "Palgrave Macmillan",
            publication_year: 2013,
            category: "Mathematics",
            subcategory: "Applied Mathematics",
            total_copies: 20,
            available_copies: 12,
            location: "MATH-001",
            description: "Comprehensive mathematics for engineering students",
            language: "English",
            pages: 1200,
            price: 2200,
            status: "Available",
            created_at: "2024-01-05T00:00:00Z",
            updated_at: "2024-01-05T00:00:00Z"
          }
        ]

        setBooks(mockBooks)
      } catch (error) {
        console.error("Error fetching books:", error)
        toast.error("Failed to load books")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBooks()
    }
  }, [user])

  const handleCreateBook = async () => {
    if (!title || !author || !isbn || !category || !totalCopies) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const newBook: Book = {
        id: Date.now().toString(),
        title,
        author,
        isbn,
        publisher,
        publication_year: parseInt(publicationYear) || new Date().getFullYear(),
        category,
        subcategory,
        total_copies: parseInt(totalCopies),
        available_copies: parseInt(totalCopies),
        location,
        description,
        language: language || "English",
        pages: parseInt(pages) || 0,
        price: parseInt(price) || 0,
        status: "Available",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setBooks(prev => [newBook, ...prev])
      toast.success("Book added successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating book:", error)
      toast.error("Failed to add book")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditBook = async () => {
    if (!selectedBook || !title || !author || !isbn || !category || !totalCopies) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const updatedBook = {
        ...selectedBook,
        title,
        author,
        isbn,
        publisher,
        publication_year: parseInt(publicationYear) || new Date().getFullYear(),
        category,
        subcategory,
        total_copies: parseInt(totalCopies),
        location,
        description,
        language: language || "English",
        pages: parseInt(pages) || 0,
        price: parseInt(price) || 0,
        updated_at: new Date().toISOString()
      }

      setBooks(prev => prev.map(book => 
        book.id === selectedBook.id ? updatedBook : book
      ))
      
      toast.success("Book updated successfully")
      setEditOpen(false)
      setSelectedBook(null)
      resetForm()
    } catch (error) {
      console.error("Error updating book:", error)
      toast.error("Failed to update book")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      setBooks(prev => prev.filter(book => book.id !== bookId))
      toast.success("Book deleted successfully")
    } catch (error) {
      console.error("Error deleting book:", error)
      toast.error("Failed to delete book")
    }
  }

  const openEditDialog = (book: Book) => {
    setSelectedBook(book)
    setTitle(book.title)
    setAuthor(book.author)
    setIsbn(book.isbn)
    setPublisher(book.publisher)
    setPublicationYear(book.publication_year.toString())
    setCategory(book.category)
    setSubcategory(book.subcategory || "")
    setTotalCopies(book.total_copies.toString())
    setLocation(book.location)
    setDescription(book.description || "")
    setLanguage(book.language)
    setPages(book.pages.toString())
    setPrice(book.price.toString())
    setEditOpen(true)
  }

  const resetForm = () => {
    setTitle("")
    setAuthor("")
    setIsbn("")
    setPublisher("")
    setPublicationYear("")
    setCategory("")
    setSubcategory("")
    setTotalCopies("")
    setLocation("")
    setDescription("")
    setLanguage("")
    setPages("")
    setPrice("")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800"
      case "limited":
        return "bg-yellow-100 text-yellow-800"
      case "out of stock":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-blue-100 text-blue-800"
      case "lost":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || book.category === selectedCategory
    const matchesStatus = !selectedStatus || book.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalBooks = books.length
  const availableBooks = books.filter(book => book.status === "Available").length
  const outOfStockBooks = books.filter(book => book.status === "Out of Stock").length
  const totalValue = books.reduce((sum, book) => sum + (book.price * book.total_copies), 0)

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
          <h1 className="text-3xl font-bold">Book Catalog</h1>
          <p className="text-gray-600">Manage library book collection and inventory</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Add a new book to the library catalog
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    placeholder="978-0-123456-78-9"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    placeholder="Publisher name"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="publicationYear">Publication Year</Label>
                  <Input
                    id="publicationYear"
                    type="number"
                    placeholder="2024"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  placeholder="Optional subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalCopies">Total Copies *</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    placeholder="1"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    placeholder="300"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Shelf location (e.g., CS-001)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Book description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBook}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Adding..." : "Add Book"}
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
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
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
              <Label htmlFor="search">Search Books</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title, author, ISBN, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="categoryFilter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
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

      {/* Books List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Library Collection ({filteredBooks.length})
          </CardTitle>
          <CardDescription>All books in the library catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBooks.length > 0 ? (
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Hash className="h-4 w-4 mr-1" />
                            {book.isbn}
                          </span>
                          <span className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {book.category}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {book.publisher}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {book.publication_year}
                          </span>
                          <span>Location: {book.location}</span>
                        </div>
                        {book.description && (
                          <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(book.status)}>
                            {book.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {book.available_copies}/{book.total_copies} available
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(book.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(book)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory || selectedStatus
                  ? "Try adjusting your filters to see more books."
                  : "No books have been added yet. Add your first book to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update book information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editTitle">Title *</Label>
                <Input
                  id="editTitle"
                  placeholder="Book title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editAuthor">Author *</Label>
                <Input
                  id="editAuthor"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editIsbn">ISBN *</Label>
                <Input
                  id="editIsbn"
                  placeholder="978-0-123456-78-9"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editPublisher">Publisher</Label>
                <Input
                  id="editPublisher"
                  placeholder="Publisher name"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="editPublicationYear">Publication Year</Label>
                <Input
                  id="editPublicationYear"
                  type="number"
                  placeholder="2024"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editLanguage">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editSubcategory">Subcategory</Label>
              <Input
                id="editSubcategory"
                placeholder="Optional subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="editTotalCopies">Total Copies *</Label>
                <Input
                  id="editTotalCopies"
                  type="number"
                  placeholder="1"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editPages">Pages</Label>
                <Input
                  id="editPages"
                  type="number"
                  placeholder="300"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editPrice">Price (₹)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  placeholder="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editLocation">Location</Label>
              <Input
                id="editLocation"
                placeholder="Shelf location (e.g., CS-001)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Book description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditBook}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Updating..." : "Update Book"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
