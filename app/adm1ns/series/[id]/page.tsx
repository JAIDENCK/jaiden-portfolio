import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/adm1ns-auth"
import { Navigation } from "@/components/navigation"
import { ImageManager } from "@/components/image-manager"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

interface SeriesPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminSeriesPage({ params }: SeriesPageProps) {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/")
  }

  const { id } = await params
  const supabase = await createClient()

  const { data: series, error: seriesError } = await supabase.from("portfolio_series").select("*").eq("id", id).single()

  if (seriesError || !series) {
    notFound()
  }

  const { data: images, error: imagesError } = await supabase
    .from("portfolio_images")
    .select("*")
    .eq("series_id", id)
    .order("order_index", { ascending: true })

  if (imagesError) {
    console.error("[v0] Error fetching images:", imagesError)
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/adm1ns"
            className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors duration-300 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{series.title}</h1>
            {series.description && <p className="text-lg text-[#999999]">{series.description}</p>}
          </div>

          <ImageManager seriesId={id} initialImages={images || []} />
        </div>
      </section>
    </main>
  )
}
