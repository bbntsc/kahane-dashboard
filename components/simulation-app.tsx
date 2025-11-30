"use client"

import * as React from "react" 
import { useState, useEffect, useMemo } from "react" 
import { InvestmentSimulation } from "@/components/investment-simulation"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 


// NEU: Context Definition (bleibt, um Logo-Klick aus dem Header zu ermöglichen)
interface SimulationContextProps {
  onLogoClickForTutorial: (() => void) | undefined
}
// KORREKTUR: SimulationContext bleibt ein benannter Export
export const SimulationContext = React.createContext<SimulationContextProps>({
    onLogoClickForTutorial: undefined,
}); 

// KORREKTUR: Die Hauptkomponente wird nun zum Default Export
function SimulationApp() {
  
  // Hinzugefügt, um Übersetzungen zu nutzen
  const { language } = useSettings()
  const t = useTranslation(language)

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
        
        <main className="mx-auto max-w-7xl px-6 py-6">
            
            {/* NEU: Globale Überschrift für die Simulationsseite (lokalisiert) */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">{t.simulation.title}</h1>
                <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{t.simulation.subtitle}</p> 
            </div>
            
            <InvestmentSimulation /> 
            {/* Tutorial und TourGuide wurden entfernt */}
        </main>
        
    </SimulationContext.Provider>
  )
}

// KORREKTUR: Exportiere SimulationApp als Standard-Export, wie von Next.js erwartet
export default SimulationApp;