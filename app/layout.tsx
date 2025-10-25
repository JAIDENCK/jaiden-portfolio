import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AdminUnlockListener } from "@/components/adm1ns-unlock-listener"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jaiden Dill-Jackson | Cinematic Photography",
  description:
    "UK-based student photographer specializing in aviation, landscapes, and portrait photography. Explore my cinematic portfolio.",
  keywords: [
    "photography",
    "aviation photography",
    "landscape photography",
    "portrait photography",
    "UK photographer",
    "student photographer",
  ],
  authors: [{ name: "Jaiden Dill-Jackson" }],
  creator: "Jaiden Dill-Jackson",
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Jaiden Dill-Jackson | Cinematic Photography",
    description: "UK-based student photographer specializing in aviation, landscapes, and portrait photography.",
    siteName: "Jaiden Dill-Jackson Photography",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaiden Dill-Jackson | Cinematic Photography",
    description: "UK-based student photographer specializing in aviation, landscapes, and portrait photography.",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <AdminUnlockListener />
        <Analytics />
      </body>
    </html>
  )
}
