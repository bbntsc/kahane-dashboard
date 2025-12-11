// hooks/use-simulation.ts
import { useState, useMemo, useEffect } from "react"
import { runMonteCarloSimulation } from "./simulation-logic"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function useSimulation() {
  const [initialInvestment, setInitialInvestment] = useState(500000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(0)
  const [stockPercentage, setStockPercentage] = useState(0)
  const [investmentHorizon, setInvestmentHorizon] = useState(5)
  // Benchmark State entfernt
  const [isClient, setIsClient] = useState(false)

  const dInitial = useDebounce(initialInvestment, 300)
  const dMonthly = useDebounce(monthlyInvestment, 300)
  const dStock = useDebounce(stockPercentage, 300)
  const dHorizon = useDebounce(investmentHorizon, 300)

  useEffect(() => { setIsClient(true) }, [])

  const results = useMemo(() => {
    if (!isClient) {
      return {
        chartData: { years: [0], bestCaseData: [0], middleCaseData: [0], worstCaseData: [0] },
        summary: { totalInvestment: 0, finalValue: 0, totalReturn: 0, yield: 0 },
      }
    }
    // Aufruf ohne Benchmark-Parameter
    return runMonteCarloSimulation(dInitial, dMonthly, dHorizon, dStock)
  }, [dInitial, dMonthly, dHorizon, dStock, isClient])

  return {
    values: { initialInvestment, monthlyInvestment, stockPercentage, investmentHorizon },
    setters: { setInitialInvestment, setMonthlyInvestment, setStockPercentage, setInvestmentHorizon },
    results,
    isClient
  }
}