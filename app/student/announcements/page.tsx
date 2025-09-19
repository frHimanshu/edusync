"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, AlertCircle, Calendar, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AccessControl } from "@/components/auth/access-control"

const mockGeneralAnnouncements = [
  {
    id: 1,
    title: "Mid-term Examination Schedule Released",
    content:
      "The mid-term examination schedule for all courses has been released. Please check your respective course pages for detailed timings and venues.",
    date: "2024-03-10",
    priority: "urgent",
    category: "Academic",
    isEvent: false,
    visibleTo: ["all"],
    department: null,
    year: null,
  },
  {
    id: 2,
    title: "Library Hours Extended",
    content:
      "The central library will now remain open until 10 PM on weekdays to support students during examination period.",
    date: "2024-03-08",
    priority: "info",
    category: "Facility",
    isEvent: false,
    visibleTo: ["all"],
    department: null,
    year: null,
  },
  {
    id: 3,
    title: "Computer Science Department Workshop",
    content: "Special workshop on AI and Machine Learning for CS students. Limited seats available. Register now!",
    date: "2024-03-05",
    priority: "info",
    category: "Event",
    isEvent: true,
    registered: false,
    visibleTo: ["department"],
    department: "Computer Science",
    year: null,
  },
  {
    id: 4,
    title: "Final Year Project Submission Guidelines",
    content:
      "Important guidelines for final year project submission. All final year students must attend the briefing session.",
    date: "2024-03-03",
    priority: "urgent",
    category: "Academic",
    isEvent: false,
    visibleTo: ["year"],
    department: null,
    year: 4,
  },
]

const mockHostelAnnouncements = [
  {
    id: 5,
    title: "Room Inspection Schedule",
    content:
      "Monthly room inspection will be conducted from March 15-17. Please ensure your rooms are clean and organized.",
    date: "2024-03-09",
    priority: "info",
    category: "Hostel",
    isEvent: false,
    visibleTo: ["hostel"],
    department: null,
    year: null,
  },
  {
    id: 6,
    title: "Mess Menu Updated",
    content: "New mess menu has been implemented based on student feedback. Special dietary options are now available.",
    date: "2024-03-07",
    priority: "info",
    category: "Hostel",
    isEvent: false,
    visibleTo: ["hostel"],
    department: null,
    year: null,
  },
  {
    id: 7,
    title: "Block A Cultural Night",
    content: "Join us for an evening of cultural performances and entertainment in Block A common area.",
    date: "2024-03-04",
    priority: "info",
    category: "Event",
    isEvent: true,
    registered: false,
    visibleTo: ["hostel_block"],
    department: null,
    year: null,
    hostelBlock: "A",
  },
]

export default function AnnouncementsPage() {
  const { user, loading } = useAuth()
  const [announcements, setAnnouncements] = useState({
    general: mockGeneralAnnouncements,
    hostel: mockHostelAnnouncements,
  })

  const [studentProfile, setStudentProfile] = useState({
    department: "Computer Science",
    year: 3,
    isHostelResident: true,
    hostelBlock: "A",
  })

  useEffect(() => {
    if (user) {
      // Mock profile setup - would be fetched from database
      setStudentProfile({
        department: user.profile?.department || "Computer Science",
        year: user.profile?.year || 3,
        isHostelResident: true, // Would come from database
        hostelBlock: "A", // Would come from database
      })
    }
  }, [user])

  const filterAnnouncementsByProfile = (announcementList: any[]) => {
    return announcementList.filter((announcement) => {
      // Show all general announcements
      if (announcement.visibleTo.includes("all")) return true

      // Department-specific announcements
      if (announcement.visibleTo.includes("department")) {
        return announcement.department === studentProfile.department
      }

      // Year-specific announcements
      if (announcement.visibleTo.includes("year")) {
        return announcement.year === studentProfile.year
      }

      // Hostel-specific announcements
      if (announcement.visibleTo.includes("hostel")) {
        return studentProfile.isHostelResident
      }

      // Block-specific hostel announcements
      if (announcement.visibleTo.includes("hostel_block")) {
        return studentProfile.isHostelResident && announcement.hostelBlock === studentProfile.hostelBlock
      }

      return false
    })
  }

  const handleEventSignup = (id: number, category: "general" | "hostel") => {
    setAnnouncements((prev) => ({
      ...prev,
      [category]: prev[category].map((announcement) =>
        announcement.id === id ? { ...announcement, registered: !announcement.registered } : announcement,
      ),
    }))
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" />
      case "info":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const renderAnnouncementCard = (announcement: any, category: "general" | "hostel") => (
    <Card key={announcement.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              {announcement.date}
              <Badge variant="outline" className="ml-2">
                {announcement.category}
              </Badge>
              {announcement.department && (
                <Badge variant="secondary" className="ml-1">
                  {announcement.department}
                </Badge>
              )}
              {announcement.year && (
                <Badge variant="secondary" className="ml-1">
                  Year {announcement.year}
                </Badge>
              )}
              {announcement.hostelBlock && (
                <Badge variant="secondary" className="ml-1">
                  Block {announcement.hostelBlock}
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(announcement.priority) as any}>
              {getPriorityIcon(announcement.priority)}
              <span className="ml-1 capitalize">{announcement.priority}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{announcement.content}</p>
        {announcement.isEvent && (
          <Button
            variant={announcement.registered ? "secondary" : "default"}
            size="sm"
            onClick={() => handleEventSignup(announcement.id, category)}
            className="w-full"
          >
            {announcement.registered ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registered ✓
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AccessControl allowedRoles={["student"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="student" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground mt-1">
              Personalized announcements for {studentProfile.department} • Year {studentProfile.year}
              {studentProfile.isHostelResident && ` • Hostel Block ${studentProfile.hostelBlock}`}
            </p>
          </div>

          {studentProfile.isHostelResident ? (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Announcements</TabsTrigger>
                <TabsTrigger value="hostel">Hostel Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-6">
                {filterAnnouncementsByProfile(announcements.general).map((announcement) =>
                  renderAnnouncementCard(announcement, "general"),
                )}
              </TabsContent>

              <TabsContent value="hostel" className="space-y-4 mt-6">
                {filterAnnouncementsByProfile(announcements.hostel).map((announcement) =>
                  renderAnnouncementCard(announcement, "hostel"),
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">General Announcements</h2>
                <p className="text-sm text-muted-foreground">College-wide announcements and events</p>
              </div>
              {filterAnnouncementsByProfile(announcements.general).map((announcement) =>
                renderAnnouncementCard(announcement, "general"),
              )}
            </div>
          )}
        </main>
      </div>
    </AccessControl>
  )
}
