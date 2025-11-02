"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { TutorialModal } from "@/components/tutorial-modal"
import { InvestmentSimulation } from "@/components/investment-simulation"

export function SimulationApp() {
  const [showTutorial, setShowTutorial] = useState(true)
  const [activeTab, setActiveTab] = useState<"tutorial" | "simulation" | "market">("simulation")

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      <BankGutmannHeader />

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Content */}
        {activeTab === "simulation" && <InvestmentSimulation />}
        {activeTab === "tutorial" && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif text-[#1b251d] mb-4">Tutorial</h2>
            <p className="text-gray-600">Tutorial-Inhalte werden hier angezeigt...</p>
          </div>
        )}
      </main>
    </div>
  )
}
