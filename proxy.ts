
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));
 
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers['set-cookie'];

      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        cookiesArray.forEach((cookie) => {
          cookieStore.set(cookie);
        });

        return NextResponse.next();
      }
    } catch {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    }
  }

  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (accessToken && isAuth) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};