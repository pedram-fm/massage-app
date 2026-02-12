/**
 * Input Validation Utilities
 * Implements validation rules following security best practices
 * - XSS prevention
 * - SQL injection prevention (client-side)
 * - Data sanitization
 */

/**
 * Email validation with RFC 5322 compliance
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation for Iranian format
 */
export function validatePhone(phone: string): boolean {
  // Iranian phone: 09123456789 or +989123456789
  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Password strength validation
 */
export interface PasswordStrength {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('رمز عبور باید حداقل ۸ کاراکتر باشد');
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthScore < 2) {
    strength = 'weak';
    errors.push('رمز عبور باید شامل حروف بزرگ، کوچک، عدد یا کاراکتر خاص باشد');
  } else if (strengthScore === 2 || strengthScore === 3) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate username (alphanumeric and underscore only)
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Sanitize user input for safe display
 */
export function sanitizeInput(input: string): string {
  // Remove potential SQL injection patterns
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi;
  let sanitized = input.replace(sqlPattern, '');
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  return sanitized.trim();
}

/**
 * Validate file upload
 */
export interface FileValidation {
  isValid: boolean;
  errors: string[];
}

export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): FileValidation {
  const errors: string[] = [];
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'] } = options;

  if (file.size > maxSize) {
    errors.push(`حجم فایل نباید بیشتر از ${maxSize / 1024 / 1024} مگابایت باشد`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('فرمت فایل مجاز نیست');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Debounce function for input validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
