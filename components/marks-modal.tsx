"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MarksModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (mark: any) => void
  mark: any
  mode: "add" | "edit"
}

export function MarksModal({ isOpen, onClose, onSave, mark, mode }: MarksModalProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    rollNo: "",
    courseCode: "",
    courseName: "",
    marks: "",
    maxMarks: "100",
    grade: "",
  })

  useEffect(() => {
    if (mark) {
      setFormData(mark)
    } else {
      setFormData({
        studentId: "",
        studentName: "",
        rollNo: "",
        courseCode: "",
        courseName: "",
        marks: "",
        maxMarks: "100",
        grade: "",
      })
    }
  }, [mark, isOpen])

  const calculateGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C+"
    if (percentage >= 40) return "C"
    return "F"
  }

  const handleMarksChange = (value: string) => {
    setFormData({ ...formData, marks: value })
    if (value && formData.maxMarks) {
      const grade = calculateGrade(Number(value), Number(formData.maxMarks))
      setFormData((prev) => ({ ...prev, marks: value, grade }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{mode === "add" ? "Add Marks" : "Edit Marks"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g., Alice Johnson"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g., CS2021001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g., CS301"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="e.g., Data Structures"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Marks Obtained</Label>
              <Input
                id="marks"
                type="number"
                value={formData.marks}
                onChange={(e) => handleMarksChange(e.target.value)}
                placeholder="e.g., 85"
                min="0"
                max={formData.maxMarks}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMarks">Maximum Marks</Label>
              <Input
                id="maxMarks"
                type="number"
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                placeholder="e.g., 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" value={formData.grade} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Percentage</Label>
              <Input
                value={
                  formData.marks && formData.maxMarks
                    ? `${((Number(formData.marks) / Number(formData.maxMarks)) * 100).toFixed(1)}%`
                    : "0%"
                }
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Add Marks" : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
