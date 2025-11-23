"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BookOpen, FileText, Upload, Download, Calendar, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"

interface Course {
  id: number
  course_code: string
  course_name: string
  credits: number
  specialization: string
  year: number
  semester: number
  description: string
  faculty_name?: string
}

interface Assignment {
  id: number
  title: string
  due_date: string
  max_marks: number
  status: "submitted" | "pending" | "late" | "graded"
  submitted_date?: string
  obtained_marks?: number
  description?: string
}

export default function StudentCourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError("")
        
        // Fetch course details
        const courseData = await api.getCourse(courseId)
        setCourse(courseData)
        
        // For now, use sample assignments - you can replace with real API later
        const sampleAssignments: Assignment[] = [
          { 
            id: 1, 
            title: "Assignment 1: Basic Concepts", 
            due_date: "2024-10-01", 
            max_marks: 10,
            status: "graded",
            submitted_date: "2024-09-28",
            obtained_marks: 8,
            description: "Submit a report on basic programming concepts"
          },
          { 
            id: 2, 
            title: "Assignment 2: Advanced Applications", 
            due_date: "2024-10-15", 
            max_marks: 15,
            status: "submitted",
            submitted_date: "2024-10-14",
            description: "Create a web application demonstrating advanced concepts"
          },
          { 
            id: 3, 
            title: "Assignment 3: Final Project", 
            due_date: "2024-11-01", 
            max_marks: 25,
            status: "pending",
            description: "Complete the final course project"
          }
        ]
        setAssignments(sampleAssignments)
        
      } catch (error) {
        console.error('Error fetching course:', error)
        setError("Failed to load course details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800 border-green-200'
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'late': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Course Not Found</h3>
            <p className="text-muted-foreground mt-2">
              The course you're looking for doesn't exist or you don't have access.
            </p>
            <Button onClick={() => window.history.back()} className="mt-4" variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
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
          
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              {course.credits} Credits
            </Badge>
            <Badge variant="outline">{course.specialization}</Badge>
            <Badge variant="outline">Year {course.year} • Semester {course.semester}</Badge>
            {course.faculty_name && (
              <Badge variant="outline" className="gap-1">
                <User className="h-3 w-3" />
                {course.faculty_name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <FileText className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
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

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {course.description || "No detailed description available for this course."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Course Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course Code:</span>
                      <span className="font-medium">{course.course_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium">{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium">{course.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year/Semester:</span>
                      <span className="font-medium">{course.year} • {course.semester}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Download Course Materials
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      View Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYLLABUS TAB */}
        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Syllabus Not Available</h3>
                <p className="text-gray-500 mt-2">
                  The course syllabus will be provided by your instructor. 
                  Please check back later or contact your course faculty.
                </p>
                <Button className="mt-4 gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Request Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSIGNMENTS TAB */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Course Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const daysUntilDue = getDaysUntilDue(assignment.due_date)
                  const isOverdue = daysUntilDue < 0
                  
                  return (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                              <Badge className={getAssignmentStatusColor(assignment.status)}>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </Badge>
                            </div>
                            
                            {assignment.description && (
                              <p className="text-gray-600 mb-3">{assignment.description}</p>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="font-medium text-gray-500">Due Date:</span>
                                <p className="text-gray-900 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(assignment.due_date).toLocaleDateString()}
                                  {!isOverdue && assignment.status === 'pending' && (
                                    <span className="text-xs text-orange-600 ml-2">
                                      ({daysUntilDue} days left)
                                    </span>
                                  )}
                                  {isOverdue && assignment.status === 'pending' && (
                                    <span className="text-xs text-red-600 ml-2">
                                      (Overdue)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Max Marks:</span>
                                <p className="text-gray-900">{assignment.max_marks}</p>
                              </div>
                              {assignment.obtained_marks !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-500">Your Marks:</span>
                                  <p className="text-green-600 font-semibold">
                                    {assignment.obtained_marks}/{assignment.max_marks}
                                  </p>
                                </div>
                              )}
                              {assignment.submitted_date && (
                                <div>
                                  <span className="font-medium text-gray-500">Submitted:</span>
                                  <p className="text-gray-900 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(assignment.submitted_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 ml-4">
                            {assignment.status === 'pending' ? (
                              <Button size="sm" className="gap-1 bg-blue-500 hover:bg-blue-600">
                                <Upload className="h-3 w-3" />
                                Submit
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
                  <p className="text-gray-500 mt-2">
                    Your instructor hasn't posted any assignments for this course yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}