"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, BookOpen, Award, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { api } from "@/services/api"

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    
    const userObj = JSON.parse(userData)
    setUser(userObj)
    
    // Fetch student's enrolled courses
    api.getMyEnrollments()
      .then(data => {
        setEnrollments(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch enrollments:", error)
        setLoading(false)
      })
  }, [router])

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {user.first_name} {user.last_name}!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Courses</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {loading ? "..." : enrollments.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Semester</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {enrollments[0]?.semester || "-"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Calendar className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="mt-2 text-lg font-bold text-foreground">
                {user.department?.name || "Not assigned"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
              <User className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="mt-2 text-lg font-bold text-foreground">
                {enrollments[0]?.academic_year || "2024-2025"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Award className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* My Courses */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">My Courses</h2>
        {loading ? (
          <p>Loading courses...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-muted-foreground">No courses enrolled yet.</p>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{enrollment.course_name}</h3>
                  <p className="text-sm text-muted-foreground">{enrollment.course_code}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Semester {enrollment.semester}</p>
                  <p className="text-sm text-muted-foreground">{enrollment.academic_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}