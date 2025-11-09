"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BookOpen, FileText, Upload, Users, BarChart3, Calendar, Download, Award, Clock, Target, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
}

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🟡 Fetching course with ID:', courseId)
    
    const fetchCourse = async () => {
      try {
        const courseData = await api.getCourse(courseId)
        console.log('🟢 Course data received:', courseData)
        setCourse(courseData)
      } catch (error) {
        console.error('🔴 Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  // Sample assignments data
  const assignments = [
    { 
      id: 1, 
      title: "Assignment 1: Basic Concepts & Fundamentals", 
      description: "Understanding core concepts and applying basic principles",
      dueDate: "2024-10-01", 
      maxMarks: 5, 
      submitted: 45, 
      totalStudents: 60,
      status: "active"
    },
    { 
      id: 2, 
      title: "Assignment 2: Advanced Applications", 
      description: "Implementing advanced features and solving complex problems",
      dueDate: "2024-10-15", 
      maxMarks: 5, 
      submitted: 38, 
      totalStudents: 60,
      status: "active"
    },
    { 
      id: 3, 
      title: "Assignment 3: Practical Implementation", 
      description: "Hands-on project with real-world scenarios",
      dueDate: "2024-11-01", 
      maxMarks: 5, 
      submitted: 52, 
      totalStudents: 60,
      status: "active"
    },
    { 
      id: 4, 
      title: "Assignment 4: Final Project Submission", 
      description: "Comprehensive project demonstrating all learned concepts",
      dueDate: "2024-11-20", 
      maxMarks: 5, 
      submitted: 25, 
      totalStudents: 60,
      status: "upcoming"
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading course...</h1>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Course Not Found</h1>
        <p>Course ID: {courseId}</p>
        <p className="mt-2 text-sm text-gray-600">
          Check if the course exists in the database and API is working.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Course Info */}
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
            <Badge variant="secondary" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {course.credits} Credits
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {course.specialization}
            </Badge>
            <Badge variant="outline">
              Year {course.year} • Semester {course.semester}
            </Badge>
          </div>
        </div>
        
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Subjects</p>
                <p className="text-2xl font-bold text-blue-900">0</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Assignments</p>
                <p className="text-2xl font-bold text-green-900">{assignments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Credits</p>
                <p className="text-2xl font-bold text-purple-900">{course.credits}</p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Duration</p>
                <p className="text-2xl font-bold text-orange-900">15 Weeks</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Curriculum
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {course.description || "No description provided for this course. This course covers fundamental concepts and advanced topics in the field."}
                </p>
                
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-900">Learning Objectives</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Understand core concepts and principles
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Apply knowledge to solve practical problems
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Develop critical thinking and analytical skills
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Course Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Course Start</span>
                    <Badge>September 1, 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mid Semester Exam</span>
                    <Badge variant="outline">October 15, 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">End Semester Exam</span>
                    <Badge variant="outline">December 10, 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Course End</span>
                    <Badge>December 20, 2024</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Course Materials
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText className="h-4 w-4" />
                      Download Syllabus
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Users className="h-4 w-4" />
                      View Student Roster
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CURRICULUM TAB */}
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Structure & Marking Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessment Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Assessment Breakdown</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Mid Semester</h4>
                          <p className="text-2xl font-bold text-blue-600">30%</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• Max Marks: 30</p>
                        <p>• Duration: 2 Hours</p>
                        <p>• Syllabus: Units 1-3</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded">
                          <BarChart3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">End Semester</h4>
                          <p className="text-2xl font-bold text-green-600">50%</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• Max Marks: 50</p>
                        <p>• Duration: 3 Hours</p>
                        <p>• Syllabus: All Units</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Assignments</h4>
                          <p className="text-2xl font-bold text-purple-600">20%</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• 4 Assignments</p>
                        <p>• 5 Marks Each</p>
                        <p>• Weekly Submissions</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Grading System */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Grading System</h3>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  {[
                    { grade: 'O', range: '90-100%', color: 'bg-green-500 text-white' },
                    { grade: 'A+', range: '85-89%', color: 'bg-green-400 text-white' },
                    { grade: 'A', range: '80-84%', color: 'bg-green-300' },
                    { grade: 'B+', range: '75-79%', color: 'bg-yellow-400' },
                    { grade: 'B', range: '70-74%', color: 'bg-yellow-300' },
                    { grade: 'C+', range: '65-69%', color: 'bg-orange-400 text-white' },
                    { grade: 'C', range: '60-64%', color: 'bg-orange-300' },
                    { grade: 'D', range: '55-59%', color: 'bg-red-300' },
                    { grade: 'E', range: '50-54%', color: 'bg-red-400 text-white' },
                    { grade: 'F', range: 'Below 50%', color: 'bg-red-500 text-white' }
                  ].map((item, index) => (
                    <div key={index} className={`text-center p-3 rounded-lg ${item.color}`}>
                      <div className="font-bold text-lg">{item.grade}</div>
                      <div className="text-xs opacity-90">{item.range}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYLLABUS TAB */}
        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Syllabus & Subjects</CardTitle>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Full Syllabus
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Subjects Added Yet</h3>
                <p className="text-gray-500 mt-2">Subjects will appear here once they are added to this course</p>
                <Button className="mt-4 gap-2">
                  <FileText className="h-4 w-4" />
                  Add First Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSIGNMENTS TAB */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Assignments</CardTitle>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Assignment Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
                        <div className="text-sm text-gray-600">Total Assignments</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {assignments.reduce((total, assignment) => total + assignment.submitted, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Submissions</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round((assignments.reduce((total, assignment) => total + assignment.submitted, 0) / 
                          (assignments.reduce((total, assignment) => total + assignment.totalStudents, 0))) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Average Submission Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                  {assignments.map((assignment) => {
                    const submissionRate = (assignment.submitted / assignment.totalStudents) * 100
                    const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    
                    return (
                      <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                                <Badge variant={
                                  assignment.status === 'active' ? 'default' : 
                                  assignment.status === 'upcoming' ? 'secondary' : 'outline'
                                }>
                                  {assignment.status === 'active' ? 'Active' : 'Upcoming'}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{assignment.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-500">Due Date:</span>
                                  <p className="text-gray-900">
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                    {daysUntilDue > 0 && (
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
                                <div>
                                  <span className="font-medium text-gray-500">Submissions:</span>
                                  <p className="text-gray-900">{assignment.submitted}/{assignment.totalStudents}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Submission Rate:</span>
                                  <p className={`font-medium ${
                                    submissionRate >= 80 ? 'text-green-600' :
                                    submissionRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {submissionRate.toFixed(1)}%
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <Progress value={submissionRate} className="h-2" />
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button size="sm" className="gap-1">
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Upload className="h-3 w-3" />
                                Submit
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <FileText className="h-3 w-3" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* No Assignments State */}
                {assignments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Assignments Created</h3>
                    <p className="text-gray-500 mt-2">Create your first assignment to get started</p>
                    <Button className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Create First Assignment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}