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
        credentials: fetchOptions.credentials || "include",
      })

      if (response.status === 204 || response.status === 201) {
        return {} as T
      }

      if (!response.ok) {
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

  // 🔑 UPDATED AUTH METHODS - NOW ACCEPTS IDENTIFIER
  async login(identifier: string, password: string) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }), // Changed from 'email' to 'identifier'
    })
  }

  async register(userData: any) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request("/auth/logout/", {
      method: "POST",
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me/")
  }

  // NEW: Get user by identifier (email or username)
  async getUserByIdentifier(identifier: string) {
    return this.request(`/auth/user/${identifier}/`)
  }

  // Enrollment methods
  async getStudentEnrollments(studentId: string) {
    return this.request(`/enrollments/student/${studentId}/enrollments/`)
  }

  async getMyEnrollments() {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return this.getStudentEnrollments(user.id)
  }

  async createEnrollment(data: any) {
    return this.request("/enrollments/enrollments/", {
      method: "POST",
      body: JSON.stringify(data),
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

  async getCourse(id: string) {
    return this.request(`/courses/${id}/`)
  }

  async createCourse(data: any) {
    return this.request("/courses/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCourse(id: string, data: any) {
    return this.request(`/courses/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}/`, {
      method: "DELETE",
    })
  }

  // NEW: Faculty Courses (courses assigned to faculty)
  async getFacultyCourses(facultyId: string) {
    return this.request(`/faculty/${facultyId}/courses/`)
  }

  // NEW: Course Students (students enrolled in a course)
  async getCourseStudents(courseId: string) {
    return this.request(`/courses/${courseId}/students/`)
  }

  // Subjects
  async getSubjects(params?: Record<string, string>) {
    return this.request("/subjects/", { params })
  }

  async getSubject(id: string) {
    return this.request(`/subjects/${id}/`)
  }

  async createSubject(data: any) {
    return this.request("/subjects/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSubject(id: string, data: any) {
    return this.request(`/subjects/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Syllabus
  async getSyllabus(params?: Record<string, string>) {
    return this.request("/syllabus/", { params })
  }

  async getSyllabusItem(id: string) {
    return this.request(`/syllabus/${id}/`)
  }

  async createSyllabus(data: any) {
    return this.request("/syllabus/", {
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

  async updateAttendance(id: string, data: any) {
    return this.request(`/attendance/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Marks
  async getMarks(params?: Record<string, string>) {
    return this.request("/marks/", { params })
  }

  async getStudentMarks(studentId: string) {
    return this.request(`/marks/?student=${studentId}`)
  }

  async getSubjectMarks(subjectId: string) {
    return this.request(`/marks/?subject=${subjectId}`)
  }

  async createMarks(data: any) {
    return this.request("/marks/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateMarks(id: string, data: any) {
    return this.request(`/marks/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteMarks(id: string) {
    return this.request(`/marks/${id}/`, {
      method: "DELETE",
    })
  }

  // Analytics
  async getAnalytics() {
    return this.request("/analytics/")
  }
}

export const api = new ApiService()