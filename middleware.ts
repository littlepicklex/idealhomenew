import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

// Routes that require authentication
const protectedRoutes = [
  '/api/favorites',
  '/api/auth/me',
  '/profile',
];

// Routes that should redirect if already authenticated
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = token ? verifyToken(token) !== null : false;
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
  }
  
  // For API routes, return 401 instead of redirect
  if (isProtectedRoute && pathname.startsWith('/api/') && !isAuthenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
