"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/services/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await api.login(email, password)
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("isAuthenticated", "true")
      
      // Redirect based on role
      if (response.user.role === 'STUDENT') {
        router.push("/student-dashboard")  // ← UPDATED THIS LINE
      } else if (response.user.role === 'FACULTY') {
        router.push('/faculty/dashboard')
      } else {
        router.push("/dashboard") // Admin
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Unitrack</h1>
              <p className="text-sm text-muted-foreground">College ERP System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Use your registered email and password
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:bg-muted">
        <div className="max-w-md space-y-6 p-8">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Manage Everything</h3>
                <p className="text-sm text-muted-foreground">All in one place</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Student & Faculty Management
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Attendance Tracking
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Marks & Grade Management
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Analytics & Reports
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}