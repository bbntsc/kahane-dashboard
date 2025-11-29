// HIER WIRD NUR DAS ÄUSSERE LAYOUT VERWALTET

"use client"

import { useState, useMemo } from "react"
import type React from "react" 
import { Sidebar } from "@/components/sidebar"
// Importiere den neuen Concierge Controller
import { ConciergeController } from "@/components/concierge-guide" 
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { Menu, X } from "lucide-react"

// WICHTIG: Import des Contextes von der SimulationApp
import { SimulationContext } from "@/components/simulation-app" 

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Die Funktion zum manuellen Start der Tour wird nun direkt in der Sidebar verwendet, 
  // muss aber das Event auslösen, das der ConciergeController abhört.
  const openConciergeIntro = () => {
    setSidebarOpen(false); // Sidebar schließen
    if (typeof window !== 'undefined') {
        // Event um die vollständige Tour zu starten (z.B. durch Logo-Klick)
        window.dispatchEvent(new CustomEvent('startConciergeIntro'));
    }
  }
  
  // Die Funktion für den On-Demand Help Bell Klick
  const openConciergeHelp = () => {
    if (typeof window !== 'undefined') {
        // Event, das den kontextspezifischen Tour-Start im Controller auslöst
        window.dispatchEvent(new CustomEvent('bellClick')); 
    }
  }


  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      
      {/* NEU: Der Controller läuft IMMER im Hintergrund */}
      <ConciergeController />

      {/* MOBILE SIDEBAR ... */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`fixed inset-y-0 left-0 w-64 bg-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
           <div className="h-full relative">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="absolute top-4 right-4 text-gray-500 z-10 lg:hidden hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
              {/* Verwenden Sie den Handler, der das Event für den kontextsensitiven Start auslöst */}
              <Sidebar onConciergeClick={openConciergeHelp} /> 
           </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR ... */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {/* Verwenden Sie den Handler, der das Event für den kontextsensitiven Start auslöst */}
        <Sidebar onConciergeClick={openConciergeHelp} /> 
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* HIER WIRD DER CONTEXT KONSUMIERT */}
        <SimulationContext.Consumer>
          {({ onLogoClickForTutorial }) => (
            <BankGutmannHeader 
              // Der Logo-Klick-Handler löst das Event zum Start der Intro-Tour aus
              onLogoClick={openConciergeIntro} 
            />
          )}
        </SimulationContext.Consumer>

        {/* Mobile Header für Sidebar-Trigger (bleibt für Mobile-Navigation wichtig) */}
        <div className="lg:hidden flex items-center p-4 border-b border-[#ede9e1] bg-white sticky top-0 z-40">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-900">
                <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 font-bold text-lg font-serif text-[#1b251d]">Kahane</span>
        </div>

        {/* Seiteninhalt */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
            {children}
        </main>
      </div>
    </div>
  )
}