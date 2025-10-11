"use client"

import type React from "react"

import { useState } from "react"
import { User, Lock, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@college.edu",
    phone: "+1234567890",
    role: "Administrator",
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    attendanceAlerts: true,
    marksUpdates: true,
    systemUpdates: false,
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.new !== password.confirm) {
      alert("New passwords do not match!")
      return
    }
    alert("Password changed successfully!")
    setPassword({ current: "", new: "", confirm: "" })
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground">Update your password regularly</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Attendance Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified about attendance updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.attendanceAlerts}
                  onChange={(e) => setNotifications({ ...notifications, attendanceAlerts: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Marks Updates</p>
                  <p className="text-sm text-muted-foreground">Notifications for new marks entries</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marksUpdates}
                  onChange={(e) => setNotifications({ ...notifications, marksUpdates: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">System Updates</p>
                  <p className="text-sm text-muted-foreground">Important system announcements</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Account Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">System Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium text-foreground">Today, 9:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium text-foreground">Administrator</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
