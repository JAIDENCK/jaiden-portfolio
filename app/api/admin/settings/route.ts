import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-auth"

export async function PUT(request: Request) {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { settings } = await request.json()
    const supabase = await createClient()

    // Update each setting item
    for (const item of settings) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: item.value, updated_at: new Date().toISOString() })
        .eq("key", item.key)

      if (error) {
        console.error("[v0] Error updating settings:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
