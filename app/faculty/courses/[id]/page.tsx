// app/faculty/courses/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BookOpen, FileText, Upload, Download, Calendar, Edit, Users, BarChart3, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import Link from "next/link"

interface Course {
  id: number
  course_code: string
  course_name: string
  credits: number
  specialization: string
  year: number
  semester: number
  description: string
}

export default function FacultyCourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await api.getCourse(courseId)
        setCourse(courseData)
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  // FACULTY VERSION - Assignment management data
  const assignments = [
    { 
      id: 1, 
      title: "Assignment 1: Basic Concepts", 
      dueDate: "2024-10-01", 
      maxMarks: 5,
      submissions: 45, // Total students who submitted
      totalStudents: 50, // Total enrolled students
      averageMarks: 3.8,
      status: "graded" // graded, pending, draft
    },
    { 
      id: 2, 
      title: "Assignment 2: Advanced Applications", 
      dueDate: "2024-10-15", 
      maxMarks: 5,
      submissions: 12,
      totalStudents: 50,
      averageMarks: null,
      status: "pending"
    }
  ]

  if (loading) return <div className="p-6">Loading course...</div>
  if (!course) return <div className="p-6">Course not found</div>

  return (
    <div className="space-y-6 p-6">
      {/* Header - SAME LAYOUT but with Faculty Actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{course.course_code}</h1>
              <h2 className="text-xl text-gray-600 mt-1">{course.course_name}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary">{course.credits} Credits</Badge>
            <Badge variant="outline">{course.specialization}</Badge>
            <Badge variant="outline">Year {course.year} • Semester {course.semester}</Badge>
          </div>
        </div>
        
        {/* FACULTY QUICK ACTIONS */}
        <div className="flex gap-2">
          <Link href={`/faculty/courses/${courseId}/students`}>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Manage Students
            </Button>
          </Link>
          <Link href={`/attendance?course=${courseId}`}>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4"> {/* Added extra tab */}
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB - FACULTY can edit */}
        <TabsContent value="overview">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Information</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Description
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {course.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYLLABUS TAB - FACULTY can upload/edit */}
        <TabsContent value="syllabus">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Syllabus</CardTitle>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Syllabus
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Syllabus Uploaded</h3>
                <p className="text-gray-500 mt-2">Upload the course syllabus for students</p>
                <Button className="mt-4 gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Syllabus PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSIGNMENTS TAB - FACULTY MANAGEMENT */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Assignments</CardTitle>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const submissionRate = ((assignment.submissions / assignment.totalStudents) * 100).toFixed(1)
                  
                  return (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                              <Badge variant={
                                assignment.status === 'graded' ? 'default' : 
                                assignment.status === 'pending' ? 'secondary' : 'outline'
                              }>
                                {assignment.status === 'graded' ? 'Graded' : 
                                 assignment.status === 'pending' ? 'Pending Review' : 'Draft'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium text-gray-500">Due Date:</span>
                                <p className="text-gray-900">
                                  {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Submissions:</span>
                                <p className="text-gray-900">
                                  {assignment.submissions}/{assignment.totalStudents} ({submissionRate}%)
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Max Marks:</span>
                                <p className="text-gray-900">{assignment.maxMarks}</p>
                              </div>
                              {assignment.averageMarks && (
                                <div>
                                  <span className="font-medium text-gray-500">Avg Marks:</span>
                                  <p className="text-green-600 font-semibold">{assignment.averageMarks}/{assignment.maxMarks}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* FACULTY MANAGEMENT BUTTONS */}
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" className="gap-1">
                              <Edit className="h-3 w-3" />
                              Grade Submissions
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <BarChart3 className="h-3 w-3" />
                              View Analytics
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-3 w-3" />
                              Export Grades
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {assignments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Assignments Created</h3>
                  <p className="text-gray-500 mt-2">Create your first assignment for students</p>
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB - FACULTY ONLY */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                <p className="text-gray-500 mt-2">View student performance and engagement analytics</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Attendance
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Grades
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}