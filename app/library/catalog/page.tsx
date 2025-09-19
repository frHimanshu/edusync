"use client"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Plus, Edit, Trash2 } from "lucide-react"

const mockBooks = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    totalCopies: 15,
    availableCopies: 8,
    status: "Available",
  },
  {
    id: 2,
    title: "Introduction to Database Systems",
    author: "C.J. Date",
    isbn: "978-0321197849",
    category: "Computer Science",
    totalCopies: 10,
    availableCopies: 0,
    status: "Out of Stock",
  },
  {
    id: 3,
    title: "Engineering Mathematics",
    author: "K.A. Stroud",
    isbn: "978-1137031204",
    category: "Mathematics",
    totalCopies: 20,
    availableCopies: 12,
    status: "Available",
  },
  {
    id: 4,
    title: "Digital Electronics",
    author: "Morris Mano",
    isbn: "978-0132543262",
    category: "Electronics",
    totalCopies: 8,
    availableCopies: 3,
    status: "Limited",
  },
]

export default function BookCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [books] = useState(mockBooks)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "default"
      case "Limited":
        return "secondary"
      case "Out of Stock":
        return "destructive"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Book Catalog</h1>
                  <p className="text-muted-foreground">Manage library books and inventory</p>
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Books</CardTitle>
                <CardDescription>Find books by title, author, or category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Library Collection</CardTitle>
                <CardDescription>{filteredBooks.length} books found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-balance">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">by {book.author}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>ISBN: {book.isbn}</span>
                              <span>Category: {book.category}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(book.status) as any}>{book.status}</Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {book.availableCopies}/{book.totalCopies} available
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
