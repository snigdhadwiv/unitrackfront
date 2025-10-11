"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockStudents } from "@/lib/mock-data"
import { StudentModal } from "@/components/student-modal"

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedStudent(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEdit = (student: any) => {
    setSelectedStudent(student)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleView = (student: any) => {
    setSelectedStudent(student)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  const handleSave = (studentData: any) => {
    if (modalMode === "add") {
      const newStudent = {
        ...studentData,
        id: String(students.length + 1),
      }
      setStudents([...students, newStudent])
    } else if (modalMode === "edit") {
      setStudents(students.map((s) => (s.id === selectedStudent.id ? { ...s, ...studentData } : s)))
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">Manage student records and information</p>
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
            placeholder="Search by name, roll number, email, or department..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Roll No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Year</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{student.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{student.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{student.year}</td>
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
