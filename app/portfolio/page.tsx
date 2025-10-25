import { Navigation } from "@/components/navigation"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Portfolio | Jaiden Dill-Jackson",
  description: "Explore my photography portfolio featuring aviation, landscapes, and portrait work.",
}

export default async function PortfolioPage() {
  const supabase = await createClient()

  // Fetch all portfolio series ordered by order_index
  const { data: series, error } = await supabase
    .from("portfolio_series")
    .select("*")
    .order("order_index", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching portfolio series:", error)
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">Portfolio</h1>
          <p className="text-lg md:text-xl text-[#999999] max-w-3xl leading-relaxed animate-fade-in-up">
            A curated collection of my photography work, spanning aviation, landscapes, and cinematic portraits. Each
            series tells a unique story through carefully composed images.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <PortfolioGrid series={series || []} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#999999] text-sm">
            © {new Date().getFullYear()} Jaiden Dill-Jackson. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
