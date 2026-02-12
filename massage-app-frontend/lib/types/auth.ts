/**
 * Role types for the massage app
 */
export enum RoleName {
  ADMIN = 'admin',
  MASSEUR = 'masseur',
  MASSEUSE = 'masseuse',
  CLIENT = 'client',
}

/**
 * Permission names
 */
export enum PermissionName {
  // Admin
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_ALL_SESSIONS = 'view_all_sessions',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_REPORTS = 'view_reports',
  
  // Massage Therapist
  SET_AVAILABILITY = 'set_availability',
  VIEW_OWN_SESSIONS = 'view_own_sessions',
  MANAGE_SESSION_PLANS = 'manage_session_plans',
  UPDATE_SESSION_STATUS = 'update_session_status',
  VIEW_CLIENT_INFO = 'view_client_info',
  
  // Client
  BOOK_SESSION = 'book_session',
  VIEW_MY_SESSIONS = 'view_my_sessions',
  CANCEL_SESSION = 'cancel_session',
  VIEW_THERAPISTS = 'view_therapists',
  MANAGE_OWN_PROFILE = 'manage_own_profile',
}

/**
 * Role interface
 */
export interface Role {
  id: number;
  name: RoleName;
  display_name: string;
  description?: string;
}

/**
 * Permission interface
 */
export interface Permission {
  name: PermissionName;
  display_name: string;
  group?: string;
}

/**
 * User interface with role and permissions
 */
export interface User {
  id: number;
  f_name?: string;
  l_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role?: Role;
  permissions?: string[];
}

/**
 * Auth context type
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: RoleName | RoleName[]) => boolean;
  hasPermission: (permission: PermissionName | PermissionName[]) => boolean;
  isAdmin: () => boolean;
  isMassageTherapist: () => boolean;
  isClient: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;  updateUser: (userData: Partial<User>) => void;}
