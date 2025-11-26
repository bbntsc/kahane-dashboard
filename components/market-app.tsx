"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { MarketControls } from "./market/market-controls"
import { MarketSummary } from "./market/market-summary"
import { MarketChart } from "./market/market-chart"
import { CrisisDetailModal } from "./crisis-detail-modal"
import { ConciergeBell } from "@/components/concierge-bell"
import { ConciergeHelpModal } from "@/components/concierge-help-modal"
import type { Crisis } from "./market/market-data"

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

        {selectedCrisis && (
          <CrisisDetailModal crisis={selectedCrisis} isOpen={showModal} onClose={() => setShowModal(false)} />
        )}
      </div>

      <ConciergeBell onHelp={() => setShowHelp(true)} />
    </div>
  )
}
