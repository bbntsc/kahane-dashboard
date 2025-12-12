"use client"

import * as React from "react" 
import { useState, useEffect, useMemo } from "react" 
import { InvestmentSimulation } from "./investment-simulation"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import Link from "next/link"


interface SimulationContextProps {
  onLogoClickForTutorial: (() => void) | undefined
}

export const SimulationContext = React.createContext<SimulationContextProps>({
    onLogoClickForTutorial: undefined,
}); 

function SimulationApp() {
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleLogoClickForHeader = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('startConciergeIntro'));
    }
  }

  const contextValue = useMemo(() => ({
    onLogoClickForTutorial: handleLogoClickForHeader
  }), []);

  return (
    <SimulationContext.Provider value={contextValue}>
        
        <main className="mx-auto max-w-7xl px-4 py-8"> {/* Padding angepasst an Market App */}
            
            {/* NEUER HEADER MIT BUTTON */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">{t.simulation.title}</h1>
                    <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{t.simulation.subtitle}</p> 
                </div>

                {/* Button oben rechts */}
                <Link href="/contact">
                    <button className="px-10 py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium shadow-md whitespace-nowrap">
                        {t.simulation.contactNow}
                    </button>
                </Link>
            </div>
            
            <InvestmentSimulation /> 
        </main>
        
    </SimulationContext.Provider>
  )
}

export default SimulationApp;