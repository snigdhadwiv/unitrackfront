// app/faculty/courses/page.tsx
"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, FileText, Search, Edit, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
}

export default function FacultyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [searchTerm, courses])

  const fetchCourses = async () => {
    try {
      // Get ALL courses - will filter by faculty later
      const allCourses = await api.getCourses()
      setCourses(allCourses)
      setFilteredCourses(allCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Manage your assigned courses</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses by code, name, or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
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
              
              {/* Faculty Actions - UPDATED LINKS */}
              <div className="flex flex-col gap-2">
                <Link href={`/faculty/courses/${course.id}/students`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    View Students
                  </Button>
                </Link>
                
                <Link href={`/attendance?course=${course.id}`}>
                  <Button className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Mark Attendance
                  </Button>
                </Link>
                
                {/* CHANGED: Now points to faculty course details page */}
                <Link href={`/faculty/courses/${course.id}`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Edit className="h-4 w-4" />
                    Course Details
                  </Button>
                </Link>

                <Link href={`/attendance-dashboard?course=${course.id}`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}