// app/student-attendance/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"

interface CourseAttendance {
  course_code: string
  course_name: string
  attendance: {
    date: string
    status: string // 'P', 'A', 'L'
  }[]
  presentCount: number
  totalClasses: number
  attendancePercentage: number
}

export default function StudentAttendancePage() {
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentAttendance()
  }, [selectedMonth])

  const fetchStudentAttendance = async () => {
    try {
      // This should fetch attendance for current student, grouped by course
      const attendanceData = await api.getStudentAttendance() // You'll need this API
      
      // Group by course and calculate stats (inspired by your dashboard code)
      const courseData = attendanceData.map((course: any) => {
        const monthRecords = course.attendance.filter((record: any) => 
          record.date.startsWith(selectedMonth)
        )

        const presentCount = monthRecords.filter((r: any) => r.status === 'P').length
        const totalClasses = monthRecords.length
        const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

        return {
          course_code: course.course_code,
          course_name: course.course_name,
          attendance: monthRecords,
          presentCount,
          totalClasses,
          attendancePercentage
        }
      })

      setCourseAttendance(courseData)
    } catch (error) {
      console.error('Error fetching student attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'P': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'A': return <XCircle className="h-4 w-4 text-red-500" />
      case 'L': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'P': return "Present"
      case 'A': return "Absent"
      case 'L': return "Late"
      default: return "Not Marked"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Loading your attendance...</h1>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
        <p className="mt-1 text-muted-foreground">View your course-wise attendance records</p>
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
            <div className="text-sm text-muted-foreground">
              Viewing attendance for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course-wise Attendance */}
      <div className="space-y-6">
        {courseAttendance.map((course) => (
          <Card key={course.course_code} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle>{course.course_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.course_code}</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  course.attendancePercentage >= 75 ? 'text-green-600' :
                  course.attendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {course.attendancePercentage}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Attendance Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{course.presentCount}</div>
                  <div className="text-sm text-green-800">Present</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">
                    {course.totalClasses - course.presentCount}
                  </div>
                  <div className="text-sm text-red-800">Absent/Late</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{course.totalClasses}</div>
                  <div className="text-sm text-blue-800">Total Classes</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Attendance Progress</span>
                  <span>{course.attendancePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      course.attendancePercentage >= 75 ? 'bg-green-500' :
                      course.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${course.attendancePercentage}%` }}
                  />
                </div>
              </div>

              {/* Daily Attendance Calendar */}
              <div>
                <h4 className="font-medium mb-3">Daily Records:</h4>
                <div className="flex flex-wrap gap-2">
                  {course.attendance.length > 0 ? (
                    course.attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg"
                          title={`${record.date}: ${getStatusText(record.status)}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="text-sm">
                            {new Date(record.date).getDate()} {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <Badge variant={
                            record.status === 'P' ? 'default' :
                            record.status === 'A' ? 'destructive' : 'secondary'
                          } className="text-xs">
                            {getStatusText(record.status)}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No attendance records for this month</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Summary */}
      {courseAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overall Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {courseAttendance.reduce((sum, course) => sum + course.presentCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Present</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {courseAttendance.reduce((sum, course) => sum + course.totalClasses, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {courseAttendance.length}
                </div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(courseAttendance.reduce((sum, course) => sum + course.attendancePercentage, 0) / courseAttendance.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Average Attendance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {courseAttendance.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No attendance records found</h3>
            <p className="text-muted-foreground mt-2">
              You don't have any attendance records for the selected period.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}