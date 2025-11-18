// app/student-courses/page.tsx
"use client"

import { useState, useEffect } from "react"
import { BookOpen, Upload, FileText } from "lucide-react"
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
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      // This should fetch only courses the student is enrolled in
      const enrolledCourses = await api.getStudentEnrollments() // You'll need to create this API
      setCourses(enrolledCourses)
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      // Fallback: show all courses for now
      const allCourses = await api.getCourses()
      setCourses(allCourses)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading your courses...</h1>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-muted-foreground">View your enrolled courses and submit assignments</p>
      </div>

      {/* Courses Grid - SIMPLIFIED for Students */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {course.course_code}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{course.course_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.specialization} • Year {course.year} • Sem {course.semester}
                </p>
                <p className="text-sm mt-2">Credits: {course.credits}</p>
              </div>
              
              {/* STUDENT-ONLY ACTIONS */}
              <div className="flex flex-col gap-2">
                <Link href={`/student-courses/${course.id}`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    View Course Details
                  </Button>
                </Link>
                <Button className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No courses enrolled</h3>
            <p className="text-muted-foreground mt-2">
              You are not enrolled in any courses yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}