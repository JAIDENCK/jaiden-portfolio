"use client"

import { useEffect, useState } from "react"
import type { PortfolioImage } from "@/lib/types"

interface LightboxProps {
  images: PortfolioImage[]
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentImage = images[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [currentIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center glass rounded-full text-white hover:bg-white/10 transition-colors duration-300"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 z-50 w-12 h-12 flex items-center justify-center glass rounded-full text-white hover:bg-white/10 transition-colors duration-300"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-6 z-50 w-12 h-12 flex items-center justify-center glass rounded-full text-white hover:bg-white/10 transition-colors duration-300"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="relative max-w-7xl max-h-[90vh] mx-auto px-6">
        <img
          src={currentImage.image_url || "/placeholder.svg"}
          alt={currentImage.title || "Portfolio image"}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />

        {/* Image Info */}
        {(currentImage.title || currentImage.caption) && (
          <div className="absolute bottom-0 left-0 right-0 glass rounded-b-lg p-6 mx-6">
            {currentImage.title && <h3 className="text-xl font-semibold text-white mb-2">{currentImage.title}</h3>}
            {currentImage.caption && <p className="text-sm text-[#e6e6e6] leading-relaxed">{currentImage.caption}</p>}
          </div>
        )}
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full">
        <span className="text-sm text-white font-medium">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
