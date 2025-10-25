// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// tell next.js which routes this middleware should run on
export const config = {
  matcher: ["/adm1ns/:path*"], // only affect /adm1ns and its subpaths
};

export default function middleware(req: NextRequest) {
  try {
    // you can add logic here later, for now it just lets requests through
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next(); // always fail open instead of breaking the build
  }
}
