"use client"

import type React from "react"

import { useState } from "react"
import { AccessControl } from "@/components/auth/access-control"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send } from "lucide-react"

export default function FacultyAnnouncements() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      alert("Please fill in all required fields")
      return
    }

    console.log("[v0] Faculty announcement submitted:", formData)
    alert("General announcement posted successfully! This will be visible to ALL students.")

    // Reset form
    setFormData({ title: "", content: "", priority: "normal" })
  }

  return (
    <AccessControl allowedRoles={["faculty"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType="faculty" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create General Announcement</h1>
                <p className="text-muted-foreground">Post announcements visible to all students</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>General Announcement Form</CardTitle>
                <CardDescription>Create announcements that will be visible to the entire student body</CardDescription>
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
                    Post General Announcement
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
