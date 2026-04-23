import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') return response;
    const auth = request.cookies.get('admin_auth');
    console.log('[middleware] /admin check:', {
      path: request.nextUrl.pathname,
      authCookie: auth ? auth.value : 'NOT FOUND',
      allCookies: request.cookies.getAll().map(c => `${c.name}=${c.value}`),
    });
    if (!auth || auth.value !== 'true') {
      console.log('[middleware] ✗ No valid auth, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    console.log('[middleware] ✓ Auth valid, allowing access');
  }
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};