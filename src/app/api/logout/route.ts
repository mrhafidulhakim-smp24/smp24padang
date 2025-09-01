
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is a custom, manual logout handler. 
// It works by clearing the session cookie used by NextAuth.js.
export async function POST() {
  try {
    const cookieStore = cookies();
    
    // The default cookie name for NextAuth.js is prefixed with `__Secure-` on HTTPS
    // or `next-auth.` on HTTP. We target both possibilities.
    const sessionCookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';

    const legacyCookieName = 'next-auth.session-token';

    // Clear the cookie by setting its value to empty and expiry to a past date.
    cookieStore.set(sessionCookieName, '', { expires: new Date(0), path: '/' });
    cookieStore.set(legacyCookieName, '', { expires: new Date(0), path: '/' });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error during manual logout:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
