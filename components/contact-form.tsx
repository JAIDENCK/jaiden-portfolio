"use client"

import type React from "react"

import { useState } from "react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")

    // Simulate form submission - in production, this would send to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus("success")
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setStatus("idle"), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#e50914] transition-colors duration-300 resize-none"
          placeholder="Tell me about your project or inquiry..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-4 bg-[#e50914] text-white font-medium rounded-lg hover:bg-[#c40812] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {status === "sending" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-center text-[#e50914] text-sm font-medium">Thank you! I'll get back to you soon.</p>
      )}
    </form>
  )
}
