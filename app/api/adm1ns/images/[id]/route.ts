import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/adm1ns-auth"
import { del } from "@vercel/blob"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const supabase = await createClient()

    // Get image to delete from blob
    const { data: image } = await supabase.from("portfolio_images").select("image_url").eq("id", id).single()

    if (image?.image_url) {
      try {
        await del(image.image_url)
      } catch (error) {
        console.error("[v0] Error deleting image from blob:", error)
      }
    }

    // Delete image from database
    const { error } = await supabase.from("portfolio_images").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete image error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
