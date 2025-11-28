"use client"

import { useState } from "react"
import { TutorialModal } from "@/components/tutorial-modal"
import { InvestmentSimulation } from "@/components/investment-simulation"
import { TourGuide } from "@/components/tour-guide" // NEU: Importieren der TourGuide Komponente

export function SimulationApp() {
  const [showTutorial, setShowTutorial] = useState(true)
  const [activeTab, setActiveTab] = useState<"tutorial" | "simulation" | "market">("simulation")
  const [showGuidedTour, setShowGuidedTour] = useState(false) // NEU: State für die geführte Tour

  // NEU: Funktion, um die geführte Tour zu starten
  const handleStartGuidedTour = () => {
    setShowTutorial(false)
    setShowGuidedTour(true)
  }
  
  // NEU: Funktion, um die geführte Tour zu beenden
  const handleTourComplete = () => {
    setShowGuidedTour(false)
  }
  
  // Wenn der User auf "Selbst erkunden" klickt, wird das Modal geschlossen und die Tour nicht gestartet.
  const handleCloseTutorial = () => {
    setShowTutorial(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      {/* <BankGutmannHeader />  <-- LÖSCHEN: Dieser Header ist jetzt im DashboardLayout */}

      {/* Das TutorialModal startet entweder die geführte Tour oder schließt sich */}
      {showTutorial && (
        <TutorialModal 
          onClose={handleCloseTutorial} 
          onStartTour={handleStartGuidedTour} 
        />
      )}
      
      {/* NEU: Die TourGuide-Komponente wird nur gerendert, wenn showGuidedTour true ist */}
      <TourGuide isActive={showGuidedTour} onComplete={handleTourComplete} />

      <main className="mx-auto max-w-7xl px-6 py-6">
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