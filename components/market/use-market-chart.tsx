"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { crises, calculatePortfolioHistory, type Crisis } from "@/components/market/market-data"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useInvestment } from "@/lib/investment-context" // NEU

Chart.register(...registerables)

// Hilfsfunktion zum Zeichnen der Krisen-Marker (angepasst für Währungswerte)
function drawCrisisMarkers(chart: Chart, filteredCrises: Crisis[], years: number[]) {
  const ctx = chart.ctx
  const yAxis = chart.scales.y
  const meta = chart.getDatasetMeta(0)

  filteredCrises.forEach((crisis) => {
    const yearIndex = years.findIndex((y) => y === crisis.year)
    if (yearIndex === -1) return

    const point = meta.data[yearIndex]
    if (!point) return

    const xPos = point.x
    const yPos = point.y

    // Roter Punkt
    ctx.beginPath()
    ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#e57373"
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Gestrichelte Linie nach unten
    ctx.beginPath()
    ctx.moveTo(xPos, yAxis.bottom)
    ctx.lineTo(xPos, yPos + 6)
    ctx.strokeStyle = "rgba(229, 115, 115, 0.5)"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.stroke()
    ctx.setLineDash([])

    // Name der Krise (nur wenn genug Platz ist, einfache Logik)
    // Optional: Man könnte dies weglassen, wenn es zu voll wird
  })
}

export function useMarketChart(
  chartRef: React.RefObject<HTMLCanvasElement | null>,
  timeframe: string, // Wird eigentlich durch investmentHorizon überschrieben, aber wir lassen es als Prop
  showInsights: boolean,
  onCrisisClick: (crisis: Crisis) => void,
) {
  const chartInstance = useRef<Chart | null>(null)
  const { language, theme } = useSettings()
  const t = useTranslation(language)
  
  // NEU: Werte aus dem Context holen
  const { 
    initialInvestment, 
    monthlyInvestment, 
    stockPercentage, 
    investmentHorizon 
  } = useInvestment()

  const isDark = theme === "dark"
  const textColor = isDark ? "#f5f5f5" : "#374151"
  const gridColor = isDark ? "#4b5563" : "#e5e7eb"

  // Währungsformatierer
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      notation: val > 1000000 ? "compact" : "standard",
      maximumFractionDigits: 1
    }).format(val)
  }

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // 1. Zeitraum definieren basierend auf dem Regler
    const currentYear = 2025
    // Wir nutzen hier den echten investmentHorizon aus dem Context
    const horizon = investmentHorizon || 40 
    const startYear = currentYear - horizon

    // 2. Daten berechnen
    const portfolioData = calculatePortfolioHistory(
      initialInvestment,
      monthlyInvestment,
      stockPercentage,
      startYear,
      currentYear
    )

    const years = portfolioData.map((d) => d.year)
    const values = portfolioData.map((d) => d.value)

    // 3. Krisen filtern
    const filteredCrises = crises.filter((crisis) => {
      return crisis.year >= startYear && crisis.year <= currentYear
    })

    // 4. Chart erstellen
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Portfolio Wert",
            data: values,
            borderColor: isDark ? "#f8f3ef" : "#1b251d",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              if (isDark) {
                gradient.addColorStop(0, "rgba(248, 243, 239, 0.2)");
                gradient.addColorStop(1, "rgba(248, 243, 239, 0)");
              } else {
                gradient.addColorStop(0, "rgba(27, 37, 29, 0.2)");
                gradient.addColorStop(1, "rgba(27, 37, 29, 0)");
              }
              return gradient;
            },
            borderWidth: 2,
            pointRadius: 0, // Punkte nur bei Hover oder Krisen
            pointHoverRadius: 6,
            pointHitRadius: 10,
            tension: 0.4, // Weiche Kurve
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements, chart) => {
          if (!showInsights) return
          // ... (Klick-Logik bleibt ähnlich, prüfen auf Nähe zu Krisenjahren)
          const clickX = event.x;
          const meta = chart.getDatasetMeta(0);
          const xScale = chart.scales.x;
          
          // Finde den nächstgelegenen Datenpunkt basierend auf X-Position
          const index = xScale.getValueForPixel(clickX);
          if (index !== undefined && index >= 0 && index < years.length) {
             const yearClicked = years[index];
             const crisis = filteredCrises.find(c => c.year === yearClicked);
             if (crisis) {
                 onCrisisClick(crisis);
             }
          }
        },
        scales: {
          x: {
            grid: { display: false, color: gridColor }, // Vertikale Linien aus für cleaneren Look
            ticks: {
              font: { size: 11 },
              color: textColor,
              maxRotation: 0,
              callback: (value, index) => {
                const year = years[index]
                // Zeige nur jedes 5. Jahr oder Start/Ende
                if (index === 0 || index === years.length - 1 || year % 5 === 0) return year
                return ""
              },
            },
          },
          y: {
            grid: { display: true, color: gridColor, drawBorder: false },
            ticks: { 
                font: { size: 11 }, 
                color: textColor,
                callback: (value) => formatCurrency(Number(value)) 
            },
            title: {
              display: false, // Label sparen wir uns, Währung ist selbsterklärend
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: isDark ? "#1f2937" : "rgba(255, 255, 255, 0.95)",
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context) => `Portfolio: ${formatCurrency(context.parsed.y)}`,
              title: (items) => `Jahr ${items[0].label}`
            },
          },
        },
      },
      plugins: [
        {
          id: "crisisMarkers",
          afterDatasetsDraw: (chart) => {
            if (showInsights) {
              drawCrisisMarkers(chart, filteredCrises, years)
            }
          },
        },
      ],
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartRef, initialInvestment, monthlyInvestment, stockPercentage, investmentHorizon, showInsights, onCrisisClick, language, theme, isDark, textColor, gridColor]) // Dependencies aktualisiert
}