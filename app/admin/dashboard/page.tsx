// Updated app/admin/dashboard/page.tsx - WITH REAL DATA
"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, GraduationCap, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/services/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
    systemStatus: "Loading..."
  })

  useEffect(() => {
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    try {
      const [students, courses] = await Promise.all([
        api.getStudents(),
        api.getCourses()
      ])
      
      setStats({
        totalStudents: students.length,
        totalCourses: courses.length,
        totalFaculty: 2, // You have 2 faculty from earlier
        systemStatus: "All Systems Operational"
      })
    } catch (error) {
      setStats({
        totalStudents: 0,
        totalCourses: 0, 
        totalFaculty: 0,
        systemStatus: "API Connection Error"
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Live system overview with real data</p>
      </div>

      {/* REAL DATA STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-green-600">Live from API</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold">{stats.totalCourses}</p>
                <p className="text-sm text-green-600">Live from API</p>
              </div>
              <BookOpen className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-2xl font-bold">{stats.systemStatus}</p>
                <p className="text-sm text-blue-600">API Connected</p>
              </div>
              <BarChart3 className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links to REAL Modules */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Student Management</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="font-medium">Course Management</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="font-medium">Faculty Management</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="font-medium">System Analytics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}