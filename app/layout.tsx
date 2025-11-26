import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lora } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bank Gutmann - Investment Simulation",
  description: "Erleben Sie, wie sich Ihr Vermögen entwickeln könnte",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${playfair.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <AppSidebar />
        {children}
      </body>
    </html>
  )
}
