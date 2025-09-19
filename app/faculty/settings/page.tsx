"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Palette, Save, Eye, EyeOff, Key } from "lucide-react"
import { toast } from "sonner"

interface NotificationSettings {
  emailNotifications: boolean
  attendanceAlerts: boolean
  announcementAlerts: boolean
  deadlineReminders: boolean
  systemUpdates: boolean
}

interface PrivacySettings {
  profileVisibility: string
  showEmail: boolean
  showPhone: boolean
  allowStudentContact: boolean
}

interface ThemeSettings {
  theme: string
  fontSize: string
  compactMode: boolean
}

export default function FacultySettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    attendanceAlerts: true,
    announcementAlerts: true,
    deadlineReminders: true,
    systemUpdates: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "faculty",
    showEmail: true,
    showPhone: false,
    allowStudentContact: true
  })

  // Theme settings
  const [theme, setTheme] = useState<ThemeSettings>({
    theme: "light",
    fontSize: "medium",
    compactMode: false
  })

  useEffect(() => {
    // Load settings from localStorage or API
    const loadSettings = () => {
      try {
        const savedNotifications = localStorage.getItem('faculty-notifications')
        const savedPrivacy = localStorage.getItem('faculty-privacy')
        const savedTheme = localStorage.getItem('faculty-theme')

        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications))
        }
        if (savedPrivacy) {
          setPrivacy(JSON.parse(savedPrivacy))
        }
        if (savedTheme) {
          setTheme(JSON.parse(savedTheme))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setSaving(true)

    try {
      // In a real implementation, this would call an API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value }
    setNotifications(updatedNotifications)
    localStorage.setItem('faculty-notifications', JSON.stringify(updatedNotifications))
    toast.success("Notification settings updated")
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: string | boolean) => {
    const updatedPrivacy = { ...privacy, [key]: value }
    setPrivacy(updatedPrivacy)
    localStorage.setItem('faculty-privacy', JSON.stringify(updatedPrivacy))
    toast.success("Privacy settings updated")
  }

  const handleThemeChange = (key: keyof ThemeSettings, value: string | boolean) => {
    const updatedTheme = { ...theme, [key]: value }
    setTheme(updatedTheme)
    localStorage.setItem('faculty-theme', JSON.stringify(updatedTheme))
    toast.success("Theme settings updated")
  }

  const handleSaveAllSettings = () => {
    localStorage.setItem('faculty-notifications', JSON.stringify(notifications))
    localStorage.setItem('faculty-privacy', JSON.stringify(privacy))
    localStorage.setItem('faculty-theme', JSON.stringify(theme))
    toast.success("All settings saved successfully")
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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSaveAllSettings} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your password and security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              onClick={handlePasswordChange}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Key className="mr-2 h-4 w-4" />
              {saving ? "Changing..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Attendance Alerts</Label>
                <p className="text-sm text-gray-600">Get notified about attendance issues</p>
              </div>
              <Switch
                checked={notifications.attendanceAlerts}
                onCheckedChange={(checked) => handleNotificationChange('attendanceAlerts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Announcement Alerts</Label>
                <p className="text-sm text-gray-600">Get notified about new announcements</p>
              </div>
              <Switch
                checked={notifications.announcementAlerts}
                onCheckedChange={(checked) => handleNotificationChange('announcementAlerts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Deadline Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded about upcoming deadlines</p>
              </div>
              <Switch
                checked={notifications.deadlineReminders}
                onCheckedChange={(checked) => handleNotificationChange('deadlineReminders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>System Updates</Label>
                <p className="text-sm text-gray-600">Get notified about system updates</p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your profile visibility and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <Select 
                value={privacy.profileVisibility} 
                onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="faculty">Faculty Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email</Label>
                <p className="text-sm text-gray-600">Display email on your profile</p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Phone</Label>
                <p className="text-sm text-gray-600">Display phone number on your profile</p>
              </div>
              <Switch
                checked={privacy.showPhone}
                onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Student Contact</Label>
                <p className="text-sm text-gray-600">Allow students to contact you directly</p>
              </div>
              <Switch
                checked={privacy.allowStudentContact}
                onCheckedChange={(checked) => handlePrivacyChange('allowStudentContact', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>Customize your interface appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={theme.theme} 
                onValueChange={(value) => handleThemeChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Select 
                value={theme.fontSize} 
                onValueChange={(value) => handleThemeChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm text-gray-600">Use compact interface layout</p>
              </div>
              <Switch
                checked={theme.compactMode}
                onCheckedChange={(checked) => handleThemeChange('compactMode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your account details and system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-sm text-gray-600">{user?.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Account Created</Label>
                <p className="text-sm text-gray-600">
                  {user?.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-gray-600">
                  {user?.profile?.updated_at ? new Date(user.profile.updated_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm text-green-600">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
