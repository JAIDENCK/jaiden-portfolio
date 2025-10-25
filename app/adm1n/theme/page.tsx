import { Navigation } from "@/components/navigation"
import { ThemeEditor } from "@/components/theme-editor"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Theme Editor | Admin",
  description: "Customize site theme",
}

export default async function ThemePage() {
  const supabase = await createClient()

  // Fetch all site settings
  const { data: settings, error } = await supabase.from("site_settings").select("*").order("key", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching settings:", error)
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ThemeEditor initialSettings={settings || []} />
        </div>
      </section>
    </main>
  )
}
