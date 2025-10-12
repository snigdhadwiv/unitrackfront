"use client"

import { useState, useEffect } from "react"  // ← ADD useEffect
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockStudents } from "@/lib/mock-data"  // ← KEEP as fallback
import { StudentModal } from "@/components/student-modal"
import { api } from "@/services/api"  // ← ADD API IMPORT

// ← ADD THIS INTERFACE to match your Django model
interface Student {
  id: number
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  enrollment_date: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add")
  const [loading, setLoading] = useState(true)  // ← ADD loading state

  // ← ADD THIS useEffect TO FETCH REAL DATA
  useEffect(() => {
    api.getStudents()
      .then(data => {
        setStudents(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching students:', error)
        // Fallback to mock data if API fails
        setStudents(mockStudents.map(mock => ({
          id: parseInt(mock.id),
          student_id: mock.rollNo,
          first_name: mock.name.split(' ')[0],
          last_name: mock.name.split(' ')[1] || '',
          email: mock.email,
          phone: mock.phone,
          date_of_birth: "2000-01-01",
          address: "Not specified",
          enrollment_date: "2023-09-01"
        })))
        setLoading(false)
      })
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedStudent(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      // ← UPDATE to use real API
      api.deleteStudent(id.toString())
        .then(() => {
          setStudents(students.filter((s) => s.id !== id))
        })
        .catch(error => {
          console.error('Error deleting student:', error)
          alert('Failed to delete student')
        })
    }
  }

  const handleSave = (studentData: any) => {
    
    if (modalMode === "add") {
      // ← UPDATE to use real API
      api.createStudent(studentData)
        .then(newStudent => {
          setStudents([...students, newStudent])
          setIsModalOpen(false)
        })
        .catch(error => {
          console.error('Error adding student:', error)
          alert('Failed to add student')
        })
    } else if (modalMode === "edit" && selectedStudent) {
      // ← UPDATE to use real API
      api.updateStudent(selectedStudent.id.toString(), studentData)
        .then(updatedStudent => {
          setStudents(students.map((s) => (s.id === selectedStudent.id ? updatedStudent : s)))
          setIsModalOpen(false)
        })
        .catch(error => {
          console.error('Error updating student:', error)
          alert('Failed to update student')
        })
    }
  }

  // ← ADD loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="mt-1 text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">
            Manage student records and information • {students.length} students found
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, student ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{student.student_id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{student.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(student)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        student={selectedStudent}
        mode={modalMode}
      />
    </div>
  )
}