"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Home, Send, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AccessControl } from "@/components/auth/access-control"

export default function HostelAnnouncementPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    console.log("[v0] Hostel announcement submitted:", formData)
    alert("Hostel announcement posted successfully! Only hostel residents will be able to see this announcement.")

    // Reset form
    setFormData({ title: "", content: "", category: "" })
  }

  return (
    <AccessControl allowedRoles={["hostel"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="hostel" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Create Hostel Announcement</h1>
            <p className="text-muted-foreground mt-1">Post announcements visible only to hostel residents</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Hostel Announcement Form
                  </CardTitle>
                  <CardDescription>
                    This announcement will be visible only to students living in the hostel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Announcement Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter announcement title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select announcement category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="rules">Rules</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter announcement content..."
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        rows={8}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Post Hostel Announcement
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Audience</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      This announcement will be visible ONLY to hostel residents. Day scholars will not see this.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Content Guidelines</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Include specific details about hostel facilities, timings, room numbers, or any hostel-specific
                      requirements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Category Selection</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose the appropriate category to help residents quickly identify the type of announcement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.title || formData.content ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">{formData.title || "Announcement Title"}</h3>
                        {formData.category && (
                          <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            Hostel • {formData.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formData.content || "Announcement content will appear here..."}
                      </p>
                      <div className="text-xs text-muted-foreground">Posted on: {new Date().toLocaleDateString()}</div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Start typing to see a preview of your announcement</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
