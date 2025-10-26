"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SimulationControls } from "@/components/simulation-controls"
import { SimulationChart } from "@/components/simulation-chart"

export function Dashboard() {
  const [parameters, setParameters] = useState({
    param1: 0.5,
    param2: 0.5,
    param3: 0.5,
    param4: 0.5,
    param5: 0.5,
  })

  const handleParameterChange = (name: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex h-screen bg-[#f8f3ef]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-[#1b251d]">Monte Carlo Simulation</h1>
          <p className="text-sm text-[#1b251d]/70">Adjust parameters to see how they affect the simulation results</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SimulationControls parameters={parameters} onChange={handleParameterChange} />
          </div>
          <div className="lg:col-span-2">
            <SimulationChart parameters={parameters} />
          </div>
        </div>
      </main>
    </div>
  )
}
