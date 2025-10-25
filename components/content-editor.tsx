"use client"

import { useState } from "react"
import Link from "next/link"

interface ContentItem {
  id: string
  key: string
  value: string
  updated_at: string
}

interface ContentEditorProps {
  initialContent: ContentItem[]
}

export function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState<ContentItem[]>(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => {
    setContent((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/adm1ns/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert("Failed to save content")
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      alert("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  const getLabel = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/adm1ns" className="text-[#e50914] hover:text-[#c40812] mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">Edit Content</h1>
          <p className="text-lg text-[#999999]">Update text content across your site</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] transition-all duration-300 disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {content.map((item) => (
          <div key={item.id} className="glass p-6 rounded-xl">
            <label className="block text-white font-medium mb-3">{getLabel(item.key)}</label>
            {item.key.includes("description") || item.key.includes("approach") || item.key.includes("note") ? (
              <textarea
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[#1c1c1c] text-white rounded-lg border border-white/10 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all duration-300 resize-none"
              />
            ) : (
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-3 bg-[#1c1c1c] text-white rounded-lg border border-white/10 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all duration-300"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
