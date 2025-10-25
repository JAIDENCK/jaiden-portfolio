import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: series, error } = await supabase
    .from("portfolio_series")
    .select("*")
    .order("order_index", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ series })
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, cover_image_url } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: maxOrder } = await supabase
      .from("portfolio_series")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle()

    const newOrderIndex = (maxOrder?.order_index ?? -1) + 1

    const { data, error } = await supabase
      .from("portfolio_series")
      .insert({
        title,
        description,
        ...(cover_image_url && { cover_image_url }),
        order_index: newOrderIndex,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ series: data })
  } catch (error) {
    console.error("[v0] Create series error:", error)
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 })
  }
}
