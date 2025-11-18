"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyNavbar } from "@/components/faculty-navbar"

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getCurrentPage = () => {
    const pages: { [key: string]: string } = {
      "/faculty/dashboard": "Dashboard",
      "/faculty/courses": "My Courses", 
      "/faculty/attendance": "Attendance",
      "/faculty/grades": "Grades",
      "/faculty/students": "Students",
      "/faculty/analytics": "Analytics"
    }
    return pages[pathname] || "Faculty Portal"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <FacultySidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <FacultySidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <FacultyNavbar 
          onMenuClick={() => setSidebarOpen(true)}
          currentPage={getCurrentPage()}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}