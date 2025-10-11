"use client"

import { useState } from "react"
import { Calendar, Filter, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockAttendance, mockCourses } from "@/lib/mock-data"

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(mockAttendance)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedCourse, setSelectedCourse] = useState("all")

  const filteredAttendance = attendance.filter((record) => {
    const dateMatch = record.date === selectedDate
    const courseMatch = selectedCourse === "all" || record.courseCode === selectedCourse
    return dateMatch && courseMatch
  })

  const toggleAttendance = (id: string) => {
    setAttendance(
      attendance.map((record) =>
        record.id === id ? { ...record, status: record.status === "present" ? "absent" : "present" } : record,
      ),
    )
  }

  const presentCount = filteredAttendance.filter((r) => r.status === "present").length
  const absentCount = filteredAttendance.filter((r) => r.status === "absent").length
  const attendancePercentage =
    filteredAttendance.length > 0 ? ((presentCount / filteredAttendance.length) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="mt-1 text-muted-foreground">Track and manage student attendance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Students</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{filteredAttendance.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Present</p>
          <p className="mt-2 text-2xl font-bold text-success">{presentCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Absent</p>
          <p className="mt-2 text-2xl font-bold text-destructive">{absentCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
          <p className="mt-2 text-2xl font-bold text-primary">{attendancePercentage}%</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Courses</option>
            {mockCourses.map((course) => (
              <option key={course.id} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{record.rollNo}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{record.studentName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {record.courseCode} - {record.courseName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{record.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        record.status === "present"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {record.status === "present" ? (
                        <>
                          <Check className="h-3 w-3" />
                          Present
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Absent
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAttendance(record.id)}
                      className={
                        record.status === "present"
                          ? "border-destructive/50 text-destructive hover:bg-destructive/10"
                          : "border-success/50 text-success hover:bg-success/10"
                      }
                    >
                      {record.status === "present" ? "Mark Absent" : "Mark Present"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendance.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No attendance records found for the selected date and course</p>
          </div>
        )}
      </div>
    </div>
  )
}
