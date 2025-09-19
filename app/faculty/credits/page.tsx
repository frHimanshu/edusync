"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Plus, Search, Filter, Eye, Calendar, BookOpen, Users, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface CreditAward {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  subject_id: string
  subject_name: string
  credit_type: string
  points: number
  description: string
  awarded_date: string
  status: string
  created_at: string
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  semester: number
  department_name: string
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  department_name: string
}

const CREDIT_TYPES = [
  "Participation",
  "Assignment Excellence",
  "Project Work",
  "Quiz Performance",
  "Lab Work",
  "Presentation",
  "Extra Curricular",
  "Leadership",
  "Innovation",
  "Other"
]

const CREDIT_STATUS = [
  "Awarded",
  "Pending",
  "Rejected"
]

export default function FacultyCredits() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<CreditAward[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedCreditType, setSelectedCreditType] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editingCredit, setEditingCredit] = useState<CreditAward | null>(null)

  // Form state
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [creditType, setCreditType] = useState("")
  const [points, setPoints] = useState("")
  const [description, setDescription] = useState("")
  const [awardedDate, setAwardedDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState("Awarded")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Fetch subjects taught by this faculty
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select(`
            *,
            departments(name)
          `)
          .eq("faculty_id", user.id)

        if (subjectsError) {
          console.error("Error fetching subjects:", subjectsError)
          return
        }

        if (subjectsData) {
          const formattedSubjects = subjectsData.map(subject => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            semester: subject.semester,
            department_name: subject.departments?.name || "Unknown"
          }))
          setSubjects(formattedSubjects)
        }

        // Fetch students (mock data for now)
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(`
            *,
            departments(name)
          `)
          .limit(50)

        if (studentsData) {
          const formattedStudents = studentsData.map(student => ({
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            semester: student.semester,
            department_name: student.departments?.name || "Unknown"
          }))
          setStudents(formattedStudents)
        }

        // Fetch credit awards (mock data for now)
        const mockCredits: CreditAward[] = [
          {
            id: "1",
            student_id: "student1",
            student_name: "John Doe",
            student_id_number: "STU2024001",
            subject_id: "sub1",
            subject_name: "Data Structures",
            credit_type: "Assignment Excellence",
            points: 10,
            description: "Outstanding performance in assignment 3",
            awarded_date: "2024-01-15",
            status: "Awarded",
            created_at: "2024-01-15T10:00:00Z"
          },
          {
            id: "2",
            student_id: "student2",
            student_name: "Sarah Johnson",
            student_id_number: "STU2024002",
            subject_id: "sub2",
            subject_name: "Algorithms",
            credit_type: "Project Work",
            points: 15,
            description: "Excellent project presentation",
            awarded_date: "2024-01-20",
            status: "Awarded",
            created_at: "2024-01-20T14:30:00Z"
          }
        ]
        setCredits(mockCredits)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load credit data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateCredit = async () => {
    if (!user || !selectedStudent || !selectedSubject || !creditType || !points || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      // Get student and subject details
      const student = students.find(s => s.id === selectedStudent)
      const subject = subjects.find(s => s.id === selectedSubject)

      if (!student || !subject) {
        toast.error("Invalid student or subject selection")
        return
      }

      const newCredit: CreditAward = {
        id: Date.now().toString(),
        student_id: selectedStudent,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id_number: student.student_id,
        subject_id: selectedSubject,
        subject_name: subject.name,
        credit_type: creditType,
        points: parseInt(points),
        description: description,
        awarded_date: awardedDate,
        status: status,
        created_at: new Date().toISOString()
      }

      // In a real implementation, this would be saved to the database
      setCredits(prev => [newCredit, ...prev])
      
      toast.success("Credit awarded successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating credit:", error)
      toast.error("Failed to award credit")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCredit = async () => {
    if (!editingCredit || !selectedStudent || !selectedSubject || !creditType || !points || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const updatedCredit = {
        ...editingCredit,
        student_id: selectedStudent,
        subject_id: selectedSubject,
        credit_type: creditType,
        points: parseInt(points),
        description: description,
        awarded_date: awardedDate,
        status: status
      }

      setCredits(prev => prev.map(credit => 
        credit.id === editingCredit.id ? updatedCredit : credit
      ))
      
      toast.success("Credit updated successfully")
      setEditingCredit(null)
      resetForm()
    } catch (error) {
      console.error("Error updating credit:", error)
      toast.error("Failed to update credit")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCredit = async (creditId: string) => {
    if (!confirm("Are you sure you want to delete this credit award?")) {
      return
    }

    try {
      setCredits(prev => prev.filter(credit => credit.id !== creditId))
      toast.success("Credit award deleted successfully")
    } catch (error) {
      console.error("Error deleting credit:", error)
      toast.error("Failed to delete credit award")
    }
  }

  const resetForm = () => {
    setSelectedStudent("")
    setSelectedSubject("")
    setCreditType("")
    setPoints("")
    setDescription("")
    setAwardedDate(new Date().toISOString().split('T')[0])
    setStatus("Awarded")
  }

  const openEditDialog = (credit: CreditAward) => {
    setEditingCredit(credit)
    setSelectedStudent(credit.student_id)
    setSelectedSubject(credit.subject_id)
    setCreditType(credit.credit_type)
    setPoints(credit.points.toString())
    setDescription(credit.description)
    setAwardedDate(credit.awarded_date)
    setStatus(credit.status)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "awarded":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCreditTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "assignment excellence":
        return "bg-blue-100 text-blue-800"
      case "project work":
        return "bg-purple-100 text-purple-800"
      case "participation":
        return "bg-green-100 text-green-800"
      case "quiz performance":
        return "bg-orange-100 text-orange-800"
      case "lab work":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = 
      credit.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.student_id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.credit_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || credit.status === selectedStatus
    const matchesCreditType = !selectedCreditType || credit.credit_type === selectedCreditType
    
    return matchesSearch && matchesStatus && matchesCreditType
  })

  const totalPointsAwarded = credits.reduce((sum, credit) => sum + credit.points, 0)
  const totalCreditsAwarded = credits.length

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
          <h1 className="text-3xl font-bold">Credit Awards</h1>
          <p className="text-gray-600">Award credits to students for exceptional performance</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Award Credit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Award Credit to Student</DialogTitle>
              <DialogDescription>
                Recognize student achievements with credit points
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creditType">Credit Type *</Label>
                  <Select value={creditType} onValueChange={setCreditType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDIT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="points">Points *</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="10"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the achievement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="awardedDate">Awarded Date</Label>
                  <Input
                    id="awardedDate"
                    type="date"
                    value={awardedDate}
                    onChange={(e) => setAwardedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDIT_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCredit}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Awarding..." : "Award Credit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Awarded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreditsAwarded}</div>
            <p className="text-xs text-muted-foreground">Credit awards given</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsAwarded}</div>
            <p className="text-xs text-muted-foreground">Points awarded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCreditsAwarded > 0 ? Math.round(totalPointsAwarded / totalCreditsAwarded) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Points per award</p>
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
              <Label htmlFor="search">Search Credits</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by student, subject, or type..."
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
                  {CREDIT_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="typeFilter">Credit Type</Label>
              <Select value={selectedCreditType} onValueChange={setSelectedCreditType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {CREDIT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Credit Awards ({filteredCredits.length})
          </CardTitle>
          <CardDescription>All credit awards given to students</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCredits.length > 0 ? (
            <div className="space-y-4">
              {filteredCredits.map((credit) => (
                <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{credit.student_name}</h4>
                      <p className="text-sm text-gray-600">{credit.student_id_number}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {credit.subject_name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(credit.awarded_date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{credit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">{credit.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getCreditTypeColor(credit.credit_type)}>
                        {credit.credit_type}
                      </Badge>
                      <Badge className={getStatusColor(credit.status)}>
                        {credit.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No credit awards found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus || selectedCreditType
                  ? "Try adjusting your filters to see more credit awards."
                  : "You haven't awarded any credits yet. Award your first credit to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Credit Dialog */}
      <Dialog open={!!editingCredit} onOpenChange={() => setEditingCredit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Credit Award</DialogTitle>
            <DialogDescription>
              Update credit award information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editStudent">Student *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editSubject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editCreditType">Credit Type *</Label>
                <Select value={creditType} onValueChange={setCreditType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editPoints">Points *</Label>
                <Input
                  id="editPoints"
                  type="number"
                  placeholder="10"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description *</Label>
              <Textarea
                id="editDescription"
                placeholder="Describe the achievement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editAwardedDate">Awarded Date</Label>
                <Input
                  id="editAwardedDate"
                  type="date"
                  value={awardedDate}
                  onChange={(e) => setAwardedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCredit(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditCredit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Updating..." : "Update Credit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}