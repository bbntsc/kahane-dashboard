"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { MarketControls } from "./market/market-controls" // NEU
import { MarketSummary } from "./market/market-summary" // NEU
import { MarketChart } from "./market/market-chart" // NEU
import { CrisisDetailModal } from "./crisis-detail-modal"
import { type Crisis } from "./market/market-data" // NEU

export function MarketApp() {
  // --- STATES ---
  // Diese States steuern die gesamte App
  const [timeframe, setTimeframe] = useState<"40" | "30" | "20" | "10" | "5">("40")
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  // --- HANDLER ---
  // Wird vom Chart aufgerufen, wenn auf eine Krise geklickt wird
  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  // --- RENDER ---
  // Baut die Seite aus den importierten Komponenten zusammen
  return (
    <div className="min-h-screen bg-[#f8f3ef]">
        <BankGutmannHeader />
        <div className="mx-auto max-w-7xl px-4 py-8">
        {/* 1. Steuerungselemente (Buttons & Switch) */}
        <MarketControls
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            showInsights={showInsights}
            setShowInsights={setShowInsights}
        />

        {/* 2. Zusammenfassungs-Box */}
        <MarketSummary timeframe={timeframe} />

        {/* 3. Das interaktive Chart */}
        <MarketChart
            timeframe={timeframe}
            showInsights={showInsights}
            onCrisisClick={handleCrisisClick}
        />

        {/* 4. Das Modal (erscheint nur bei Bedarf) */}
        {selectedCrisis && (
            <CrisisDetailModal
            crisis={selectedCrisis}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            />
        )}
        </div>
    </div>
  )
}
