import type { Metadata } from "next"
import { Inter, Bodoni_Moda } from "next/font/google"
import "./globals.css"

// Inter für sauberen Fließtext
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
// Bodoni Moda für die großen Überschriften
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" })

export const metadata: Metadata = {
  title: "Kahane Financial Dashboard",
  description: "Investment simulation and market analysis platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      {/* Beide Schriftarten werden hier als CSS-Variablen injiziert */}
      <body className={`${inter.variable} ${bodoni.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
