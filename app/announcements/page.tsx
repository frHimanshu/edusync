"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, AlertCircle, Info, Search } from "lucide-react"

// Mock announcements data
const mockAnnouncements = [
  {
    id: 1,
    title: "Library Hours Extended During Exam Period",
    content:
      "The central library will remain open 24/7 during the upcoming examination period from March 15-30, 2024. Students can access study halls and digital resources round the clock.",
    date: "2024-03-10",
    priority: "info",
    category: "Academic",
    author: "Library Administration",
  },
  {
    id: 2,
    title: "Fee Payment Deadline - March 20, 2024",
    content:
      "All students are reminded that the semester fee payment deadline is March 20, 2024. Late payments will incur additional charges. Use the digital wallet or visit the accounts office.",
    date: "2024-03-08",
    priority: "urgent",
    category: "Finance",
    author: "Accounts Department",
  },
  {
    id: 3,
    title: "New Course Registration Opens",
    content:
      "Registration for elective courses for the next semester is now open. Students can register through the academic portal until March 25, 2024.",
    date: "2024-03-05",
    priority: "info",
    category: "Academic",
    author: "Academic Office",
  },
  {
    id: 4,
    title: "Tech Fest 2024 - Call for Participation",
    content:
      "Annual Tech Fest 2024 is scheduled for March 20-22. Students can register for various competitions including coding, robotics, and innovation challenges.",
    date: "2024-03-03",
    priority: "info",
    category: "Events",
    author: "Student Activities",
  },
  {
    id: 5,
    title: "Hostel Maintenance Schedule",
    content:
      "Routine maintenance work will be conducted in hostel blocks A and B on March 18, 2024. Water supply may be affected between 9 AM - 2 PM.",
    date: "2024-03-01",
    priority: "urgent",
    category: "Hostel",
    author: "Hostel Administration",
  },
  {
    id: 6,
    title: "Career Fair 2024 Registration",
    content:
      "Annual Career Fair will be held on March 25, 2024. Over 50 companies will participate. Students can register and upload resumes through the placement portal.",
    date: "2024-02-28",
    priority: "info",
    category: "Placement",
    author: "Placement Cell",
  },
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("userType") as "student" | "teacher" | "admin" | "hostel") || "student"
    }
    return "student"
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "info":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || announcement.category === filterCategory
    const matchesPriority = filterPriority === "all" || announcement.priority === filterPriority

    return matchesSearch && matchesCategory && matchesPriority
  })

  const categories = ["all", ...Array.from(new Set(announcements.map((a) => a.category)))]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground mt-1">Stay updated with the latest news and important notices</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No announcements found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(announcement.priority)}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getPriorityColor(announcement.priority) as any}>
                              {announcement.priority}
                            </Badge>
                            <Badge variant="outline">{announcement.category}</Badge>
                          </div>
                          <CardDescription className="text-sm">
                            By {announcement.author} • {new Date(announcement.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Results count */}
          {filteredAnnouncements.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filteredAnnouncements.length} of {announcements.length} announcements
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
