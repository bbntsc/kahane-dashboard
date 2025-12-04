import type { Metadata } from "next"
// Inter ist gut für Sans-Serif. Bodoni Moda ist die aktuelle Serif-Wahl.
import { Inter, Bodoni_Moda } from "next/font/google"
import "./globals.css"
// WICHTIG: Importiere den SettingsProvider, damit die Simulation läuft
import { SettingsProvider } from "@/lib/settings-context" 

// Wir behalten Inter für Sans und Bodoni_Moda für Serif, da es professionell aussieht.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" })

export const metadata: Metadata = {
  title: "Gutmann Concierge - Investment Simulation und Marktanalyse",
  description: "Investment simulation and market analysis platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${bodoni.variable} font-sans antialiased`}>
        {/* Wir wrappen die App in den SettingsProvider */}
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}