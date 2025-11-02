"use client"

import { useState, useEffect, useRef, useMemo } from "react" // GEÄNDERT: useMemo hinzugefügt
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

// Anzahl der Simulationen
const NUM_SIMULATIONS = 10000

// Custom Hook für das Debouncing
// Dieser sorgt dafür, dass die Berechnung erst startet,
// nachdem der User den Regler 300ms nicht bewegt hat.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Helferfunktion für normalverteilte Zufallszahlen (Box-Muller-Transform)
// Erzeugt eine Zufallszahl basierend auf Mittelwert (mean) und Volatilität (stdDev)
function getNormalRandom(mean: number, stdDev: number): number {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random() // (0,1]
  while (v === 0) v = Math.random() // (0,1]
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  // z ist N(0, 1). Jetzt auf mean und stdDev skalieren.
  return z * stdDev + mean
}

//  Holt die Portfolio-Parameter basierend auf der Aktienquote
// Lineare Interpolation zwischen 100% Anleihen und 100% Aktien
function getPortfolioParams(equityPercentage: number) {
  const equityMean = 0.07 // Erw. Rendite Aktien (z.B. 7%)
  const equityStdDev = 0.18 // Volatilität Aktien (z.B. 18%)
  const bondMean = 0.02 // Erw. Rendite Anleihen (z.B. 2%)
  const bondStdDev = 0.04 // Volatilität Anleihen (z.B. 4%)

  const mean =
    bondMean + (equityMean - bondMean) * equityPercentage
  const stdDev =
    bondStdDev + (equityStdDev - bondStdDev) * equityPercentage

  return { mean, stdDev }
}

// Die gesamte Monte-Carlo-Simulations-Engine
function runMonteCarloSimulation(
  initial: number,
  monthly: number,
  years: number,
  equityQuote: number,
) {
  const { mean, stdDev } = getPortfolioParams(equityQuote / 100)
  const yearlyContribution = monthly * 12
  
  // Speichert die Werte aller Simulationen für jedes Jahr
  // yearlyValues[jahr][simulation]
  const yearlyValues: number[][] = Array(years + 1)
    .fill(0)
    .map(() => [])

  // Startwerte für Jahr 0
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    yearlyValues[0][i] = initial
  }

  // Simulations-Schleifen
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    let currentAmount = initial
    for (let j = 1; j <= years; j++) {
      const yearlyReturn = getNormalRandom(mean, stdDev)
      currentAmount = currentAmount * (1 + yearlyReturn) + yearlyContribution
      // Verhindern, dass der Wert negativ wird (Totalverlust ist das Minimum)
      currentAmount = Math.max(0, currentAmount)
      yearlyValues[j][i] = currentAmount
    }
  }

  // Perzentile berechnen
  const labels = Array.from({ length: years + 1 }, (_, i) => i)
  const bestCaseData: number[] = []
  const middleCaseData: number[] = []
  const worstCaseData: number[] = []

  for (let j = 0; j <= years; j++) {
    const sortedYearValues = yearlyValues[j].sort((a, b) => a - b)
    
    // 10. Perzentil (Worst Case)
    worstCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.1)] / 1000000)
    // 50. Perzentil (Middle Case / Median)
    middleCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.5)] / 1000000)
    // 90. Perzentil (Best Case)
    bestCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.9)] / 1000000)
  }

  // Summary-Werte (basierend auf dem Median/Middle Case)
  const finalMedianValue = middleCaseData[years] * 1000000
  const totalInvestment = initial + yearlyContribution * years
  const totalReturn = finalMedianValue - totalInvestment
  
  // CAGR (Compound Annual Growth Rate) für die Rendite-Box
  // (Diese Formel ist bei monatlichen Einzahlungen komplexer, 
  // wir können stattdessen einfach die erwartete Rendite 'mean' anzeigen)
  const simpleYield = mean * 100 // Zeigt die erwartete Rendite des Portfolios
  
  return {
    chartData: {
      years: labels,
      bestCaseData,
      middleCaseData,
      worstCaseData,
    },
    summary: {
      totalInvestment: totalInvestment,
      finalValue: finalMedianValue,
      totalReturn: totalReturn,
      yield: simpleYield,
    },
  }
}

