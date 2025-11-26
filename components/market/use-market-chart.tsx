"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { crises, baseMSCIData, type Crisis } from "@/components/market/market-data"

Chart.register(...registerables)

function drawCrisisMarkers(chart: Chart, filteredCrises: Crisis[], years: number[]) {
  const ctx = chart.ctx
  const xAxis = chart.scales.x
  const yAxis = chart.scales.y
  const meta = chart.getDatasetMeta(0)

  filteredCrises.forEach((crisis) => {
    const yearIndex = years.findIndex((y) => y === crisis.year)
    if (yearIndex === -1) return

    const point = meta.data[yearIndex]
    if (!point) return

    const xPos = point.x
    const yPos = point.y

    // Draw red dot
    ctx.beginPath()
    ctx.arc(xPos, yPos, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#e57373"
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Draw vertical dashed line
    ctx.beginPath()
    ctx.moveTo(xPos, yAxis.bottom)
    ctx.lineTo(xPos, yPos + 6)
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw crisis name in box
    const crisisName = crisis.name
    ctx.font = "bold 10px Arial"
    const textWidth = ctx.measureText(crisisName).width + 10
    const textHeight = 20
    const boxX = xPos - textWidth / 2
    const boxY = yPos - 30

    // Background box
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1

    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, textWidth, textHeight, 4)
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillRect(boxX, boxY, textWidth, textHeight)
      ctx.strokeRect(boxX, boxY, textWidth, textHeight)
    }

    // Text
    ctx.fillStyle = "#1b251d"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(crisisName, xPos, boxY + textHeight / 2)

    // Line from point to box
    ctx.beginPath()
    ctx.moveTo(xPos, yPos - 6)
    ctx.lineTo(xPos, boxY + textHeight)
    ctx.strokeStyle = "#e57373"
    ctx.lineWidth = 1
    ctx.stroke()
  })
}

export function useMarketChart(
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

    const currentYear = 2025
    const startYear = currentYear - Number.parseInt(timeframe)
    const msciData = baseMSCIData.filter((d) => d.year >= startYear)
    const years = msciData.map((d) => d.year)
    const values = msciData.map((d) => d.value)
    const filteredCrises = crises.filter((crisis) => {
      return crisis.year >= startYear && crisis.year <= currentYear
    })

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

        onClick: (event, elements, chart) => {
          if (!showInsights) return

          const clickX = event.x
          const clickY = event.y

          const meta = chart.getDatasetMeta(0)
          if (!meta) return

          let clickedCrisis: Crisis | null = null
          let minPixelDistance = 40 // Increased clickable radius to include bubble area

          filteredCrises.forEach((crisis) => {
            const yearIndex = years.findIndex((y) => y === crisis.year)
            if (yearIndex === -1) return

            const point = meta.data[yearIndex]
            if (!point) return

            const xPos = point.x
            const yPos = point.y

            // Check if click is near the crisis point
            const distanceToPoint = Math.sqrt((clickX - xPos) ** 2 + (clickY - yPos) ** 2)

            // Also check if click is within the bubble area above the point
            const bubbleY = yPos - 30
            const bubbleHeight = 20
            const bubbleWidth = 60 // Approximate width
            const isInBubble =
              clickX >= xPos - bubbleWidth / 2 &&
              clickX <= xPos + bubbleWidth / 2 &&
              clickY >= bubbleY &&
              clickY <= bubbleY + bubbleHeight

            if (distanceToPoint < minPixelDistance || isInBubble) {
              minPixelDistance = distanceToPoint
              clickedCrisis = crisis
            }
          })

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
  }, [chartRef, timeframe, showInsights, onCrisisClick])
}
