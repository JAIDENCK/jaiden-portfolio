"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const featuredRef = useRef<HTMLDivElement>(null)
  const [featuredVisible, setFeaturedVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturedVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (featuredRef.current) {
      observer.observe(featuredRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 gpu-accelerated"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=1080&width=1920&query=cinematic+aviation+photography+dramatic+sky)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 animate-fade-in-up text-balance"
            style={{
              animationDelay: "0.2s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Capturing Moments,
            <br />
            <span className="text-[#e6e6e6]">Crafting Stories</span>
          </h1>

          <p
            className="text-lg md:text-xl text-[#e6e6e6] mb-8 leading-relaxed animate-fade-in-up text-pretty"
            style={{
              animationDelay: "0.4s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            UK-based student photographer specializing in aviation, landscapes, and cinematic portraits
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{
              animationDelay: "0.6s",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] hover:scale-105 hover:shadow-2xl hover:shadow-[#e50914]/20 transition-all duration-300"
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              View Portfolio
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 glass text-white font-medium rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          style={{
            animation: "bounce 2s infinite",
            opacity: scrollY > 100 ? 0 : 1,
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-24 px-6 bg-[#0a0a0a]" ref={featuredRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Featured Work</h2>
            <p className="text-lg text-[#999999] max-w-2xl mx-auto text-pretty">
              A selection of my recent photography projects spanning aviation, landscapes, and portraits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                href="/portfolio"
                className="group relative aspect-[4/5] overflow-hidden rounded-lg stagger-item gpu-accelerated"
                style={{
                  animationDelay: featuredVisible ? `${i * 0.15}s` : "0s",
                  opacity: featuredVisible ? 1 : 0,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 gpu-accelerated"
                  style={{
                    backgroundImage: `url(/placeholder.svg?height=800&width=640&query=cinematic+photography+project+${i})`,
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 gpu-accelerated"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">Project {i}</h3>
                  <p className="text-sm text-[#e6e6e6]">View Series</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-white hover:text-[#e50914] transition-colors duration-300 group"
            >
              <span className="font-medium">View All Work</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
