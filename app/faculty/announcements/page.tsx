"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, Edit, Trash2, Calendar, User, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Announcement {
  id: string
  title: string
  content: string
  channel: string
  priority: string
  is_active: boolean
  expires_at?: string
  created_at: string
  author_name: string
}

interface Department {
  id: string
  name: string
  code: string
}

export default function FacultyAnnouncements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [channel, setChannel] = useState("all")
  const [priority, setPriority] = useState("medium")
  const [expiresAt, setExpiresAt] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")

  const channels = [
    { value: "all", label: "All Students" },
    { value: "students", label: "Students Only" },
    { value: "department_specific", label: "Department Specific" },
    { value: "faculty", label: "Faculty Only" }
  ]

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch announcements created by this faculty
        const { data: announcementsData, error: announcementsError } = await supabase
          .from("announcements")
          .select(`
            *,
            users!announcements_author_id_fkey(first_name, last_name),
            departments(name)
          `)
          .eq("author_id", user.id)
          .order("created_at", { ascending: false })

        if (announcementsError) {
          console.error("Error fetching announcements:", announcementsError)
          return
        }

        // Fetch departments
        const { data: departmentsData, error: departmentsError } = await supabase
          .from("departments")
          .select("*")
          .order("name")

        if (departmentsError) {
          console.error("Error fetching departments:", departmentsError)
        }

        if (announcementsData) {
          const formattedAnnouncements = announcementsData.map(ann => ({
            id: ann.id,
            title: ann.title,
            content: ann.content,
            channel: ann.channel,
            priority: ann.priority,
            is_active: ann.is_active,
            expires_at: ann.expires_at,
            created_at: ann.created_at,
            author_name: ann.users ? 
              `${ann.users.first_name} ${ann.users.last_name}` : 
              'Unknown'
          }))
          setAnnouncements(formattedAnnouncements)
        }

        if (departmentsData) {
          setDepartments(departmentsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load announcements")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setChannel("all")
    setPriority("medium")
    setExpiresAt("")
    setSelectedDepartment("")
    setEditingAnnouncement(null)
  }

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const announcementData = {
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
        channel,
        priority,
        is_active: true,
        expires_at: expiresAt || null,
        department_id: channel === "department_specific" ? selectedDepartment : null
      }

      const { error } = await supabase
        .from("announcements")
        .insert(announcementData)

      if (error) {
        throw error
      }

      toast.success("Announcement created successfully")
      setCreateOpen(false)
      resetForm()
      
      // Refresh announcements
      window.location.reload()
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast.error("Failed to create announcement")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAnnouncement = async () => {
    if (!editingAnnouncement || !title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("announcements")
        .update({
          title: title.trim(),
          content: content.trim(),
          channel,
          priority,
          expires_at: expiresAt || null,
          department_id: channel === "department_specific" ? selectedDepartment : null
        })
        .eq("id", editingAnnouncement.id)

      if (error) {
        throw error
      }

      toast.success("Announcement updated successfully")
      setEditingAnnouncement(null)
      resetForm()
      
      // Refresh announcements
      window.location.reload()
    } catch (error) {
      console.error("Error updating announcement:", error)
      toast.error("Failed to update announcement")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcementId)

      if (error) {
        throw error
      }

      toast.success("Announcement deleted successfully")
      
      // Refresh announcements
      window.location.reload()
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast.error("Failed to delete announcement")
    }
  }

  const handleToggleActive = async (announcementId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !currentStatus })
        .eq("id", announcementId)

      if (error) {
        throw error
      }

      toast.success(`Announcement ${!currentStatus ? 'activated' : 'deactivated'}`)
      
      // Refresh announcements
      window.location.reload()
    } catch (error) {
      console.error("Error toggling announcement status:", error)
      toast.error("Failed to update announcement status")
    }
  }

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setTitle(announcement.title)
    setContent(announcement.content)
    setChannel(announcement.channel)
    setPriority(announcement.priority)
    setExpiresAt(announcement.expires_at ? announcement.expires_at.split('T')[0] : "")
    setSelectedDepartment("")
  }

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "all":
        return "bg-blue-100 text-blue-800"
      case "students":
        return "bg-green-100 text-green-800"
      case "department_specific":
        return "bg-purple-100 text-purple-800"
      case "faculty":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-600">Create and manage announcements for students</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Create an announcement to communicate with students and faculty.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter announcement content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="channel">Target Audience</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((ch) => (
                        <SelectItem key={ch.value} value={ch.value}>
                          {ch.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {channel === "department_specific" && (
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAnnouncement}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Creating..." : "Create Announcement"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter(a => a.is_active && !isExpired(a.expires_at)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {announcements.filter(a => isExpired(a.expires_at)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => {
                const created = new Date(a.created_at)
                const now = new Date()
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Your Announcements
          </CardTitle>
          <CardDescription>Manage your created announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <Badge className={getChannelColor(announcement.channel)}>
                          {channels.find(c => c.value === announcement.channel)?.label}
                        </Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        {!announcement.is_active && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        {isExpired(announcement.expires_at) && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{announcement.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{announcement.author_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(announcement.created_at)}</span>
                        </div>
                        {announcement.expires_at && (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>Expires: {formatDate(announcement.expires_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                      >
                        {announcement.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No announcements created yet</p>
              <p className="text-sm">Create your first announcement to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update your announcement details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                placeholder="Enter announcement content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-channel">Target Audience</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map((ch) => (
                      <SelectItem key={ch.value} value={ch.value}>
                        {ch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {channel === "department_specific" && (
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="edit-expiresAt">Expiry Date (Optional)</Label>
              <Input
                id="edit-expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingAnnouncement(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditAnnouncement}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Updating..." : "Update Announcement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}