import { httpClient } from "@/modules/shared/api/httpClient";

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
 * User Management Service
 * Thin facade over httpClient for admin user CRUD operations.
 */
class UserManagementService {
  async getUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    const query = new URLSearchParams({
      page: (params.page || 1).toString(),
      per_page: (params.per_page || 15).toString(),
    });
    if (params.search) query.append("search", params.search);
    if (params.role) query.append("role", params.role);

    return httpClient.get<PaginatedResponse<User>>(`/api/admin/users?${query}`);
  }

  async getStats(): Promise<UserStats> {
    return httpClient.get<UserStats>("/api/admin/users/stats");
  }

  async getUser(id: number): Promise<User> {
    const data = await httpClient.get<{ user: User }>(`/api/admin/users/${id}`);
    return data.user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const data = await httpClient.post<{ user: User }>("/api/admin/users", dto);
    return data.user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const data = await httpClient.put<{ user: User }>(`/api/admin/users/${id}`, dto);
    return data.user;
  }

  async deleteUser(id: number): Promise<void> {
    await httpClient.delete(`/api/admin/users/${id}`);
  }

  async changeUserRole(id: number, roleId: number): Promise<User> {
    const data = await httpClient.post<{ user: User }>(
      `/api/admin/users/${id}/change-role`,
      { role_id: roleId }
    );
    return data.user;
  }

  async getRoles(): Promise<Role[]> {
    const data = await httpClient.get<{ roles: Role[] }>("/api/admin/roles");
    return data.roles;
  }
}

export const userManagementService = new UserManagementService();
