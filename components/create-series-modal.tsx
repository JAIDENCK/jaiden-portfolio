"use client"

import type React from "react"
import { useState } from "react"

interface CreateSeriesModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateSeriesModal({ onClose, onSuccess }: CreateSeriesModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setUploading(true)

    try {
      let coverImageUrl = ""

      if (coverImage) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", coverImage)

        const uploadResponse = await fetch("/api/adm1ns/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await uploadResponse.json()
        coverImageUrl = url
      }

      // Create series
      const response = await fetch("/api/adm1ns/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...(coverImageUrl && { cover_image_url: coverImageUrl }),
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        alert("Failed to create series")
      }
    } catch (error) {
      console.error("[v0] Create series error:", error)
      alert("Failed to create series")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="glass rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Create New Series</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Series Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300"
              placeholder="e.g., Aviation Collection"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300 resize-none"
              placeholder="Brief description of this series..."
            />
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-white mb-2">
              Cover Image <span className="text-[#999999]">(Optional)</span>
            </label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#e50914] file:text-white file:font-medium hover:file:bg-[#c40812] file:cursor-pointer"
            />
            <p className="text-xs text-[#666666] mt-2">You can add a cover image later from the Photo Library</p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {uploading ? "Creating..." : "Create Series"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 glass text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
