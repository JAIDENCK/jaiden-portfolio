import { NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/adm1ns-auth"

export async function POST() {
  await clearAdminSession()
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
