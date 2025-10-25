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

    // Get series to delete cover image from blob
    const { data: series } = await supabase.from("portfolio_series").select("cover_image_url").eq("id", id).single()

    if (series?.cover_image_url) {
      try {
        await del(series.cover_image_url)
      } catch (error) {
        console.error("[v0] Error deleting cover image:", error)
      }
    }

    // Get all images in the series to delete from blob
    const { data: images } = await supabase.from("portfolio_images").select("image_url").eq("series_id", id)

    if (images) {
      for (const image of images) {
        try {
          await del(image.image_url)
        } catch (error) {
          console.error("[v0] Error deleting image:", error)
        }
      }
    }

    // Delete series (cascade will delete images from database)
    const { error } = await supabase.from("portfolio_series").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete series error:", error)
    return NextResponse.json({ error: "Failed to delete series" }, { status: 500 })
  }
}
