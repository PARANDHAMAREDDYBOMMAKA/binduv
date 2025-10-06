import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navigation from "../components/layout/Navigation"
import Footer from "../components/layout/Footer"
import OceanBackgroundWrapper from "@/components/OceanBackgroungWrapper"
import SmoothScrollProvider from "@/components/SmoothScrolling"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Binduv UI - IPO Tracking Made Simple",
  description: "Track IPO allotments, upcoming IPOs, and performance monitoring in one place",
  keywords: "IPO, allotment, tracking, stock market, investment",
  authors: [{ name: "Binduv UI Team" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
          <OceanBackgroundWrapper/>
          <Navigation />
          <main className="relative">{children}</main>
          <Footer />
      </body>
    </html>
  )
}
