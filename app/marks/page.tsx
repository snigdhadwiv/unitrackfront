"use client"

import { useState } from "react"
import { Plus, Search, Edit, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockMarks } from "@/lib/mock-data"
import { MarksModal } from "@/components/marks-modal"

export default function MarksPage() {
  const [marks, setMarks] = useState(mockMarks)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMark, setSelectedMark] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const filteredMarks = marks.filter(
    (mark) =>
      mark.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.courseCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedMark(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEdit = (mark: any) => {
    setSelectedMark(mark)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleSave = (markData: any) => {
    if (modalMode === "add") {
      const newMark = {
        ...markData,
        id: String(marks.length + 1),
      }
      setMarks([...marks, newMark])
    } else {
      setMarks(marks.map((m) => (m.id === selectedMark.id ? { ...m, ...markData } : m)))
    }
    setIsModalOpen(false)
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-success"
    if (grade.startsWith("B")) return "text-primary"
    if (grade.startsWith("C")) return "text-warning"
    return "text-destructive"
  }

  const averageMarks = marks.length > 0 ? (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marks</h1>
          <p className="mt-1 text-muted-foreground">Manage student marks and grades</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Marks
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Records</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{marks.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Marks</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{averageMarks}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Award className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {marks.length > 0 ? ((marks.filter((m) => m.marks >= 40).length / marks.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Award className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student name, roll number, or course..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Marks</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Grade</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Percentage</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map((mark) => (
                <tr key={mark.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{mark.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{mark.studentName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {mark.courseCode} - {mark.courseName}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
                    {mark.marks}/{mark.maxMarks}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getGradeColor(mark.grade)}`}
                    >
                      {mark.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
                    {((mark.marks / mark.maxMarks) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(mark)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMarks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No marks records found</p>
          </div>
        )}
      </div>

      <MarksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mark={selectedMark}
        mode={modalMode}
      />
    </div>
  )
}
