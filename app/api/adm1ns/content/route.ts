import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/adm1ns-auth"

export async function PUT(request: Request) {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { content } = await request.json()
    const supabase = await createClient()

    // Update each content item
    for (const item of content) {
      const { error } = await supabase
        .from("site_content")
        .update({ value: item.value, updated_at: new Date().toISOString() })
        .eq("key", item.key)

      if (error) {
        console.error("[v0] Error updating content:", error)
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Content update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
