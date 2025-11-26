"use client"

interface MarketSummaryProps {
  timeframe: string
}

export function MarketSummary({ timeframe }: MarketSummaryProps) {
  // HINWEIS: Diese Daten sind statisch. Für eine dynamische Berechnung
  // müsste hier die Logik ergänzt werden, die die Daten filtert.
  return (
    <div className="mb-4 rounded-md bg-gray-100 p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-900">
        Historische Betrachtung: {timeframe} Jahre
      </h4>
      <div className="space-y-1 text-xs text-gray-700">
        <p>Jährliche Extremwerte im Zeitraum:</p>
        <p>Maximaler Verlust: -53% (2008, Finanzkrise)</p>
        <p>Maximaler Gewinn: +33.8% (2003, nach Dotcom-Blase)</p>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-900">
        Durchschnittliche Rendite p.a.: <span className="text-[#1b251d]">8.6%</span>
      </div>
    </div>
  )
}
