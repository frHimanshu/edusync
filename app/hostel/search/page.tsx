"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, User, MapPin, CreditCard } from "lucide-react"

const mockStudents = [
  {
    id: "STU2024001",
    name: "John Doe",
    rollNo: "CS21001",
    photo: "/diverse-students.png",
    roomNumber: "A-205",
    feeStatus: "PAID",
    block: "Block A",
    floor: "2nd Floor",
  },
  {
    id: "STU2024002",
    name: "Jane Smith",
    rollNo: "CS21002",
    photo: "/diverse-students.png",
    roomNumber: "B-301",
    feeStatus: "PENDING",
    block: "Block B",
    floor: "3rd Floor",
  },
  {
    id: "STU2024003",
    name: "Mike Johnson",
    rollNo: "CS21003",
    photo: "/diverse-students.png",
    roomNumber: "A-107",
    feeStatus: "PAID",
    block: "Block A",
    floor: "1st Floor",
  },
  {
    id: "STU2024004",
    name: "Sarah Wilson",
    rollNo: "CS21004",
    photo: "/diverse-students.png",
    roomNumber: "C-402",
    feeStatus: "PENDING",
    block: "Block C",
    floor: "4th Floor",
  },
  {
    id: "STU2024005",
    name: "David Brown",
    rollNo: "CS21005",
    photo: "/diverse-students.png",
    roomNumber: "B-203",
    feeStatus: "PAID",
    block: "Block B",
    floor: "2nd Floor",
  },
  {
    id: "STU2024006",
    name: "Emily Davis",
    rollNo: "CS21006",
    photo: "/diverse-students.png",
    roomNumber: "A-304",
    feeStatus: "PENDING",
    block: "Block A",
    floor: "3rd Floor",
  },
  {
    id: "STU2024007",
    name: "Chris Miller",
    rollNo: "CS21007",
    photo: "/diverse-students.png",
    roomNumber: "C-105",
    feeStatus: "PAID",
    block: "Block C",
    floor: "1st Floor",
  },
  {
    id: "STU2024008",
    name: "Lisa Anderson",
    rollNo: "CS21008",
    photo: "/diverse-students.png",
    roomNumber: "B-401",
    feeStatus: "PENDING",
    block: "Block B",
    floor: "4th Floor",
  },
]

export default function HostelSearchPage() {
  const [userType, setUserType] = useState<"student" | "teacher" | "admin" | "hostel">("hostel")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") as "student" | "teacher" | "admin" | "hostel"
      if (storedUserType) {
        setUserType(storedUserType)
      }
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      const results = mockStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getFeeStatusColor = (status: string) => {
    return status === "PAID" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center p-8">
          {/* Ultra-minimalist centered search */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Student Search</h1>
              <p className="text-muted-foreground">Search for students by name, ID, or room number</p>
            </div>

            {/* Large centered search bar */}
            <div className="relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Search Student by Name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-6 text-lg border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && !isSearching && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Search Results ({searchResults.length} found)
                </h2>
                {searchResults.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Student Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src={student.photo || "/placeholder.svg"}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                            <User className="h-8 w-8 text-muted-foreground hidden" />
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground">{student.name}</h3>
                          <p className="text-muted-foreground">
                            Roll No: {student.rollNo} • ID: {student.id}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {student.block} • {student.floor}
                            </span>
                          </div>
                        </div>

                        {/* Room Number */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{student.roomNumber}</div>
                          <div className="text-sm text-muted-foreground">Room Number</div>
                        </div>

                        {/* Fee Status */}
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 font-bold text-lg ${getFeeStatusColor(student.feeStatus)}`}
                          >
                            <CreditCard className="h-5 w-5" />
                            <span>FEES: {student.feeStatus}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No students found</p>
                  <p className="text-sm">Try searching with a different name, ID, or room number</p>
                </div>
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Start typing to search for students</p>
                  <p className="text-sm">You can search by name, student ID, roll number, or room number</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
