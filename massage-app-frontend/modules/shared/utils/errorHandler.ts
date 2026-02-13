/**
 * Centralized Error Handling
 * Implements consistent error handling across the application
 */

import { ROUTES } from '@/modules/shared/navigation/routes';

import { toast } from '@/lib/toast';

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
}

class ErrorHandler {
  /**
   * Handle API errors
   */
  handleApiError(error: any): AppError {
    // Network error
    if (!error.response) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: 'خطا در برقراری ارتباط با سرور',
        details: error,
      };
    }

    const statusCode = error.response?.status;
    const data = error.response?.data;

    // Map status codes to error codes
    switch (statusCode) {
      case 401:
        return {
          code: ErrorCode.UNAUTHORIZED,
          message: data?.message || 'لطفا وارد حساب کاربری خود شوید',
          statusCode,
          details: data,
        };
      
      case 403:
        return {
          code: ErrorCode.FORBIDDEN,
          message: data?.message || 'شما دسترسی به این بخش را ندارید',
          statusCode,
          details: data,
        };
      
      case 404:
        return {
          code: ErrorCode.NOT_FOUND,
          message: data?.message || 'اطلاعات مورد نظر یافت نشد',
          statusCode,
          details: data,
        };
      
      case 422:
        return {
          code: ErrorCode.VALIDATION_ERROR,
          message: data?.message || 'اطلاعات وارد شده معتبر نیست',
          statusCode,
          details: data?.errors || data,
        };
      
      case 500:
      case 502:
      case 503:
        return {
          code: ErrorCode.SERVER_ERROR,
          message: 'خطای سرور، لطفا بعدا تلاش کنید',
          statusCode,
          details: data,
        };
      
      default:
        return {
          code: ErrorCode.UNKNOWN_ERROR,
          message: data?.message || 'خطای نامشخص',
          statusCode,
          details: data,
        };
    }
  }

  /**
   * Display error to user
   */
  displayError(error: AppError, customMessage?: string): void {
    const message = customMessage || error.message;
    
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.FORBIDDEN:
        toast.error(message, {
          description: 'در حال انتقال به صفحه ورود...',
        });
        // Redirect to login after delay
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 2000);
        break;
      
      case ErrorCode.VALIDATION_ERROR:
        toast.error(message, {
          description: 'لطفا اطلاعات را بررسی کنید',
        });
        break;
      
      default:
        toast.error(message);
    }
  }

  /**
   * Log error for debugging
   * Accepts any error type and safely extracts information
   */
  logError(error: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔴 Error ${context ? `in ${context}` : ''}`);
      
      // Safely extract error properties
      if (error?.code) console.error('Code:', error.code);
      if (error?.message) console.error('Message:', error.message);
      if (error?.statusCode) console.error('Status:', error.statusCode);
      if (error?.details) console.error('Details:', error.details);
      
      // If it's a regular Error object
      if (error instanceof Error) {
        console.error('Error:', error);
        if (error.stack) console.error('Stack:', error.stack);
      } else {
        console.error('Error:', error);
      }
      
      console.groupEnd();
    }

    // In production, send to error tracking service (Sentry, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }

  /**
   * Handle and display error in one call
   */
  handle(error: any, context?: string, customMessage?: string): void {
    const appError = this.handleApiError(error);
    this.logError(appError, context);
    this.displayError(appError, customMessage);
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Error boundary wrapper for async functions
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
  customMessage?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    errorHandler.handle(error, context, customMessage);
    return null;
  }
}
