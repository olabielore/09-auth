
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
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
 
  if (!accessToken) {
    if (refreshToken) {
      
      const data = await checkSession();
      const setCookieHeader = data.headers['set-cookie'];

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          for (const [name, value] of Object.entries(parsed)) {

            if (value) {
              cookieStore.set(name, value, { path: '/' });
            }
          }
        }

        if (isAuth) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        if (isPrivate) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }

    if (isAuth) return NextResponse.next();
    if (isPrivate) return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (accessToken) {
    if (isAuth) return NextResponse.redirect(new URL('/', request.url));
    if (isPrivate) return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};