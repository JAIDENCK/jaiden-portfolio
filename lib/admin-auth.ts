import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return false
    }

    const supabase = await createClient()

    // Check if session exists and is not expired
    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single()

    if (error || !session) {
      return false
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at)
    if (expiresAt < new Date()) {
      // Delete expired session
      await supabase.from("admin_sessions").delete().eq("session_token", sessionToken)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Admin auth check error:", error)
    return false
  }
}

export async function clearAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      const supabase = await createClient()
      await supabase.from("admin_sessions").delete().eq("session_token", sessionToken)
    }

    cookieStore.delete("admin_session")
  } catch (error) {
    console.error("[v0] Error clearing admin session:", error)
  }
}
