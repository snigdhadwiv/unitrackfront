"use client"

import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, Award } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  const recentActivities = [
    {
      id: 1,
      type: "attendance",
      message: "Attendance marked for CS301 - Data Structures",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "marks",
      message: "Marks updated for 25 students in Algorithms",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "student",
      message: "New student enrolled: Emma Davis (CS2022001)",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "course",
      message: "Course CS401 - Machine Learning added",
      time: "2 days ago",
    },
  ]

  const upcomingClasses = [
    {
      id: 1,
      course: "Data Structures",
      code: "CS301",
      time: "10:00 AM - 11:30 AM",
      room: "Room 301",
    },
    {
      id: 2,
      course: "Algorithms",
      code: "CS302",
      time: "2:00 PM - 3:30 PM",
      room: "Room 205",
    },
    {
      id: 3,
      course: "Machine Learning",
      code: "CS401",
      time: "4:00 PM - 5:30 PM",
      room: "Lab 101",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,234"
          icon={Users}
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <StatCard
          title="Active Courses"
          value="48"
          icon={BookOpen}
          trend={{ value: "3 new this semester", isPositive: true }}
        />
        <StatCard title="Faculty Members" value="87" icon={GraduationCap} description="Across all departments" />
        <StatCard
          title="Avg Attendance"
          value="87.5%"
          icon={TrendingUp}
          trend={{ value: "2.3% from last week", isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {activity.type === "attendance" && <Calendar className="h-5 w-5 text-primary" />}
                  {activity.type === "marks" && <Award className="h-5 w-5 text-primary" />}
                  {activity.type === "student" && <Users className="h-5 w-5 text-primary" />}
                  {activity.type === "course" && <BookOpen className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Classes */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Today's Schedule</h2>
            <button className="text-sm font-medium text-primary hover:underline">View calendar</button>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{classItem.course}</h3>
                    <p className="text-sm text-muted-foreground">{classItem.code}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {classItem.room}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {classItem.time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Present Today</p>
              <p className="mt-2 text-2xl font-bold text-foreground">1,089</p>
              <p className="mt-1 text-xs text-muted-foreground">88.2% attendance rate</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Marks</p>
              <p className="mt-2 text-2xl font-bold text-foreground">23</p>
              <p className="mt-1 text-xs text-muted-foreground">Across 5 courses</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Award className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
              <p className="mt-2 text-2xl font-bold text-foreground">82.4%</p>
              <p className="mt-1 text-xs text-muted-foreground">Overall grade average</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
