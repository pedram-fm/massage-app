import { RoleName } from '@/modules/auth/types/auth';

/**
 * Centralized route definitions.
 * Every navigation target in the app must reference these constants
 * so route changes only happen in one place.
 */
export const ROUTES = {
  // ── Public ──
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // ── Admin ──
  ADMIN_USERS: '/admin/users',
  ADMIN_TODOS: '/admin/todos',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_APPOINTMENTS: '/admin/appointments',

  // ── Client / Dashboard ──
  DASHBOARD: '/dashboard',
  DASHBOARD_APPOINTMENTS: '/dashboard/appointments',
  DASHBOARD_NOTES: '/dashboard/notes',
  DASHBOARD_PROFILE: '/dashboard/profile',

  // ── Therapist ──
  THERAPIST_DASHBOARD: '/therapist/dashboard',

  // ── Shared ──
  TODOS: '/todos',
} as const;

/**
 * Given a user's role name, return the home route for that role.
 *
 * Usage:
 *   router.push(getDashboardRoute(user.role?.name));
 */
export function getDashboardRoute(roleName?: string): string {
  switch (roleName) {
    case RoleName.ADMIN:
      return ROUTES.ADMIN_USERS;
    case RoleName.MASSEUR:
    case RoleName.MASSEUSE:
      return ROUTES.THERAPIST_DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
}
