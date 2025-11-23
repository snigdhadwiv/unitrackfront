"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"

interface AttendanceRecord {
  id: number
  student: number
  course: number
  date: string
  status: string // 'P', 'A', 'L'
  course_code?: string
  course_name?: string
}

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
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudentAttendance()
  }, [selectedMonth])

  const fetchStudentAttendance = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Get current user to get student ID
      const currentUser = await api.getCurrentUser()
      const studentId = currentUser.user.id

      // Fetch attendance data for the current student
      const attendanceData = await api.getAttendance({
        student: studentId.toString(),
        month: selectedMonth
      })

      // Group attendance by course and calculate stats
      const courseMap = new Map()

      attendanceData.forEach((record: AttendanceRecord) => {
        const courseKey = record.course_code || `course-${record.course}`
        
        if (!courseMap.has(courseKey)) {
          courseMap.set(courseKey, {
            course_code: record.course_code || `COURSE-${record.course}`,
            course_name: record.course_name || `Course ${record.course}`,
            attendance: [],
            presentCount: 0,
            totalClasses: 0,
            attendancePercentage: 0
          })
        }

        const course = courseMap.get(courseKey)
        course.attendance.push({
          date: record.date,
          status: record.status
        })
      })

      // Calculate statistics for each course
      const courseData = Array.from(courseMap.values()).map((course: any) => {
        const monthRecords = course.attendance.filter((record: any) => 
          record.date.startsWith(selectedMonth)
        )

        const presentCount = monthRecords.filter((r: any) => r.status === 'P').length
        const totalClasses = monthRecords.length
        const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

        return {
          ...course,
          attendance: monthRecords,
          presentCount,
          totalClasses,
          attendancePercentage
        }
      })

      setCourseAttendance(courseData)
    } catch (error) {
      console.error('Error fetching student attendance:', error)
      setError("Failed to load attendance data. Please try again.")
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P': return "bg-green-100 text-green-800 border-green-200"
      case 'A': return "bg-red-100 text-red-800 border-red-200"
      case 'L': return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
            <p className="mt-1 text-muted-foreground">View your course-wise attendance records</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Loading your attendance...</h3>
              <p className="text-muted-foreground mt-2">Please wait while we fetch your records</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="mt-1 text-muted-foreground">View your course-wise attendance records</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Month Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
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
                    <CardTitle className="text-xl">{course.course_name}</CardTitle>
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
            <CardContent className="space-y-6">
              {/* Attendance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-600">{course.presentCount}</div>
                  <div className="text-sm text-green-800">Present</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-xl font-bold text-red-600">
                    {course.totalClasses - course.presentCount}
                  </div>
                  <div className="text-sm text-red-800">Absent/Late</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">{course.totalClasses}</div>
                  <div className="text-sm text-blue-800">Total Classes</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Attendance Progress</span>
                  <span className={`
                    ${course.attendancePercentage >= 75 ? 'text-green-600' :
                      course.attendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}
                  `}>
                    {course.attendancePercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      course.attendancePercentage >= 75 ? 'bg-green-500' :
                      course.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(course.attendancePercentage, 5)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>75% (Required)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Daily Attendance Calendar */}
              <div>
                <h4 className="font-medium mb-3 text-lg">Daily Records</h4>
                {course.attendance.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {course.attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColor(record.status)}`}
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(record.status)}
                            <div className="text-sm font-medium">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${record.status === 'P' ? 'bg-green-500 text-white border-green-600' :
                                record.status === 'A' ? 'bg-red-500 text-white border-red-600' :
                                'bg-yellow-500 text-white border-yellow-600'}
                            `}
                          >
                            {getStatusText(record.status)}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No attendance records for this month</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Summary */}
      {courseAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5" />
              Overall Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-border rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">
                  {courseAttendance.reduce((sum, course) => sum + course.presentCount, 0)}
                </div>
                <div className="text-sm text-green-800 font-medium">Total Present</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">
                  {courseAttendance.reduce((sum, course) => sum + course.totalClasses, 0)}
                </div>
                <div className="text-sm text-blue-800 font-medium">Total Classes</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">
                  {courseAttendance.length}
                </div>
                <div className="text-sm text-purple-800 font-medium">Courses</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg bg-orange-50">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(courseAttendance.reduce((sum, course) => sum + course.attendancePercentage, 0) / courseAttendance.length)}%
                </div>
                <div className="text-sm text-orange-800 font-medium">Average Attendance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {courseAttendance.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No attendance records found</h3>
            <p className="text-muted-foreground mt-2">
              You don't have any attendance records for the selected period.
            </p>
            <button
              onClick={fetchStudentAttendance}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}