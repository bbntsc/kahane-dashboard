"use client"

import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useSimulation } from "@/components/hooks/use-simulation"
import { SimulationChart } from "./simulation-chart"
import { SimulationControl } from "../input_cockpit/simulation-control"
import { PortfolioPieChart } from "../input_cockpit/portfolio-pie-chart"

export function InvestmentSimulation() {
  const { language } = useSettings()
  const t = useTranslation(language)
  
  const { values, setters, results, isClient } = useSimulation()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'de' ? "de-DE" : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: "currency", currency: "EUR", maximumFractionDigits: 0,
    }).format(value)
  }

  // Berechnung des absoluten Gewinns
  const totalProfit = results.summary.finalValue - results.summary.totalInvestment

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-tour="page">
      
      {/* --- LINKE SPALTE: CONTROLS --- */}
      <div className="lg:col-span-4 space-y-6 relative" data-tour="sliders">
        
        <SimulationControl 
            label={t.simulation.initialInvestment} 
            value={values.initialInvestment} 
            onChange={setters.setInitialInvestment} 
            min={400000} max={5000000} step={25000} 
            isCurrency={true}
        />
        <SimulationControl 
            label={t.simulation.monthlyInvestment} 
            value={values.monthlyInvestment} 
            onChange={setters.setMonthlyInvestment} 
            min={0} max={10000} step={100}
            isCurrency={true} 
        />
        <SimulationControl 
            label={t.simulation.stockPercentage} 
            value={values.stockPercentage} 
            onChange={setters.setStockPercentage} 
            min={0} max={100} step={5} 
            unit="%"
        />
        <SimulationControl 
            label={t.simulation.investmentHorizon} 
            value={values.investmentHorizon} 
            onChange={setters.setInvestmentHorizon} 
            min={5} max={40} step={1} 
            unit={t.simulation.years}
        />
        
        <div className="pt-4"> 
          <PortfolioPieChart stockPercentage={values.stockPercentage} />
        </div>

      </div>

      {/* --- RECHTE SPALTE: CHART & SUMMARY --- */}
      <div className="lg:col-span-8 flex flex-col h-full">
        
        {/* NEU: ZUSAMMENFASSUNG (BIG NUMBER) ÜBER DEM GRAPHEN */}
        <div className="mb-8 mt-2" data-tour="summary">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
                {t.simulation.finalValue}
            </h3>
            
            {/* Der große Betrag - Serif Font für den edlen Look */}
            <div className="text-5xl md:text-6xl font-serif text-[#1b251d] dark:text-gray-100 tracking-tight font-medium">
                {formatCurrency(results.summary.finalValue)}
            </div>

            {/* Die grüne Unterzeile: Gewinn & Rendite */}
            <div className="flex items-center gap-2 mt-3 text-lg flex-wrap">
                <span className="text-[#15803d] font-bold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                    {/* Absoluter Gewinn */}
                    <span>+{formatCurrency(totalProfit)}</span>
                    
                    {/* Prozentuale Rendite (p.a.) */}
                    <span className="ml-1">
                        ({results.summary.yield.toFixed(2)}%)
                    </span>
                </span>
                
                <span className="text-gray-400 mx-1 hidden sm:inline">•</span>
                
                <span className="text-[#1b251d] dark:text-gray-300 font-serif text-base">
                    Rendite p.a.
                </span>
            </div>
        </div>

        {/* Legend */}
        <div className="mb-4 flex items-center justify-between" data-tour="chart">
          <div className="flex items-center gap-6">
            <LegendItem color="bg-[#4a5f52]" label={t.simulation.optimistic} />
            <LegendItem color="bg-[#1b251d]" label={t.simulation.realistic} />
            <LegendItem color="bg-[#c7847d]" label={t.simulation.cautious} />
          </div>
        </div>

        {/* Chart */}
        <SimulationChart data={results.chartData} isClient={isClient} />

        {/* CTA */}
        <div className="mt-8 bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm" data-tour="cta-simulation-link">
          <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-2 leading-tight">{t.simulation.ctaTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.simulation.ctaDescription}</p>
            </div>
            <Link href="/market" className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              <button className="w-full sm:w-auto px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center justify-center gap-2 shadow-md">
                {t.simulation.ctaButton} <span className="text-lg">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${color}`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-100">{label}</span>
        </div>
    )
}