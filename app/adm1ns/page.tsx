import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/admin-auth"
import { Navigation } from "@/components/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Admin Dashboard | Jaiden Dill-Jackson",
  description: "Portfolio management dashboard",
}

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/")
  }

  const supabase = await createClient()

  // Fetch all portfolio series with image counts
  const { data: series, error } = await supabase
    .from("portfolio_series")
    .select("*, portfolio_images(count)")
    .order("order_index", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching series:", error)
  }

  const seriesWithCounts = series?.map((s: any) => ({
    ...s,
    image_count: s.portfolio_images?.[0]?.count || 0,
    portfolio_images: undefined,
  }))

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AdminDashboard initialSeries={seriesWithCounts || []} />
        </div>
      </section>
    </main>
  )
}
