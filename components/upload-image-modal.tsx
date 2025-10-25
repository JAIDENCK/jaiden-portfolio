"use client"

import type React from "react"
import { useState } from "react"

interface UploadImageModalProps {
  seriesId: string
  onClose: () => void
  onSuccess: () => void
}

export function UploadImageModal({ seriesId, onClose, onSuccess }: UploadImageModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Please select at least one image")
      return
    }

    setUploading(true)

    try {
      // Upload all images
      for (const file of files) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        const uploadResponse = await fetch("/api/adm1ns/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const { url } = await uploadResponse.json()

        // Add image to series
        await fetch(`/api/adm1ns/series/${seriesId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: url,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          }),
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="glass rounded-lg p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Upload Images</h2>
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
            <label htmlFor="images" className="block text-sm font-medium text-white mb-2">
              Select Images
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#e50914] file:text-white file:font-medium hover:file:bg-[#c40812] file:cursor-pointer"
            />
            {files.length > 0 && <p className="text-sm text-[#999999] mt-2">{files.length} file(s) selected</p>}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {uploading ? "Uploading..." : "Upload Images"}
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
