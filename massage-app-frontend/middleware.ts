import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOGIN_PATH = '/auth/login';

/**
 * Middleware — authentication gate only.
 * Role-based routing is handled client-side by RoleGuard + useAuth.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const publicPaths = ['/auth/', '/'];
  const isPublic = publicPaths.some(p =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  );

  const isProtected = pathname.startsWith('/admin') || 
                       pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/therapist');

  // No token + protected route → login
  if (!token && isProtected) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
