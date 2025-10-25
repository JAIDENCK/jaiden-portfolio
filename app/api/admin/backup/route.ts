import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Fetch all data
    const [seriesRes, imagesRes, contentRes, settingsRes] = await Promise.all([
      supabase.from("portfolio_series").select("*").order("order_index"),
      supabase.from("portfolio_images").select("*").order("order_index"),
      supabase.from("site_content").select("*"),
      supabase.from("site_settings").select("*"),
    ])

    const backup = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      data: {
        portfolio_series: seriesRes.data || [],
        portfolio_images: imagesRes.data || [],
        site_content: contentRes.data || [],
        site_settings: settingsRes.data || [],
      },
    }

    return NextResponse.json(backup)
  } catch (error) {
    console.error("[v0] Backup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validate backup structure
    if (!body.version || !body.data) {
      return NextResponse.json({ error: "Invalid backup format" }, { status: 400 })
    }

    const { portfolio_series, portfolio_images, site_content, site_settings } = body.data

    const supabase = await createClient()

    // Clear existing data (optional - you can modify this to merge instead)
    await Promise.all([
      supabase.from("portfolio_images").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("portfolio_series").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("site_content").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("site_settings").delete().neq("key", ""),
    ])

    // Import data
    const results = await Promise.all([
      portfolio_series?.length > 0
        ? supabase.from("portfolio_series").insert(portfolio_series)
        : Promise.resolve({ error: null }),
      portfolio_images?.length > 0
        ? supabase.from("portfolio_images").insert(portfolio_images)
        : Promise.resolve({ error: null }),
      site_content?.length > 0 ? supabase.from("site_content").insert(site_content) : Promise.resolve({ error: null }),
      site_settings?.length > 0
        ? supabase.from("site_settings").insert(site_settings)
        : Promise.resolve({ error: null }),
    ])

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error("[v0] Import errors:", errors)
      return NextResponse.json({ error: "Some data failed to import", details: errors }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imported: {
        series: portfolio_series?.length || 0,
        images: portfolio_images?.length || 0,
        content: site_content?.length || 0,
        settings: site_settings?.length || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
