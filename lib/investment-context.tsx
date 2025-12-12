"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface InvestmentContextType {
  initialInvestment: number
  setInitialInvestment: (val: number) => void
  monthlyInvestment: number
  setMonthlyInvestment: (val: number) => void
  stockPercentage: number
  setStockPercentage: (val: number) => void
  investmentHorizon: number
  setInvestmentHorizon: (val: number) => void
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined)

export function InvestmentProvider({ children }: { children: ReactNode }) {
  // Gemeinsamer State für Market und Simulation
  // Standardwerte können hier definiert werden
  const [initialInvestment, setInitialInvestment] = useState(500000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000)
  const [stockPercentage, setStockPercentage] = useState(50) // Standardmäßig ausgewogen
  const [investmentHorizon, setInvestmentHorizon] = useState(20) // Langfristiger Horizont

  return (
    <InvestmentContext.Provider
      value={{
        initialInvestment,
        setInitialInvestment,
        monthlyInvestment,
        setMonthlyInvestment,
        stockPercentage,
        setStockPercentage,
        investmentHorizon,
        setInvestmentHorizon,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  )
}

export function useInvestment() {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error("useInvestment must be used within an InvestmentProvider")
  }
  return context
}