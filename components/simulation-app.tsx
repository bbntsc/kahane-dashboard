"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { InvestmentSimulation } from "@/components/investment-simulation"
import { ConciergeOverlay } from "@/components/concierge-overlay"
import { ConciergeBell } from "@/components/concierge-bell"
import { ConciergeHelpModal } from "@/components/concierge-help-modal"
import { TourGuide } from "@/components/tour-guide"

export function SimulationApp() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [isTourActive, setIsTourActive] = useState(false)

  const handleStartTour = () => {
    setShowWelcome(false)
    setIsTourActive(true)
  }

  const handleSelfGuided = () => {
    setShowWelcome(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      <BankGutmannHeader />

      {showWelcome && <ConciergeOverlay onStartGuided={handleStartTour} onStartSelfGuided={handleSelfGuided} />}

      {showHelp && <ConciergeHelpModal context="simulation" onClose={() => setShowHelp(false)} />}

      <TourGuide isActive={isTourActive} onComplete={() => setIsTourActive(false)} />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <InvestmentSimulation />
      </main>

      {!showWelcome && <ConciergeBell onHelp={() => setShowHelp(true)} />}
    </div>
  )
}
