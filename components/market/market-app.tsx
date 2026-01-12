"use client"

import { useState, useMemo } from "react"
import { MarketChart } from "./market-chart" 
import { CrisisDetailModal } from "./crisis-detail-modal" 
import { Switch } from "@/components/ui/switch" 
import { type Crisis, calculatePortfolioHistory, calculateScenarioStatistics, getCrisisName } from "./market-data" 
import Link from "next/link" 
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import { SimulationControl } from "@/components/input_cockpit/simulation-control" 
import { PortfolioPieChart } from "@/components/input_cockpit/portfolio-pie-chart" 
import { useInvestment } from "@/lib/investment-context" 
import { TrendingDown, TrendingUp } from "lucide-react"

export function MarketApp() {
  const { 
    initialInvestment, setInitialInvestment,
    monthlyInvestment, setMonthlyInvestment,
    stockPercentage, setStockPercentage,
    investmentHorizon, setInvestmentHorizon
  } = useInvestment()
  
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showInsights, setShowInsights] = useState(false) 
  
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleCrisisClick = (crisis: Crisis) => {
    setSelectedCrisis(crisis)
    setShowModal(true)
  }

  // --- BERECHNUNG DER HISTORISCHEN WERTE ---
  const currentYear = 2026
  const startYear = currentYear - investmentHorizon

  // 1. Portfolio Verlauf berechnen
  const portfolioHistory = useMemo(() => {
    return calculatePortfolioHistory(
        initialInvestment,
        monthlyInvestment,
        stockPercentage,
        startYear,
        currentYear
    )
  }, [initialInvestment, monthlyInvestment, stockPercentage, startYear, currentYear])

  // 2. Statistiken berechnen
  const stats = useMemo(() => {
    return calculateScenarioStatistics(stockPercentage, investmentHorizon);
  }, [stockPercentage, investmentHorizon]);

  // Werte extrahieren
  const finalValue = portfolioHistory.length > 0 ? portfolioHistory[portfolioHistory.length - 1].value : initialInvestment
  const totalInvested = initialInvestment + (monthlyInvestment * 12 * investmentHorizon)
  const totalGain = finalValue - totalInvested
  const totalReturnPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

  // Formatierungs-Helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency', 
      currency: 'EUR', 
      maximumFractionDigits: 0 
    }).format(val)
  }

  // --- UI LOGIK ---
  const getTimeframeString = (years: number): "40" | "30" | "20" | "10" | "5" => {
    if (years >= 35) return "40";
    if (years >= 25) return "30";
    if (years >= 15) return "20";
    if (years >= 8) return "10";
    return "5";
  }
  const timeframeString = getTimeframeString(investmentHorizon);

  return (
    <div data-tour="market-page"> 
        
        <div className="mx-auto max-w-7xl px-4 py-8">
        
            {/* --- HEADER (SEITENTITEL) --- */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">{t.market.title}</h1>
                    <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{t.market.subtitle}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">

                {/* --- LINKE SPALTE: CONTROLS --- */}
                <div className="lg:col-span-4 flex flex-col h-full" data-tour="market-horizon">
                    
                    <div className="space-y-6">
                        <SimulationControl 
                            label={t.simulation.initialInvestment} 
                            value={initialInvestment} 
                            onChange={setInitialInvestment} 
                            min={400000} max={5000000} step={25000} 
                            isCurrency={true}
                        />
                        <SimulationControl 
                            label={t.simulation.monthlyInvestment} 
                            value={monthlyInvestment} 
                            onChange={setMonthlyInvestment} 
                            min={0} max={10000} step={100}
                            isCurrency={true} 
                        />
                        <SimulationControl 
                            label={t.simulation.stockPercentage} 
                            value={stockPercentage} 
                            onChange={setStockPercentage} 
                            min={0} max={100} step={5} 
                            unit="%"
                        />
                        <SimulationControl 
                            label={t.simulation.investmentHorizon} 
                            value={investmentHorizon} 
                            onChange={setInvestmentHorizon} 
                            min={5} max={40} step={1} 
                            unit={t.simulation.years}
                        />
                    </div>

                    <div className="my-6 border-t border-gray-100 dark:border-gray-700 w-full" />

                    <div className="flex-1 flex flex-col justify-end">
                        <div className="mb-2 text-sm font-medium text-gray-500">Allokation</div>
                        <PortfolioPieChart stockPercentage={stockPercentage} />
                        
                        {/* Info Box unten links */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                Analysezeitraum
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Historische Entwicklung von <strong>{startYear}</strong> bis <strong>{currentYear}</strong> basierend auf realen MSCI World Daten.
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RECHTE SPALTE: CHART & SUMMARY --- */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    
                    {/* 1. HEADER BEREICH (Zahl links, Boxen rechts gestapelt) */}
                    <div className="mb-8 mt-2" data-tour="market-summary">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                             Historischer Portfoliowert (heute)
                        </h3>
                        
                        {/* Container für Zahl (links) und Badges (rechts) */}
                        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                            
                            {/* LINKER BLOCK: Zahl & Unterzeile */}
                            <div>
                                <div className="text-5xl md:text-6xl font-serif text-[#1b251d] dark:text-gray-100 tracking-tight font-medium leading-none">
                                    {formatCurrency(finalValue)}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-3 text-lg flex-wrap">
                                    <span className={`font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${totalGain >= 0 ? 'text-[#15803d] bg-green-50 dark:bg-green-900/30' : 'text-red-600 bg-red-50 dark:bg-red-900/30'}`}>
                                        <span>{totalGain > 0 ? '+' : ''}{formatCurrency(totalGain)}</span>
                                        <span className="ml-1 text-base opacity-90">
                                            ({totalGain > 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%)
                                        </span>
                                    </span>
                                    <span className="text-gray-400 mx-1">•</span>
                                    <span className="text-[#1b251d] dark:text-gray-300 font-serif text-base">
                                        Ø {stats.averageReturn.toFixed(1)}% p.a.
                                    </span>
                                </div>
                            </div>

                            {/* RECHTER BLOCK: Die 2 Kästchen ÜBEREINANDER */}
                            <div className="flex flex-col gap-3 min-w-[220px]">
                                {/* Max Drawdown Badge */}
                                <div className="flex items-center gap-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl w-full">
                                    <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400 p-1.5 bg-white dark:bg-red-900/50 rounded-full shadow-sm flex-shrink-0" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] text-red-600/70 dark:text-red-400/70 font-bold uppercase tracking-wide mb-1">Max. Verlust</span>
                                        <span className="font-bold text-base text-red-700 dark:text-red-300">
                                            {stats.maxDrawdown.toFixed(1)}% 
                                            <span className="font-normal text-xs text-red-600/70 ml-1 block sm:inline">
                                                ('{String(stats.maxDrawdownYear).slice(2)})
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Max Gain Badge */}
                                <div className="flex items-center gap-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl w-full">
                                    <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 p-1.5 bg-white dark:bg-emerald-900/50 rounded-full shadow-sm flex-shrink-0" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-bold uppercase tracking-wide mb-1">Max. Gewinn</span>
                                        <span className="font-bold text-base text-emerald-700 dark:text-emerald-300">
                                            +{stats.maxGain.toFixed(1)}%
                                            <span className="font-normal text-xs text-emerald-600/70 ml-1 block sm:inline">
                                                ('{String(stats.maxGainYear).slice(2)})
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* CHART CONTROLS */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                           Verlauf {startYear} - {currentYear}
                        </div>
                        <div className="flex items-center space-x-2" data-tour="market-insights">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.market.insightToggle}</span>
                            <Switch checked={showInsights} onCheckedChange={setShowInsights} />
                        </div>
                    </div>

                    {/* CHART AREA */}
                    <div className="flex-1 w-full min-h-[400px] mb-8 relative bg-white dark:bg-transparent rounded-xl border border-gray-100 dark:border-none shadow-sm dark:shadow-none p-2">
                         <div className="absolute inset-0">
                            <MarketChart
                                timeframe={timeframeString}
                                showInsights={showInsights} 
                                onCrisisClick={handleCrisisClick}
                            />
                         </div>
                    </div>

                    {/* CTA Box (Sticky Bottom) */}
                    <div 
                        className="mt-auto bg-white dark:bg-gray-800 border border-[#ede9e1] dark:border-gray-600 rounded-lg p-8 shadow-sm"
                        data-tour="market-contact-cta"
                    >
                        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-serif text-[#1b251d] dark:text-gray-100 mb-2 leading-tight">
                                    {t.simulation.ctaTitle}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {t.simulation.ctaDescription}
                                </p>
                            </div>
                            
                            <Link href="/simulation" className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                                <button className="w-full sm:w-auto px-8 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium inline-flex items-center justify-center gap-2 shadow-md">
                                    Zurück zur Simulation <span className="text-lg">→</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic text-center lg:text-left">
                        {t.simulation.disclaimer}
                    </p>
                </div>
            </div>

            {selectedCrisis && (
                <CrisisDetailModal
                crisis={selectedCrisis}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                />
            )}
        </div>
    </div>
  )
}