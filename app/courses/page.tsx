"use client"

import { useState, useEffect } from "react"
import { BookOpen, Upload, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"
import { CourseModal } from "@/components/course-modal"
import Link from "next/link"

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    specialization: "",
    year: "",
    semester: ""
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, filters])

  const fetchCourses = async () => {
    try {
      const coursesData = await api.getCourses()
      setCourses(coursesData)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const filterCourses = () => {
    let filtered = courses
    
    if (filters.specialization) {
      filtered = filtered.filter(course => 
        course.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      )
    }
    
    if (filters.year) {
      filtered = filtered.filter(course => course.year === parseInt(filters.year))
    }
    
    if (filters.semester) {
      filtered = filtered.filter(course => course.semester === parseInt(filters.semester))
    }
    
    setFilteredCourses(filtered)
  }

  const handleAddCourse = () => {
    setIsModalOpen(true)
  }

  const handleSaveCourse = async (courseData: any) => {
    try {
      await api.createCourse(courseData)
      fetchCourses() // Refresh the list
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
          <p className="mt-1 text-muted-foreground">Manage curriculum, syllabus, and subjects</p>
        </div>
        <Button onClick={handleAddCourse} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Specialization (CS, IT, etc.)"
              value={filters.specialization}
              onChange={(e) => setFilters({...filters, specialization: e.target.value})}
              className="w-48"
            />
            <Input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Semester"
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {/* Courses Grid */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {filteredCourses.map((course) => (
    <Link key={course.id} href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course.course_code}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold">{course.course_name}</h3>
            <p className="text-sm text-muted-foreground">
              {course.specialization} • Year {course.year} • Sem {course.semester}
            </p>
            {course.description && (
              <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Credits: {course.credits}</span>
            <div className="text-xs text-muted-foreground">Click to view details →</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No courses found</h3>
            <p className="text-muted-foreground mt-2">
              {courses.length === 0 ? "No courses added yet" : "Try changing your filters"}
            </p>
            <Button onClick={handleAddCourse} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
      />
    </div>
  )
}