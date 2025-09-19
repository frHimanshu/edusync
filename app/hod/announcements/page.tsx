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
import { Building2, Send, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AccessControl } from "@/components/auth/access-control"

export default function HODAnnouncementPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "normal",
  })

  // Mock HOD department - would come from user profile
  const hodDepartment = "Computer Science"

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    console.log("[v0] HOD announcement submitted:", { ...formData, department: hodDepartment })
    alert(`Department announcement posted successfully! Only ${hodDepartment} students will see this announcement.`)

    // Reset form
    setFormData({ title: "", content: "", category: "", priority: "normal" })
  }

  return (
    <AccessControl allowedRoles={["hod"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="teacher" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Create Department Announcement</h1>
            <p className="text-muted-foreground mt-1">
              Post announcements visible only to {hodDepartment} department students
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Department Announcement Form
                  </CardTitle>
                  <CardDescription>
                    This announcement will be visible only to students enrolled in the {hodDepartment} department
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
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="departmental">Departmental</SelectItem>
                            <SelectItem value="event">Department Event</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="project">Project Guidelines</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => handleInputChange("priority", value)}
                        >
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
                      Post Department Announcement
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
                    HOD Powers & Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Department Authority</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      As HOD of {hodDepartment}, you can post announcements visible only to students in your department.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Audience Scope</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All students enrolled in {hodDepartment} across all years will see this announcement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Content Guidelines</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Include department-specific information like course updates, project guidelines, or departmental
                      events.
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
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {formData.category}
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {hodDepartment} Only
                          </span>
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
