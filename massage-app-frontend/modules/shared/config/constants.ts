/**
 * Application Constants
 * Only contains values that are actually imported.
 * Routes → lib/navigation/routes.ts
 * Roles/Permissions → lib/types/auth.ts (RoleName, PermissionName enums)
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  TOKEN_TYPE_KEY: 'token_type',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  TOKEN_CHECK_INTERVAL: 60 * 1000,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 15,
  MAX_PER_PAGE: 100,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100],
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  PHONE_REGEX: /^(\+98|0)?9\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;
