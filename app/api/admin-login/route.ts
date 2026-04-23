import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPass = process.env.ADMIN_PASSWORD;
    
    console.log('[admin-login] Password check:', {
      provided: password ? 'YES' : 'NO (empty)',
      matches: password === adminPass,
      envSet: adminPass ? 'YES' : 'NO'
    });

    // 2FA is disabled - password-only login
    if (password === adminPass) {
      console.log('[admin-login] ✓ Password correct, setting cookie');
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return response;
    }

    console.log('[admin-login] ✗ Password incorrect');
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    console.error('admin-login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
