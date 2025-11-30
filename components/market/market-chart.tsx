"use client"

import { useRef } from "react"
import { type Crisis } from "@/components/market/market-data" 
import { useMarketChart } from "@/components/market/use-market-chart" 
import { useSettings } from "@/lib/settings-context" // NEU
import { useTranslation } from "@/lib/i18n" // NEU

interface MarketChartProps {
  timeframe: "40" | "30" | "20" | "10" | "5"
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

  // Der Hook enthält die gesamte Chart.js-Logik (aus dem alten useEffect)
  useMarketChart(chartRef, timeframe, showInsights, onCrisisClick)

  return (
    <div 
        className="relative h-[400px] rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4"
        data-tour="market-chart" 
    > 
      <div className="absolute right-4 top-4 flex items-center space-x-2">
        {/* HIER WIRD ÜBERSETZT */}
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.market.indexLabel}</div> 
        <div className="text-xs text-gray-500 dark:text-gray-400">{t.market.viewLabel}{timeframe} {t.market.years}</div> {/* HIER WIRD ÜBERSETZT */}
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}