"use client"

import { TrendingUp, Users, BookOpen, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const attendanceData = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 88 },
  { month: "Mar", attendance: 82 },
  { month: "Apr", attendance: 90 },
  { month: "May", attendance: 87 },
  { month: "Jun", attendance: 89 },
]

const performanceData = [
  { subject: "Data Structures", average: 85 },
  { subject: "Algorithms", average: 78 },
  { subject: "Database", average: 92 },
  { subject: "Networks", average: 88 },
  { subject: "OS", average: 81 },
]

const departmentData = [
  { name: "Computer Science", value: 450, color: "#6366f1" },
  { name: "Electrical", value: 280, color: "#8b5cf6" },
  { name: "Mechanical", value: 320, color: "#ec4899" },
  { name: "Civil", value: 184, color: "#f59e0b" },
]

const gradeDistribution = [
  { grade: "A+", count: 120 },
  { grade: "A", count: 180 },
  { grade: "B+", count: 150 },
  { grade: "B", count: 100 },
  { grade: "C+", count: 80 },
  { grade: "C", count: 50 },
  { grade: "F", count: 20 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Insights and trends across the institution</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
              <p className="mt-2 text-2xl font-bold text-foreground">87.5%</p>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.3% from last month
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="mt-2 text-2xl font-bold text-foreground">1,234</p>
              <p className="mt-1 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12% this year
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
              <p className="mt-2 text-2xl font-bold text-foreground">48</p>
              <p className="mt-1 flex items-center text-xs text-primary">
                <BookOpen className="mr-1 h-3 w-3" />
                Across 4 departments
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <BookOpen className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
              <p className="mt-2 text-2xl font-bold text-foreground">82.4%</p>
              <p className="mt-1 flex items-center text-xs text-success">
                <Award className="mr-1 h-3 w-3" />
                +5.1% improvement
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Attendance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Performance by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="average" fill="#8b5cf6" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Students by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#ec4899" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Performing Courses</h3>
          <div className="space-y-3">
            {performanceData
              .sort((a, b) => b.average - a.average)
              .slice(0, 3)
              .map((course, index) => (
                <div key={course.subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-foreground">{course.subject}</span>
                  </div>
                  <span className="text-sm font-bold text-success">{course.average}%</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Department Stats</h3>
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{dept.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Insights</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-success/10 p-3">
              <p className="text-xs font-medium text-success">Highest Attendance</p>
              <p className="mt-1 text-sm font-bold text-foreground">April - 90%</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-xs font-medium text-primary">Best Performance</p>
              <p className="mt-1 text-sm font-bold text-foreground">Database - 92%</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-3">
              <p className="text-xs font-medium text-warning">Total Grades</p>
              <p className="mt-1 text-sm font-bold text-foreground">700 Records</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
