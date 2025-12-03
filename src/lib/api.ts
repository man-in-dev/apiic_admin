const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/apiic_api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  applications: T[];
  pagination: PaginationInfo;
}

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'reviewer' | 'applicant';
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Pre-incubation methods
  async createPreIncubationApplication(applicationData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/pre-incubation', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getPreIncubationApplications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    applicationStatus?: string;
    currentStage?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/pre-incubation?${queryString}` : '/pre-incubation';
    
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async getPreIncubationApplication(id: string): Promise<ApiResponse<{ application: any }>> {
    return this.request<{ application: any }>(`/pre-incubation/${id}`);
  }

  async updatePreIncubationApplication(id: string, applicationData: any): Promise<ApiResponse<{ application: any }>> {
    return this.request<{ application: any }>(`/pre-incubation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }

  async deletePreIncubationApplication(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/pre-incubation/${id}`, {
      method: 'DELETE',
    });
  }

  async getPreIncubationStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/pre-incubation/stats/overview');
  }

  // Incubation methods
  async createIncubationApplication(applicationData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/incubation', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getIncubationApplications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    applicationStatus?: string;
    currentStage?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/incubation?${queryString}` : '/incubation';
    
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async getIncubationApplication(id: string): Promise<ApiResponse<{ application: any }>> {
    return this.request<{ application: any }>(`/incubation/${id}`);
  }

  async updateIncubationApplication(id: string, applicationData: any): Promise<ApiResponse<{ application: any }>> {
    return this.request<{ application: any }>(`/incubation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }

  async deleteIncubationApplication(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/incubation/${id}`, {
      method: 'DELETE',
    });
  }

  async getIncubationStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/incubation/stats/overview');
  }

  // Contact methods
  async getContactSubmissions(params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any>(`/contact${queryString}`);
  }

  async getContactSubmission(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/contact/${id}`);
  }

  async createContactSubmission(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactSubmission(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContactSubmission(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async getContactStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/contact/stats');
  }

  // Announcement methods
  async getAnnouncements(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/announcement?${queryString}` : '/announcement';
    
    return this.request<any>(endpoint);
  }

  async getAnnouncement(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/announcement/${id}`);
  }

  async createAnnouncement(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/announcement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/announcement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/announcement/${id}`, {
      method: 'DELETE',
    });
  }

  async getAnnouncementStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/announcement/stats/overview');
  }

  // Blog methods
  async getBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    const qs = query.toString();
    return this.request<any>(`/blog${qs ? `?${qs}` : ''}`);
  }

  async getBlog(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${id}`);
  }

  async createBlog(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/blog', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBlog(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBlog(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/blog/${id}`, { method: 'DELETE' });
  }

  // Program methods
  async getPrograms(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    const qs = query.toString();
    return this.request<any>(`/program${qs ? `?${qs}` : ''}`);
  }

  async getProgram(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/program/${id}`);
  }

  async createProgram(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/program', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProgram(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/program/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProgram(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/program/${id}`, { method: 'DELETE' });
  }

  // Event methods
  async getEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/event?${queryString}` : '/event';
    
    return this.request<any>(endpoint);
  }

  async getEvent(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/event/${id}`);
  }

  async createEvent(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/event', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/event/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/event/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/event/stats/overview');
  }

  async getUpcomingEvents(limit?: number): Promise<ApiResponse<any>> {
    const queryString = limit ? `?limit=${limit}` : '';
    return this.request<any>(`/event/public/upcoming${queryString}`);
  }

  // Admin management methods
  async addAdmin(data: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'super_admin';
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/add-admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdmins(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/admins?${queryString}` : '/admin/admins';
    
    return this.request<any>(endpoint);
  }

  async updateAdminStatus(id: string, isActive: boolean): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  // Mentor methods
  async getMentors(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/mentor?${queryString}` : '/mentor';
    
    return this.request<any>(endpoint);
  }

  async getMentor(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/mentor/${id}`);
  }

  async createMentor(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/mentor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMentor(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/mentor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMentor(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/mentor/${id}`, {
      method: 'DELETE',
    });
  }

  async updateMentorStatus(id: string, isActive: boolean): Promise<ApiResponse<any>> {
    return this.request<any>(`/mentor/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  async getPublicMentors(params?: {
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/mentor/public/list?${queryString}` : '/mentor/public/list';
    
    return this.request<any>(endpoint);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

