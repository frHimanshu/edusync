'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  FileText, 
  Building2,
  GraduationCap,
  Library,
  Briefcase,
  Home,
  Calculator,
  UserCheck
} from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const features = [
    {
      title: "Student Portal",
      description: "Complete student management with attendance, wallet, documents, and announcements",
      icon: GraduationCap,
      color: "bg-blue-500",
      features: ["Attendance Tracking", "Edu-Credits Wallet", "Document Management", "Announcements"]
    },
    {
      title: "Faculty Portal", 
      description: "Teaching tools for attendance marking, announcements, and class management",
      icon: UserCheck,
      color: "bg-green-500",
      features: ["Attendance Marking", "Class Management", "Announcements", "Student Overview"]
    },
    {
      title: "HOD Portal",
      description: "Department management with KPIs, student oversight, and department announcements",
      icon: Building2,
      color: "bg-purple-500",
      features: ["Department KPIs", "Student Management", "Faculty Oversight", "Department Announcements"]
    },
    {
      title: "Accountant Portal",
      description: "Financial management, student registration, and fee tracking",
      icon: Calculator,
      color: "bg-orange-500",
      features: ["Student Registration", "Fee Management", "Financial Reports", "Wallet Transactions"]
    },
    {
      title: "Librarian Portal",
      description: "Library management with book catalog, issuance tracking, and student records",
      icon: Library,
      color: "bg-indigo-500",
      features: ["Book Catalog", "Issuance Tracking", "Student Records", "Library Reports"]
    },
    {
      title: "T&P Portal",
      description: "Placement management with company drives, student database, and job announcements",
      icon: Briefcase,
      color: "bg-pink-500",
      features: ["Placement Drives", "Student Database", "Job Announcements", "Placement Reports"]
    },
    {
      title: "Hostel Portal",
      description: "Hostel management with room allocation, maintenance, and resident management",
      icon: Home,
      color: "bg-teal-500",
      features: ["Room Management", "Maintenance Requests", "Resident Management", "Hostel Announcements"]
    }
  ]

  const testCredentials = [
    { role: "Student", email: "student1@edusync.edu", password: "Student123!", description: "First-time login student" },
    { role: "Student", email: "student2@edusync.edu", password: "Student123!", description: "Regular student with hostel" },
    { role: "Faculty", email: "faculty1@edusync.edu", password: "Faculty123!", description: "Computer Science Professor" },
    { role: "HOD", email: "hod.cse@edusync.edu", password: "Hod123!", description: "Head of CSE Department" },
    { role: "Accountant", email: "accountant@edusync.edu", password: "Accountant123!", description: "Financial Management" },
    { role: "Librarian", email: "librarian@edusync.edu", password: "Librarian123!", description: "Library Management" },
    { role: "T&P Officer", email: "tnp@edusync.edu", password: "Tnp123!", description: "Placement & Training" },
    { role: "Hostel Authority", email: "hostel@edusync.edu", password: "Hostel123!", description: "Hostel Management" },
    { role: "Admin", email: "admin@edusync.edu", password: "Admin123!", description: "System Administrator" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edu-Sync ERP System
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete Student Management System with Role-Based Access Control
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Demo Mode - No Database Required
          </Badge>
        </div>

        {/* Demo Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">🚀 Demo Mode Active</CardTitle>
            <CardDescription className="text-amber-700">
              This is a demonstration of the Edu-Sync ERP system. To use the full system with database functionality, 
              you need to set up Supabase and configure the environment variables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-amber-700">
                <strong>For Full Functionality:</strong>
              </p>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1">
                <li>Create a Supabase project</li>
                <li>Run the SQL scripts in the <code>scripts/</code> folder</li>
                <li>Update <code>.env.local</code> with your Supabase credentials</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Test Credentials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Test User Credentials</span>
            </CardTitle>
            <CardDescription>
              Use these credentials to test different user roles when Supabase is configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCredentials.map((cred, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{cred.role}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> {cred.email}</p>
                    <p><strong>Password:</strong> {cred.password}</p>
                    <p className="text-gray-600 text-xs">{cred.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Explore the system features and setup instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-auto p-4 flex flex-col space-y-2">
                <Link href="/student-login">
                  <GraduationCap className="h-6 w-6" />
                  <span>Student Login</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <Link href="/authority-login">
                  <UserCheck className="h-6 w-6" />
                  <span>Authority Login</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <a href="https://github.com/yourusername/your-repo" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-6 w-6" />
                  <span>View Source</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <a href="/README.md" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-6 w-6" />
                  <span>Documentation</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Edu-Sync ERP System - Built with Next.js 14, TypeScript, Supabase, and Tailwind CSS</p>
          <p className="text-sm mt-2">
            Ready for deployment on GitHub Pages, Vercel, or any static hosting platform
          </p>
        </div>
      </div>
    </div>
  )
}
