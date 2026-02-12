/**
 * HTTP Client — thin wrapper around fetch.
 * Uses tokenManager for auth headers (cookie-based).
 */

import * as tokenManager from '../auth/tokenManager';
import { API_CONFIG, HTTP_STATUS } from '../config/constants';
import { ROUTES } from '../navigation/routes';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
  timeout?: number;
  retry?: boolean;
  requiresAuth?: boolean;
}

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  private getAuthHeaders(): HeadersInit {
    const header = tokenManager.getAuthHeader();
    return header ? { Authorization: header } : {};
  }

  private buildHeaders(config: RequestConfig): HeadersInit {
    const baseHeaders: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const authHeaders = config.requiresAuth !== false ? this.getAuthHeaders() : {};
    return { ...baseHeaders, ...authHeaders, ...config.headers };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      tokenManager.clearAuth();
      window.location.href = ROUTES.LOGIN;
      throw { code: 'UNAUTHORIZED', message: '\u0646\u0634\u0633\u062a \u0634\u0645\u0627 \u0645\u0646\u0642\u0636\u06cc \u0634\u062f\u0647 \u0627\u0633\u062a', statusCode: response.status };
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw { response: { status: response.status, data } };
    }
    return data;
  }

  private async makeRequestWithTimeout<T>(url: string, config: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeout = config.timeout || this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers: this.buildHeaders(config),
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 'TIMEOUT', message: '\u0632\u0645\u0627\u0646 \u062f\u0631\u062e\u0648\u0627\u0633\u062a \u0628\u0647 \u067e\u0627\u06cc\u0627\u0646 \u0631\u0633\u06cc\u062f' };
      }
      throw error;
    }
  }

  private async makeRequestWithRetry<T>(url: string, config: RequestConfig, attempt = 1): Promise<T> {
    try {
      return await this.makeRequestWithTimeout<T>(url, config);
    } catch (error: unknown) {
      const shouldRetry =
        config.retry !== false &&
        attempt < API_CONFIG.RETRY_ATTEMPTS &&
        (error as { response?: { status?: number } })?.response?.status !== undefined &&
        ((error as { response?: { status?: number } }).response?.status ?? 0) >= 500;

      if (shouldRetry) {
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, delay));
        return this.makeRequestWithRetry<T>(url, config, attempt + 1);
      }
      throw error;
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.makeRequestWithRetry<T>(`${this.baseUrl}${endpoint}`, config);
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
