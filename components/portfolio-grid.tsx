"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import type { PortfolioSeries } from "@/lib/types"

interface PortfolioGridProps {
  series: PortfolioSeries[]
}

export function PortfolioGrid({ series }: PortfolioGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-series-id")
            if (id) {
              setVisibleItems((prev) => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const items = gridRef.current?.querySelectorAll("[data-series-id]")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [series])

  if (series.length === 0) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <p className="text-[#999999] text-lg">No portfolio series available yet.</p>
        <p className="text-[#666666] text-sm mt-2">Check back soon for new work.</p>
      </div>
    )
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((item, index) => (
        <Link
          key={item.id}
          href={`/portfolio/${item.id}`}
          data-series-id={item.id}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-[#1c1c1c] stagger-item gpu-accelerated"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            animationDelay: visibleItems.has(item.id) ? `${index * 0.1}s` : "0s",
            opacity: visibleItems.has(item.id) ? 1 : 0,
          }}
        >
          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 gpu-accelerated"
            style={{
              backgroundImage: `url(${item.cover_image_url})`,
              transform: hoveredId === item.id ? "scale(1.1)" : "scale(1)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500"
            style={{
              opacity: hoveredId === item.id ? 1 : 0.6,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div
              className="transition-transform duration-500 gpu-accelerated"
              style={{
                transform: hoveredId === item.id ? "translateY(0)" : "translateY(8px)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <h3 className="text-2xl font-semibold text-white mb-2 text-balance">{item.title}</h3>
              {item.description && (
                <p
                  className="text-sm text-[#e6e6e6] leading-relaxed transition-opacity duration-500 text-pretty"
                  style={{
                    opacity: hoveredId === item.id ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {item.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 text-[#e50914] font-medium text-sm">
                <span>View Series</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300"
                  style={{
                    transform: hoveredId === item.id ? "translateX(4px)" : "translateX(0)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
