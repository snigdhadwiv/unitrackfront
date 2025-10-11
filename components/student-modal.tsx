"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (student: any) => void
  student: any
  mode: "add" | "edit" | "view"
}

export function StudentModal({ isOpen, onClose, onSave, student, mode }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    year: "",
    phone: "",
  })

  useEffect(() => {
    if (student) {
      setFormData(student)
    } else {
      setFormData({
        name: "",
        email: "",
        rollNo: "",
        department: "",
        year: "",
        phone: "",
      })
    }
  }, [student, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  const isViewMode = mode === "view"
  const title = mode === "add" ? "Add New Student" : mode === "edit" ? "Edit Student" : "Student Details"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && <Button type="submit">{mode === "add" ? "Add Student" : "Save Changes"}</Button>}
          </div>
        </form>
      </div>
    </div>
  )
}
