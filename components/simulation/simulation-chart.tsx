"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface SimulationChartProps {
  parameters: {
    param1: number
    param2: number
    param3: number
    param4: number
    param5: number
  }
}

export function SimulationChart({ parameters }: SimulationChartProps) {
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const lineChartInstance = useRef<Chart | null>(null)

  const areaChartRef = useRef<HTMLCanvasElement>(null)
  const areaChartInstance = useRef<Chart | null>(null)

  // Generate simulation data based on parameters
  const generateSimulationData = () => {
    const years = 20
    const baseData = Array.from({ length: years }, (_, i) => i + 1)

    // Expected return affects the slope
    const expectedReturn = parameters.param1 * 0.15 + 0.05 // 5% to 20%

    // Volatility affects the randomness
    const volatility = parameters.param2 * 0.2 // 0% to 20%

    // Time horizon affects the number of data points
    const timeHorizon = Math.max(5, Math.floor(parameters.param4 * 15) + 5) // 5 to 20 years

    // Initial investment affects the starting point
    const initialInvestment = 100000 * (0.5 + parameters.param5 * 0.5) // $50k to $150k

    // Generate base line (expected growth)
    const baseLine = baseData.map((year) => initialInvestment * Math.pow(1 + expectedReturn, year))

    // Generate multiple simulation paths
    const simulations = []
    for (let i = 0; i < 10; i++) {
      const path = baseData.map((year) => {
        const randomFactor = 1 + (Math.random() * 2 - 1) * volatility
        return initialInvestment * Math.pow(1 + expectedReturn * randomFactor, year)
      })
      simulations.push(path)
    }

    // Calculate percentiles
    const percentiles = baseData.map((year, yearIndex) => {
      const yearValues = simulations.map((sim) => sim[yearIndex]).sort((a, b) => a - b)
      return {
        year,
        p10: yearValues[Math.floor(yearValues.length * 0.1)],
        p25: yearValues[Math.floor(yearValues.length * 0.25)],
        p50: yearValues[Math.floor(yearValues.length * 0.5)],
        p75: yearValues[Math.floor(yearValues.length * 0.75)],
        p90: yearValues[Math.floor(yearValues.length * 0.9)],
      }
    })

    return {
      baseData: baseData.slice(0, timeHorizon),
      baseLine: baseLine.slice(0, timeHorizon),
      simulations: simulations.map((sim) => sim.slice(0, timeHorizon)),
      percentiles: percentiles.slice(0, timeHorizon),
    }
  }

  useEffect(() => {
    if (!lineChartRef.current || !areaChartRef.current) return

    const data = generateSimulationData()

    // Destroy existing charts
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
    }

    if (areaChartInstance.current) {
      areaChartInstance.current.destroy()
    }

    // Create line chart
    const lineCtx = lineChartRef.current.getContext("2d")
    if (lineCtx) {
      lineChartInstance.current = new Chart(lineCtx, {
        type: "line",
        data: {
          labels: data.baseData.map((year) => `Year ${year}`),
          datasets: [
            {
              label: "Expected Growth",
              data: data.baseLine,
              borderColor: "#668273",
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
            ...data.simulations.map((sim, index) => ({
              label: `Simulation ${index + 1}`,
              data: sim,
              borderColor: `rgba(102, 130, 115, ${0.1 + index * 0.05})`,
              backgroundColor: "transparent",
              borderWidth: 1,
              pointRadius: 0,
              borderDash: [5, 5],
            })),
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
              grid: {
                display: true,
                color: "#ede9e120",
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
                display: true,
                color: "#ede9e120",
              },
              ticks: {
                color: "#1b251d80",
                font: {
                  size: 10,
                },
                callback: (value) => "$" + (Number(value) / 1000).toFixed(0) + "k",
              },
            },
          },
        },
      })
    }

    // Create area chart
    const areaCtx = areaChartRef.current.getContext("2d")
    if (areaCtx) {
      areaChartInstance.current = new Chart(areaCtx, {
        type: "line",
        data: {
          labels: data.baseData.map((year) => `Year ${year}`),
          datasets: [
            {
              label: "90th Percentile",
              data: data.percentiles.map((p) => p.p90),
              borderColor: "transparent",
              backgroundColor: "rgba(102, 130, 115, 0.1)",
              fill: "+1",
              pointRadius: 0,
            },
            {
              label: "75th Percentile",
              data: data.percentiles.map((p) => p.p75),
              borderColor: "transparent",
              backgroundColor: "rgba(102, 130, 115, 0.1)",
              fill: "+1",
              pointRadius: 0,
            },
            {
              label: "Median",
              data: data.percentiles.map((p) => p.p50),
              borderColor: "#668273",
              backgroundColor: "rgba(102, 130, 115, 0.1)",
              borderWidth: 2,
              fill: "+1",
              pointRadius: 0,
            },
            {
              label: "25th Percentile",
              data: data.percentiles.map((p) => p.p25),
              borderColor: "transparent",
              backgroundColor: "rgba(102, 130, 115, 0.1)",
              fill: "+1",
              pointRadius: 0,
            },
            {
              label: "10th Percentile",
              data: data.percentiles.map((p) => p.p10),
              borderColor: "transparent",
              backgroundColor: "rgba(102, 130, 115, 0.1)",
              fill: false,
              pointRadius: 0,
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
              grid: {
                display: true,
                color: "#ede9e120",
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
                display: true,
                color: "#ede9e120",
              },
              ticks: {
                color: "#1b251d80",
                font: {
                  size: 10,
                },
                callback: (value) => "$" + (Number(value) / 1000).toFixed(0) + "k",
              },
            },
          },
        },
      })
    }

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }
      if (areaChartInstance.current) {
        areaChartInstance.current.destroy()
      }
    }
  }, [parameters])

  return (
    <Card className="border-[#ede9e1] bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#1b251d]">Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulations">
          <TabsList className="mb-4 bg-[#f8f3ef]">
            <TabsTrigger value="simulations" className="text-xs">
              Individual Simulations
            </TabsTrigger>
            <TabsTrigger value="percentiles" className="text-xs">
              Percentile Ranges
            </TabsTrigger>
          </TabsList>
          <TabsContent value="simulations">
            <div className="h-[400px]">
              <canvas ref={lineChartRef} />
            </div>
            <div className="mt-4 text-xs text-[#1b251d]/70">
              <p>
                This chart shows multiple possible outcomes based on your parameter settings. The solid line represents
                the expected growth path, while the dashed lines show individual simulation runs.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="percentiles">
            <div className="h-[400px]">
              <canvas ref={areaChartRef} />
            </div>
            <div className="mt-4 text-xs text-[#1b251d]/70">
              <p>
                This chart shows the range of possible outcomes. The dark line represents the median outcome, while the
                shaded areas show the 10th-90th percentile range of results.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
