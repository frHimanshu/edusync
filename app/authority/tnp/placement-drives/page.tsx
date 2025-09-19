"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Search, Filter, Plus, Edit, Trash2, Eye, Users, Building2, Clock, MapPin, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PlacementDrive {
  id: string
  company_id: string
  company_name: string
  title: string
  description: string
  drive_date: string
  drive_time: string
  venue: string
  job_roles: string[]
  eligibility_criteria: string
  package_range: string
  registration_deadline: string
  max_students: number
  registered_students: number
  status: string
  created_at: string
  updated_at: string
}

interface Company {
  id: string
  name: string
  industry: string
}

const DRIVE_STATUS = [
  "Scheduled",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Postponed"
]

const JOB_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "UI/UX Designer",
  "DevOps Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Mobile App Developer",
  "QA Engineer",
  "System Administrator",
  "Network Engineer",
  "Cybersecurity Analyst",
  "Other"
]

export default function PlacementDrives() {
  const { user } = useAuth()
  const [drives, setDrives] = useState<PlacementDrive[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)

  // Form state
  const [companyId, setCompanyId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [driveDate, setDriveDate] = useState("")
  const [driveTime, setDriveTime] = useState("")
  const [venue, setVenue] = useState("")
  const [jobRoles, setJobRoles] = useState<string[]>([])
  const [eligibilityCriteria, setEligibilityCriteria] = useState("")
  const [packageRange, setPackageRange] = useState("")
  const [registrationDeadline, setRegistrationDeadline] = useState("")
  const [maxStudents, setMaxStudents] = useState("")
  const [status, setStatus] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockDrives: PlacementDrive[] = [
          {
            id: "drive1",
            company_id: "comp1",
            company_name: "Tech Corp",
            title: "Software Engineer Recruitment Drive",
            description: "Recruitment drive for software engineering positions with focus on full-stack development",
            drive_date: "2024-02-15",
            drive_time: "09:00",
            venue: "Main Auditorium",
            job_roles: ["Software Engineer", "Full Stack Developer"],
            eligibility_criteria: "CGPA >= 7.0, No backlogs, Good communication skills",
            package_range: "8-12 LPA",
            registration_deadline: "2024-02-10",
            max_students: 100,
            registered_students: 45,
            status: "Scheduled",
            created_at: "2024-01-15T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "drive2",
            company_id: "comp2",
            company_name: "Innovation Labs",
            title: "Product Management & Design Roles",
            description: "Recruitment for product management and UI/UX design positions",
            drive_date: "2024-02-20",
            drive_time: "10:00",
            venue: "Conference Hall A",
            job_roles: ["Product Manager", "UI/UX Designer"],
            eligibility_criteria: "CGPA >= 6.5, Creative thinking, Problem solving skills",
            package_range: "6-10 LPA",
            registration_deadline: "2024-02-15",
            max_students: 50,
            registered_students: 28,
            status: "Scheduled",
            created_at: "2024-01-20T00:00:00Z",
            updated_at: "2024-01-20T00:00:00Z"
          },
          {
            id: "drive3",
            company_id: "comp3",
            company_name: "Global Finance Ltd",
            title: "Investment Banking Analyst Program",
            description: "Graduate analyst program for investment banking division",
            drive_date: "2024-01-25",
            drive_time: "09:30",
            venue: "Seminar Hall B",
            job_roles: ["Business Analyst", "Financial Analyst"],
            eligibility_criteria: "CGPA >= 8.0, Strong analytical skills, Finance background preferred",
            package_range: "12-18 LPA",
            registration_deadline: "2024-01-20",
            max_students: 30,
            registered_students: 30,
            status: "Completed",
            created_at: "2024-01-10T00:00:00Z",
            updated_at: "2024-01-25T00:00:00Z"
          }
        ]

        const mockCompanies: Company[] = [
          { id: "comp1", name: "Tech Corp", industry: "Technology" },
          { id: "comp2", name: "Innovation Labs", industry: "Technology" },
          { id: "comp3", name: "Global Finance Ltd", industry: "Finance" }
        ]

        setDrives(mockDrives)
        setCompanies(mockCompanies)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load placement drives")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateDrive = async () => {
    if (!companyId || !title || !driveDate || !driveTime || !venue || !eligibilityCriteria || !packageRange || !registrationDeadline || !maxStudents) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const company = companies.find(c => c.id === companyId)
      if (!company) {
        toast.error("Invalid company selection")
        return
      }

      const newDrive: PlacementDrive = {
        id: Date.now().toString(),
        company_id: companyId,
        company_name: company.name,
        title,
        description,
        drive_date: driveDate,
        drive_time: driveTime,
        venue,
        job_roles: jobRoles,
        eligibility_criteria: eligibilityCriteria,
        package_range: packageRange,
        registration_deadline: registrationDeadline,
        max_students: parseInt(maxStudents),
        registered_students: 0,
        status: status || "Scheduled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setDrives(prev => [newDrive, ...prev])
      toast.success("Placement drive created successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating drive:", error)
      toast.error("Failed to create placement drive")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDrive = async () => {
    if (!selectedDrive || !companyId || !title || !driveDate || !driveTime || !venue || !eligibilityCriteria || !packageRange || !registrationDeadline || !maxStudents) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const company = companies.find(c => c.id === companyId)
      if (!company) {
        toast.error("Invalid company selection")
        return
      }

      const updatedDrive = {
        ...selectedDrive,
        company_id: companyId,
        company_name: company.name,
        title,
        description,
        drive_date: driveDate,
        drive_time: driveTime,
        venue,
        job_roles: jobRoles,
        eligibility_criteria: eligibilityCriteria,
        package_range: packageRange,
        registration_deadline: registrationDeadline,
        max_students: parseInt(maxStudents),
        status,
        updated_at: new Date().toISOString()
      }

      setDrives(prev => prev.map(drive => 
        drive.id === selectedDrive.id ? updatedDrive : drive
      ))
      
      toast.success("Placement drive updated successfully")
      setEditOpen(false)
      setSelectedDrive(null)
      resetForm()
    } catch (error) {
      console.error("Error updating drive:", error)
      toast.error("Failed to update placement drive")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDrive = async (driveId: string) => {
    if (!confirm("Are you sure you want to delete this placement drive?")) return

    try {
      setDrives(prev => prev.filter(drive => drive.id !== driveId))
      toast.success("Placement drive deleted successfully")
    } catch (error) {
      console.error("Error deleting drive:", error)
      toast.error("Failed to delete placement drive")
    }
  }

  const openEditDialog = (drive: PlacementDrive) => {
    setSelectedDrive(drive)
    setCompanyId(drive.company_id)
    setTitle(drive.title)
    setDescription(drive.description)
    setDriveDate(drive.drive_date)
    setDriveTime(drive.drive_time)
    setVenue(drive.venue)
    setJobRoles(drive.job_roles)
    setEligibilityCriteria(drive.eligibility_criteria)
    setPackageRange(drive.package_range)
    setRegistrationDeadline(drive.registration_deadline)
    setMaxStudents(drive.max_students.toString())
    setStatus(drive.status)
    setEditOpen(true)
  }

  const resetForm = () => {
    setCompanyId("")
    setTitle("")
    setDescription("")
    setDriveDate("")
    setDriveTime("")
    setVenue("")
    setJobRoles([])
    setEligibilityCriteria("")
    setPackageRange("")
    setRegistrationDeadline("")
    setMaxStudents("")
    setStatus("")
  }

  const handleJobRoleToggle = (role: string) => {
    setJobRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "postponed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "ongoing":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "postponed":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = 
      drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.venue.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || drive.status === selectedStatus
    const matchesCompany = !selectedCompany || drive.company_id === selectedCompany
    
    return matchesSearch && matchesStatus && matchesCompany
  })

  const totalDrives = drives.length
  const scheduledDrives = drives.filter(drive => drive.status === "Scheduled").length
  const completedDrives = drives.filter(drive => drive.status === "Completed").length
  const totalRegistrations = drives.reduce((sum, drive) => sum + drive.registered_students, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Placement Drives</h1>
          <p className="text-gray-600">Manage company placement drives and recruitment events</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Drive
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Placement Drive</DialogTitle>
              <DialogDescription>
                Create a new placement drive for a company
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} ({company.industry})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Drive Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer Recruitment Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Drive description and details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driveDate">Drive Date *</Label>
                  <Input
                    id="driveDate"
                    type="date"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="driveTime">Drive Time *</Label>
                  <Input
                    id="driveTime"
                    type="time"
                    value={driveTime}
                    onChange={(e) => setDriveTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  placeholder="e.g., Main Auditorium"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
              <div>
                <Label>Job Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {JOB_ROLES.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={role}
                        checked={jobRoles.includes(role)}
                        onChange={() => handleJobRoleToggle(role)}
                        className="rounded"
                      />
                      <Label htmlFor={role} className="text-sm">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="eligibilityCriteria">Eligibility Criteria *</Label>
                <Textarea
                  id="eligibilityCriteria"
                  placeholder="e.g., CGPA >= 7.0, No backlogs, Good communication skills"
                  value={eligibilityCriteria}
                  onChange={(e) => setEligibilityCriteria(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packageRange">Package Range *</Label>
                  <Input
                    id="packageRange"
                    placeholder="e.g., 8-12 LPA"
                    value={packageRange}
                    onChange={(e) => setPackageRange(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxStudents">Max Students *</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    placeholder="100"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVE_STATUS.map((stat) => (
                      <SelectItem key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateDrive}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Creating..." : "Create Drive"}
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
            <CardTitle className="text-sm font-medium">Total Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledDrives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedDrives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalRegistrations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Drives</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title, company, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {DRIVE_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companyFilter">Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drives List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Placement Drives ({filteredDrives.length})
          </CardTitle>
          <CardDescription>All scheduled and completed placement drives</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDrives.length > 0 ? (
            <div className="space-y-4">
              {filteredDrives.map((drive) => (
                <div key={drive.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{drive.title}</h4>
                        <p className="text-sm text-gray-600">{drive.company_name}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(drive.drive_date)} at {drive.drive_time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {drive.venue}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {drive.package_range}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {drive.registered_students}/{drive.max_students} registered
                          </span>
                        </div>
                        {drive.description && (
                          <p className="text-sm text-gray-600 mt-2">{drive.description}</p>
                        )}
                        {drive.job_roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {drive.job_roles.map((role) => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(drive.status)}
                          <Badge className={getStatusColor(drive.status)}>
                            {drive.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Deadline: {formatDate(drive.registration_deadline)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(drive)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteDrive(drive.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No placement drives found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus || selectedCompany
                  ? "Try adjusting your filters to see more drives."
                  : "No placement drives have been scheduled yet. Schedule your first drive to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Placement Drive</DialogTitle>
            <DialogDescription>
              Update placement drive information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCompany">Company *</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} ({company.industry})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTitle">Drive Title *</Label>
              <Input
                id="editTitle"
                placeholder="e.g., Software Engineer Recruitment Drive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Drive description and details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDriveDate">Drive Date *</Label>
                <Input
                  id="editDriveDate"
                  type="date"
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editDriveTime">Drive Time *</Label>
                <Input
                  id="editDriveTime"
                  type="time"
                  value={driveTime}
                  onChange={(e) => setDriveTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editVenue">Venue *</Label>
              <Input
                id="editVenue"
                placeholder="e.g., Main Auditorium"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
            <div>
              <Label>Job Roles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {JOB_ROLES.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${role}`}
                      checked={jobRoles.includes(role)}
                      onChange={() => handleJobRoleToggle(role)}
                      className="rounded"
                    />
                    <Label htmlFor={`edit-${role}`} className="text-sm">{role}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="editEligibilityCriteria">Eligibility Criteria *</Label>
              <Textarea
                id="editEligibilityCriteria"
                placeholder="e.g., CGPA >= 7.0, No backlogs, Good communication skills"
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPackageRange">Package Range *</Label>
                <Input
                  id="editPackageRange"
                  placeholder="e.g., 8-12 LPA"
                  value={packageRange}
                  onChange={(e) => setPackageRange(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editMaxStudents">Max Students *</Label>
                <Input
                  id="editMaxStudents"
                  type="number"
                  placeholder="100"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editRegistrationDeadline">Registration Deadline *</Label>
              <Input
                id="editRegistrationDeadline"
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editStatus">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DRIVE_STATUS.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditDrive}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Updating..." : "Update Drive"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
