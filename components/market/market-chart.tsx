// bbntsc/kahane-dashboard/kahane-dashboard-concierge/components/market/market-chart.tsx
"use client"

import { useRef } from "react"
import { type Crisis } from "@/components/market/market-data" // NEU
import { useMarketChart } from "@/components/market/use-market-chart" // NEU

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
  
  // Der Hook enthält die gesamte Chart.js-Logik (aus dem alten useEffect)
  useMarketChart(chartRef, timeframe, showInsights, onCrisisClick)

  return (
    <div 
        className="relative h-[400px] rounded-lg border border-gray-200 bg-white p-4"
        data-tour="market-chart" // NEU: data-tour="market-chart"
    > 
      <div className="absolute right-4 top-4 flex items-center space-x-2">
        <div className="text-sm font-medium text-gray-900">100% Aktienquote (MSCI World)</div>
        <div className="text-xs text-gray-500">Einblick: {timeframe} Jahre</div>
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}