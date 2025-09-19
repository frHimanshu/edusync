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
import { Briefcase, Send, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AccessControl } from "@/components/auth/access-control"

export default function PlacementAnnouncementPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "normal",
    targetAudience: "all",
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

    console.log("[v0] T&P announcement submitted:", formData)
    const audienceText = formData.targetAudience === "all" ? "all students" : "final year students only"
    alert(`T&P announcement posted successfully! This will be visible to ${audienceText}.`)

    // Reset form
    setFormData({ title: "", content: "", category: "", priority: "normal", targetAudience: "all" })
  }

  return (
    <AccessControl allowedRoles={["placement"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="placement" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Create T&P Announcement</h1>
            <p className="text-muted-foreground mt-1">Post placement and training announcements to students</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    T&P Announcement Form
                  </CardTitle>
                  <CardDescription>
                    Create announcements for placements, internships, workshops, and career guidance
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placement">Placement Drive</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="career-guidance">Career Guidance</SelectItem>
                            <SelectItem value="company-visit">Company Visit</SelectItem>
                            <SelectItem value="resume-building">Resume Building</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Select
                          value={formData.targetAudience}
                          onValueChange={(value) => handleInputChange("targetAudience", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            <SelectItem value="final-year">Final Year Only</SelectItem>
                            <SelectItem value="pre-final">Pre-Final Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
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
                      Post T&P Announcement
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    T&P Cell Powers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Global Reach</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      T&P Cell can post announcements visible to ALL students across all departments and years.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Targeted Messaging</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose specific audiences like final year students for placement drives or all students for
                      workshops.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Career Focus</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Include company details, eligibility criteria, deadlines, and registration links.
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
                        <div className="flex gap-2 mt-1">
                          {formData.category && (
                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {formData.category}
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                            T&P Cell
                          </span>
                          {formData.targetAudience !== "all" && (
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              {formData.targetAudience === "final-year" ? "Final Year" : "Pre-Final Year"}
                            </span>
                          )}
                          {formData.priority !== "normal" && (
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded ${
                                formData.priority === "urgent"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {formData.priority}
                            </span>
                          )}
                        </div>
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
