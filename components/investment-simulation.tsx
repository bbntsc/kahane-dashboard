"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Chart, registerables } from "chart.js"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

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

  const { language, theme } = useSettings()
  const t = useTranslation(language)

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

    const isDark = theme === "dark"
    const textColor = isDark ? "#f5f5f5" : "#374151"
    const gridColor = isDark ? "#4b5563" : "#e5e7eb"
    const bestCaseColor = isDark ? "#10b981" : "#4a5f52"
    const middleCaseColor = isDark ? "#3b82f6" : "#1b251d"
    const worstCaseColor = isDark ? "#f97316" : "#c7847d"

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: `${t.simulation.optimistic} (90%)`,
            data: bestCaseData,
            borderColor: bestCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            pointBackgroundColor: bestCaseColor,
            pointRadius: 5,
            pointBorderWidth: 2,
            pointBorderColor: isDark ? "#ffffff" : bestCaseColor,
            tension: 0.1,
          },
          {
            label: `${t.simulation.realistic} (50%)`,
            data: middleCaseData,
            borderColor: middleCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            pointBackgroundColor: middleCaseColor,
            pointRadius: 5,
            pointBorderWidth: 2,
            pointBorderColor: isDark ? "#ffffff" : middleCaseColor,
            tension: 0.1,
          },
          {
            label: `${t.simulation.cautious} (10%)`,
            data: worstCaseData,
            borderColor: worstCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            pointBackgroundColor: worstCaseColor,
            pointRadius: 5,
            pointBorderWidth: 2,
            pointBorderColor: isDark ? "#ffffff" : worstCaseColor,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: t.simulation.xAxisLabel,
              font: { size: 14, family: "Lora, Georgia, serif", weight: "bold" },
              color: textColor,
            },
            grid: { display: true, color: gridColor },
            ticks: { font: { size: 11 }, color: textColor },
          },
          y: {
            title: {
              display: true,
              text: t.simulation.yAxisLabel,
              font: { size: 14, family: "Lora, Georgia, serif", weight: "bold" },
              color: textColor,
            },
            grid: { display: true, color: gridColor },
            ticks: {
              callback: (value: any) => value.toFixed(1),
              font: { size: 11 },
              color: textColor,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [simulationResults, theme, t, language])

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-tour="page">
      <div className="lg:col-span-4 space-y-6" data-tour="sliders">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#ede9e1] dark:border-gray-600">
          <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100 mb-3">{t.simulation.benchmark}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setBenchmark("MSCI")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                benchmark === "MSCI"
                  ? "bg-[#1b251d] dark:bg-gray-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-[#1b251d] dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {t.simulation.msciWorld}
            </button>
            <button
              onClick={() => setBenchmark("SP500")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                benchmark === "SP500"
                  ? "bg-[#1b251d] dark:bg-gray-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-[#1b251d] dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {t.simulation.sp500}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100">
                {t.simulation.initialInvestment}
              </h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={initialInput}
              onChange={handleInitialInputChange}
              className="w-32 px-3 py-1 text-sm text-right border border-[#ede9e1] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{formatCurrency(initialInvestment)}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100">
                {t.simulation.monthlyInvestment}
              </h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={monthlyInput}
              onChange={handleMonthlyInputChange}
              className="w-32 px-3 py-1 text-sm text-right border border-[#ede9e1] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{formatCurrency(monthlyInvestment)}</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100">{t.simulation.stockPercentage}</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={stockInput}
                onChange={handleStockInputChange}
                className="w-20 px-3 py-1 text-sm text-right border border-[#ede9e1] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
              <span className="text-sm text-gray-600 dark:text-gray-100">%</span>
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
              <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100">
                {t.simulation.investmentHorizon}
              </h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={horizonInput}
                onChange={handleHorizonInputChange}
                className="w-20 px-3 py-1 text-sm text-right border border-[#ede9e1] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="5"
              />
              <span className="text-sm text-gray-600 dark:text-gray-100">{t.simulation.years}</span>
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
          <button className="w-full py-3 bg-[#ebf151] text-[#1b251d] rounded-full hover:bg-[#d9df47] transition-colors text-sm font-medium mt-8 shadow-md">
            {t.simulation.contactNow}
          </button>
        </Link>
      </div>

      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between" data-tour="chart">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#4a5f52]"></div>
              <span className="text-sm text-gray-700 dark:text-gray-100">{t.simulation.optimistic} (90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1b251d]"></div>
              <span className="text-sm text-gray-700 dark:text-gray-100">{t.simulation.realistic} (50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#c7847d]"></div>
              <span className="text-sm text-gray-700 dark:text-gray-100">{t.simulation.cautious} (10%)</span>
            </div>
          </div>
          <div className="text-lg font-serif italic text-gray-400 dark:text-gray-100">Kahane</div>
        </div>

        <div className="h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
          <canvas ref={chartRef} />
        </div>

        <div className="grid grid-cols-4 gap-4" data-tour="summary">
          <div className="bg-[#1b251d] dark:bg-gray-600 rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">{t.simulation.totalInvestment}</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.totalInvestment)}</div>
          </div>
          <div className="bg-[#1b251d] dark:bg-gray-600 rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">{t.simulation.totalReturn}</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.totalReturn)}</div>
          </div>
          <div className="bg-[#1b251d] dark:bg-gray-600 rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">{t.simulation.finalValue}</div>
            <div className="text-xl font-medium">{formatCurrency(simulationResults.summary.finalValue)}</div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 text-[#1b251d] dark:text-gray-100">
            <div className="text-xs mb-1 opacity-80">{t.simulation.expectedYield}</div>
            <div className="text-xl font-medium">{simulationResults.summary.yield.toFixed(2)}%</div>
          </div>
        </div>

        {/* --- NEU: Kompakter CTA Block hier eingefügt --- */}
        <div
          className="mt-8 bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm"
          data-tour="cta-simulation-link" // data-tour Attribut für den Guide
        >
          <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-2 leading-tight">
                {t.simulation.ctaTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Neugierig, wie sich Ihr Portfolio durch historische Krisen und Aufschwünge entwickelt hätte?
              </p>
            </div>
            <Link href="/market" className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              <button className="w-full sm:w-auto px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center justify-center gap-2 shadow-md">
                {t.simulation.ctaButton}
                <span className="text-lg">→</span>
              </button>
            </Link>
          </div>
        </div>
        {/* --- ENDE NEUER CTA Block --- */}

      </div>
    </div>
  )
}