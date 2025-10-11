"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockFaculty } from "@/lib/mock-data"
import { FacultyModal } from "@/components/faculty-modal"

export default function FacultyPage() {
  const [faculty, setFaculty] = useState(mockFaculty)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const filteredFaculty = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedFaculty(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEdit = (member: any) => {
    setSelectedFaculty(member)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      setFaculty(faculty.filter((f) => f.id !== id))
    }
  }

  const handleSave = (facultyData: any) => {
    if (modalMode === "add") {
      const newFaculty = {
        ...facultyData,
        id: String(faculty.length + 1),
      }
      setFaculty([...faculty, newFaculty])
    } else {
      setFaculty(faculty.map((f) => (f.id === selectedFaculty.id ? { ...f, ...facultyData } : f)))
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty</h1>
          <p className="mt-1 text-muted-foreground">Manage faculty members and their information</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, department, or designation..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Designation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Specialization</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{member.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {member.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{member.department}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{member.specialization}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFaculty.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No faculty members found</p>
          </div>
        )}
      </div>

      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        faculty={selectedFaculty}
        mode={modalMode}
      />
    </div>
  )
}
