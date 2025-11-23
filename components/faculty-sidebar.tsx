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
    <div 
      className="flex w-64 flex-col border-r bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.9)), url('/sidebar2jlu.png')",
      }}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-black/30 backdrop-blur-sm border-b border-white/20">
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
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors backdrop-blur-sm ${
                  isActive
                    ? "bg-blue-500/80 text-white shadow-lg border-r-2 border-blue-300"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
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