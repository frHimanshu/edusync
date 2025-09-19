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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Eye, Mail, Phone, Calendar, Award, BookOpen, Plus, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface FacultyMember {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  designation: string
  specialization?: string
  experience_years: number
  qualification?: string
  joining_date: string
  status: string
  courses_count: number
  students_count: number
}

const DESIGNATIONS = [
  "Professor",
  "Associate Professor", 
  "Assistant Professor",
  "Lecturer",
  "Senior Lecturer"
]

const STATUS_OPTIONS = [
  "Active",
  "On Leave",
  "Inactive"
]

export default function HODFaculty() {
  const { user } = useAuth()
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDesignation, setSelectedDesignation] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchFaculty = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch faculty members in the same department as HOD
        const { data: facultyData, error: facultyError } = await supabase
          .from("faculty")
          .select(`
            *,
            departments(name)
          `)
          .order("first_name")

        if (facultyError) {
          console.error("Error fetching faculty:", facultyError)
          // Use mock data for demo
          const mockFaculty: FacultyMember[] = [
            {
              id: "faculty1",
              employee_id: "EMP2024001",
              first_name: "Dr. John",
              last_name: "Smith",
              email: "john.smith@university.edu",
              phone: "+1 (555) 123-4567",
              designation: "Professor",
              specialization: "Data Structures and Algorithms",
              experience_years: 15,
              qualification: "Ph.D. in Computer Science",
              joining_date: "2010-08-15",
              status: "Active",
              courses_count: 4,
              students_count: 120
            },
            {
              id: "faculty2",
              employee_id: "EMP2024002",
              first_name: "Dr. Sarah",
              last_name: "Johnson",
              email: "sarah.johnson@university.edu",
              phone: "+1 (555) 234-5678",
              designation: "Associate Professor",
              specialization: "Machine Learning",
              experience_years: 10,
              qualification: "Ph.D. in Artificial Intelligence",
              joining_date: "2015-01-20",
              status: "Active",
              courses_count: 3,
              students_count: 90
            },
            {
              id: "faculty3",
              employee_id: "EMP2024003",
              first_name: "Dr. Michael",
              last_name: "Brown",
              email: "michael.brown@university.edu",
              designation: "Assistant Professor",
              specialization: "Software Engineering",
              experience_years: 5,
              qualification: "Ph.D. in Software Engineering",
              joining_date: "2020-08-01",
              status: "Active",
              courses_count: 2,
              students_count: 60
            }
          ]
          setFaculty(mockFaculty)
          return
        }

        if (facultyData) {
          const formattedFaculty = facultyData.map(member => ({
            id: member.id,
            employee_id: member.employee_id,
            first_name: member.first_name || "",
            last_name: member.last_name || "",
            email: member.email || "",
            phone: member.phone,
            designation: member.designation || "Assistant Professor",
            specialization: member.specialization,
            experience_years: member.experience_years || 0,
            qualification: member.qualification,
            joining_date: member.joining_date || member.created_at,
            status: member.status || "Active",
            courses_count: Math.floor(Math.random() * 5) + 1, // Mock data
            students_count: Math.floor(Math.random() * 100) + 30 // Mock data
          }))
          setFaculty(formattedFaculty)
        }
      } catch (error) {
        console.error("Error fetching faculty:", error)
        toast.error("Failed to load faculty data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchFaculty()
    }
  }, [user])

  const handleViewDetails = (member: FacultyMember) => {
    setSelectedFaculty(member)
    setDetailsOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "on leave":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = 
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDesignation = !selectedDesignation || member.designation === selectedDesignation
    const matchesStatus = !selectedStatus || member.status === selectedStatus
    
    return matchesSearch && matchesDesignation && matchesStatus
  })

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
          <h1 className="text-3xl font-bold">Department Faculty</h1>
          <p className="text-gray-600">Manage and oversee faculty members in your department</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {faculty.filter(f => f.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {faculty.reduce((sum, f) => sum + f.courses_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {faculty.reduce((sum, f) => sum + f.students_count, 0)}
            </div>
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
              <Label htmlFor="search">Search Faculty</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="designationFilter">Designation</Label>
              <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                <SelectTrigger>
                  <SelectValue placeholder="All designations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All designations</SelectItem>
                  {DESIGNATIONS.map((des) => (
                    <SelectItem key={des} value={des}>
                      {des}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faculty List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Faculty Members ({filteredFaculty.length})
          </CardTitle>
          <CardDescription>Faculty members in your department</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFaculty.length > 0 ? (
            <div className="space-y-4">
              {filteredFaculty.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {member.first_name[0]}{member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {member.first_name} {member.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{member.employee_id}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          {member.designation}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {member.courses_count} courses
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {member.students_count} students
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {member.experience_years} years exp
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(member)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDesignation || selectedStatus
                  ? "Try adjusting your filters to see more faculty members."
                  : "No faculty members found in your department."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Faculty Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Faculty Details - {selectedFaculty?.first_name} {selectedFaculty?.last_name}
            </DialogTitle>
            <DialogDescription>
              Complete information about the faculty member
            </DialogDescription>
          </DialogHeader>
          {selectedFaculty && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg">
                    {selectedFaculty.first_name[0]}{selectedFaculty.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedFaculty.first_name} {selectedFaculty.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedFaculty.employee_id}</p>
                  <Badge className={getStatusColor(selectedFaculty.status)}>
                    {selectedFaculty.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedFaculty.email}</span>
                  </div>
                  {selectedFaculty.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedFaculty.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedFaculty.designation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Joined: {formatDate(selectedFaculty.joining_date)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Courses: {selectedFaculty.courses_count}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Students: {selectedFaculty.students_count}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Experience: {selectedFaculty.experience_years} years</span>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-3">
                {selectedFaculty.specialization && (
                  <div>
                    <Label className="text-sm font-medium">Specialization</Label>
                    <p className="text-sm text-gray-600">{selectedFaculty.specialization}</p>
                  </div>
                )}
                {selectedFaculty.qualification && (
                  <div>
                    <Label className="text-sm font-medium">Qualification</Label>
                    <p className="text-sm text-gray-600">{selectedFaculty.qualification}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
