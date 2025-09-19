"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GraduationCap,
  Calendar,
  Wallet,
  Bell,
  LogOut,
  Menu,
  X,
  Clock,
  Users,
  BarChart3,
  Home,
  Search,
  UserPlus,
  DollarSign,
  Building,
  FileText,
  BookOpen,
  Trophy,
  Briefcase,
  Target,
  Award,
  UserCheck,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  userType: "student" | "teacher" | "admin" | "hostel" | "accountant" | "sports" | "librarian" | "placement" | "faculty" | "hod"
}

export function Sidebar({ userType }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { signOut } = useAuth()

  const getMenuItems = () => {
    const baseItems = [{ icon: GraduationCap, label: "Dashboard", href: "/dashboard" }]

    switch (userType) {
      case "student":
        return [
          ...baseItems,
          { icon: Clock, label: "Attendance", href: "/student/attendance" },
          { icon: Calendar, label: "Timetable", href: "/student/timetable" },
          { icon: Bell, label: "Announcements", href: "/student/announcements" },
          { icon: Wallet, label: "Edu-Credits", href: "/student/wallet" },
          { icon: FileText, label: "My Documents", href: "/student/documents" },
          { icon: UserCheck, label: "Faculty Directory", href: "/student/faculty" },
          { icon: Users, label: "My Groups", href: "/student/groups" },
        ]
      case "teacher":
        return [
          ...baseItems,
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: Clock, label: "Mark Attendance", href: "/faculty/attendance" },
          { icon: Calendar, label: "Manage Timetables", href: "/faculty/timetables" },
          { icon: Bell, label: "Post General Announcement", href: "/faculty/announcements" },
          { icon: Building, label: "Department Announcements", href: "/hod/announcements" },
          { icon: Wallet, label: "Award Credits", href: "/faculty/credits" },
        ]
      case "sports":
        return [
          ...baseItems,
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: Trophy, label: "Sports Announcements", href: "/sports/announcements" },
          { icon: Target, label: "Team Management", href: "/sports/teams" },
          { icon: Calendar, label: "Events & Matches", href: "/sports/events" },
          { icon: Users, label: "Student Athletes", href: "/sports/students" },
        ]
      case "librarian":
        return [
          { icon: Home, label: "Dashboard", href: "/authority/library/dashboard" },
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: BookOpen, label: "Book Catalog", href: "/authority/library/catalog" },
          { icon: Clock, label: "Book Issuance", href: "/authority/library/issuance" },
          { icon: Users, label: "Student Search", href: "/authority/library/students" },
          { icon: BarChart3, label: "Reports", href: "/authority/library/reports" },
        ]
      case "placement":
        return [
          { icon: Home, label: "Dashboard", href: "/authority/tnp/dashboard" },
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: Users, label: "Student Database", href: "/authority/tnp/student-database" },
          { icon: Building, label: "Company Relations", href: "/authority/tnp/companies" },
          { icon: Calendar, label: "Placement Drives", href: "/authority/tnp/placement-drives" },
          { icon: BarChart3, label: "Placement Reports", href: "/authority/tnp/reports" },
        ]
      case "hostel":
        return [
          { icon: Home, label: "Dashboard", href: "/authority/hostel/dashboard" },
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: Home, label: "Room Management", href: "/authority/hostel/room-management" },
          { icon: Users, label: "Student Allocation", href: "/authority/hostel/student-allocation" },
          { icon: BarChart3, label: "Occupancy Reports", href: "/authority/hostel/occupancy-reports" },
          { icon: AlertTriangle, label: "Maintenance", href: "/authority/hostel/maintenance" },
        ]
      case "admin":
        return [
          ...baseItems,
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: BarChart3, label: "Reports", href: "/admin/reports" },
          { icon: Users, label: "Student Management", href: "/admin/students" },
          { icon: Settings, label: "System Settings", href: "/admin/settings" },
        ]
      case "hostel":
        return [
          ...baseItems,
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: Search, label: "Student Search", href: "/hostel/search" },
          { icon: Home, label: "Post Hostel Announcement", href: "/hostel/announcements" },
          { icon: Building, label: "Occupancy Map", href: "/hostel/occupancy" },
        ]
      case "accountant":
        return [
          { icon: Home, label: "Dashboard", href: "/authority/accounts/dashboard" },
          { icon: Bell, label: "View Announcements", href: "/announcements" },
          { icon: UserPlus, label: "Register Student", href: "/authority/accounts/register-student" },
          { icon: Users, label: "Manage Students", href: "/authority/accounts/manage-students" },
          { icon: DollarSign, label: "Fees Management", href: "/authority/accounts/fees" },
          { icon: FileText, label: "Document Management", href: "/authority/accounts/documents" },
          { icon: BarChart3, label: "Reports", href: "/authority/accounts/reports" },
          { icon: Settings, label: "Settings", href: "/authority/accounts/settings" },
        ]
      default:
        return baseItems
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      window.location.href = "/"
    }
  }

  const menuItems = getMenuItems()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">Edu-Sync</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "px-2",
              )}
              asChild
            >
              <a href={item.href}>
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </a>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "px-2",
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}
