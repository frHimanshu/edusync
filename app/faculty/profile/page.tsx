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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Save, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface FacultyProfile {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  department_name: string
  designation: string
  specialization?: string
  experience_years: number
  qualification?: string
  joining_date: string
  address?: string
  bio?: string
  created_at: string
  updated_at?: string
}

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Senior Lecturer",
  "Visiting Faculty",
  "Adjunct Faculty"
]

const DEPARTMENTS = [
  "Computer Science Engineering",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Mathematics",
  "Physics",
  "Chemistry"
]

export default function FacultyProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<FacultyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [designation, setDesignation] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [qualification, setQualification] = useState("")
  const [address, setAddress] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        const { data: facultyData, error: facultyError } = await supabase
          .from("faculty")
          .select(`
            *,
            departments(name)
          `)
          .eq("id", user.id)
          .single()

        if (facultyError) {
          console.error("Error fetching faculty profile:", facultyError)
          // Use mock data for demo
          const mockProfile: FacultyProfile = {
            id: user.id,
            employee_id: "EMP2024001",
            first_name: "Dr. John",
            last_name: "Smith",
            email: user.email,
            phone: "+1 (555) 123-4567",
            department_name: "Computer Science Engineering",
            designation: "Professor",
            specialization: "Data Structures and Algorithms",
            experience_years: 15,
            qualification: "Ph.D. in Computer Science",
            joining_date: "2010-08-15",
            address: "123 University Avenue, Tech City, TC 12345",
            bio: "Experienced computer science professor with expertise in algorithms, data structures, and software engineering. Passionate about teaching and research.",
            created_at: "2010-08-15T00:00:00Z"
          }
          setProfile(mockProfile)
          populateForm(mockProfile)
          return
        }

        if (facultyData) {
          const formattedProfile: FacultyProfile = {
            id: facultyData.id,
            employee_id: facultyData.employee_id,
            first_name: facultyData.first_name || "",
            last_name: facultyData.last_name || "",
            email: facultyData.email || user.email,
            phone: facultyData.phone,
            department_name: facultyData.departments?.name || "Unknown",
            designation: facultyData.designation || "Assistant Professor",
            specialization: facultyData.specialization,
            experience_years: facultyData.experience_years || 0,
            qualification: facultyData.qualification,
            joining_date: facultyData.joining_date || facultyData.created_at,
            address: facultyData.address,
            bio: facultyData.bio,
            created_at: facultyData.created_at,
            updated_at: facultyData.updated_at
          }
          setProfile(formattedProfile)
          populateForm(formattedProfile)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const populateForm = (profileData: FacultyProfile) => {
    setFirstName(profileData.first_name)
    setLastName(profileData.last_name)
    setPhone(profileData.phone || "")
    setDesignation(profileData.designation)
    setSpecialization(profileData.specialization || "")
    setExperienceYears(profileData.experience_years.toString())
    setQualification(profileData.qualification || "")
    setAddress(profileData.address || "")
    setBio(profileData.bio || "")
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("faculty")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          designation: designation,
          specialization: specialization || null,
          experience_years: parseInt(experienceYears),
          qualification: qualification || null,
          address: address || null,
          bio: bio || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      // Update local profile state
      const updatedProfile = {
        ...profile,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        designation: designation,
        specialization: specialization || undefined,
        experience_years: parseInt(experienceYears),
        qualification: qualification || undefined,
        address: address || undefined,
        bio: bio || undefined,
        updated_at: new Date().toISOString()
      }
      setProfile(updatedProfile)
      setEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      populateForm(profile)
    }
    setEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your faculty profile information</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <CardDescription>{profile.designation}</CardDescription>
              <Badge variant="outline" className="mt-2">
                {profile.department_name}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {formatDate(profile.joining_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span>{profile.experience_years} years experience</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal and professional details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  {editing ? (
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.first_name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  {editing ? (
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.last_name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <p className="text-sm text-gray-900 py-2">{profile.employee_id}</p>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm text-gray-900 py-2">{profile.email}</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {editing ? (
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.phone || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  {editing ? (
                    <Select value={designation} onValueChange={setDesignation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGNATIONS.map((des) => (
                          <SelectItem key={des} value={des}>
                            {des}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.designation}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your academic and professional background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <p className="text-sm text-gray-900 py-2">{profile.department_name}</p>
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  {editing ? (
                    <Input
                      id="specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Enter your specialization"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.specialization || "Not specified"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  {editing ? (
                    <Input
                      id="qualification"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="Enter your highest qualification"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.qualification || "Not specified"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  {editing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="Enter years of experience"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.experience_years} years</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Additional details about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  {editing ? (
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.address || "Not provided"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile.bio || "No bio provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
