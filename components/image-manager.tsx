"use client"

import { useState } from "react"
import type { PortfolioImage } from "@/lib/types"
import { UploadImageModal } from "@/components/upload-image-modal"

interface ImageManagerProps {
  seriesId: string
  initialImages: PortfolioImage[]
}

export function ImageManager({ seriesId, initialImages }: ImageManagerProps) {
  const [images, setImages] = useState<PortfolioImage[]>(initialImages)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const refreshImages = async () => {
    const response = await fetch(`/api/admin/series/${seriesId}/images`)
    const data = await response.json()
    setImages(data.images || [])
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        refreshImages()
      } else {
        alert("Failed to delete image")
      }
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete image")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] transition-all duration-300"
        >
          Upload Images
        </button>
      </div>

      {images.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center">
          <p className="text-[#999999] text-lg mb-2">No images in this series yet</p>
          <p className="text-[#666666] text-sm">Upload your first image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="glass rounded-lg overflow-hidden">
              <div className="relative aspect-square bg-[#0a0a0a]">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.title || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                {image.title && <h4 className="text-sm font-medium text-white mb-2 truncate">{image.title}</h4>}

                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="w-full px-3 py-2 bg-[#e50914]/10 text-[#e50914] text-sm font-medium rounded-lg hover:bg-[#e50914]/20 transition-colors duration-300 disabled:opacity-50"
                >
                  {deletingId === image.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadImageModal seriesId={seriesId} onClose={() => setShowUploadModal(false)} onSuccess={refreshImages} />
      )}
    </>
  )
}
