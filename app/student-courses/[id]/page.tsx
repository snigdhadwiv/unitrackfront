// app/student-courses/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BookOpen, FileText, Upload, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"

// Reuse your existing Course interface
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

export default function StudentCourseDetailsPage() {
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

  // Sample assignments data for student view
  const assignments = [
    { 
      id: 1, 
      title: "Assignment 1: Basic Concepts", 
      dueDate: "2024-10-01", 
      maxMarks: 5,
      status: "submitted", // submitted, pending, late
      submittedDate: "2024-09-28",
      marks: 4
    },
    { 
      id: 2, 
      title: "Assignment 2: Advanced Applications", 
      dueDate: "2024-10-15", 
      maxMarks: 5,
      status: "pending",
      submittedDate: null,
      marks: null
    }
  ]

  if (loading) return <div className="p-6">Loading course...</div>
  if (!course) return <div className="p-6">Course not found</div>

  return (
    <div className="space-y-6 p-6">
      {/* Header - SIMPLIFIED for Students */}
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
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB - Student View */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {course.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYLLABUS TAB - Read Only */}
        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Syllabus Not Available</h3>
                <p className="text-gray-500 mt-2">Contact your instructor for the course syllabus</p>
                <Button className="mt-4 gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Request Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSIGNMENTS TAB - STUDENT FOCUS */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Course Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                              <Badge variant={
                                assignment.status === 'submitted' ? 'default' : 
                                assignment.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {assignment.status === 'submitted' ? 'Submitted' : 
                                 assignment.status === 'pending' ? 'Pending' : 'Late'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium text-gray-500">Due Date:</span>
                                <p className="text-gray-900">
                                  {new Date(assignment.dueDate).toLocaleDateString()}
                                  {daysUntilDue > 0 && assignment.status === 'pending' && (
                                    <span className="text-xs text-orange-600 ml-2">
                                      ({daysUntilDue} days left)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Max Marks:</span>
                                <p className="text-gray-900">{assignment.maxMarks}</p>
                              </div>
                              {assignment.marks && (
                                <div>
                                  <span className="font-medium text-gray-500">Your Marks:</span>
                                  <p className="text-green-600 font-semibold">{assignment.marks}/{assignment.maxMarks}</p>
                                </div>
                              )}
                            </div>

                            {assignment.submittedDate && (
                              <p className="text-sm text-green-600">
                                Submitted on: {new Date(assignment.submittedDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {/* STUDENT ACTION BUTTONS */}
                          <div className="flex flex-col gap-2 ml-4">
                            {assignment.status === 'pending' ? (
                              <Button size="sm" className="gap-1">
                                <Upload className="h-3 w-3" />
                                Submit Assignment
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="gap-1">
                                <FileText className="h-3 w-3" />
                                View Submission
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-3 w-3" />
                              Download Brief
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
                  <h3 className="text-lg font-medium text-gray-900">No Assignments Yet</h3>
                  <p className="text-gray-500 mt-2">Your instructor hasn't posted any assignments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}