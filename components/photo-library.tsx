"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PortfolioImage, PortfolioSeries } from "@/lib/types"

interface PhotoLibraryProps {
  series: PortfolioSeries[]
  onRefresh: () => void
}

export function PhotoLibrary({ series, onRefresh }: PhotoLibraryProps) {
  const [photos, setPhotos] = useState<PortfolioImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/admin/photos")
      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error("[v0] Fetch photos error:", error)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await uploadResponse.json()

        // Create image without series assignment
        await fetch("/api/admin/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: url,
            title: file.name.replace(/\.[^/.]+$/, ""),
          }),
        })
      }

      fetchPhotos()
      onRefresh()
      e.target.value = ""
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload photos")
    } finally {
      setUploading(false)
    }
  }

  const handleAssignToSeries = async (photoId: string, seriesId: string) => {
    setAssigningId(photoId)

    try {
      const response = await fetch(`/api/admin/photos/${photoId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series_id: seriesId === "unassigned" ? null : seriesId,
        }),
      })

      if (response.ok) {
        fetchPhotos()
        onRefresh()
      } else {
        alert("Failed to assign photo")
      }
    } catch (error) {
      console.error("[v0] Assign error:", error)
      alert("Failed to assign photo")
    } finally {
      setAssigningId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPhotos()
        onRefresh()
      } else {
        alert("Failed to delete photo")
      }
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete photo")
    } finally {
      setDeletingId(null)
    }
  }

  const getSeriesName = (seriesId: string | null) => {
    if (!seriesId) return "Unassigned"
    const foundSeries = series.find((s) => s.id === seriesId)
    return foundSeries?.title || "Unknown Series"
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <label className="px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] transition-all duration-300 cursor-pointer">
          {uploading ? "Uploading..." : "Upload Photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="text-sm text-[#999999]">Upload photos and assign them to series using the dropdown</p>
      </div>

      {photos.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center">
          <p className="text-[#999999] text-lg mb-2">No photos in library yet</p>
          <p className="text-[#666666] text-sm">Upload your first photo to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="glass rounded-lg overflow-hidden">
              <div className="relative aspect-square bg-[#0a0a0a]">
                <img
                  src={photo.image_url || "/placeholder.svg"}
                  alt={photo.title || ""}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-3">
                {photo.title && <h4 className="text-sm font-medium text-white truncate">{photo.title}</h4>}

                <div>
                  <label className="block text-xs text-[#999999] mb-1">Assign to Series</label>
                  <select
                    value={photo.series_id || "unassigned"}
                    onChange={(e) => handleAssignToSeries(photo.id, e.target.value)}
                    disabled={assigningId === photo.id}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#e50914] transition-colors duration-300 disabled:opacity-50"
                  >
                    <option value="unassigned">Unassigned</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="w-full px-3 py-2 bg-[#e50914]/10 text-[#e50914] text-sm font-medium rounded-lg hover:bg-[#e50914]/20 transition-colors duration-300 disabled:opacity-50"
                >
                  {deletingId === photo.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
