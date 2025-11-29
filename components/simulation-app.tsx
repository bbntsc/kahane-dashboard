// components/simulation-app.tsx

"use client"

import * as React from "react" 
import { useState, useEffect, useMemo } from "react" 
// TutorialModal und TourGuide sind entfernt, da sie in DashboardLayout verwaltet werden
import { InvestmentSimulation } from "@/components/investment-simulation"
import { useSettings } from "@/lib/settings-context" // Hinzugefügt, falls benötigt
import { useTranslation } from "@/lib/i18n" // Hinzugefügt, falls benötigt


// NEU: Context Definition (bleibt, um Logo-Klick aus dem Header zu ermöglichen)
interface SimulationContextProps {
  onLogoClickForTutorial: (() => void) | undefined
}
export const SimulationContext = React.createContext<SimulationContextProps>({
    onLogoClickForTutorial: undefined,
}); 
// Die Logik für TUTORIAL_SEEN_KEY wurde in den ConciergeController verschoben.

export function SimulationApp() {
  
  // DIESER CONTEXT SOLLTE JETZT VOM PERSISTENTEN LAYOUT GELIEFERT WERDEN.
  // Da die SimulationApp selbst keinen Zustand mehr verwaltet, brauchen wir hier nur den Platzhalter.
  const handleLogoClickForHeader = () => {
    // Da die Logik jetzt im DashboardLayout ist, feuern wir ein custom Event.
    // Das Layout muss dieses Event abhören, um die Tour zu starten/zeigen.
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('startConciergeIntro'));
    }
  }

  // Memoisiert den Context-Wert
  const contextValue = useMemo(() => ({
    onLogoClickForTutorial: handleLogoClickForHeader
  }), []);


  return (
    // Umschließe den Inhalt mit dem Context Provider, um die Funktion bereitzustellen
    <SimulationContext.Provider value={contextValue}>
        {/* KEIN <div className="min-h-screen bg-[#f8f3ef]"> mehr nötig, da im DashboardLayout */}
        
            {/* HIER MUSS NUR NOCH DER SIMULATIONSINHALT STEHEN */}
            <main className="mx-auto max-w-7xl px-6 py-6">
                <InvestmentSimulation /> 
                {/* Tutorial und TourGuide wurden entfernt */}
            </main>
        
    </SimulationContext.Provider>
  )
}