// Real-time market data API integration
export interface MarketDataPoint {
  date: string
  value: number
}

export interface BenchmarkData {
  name: string
  symbol: string
  currentValue: number
  change24h: number
  changePercent: number
  historicalData: MarketDataPoint[]
}

// Note: In a production environment, you would use environment variables for API keys
// and make actual API calls to services like Alpha Vantage, Yahoo Finance, or Financial Modeling Prep

export async function fetchRealTimeMarketData(symbol: string): Promise<BenchmarkData | null> {
  try {
    // This is a placeholder for real API integration
    // In production, you would call: fetch(`https://api.example.com/quote/${symbol}`)

    console.log(`[v0] Fetching real-time data for ${symbol}`)

    // Simulating API response with realistic data
    // Replace this with actual API calls in production
    const mockData: Record<string, BenchmarkData> = {
      MSCI_WORLD: {
        name: "MSCI World Index",
        symbol: "URTH",
        currentValue: 3245.67,
        change24h: 12.34,
        changePercent: 0.38,
        historicalData: generateHistoricalMSCIWorld(),
      },
      SP500: {
        name: "S&P 500",
        symbol: "^GSPC",
        currentValue: 5127.89,
        change24h: 23.45,
        changePercent: 0.46,
        historicalData: generateHistoricalSP500(),
      },
      STOXX600: {
        name: "STOXX Europe 600",
        symbol: "SXXP",
        currentValue: 523.12,
        change24h: 2.87,
        changePercent: 0.55,
        historicalData: generateHistoricalSTOXX600(),
      },
    }

    return mockData[symbol] || null
  } catch (error) {
    console.error(`[v0] Error fetching market data for ${symbol}:`, error)
    return null
  }
}

// Generate historical data for MSCI World (based on real historical patterns)
function generateHistoricalMSCIWorld(): MarketDataPoint[] {
  const data: MarketDataPoint[] = []
  const startYear = 1985
  const endYear = 2025
  let value = 100 // Starting value in 1985

  for (let year = startYear; year <= endYear; year++) {
    // Apply realistic growth patterns with crisis periods
    let yearlyReturn = 0.08 // Base 8% annual return

    // Major crises and their impacts
    if (year === 1987)
      yearlyReturn = -0.15 // Black Monday
    else if (year === 2000)
      yearlyReturn = -0.1 // Dot-com peak
    else if (year === 2001)
      yearlyReturn = -0.15 // Dot-com crash
    else if (year === 2002)
      yearlyReturn = -0.2 // Continued crash
    else if (year === 2003)
      yearlyReturn = 0.338 // Strong recovery
    else if (year === 2008)
      yearlyReturn = -0.403 // Financial crisis
    else if (year === 2009)
      yearlyReturn = 0.3 // Recovery
    else if (year === 2011)
      yearlyReturn = -0.05 // Euro crisis
    else if (year === 2020)
      yearlyReturn = 0.16 // COVID recovery
    else if (year === 2022) yearlyReturn = -0.18 // Inflation crisis

    value = value * (1 + yearlyReturn)
    data.push({
      date: `${year}-12-31`,
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

// Generate historical data for S&P 500 (based on real historical patterns)
function generateHistoricalSP500(): MarketDataPoint[] {
  const data: MarketDataPoint[] = []
  const startYear = 1985
  const endYear = 2025
  let value = 211 // Actual S&P 500 value in 1985

  for (let year = startYear; year <= endYear; year++) {
    let yearlyReturn = 0.1 // Base 10% annual return

    // Major crises and their impacts
    if (year === 1987)
      yearlyReturn = 0.02 // Black Monday (recovered by year-end)
    else if (year === 2000)
      yearlyReturn = -0.1 // Dot-com peak
    else if (year === 2001)
      yearlyReturn = -0.13 // Dot-com crash
    else if (year === 2002)
      yearlyReturn = -0.23 // Continued crash
    else if (year === 2003)
      yearlyReturn = 0.26 // Recovery
    else if (year === 2008)
      yearlyReturn = -0.38 // Financial crisis
    else if (year === 2009)
      yearlyReturn = 0.23 // Recovery
    else if (year === 2013)
      yearlyReturn = 0.3 // Strong year
    else if (year === 2020)
      yearlyReturn = 0.16 // COVID recovery
    else if (year === 2022)
      yearlyReturn = -0.19 // Inflation crisis
    else if (year === 2023) yearlyReturn = 0.24 // Strong recovery

    value = value * (1 + yearlyReturn)
    data.push({
      date: `${year}-12-31`,
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

// Generate historical data for STOXX Europe 600 (suitable for Bank Gutmann's European focus)
function generateHistoricalSTOXX600(): MarketDataPoint[] {
  const data: MarketDataPoint[] = []
  const startYear = 1990 // STOXX started in 1990
  const endYear = 2025
  let value = 100 // Starting index value

  for (let year = startYear; year <= endYear; year++) {
    let yearlyReturn = 0.07 // Base 7% annual return

    // European-specific crises
    if (year === 2000)
      yearlyReturn = -0.05 // Dot-com
    else if (year === 2001)
      yearlyReturn = -0.18 // Dot-com crash
    else if (year === 2002)
      yearlyReturn = -0.35 // Deep crash
    else if (year === 2003)
      yearlyReturn = 0.18 // Recovery
    else if (year === 2008)
      yearlyReturn = -0.45 // Financial crisis (Europe hit harder)
    else if (year === 2009)
      yearlyReturn = 0.28 // Recovery
    else if (year === 2011)
      yearlyReturn = -0.15 // Euro crisis
    else if (year === 2012)
      yearlyReturn = 0.15 // ECB intervention
    else if (year === 2020)
      yearlyReturn = -0.05 // COVID
    else if (year === 2021)
      yearlyReturn = 0.22 // Strong recovery
    else if (year === 2022) yearlyReturn = -0.14 // Ukraine/inflation

    value = value * (1 + yearlyReturn)
    data.push({
      date: `${year}-12-31`,
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

// Fetch all benchmarks
export async function fetchAllBenchmarks(): Promise<Record<string, BenchmarkData>> {
  const [msciWorld, sp500, stoxx600] = await Promise.all([
    fetchRealTimeMarketData("MSCI_WORLD"),
    fetchRealTimeMarketData("SP500"),
    fetchRealTimeMarketData("STOXX600"),
  ])

  return {
    "MSCI World": msciWorld!,
    "S&P 500": sp500!,
    "STOXX 600": stoxx600!,
  }
}
