import type { Metadata } from "next"
import { Inter, Bodoni_Moda } from "next/font/google"
import "@/app/globals.css"
import { SettingsProvider } from "@/lib/settings-context" 
// NEU: InvestmentProvider importieren
import { InvestmentProvider } from "@/lib/investment-context"

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
        <SettingsProvider>
          {/* NEU: App in InvestmentProvider wrappen */}
          <InvestmentProvider>
            {children}
          </InvestmentProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}