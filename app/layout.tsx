import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MaubenTech Roots - Corporate Cocktail & Fundraiser Evening",
  description:
    "Join us for an exclusive evening of elegance, impact, and innovation. A Corporate Cocktail & Fundraiser Evening empowering African youth in tech.",
  keywords: "MaubenTech, fundraiser, corporate event, African youth, technology, innovation",
  authors: [{ name: "MaubenTech Roots" }],
  openGraph: {
    title: "MaubenTech Roots - Corporate Cocktail & Fundraiser Evening",
    description: "Join us for an exclusive evening of elegance, impact, and innovation.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/images/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