export function InvestmentSimulation() {
  const [initialInvestment, setInitialInvestment] = useState(500000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(0)
  const [stockPercentage, setStockPercentage] = useState(0)
  const [investmentHorizon, setInvestmentHorizon] = useState(5)

  // Debounced-Werte erstellen
  // Diese Werte werden mit 300ms Verzögerung aktualisiert
  const debouncedInitial = useDebounce(initialInvestment, 300)
  const debouncedMonthly = useDebounce(monthlyInvestment, 300)
  const debouncedStock = useDebounce(stockPercentage, 300)
  const debouncedHorizon = useDebounce(investmentHorizon, 300)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  
  // Führt die Simulation nur aus, wenn sich einer der
  // *debounced* Werte ändert. Das Ergebnis wird gespeichert (memoized).
  const simulationResults = useMemo(() => {
    return runMonteCarloSimulation(
      debouncedInitial,
      debouncedMonthly,
      debouncedHorizon,
      debouncedStock,
    )
  }, [
    debouncedInitial,
    debouncedMonthly,
    debouncedHorizon,
    debouncedStock,
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Dieser useEffect ist nur noch für das Zeichnen
  // der Grafik zuständig. Die Datenberechnung passiert im useMemo.
  // Er wird ausgelöst, wenn sich 'simulationResults' ändert.
  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Daten aus simulationResults holen
    const { years, bestCaseData, middleCaseData, worstCaseData } =
      simulationResults.chartData

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Best Case (90. Perzentil)", 
            data: bestCaseData,
            borderColor: "#4a5f52",
            // ... restliche Chart-Styling-Optionen ...
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#4a5f52",
            pointRadius: 4,
            tension: 0.1, 
          },
          {
            label: "Middle Case (Median)", 
            data: middleCaseData,
            borderColor: "#1b251d",
            // ...
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#1b251d",
            pointRadius: 4,
            tension: 0.1,
          },
          {
            label: "Worst Case (10. Perzentil)", 
            data: worstCaseData,
            borderColor: "#c7847d",
            // ...
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#c7847d",
            pointRadius: 4,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Jahre",
              font: { size: 12, family: "Arial" },
            },
            grid: { display: true, color: "#f0f0f0" },
            ticks: { font: { size: 11 } },
          },
          y: {
            title: {
              display: true,
              text: "Vermögen (Mio. €)",
              font: { size: 12, family: "Arial" },
            },
            grid: { display: true, color: "#f0f0f0" },
            ticks: { callback: (value: any) => value.toFixed(1), font: { size: 11 } },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [simulationResults])

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* ... (Monatliche Investition Slider) ... */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">
                Veranlagungsbetrag
              </h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">
              {formatCurrency(initialInvestment)}
            </span>
          </div>
          <Slider
            value={[initialInvestment]}
            min={500000}
            max={10000000}
            step={50000}
            onValueChange={(value) => setInitialInvestment(value[0])}
            className="py-1"
          />
        </div>

        {/* ... (Monatliche Investition Slider) ... */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-sm font-medium text-[#1b251d]">Monatliche Investition</h3>
               <Info className="h-4 w-4 text-gray-400" />
             </div>
             <span className="text-sm text-gray-600">{formatCurrency(monthlyInvestment)}</span>
           </div>
           <Slider
             value={[monthlyInvestment]}
             min={0}
             max={50000}
             step={1000}
             onValueChange={(value) => setMonthlyInvestment(value[0])}
             className="py-1"
           />
         </div>

        {/* ... (Aktienquote Slider) ... */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-sm font-medium text-[#1b251d]">Aktienquote</h3>
               <Info className="h-4 w-4 text-gray-400" />
             </div>
             <span className="text-sm text-gray-600">{stockPercentage}%</span>
           </div>
           <Slider
             value={[stockPercentage]}
             min={0}
             max={100}
             step={5}
             onValueChange={(value) => setStockPercentage(value[0])}
             className="py-1"
           />
         </div>

        {/* ... (Anlagehorizont Slider) ... */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-sm font-medium text-[#1b251d]">Anlagehorizont</h3>
               <Info className="h-4 w-4 text-gray-400" />
             </div>
             <span className="text-sm text-gray-600">{investmentHorizon} Jahre</span>
           </div>
           <Slider
             value={[investmentHorizon]}
             min={5}
             max={30}
             step={5}
             onValueChange={(value) => setInvestmentHorizon(value[0])}
             className="py-1"
           />
         </div>

        <button className="w-full py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium mt-8">
          Jetzt kontaktieren
        </button>
      </div>

      {/* Right: Chart */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#4a5f52]"></div>
              <span className="text-sm text-gray-700">Best Case (90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1b251d]"></div>
              <span className="text-sm text-gray-700">Middle Case (50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#c7847d]"></div>
              <span className="text-sm text-gray-700">Worst Case (10%)</span>
            </div>
          </div>
          <div className="text-lg font-serif italic text-gray-400">Kahane</div>
        </div>

        <div className="h-[300px] bg-white rounded-lg p-4 mb-6">
          <canvas ref={chartRef} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Totales Investment:</div>
            <div className="text-xl font-medium">
              {formatCurrency(simulationResults.summary.totalInvestment)}
            </div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Gesamtertrag (Median):</div>
            <div className="text-xl font-medium">
              {formatCurrency(simulationResults.summary.totalReturn)}
            </div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Finaler Wert (Median):</div>
            <div className="text-xl font-medium">
              {formatCurrency(simulationResults.summary.finalValue)}
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 text-[#1b251d]">
            <div className="text-xs mb-1 opacity-80">Erw. Rendite p.a.:</div>
            <div className="text-xl font-medium">
              {simulationResults.summary.yield.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
