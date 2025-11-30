"use client"

import { useSettings } from "@/lib/settings-context" // NEU
import { useTranslation } from "@/lib/i18n" // NEU

interface MarketSummaryProps {
  timeframe: string
}

export function MarketSummary({ timeframe }: MarketSummaryProps) {
  const { language } = useSettings()
  const t = useTranslation(language)
  
  // HINWEIS: Diese Daten sind statisch. Für eine dynamische Berechnung
  // müsste hier die Logik ergänzt werden, die die Daten filtert.
  // Die statischen Beispieltexte wurden beibehalten, aber die Überschriften lokalisiert.
  return (
    // 'relative' Klasse hinzugefügt, um Stapelkontext für die Hervorhebung zu definieren
    <div 
        className="mb-4 rounded-md bg-gray-100 dark:bg-gray-800 p-4 relative" 
        data-tour="market-summary"
    > 
      {/* Überschrift für die Zusammenfassung auf text-xl gesetzt (etwas kleiner als die Hauptüberschrift) */}
      <h4 className="mb-2 text-xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">
        {t.market.historicalView}: {timeframe} {t.market.years}
      </h4>
      {/* Die darunter liegenden Texte auf text-sm reduziert und Dark Mode Farben angepasst */}
      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
        {/* Statischer Beispieltext */}
        <p>Jährliche Extremwerte im Zeitraum:</p>
        <p>{t.market.maxLoss}: -53% (2008, Finanzkrise)</p>
        <p>{t.market.maxGain}: +33.8% (2003, nach Dotcom-Blase)</p>
      </div>
      {/* Hervorgehobene Rendite auf font-serif und text-lg umgestellt (etwas prominenter) */}
      <div className="mt-2 text-lg font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">
        {t.market.averageReturn}: <span className="text-[#1b251d] dark:text-[#f8f3ef] font-bold">8.6%</span>
      </div>
    </div>
  )
}