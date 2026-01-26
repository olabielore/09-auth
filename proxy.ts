
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));
  const isAuth = authRoutes.some((r) => pathname.startsWith(r));
 
  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (accessToken && isAuth) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/sign-in', '/sign-up'],
};