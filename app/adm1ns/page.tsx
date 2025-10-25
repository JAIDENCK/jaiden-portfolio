// app/adm1ns/page.tsx
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Admin Dashboard | Jaiden Dill-Jackson",
  description: "Portfolio management dashboard",
}

export default async function AdminPage() {
  // if createClient throws when envs are missing, guard it
  let seriesWithCounts: any[] = []
  try {
    const supabase = await createClient()
    const { data: series, error } = await supabase
      .from("portfolio_series")
      .select("*, portfolio_images(count)")
      .order("order_index", { ascending: true })

    if (!error && series) {
      seriesWithCounts = series.map((s: any) => ({
        ...s,
        image_count: s.portfolio_images?.[0]?.count || 0,
        portfolio_images: undefined,
      }))
    }
  } catch (e) {
    // swallow errors so the page still renders
    console.error("AdminPage load error:", e)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

          {seriesWithCounts.length === 0 ? (
            <p className="text-neutral-400">
              No series found (or Supabase not configured). Add content in your DB or check env vars.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seriesWithCounts.map((s) => (
                <li key={s.id} className="rounded-lg border border-neutral-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-medium">{s.title}</h2>
                    <span className="text-sm text-neutral-400">{s.image_count} images</span>
                  </div>
                  {s.summary ? (
                    <p className="text-sm text-neutral-400 line-clamp-3">{s.summary}</p>
                  ) : (
                    <p className="text-sm text-neutral-500 italic">No summary</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
