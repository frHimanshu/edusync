"use client"

import type React from "react"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Target, Plus, X } from "lucide-react"

export default function SportsAnnouncements() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priority, setPriority] = useState("info")

  const availableTags = [
    "Cricket Team",
    "Football Team",
    "Basketball Team",
    "Volleyball Team",
    "Tennis Team",
    "Badminton Team",
    "Athletics",
    "Swimming Team",
    "Chess Club",
    "Table Tennis",
    "Hockey Team",
    "Kabaddi Team",
  ]

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle announcement creation with targeted tags
    console.log("Creating sports announcement:", { title, content, selectedTags, priority })
    // Reset form
    setTitle("")
    setContent("")
    setSelectedTags([])
    setPriority("info")
  }

  return (
    <AccessControl allowedRoles={["sports"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="sports" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sports Announcements</h1>
                <p className="text-muted-foreground">Create targeted announcements for sports teams and activities</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Create Sports Announcement
                </CardTitle>
                <CardDescription>Post announcements targeted to specific sports teams and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Announcement Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter announcement title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter announcement content"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the sports teams or activities this announcement should reach
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTags.map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className="justify-start"
                        >
                          {selectedTags.includes(tag) ? (
                            <X className="h-3 w-3 mr-1" />
                          ) : (
                            <Plus className="h-3 w-3 mr-1" />
                          )}
                          {tag}
                        </Button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-sm text-muted-foreground">Selected:</span>
                        {selectedTags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={selectedTags.length === 0}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Post Sports Announcement
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sports Announcements</CardTitle>
                <CardDescription>Your recently posted announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">Cricket Practice Session Rescheduled</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tomorrow's practice has been moved to 5 PM due to ground maintenance.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">Cricket Team</Badge>
                          <Badge variant="outline">Info</Badge>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">Inter-College Basketball Tournament</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Registration open for the annual inter-college basketball championship.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">Basketball Team</Badge>
                          <Badge variant="destructive">Urgent</Badge>
                          <span className="text-xs text-muted-foreground">1 day ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
