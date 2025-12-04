// kahane-dashboard-concierge 9/components/market-app.tsx
"use client"

import { useState } from "react"
// import { BankGutmannHeader } from "@/components/bank-gutmann-header" <-- LÖSCHEN
import { MarketControls } from "./market/market-controls" 
import { MarketSummary } from "./market/market-summary" 
import { MarketChart } from "./market/market-chart" 
// KORREKTUR: Absoluter Importpfad (Alias) verwenden, da die Komponente auf der Root-Ebene von /components liegt
import { CrisisDetailModal } from "@/components/crisis-detail-modal" 
import { type Crisis } from "./market/market-data" 
import Link from "next/link" 
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 

export function MarketApp() {
  const [timeframe, setTimeframe] = useState<"40" | "30" | "20" | "10" | "5">("40")
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  const { language } = useSettings()
  const t = useTranslation(language)

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  return (
    // Hintergrundfarbe entfernt, da Aufgabe des Layouts
    <div data-tour="market-page"> 
        
        <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* Globale Überschrift und Untertitel (lokalisiert) */}
        <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">{t.market.title}</h1>
            <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{t.market.subtitle}</p>
        </div>
        
        <MarketControls
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            showInsights={showInsights}
            setShowInsights={setShowInsights}
        />

        <MarketSummary timeframe={timeframe} />

        <MarketChart
            timeframe={timeframe}
            showInsights={showInsights}
            onCrisisClick={handleCrisisClick}
        />

        {selectedCrisis && (
            <CrisisDetailModal
            crisis={selectedCrisis}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            />
        )}

        {/* --- CTA / Kontakt Bereich (Spiegelt das 2-Spalten-Layout der Simulation) --- */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* BLOCK LINKS: Primärer Kontakt-CTA ("Jetzt kontaktieren" Button) */}
            <div 
                // Style kopiert von Simulation's CTA box, aber hier als linker Block
                className="bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm flex flex-col justify-between"
            >
                
                <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-6 leading-tight">
                    {t.market.ctaTitle} {/* "Bereit, Ihre Anlagestrategie zu besprechen?" */}
                </h3>
                
                {/* Linker, Gelber "Jetzt kontaktieren" Button */}
                <Link href="/contact" className="inline-block w-full" data-tour="market-contact-button">
                    <button 
                        className="w-full px-8 py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium shadow-md"
                    >
                        {t.simulation.contactNow}
                    </button>
                </Link>

            </div>

            {/* BLOCK RECHTS: Sekundär-CTA Box ("Zurück zur Simulation") - MIT TEXT */}
            <div 
              className="bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm"
              data-tour="market-secondary-cta" 
            >
              {/* Kopiert die Struktur der CTA Box der Simulation */}
              <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
                
                {/* Textbereich kopiert die H3 und P Tags der Simulation CTA */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-2 leading-tight">
                    {t.simulation.ctaTitle} {/* "Wie hätte sich Ihre Investition in der Vergangenheit verhalten?" */}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.simulation.ctaDescription} {/* "Neugierig, wie sich Ihr Portfolio..." */}
                  </p>
                </div>
                
                {/* Rechter, Sekundär-Button: Zurück zur Simulation */}
                <Link href="/simulation" className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <button 
                    // Grüner Sekundär-Stil, um Konsistenz mit der Simulation zu wahren
                    className="w-full sm:w-auto px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center justify-center gap-2 shadow-md"
                  >
                    Zurück zur Simulation
                    <span className="text-lg ml-2">→</span>
                  </button>
                </Link>
              </div>
            </div>
        </div>
        {/* --- ENDE CTA / Kontakt Bereich --- */}

        {/* Disclaimer (zentriert für das Ende des Inhalts) */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 italic leading-relaxed max-w-3xl mx-auto text-center">
            {t.simulation.disclaimer}
        </p>

        </div>
    </div>
  )
}