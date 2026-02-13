/**
 * Token Manager
 *
 * Single source of truth for auth token storage.
 * Uses cookies so both client JS **and** Next.js middleware can access the token.
 *
 * Token  → cookie  (accessible by middleware + JS)
 * User   → cookie  (JSON-stringified, accessible by middleware for role checks)
 */

import type { User } from '@/modules/auth/types/auth';

// ────────────────────────────────────────────
// Cookie helpers
// ────────────────────────────────────────────

const COOKIE_TOKEN    = 'auth_token';
const COOKIE_TYPE     = 'token_type';
const COOKIE_USER     = 'auth_user';
const MAX_AGE_SECONDS = 24 * 60 * 60; // 24 h

function setCookie(name: string, value: string, maxAge = MAX_AGE_SECONDS): void {
  // SameSite=Lax is fine for same-origin navigation.
  // Path=/ ensures every route can read it.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────

/** Save the raw JWT string after login */
export function setToken(token: string, tokenType = 'Bearer'): void {
  setCookie(COOKIE_TOKEN, token);
  setCookie(COOKIE_TYPE, tokenType);
}

/** Read the raw JWT string – returns `null` when absent */
export function getToken(): string | null {
  return getCookie(COOKIE_TOKEN);
}

/** Read the token type (usually "Bearer") */
export function getTokenType(): string {
  return getCookie(COOKIE_TYPE) ?? 'Bearer';
}

/** Build the `Authorization` header value */
export function getAuthHeader(): string | null {
  const token = getToken();
  if (!token) return null;
  return `${getTokenType()} ${token}`;
}

/** Persist the user object (JSON in a cookie so middleware can read role) */
export function setUser(user: User): void {
  // Only store the fields middleware / client might need.
  // Keeps the cookie small.
  const slim = {
    id: user.id,
    f_name: user.f_name,
    l_name: user.l_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    avatar_url: user.avatar_url,
    role: user.role,
    permissions: user.permissions,
  };
  setCookie(COOKIE_USER, JSON.stringify(slim));
}

/** Read the cached user object */
export function getUser(): User | null {
  const raw = getCookie(COOKIE_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/** Wipe every auth artefact – cookies + any legacy localStorage leftovers */
export function clearAuth(): void {
  deleteCookie(COOKIE_TOKEN);
  deleteCookie(COOKIE_TYPE);
  deleteCookie(COOKIE_USER);

  // Clean up legacy localStorage values so they never interfere again
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('auth_user');
  }
}

/** Check whether a token exists at all (cheap, no parsing) */
export function isLoggedIn(): boolean {
  return !!getToken();
}
