"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function InvestmentSimulation() {
  const [initialInvestment, setInitialInvestment] = useState(500000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(0)
  const [stockPercentage, setStockPercentage] = useState(0)
  const [investmentHorizon, setInvestmentHorizon] = useState(5)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const calculateResults = () => {
    const years = investmentHorizon
    const monthlyContribution = monthlyInvestment
    const initialAmount = initialInvestment
    const equityPercentage = stockPercentage / 100

    const bestCaseReturn = 0.08 + equityPercentage * 0.04
    const middleCaseReturn = 0.05 + equityPercentage * 0.03
    const worstCaseReturn = 0.02 + equityPercentage * 0.01

    let bestCaseFinal = initialAmount
    let middleCaseFinal = initialAmount
    let worstCaseFinal = initialAmount

    const totalContributions = initialAmount + monthlyContribution * 12 * years

    for (let i = 0; i < years; i++) {
      const yearlyContribution = monthlyContribution * 12
      bestCaseFinal = bestCaseFinal * (1 + bestCaseReturn) + yearlyContribution
      middleCaseFinal = middleCaseFinal * (1 + middleCaseReturn) + yearlyContribution
      worstCaseFinal = worstCaseFinal * (1 + worstCaseReturn) + yearlyContribution
    }

    const middleCaseReturn_total = middleCaseFinal - totalContributions
    const middleCaseYield = ((middleCaseFinal / totalContributions) ** (1 / years) - 1) * 100

    return {
      totalInvestment: totalContributions,
      finalValue: middleCaseFinal,
      totalReturn: middleCaseReturn_total,
      yield: middleCaseYield,
    }
  }

  const results = calculateResults()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const generateChartData = () => {
    const years = Array.from({ length: investmentHorizon + 1 }, (_, i) => i)
    const bestCaseData = []
    const middleCaseData = []
    const worstCaseData = []

    bestCaseData.push(initialInvestment / 1000000)
    middleCaseData.push(initialInvestment / 1000000)
    worstCaseData.push(initialInvestment / 1000000)

    const equityPercentage = stockPercentage / 100
    const bestCaseReturn = 0.08 + equityPercentage * 0.04
    const middleCaseReturn = 0.05 + equityPercentage * 0.03
    const worstCaseReturn = 0.02 + equityPercentage * 0.01

    let bestCaseValue = initialInvestment
    let middleCaseValue = initialInvestment
    let worstCaseValue = initialInvestment

    for (let i = 1; i <= investmentHorizon; i++) {
      const yearlyContribution = monthlyInvestment * 12
      bestCaseValue = bestCaseValue * (1 + bestCaseReturn) + yearlyContribution
      middleCaseValue = middleCaseValue * (1 + middleCaseReturn) + yearlyContribution
      worstCaseValue = worstCaseValue * (1 + worstCaseReturn) + yearlyContribution

      bestCaseData.push(bestCaseValue / 1000000)
      middleCaseData.push(middleCaseValue / 1000000)
      worstCaseData.push(worstCaseValue / 1000000)
    }

    return { years, bestCaseData, middleCaseData, worstCaseData }
  }

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const { years, bestCaseData, middleCaseData, worstCaseData } = generateChartData()

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Best Case",
            data: bestCaseData,
            borderColor: "#4a5f52",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#4a5f52",
            pointRadius: 4,
            tension: 0.4,
          },
          {
            label: "Middle Case",
            data: middleCaseData,
            borderColor: "#1b251d",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#1b251d",
            pointRadius: 4,
            tension: 0.4,
          },
          {
            label: "Worst Case",
            data: worstCaseData,
            borderColor: "#c7847d",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointBackgroundColor: "#c7847d",
            pointRadius: 4,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
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
            ticks: { callback: (value) => value.toFixed(1), font: { size: 11 } },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [initialInvestment, monthlyInvestment, stockPercentage, investmentHorizon])

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#1b251d]">Veranlagungsbetrag</h3>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">{formatCurrency(initialInvestment)}</span>
          </div>
          <Slider
            value={[initialInvestment]}
            min={100000}
            max={10000000}
            step={10000}
            onValueChange={(value) => setInitialInvestment(value[0])}
            className="py-1"
          />
        </div>

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
              <span className="text-sm text-gray-700">Best Case</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#1b251d]"></div>
              <span className="text-sm text-gray-700">Middle Case</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#c7847d]"></div>
              <span className="text-sm text-gray-700">Worst Case</span>
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
            <div className="text-xl font-medium">{formatCurrency(results.totalInvestment)}</div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Gesamtertrag:</div>
            <div className="text-xl font-medium">{formatCurrency(results.totalReturn)}</div>
          </div>
          <div className="bg-[#1b251d] rounded-lg p-4 text-white">
            <div className="text-xs mb-1 opacity-80">Finaler Portfolio Wert:</div>
            <div className="text-xl font-medium">{formatCurrency(results.finalValue)}</div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 text-[#1b251d]">
            <div className="text-xs mb-1 opacity-80">Rendite:</div>
            <div className="text-xl font-medium">{results.yield.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
