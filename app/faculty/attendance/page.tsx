"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

interface Student {
  id: number
  email: string
  first_name: string
  last_name: string
  student_id: string
}

interface Course {
  id: number
  course_code: string
  course_name: string
}

interface AttendanceRecord {
  id: number
  student: number
  student_details: Student
  date: string
  status: string
}

export default function FacultyAttendance() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    fetchFacultyCourses()
  }, [selectedDate, selectedCourse])

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      
      // Get faculty's students
      const facultyStudents = await api.getFacultyStudents(user.id)
      setStudents(facultyStudents)

      // Get attendance for selected date
      const attendanceData = await api.getAttendance({ date: selectedDate })
      setAttendance(attendanceData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFacultyCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const facultyCourses = await api.getFacultyCourses(user.id)
      setCourses(facultyCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  // Filter students by selected course
  const getEnrolledStudents = async () => {
    if (!selectedCourse) return students
    
    try {
      const courseStudents = await api.getCourseStudents(selectedCourse.toString())
      return courseStudents
    } catch (error) {
      console.error('Error fetching course students:', error)
      return students
    }
  }

  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([])

  useEffect(() => {
    const updateEnrolledStudents = async () => {
      const enrolled = await getEnrolledStudents()
      setEnrolledStudents(enrolled)
    }
    updateEnrolledStudents()
  }, [selectedCourse, students])

  const handleMarkAttendance = async (studentId: number, status: string) => {
    try {
      const existingRecord = attendance.find(record => 
        record.student === studentId && record.date === selectedDate
      )

      const attendanceData = {
        student: studentId,
        date: selectedDate,
        status: status
      }

      if (existingRecord) {
        await api.updateAttendance(existingRecord.id.toString(), attendanceData)
      } else {
        await api.markAttendance(attendanceData)
      }
      
      fetchData()
    } catch (error: any) {
      console.error('Error marking attendance:', error)
      alert('Failed to mark attendance: ' + error.message)
    }
  }

  const getStudentStatus = (studentId: number) => {
    const record = attendance.find(record => record.student === studentId && record.date === selectedDate)
    return record?.status || null
  }

  const getAttendanceSummary = () => {
    const present = attendance.filter(r => r.status === 'P').length
    const absent = attendance.filter(r => r.status === 'A').length
    const late = attendance.filter(r => r.status === 'L').length
    const total = enrolledStudents.length
    
    return { present, absent, late, total }
  }

  const summary = getAttendanceSummary()

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Loading attendance data...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Faculty Attendance</h1>
          <p className="text-muted-foreground">Mark attendance for your students</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date, Course Filter & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </CardContent>
        </Card>

        {/* Course Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border rounded"
            >
              <option value="">All My Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} - {course.course_name}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <p className="text-sm text-blue-600 mt-2">
                Showing: {courses.find(c => c.id === selectedCourse)?.course_code}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-2xl font-bold text-green-600">{summary.present}</div>
                <div className="text-xs text-green-700">Present</div>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
                <div className="text-xs text-red-700">Absent</div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-2xl font-bold text-yellow-600">{summary.late}</div>
                <div className="text-xs text-yellow-700">Late</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-xs text-blue-700">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance for {selectedDate}
            <span className="text-sm font-normal text-muted-foreground">
              ({enrolledStudents.length} students)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledStudents.map((student) => {
              const status = getStudentStatus(student.id)
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {student.student_id} • Email: {student.email}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={status === 'P' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMarkAttendance(student.id, 'P')}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Present
                    </Button>
                    
                    <Button
                      variant={status === 'A' ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleMarkAttendance(student.id, 'A')}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Absent
                    </Button>
                    
                    <Button
                      variant={status === 'L' ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleMarkAttendance(student.id, 'L')}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Late
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}