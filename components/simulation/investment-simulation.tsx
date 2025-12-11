"use client"

import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useSimulation } from "./use-simulation"
import { SimulationChart } from "./simulation-chart"
import { SimulationControl } from "./simulation-control"

export function InvestmentSimulation() {
  const { language } = useSettings()
  const t = useTranslation(language)
  
  // Hook liefert keine Benchmark-Werte mehr zurück
  const { values, setters, results, isClient } = useSimulation()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'de' ? "de-DE" : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: "currency", currency: "EUR", maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-tour="page">
      
      {/* --- LINKE SPALTE: CONTROLS --- */}
      <div className="lg:col-span-4 space-y-6 relative" data-tour="sliders">
        
        {/* HIER WURDE DER BENCHMARK-SWITCH ENTFERNT */}

        <SimulationControl 
            label={t.simulation.initialInvestment} 
            value={values.initialInvestment} 
            onChange={setters.setInitialInvestment} 
            min={1000} max={1000000} step={1000} 
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

        <Link href="/contact">
          <button className="w-full py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium mt-8 shadow-md">
            {t.simulation.contactNow}
          </button>
        </Link>
      </div>

      {/* --- RECHTE SPALTE: CHART & SUMMARY --- */}
      <div className="lg:col-span-8">
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

        {/* Summary Grid */}
        <div className="grid grid-cols-4 gap-4" data-tour="summary">
          <SummaryCard label={t.simulation.totalInvestment} value={formatCurrency(results.summary.totalInvestment)} />
          <SummaryCard label={t.simulation.totalReturn} value={formatCurrency(results.summary.totalReturn)} />
          <SummaryCard label={t.simulation.finalValue} value={formatCurrency(results.summary.finalValue)} />
          <SummaryCard label={t.simulation.expectedYield} value={`${results.summary.yield.toFixed(2)}%`} light />
        </div>

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

// Interne Helper für sauberes JSX
function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${color}`}></div>
            <span className="text-sm text-gray-700 dark:text-gray-100">{label}</span>
        </div>
    )
}

function SummaryCard({ label, value, light = false }: { label: string, value: string, light?: boolean }) {
    return (
        <div className={`${light ? 'bg-gray-200 dark:bg-gray-700 text-[#1b251d] dark:text-gray-100' : 'bg-[#1b251d] dark:bg-gray-600 text-white'} rounded-lg p-4`}>
            <div className="text-xs mb-1 opacity-80">{label}</div>
            <div className="text-xl font-medium">{value}</div>
        </div>
    )
}