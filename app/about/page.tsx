import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "About | Jaiden Dill-Jackson",
  description:
    "Learn more about Jaiden Dill-Jackson, a UK-based student photographer specializing in aviation, landscapes, and portrait photography.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">About Me</h1>
          <p className="text-lg md:text-xl text-[#999999] max-w-3xl leading-relaxed animate-fade-in-up">
            Capturing the world through a cinematic lens
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Profile Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#1c1c1c]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(/placeholder.svg?height=1000&width=800&query=photographer+portrait+professional)",
                }}
              />
            </div>

            {/* Bio Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Jaiden Dill-Jackson</h2>
                <p className="text-[#e6e6e6] leading-relaxed">
                  I'm a 16-year-old student photographer based in the United Kingdom, passionate about capturing moments
                  that tell compelling stories. My work spans across aviation photography, landscape imagery, and
                  cinematic portraits.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">My Approach</h3>
                <p className="text-[#e6e6e6] leading-relaxed">
                  Photography, for me, is about more than just capturing images—it's about freezing emotions, preserving
                  memories, and creating art that resonates. I strive to bring a cinematic quality to every shot,
                  focusing on composition, lighting, and storytelling.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Specializations</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e50914] mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Aviation Photography</h4>
                      <p className="text-[#999999] text-sm leading-relaxed">
                        Capturing the power and grace of aircraft in flight and on the ground
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e50914] mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Landscape Photography</h4>
                      <p className="text-[#999999] text-sm leading-relaxed">
                        Showcasing the beauty of natural environments and urban landscapes
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e50914] mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Portrait Photography</h4>
                      <p className="text-[#999999] text-sm leading-relaxed">
                        Creating cinematic portraits that capture personality and emotion
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Equipment</h3>
                <p className="text-[#999999] leading-relaxed">
                  I work with professional-grade camera equipment to ensure the highest quality results for every
                  project. My gear includes various lenses optimized for different shooting scenarios, from wide-angle
                  landscapes to telephoto aviation shots.
                </p>
              </div>
            </div>
          </div>
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
