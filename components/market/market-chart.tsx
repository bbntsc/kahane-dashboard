"use client"

import { useRef } from "react"
import { type Crisis } from "@/components/market/market-data" 
import { useMarketChart } from "@/components/market/use-market-chart" 
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useInvestment } from "@/lib/investment-context" 

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
  const { stockPercentage } = useInvestment() 

  // Hook nutzt jetzt intern den Context
  useMarketChart(chartRef, timeframe, showInsights, onCrisisClick)

  return (
    <div 
        // Höhe auf 450px erhöht, um mehr Platz für die Bubbles zu schaffen
        className="relative h-[450px] rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4"
        data-tour="market-chart" 
    > 
      {/* Das Aktienquoten-Label unten wurde entfernt */}
      
      <canvas ref={chartRef} />
    </div>
  )
}