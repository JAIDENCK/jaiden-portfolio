"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { PortfolioSeries } from "@/lib/types"
import { SeriesManager } from "@/components/series-manager"
import { CreateSeriesModal } from "@/components/create-series-modal"
import { PhotoLibrary } from "@/components/photo-library"

interface AdminDashboardProps {
  initialSeries: PortfolioSeries[]
}

interface DashboardStats {
  totalSeries: number
  totalImages: number
  publishedSeries: number
  publishedImages: number
}

export function AdminDashboard({ initialSeries }: AdminDashboardProps) {
  const [series, setSeries] = useState<PortfolioSeries[]>(initialSeries)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"series" | "photos">("series")
  const [isImporting, setIsImporting] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalSeries: 0,
    totalImages: 0,
    publishedSeries: 0,
    publishedImages: 0,
  })

  useEffect(() => {
    const totalSeries = series.length
    const publishedSeries = series.filter((s) => s.published !== false).length
    const totalImages = series.reduce((acc, s) => acc + (s.image_count || 0), 0)
    const publishedImages = series.reduce((acc, s) => acc + (s.published !== false ? s.image_count || 0 : 0), 0)

    setStats({
      totalSeries,
      totalImages,
      publishedSeries,
      publishedImages,
    })
  }, [series])

  const handleLogout = async () => {
    await fetch("/api/adm1ns/logout", { method: "POST" })
    window.location.href = "/"
  }

  const refreshSeries = async () => {
    const response = await fetch("/api/adm1ns/series")
    const data = await response.json()
    setSeries(data.series || [])
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/adm1ns/backup")
      const data = await response.json()

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Export error:", error)
      alert("Failed to export backup")
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      const text = await file.text()
      const data = JSON.parse(text)

      const response = await fetch("/api/adm1ns/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Import failed")
      }

      const result = await response.json()
      alert(
        `Import successful!\n\nImported:\n- ${result.imported.series} series\n- ${result.imported.images} images\n- ${result.imported.content} content items\n- ${result.imported.settings} settings`,
      )

      // Refresh the page to show new data
      window.location.reload()
    } catch (error) {
      console.error("[v0] Import error:", error)
      alert("Failed to import backup. Please check the file format.")
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-lg text-[#999999]">Manage your portfolio content</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] transition-all duration-300"
          >
            Create Series
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-3 glass text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-xl">
          <div className="text-[#999999] text-sm mb-2">Total Series</div>
          <div className="text-4xl font-bold text-white">{stats.totalSeries}</div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="text-[#999999] text-sm mb-2">Published Series</div>
          <div className="text-4xl font-bold text-white">{stats.publishedSeries}</div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="text-[#999999] text-sm mb-2">Total Images</div>
          <div className="text-4xl font-bold text-white">{stats.totalImages}</div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="text-[#999999] text-sm mb-2">Published Images</div>
          <div className="text-4xl font-bold text-white">{stats.publishedImages}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/adm1ns/content"
          className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e50914] transition-colors">
            Edit Content
          </h3>
          <p className="text-[#999999]">Update hero text, about section, and contact information</p>
        </Link>

        <Link href="/adm1ns/theme" className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e50914] transition-colors">
            Customize Theme
          </h3>
          <p className="text-[#999999]">Adjust colors, fonts, and spacing preferences</p>
        </Link>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Backup & Restore</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Export Backup
            </button>
            <label className="px-4 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer text-center">
              {isImporting ? "Importing..." : "Import Backup"}
              <input type="file" accept=".json" onChange={handleImport} disabled={isImporting} className="hidden" />
            </label>
          </div>
          <p className="text-[#999999] text-sm mt-3">Download or restore your portfolio data</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-6 py-3 font-medium transition-all duration-300 relative ${
              activeTab === "series" ? "text-white" : "text-[#999999] hover:text-white"
            }`}
          >
            Series Management
            {activeTab === "series" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e50914]" />}
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-3 font-medium transition-all duration-300 relative ${
              activeTab === "photos" ? "text-white" : "text-[#999999] hover:text-white"
            }`}
          >
            Photo Library
            {activeTab === "photos" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e50914]" />}
          </button>
        </div>
      </div>

      {activeTab === "series" && (
        <>
          <div className="mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] transition-all duration-300"
            >
              Create Series
            </button>
          </div>
          <SeriesManager series={series} onRefresh={refreshSeries} />
        </>
      )}

      {activeTab === "photos" && <PhotoLibrary series={series} onRefresh={refreshSeries} />}

      {showCreateModal && <CreateSeriesModal onClose={() => setShowCreateModal(false)} onSuccess={refreshSeries} />}
    </>
  )
}
