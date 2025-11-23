"use client"

import { useState, useEffect } from "react"
import { BookOpen, Upload, FileText, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { api } from "@/services/api"

interface Course {
  id: number
  course_code: string
  course_name: string
  credits: number
  specialization: string
  year: number
  semester: number
  description?: string
  faculty?: string
}

interface Enrollment {
  id: number
  course: Course
  enrolled_date: string
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Get current user to ensure we're authenticated
      const currentUser = await api.getCurrentUser()
      
      // Use the existing getMyEnrollments method from your API service
      const enrollments = await api.getMyEnrollments()
      
      // Extract courses from enrollments
      const enrolledCourses = enrollments.map((enrollment: Enrollment) => enrollment.course)
      setCourses(enrolledCourses)
      
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      setError("Failed to load your courses. Please try again.")
      
      // Fallback: show all courses for demo purposes
      try {
        const allCourses = await api.getCourses()
        setCourses(allCourses.slice(0, 4)) // Limit to 4 courses for demo
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="mt-1 text-muted-foreground">Loading your enrolled courses...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-muted-foreground">View your enrolled courses and access course materials</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Calendar className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-500" />
                {course.course_code}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{course.course_name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.specialization} • Year {course.year} • Semester {course.semester}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span>Credits: {course.credits}</span>
                  {course.faculty && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {course.faculty}
                    </span>
                  )}
                </div>
                {course.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                )}
              </div>
              
              {/* Student Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/student-courses/${course.id}`}>
                  <Button variant="default" className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600">
                    <FileText className="h-4 w-4" />
                    View Course Details
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Submit Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No courses enrolled</h3>
            <p className="text-muted-foreground mt-2">
              You are not enrolled in any courses yet. Please contact your administrator.
            </p>
            <Button onClick={fetchEnrolledCourses} className="mt-4" variant="outline">
              Refresh Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}