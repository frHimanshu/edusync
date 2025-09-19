"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen, Music, Search, Filter } from "lucide-react"

// Mock event data
const mockEventData = {
  upcomingEvents: [
    {
      id: 1,
      title: "Tech Fest 2024",
      description: "Annual technology festival with competitions, workshops, and exhibitions",
      date: "2024-03-20",
      time: "9:00 AM",
      location: "Main Auditorium",
      category: "technical",
      organizer: "Computer Science Department",
      maxParticipants: 500,
      registeredParticipants: 342,
      registrationDeadline: "2024-03-18",
      status: "open",
      isRegistered: false,
      image: "/tech-festival-poster.jpg",
    },
    {
      id: 2,
      title: "Cultural Night",
      description: "Showcase of music, dance, and theatrical performances by students",
      date: "2024-03-25",
      time: "6:00 PM",
      location: "Open Air Theatre",
      category: "cultural",
      organizer: "Cultural Committee",
      maxParticipants: 300,
      registeredParticipants: 156,
      registrationDeadline: "2024-03-23",
      status: "open",
      isRegistered: true,
      image: "/cultural-night-performance.jpg",
    },
    {
      id: 3,
      title: "Sports Championship",
      description: "Inter-department sports competition including cricket, football, and basketball",
      date: "2024-03-30",
      time: "8:00 AM",
      location: "Sports Complex",
      category: "sports",
      organizer: "Sports Committee",
      maxParticipants: 200,
      registeredParticipants: 89,
      registrationDeadline: "2024-03-28",
      status: "open",
      isRegistered: false,
      image: "/sports-championship-celebration.png",
    },
    {
      id: 4,
      title: "Academic Symposium",
      description: "Research presentations and academic discussions across various disciplines",
      date: "2024-04-05",
      time: "10:00 AM",
      location: "Conference Hall",
      category: "academic",
      organizer: "Research Committee",
      maxParticipants: 150,
      registeredParticipants: 67,
      registrationDeadline: "2024-04-03",
      status: "open",
      isRegistered: false,
      image: "/academic-symposium.jpg",
    },
  ],
  myEvents: [
    {
      id: 2,
      title: "Cultural Night",
      date: "2024-03-25",
      time: "6:00 PM",
      location: "Open Air Theatre",
      status: "registered",
      attendanceStatus: "pending",
    },
    {
      id: 5,
      title: "Workshop on AI/ML",
      date: "2024-03-12",
      time: "2:00 PM",
      location: "CS Lab",
      status: "attended",
      attendanceStatus: "present",
    },
    {
      id: 6,
      title: "Debate Competition",
      date: "2024-03-08",
      time: "4:00 PM",
      location: "Seminar Hall",
      status: "attended",
      attendanceStatus: "present",
    },
  ],
  pastEvents: [
    {
      id: 7,
      title: "Fresher's Welcome",
      date: "2024-02-15",
      location: "Main Auditorium",
      category: "cultural",
      attendanceStatus: "present",
      certificate: true,
    },
    {
      id: 8,
      title: "Coding Competition",
      date: "2024-02-20",
      location: "Computer Lab",
      category: "technical",
      attendanceStatus: "present",
      certificate: false,
    },
    {
      id: 9,
      title: "Blood Donation Camp",
      date: "2024-02-25",
      location: "Medical Center",
      category: "social",
      attendanceStatus: "present",
      certificate: true,
    },
  ],
}

export default function Events() {
  const [eventData] = useState(mockEventData)
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("student")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <BookOpen className="h-4 w-4" />
      case "cultural":
        return <Music className="h-4 w-4" />
      case "sports":
        return <Trophy className="h-4 w-4" />
      case "academic":
        return <BookOpen className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "default"
      case "cultural":
        return "secondary"
      case "sports":
        return "destructive"
      case "academic":
        return "outline"
      case "social":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "closed":
        return "destructive"
      case "registered":
        return "secondary"
      case "attended":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredEvents = eventData.upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleRegister = (eventId: number) => {
    console.log("[v0] Registering for event:", eventId)
    // In real app, would make API call to register
  }

  const handleUnregister = (eventId: number) => {
    console.log("[v0] Unregistering from event:", eventId)
    // In real app, would make API call to unregister
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground mt-1">Discover, register, and track your event participation</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{eventData.upcomingEvents.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {eventData.myEvents.filter((e) => e.status === "registered").length}
                </div>
                <p className="text-xs text-muted-foreground">Active registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{eventData.pastEvents.length}</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {eventData.pastEvents.filter((e) => e.certificate).length}
                </div>
                <p className="text-xs text-muted-foreground">Available for download</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="past-events">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <Badge variant={getCategoryColor(event.category) as any} className="ml-2">
                          {getCategoryIcon(event.category)}
                          <span className="ml-1 capitalize">{event.category}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.registeredParticipants}/{event.maxParticipants} registered
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Registration deadline: {event.registrationDeadline}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                          {event.isRegistered ? (
                            <Button variant="outline" onClick={() => handleUnregister(event.id)}>
                              Unregister
                            </Button>
                          ) : (
                            <Button onClick={() => handleRegister(event.id)} disabled={event.status === "closed"}>
                              Register
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-events">
              <Card>
                <CardHeader>
                  <CardTitle>My Registered Events</CardTitle>
                  <CardDescription>Events you have registered for or attended</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventData.myEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.date} at {event.time} • {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                          {event.attendanceStatus === "pending" && <Badge variant="outline">Attendance Pending</Badge>}
                          {event.attendanceStatus === "present" && <Badge variant="secondary">Present</Badge>}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past-events">
              <Card>
                <CardHeader>
                  <CardTitle>Past Events</CardTitle>
                  <CardDescription>Events you have attended and certificates earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventData.pastEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(event.category)}
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.date} • {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getCategoryColor(event.category) as any} className="capitalize">
                            {event.category}
                          </Badge>
                          <Badge variant="secondary">Present</Badge>
                          {event.certificate ? (
                            <Button variant="outline" size="sm">
                              Download Certificate
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              No Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
