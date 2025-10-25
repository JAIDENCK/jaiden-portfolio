import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ContentEditor } from "@/components/content-editor"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Content Editor | Admin",
  description: "Edit site content",
}

export default async function ContentPage() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/")
  }

  const supabase = await createClient()

  // Fetch all site content
  const { data: content, error } = await supabase.from("site_content").select("*").order("key", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching content:", error)
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ContentEditor initialContent={content || []} />
        </div>
      </section>
    </main>
  )
}
