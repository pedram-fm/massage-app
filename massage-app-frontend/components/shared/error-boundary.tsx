'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for catching and displaying errors in Therapist pages
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4" dir="rtl">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <CardTitle>خطایی رخ داده است</CardTitle>
              </div>
              <CardDescription>
                متأسفانه مشکلی در بارگذاری این صفحه پیش آمد
              </CardDescription>
            </CardHeader>
            <CardContent>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-mono">{this.state.error.message}</p>
                  {this.state.error.stack && (
                    <pre className="mt-2 max-h-40 overflow-auto text-xs">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                لطفاً صفحه را رفرش کنید یا دوباره تلاش نمایید. اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={this.handleReset} variant="default" className="flex-1">
                <RefreshCw className="ml-2 h-4 w-4" />
                تلاش مجدد
              </Button>
              <Button
                onClick={() => window.location.href = '/therapist'}
                variant="outline"
                className="flex-1"
              >
                بازگشت به داشبورد
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component
 */
export function ErrorFallback({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void 
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <CardTitle className="text-lg">خطایی رخ داده است</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-800">
              {error.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            لطفاً دوباره تلاش کنید
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} variant="default" size="sm" className="w-full">
            <RefreshCw className="ml-2 h-4 w-4" />
            تلاش مجدد
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
