// components/simulation-app.tsx

"use client"

import * as React from "react" 
import { useState, useEffect, useMemo } from "react" 
import { TutorialModal } from "@/components/tutorial-modal"
import { InvestmentSimulation } from "@/components/investment-simulation"
import { TourGuide } from "@/components/tour-guide" 

// NEU: Context Definition
interface SimulationContextProps {
  onLogoClickForTutorial: (() => void) | undefined
}
export const SimulationContext = React.createContext<SimulationContextProps>({
    onLogoClickForTutorial: undefined,
}); 

const TUTORIAL_SEEN_KEY = "kahane-simulation-tutorial-seen"

export function SimulationApp() {
  const [showTutorial, setShowTutorial] = useState(false) 
  const [activeTab, setActiveTab] = useState<"tutorial" | "simulation" | "market">("simulation")
  const [showGuidedTour, setShowGuidedTour] = useState(false) 

  // 1. Initiale Logik: Modal nur beim ersten Besuch (Session Storage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const tutorialSeen = sessionStorage.getItem(TUTORIAL_SEEN_KEY)
        if (!tutorialSeen) {
            setShowTutorial(true)
        }
    }
  }, [])
  
  // 2. Logo-Klick Handler: Öffnet das Modal explizit (Ihr Wunsch)
  const handleLogoClickForHeader = () => {
    if (showGuidedTour) {
      setShowGuidedTour(false)
    }
    setShowTutorial(true)
  }

  // Memoisiert den Context-Wert
  const contextValue = useMemo(() => ({
    onLogoClickForTutorial: handleLogoClickForHeader
  }), [showGuidedTour]);


  const handleStartGuidedTour = () => {
    setShowTutorial(false)
    setShowGuidedTour(true)
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
    }
  }
  
  const handleTourComplete = () => {
    setShowGuidedTour(false)
  }
  
  const handleCloseTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
    }
  }

  return (
    // Umschließe den Inhalt mit dem Context Provider, um die Funktion bereitzustellen
    <SimulationContext.Provider value={contextValue}>
        <div className="min-h-screen bg-[#f8f3ef]">
            {/* Das TutorialModal startet entweder die geführte Tour oder schließt sich */}
            {showTutorial && (
                <TutorialModal 
                onClose={handleCloseTutorial} 
                onStartTour={handleStartGuidedTour} 
                />
            )}
            
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
    </SimulationContext.Provider>
  )
}