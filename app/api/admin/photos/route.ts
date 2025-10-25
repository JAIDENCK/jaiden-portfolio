import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: photos, error } = await supabase
    .from("portfolio_images")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ photos })
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { image_url, title, caption, series_id } = body

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the highest order_index for this series (or globally if no series)
    let newOrderIndex = 0
    if (series_id) {
      const { data: maxOrder } = await supabase
        .from("portfolio_images")
        .select("order_index")
        .eq("series_id", series_id)
        .order("order_index", { ascending: false })
        .limit(1)
        .single()

      newOrderIndex = (maxOrder?.order_index ?? -1) + 1
    }

    const { data, error } = await supabase
      .from("portfolio_images")
      .insert({
        image_url,
        title,
        caption,
        series_id: series_id || null,
        order_index: newOrderIndex,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photo: data })
  } catch (error) {
    console.error("[v0] Create photo error:", error)
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 })
  }
}
