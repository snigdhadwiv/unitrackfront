const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    // Handle empty responses first (DELETE, POST success)
    if (response.status === 204 || response.status === 201) {
      return {} as T
    }

    if (!response.ok) {
      // Try to get JSON error, fallback to text
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = await response.text()
      }
      
      console.error('🔴 API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        error: errorData
      })
      
      throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`)
    }

    return response.json()
  } catch (error) {
    console.error('🔴 Network error:', error)
    throw error
  }
}

  // Auth
  async login(email: string, password: string) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Students
  async getStudents(params?: Record<string, string>) {
    return this.request("/students/", { params })
  }

  async getStudent(id: string) {
    return this.request(`/students/${id}/`)
  }

  async createStudent(data: any) {
    return this.request("/students/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/students/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}/`, {
      method: "DELETE",
    })
  }

  // Courses
  async getCourses(params?: Record<string, string>) {
    return this.request("/courses/", { params })
  }

  async createCourse(data: any) {
    return this.request("/courses/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Faculty
  async getFaculty(params?: Record<string, string>) {
    return this.request("/faculty/", { params })
  }

  async createFaculty(data: any) {
    return this.request("/faculty/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Attendance
  async getAttendance(params?: Record<string, string>) {
    return this.request("/attendance/", { params })
  }

  async markAttendance(data: any) {
    return this.request("/attendance/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Marks
  async getMarks(params?: Record<string, string>) {
    return this.request("/marks/", { params })
  }

  async createMarks(data: any) {
    return this.request("/marks/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Analytics
  async getAnalytics() {
    return this.request("/analytics/")
  }
}

export const api = new ApiService()
