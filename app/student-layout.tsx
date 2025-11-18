"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"
import { StudentNavbar } from "@/components/student-navbar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const userObj = JSON.parse(userData)
    if (userObj.role !== 'STUDENT') {
      router.push("/login")
      return
    }
    
    setUser(userObj)
  }, [router])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentNavbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}