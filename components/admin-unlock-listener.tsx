"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TRIGGER_PHRASE = "login" // Case-insensitive

export function AdminUnlockListener() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let typedKeys = ""
    let timeout: NodeJS.Timeout

    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      // Add the key to the buffer
      typedKeys += e.key.toLowerCase()

      // Keep only the last characters equal to trigger phrase length
      if (typedKeys.length > TRIGGER_PHRASE.length) {
        typedKeys = typedKeys.slice(-TRIGGER_PHRASE.length)
      }

      if (typedKeys === TRIGGER_PHRASE) {
        setShowModal(true)
        typedKeys = ""
      }

      // Clear the buffer after 2 seconds of inactivity
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        typedKeys = ""
      }, 2000)
    }

    window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
      clearTimeout(timeout)
    }
  }, [])

  if (!showModal) return null

  return (
    <AdminLoginModal
      onClose={() => setShowModal(false)}
      onSuccess={() => {
        setShowModal(false)
        window.location.href = "/adm1ns"
      }}
    />
  )
}

function AdminLoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [passphrase, setPassphrase] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/adm1ns/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || "Incorrect passphrase. Try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md p-8 rounded-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="passphrase" className="sr-only">
              Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Passphrase"
              className="w-full px-4 py-3 bg-[#1c1c1c] text-white rounded-lg border border-white/10 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all duration-300"
              autoFocus
              required
            />
            {error && <p className="mt-2 text-sm text-[#e50914]">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 glass text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Unlocking..." : "Unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
