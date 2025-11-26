"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Chart, registerables } from "chart.js"
import Link from "next/link"

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

// Holt die Portfolio-Parameter basierend auf der Aktienquote und dem Benchmark
// Lineare Interpolation zwischen 100% Anleihen und 100% Aktien
function getPortfolioParams(equityPercentage: number, benchmark: "MSCI" | "SP500") {
  const benchmarkParams = {
    MSCI: { equityMean: 0.07, equityStdDev: 0.18 },
    SP500: { equityMean: 0.075, equityStdDev: 0.19 },
  }

  const { equityMean, equityStdDev } = benchmarkParams[benchmark]
  const bondMean = 0.02
  const bondStdDev = 0.04

  const mean = bondMean + (equityMean - bondMean) * equityPercentage
  const stdDev = bondStdDev + (equityStdDev - bondStdDev) * equityPercentage

  return { mean, stdDev }
}

// Die gesamte Monte-Carlo-Simulations-Engine
function runMonteCarloSimulation(
  initial: number,
  monthly: number,
  years: number,
  equityQuote: number,
  benchmark: "MSCI" | "SP500",
) {
  const { mean, stdDev } = getPortfolioParams(equityQuote / 100, benchmark)
  const yearlyContribution = monthly * 12

  // Speichert die Werte aller Simulationen für jedes Jahr
  // yearlyValues[jahr][simulation]
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
  const [benchmark, setBenchmark] = useState<"MSCI" | "SP500">("MSCI")

  const [initialInput, setInitialInput] = useState("500000")
  const [monthlyInput, setMonthlyInput] = useState("0")
  const [stockInput, setStockInput] = useState("0")
  const [horizonInput, setHorizonInput] = useState("5")

  const debouncedInitial = useDebounce(initialInvestment, 300)
  const debouncedMonthly = useDebounce(monthlyInvestment, 300)
  const debouncedStock = useDebounce(stockPercentage, 300)
  const debouncedHorizon = useDebounce(investmentHorizon, 300)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const simulationResults = useMemo(() => {
    return runMonteCarloSimulation(debouncedInitial, debouncedMonthly, debouncedHorizon, debouncedStock, benchmark)
  }, [debouncedInitial, debouncedMonthly, debouncedHorizon, debouncedStock, benchmark])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleInitialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setInitialInput(value)
    const numValue = Number.parseInt(value) || 0
    setInitialInvestment(Math.min(Math.max(numValue, 500000), 10000000))
  }

  const handleMonthlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setMonthlyInput(value)
    const numValue = Number.parseInt(value) || 0
    setMonthlyInvestment(Math.min(Math.max(numValue, 0), 50000))
  }

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setStockInput(value)
    const numValue = Number.parseInt(value) || 0
    setStockPercentage(Math.min(Math.max(numValue, 0), 100))
  }

  const handleHorizonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setHorizonInput(value)
    const numValue = Number.parseInt(value) || 5
    setInvestmentHorizon(Math.min(Math.max(numValue, 5), 30))
  }

  useEffect(() => {
    if (!chartRef.current) return
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const { years, bestCaseData, middleCaseData, worstCaseData } = simulationResults.chartData

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Optimistisch (90%)",
            data: bestCaseData,
            borderColor: "#4a5f52",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#4a5f52",
            pointRadius: 4,
            tension: 0.1,
          },
          {
            label: "Realistisch (50%)",
            data: middleCaseData,
            borderColor: "#1b251d",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#1b251d",
            pointRadius: 4,
            tension: 0.1,
          },
          {
            label: "Vorsichtig (10%)",
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
              text: "Jahr",
              font: { size: 14, family: "Arial", weight: "bold" },
            },
            grid: { display: true, color: "#f0f0f0" },
            ticks: { font: { size: 11 } },
          },
          y: {
            title: {
              display: true,
              text: "Portfolio-Wert (Mio. €)",
              font: { size: 14, family: "Arial", weight: "bold" },
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-tour="page">
      <div className="lg:col-span-4 space-y-6" data-tour="sliders">
        <div className="bg-white p-4 rounded-lg border border-[#ede9e1]">
          <h3 className="text-sm font-medium text-[#1b251d] mb-3">Benchmark wählen</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setBenchmark("MSCI")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                benchmark === "MSCI" ? "bg-[#1b251d] text-white" : "bg-gray-100 text-[#1b251d] hover:bg-gray-200"
              }`}
            >
              MSCI World
            </button>
            <button
              onClick={() => setBenchmark("SP500")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                benchmark === "SP500" ? "bg-[#1b251d] text-white" : "bg-gray-100 text-[#1b251d] hover:bg-gray-200"
              }`}
            >
              S&P 500
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">Veranlagungsbetrag</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={initialInput}
              onChange={handleInitialInputChange}
              className="w-32 px-3 py-1 text-sm text-right border border-[#ede9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
              placeholder="500000"
            />
          </div>
          <Slider
            value={[initialInvestment]}
            min={500000}
            max={10000000}
            step={50000}
            onValueChange={(value) => {
              setInitialInvestment(value[0])
              setInitialInput(value[0].toString())
            }}
            className="py-1"
          />
          <div className="text-xs text-gray-500 text-right">{formatCurrency(initialInvestment)}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">Monatliche Investition</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={monthlyInput}
              onChange={handleMonthlyInputChange}
              className="w-32 px-3 py-1 text-sm text-right border border-[#ede9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
              placeholder="0"
            />
          </div>
          <Slider
            value={[monthlyInvestment]}
            min={0}
            max={50000}
            step={1000}
            onValueChange={(value) => {
              setMonthlyInvestment(value[0])
              setMonthlyInput(value[0].toString())
            }}
            className="py-1"
          />
          <div className="text-xs text-gray-500 text-right">{formatCurrency(monthlyInvestment)}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">Aktienquote</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={stockInput}
                onChange={handleStockInputChange}
                className="w-20 px-3 py-1 text-sm text-right border border-[#ede9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                placeholder="0"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>
          <Slider
            value={[stockPercentage]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => {
              setStockPercentage(value[0])
              setStockInput(value[0].toString())
            }}
            className="py-1"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">Anlagehorizont</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={horizonInput}
                onChange={handleHorizonInputChange}
                className="w-20 px-3 py-1 text-sm text-right border border-[#ede9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                placeholder="5"
              />
              <span className="text-sm text-gray-600">Jahre</span>
            </div>
          </div>
          <Slider
            value={[investmentHorizon]}
            min={5}
            max={30}
            step={5}
            onValueChange={(value) => {
              setInvestmentHorizon(value[0])
              setHorizonInput(value[0].toString())
            }}
            className="py-1"
          />
        </div>

        <Link href="/contact">
          <button className="w-full py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium mt-8">
            Jetzt kontaktieren
          </button>
        </Link>
      </div>

      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between" data-tour="chart">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#4a5f52]"></div>
              <span className="text-sm text-gray-700">Optimistisch (90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1b251d]"></div>
              <span className="text-sm text-gray-700">Realistisch (50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#c7847d]"></div>
              <span className="text-sm text-gray-700">Vorsichtig (10%)</span>
            </div>
          </div>
          <div className="text-lg font-serif italic text-gray-400">Kahane</div>
        </div>

        <div className="h-[300px] bg-white rounded-lg p-4 mb-6">
          <canvas ref={chartRef} />
        </div>

        <div className="grid grid-cols-4 gap-4" data-tour="summary">
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Totales Investment:</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.totalInvestment)}</div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Gesamtertrag (Mitte):</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.totalReturn)}</div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Finaler Wert (Mitte):</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.finalValue)}</div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 text-[#1b251d]">
            <div className="text-xs mb-1 opacity-80">Erw. Rendite p.a.:</div>
            <div className="text-xl font-medium">{simulationResults.summary.yield.toFixed(2)}%</div>
          </div>
        </div>

        <div
          className="mt-8 bg-gradient-to-r from-[#1b251d] to-[#2a3529] rounded-xl p-6 text-white shadow-lg"
          data-tour="cta"
        >
          <h3 className="text-xl font-serif mb-2">Wie hätte sich Ihre Investition in der Vergangenheit verhalten?</h3>
          <p className="text-sm opacity-90 mb-4">
            Entdecken Sie, wie sich Ihr Portfolio durch historische Krisen und Aufschwünge entwickelt hätte.
          </p>
          <Link href="/market">
            <button className="w-full py-3 bg-[#ebf151] text-[#1b251d] rounded-lg hover:bg-[#d9df47] transition-colors font-medium">
              Blick in den Markt →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
