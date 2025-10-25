import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  const supabase = await createClient()

  const { data: images, error } = await supabase
    .from("portfolio_images")
    .select("*")
    .eq("series_id", id)
    .order("order_index", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ images })
}

export async function POST(request: NextRequest, context: RouteContext) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const { image_url, title, caption } = body

    if (!image_url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the highest order_index for this series
    const { data: maxOrder } = await supabase
      .from("portfolio_images")
      .select("order_index")
      .eq("series_id", id)
      .order("order_index", { ascending: false })
      .limit(1)
      .single()

    const newOrderIndex = (maxOrder?.order_index ?? -1) + 1

    const { data, error } = await supabase
      .from("portfolio_images")
      .insert({
        series_id: id,
        image_url,
        title,
        caption,
        order_index: newOrderIndex,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image: data })
  } catch (error) {
    console.error("[v0] Create image error:", error)
    return NextResponse.json({ error: "Failed to create image" }, { status: 500 })
  }
}
