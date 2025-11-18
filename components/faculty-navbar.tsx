"use client"

import { Menu, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FacultyNavbarProps {
  onMenuClick: () => void
  currentPage: string
}

export function FacultyNavbar({ onMenuClick, currentPage }: FacultyNavbarProps) {
  const handleLogout = () => {
    // Add logout logic
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="md:hidden mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-4 md:ml-0">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentPage}
            </h2>
          </div>
        </div>
        
        {/* Top right actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
          
          {/* User info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Professor</p>
              <p className="text-xs text-gray-500">Faculty</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}