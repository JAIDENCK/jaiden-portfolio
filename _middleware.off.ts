import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/adm1ns/:path*'], // only protect /adm1ns pages
};

export default function middleware(req: NextRequest) {
  try {
    const hasSession = Boolean(req.cookies.get('session')?.value);

    if (!hasSession && req.nextUrl.pathname.startsWith('/adm1ns')) {
      const url = new URL('/', req.url);
      url.searchParams.set('auth', 'required');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next(); // prevent middleware crash
  }
}
