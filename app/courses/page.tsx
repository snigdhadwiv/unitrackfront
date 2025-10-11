"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockCourses } from "@/lib/mock-data"
import { CourseModal } from "@/components/course-modal"

export default function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedCourse(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEdit = (course: any) => {
    setSelectedCourse(course)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const handleSave = (courseData: any) => {
    if (modalMode === "add") {
      const newCourse = {
        ...courseData,
        id: String(courses.length + 1),
      }
      setCourses([...courses, newCourse])
    } else {
      setCourses(courses.map((c) => (c.id === selectedCourse.id ? { ...c, ...courseData } : c)))
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Manage course catalog and assignments</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by course name, code, faculty, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course.id} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Faculty:</span>
                <span className="font-medium text-foreground">{course.faculty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium text-foreground">{course.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits:</span>
                <span className="font-medium text-foreground">{course.credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Semester:</span>
                <span className="font-medium text-foreground">{course.semester}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEdit(course)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="rounded-lg border border-border bg-card py-12 text-center">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        course={selectedCourse}
        mode={modalMode}
      />
    </div>
  )
}
