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

    // GET CSRF TOKEN
    const csrfToken = this.getCSRFToken()
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken }), // ADD CSRF TOKEN TO ALL REQUESTS
          ...fetchOptions.headers,
        },
        credentials: fetchOptions.credentials || "include",
      })

      if (response.status === 204 || response.status === 201) return {} as T

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = await response.text()
        }
        console.error('🔴 API Error Details:', { status: response.status, url, error: errorData })
        throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return response.json()
    } catch (error) {
      console.error('🔴 Network error:', error)
      throw error
    }
  }

  // CSRF TOKEN GETTER
  private getCSRFToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // 🔑 AUTH METHODS
  async login(identifier: string, password: string) {
    const isEmail = identifier.includes("@")
    const loginData = isEmail
      ? { email: identifier, password }
      : { username: identifier, password }

    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(loginData),
    })
  }

  async register(userData: any) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request("/auth/logout/", { method: "POST" })
  }

  async getCurrentUser() {
    return this.request("/auth/me/")
  }

  // ---------------- FACULTY METHODS ----------------
  async getFacultyCourses(facultyId: string) {
    return this.request(`/enrollments/faculty/${facultyId}/courses/`)
  }

  async getCourseStudents(courseId: string) {
    return this.request(`/enrollments/courses/${courseId}/students/`)
  }

  async getFacultyStudents(facultyId: string) {
    return this.request(`/enrollments/faculty/${facultyId}/students/`)
  }

  async getFacultyAttendance(facultyId: string, params?: Record<string, string>) {
    return this.request(`/attendance/faculty/${facultyId}/`, { params })
  }

  // ---------------- STUDENT METHODS ----------------
  async getStudents(params?: Record<string, string>) {
    return this.request("/students/", { params })
  }
  async getStudent(id: string) {
    return this.request(`/students/${id}/`)
  }

  // ---------------- COURSES ----------------
  async getCourses(params?: Record<string, string>) {
    return this.request("/courses/", { params })
  }
  async getCourse(id: string) {
    return this.request(`/courses/${id}/`)
  }

  // ---------------- ENROLLMENTS ----------------
  async getStudentEnrollments(studentId: string) {
    return this.request(`/enrollments/student/${studentId}/enrollments/`)
  }
  async getMyEnrollments() {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return this.getStudentEnrollments(user.id)
  }

  // ---------------- ATTENDANCE ----------------
  async getAttendance(params?: Record<string, string>) {
    return this.request("/attendance/", { params })
  }
  async markAttendance(data: any) {
    return this.request("/attendance/", { method: "POST", body: JSON.stringify(data) })
  }
  async updateAttendance(id: string, data: any) {
    return this.request(`/attendance/${id}/`, { method: "PUT", body: JSON.stringify(data) })
  }

  // ---------------- MARKS ----------------
  async getMarks(params?: Record<string, string>) {
    return this.request("/marks/", { params })
  }

  // ---------------- ANALYTICS ----------------
  async getAnalytics() {
    return this.request("/analytics/")
  }
}

export const api = new ApiService()