"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"

interface StudentNavbarProps {
  user: any
}

export function StudentNavbar({ user }: StudentNavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api.logout()
      localStorage.removeItem("user")
      localStorage.removeItem("isAuthenticated")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, assignments..."
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}