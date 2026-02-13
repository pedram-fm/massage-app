/**
 * API Client for Backend Communication
 */

import * as tokenManager from '@/modules/auth/utils/tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Makes an authenticated API request
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const authHeader = tokenManager.getAuthHeader();
  
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Don't set Content-Type for FormData - browser sets it with boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  // Merge with custom headers (skip Content-Type for FormData)
  if (options.headers) {
    const customHeaders = { ...options.headers } as Record<string, string>;
    if (isFormData) {
      delete customHeaders['Content-Type'];
    }
    Object.assign(headers, customHeaders);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    
    throw new ApiClientError(
      error.message || `HTTP ${response.status}`,
      response.status,
      error.errors
    );
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
