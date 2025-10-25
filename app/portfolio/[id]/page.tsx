import { Navigation } from "@/components/navigation"
import { ProjectGallery } from "@/components/project-gallery"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: series } = await supabase.from("portfolio_series").select("title, description").eq("id", id).single()

  if (!series) {
    return {
      title: "Project Not Found | Jaiden Dill-Jackson",
    }
  }

  return {
    title: `${series.title} | Jaiden Dill-Jackson`,
    description: series.description || `View ${series.title} photography series by Jaiden Dill-Jackson`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the series details
  const { data: series, error: seriesError } = await supabase.from("portfolio_series").select("*").eq("id", id).single()

  if (seriesError || !series) {
    console.error("[v0] Error fetching series:", seriesError)
    notFound()
  }

  // Fetch all images in this series
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

      {/* Project Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[#999999] hover:text-white transition-colors duration-300 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Portfolio</span>
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">{series.title}</h1>

          {series.description && (
            <p className="text-lg md:text-xl text-[#999999] max-w-3xl leading-relaxed animate-fade-in-up">
              {series.description}
            </p>
          )}
        </div>
      </section>

      {/* Project Gallery */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ProjectGallery images={images || []} />
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
