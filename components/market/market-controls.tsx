"use client"

import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/lib/settings-context" // NEU
import { useTranslation } from "@/lib/i18n" // NEU

// Definiert, welche Props die Komponente empfängt
interface MarketControlsProps {
  timeframe: "40" | "30" | "20" | "10" | "5"
  setTimeframe: (tf: "40" | "30" | "20" | "10" | "5") => void
  showInsights: boolean
  setShowInsights: (show: boolean) => void
}

export function MarketControls({
  timeframe,
  setTimeframe,
  showInsights,
  setShowInsights,
}: MarketControlsProps) {
  const { language } = useSettings()
  const t = useTranslation(language)

  return (
    <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      {/* Timeframe-Buttons */}
      <div data-tour="market-horizon" className="relative">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t.market.controlsTitle}</h3>
        <div className="mt-2 flex space-x-2">
          {["40", "30", "20", "10", "5"].map((years) => (
            <button
              key={years}
              onClick={() => setTimeframe(years as "40" | "30" | "20" | "10" | "5")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                timeframe === years
                  ? "bg-[#1b251d] text-white dark:bg-[#668273]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {years}
            </button>
          ))}
        </div>
      </div>

      {/* Insights-Switch */}
      <div className="flex items-center space-x-4 relative" data-tour="market-insights">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.market.insightToggle}</span>
        <Switch checked={showInsights} onCheckedChange={setShowInsights} />
      </div>
    </div>
  )
}