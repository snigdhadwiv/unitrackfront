// app/student-marks/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Award, TrendingUp, BookOpen, FileText, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

interface Course {
  id: number
  course_code: string
  course_name: string
  credits: number
  specialization: string
  year: number
  semester: number
  description?: string
}

interface SubjectMarks {
  course: Course
  assignments: {
    id: number
    title: string
    max_marks: number
    obtained_marks: number
    weightage: number
    submitted_date: string
  }[]
  mid_term: {
    max_marks: number
    obtained_marks: number
  }
  end_term: {
    max_marks: number
    obtained_marks: number
  }
  total_marks: number
  percentage: number
  grade: string
  grade_point: number
}

interface SemesterResult {
  semester: number
  subjects: SubjectMarks[]
  total_credits: number
  earned_credits: number
  sgpa: number
  cgpa: number
}

export default function StudentMarksPage() {
  const [semesterResults, setSemesterResults] = useState<SemesterResult[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch real courses from your API
      const coursesData = await api.getCourses()
      setCourses(coursesData)

      // Generate marks data based on real courses
      const marksData = generateMarksFromCourses(coursesData)
      setSemesterResults(marksData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMarksFromCourses = (coursesData: Course[]): SemesterResult[] => {
    // Group courses by semester
    const semesters = [...new Set(coursesData.map(course => course.semester))].sort()
    
    return semesters.map(semester => {
      const semesterCourses = coursesData.filter(course => course.semester === semester)
      
      const subjects: SubjectMarks[] = semesterCourses.map(course => {
        // Generate realistic marks based on course
        const assignments = [
          { id: 1, title: "Assignment 1", max_marks: 10, obtained_marks: getRandomMark(7, 10), weightage: 10, submitted_date: "2024-09-15" },
          { id: 2, title: "Assignment 2", max_marks: 10, obtained_marks: getRandomMark(6, 10), weightage: 10, submitted_date: "2024-10-01" },
          { id: 3, title: "Assignment 3", max_marks: 10, obtained_marks: getRandomMark(5, 10), weightage: 10, submitted_date: "2024-10-20" }
        ]

        const mid_term = { max_marks: 30, obtained_marks: getRandomMark(20, 30) }
        const end_term = { max_marks: 50, obtained_marks: getRandomMark(35, 50) }
        
        const assignmentTotal = assignments.reduce((sum, a) => sum + a.obtained_marks, 0)
        const total_marks = assignmentTotal + mid_term.obtained_marks + end_term.obtained_marks
        const percentage = Math.round((total_marks / 100) * 100)
        const grade = calculateGrade(percentage)
        const grade_point = calculateGradePoint(grade)

        return {
          course,
          assignments,
          mid_term,
          end_term,
          total_marks,
          percentage,
          grade,
          grade_point
        }
      })

      const total_credits = semesterCourses.reduce((sum, course) => sum + course.credits, 0)
      const earned_credits = subjects.reduce((sum, subject) => 
        subject.grade !== 'F' ? sum + subject.course.credits : sum, 0
      )
      const sgpa = subjects.reduce((sum, subject) => sum + subject.grade_point, 0) / subjects.length
      const cgpa = sgpa // Simplified for demo

      return {
        semester,
        subjects,
        total_credits,
        earned_credits,
        sgpa: Math.round(sgpa * 10) / 10,
        cgpa: Math.round(cgpa * 10) / 10
      }
    })
  }

  const getRandomMark = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    if (percentage >= 40) return 'D'
    return 'F'
  }

  const calculateGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0
    }
    return gradePoints[grade] || 0
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-50 border-green-200'
      case 'A': return 'text-green-600 bg-green-50 border-green-200'
      case 'B+': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'F': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Loading your marks...</h1>
      </div>
    )
  }

  const currentSemester = semesterResults.find(sem => sem.semester === selectedSemester)
  const allSemesters = semesterResults.map(sem => sem.semester)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marks & Report Cards</h1>
          <p className="mt-1 text-muted-foreground">View your academic performance and grades</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download Report Card
        </Button>
      </div>

      {/* Semester Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-2">
              {allSemesters.map(sem => (
                <Button
                  key={sem}
                  variant={selectedSemester === sem ? "default" : "outline"}
                  onClick={() => setSelectedSemester(sem)}
                >
                  Semester {sem}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {currentSemester && (
        <>
          {/* Overall Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">SGPA</p>
                    <p className="text-2xl font-bold text-green-900">{currentSemester.sgpa}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">CGPA</p>
                    <p className="text-2xl font-bold text-blue-900">{currentSemester.cgpa}</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Credits Earned</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {currentSemester.earned_credits}/{currentSemester.total_credits}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Subjects</p>
                    <p className="text-2xl font-bold text-orange-900">{currentSemester.subjects.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subjects Performance */}
          <div className="space-y-6">
            {currentSemester.subjects.map((subject) => (
              <Card key={subject.course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle>{subject.course.course_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {subject.course.course_code} • {subject.course.credits} Credits • {subject.course.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPercentageColor(subject.percentage)}`}>
                        {subject.percentage}%
                      </div>
                      <Badge className={`mt-1 ${getGradeColor(subject.grade)}`}>
                        {subject.grade} • {subject.grade_point}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Marks Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Assignments */}
                    <div>
                      <h4 className="font-medium mb-3">Assignments</h4>
                      <div className="space-y-2">
                        {subject.assignments.map(assignment => (
                          <div key={assignment.id} className="flex justify-between items-center text-sm">
                            <span className="truncate max-w-[120px]">{assignment.title}</span>
                            <span className={`font-medium ${
                              (assignment.obtained_marks / assignment.max_marks) >= 0.7 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {assignment.obtained_marks}/{assignment.max_marks}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mid Term */}
                    <div>
                      <h4 className="font-medium mb-3">Mid Term</h4>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {subject.mid_term.obtained_marks}/{subject.mid_term.max_marks}
                        </div>
                        <div className="text-sm text-blue-800">
                          {Math.round((subject.mid_term.obtained_marks / subject.mid_term.max_marks) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* End Term */}
                    <div>
                      <h4 className="font-medium mb-3">End Term</h4>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {subject.end_term.obtained_marks}/{subject.end_term.max_marks}
                        </div>
                        <div className="text-sm text-green-800">
                          {Math.round((subject.end_term.obtained_marks / subject.end_term.max_marks) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Performance</span>
                      <span>{subject.percentage}% • {subject.total_marks} marks</span>
                    </div>
                    <Progress value={subject.percentage} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {!currentSemester && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No marks available</h3>
            <p className="text-muted-foreground mt-2">
              Your marks will appear here once they are published by your instructors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}