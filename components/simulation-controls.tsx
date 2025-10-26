"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface SimulationControlsProps {
  parameters: {
    param1: number
    param2: number
    param3: number
    param4: number
    param5: number
  }
  onChange: (name: string, value: number) => void
}

export function SimulationControls({ parameters, onChange }: SimulationControlsProps) {
  const handleSliderChange = (name: string, value: number[]) => {
    onChange(name, value[0])
  }

  return (
    <Card className="border-[#ede9e1] bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#1b251d]">Simulation Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ParameterSlider
            name="Expected Return"
            value={parameters.param1}
            onChange={(value) => handleSliderChange("param1", value)}
          />
          <ParameterSlider
            name="Volatility"
            value={parameters.param2}
            onChange={(value) => handleSliderChange("param2", value)}
          />
          <ParameterSlider
            name="Correlation"
            value={parameters.param3}
            onChange={(value) => handleSliderChange("param3", value)}
          />
          <ParameterSlider
            name="Time Horizon"
            value={parameters.param4}
            onChange={(value) => handleSliderChange("param4", value)}
          />
          <ParameterSlider
            name="Initial Investment"
            value={parameters.param5}
            onChange={(value) => handleSliderChange("param5", value)}
          />
        </div>

        <div className="rounded-md bg-[#f8f3ef] p-4">
          <h3 className="mb-2 text-sm font-medium text-[#1b251d]">Simulation Results</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1b251d]/70">Expected Return:</span>
              <span className="text-xs font-medium text-[#1b251d]">{(parameters.param1 * 20).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1b251d]/70">Risk Level:</span>
              <span className="text-xs font-medium text-[#1b251d]">
                {parameters.param2 < 0.33 ? "Low" : parameters.param2 < 0.66 ? "Medium" : "High"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1b251d]/70">Success Probability:</span>
              <span className="text-xs font-medium text-[#1b251d]">
                {(
                  (1 - parameters.param2) *
                  100 *
                  (0.5 + parameters.param1 / 2) *
                  (0.5 + parameters.param3 / 2)
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-2">
          <button className="w-full rounded-md border border-[#1b251d] bg-white px-4 py-2 text-sm font-medium text-[#1b251d] hover:bg-[#f8f3ef]">
            Reset
          </button>
          <button className="w-full rounded-md bg-[#1b251d] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b251d]/90">
            Run Simulation
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ParameterSliderProps {
  name: string
  value: number
  onChange: (value: number[]) => void
}

function ParameterSlider({ name, value, onChange }: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#1b251d]">{name}</label>
        <span className="text-xs text-[#1b251d]/70">{value.toFixed(2)}</span>
      </div>
      <Slider defaultValue={[value]} max={1} step={0.01} value={[value]} onValueChange={onChange} className="py-1" />
    </div>
  )
}
