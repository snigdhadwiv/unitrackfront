"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, User, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/services/api"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("") // Can be email OR username
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Send both identifier and password to backend
      const response = await api.login(identifier, password)
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("isAuthenticated", "true")
      
      // Redirect based on role
      if (response.user.role === 'STUDENT') {
        router.push("/student-dashboard")
      } else if (response.user.role === 'FACULTY') {
        router.push('/faculty/dashboard')
      } else {
        router.push("/admin/dashboard") // Admin
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* JLU Logo positioned in the top left */}
          <div className="mb-8">
            <Image 
              src="/jlulogo.png" 
              alt="JLU Logo" 
              width={120} 
              height={120}
              className="h-24 w-24 object-contain"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome to Unitrack</h2>
            <p className="mt-2 text-muted-foreground">Sign in with email or username</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="student@college.edu or jlu21001"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
            <p><strong>Students:</strong> Use student ID (jlu21001) or email</p>
            <p><strong>Faculty:</strong> Use email or username</p>
            <p><strong>Password:</strong> student123 / faculty123</p>
          </div>
        </div>
      </div>

      {/* Right side - Background Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center relative bg-muted">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/jlu1.jpg" // Replace with your actual image path
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 max-w-md space-y-6 p-8">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <Image 
                  src="/jlulogo.png" 
                  alt="JLU Logo" 
                  width={40} 
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">MINI ERP</h3>
                <p className="text-sm text-muted-foreground">Track your JLU</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Track attendance, courses, assignments & grades
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                 Faculty presence, student tracking & timetables
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Student-driven approach for entire university
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Multiple user roles and secure authentication
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}