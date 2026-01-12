"use client"

import { useRef, useEffect } from "react"
import { Chart, registerables } from "chart.js"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

Chart.register(...registerables)

interface SimulationChartProps {
  data: {
    years: number[]
    bestCaseData: number[]
    middleCaseData: number[]
    worstCaseData: number[]
  }
  isClient: boolean
}

export function SimulationChart({ data, isClient }: SimulationChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { theme, language } = useSettings()
  const t = useTranslation(language)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'de' ? "de-DE" : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Hilfsfunktion für den Tooltip-Titel
  const getTooltipTitle = (yearLabel: string) => {
    if (yearLabel === "0") {
        return language === "de" ? "Start" : "Start"
    }
    
    if (language === "de") return `Nach ${yearLabel} Jahren`
    if (language === "en") return `After ${yearLabel} years`
    if (language === "fr") return `Après ${yearLabel} ans`
    if (language === "it") return `Dopo ${yearLabel} anni`
    
    return `${yearLabel} ${t.simulation.years}`
  }

  useEffect(() => {
    if (!chartRef.current || !isClient) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"
    const textColor = isDark ? "#f5f5f5" : "#374151"
    const gridColor = isDark ? "#4b5563" : "#e5e7eb"
    const bestCaseColor = isDark ? "#10b981" : "#4a5f52"
    const middleCaseColor = isDark ? "#3b82f6" : "#1b251d"
    const worstCaseColor = isDark ? "#f97316" : "#c7847d"

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.years,
        datasets: [
          {
            label: t.simulation.optimistic,
            data: data.bestCaseData,
            borderColor: bestCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            // PUNKTE AKTIVIERT
            pointRadius: 4, 
            pointHoverRadius: 6,
            pointBackgroundColor: bestCaseColor,
            pointBorderColor: isDark ? "#ffffff" : bestCaseColor,
            pointBorderWidth: 1,
            tension: 0.1,
          },
          {
            label: t.simulation.realistic,
            data: data.middleCaseData,
            borderColor: middleCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            // PUNKTE AKTIVIERT
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: middleCaseColor,
            pointBorderColor: isDark ? "#ffffff" : middleCaseColor,
            pointBorderWidth: 1,
            tension: 0.1,
          },
          {
            label: t.simulation.cautious,
            data: data.worstCaseData,
            borderColor: worstCaseColor,
            backgroundColor: "transparent",
            borderWidth: 3,
            // PUNKTE AKTIVIERT
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: worstCaseColor,
            pointBorderColor: isDark ? "#ffffff" : worstCaseColor,
            pointBorderWidth: 1,
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
            callbacks: {
              // TITEL ANGEPASST: "Nach X Jahren"
              title: (tooltipItems) => getTooltipTitle(tooltipItems[0].label),
              label: (context) => {
                return `${context.dataset.label}: ${formatCurrency(context.parsed.y * 1000000)}`
              },
            },
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
  }, [data, theme, t, isClient, language])

  return (
    <div className="h-[374px] bg-white dark:bg-gray-800 rounded-lg p-4 mb-6" data-tour="chart-container">
      <canvas ref={chartRef} />
    </div>
  )
}