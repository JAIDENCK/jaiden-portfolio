import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"

const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || "JaidenDilljackson2009"
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: Request) {
  try {
    const { passphrase } = await request.json()

    if (!passphrase) {
      return NextResponse.json({ success: false, error: "Passphrase is required" }, { status: 400 })
    }

    const headersList = await headers()
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"

    const supabase = await createClient()

    const fifteenMinutesAgo = new Date(Date.now() - LOCKOUT_DURATION_MS)
    const { data: recentAttempts, error: attemptsError } = await supabase
      .from("admin_login_attempts")
      .select("*")
      .eq("ip_address", ipAddress)
      .gte("attempted_at", fifteenMinutesAgo.toISOString())
      .order("attempted_at", { ascending: false })

    if (attemptsError) {
      console.error("[v0] Error checking login attempts:", attemptsError)
    }

    const failedAttempts = recentAttempts?.filter((a) => !a.success) || []

    if (failedAttempts.length >= MAX_ATTEMPTS) {
      await supabase.from("admin_login_attempts").insert({
        ip_address: ipAddress,
        success: false,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Too many failed attempts. Please try again in 15 minutes.",
        },
        { status: 429 },
      )
    }

    const isValid = passphrase === ADMIN_PASSPHRASE

    await supabase.from("admin_login_attempts").insert({
      ip_address: ipAddress,
      success: isValid,
    })

    if (!isValid) {
      const remainingAttempts = MAX_ATTEMPTS - failedAttempts.length - 1
      return NextResponse.json(
        {
          success: false,
          error:
            remainingAttempts > 0
              ? `Incorrect passphrase. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`
              : "Incorrect passphrase. Account locked for 15 minutes.",
        },
        { status: 401 },
      )
    }

    // Generate a secure session token
    const sessionToken = crypto.randomUUID()

    // Set expiration to 24 hours from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Store session in database
    const { error } = await supabase.from("admin_sessions").insert({
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })

    if (error) {
      console.error("[v0] Error creating admin session:", error)
      return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Admin unlock error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
