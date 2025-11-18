"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Home
} from "lucide-react"

export function FacultySidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/faculty/dashboard", icon: Home },
    { name: "My Courses", href: "/faculty/courses", icon: BookOpen },
    { name: "Attendance", href: "/faculty/attendance", icon: Calendar },
    { name: "Grades", href: "/faculty/grades", icon: FileText },
    { name: "Students", href: "/faculty/students", icon: Users },
    { name: "Analytics", href: "/faculty/analytics", icon: BarChart3 },
  ]

  return (
    <div className="flex w-64 flex-col bg-white border-r">
      {/* Sidebar header */}
      <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-blue-600">
        <h1 className="text-lg font-bold text-white">Faculty Portal</h1>
      </div>
      
      {/* Sidebar navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
  )
}