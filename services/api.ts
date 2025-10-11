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

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
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
