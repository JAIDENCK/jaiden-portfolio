import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Read submitted passphrase
  const { passphrase } = await req.json();

  // Check if it matches your ADMIN_PASSPHRASE in Vercel
  if (passphrase !== process.env.ADMIN_PASSPHRASE) {
    return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
  }

  // ✅ Set a secure session cookie
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("session", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return res;
}
