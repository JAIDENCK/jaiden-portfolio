"use client"

import { useState } from "react"
import type { PortfolioSeries } from "@/lib/types"
import Link from "next/link"

interface SeriesManagerProps {
  series: PortfolioSeries[]
  onRefresh: () => void
}

export function SeriesManager({ series, onRefresh }: SeriesManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this series? This will also delete all images in the series.")) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/series/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onRefresh()
      } else {
        alert("Failed to delete series")
      }
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete series")
    } finally {
      setDeletingId(null)
    }
  }

  if (series.length === 0) {
    return (
      <div className="glass rounded-lg p-12 text-center">
        <p className="text-[#999999] text-lg mb-2">No portfolio series yet</p>
        <p className="text-[#666666] text-sm">Create your first series to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((item) => (
        <div key={item.id} className="glass rounded-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] bg-[#0a0a0a]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.cover_image_url})`,
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
            {item.description && <p className="text-sm text-[#999999] mb-4 line-clamp-2">{item.description}</p>}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/series/${item.id}`}
                className="flex-1 px-4 py-2 bg-[#1c1c1c] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] transition-colors duration-300 text-center"
              >
                Manage Images
              </Link>

              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="px-4 py-2 bg-[#e50914]/10 text-[#e50914] text-sm font-medium rounded-lg hover:bg-[#e50914]/20 transition-colors duration-300 disabled:opacity-50"
              >
                {deletingId === item.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
