// bbntsc/kahane-dashboard/kahane-dashboard-concierge/components/market-app.tsx
"use client"

import { useState } from "react"
// import { BankGutmannHeader } from "@/components/bank-gutmann-header" <-- LÖSCHEN
import { MarketControls } from "./market/market-controls" 
import { MarketSummary } from "./market/market-summary" 
import { MarketChart } from "./market/market-chart" 
import { CrisisDetailModal } from "./crisis-detail-modal"
import { type Crisis } from "./market/market-data" 
import Link from "next/link" // Import für Link
import { useSettings } from "@/lib/settings-context" // Import für useSettings
import { useTranslation } from "@/lib/i18n" // Import für useTranslation

export function MarketApp() {
  const [timeframe, setTimeframe] = useState<"40" | "30" | "20" | "10" | "5">("40")
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  const { language } = useSettings()
  const t = useTranslation(language)

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]" data-tour="market-page"> {/* NEU: data-tour="market-page" */}
        {/* <BankGutmannHeader /> <-- LÖSCHEN */}
        
        <div className="mx-auto max-w-7xl px-4 py-8">
        <MarketControls
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            showInsights={showInsights}
            setShowInsights={setShowInsights}
        />

        <MarketSummary timeframe={timeframe} />

        <MarketChart
            timeframe={timeframe}
            showInsights={showInsights}
            onCrisisClick={handleCrisisClick}
        />

        {selectedCrisis && (
            <CrisisDetailModal
            crisis={selectedCrisis}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            />
        )}

        {/* --- NEU: Kontaktbereich unten auf der Marktseite --- */}
        <div className="mt-12 text-center">
            <h3 className="text-2xl font-serif text-[#1b251d] dark:text-gray-100 mb-4 leading-tight">
                {t.market.ctaTitle}
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
                {t.market.ctaDescription}
            </p>
            
            {/* Kontakt Button: Gelb und unauffälliger, wie in der Simulation gewünscht */}
            <Link href="/contact" className="inline-block" data-tour="market-contact-cta">
                <button 
                    // Angepasst, um dem Simulations-Button zu entsprechen: kleinere px/py, text-sm, font-medium, shadow-md
                    className="w-full sm:w-auto px-8 py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium shadow-md"
                >
                    {t.simulation.contactNow}
                </button>
            </Link>
            
            {/* Disclaimer am Ende der Marktseite (wiederhergestellt) */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 italic leading-relaxed max-w-3xl mx-auto">
                {t.simulation.disclaimer}
            </p>
        </div>
        {/* --- ENDE NEUER Kontaktbereich --- */}

        </div>
    </div>
  )
}