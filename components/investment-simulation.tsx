"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

// Anzahl der Simulationen
const NUM_SIMULATIONS = 10000

// Custom Hook für das Debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Helferfunktion für normalverteilte Zufallszahlen
function getNormalRandom(mean: number, stdDev: number): number {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdDev + mean
}

// Portfolio Parameter
function getPortfolioParams(equityPercentage: number) {
  const equityMean = 0.07
  const equityStdDev = 0.18
  const bondMean = 0.02
  const bondStdDev = 0.04

  const mean =
    bondMean + (equityMean - bondMean) * equityPercentage
  const stdDev =
    bondStdDev + (equityStdDev - bondStdDev) * equityPercentage

  return { mean, stdDev }
}

// Monte-Carlo Simulation
function runMonteCarloSimulation(
  initial: number,
  monthly: number,
  years: number,
  equityQuote: number,
) {
  const { mean, stdDev } = getPortfolioParams(equityQuote / 100)
  const yearlyContribution = monthly * 12
  
  const yearlyValues: number[][] = Array(years + 1)
    .fill(0)
    .map(() => [])

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    yearlyValues[0][i] = initial
  }

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    let currentAmount = initial
    for (let j = 1; j <= years; j++) {
      const yearlyReturn = getNormalRandom(mean, stdDev)
      currentAmount = currentAmount * (1 + yearlyReturn) + yearlyContribution
      currentAmount = Math.max(0, currentAmount)
      yearlyValues[j][i] = currentAmount
    }
  }

  const labels = Array.from({ length: years + 1 }, (_, i) => i)
  const bestCaseData: number[] = []
  const middleCaseData: number[] = []
  const worstCaseData: number[] = []

  for (let j = 0; j <= years; j++) {
    const sortedYearValues = yearlyValues[j].sort((a, b) => a - b)
    worstCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.1)] / 1000000)
    middleCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.5)] / 1000000)
    bestCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.9)] / 1000000)
  }

  const finalMedianValue = middleCaseData[years] * 1000000
  const totalInvestment = initial + yearlyContribution * years
  const totalReturn = finalMedianValue - totalInvestment
  const simpleYield = mean * 100
  
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

  const debouncedInitial = useDebounce(initialInvestment, 300)
  const debouncedMonthly = useDebounce(monthlyInvestment, 300)
  const debouncedStock = useDebounce(stockPercentage, 300)
  const debouncedHorizon = useDebounce(investmentHorizon, 300)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

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

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

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
      {/* LINKE SPALTE: Slider */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Veranlagungsbetrag */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-[#1b251d]">
                Veranlagungsbetrag
              </h3>
              <Info className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {formatCurrency(initialInvestment)}
            </span>
          </div>
          <Slider
            value={[initialInvestment]}
            min={500000}
            max={10000000}
            step={50000}
            onValueChange={(value) => setInitialInvestment(value[0])}
            className="py-2"
          />
        </div>

        {/* Monatliche Investition */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-lg font-medium text-[#1b251d]">Monatliche Investition</h3>
               <Info className="h-5 w-5 text-gray-400" />
             </div>
             <span className="text-lg font-semibold text-gray-700">{formatCurrency(monthlyInvestment)}</span>
           </div>
           <Slider
             value={[monthlyInvestment]}
             min={0}
             max={50000}
             step={1000}
             onValueChange={(value) => setMonthlyInvestment(value[0])}
             className="py-2"
           />
         </div>

        {/* Aktienquote */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-lg font-medium text-[#1b251d]">Aktienquote</h3>
               <Info className="h-5 w-5 text-gray-400" />
             </div>
             <span className="text-lg font-semibold text-gray-700">{stockPercentage}%</span>
           </div>
           <Slider
             value={[stockPercentage]}
             min={0}
             max={100}
             step={5}
             onValueChange={(value) => setStockPercentage(value[0])}
             className="py-2"
           />
         </div>

        {/* Anlagehorizont */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <h3 className="text-lg font-medium text-[#1b251d]">Anlagehorizont</h3>
               <Info className="h-5 w-5 text-gray-400" />
             </div>
             <span className="text-lg font-semibold text-gray-700">{investmentHorizon} Jahre</span>
           </div>
           <Slider
             value={[investmentHorizon]}
             min={5}
             max={30}
             step={5}
             onValueChange={(value) => setInvestmentHorizon(value[0])}
             className="py-2"
           />
         </div>

        <button className="w-full py-4 text-base bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors font-semibold mt-10 shadow-sm">
          Jetzt kontaktieren
        </button>
      </div>

      {/* RECHTE SPALTE: Chart & Boxen */}
      <div className="lg:col-span-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#4a5f52]"></div>
              <span className="text-sm font-medium text-gray-700">Best Case (90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1b251d]"></div>
              <span className="text-sm font-medium text-gray-700">Middle Case (50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#c7847d]"></div>
              <span className="text-sm font-medium text-gray-700">Worst Case (10%)</span>
            </div>
          </div>
          <div className="text-xl font-serif italic text-gray-400">Kahane</div>
        </div>

        <div className="h-[400px] bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
          <canvas ref={chartRef} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1b251d] rounded-xl p-5 text-white shadow-md">
            <div className="text-sm mb-2 opacity-80 font-medium">Totales Investment:</div>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(simulationResults.summary.totalInvestment)}
            </div>
          </div>
          <div className="bg-[#1b251d] rounded-xl p-5 text-white shadow-md">
            <div className="text-sm mb-2 opacity-80 font-medium">Gesamtertrag (Median):</div>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(simulationResults.summary.totalReturn)}
            </div>
          </div>
          <div className="bg-[#1b251d] rounded-xl p-5 text-white shadow-md">
            <div className="text-sm mb-2 opacity-80 font-medium">Finaler Wert (Median):</div>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(simulationResults.summary.finalValue)}
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-5 text-[#1b251d] border border-gray-200">
            <div className="text-sm mb-2 opacity-80 font-medium">Erw. Rendite p.a.:</div>
            <div className="text-2xl font-bold tracking-tight">
              {simulationResults.summary.yield.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}