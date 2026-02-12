import { getApiBaseUrl } from "@/lib/api";

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

export interface User {
  id: number;
  f_name?: string;
  l_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  phone_verified_at?: string;
  email_verified_at?: string;
  last_login_at?: string;
  created_at?: string;
  role?: Role;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UserStats {
  total_users: number;
  by_role: Array<{ role: string; display_name: string; count: number }>;
  verified_email: number;
  verified_phone: number;
  recent_logins: number;
}

export interface CreateUserDto {
  f_name: string;
  l_name: string;
  username?: string;
  email?: string;
  phone: string;
  password: string;
  role_id: number;
  bio?: string;
}

export interface UpdateUserDto {
  f_name?: string;
  l_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  role_id?: number;
}

/**
 * User Management Service - following Repository Pattern
 * Handles all API calls related to user management
 */
class UserManagementService {
  private baseUrl: string;
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  /**
   * Fetch paginated users with optional filters
   */
  async getUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      per_page: (params.per_page || 15).toString(),
    });

    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);

    const response = await fetch(`${this.baseUrl}/api/admin/users?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStats> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return response.json();
  }

  /**
   * Get single user details
   */
  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/admin/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    const result = await response.json();
    return result.user;
  }

  /**
   * Update existing user
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user");
    }

    const result = await response.json();
    return result.user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }
  }

  /**
   * Change user role
   */
  async changeUserRole(id: number, roleId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}/change-role`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role_id: roleId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change role");
    }

    const result = await response.json();
    return result.user;
  }

  /**
   * Get available roles
   */
  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${this.baseUrl}/api/admin/roles`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }

    const data = await response.json();
    return data.roles;
  }
}

// Export singleton instance
export const userManagementService = new UserManagementService();
