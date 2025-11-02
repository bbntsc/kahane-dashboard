"use client"

// 1. KORREKTUR: 'React' importiert
import React, { useEffect, useRef } from "react"
import { Chart, registerables, type ChartOptions } from "chart.js"
import { crises, baseMSCIData, type Crisis } from "@/components/market/market-data"

// Chart.js einmalig registrieren (Polyfill ist entfernt)
Chart.register(...registerables)

// 2. KORREKTUR: Die Zeichenlogik ist jetzt HIER drin
function drawCrisisMarkers(chart: Chart, filteredCrises: Crisis[], years: number[]) {
  const ctx = chart.ctx
  const xAxis = chart.scales.x
  const yAxis = chart.scales.y
  const meta = chart.getDatasetMeta(0)

  filteredCrises.forEach((crisis) => {
    const yearIndex = years.findIndex((y) => y === crisis.year)
    if (yearIndex === -1) return

    const point = meta.data[yearIndex]
    if (!point) return // Sicherstellen, dass der Punkt existiert
    
    const xPos = point.x
    const yPos = point.y

    // --- START: Das ist die Logik, die gefehlt hat ---

    // 1. Zeichne den roten Punkt
    ctx.beginPath()
    ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#e57373" // Ein Rot-Ton
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 2. Zeichne die vertikale gestrichelte Linie
    ctx.beginPath()
    ctx.moveTo(xPos, yAxis.bottom)
    ctx.lineTo(xPos, yPos + 6) // Bis zum Punkt
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3]) // Gestrichelte Linie
    ctx.stroke()
    ctx.setLineDash([]) // Strichlierung zurücksetzen

    // 3. Zeichne den Namen der Krise in einem Kasten
    const crisisName = crisis.name
    ctx.font = "bold 10px Arial" // Schriftart für Messung setzen
    const textWidth = ctx.measureText(crisisName).width + 10 // 5px padding links/rechts
    const textHeight = 20
    const boxX = xPos - textWidth / 2
    const boxY = yPos - 30 // 30px über dem Punkt

    // 3a. Hintergrund-Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1

    // Zeichne abgerundetes Rechteck ODER normales Rechteck (Fallback)
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, textWidth, textHeight, 4) // 4px Eckenradius
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillRect(boxX, boxY, textWidth, textHeight)
      ctx.strokeRect(boxX, boxY, textWidth, textHeight)
    }

    // 3b. Text
    ctx.fillStyle = "#1b251d" // Dunkle Schriftfarbe
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(crisisName, xPos, boxY + textHeight / 2)

    // 4. Zeichne die kurze Linie vom Punkt zum Kasten
    ctx.beginPath()
    ctx.moveTo(xPos, yPos - 6) // Vom Rand des roten Punkts
    ctx.lineTo(xPos, boxY + textHeight) // Zur Unterkante der Box
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1
    ctx.stroke()

    // --- ENDE: Fehlende Logik ---
  })
}


// --- DER CUSTOM HOOK ---
export function useMarketChart(
  // 3. KORREKTUR: Der Typ ist 'HTMLCanvasElement | null'
  chartRef: React.RefObject<HTMLCanvasElement | null>,
  timeframe: string,
  showInsights: boolean,
  onCrisisClick: (crisis: Crisis) => void,
) {
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // --- Daten filtern (unverändert) ---
    const currentYear = 2025
    const startYear = currentYear - Number.parseInt(timeframe)
    const msciData = baseMSCIData.filter((d) => d.year >= startYear)
    const years = msciData.map((d) => d.year)
    const values = msciData.map((d) => d.value)
    const filteredCrises = crises.filter((crisis) => {
      return crisis.year >= startYear && crisis.year <= currentYear
    })

    // --- Chart erstellen ---
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "MSCI World",
            data: values,
            borderColor: "#1b251d",
            backgroundColor: "rgba(27, 37, 29, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        
        // KORRIGIERTE onClick-Logik:
        // Wir verwenden die Pixel-Koordinaten des Klicks, nicht das 'elements'-Array.
        onClick: (event, elements, chart) => {
          if (!showInsights) return // Nur ausführen, wenn Insights an sind

          const clickX = event.x
          const clickY = event.y

          const meta = chart.getDatasetMeta(0)
          if (!meta) return

          let clickedCrisis: Crisis | null = null
          let minPixelDistance = 20 // Ein klickbarer Radius von 20px um den Punkt

          filteredCrises.forEach((crisis) => {
            const yearIndex = years.findIndex((y) => y === crisis.year)
            if (yearIndex === -1) return

            const point = meta.data[yearIndex]
            if (!point) return

            const xPos = point.x
            const yPos = point.y
            
            // Berechne die Distanz zwischen Klick und Krisen-Punkt
            const distance = Math.sqrt((clickX - xPos)**2 + (clickY - yPos)**2)

            // Wenn der Klick nah genug dran war
            if (distance < minPixelDistance) {
              minPixelDistance = distance
              clickedCrisis = crisis
            }
          })

          // Wenn wir eine Krise im Radius gefunden haben, löse den Handler aus
          if (clickedCrisis) {
            onCrisisClick(clickedCrisis)
          }
        },
        scales: {
          x: {
            grid: { display: true, color: "#f0f0f0" },
            ticks: {
              font: { size: 12, family: "Times New Roman" },
              callback: (value: any, index: number) => {
                const year = years[index]
                if (Number.parseInt(timeframe) <= 10) return year
                return year % 5 === 0 ? year : ""
              },
            },
          },
          y: {
            grid: { display: true, color: "#f0f0f0" },
            ticks: { font: { size: 12, family: "Times New Roman" } },
            title: {
              display: true,
              text: "Index (1985 = 100)",
              font: { size: 12, family: "Times New Roman" },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => `MSCI World: ${context.parsed.y}`,
            },
          },
        },
      },
      // 4. KORREKTUR: Custom Plugin ist hier im root-Array
      plugins: [
        {
          id: 'crisisMarkers',
          afterDatasetsDraw: (chart) => {
            if (showInsights) {
              // Diese Funktion hat jetzt die Zeichenlogik
              drawCrisisMarkers(chart, filteredCrises, years)
            }
          }
        }
      ]
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartRef, timeframe, showInsights, onCrisisClick])
}