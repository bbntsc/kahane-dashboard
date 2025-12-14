"use client"

import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useInvestment } from "@/lib/investment-context" 
import { calculateScenarioStatistics, getCrisisName } from "./market-data" // IMPORTS KORRIGIERT
import { useMemo } from "react"

// Interface Props können entfernt werden, da wir Context nutzen, 
// aber wir lassen timeframe für Kompatibilität drin, falls nötig.
interface MarketSummaryProps {
  timeframe: string 
}

export function MarketSummary({ timeframe }: MarketSummaryProps) {
  const { language, theme } = useSettings() // Theme holen für dynamische Farben
  const t = useTranslation(language)
  
  // Werte aus dem Context holen (Live-Daten der Regler)
  const { stockPercentage, investmentHorizon } = useInvestment()

  // Statistiken live berechnen, wenn sich Regler ändern
  const stats = useMemo(() => {
    return calculateScenarioStatistics(stockPercentage, investmentHorizon);
  }, [stockPercentage, investmentHorizon]);

  // Namen für die Jahre finden (z.B. "Finanzkrise")
  const lossEventName = getCrisisName(stats.maxDrawdownYear);
  // Bei Gewinnen ist es oft einfach "Erholung nach X", wir lassen es generisch oder prüfen auf Vorjahr
  const gainEventName = getCrisisName(stats.maxGainYear - 1) ? `nach ${getCrisisName(stats.maxGainYear - 1)}` : null;

  // Formatierung für Prozentzahlen
  const formatPct = (val: number) => {
    return val.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + "%";
  }

  // Dynamische Farbe für die Rendite (Grün/Rot)
  const returnColor = stats.averageReturn >= 0 
    ? (theme === 'dark' ? "text-emerald-400" : "text-emerald-700")
    : "text-red-500";

  return (
    <div 
        className="mb-4 rounded-xl border border-[#ede9e1] dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm relative transition-all duration-300" 
        data-tour="market-summary"
    > 
      {/* Header */}
      <h4 className="mb-4 text-lg font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">
        {t.market.historicalView}: {investmentHorizon} {t.market.years}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Linke Seite: Durchschnittliche Rendite (Groß) */}
        <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 pb-4 md:pb-0">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.market.averageReturn}
            </span>
            <div className={`text-4xl font-bold font-serif ${returnColor}`}>
                {stats.averageReturn > 0 && "+"}{formatPct(stats.averageReturn)}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Bei {stockPercentage}% Aktienquote
            </span>
        </div>

        {/* Rechte Seite: Extremwerte */}
        <div className="space-y-4 flex flex-col justify-center pl-0 md:pl-4">
            
            {/* Maximaler Verlust */}
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.market.maxLoss}
                    </span>
                    <span className="text-base font-bold text-red-600 dark:text-red-400">
                        {formatPct(stats.maxDrawdown)}
                    </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Jahr: {stats.maxDrawdownYear} {lossEventName ? `(${lossEventName})` : ""}
                </div>
            </div>

            {/* Maximaler Gewinn */}
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.market.maxGain}
                    </span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatPct(stats.maxGain)}
                    </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Jahr: {stats.maxGainYear} {gainEventName ? `(${gainEventName})` : ""}
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}