// lib/simulation-logic.ts

export const NUM_SIMULATIONS = 10000

// Box-Muller-Transform für Normalverteilung
export function getNormalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdDev + mean
}

// Nur noch MSCI World Parameter
export function getPortfolioParams(equityPercentage: number) {
  // MSCI World historische Daten (vereinfacht)
  const equityMean = 0.07 
  const equityStdDev = 0.18

  // Anleihen
  const bondMean = 0.02
  const bondStdDev = 0.04

  // Interpolation basierend auf Aktienquote
  const mean = bondMean + (equityMean - bondMean) * equityPercentage
  const stdDev = bondStdDev + (equityStdDev - bondStdDev) * equityPercentage

  return { mean, stdDev }
}

export function runMonteCarloSimulation(
  initial: number,
  monthly: number,
  years: number,
  equityQuote: number,
) {
  // Kein Benchmark-Parameter mehr
  const { mean, stdDev } = getPortfolioParams(equityQuote / 100)
  const yearlyContribution = monthly * 12

  const yearlyValues: number[][] = Array(years + 1).fill(0).map(() => [])

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    yearlyValues[0][i] = initial
  }

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    let currentAmount = initial
    for (let j = 1; j <= years; j++) {
      const yearlyReturn = getNormalRandom(mean, stdDev)
      currentAmount = currentAmount * (1 + yearlyReturn) + yearlyContribution
      currentAmount = Math.max(0, currentAmount)
      yearlyValues[j][i] = currentAmount
    }
  }

  // Perzentile berechnen
  const labels = Array.from({ length: years + 1 }, (_, i) => i)
  const bestCaseData: number[] = []
  const middleCaseData: number[] = []
  const worstCaseData: number[] = []

  for (let j = 0; j <= years; j++) {
    const sortedYearValues = yearlyValues[j].sort((a, b) => a - b)
    worstCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.1)] / 1000000)
    middleCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.5)] / 1000000)
    bestCaseData.push(sortedYearValues[Math.floor(NUM_SIMULATIONS * 0.9)] / 1000000)
  }

  const finalMedianValue = middleCaseData[years] * 1000000
  const totalInvestment = initial + yearlyContribution * years
  const totalReturn = finalMedianValue - totalInvestment
  const simpleYield = mean * 100

  return {
    chartData: { years: labels, bestCaseData, middleCaseData, worstCaseData },
    summary: { totalInvestment, finalValue: finalMedianValue, totalReturn, yield: simpleYield },
  }
}