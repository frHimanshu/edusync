"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { UserPlus, CheckCircle, Copy, Users, Phone, ArrowLeft } from "lucide-react"
import { AccessControl } from "@/components/auth/access-control"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function RegisterStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
    homeAddress: "",
    course: "",
    department: "",
    admissionYear: "",
    isHostelResident: false,
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    parentGuardianName: "",
    parentGuardianPhone: "",
    parentGuardianEmail: "",
    medicalConditions: "",
    bloodGroup: "",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateStudentId = () => {
    const year = new Date().getFullYear().toString().slice(-2)
    const deptCode = formData.department.substring(0, 3).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `STU${year}${deptCode}${randomNum}`
  }

  const generateTempPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = "TEMP"
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "contactNumber",
      "email",
      "course",
      "department",
      "admissionYear",
      "emergencyContactName",
      "emergencyContactPhone",
      "parentGuardianName",
      "parentGuardianPhone",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Generate unique student ID and temporary password
    const newStudentId = generateStudentId()
    const tempPassword = generateTempPassword()

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setGeneratedId(newStudentId)
      setGeneratedPassword(tempPassword)

      toast({
        title: "Success",
        description: "Student registration completed successfully",
      })

      console.log("[v0] New student registration successful:", {
        studentId: newStudentId,
        email: formData.email,
        tempPassword: tempPassword,
        fullName: `${formData.firstName} ${formData.lastName}`,
      })
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: `Registration failed: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Student ID copied to clipboard!",
    })
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      contactNumber: "",
      email: "",
      homeAddress: "",
      course: "",
      department: "",
      admissionYear: "",
      isHostelResident: false,
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      emergencyContactEmail: "",
      parentGuardianName: "",
      parentGuardianPhone: "",
      parentGuardianEmail: "",
      medicalConditions: "",
      bloodGroup: "",
    })
    setGeneratedId(null)
    setGeneratedPassword(null)
  }

  return (
    <AccessControl allowedRoles={["accountant"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push("/authority/accounts/dashboard")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">New Student Registration</h1>
                  <p className="text-gray-600">Complete student onboarding form</p>
                </div>
              </div>
            </div>
          </div>

          {generatedId ? (
            // Success State
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Student Profile Created Successfully!</CardTitle>
                <CardDescription className="text-green-700">
                  The new student has been registered in the system with complete profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Label className="text-lg font-medium text-green-800">Generated Student ID</Label>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Badge
                      variant="outline"
                      className="text-2xl font-bold py-2 px-4 bg-white border-green-300 text-green-800"
                    >
                      {generatedId}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedId)}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">Student Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {formData.email}
                    </div>
                    <div>
                      <span className="font-medium">Course:</span> {formData.course}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {formData.department}
                    </div>
                    <div>
                      <span className="font-medium">Admission Year:</span> {formData.admissionYear}
                    </div>
                    <div>
                      <span className="font-medium">Hostel Resident:</span> {formData.isHostelResident ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800 mb-2">Login Credentials</div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="font-medium">Student ID:</span> {generatedId}
                        </div>
                        <div>
                          <span className="font-medium">Temporary Password:</span>
                          <code className="ml-2 px-2 py-1 bg-yellow-100 rounded text-yellow-800">
                            {generatedPassword}
                          </code>
                        </div>
                      </div>
                      <div className="text-xs text-yellow-700 mt-2">
                        <strong>Important:</strong> The student must change this password on first login.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Another Student
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/authority/accounts/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Registration Form
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6" />
                  Comprehensive Student Registration Form
                </CardTitle>
                <CardDescription>
                  Fill in all required information including emergency contacts to create a complete student profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number *</Label>
                        <Input
                          id="contactNumber"
                          type="tel"
                          placeholder="Enter contact number"
                          value={formData.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                          value={formData.bloodGroup}
                          onValueChange={(value) => handleInputChange("bloodGroup", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homeAddress">Home Address</Label>
                      <Textarea
                        id="homeAddress"
                        placeholder="Enter complete home address"
                        value={formData.homeAddress}
                        onChange={(e) => handleInputChange("homeAddress", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Emergency Contacts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                        <Input
                          id="emergencyContactName"
                          placeholder="Enter emergency contact name"
                          value={formData.emergencyContactName}
                          onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                        <Input
                          id="emergencyContactPhone"
                          type="tel"
                          placeholder="Enter emergency contact phone"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentGuardianName">Parent/Guardian Name *</Label>
                        <Input
                          id="parentGuardianName"
                          placeholder="Enter parent/guardian name"
                          value={formData.parentGuardianName}
                          onChange={(e) => handleInputChange("parentGuardianName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentGuardianPhone">Parent/Guardian Phone *</Label>
                        <Input
                          id="parentGuardianPhone"
                          type="tel"
                          placeholder="Enter parent/guardian phone"
                          value={formData.parentGuardianPhone}
                          onChange={(e) => handleInputChange("parentGuardianPhone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="course">Course/Program *</Label>
                        <Input
                          id="course"
                          placeholder="e.g., Bachelor of Technology"
                          value={formData.course}
                          onChange={(e) => handleInputChange("course", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => handleInputChange("department", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science Engineering</SelectItem>
                            <SelectItem value="Electronics">Electronics & Communication</SelectItem>
                            <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                            <SelectItem value="Civil">Civil Engineering</SelectItem>
                            <SelectItem value="Chemical">Chemical Engineering</SelectItem>
                            <SelectItem value="Electrical">Electrical Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admissionYear">Admission Year *</Label>
                        <Select
                          value={formData.admissionYear}
                          onValueChange={(value) => handleInputChange("admissionYear", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select admission year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Hostel Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Accommodation</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isHostelResident"
                        checked={formData.isHostelResident}
                        onCheckedChange={(checked) => handleInputChange("isHostelResident", checked as boolean)}
                      />
                      <Label htmlFor="isHostelResident" className="text-sm font-medium">
                        Is this student a hostel resident?
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Student Profile
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AccessControl>
  )
}
