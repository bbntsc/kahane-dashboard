"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface DataPoint {
  x: string
  y: number
}

interface LineChartProps {
  data: DataPoint[]
  color?: string
  showGrid?: boolean
}

export function LineChart({ data, color = "#668273", showGrid = false }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((point) => point.x),
        datasets: [
          {
            label: "Value",
            data: data.map((point) => point.y),
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: true,
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
            backgroundColor: "#1b251d",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            cornerRadius: 4,
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: {
              display: showGrid,
              color: "#d9d9d920",
            },
            ticks: {
              color: "#1b251d80",
              font: {
                size: 10,
              },
            },
          },
          y: {
            grid: {
              display: showGrid,
              color: "#d9d9d920",
            },
            ticks: {
              color: "#1b251d80",
              font: {
                size: 10,
              },
            },
            beginAtZero: false,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, color, showGrid])

  return <canvas ref={chartRef} className="chart-container" />
}
