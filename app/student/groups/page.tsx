"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MessageCircle, Trophy, BookOpen, Music, Camera, Code } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface Club {
  id: string
  name: string
  description: string
  category: string
  member_count: number
  meeting_schedule?: string
  moderator_name?: string
  cover_image?: string
  is_member: boolean
  recent_activity?: string
  activity_date?: string
}

const categoryIcons = {
  Sports: Trophy,
  Academic: BookOpen,
  Cultural: Music,
  Photography: Camera,
  Technical: Code,
  General: Users,
}

export default function MyGroups() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      // Mock data for demonstration - replace with actual Supabase query
      const mockClubs: Club[] = [
        {
          id: "1",
          name: "Coding Club",
          description: "Learn programming, participate in hackathons, and build amazing projects together.",
          category: "Technical",
          member_count: 156,
          meeting_schedule: "Every Friday 4:00 PM",
          moderator_name: "Dr. Sarah Johnson",
          is_member: true,
          recent_activity: "New hackathon announcement posted",
          activity_date: "2 hours ago",
        },
        {
          id: "2",
          name: "Photography Society",
          description: "Capture moments, learn techniques, and showcase your artistic vision.",
          category: "Photography",
          member_count: 89,
          meeting_schedule: "Every Saturday 2:00 PM",
          moderator_name: "Prof. Mike Chen",
          is_member: true,
          recent_activity: "Photo contest results announced",
          activity_date: "1 day ago",
        },
        {
          id: "3",
          name: "Cricket Team",
          description: "Join our college cricket team and represent us in inter-college tournaments.",
          category: "Sports",
          member_count: 25,
          meeting_schedule: "Daily 6:00 AM",
          moderator_name: "Coach Rajesh Kumar",
          is_member: false,
          recent_activity: "Practice session scheduled",
          activity_date: "3 hours ago",
        },
        {
          id: "4",
          name: "Music Club",
          description: "Express yourself through music, learn instruments, and perform at college events.",
          category: "Cultural",
          member_count: 67,
          meeting_schedule: "Every Wednesday 5:00 PM",
          moderator_name: "Ms. Priya Sharma",
          is_member: true,
          recent_activity: "Annual concert planning meeting",
          activity_date: "5 hours ago",
        },
        {
          id: "5",
          name: "Debate Society",
          description: "Enhance your public speaking skills and engage in intellectual discussions.",
          category: "Academic",
          member_count: 43,
          meeting_schedule: "Every Tuesday 3:00 PM",
          moderator_name: "Dr. Amit Patel",
          is_member: false,
          recent_activity: "Inter-college debate registration open",
          activity_date: "1 day ago",
        },
        {
          id: "6",
          name: "Student Council",
          description: "Be the voice of students and contribute to college governance and activities.",
          category: "General",
          member_count: 15,
          meeting_schedule: "Every Monday 4:00 PM",
          moderator_name: "Dean of Students",
          is_member: true,
          recent_activity: "New policy discussion scheduled",
          activity_date: "6 hours ago",
        },
      ]

      setClubs(mockClubs)
    } catch (error) {
      console.error("Error fetching clubs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLeave = async (clubId: string, isCurrentlyMember: boolean) => {
    // Update local state optimistically
    setClubs(
      clubs.map((club) =>
        club.id === clubId
          ? {
              ...club,
              is_member: !isCurrentlyMember,
              member_count: isCurrentlyMember ? club.member_count - 1 : club.member_count + 1,
            }
          : club,
      ),
    )

    // Here you would make the actual API call to join/leave the club
    try {
      // await supabase.from('club_memberships').insert/delete...
      console.log(`${isCurrentlyMember ? "Left" : "Joined"} club ${clubId}`)
    } catch (error) {
      console.error("Error updating membership:", error)
      // Revert optimistic update on error
      setClubs(
        clubs.map((club) =>
          club.id === clubId
            ? {
                ...club,
                is_member: isCurrentlyMember,
                member_count: isCurrentlyMember ? club.member_count + 1 : club.member_count - 1,
              }
            : club,
        ),
      )
    }
  }

  const filteredClubs = selectedCategory === "all" ? clubs : clubs.filter((club) => club.category === selectedCategory)

  const categories = ["all", ...new Set(clubs.map((club) => club.category))]
  const myClubs = clubs.filter((club) => club.is_member)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
            <p className="text-gray-600 mt-1">Join clubs and societies to enhance your college experience</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="text-sm">
              {myClubs.length} Joined
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {clubs.length} Total
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* My Clubs Section */}
      {myClubs.length > 0 && selectedCategory === "all" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">My Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClubs.map((club) => {
              const IconComponent = categoryIcons[club.category as keyof typeof categoryIcons] || Users
              return (
                <Card key={club.id} className="hover:shadow-lg transition-shadow duration-200 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <Badge variant="default" className="text-xs">
                          Member
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {club.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{club.member_count} members</span>
                      </div>
                      {club.meeting_schedule && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{club.meeting_schedule}</span>
                        </div>
                      )}
                      {club.recent_activity && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MessageCircle className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="text-xs">{club.recent_activity}</p>
                            <p className="text-xs text-gray-400">{club.activity_date}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleJoinLeave(club.id, club.is_member)}
                      >
                        Leave Club
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        View Feed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* All Clubs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedCategory === "all" ? "All Clubs & Societies" : `${selectedCategory} Clubs`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const IconComponent = categoryIcons[club.category as keyof typeof categoryIcons] || Users
            return (
              <Card key={club.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      {club.is_member && (
                        <Badge variant="default" className="text-xs">
                          Member
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {club.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{club.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{club.member_count} members</span>
                    </div>
                    {club.meeting_schedule && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{club.meeting_schedule}</span>
                      </div>
                    )}
                    {club.moderator_name && (
                      <div className="text-xs text-gray-500">Moderator: {club.moderator_name}</div>
                    )}
                  </div>

                  <Button
                    variant={club.is_member ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleJoinLeave(club.id, club.is_member)}
                  >
                    {club.is_member ? "Leave Club" : "Join Club"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
