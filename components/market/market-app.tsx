"use client"

import { useState } from "react"
import { MarketSummary } from "./market-summary" 
import { MarketChart } from "./market-chart" 
import { CrisisDetailModal } from "./crisis-detail-modal" 
import { type Crisis } from "./market-data" 
import Link from "next/link" 
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import { SimulationControl } from "@/components/input_cockpit/simulation-control" 
import { PortfolioPieChart } from "@/components/input_cockpit/portfolio-pie-chart" 
import { useInvestment } from "@/lib/investment-context" 

export function MarketApp() {
  const { 
    initialInvestment, setInitialInvestment,
    monthlyInvestment, setMonthlyInvestment,
    stockPercentage, setStockPercentage,
    investmentHorizon, setInvestmentHorizon
  } = useInvestment()
  
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  // Hilfsfunktion: Konvertiert die Zahl des Sliders in den String-Typ für den Chart
  const getTimeframeString = (years: number): "40" | "30" | "20" | "10" | "5" => {
    if (years >= 35) return "40";
    if (years >= 25) return "30";
    if (years >= 15) return "20";
    if (years >= 8) return "10";
    return "5";
  }

  const timeframeString = getTimeframeString(investmentHorizon);

  return (
    <div data-tour="market-page"> 
        
        <div className="mx-auto max-w-7xl px-4 py-8">
        
            {/* --- NEUER HEADER BEREICH --- */}
            {/* Flexbox sorgt dafür, dass Titel links und Button rechts stehen */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">{t.market.title}</h1>
                    <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{t.market.subtitle}</p>
                </div>

                {/* Button oben rechts positioniert */}
                <Link href="/contact">
                    <button className="px-10 py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium shadow-md whitespace-nowrap">
                        {t.simulation.contactNow}
                    </button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                {/* --- LINKE SPALTE: CONTROLS --- */}
                <div className="lg:col-span-4 space-y-6 relative" data-tour="market-horizon">
                    
                    <SimulationControl 
                        label={t.simulation.initialInvestment} 
                        value={initialInvestment} 
                        onChange={setInitialInvestment} 
                        min={400000} max={5000000} step={25000} 
                        isCurrency={true}
                    />

                    <SimulationControl 
                        label={t.simulation.monthlyInvestment} 
                        value={monthlyInvestment} 
                        onChange={setMonthlyInvestment} 
                        min={0} max={10000} step={100}
                        isCurrency={true} 
                    />

                    <SimulationControl 
                        label={t.simulation.stockPercentage} 
                        value={stockPercentage} 
                        onChange={setStockPercentage} 
                        min={0} max={100} step={5} 
                        unit="%"
                    />

                    <SimulationControl 
                        label={t.simulation.investmentHorizon} 
                        value={investmentHorizon} 
                        onChange={setInvestmentHorizon} 
                        min={5} max={40} step={1} 
                        unit={t.simulation.years}
                    />

                    <div className="pt-4">
                      <PortfolioPieChart stockPercentage={stockPercentage} />
                    </div>

                    {/* HINWEIS: Der Button wurde hier entfernt, da er jetzt oben ist */}
                </div>

                {/* --- RECHTE SPALTE: CHART & SUMMARY --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    <div className="space-y-4">
                        <MarketChart
                            timeframe={timeframeString}
                            showInsights={true} 
                            onCrisisClick={handleCrisisClick}
                        />
                        
                        <MarketSummary timeframe={timeframeString} />
                    </div>

                    {/* CTA Box (Rechts unten) */}
                    <div 
                        className="bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm"
                        data-tour="market-contact-cta"
                    >
                        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-2 leading-tight">
                                    {t.simulation.ctaTitle}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {t.simulation.ctaDescription}
                                </p>
                            </div>
                            
                            <Link href="/simulation" className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                                <button className="w-full sm:w-auto px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center justify-center gap-2 shadow-md">
                                    Zurück zur Simulation <span className="text-lg">→</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic text-center lg:text-left">
                        {t.simulation.disclaimer}
                    </p>
                </div>
            </div>

            {selectedCrisis && (
                <CrisisDetailModal
                crisis={selectedCrisis}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                />
            )}
        </div>
    </div>
  )
}