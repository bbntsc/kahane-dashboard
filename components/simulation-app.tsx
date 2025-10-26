"use client"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { TutorialModal } from "@/components/tutorial-modal"
import { InvestmentSimulation } from "@/components/investment-simulation"
import { MarketView } from "@/components/market-view"

export function SimulationApp() {
  const [showTutorial, setShowTutorial] = useState(true)
  const [activeTab, setActiveTab] = useState<"tutorial" | "simulation" | "market">("simulation")

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      <BankGutmannHeader />

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("tutorial")}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${
              activeTab === "tutorial" ? "bg-[#668273] text-white" : "bg-white text-[#1b251d] hover:bg-gray-100"
            }`}
          >
            Tutorial
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${
              activeTab === "simulation" ? "bg-[#668273] text-white" : "bg-white text-[#1b251d] hover:bg-gray-100"
            }`}
          >
            Vermögenssimulation
          </button>
          <button
            onClick={() => setActiveTab("market")}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${
              activeTab === "market" ? "bg-[#668273] text-white" : "bg-white text-[#1b251d] hover:bg-gray-100"
            }`}
          >
            Ein Blick in den Markt
          </button>
        </div>

        {/* Content */}
        {activeTab === "simulation" && <InvestmentSimulation />}
        {activeTab === "market" && <MarketView />}
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
