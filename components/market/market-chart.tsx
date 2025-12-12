"use client"

import { useRef } from "react"
import { type Crisis } from "@/components/market/market-data" 
import { useMarketChart } from "@/components/market/use-market-chart" 
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useInvestment } from "@/lib/investment-context" // NEU

interface MarketChartProps {
  timeframe: string // Wird nur noch für UI Label genutzt
  showInsights: boolean
  onCrisisClick: (crisis: Crisis) => void
}

export function MarketChart({
  timeframe,
  showInsights,
  onCrisisClick,
}: MarketChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  
  const { language } = useSettings()
  const t = useTranslation(language)
  const { stockPercentage, investmentHorizon } = useInvestment() // NEU

  // Hook nutzt jetzt intern den Context
  useMarketChart(chartRef, timeframe, showInsights, onCrisisClick)

  return (
    <div 
        className="relative h-[400px] rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4"
        data-tour="market-chart" 
    > 
      <div className="absolute right-4 top-4 flex flex-col items-end pointer-events-none z-10">
        {/* Dynamisches Label basierend auf Aktienquote */}
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {stockPercentage}% {t.simulation.stockPercentage} (MSCI World Basis)
        </div> 
        <div className="text-xs text-gray-500 dark:text-gray-400">
            {t.market.viewLabel}{investmentHorizon} {t.market.years}
        </div>
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}