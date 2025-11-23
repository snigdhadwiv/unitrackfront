"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FileText,
  Calendar,
  CreditCard,
  User,
} from "lucide-react"

const studentNavigation = [
  { name: "Dashboard", href: "/student-dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/student-courses", icon: BookOpen },
  { name: "Attendance", href: "/student-attendance", icon: ClipboardCheck },
  { name: "Marks & Report Cards", href: "/student-marks", icon: FileText },
  { name: "Exam Forms", href: "/student-exam-forms", icon: FileText },
  { name: "Timetable", href: "/student-timetable", icon: Calendar },
  { name: "Fees", href: "/student-fees", icon: CreditCard },
  { name: "Profile", href: "/student-profile", icon: User },
]

export function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div 
      className="flex h-screen w-64 flex-col border-r border-border bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(30, 41, 59, 0.25), rgba(15, 23, 42, 0.9)), url('/sidebar1jlu.png')",
      }}
    >
      <div className="flex h-16 items-center border-b border-border/20 px-6 bg-black/20 ">
        <Link href="/student-dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">Student Portal</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {studentNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-lg"
                  : "text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}