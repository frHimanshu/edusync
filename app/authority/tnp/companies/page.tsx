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
import { Building2, Search, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, Globe, Users, Calendar, DollarSign } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  industry: string
  website: string
  email: string
  phone: string
  address: string
  description: string
  contact_person: string
  contact_designation: string
  partnership_start_date: string
  status: string
  total_drives: number
  total_placements: number
  average_package: number
  last_drive_date?: string
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Consulting",
  "E-commerce",
  "Education",
  "Automotive",
  "Telecommunications",
  "Energy",
  "Other"
]

const STATUS_OPTIONS = [
  "Active",
  "Inactive",
  "Pending",
  "Suspended"
]

export default function CompaniesManagement() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactDesignation, setContactDesignation] = useState("")
  const [partnershipDate, setPartnershipDate] = useState("")
  const [status, setStatus] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockCompanies: Company[] = [
          {
            id: "comp1",
            name: "Tech Corp",
            industry: "Technology",
            website: "https://techcorp.com",
            email: "hr@techcorp.com",
            phone: "+91 98765 43210",
            address: "Bangalore, Karnataka, India",
            description: "Leading technology company specializing in software development and AI solutions",
            contact_person: "John Smith",
            contact_designation: "HR Manager",
            partnership_start_date: "2020-01-15",
            status: "Active",
            total_drives: 12,
            total_placements: 45,
            average_package: 1200000,
            last_drive_date: "2024-01-25"
          },
          {
            id: "comp2",
            name: "Innovation Labs",
            industry: "Technology",
            website: "https://innovationlabs.com",
            email: "careers@innovationlabs.com",
            phone: "+91 98765 43211",
            address: "Mumbai, Maharashtra, India",
            description: "Innovative startup focused on product development and digital transformation",
            contact_person: "Sarah Johnson",
            contact_designation: "Talent Acquisition Lead",
            partnership_start_date: "2021-06-10",
            status: "Active",
            total_drives: 8,
            total_placements: 28,
            average_package: 1000000,
            last_drive_date: "2024-02-02"
          },
          {
            id: "comp3",
            name: "Global Finance Ltd",
            industry: "Finance",
            website: "https://globalfinance.com",
            email: "recruitment@globalfinance.com",
            phone: "+91 98765 43212",
            address: "Delhi, India",
            description: "Multinational financial services company with focus on investment banking",
            contact_person: "Michael Brown",
            contact_designation: "Campus Relations Manager",
            partnership_start_date: "2019-03-20",
            status: "Active",
            total_drives: 15,
            total_placements: 62,
            average_package: 1500000,
            last_drive_date: "2024-01-20"
          }
        ]

        setCompanies(mockCompanies)
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast.error("Failed to load companies")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCompanies()
    }
  }, [user])

  const handleCreateCompany = async () => {
    if (!name || !industry || !email || !contactPerson) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const newCompany: Company = {
        id: Date.now().toString(),
        name,
        industry,
        website,
        email,
        phone,
        address,
        description,
        contact_person: contactPerson,
        contact_designation: contactDesignation,
        partnership_start_date: partnershipDate || new Date().toISOString().split('T')[0],
        status: status || "Active",
        total_drives: 0,
        total_placements: 0,
        average_package: 0
      }

      setCompanies(prev => [newCompany, ...prev])
      toast.success("Company added successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating company:", error)
      toast.error("Failed to add company")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCompany = async () => {
    if (!selectedCompany || !name || !industry || !email || !contactPerson) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const updatedCompany = {
        ...selectedCompany,
        name,
        industry,
        website,
        email,
        phone,
        address,
        description,
        contact_person: contactPerson,
        contact_designation: contactDesignation,
        partnership_start_date: partnershipDate,
        status
      }

      setCompanies(prev => prev.map(company => 
        company.id === selectedCompany.id ? updatedCompany : company
      ))
      
      toast.success("Company updated successfully")
      setEditOpen(false)
      setSelectedCompany(null)
      resetForm()
    } catch (error) {
      console.error("Error updating company:", error)
      toast.error("Failed to update company")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return

    try {
      setCompanies(prev => prev.filter(company => company.id !== companyId))
      toast.success("Company deleted successfully")
    } catch (error) {
      console.error("Error deleting company:", error)
      toast.error("Failed to delete company")
    }
  }

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company)
    setName(company.name)
    setIndustry(company.industry)
    setWebsite(company.website)
    setEmail(company.email)
    setPhone(company.phone)
    setAddress(company.address)
    setDescription(company.description)
    setContactPerson(company.contact_person)
    setContactDesignation(company.contact_designation)
    setPartnershipDate(company.partnership_start_date)
    setStatus(company.status)
    setEditOpen(true)
  }

  const resetForm = () => {
    setName("")
    setIndustry("")
    setWebsite("")
    setEmail("")
    setPhone("")
    setAddress("")
    setDescription("")
    setContactPerson("")
    setContactDesignation("")
    setPartnershipDate("")
    setStatus("")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry
    const matchesStatus = !selectedStatus || company.status === selectedStatus
    
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const totalCompanies = companies.length
  const activeCompanies = companies.filter(company => company.status === "Active").length
  const totalPlacements = companies.reduce((sum, company) => sum + company.total_placements, 0)
  const averagePackage = companies.length > 0 ? 
    companies.reduce((sum, company) => sum + company.average_package, 0) / companies.length : 0

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
          <h1 className="text-3xl font-bold">Company Relations</h1>
          <p className="text-gray-600">Manage company partnerships and recruitment relations</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Add a new company to the placement database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    placeholder="Company name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="partnershipDate">Partnership Date</Label>
                  <Input
                    id="partnershipDate"
                    type="date"
                    value={partnershipDate}
                    onChange={(e) => setPartnershipDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Company address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Contact person name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactDesignation">Contact Designation</Label>
                  <Input
                    id="contactDesignation"
                    placeholder="HR Manager, etc."
                    value={contactDesignation}
                    onChange={(e) => setContactDesignation(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Company description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((stat) => (
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
                  onClick={handleCreateCompany}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Adding..." : "Add Company"}
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
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCompanies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPlacements}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(averagePackage)}</div>
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
              <Label htmlFor="search">Search Companies</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, industry, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="industryFilter">Industry</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All industries</SelectItem>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
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
                  {STATUS_OPTIONS.map((stat) => (
                    <SelectItem key={stat} value={stat}>
                      {stat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Company Partners ({filteredCompanies.length})
          </CardTitle>
          <CardDescription>All company partnerships and recruitment relations</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length > 0 ? (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {company.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {company.phone}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.address}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Partner since {formatDate(company.partnership_start_date)}
                          </span>
                        </div>
                        {company.description && (
                          <p className="text-sm text-gray-600 mt-2">{company.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {company.total_placements} placements
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {company.total_drives} drives
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(company.average_package)} avg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(company)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteCompany(company.id)}
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
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedIndustry || selectedStatus
                  ? "Try adjusting your filters to see more companies."
                  : "No companies have been added yet. Add your first company to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Company Name *</Label>
                <Input
                  id="editName"
                  placeholder="Company name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editIndustry">Industry *</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editWebsite">Website</Label>
                <Input
                  id="editWebsite"
                  placeholder="https://company.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editPartnershipDate">Partnership Date</Label>
                <Input
                  id="editPartnershipDate"
                  type="date"
                  value={partnershipDate}
                  onChange={(e) => setPartnershipDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editAddress">Address</Label>
              <Input
                id="editAddress"
                placeholder="Company address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editContactPerson">Contact Person *</Label>
                <Input
                  id="editContactPerson"
                  placeholder="Contact person name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editContactDesignation">Contact Designation</Label>
                <Input
                  id="editContactDesignation"
                  placeholder="HR Manager, etc."
                  value={contactDesignation}
                  onChange={(e) => setContactDesignation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Company description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="editStatus">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((stat) => (
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
                onClick={handleEditCompany}
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Updating..." : "Update Company"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
