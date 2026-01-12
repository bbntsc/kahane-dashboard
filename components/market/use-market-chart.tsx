"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { crises, calculatePortfolioHistory, type Crisis } from "@/components/market/market-data" 
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { useInvestment } from "@/lib/investment-context" 

Chart.register(...registerables)

// Hilfsfunktion zum Zeichnen der Krisen-Marker (Bubbles) - MIT KRISENNAME IN BOX
function drawCrisisMarkers(chart: Chart, filteredCrises: Crisis[], years: number[]) {
  const ctx = chart.ctx
  const yAxis = chart.scales.y
  const meta = chart.getDatasetMeta(0)

  if (!meta || !meta.data || meta.data.length === 0) return;

  filteredCrises.forEach((crisis) => {
    const yearIndex = years.findIndex((y) => y === crisis.year)
    if (yearIndex === -1) return

    const point = meta.data[yearIndex]
    if (!point) return

    const xPos = point.x
    const yPos = point.y

    // --- 1. Roter Punkt (Bubble) und gestrichelte Linie ---
    
    // Gestrichelte Linie nach unten
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xPos, yAxis.bottom);
    ctx.lineTo(xPos, yPos + 6);
    ctx.strokeStyle = "rgba(229, 115, 115, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.restore();

    // Roter Punkt
    ctx.save(); 
    ctx.beginPath();
    ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#e57373"; // Rot-Ton
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore(); 

    // --- 2. KRISENNAME ALS TEXT IN UMGEBENDER BOX ---
    
    ctx.save();
    
    // Einstellungen für den Text
    ctx.font = '10px sans-serif'; 
    const text = crisis.name.toUpperCase(); // Text in Großbuchstaben
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const padding = 8;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 20; 
    
    // Position der Box
    const boxX = xPos - boxWidth / 2;
    const boxY = yPos - 15 - boxHeight; 
    const boxRadius = 4;

    // Box zeichnen
    ctx.fillStyle = '#FAF0E6'; 
    
    ctx.beginPath();
    ctx.moveTo(boxX + boxRadius, boxY);
    ctx.lineTo(boxX + boxWidth - boxRadius, boxY);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + boxRadius);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - boxRadius);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - boxRadius, boxY + boxHeight);
    ctx.lineTo(boxX + boxRadius, boxY + boxHeight);
    ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - boxRadius);
    ctx.lineTo(boxX, boxY + boxRadius);
    ctx.quadraticCurveTo(boxX, boxY, boxX + boxRadius, boxY);
    ctx.closePath();
    ctx.fill();
    
    // Text zeichnen
    ctx.fillStyle = '#1b251d'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, xPos, boxY + boxHeight / 2);
    
    // Kleiner Pfeil nach unten zur Bubble
    ctx.fillStyle = '#FAF0C4';
    ctx.beginPath();
    ctx.moveTo(xPos - 4, boxY + boxHeight);
    ctx.lineTo(xPos + 4, boxY + boxHeight);
    ctx.lineTo(xPos, boxY + boxHeight + 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  })
}

export function useMarketChart(
  chartRef: React.RefObject<HTMLCanvasElement | null>,
  timeframe: string, 
  showInsights: boolean, 
  onCrisisClick: (crisis: Crisis) => void,
) {
  const chartInstance = useRef<Chart | null>(null)
  const { language, theme } = useSettings()
  const t = useTranslation(language)
  
  const { 
    initialInvestment, 
    monthlyInvestment, 
    stockPercentage, 
    investmentHorizon 
  } = useInvestment()

  const isDark = theme === "dark"
  const textColor = isDark ? "#f5f5f5" : "#374151"
  const gridColor = isDark ? "#4b5563" : "#e5e7eb"

  // KORREKTUR: Nutzt 'en-US' für Punkt statt Komma und Notation 'standard' für ausgeschriebene Werte
  const formatCurrencyForTicks = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      notation: "standard",
      maximumFractionDigits: 0 
    }).format(val)
  }

  // Für das Tooltip nutzen wir ebenfalls 'en-US' für den Dezimalpunkt
  const formatCurrencyForTooltip = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      notation: "standard", 
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

    const currentYear = 2025
    const horizon = investmentHorizon || 40 
    const startYear = currentYear - horizon
    const numberOfYears = currentYear - startYear + 1;

    const portfolioData = calculatePortfolioHistory(
      initialInvestment,
      monthlyInvestment,
      stockPercentage,
      startYear,
      currentYear
    )

    const years = portfolioData.map((d) => d.year)
    const values = portfolioData.map((d) => d.value) 

    const filteredCrises = crises.filter((crisis) => {
      return crisis.year >= startYear && crisis.year <= currentYear
    })

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
            pointRadius: 0, 
            pointHoverRadius: 6,
            pointHitRadius: 10,
            tension: 0.4, 
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30, 
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        onClick: (event, elements, chart) => {
          if (!showInsights) return 
          
          const clickX = event.x;
          const xScale = chart.scales.x;
          
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
            grid: { display: false, color: gridColor }, 
            type: 'category', 
            ticks: {
              font: { size: 11 },
              color: textColor,
              maxRotation: 0,
              source: 'labels', 
              autoSkip: true, 
              maxTicksLimit: Math.min(20, Math.ceil(numberOfYears / 5) * 2), 
            },
            title: {
              display: true, 
              text: t.simulation.xAxisLabel, 
              color: textColor,
              font: { size: 12, weight: 'bold' },
              padding: { top: 8, bottom: 0 }
            }
          },
          y: {
            grid: { display: true, color: gridColor, drawBorder: false },
            ticks: { 
                font: { size: 11 }, 
                color: textColor,
                callback: (value) => formatCurrencyForTicks(Number(value)) 
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
              label: (context) => `Portfolio: ${formatCurrencyForTooltip(context.parsed.y)}`, 
              title: (items) => `${t.simulation.xAxisLabel} ${items[0].label}`
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
  }, [chartRef, initialInvestment, monthlyInvestment, stockPercentage, investmentHorizon, showInsights, onCrisisClick, language, theme, isDark, textColor, gridColor, t.simulation.xAxisLabel]) 
}