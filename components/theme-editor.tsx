"use client"

import { useState } from "react"
import Link from "next/link"

interface SettingItem {
  id: string
  key: string
  value: string
  updated_at: string
}

interface ThemeEditorProps {
  initialSettings: SettingItem[]
}

export function ThemeEditor({ initialSettings }: ThemeEditorProps) {
  const [settings, setSettings] = useState<SettingItem[]>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/adm1ns/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      alert("Failed to save settings")
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
          <h1 className="text-5xl font-bold text-white mb-4">Theme Settings</h1>
          <p className="text-lg text-[#999999]">Customize your site's color palette</p>
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
        {settings.map((item) => (
          <div key={item.id} className="glass p-6 rounded-xl">
            <label className="block text-white font-medium mb-3">{getLabel(item.key)}</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="h-12 w-24 rounded-lg cursor-pointer bg-[#1c1c1c] border border-white/10"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder="#000000"
                className="flex-1 px-4 py-3 bg-[#1c1c1c] text-white rounded-lg border border-white/10 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all duration-300"
              />
              <div className="h-12 w-12 rounded-lg border border-white/10" style={{ backgroundColor: item.value }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
        <p className="text-[#999999] mb-4">Changes will be applied after saving. Refresh the site to see updates.</p>
        <div className="flex gap-4">
          {settings.map((item) => (
            <div key={item.id} className="flex-1 h-24 rounded-lg" style={{ backgroundColor: item.value }} />
          ))}
        </div>
      </div>
    </div>
  )
}
