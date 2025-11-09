"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/services/api"

interface Student {
  id: number
  student_id: string
  first_name: string
  last_name: string
}

interface AttendanceRecord {
  id: number
  student: number
  date: string
  status: string
}

interface StudentAttendance {
  student: Student
  records: AttendanceRecord[]
  presentCount: number
  absentCount: number
  lateCount: number
  totalDays: number
  attendancePercentage: number
}

export default function AttendanceDashboard() {
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendanceData()
  }, [selectedMonth])

  const fetchAttendanceData = async () => {
    try {
      const [studentsData, attendanceData] = await Promise.all([
        api.getStudents(),
        api.getAttendance() // Get all attendance records
      ])

      // Calculate attendance for each student
      const studentAttendanceData = studentsData.map((student: Student) => {
        const studentRecords = attendanceData.filter((record: AttendanceRecord) => 
          record.student === student.id && 
          record.date.startsWith(selectedMonth)
        )

        const presentCount = studentRecords.filter(r => r.status === 'P').length
        const absentCount = studentRecords.filter(r => r.status === 'A').length
        const lateCount = studentRecords.filter(r => r.status === 'L').length
        const totalDays = studentRecords.length
        const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0

        return {
          student,
          records: studentRecords,
          presentCount,
          absentCount,
          lateCount,
          totalDays,
          attendancePercentage
        }
      })

      setStudentAttendance(studentAttendanceData)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'P': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'A': return <XCircle className="h-3 w-3 text-red-500" />
      case 'L': return <Clock className="h-3 w-3 text-yellow-500" />
      default: return null
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Loading attendance analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Dashboard</h1>
          <p className="mt-1 text-muted-foreground">View student attendance analytics and history</p>
        </div>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-border rounded-md"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{studentAttendance.length} students</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Attendance Cards */}
      <div className="grid gap-6">
        {studentAttendance.map(({ student, presentCount, absentCount, lateCount, totalDays, attendancePercentage, records }) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {student.first_name} {student.last_name}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({student.student_id})
                    </span>
                  </CardTitle>
                </div>
                <div className={`text-2xl font-bold ${getPercentageColor(attendancePercentage)}`}>
                  {attendancePercentage}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Attendance Stats */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                  <div className="text-sm text-muted-foreground">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                  <div className="text-sm text-muted-foreground">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                  <div className="text-sm text-muted-foreground">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>

              {/* Attendance History */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Daily Attendance:</h4>
                <div className="flex flex-wrap gap-2">
                  {records.length > 0 ? (
                    records
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center gap-1 px-2 py-1 border border-border rounded text-xs"
                          title={`${record.date}: ${record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : 'Late'}`}
                        >
                          {getStatusIcon(record.status)}
                          <span>{new Date(record.date).getDate()}</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No attendance records for this month</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Attendance Progress</span>
                  <span>{attendancePercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      attendancePercentage >= 80 ? 'bg-green-500' :
                      attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {studentAttendance.reduce((sum, sa) => sum + sa.presentCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Present</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {studentAttendance.reduce((sum, sa) => sum + sa.absentCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Absent</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {studentAttendance.filter(sa => sa.attendancePercentage >= 75).length}
              </div>
              <div className="text-sm text-muted-foreground">Students ≥75%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}