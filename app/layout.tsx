import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { LoadingScreen } from "@/components/loading-screen"
import "./globals.css"

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "KandyPOS | Point of Sale & ERP Systems",
  description:
    "Your business's plug-and-play operating system. ERP, POS, and AI Agents built for modern business owners.",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.variable} ${GeistMono.variable} font-sans antialiased bg-[#0a0a0a] text-zinc-100`}>
        <LoadingScreen />
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
      </body>
    </html>
  )
}
