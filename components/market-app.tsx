"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { MarketControls } from "./market/market-controls"
import { MarketSummary } from "./market/market-summary"
import { MarketChart } from "./market/market-chart"
import { CrisisDetailModal } from "./crisis-detail-modal"
import { ConciergeHelpModal } from "@/components/concierge-help-modal"
import type { Crisis } from "./market/market-data"
import Link from "next/link"

export function MarketApp() {
  const [timeframe, setTimeframe] = useState<"40" | "30" | "20" | "10" | "5">("40")
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      <BankGutmannHeader />

      {showHelp && <ConciergeHelpModal context="market" onClose={() => setShowHelp(false)} />}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <MarketControls
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          showInsights={showInsights}
          setShowInsights={setShowInsights}
        />

        <MarketSummary timeframe={timeframe} />

        <MarketChart timeframe={timeframe} showInsights={showInsights} onCrisisClick={handleCrisisClick} />

        <div className="mt-8 bg-white rounded-xl p-6 border border-[#ede9e1] shadow-sm">
          <h3 className="text-xl font-serif text-[#1b251d] mb-2">Bereit, Ihre Anlagestrategie zu besprechen?</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Unsere Experten helfen Ihnen, eine maßgeschneiderte Strategie zu entwickeln.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center gap-2 shadow-sm">
              Jetzt kontaktieren
            </button>
          </Link>
        </div>

        {selectedCrisis && (
          <CrisisDetailModal crisis={selectedCrisis} isOpen={showModal} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  )
}
