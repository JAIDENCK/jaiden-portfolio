import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { series_id } = body

    const supabase = await createClient()

    // Get new order_index if assigning to a series
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
      .update({
        series_id: series_id || null,
        order_index: newOrderIndex,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photo: data })
  } catch (error) {
    console.error("[v0] Assign photo error:", error)
    return NextResponse.json({ error: "Failed to assign photo" }, { status: 500 })
  }
}
