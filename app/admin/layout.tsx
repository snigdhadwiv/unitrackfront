// app/admin/layout.tsx
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { 
  BookOpen, Users, Calendar, FileText, BarChart3, Home,
  Settings, Database, Shield, GraduationCap, ClipboardList,
  DollarSign, Clock, Building, Mail, Bell
} from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // ALL MODULES - EVERYTHING UNLOCKED FOR ADMIN
  const navigation = [
    // Dashboard
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: Home },
    
    // Student Management
    { name: "All Students", href: "/admin/students", icon: Users },
    { name: "Student Enrollment", href: "/admin/enrollments", icon: ClipboardList },
    { name: "Student Attendance", href: "/admin/attendance", icon: Calendar },
    { name: "Student Grades", href: "/admin/grades", icon: GraduationCap },
    
    // Faculty Management  
    { name: "All Faculty", href: "/admin/faculty", icon: Users },
    { name: "Faculty Assignments", href: "/admin/faculty-assignments", icon: BookOpen },
    
    // Course Management
    { name: "All Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Course Management", href: "/admin/course-management", icon: Settings },
    { name: "Syllabus Management", href: "/admin/syllabus", icon: FileText },
    
    // Academic
    { name: "Attendance System", href: "/admin/attendance-system", icon: Calendar },
    { name: "Grade Management", href: "/admin/grade-management", icon: FileText },
    { name: "Timetable", href: "/admin/timetable", icon: Clock },
    
    // Financial
    { name: "Fee Management", href: "/admin/fees", icon: DollarSign },
    
    // Analytics & Reports
    { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3 },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    
    // System Admin
    { name: "User Management", href: "/admin/users", icon: Shield },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
    { name: "Database", href: "/admin/database", icon: Database },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar - ALL MODULES VISIBLE */}
      <div className="hidden md:flex md:w-80 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-purple-900 to-purple-700">
          {/* Admin Header */}
          <div className="flex items-center justify-center h-20 flex-shrink-0 px-4 bg-purple-800">
            <Shield className="h-8 w-8 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">ADMIN PORTAL</h1>
          </div>
          
          {/* Navigation - SCROLLABLE for all modules */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-white text-purple-700 shadow-lg"
                        : "text-purple-100 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Admin Top Bar */}
        <header className="bg-white shadow-lg border-b-4 border-purple-600">
          <div className="flex items-center justify-between h-20 px-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Administrator Panel</h2>
              <p className="text-sm text-gray-600">Full System Access • Superuser Mode</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">SUPER ADMIN</p>
                  <p className="text-xs text-gray-500">admin@jlu.edu.in</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-purple-50">
          {children}
        </main>
      </div>
    </div>
  )
}