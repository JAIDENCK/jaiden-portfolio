"use client"

import { useState } from "react"
import { Lightbox } from "@/components/lightbox"
import type { PortfolioImage } from "@/lib/types"

interface ProjectGalleryProps {
  images: PortfolioImage[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-[#999999] text-lg">No images in this series yet.</p>
      </div>
    )
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative w-full break-inside-avoid overflow-hidden rounded-lg bg-[#1c1c1c] block"
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {/* Image */}
            <img
              src={image.image_url || "/placeholder.svg"}
              alt={image.title || "Portfolio image"}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="text-center px-4">
                {image.title && <h3 className="text-lg font-semibold text-white mb-2">{image.title}</h3>}
                <div className="flex items-center justify-center gap-2 text-[#e50914] font-medium text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  <span>View Full Size</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && <Lightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}
    </>
  )
}
