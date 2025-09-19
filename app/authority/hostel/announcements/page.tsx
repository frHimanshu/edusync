"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Megaphone, Calendar, Users } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"
import { useToast } from "@/hooks/use-toast"

export default function HostelAnnouncementsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Success",
      description: "Announcement created successfully",
    })

    // Reset form
    setTitle("")
    setContent("")
    setPriority("medium")
    setIsSubmitting(false)
  }

  const recentAnnouncements = [
    {
      id: 1,
      title: "Hostel Maintenance Schedule",
      content: "Water supply will be temporarily suspended on Sunday from 10 AM to 2 PM for maintenance work.",
      priority: "high" as const,
      date: "2024-01-15",
      author: "Hostel Authority",
    },
    {
      id: 2,
      title: "New WiFi Password",
      content: "The WiFi password has been updated. Please check with the front desk for the new credentials.",
      priority: "medium" as const,
      date: "2024-01-14",
      author: "Hostel Authority",
    },
    {
      id: 3,
      title: "Common Room Cleaning",
      content: "The common room will be deep cleaned this weekend. Please remove personal items.",
      priority: "low" as const,
      date: "2024-01-13",
      author: "Hostel Authority",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push("/authority/hostel/dashboard")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Hostel Announcements</h1>
                  <p className="text-gray-600">Create and manage announcements for hostel residents</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Announcement Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Create New Announcement
                </CardTitle>
                <CardDescription>Send important updates to all hostel residents</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter announcement title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter announcement content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Priority Level</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={priority === "low" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPriority("low")}
                      >
                        Low
                      </Button>
                      <Button
                        type="button"
                        variant={priority === "medium" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPriority("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        variant={priority === "high" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPriority("high")}
                      >
                        High
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>This announcement will be sent to all hostel residents</span>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Announcement"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Announcements
                </CardTitle>
                <CardDescription>Previously created hostel announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <Badge variant={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By: {announcement.author}</span>
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccessControl>
  )
}
