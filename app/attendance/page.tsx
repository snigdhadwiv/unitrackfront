"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react"
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
  student_details: Student
  date: string
  status: string
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    try {
      const [studentsData, attendanceData] = await Promise.all([
        api.getStudents(),
        api.getAttendance({ date: selectedDate })
      ])
      setStudents(studentsData)
      setAttendance(attendanceData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (studentId: number, status: string) => {
    try {
      const existingRecord = attendance.find(record => 
        record.student === studentId && record.date === selectedDate
      )

      // FIXED: Proper data format for Django
      const attendanceData = {
        student: studentId,
        date: selectedDate,
        status: status
      }

      console.log('🟡 Sending to API:', attendanceData)

      if (existingRecord) {
        // FIXED: Send ALL required fields for update
        await api.updateAttendance(existingRecord.id.toString(), attendanceData)
      } else {
        // FIXED: Send proper data format
        await api.markAttendance(attendanceData)
      }
      
      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Failed to mark attendance: ' + error.message)
    }
  }

  const getStudentStatus = (studentId: number) => {
    const record = attendance.find(record => record.student === studentId && record.date === selectedDate)
    return record?.status || null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="mt-1 text-muted-foreground">Loading attendance data...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="mt-1 text-muted-foreground">Mark and manage student attendance</p>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-md"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{students.length} students</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Attendance for {selectedDate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => {
              const status = getStudentStatus(student.id)
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
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