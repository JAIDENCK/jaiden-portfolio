"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass" : "bg-transparent"}`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-white hover:text-[#e6e6e6] transition-colors duration-300 relative group"
            >
              Jaiden Dill-Jackson
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e50914] group-hover:w-full transition-all duration-500"
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                    pathname === link.href ? "text-white" : "text-[#999999] hover:text-[#e6e6e6]"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#e50914] animate-scale-in" />
                  )}
                </Link>
              ))}
            </div>

            <button
              className="md:hidden text-white relative w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />

        {/* Menu content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="flex flex-col gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-3xl font-semibold tracking-tight transition-all duration-300 ${
                  pathname === link.href ? "text-white" : "text-[#999999] hover:text-[#e6e6e6]"
                }`}
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
