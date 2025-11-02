"use client"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentSimulation } from "@/components/investment-simulation"
import { MarketView } from "@/components/market-view"

export function SimulationPage() {
  const [activeTab, setActiveTab] = useState<"simulation" | "market">("simulation")

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-8">
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <nav className="flex space-x-6 text-sm font-medium">
              <a href="#" className="text-gray-900 hover:text-gray-600">
                Private Banking
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-600">
                Institutional Banking
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-600">
                Investieren
              </a>
            </nav>
          </div>

          <div className="flex items-center">
            <img src="/placeholder.svg?height=40&width=150" alt="Gutmann Logo" className="h-10" />
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-600">
              Über uns
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600">
              Kontakt
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600">
              Karriere
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600">
              ESG
            </a>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">DE</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-gray-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <button className="rounded-full border border-gray-300 px-4 py-1 text-gray-700 hover:bg-gray-50">
              login
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "simulation" | "market")}
          className="w-full"
        >
          <TabsList className="mb-8 w-full justify-start space-x-8 border-b border-gray-200 bg-transparent p-0">
            <TabsTrigger
              value="simulation"
              className={`border-b-2 ${
                activeTab === "simulation" ? "border-gray-900" : "border-transparent"
              } bg-transparent px-0 py-2 text-base font-medium data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900`}
            >
              Vermögenssimulation
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className={`border-b-2 ${
                activeTab === "market" ? "border-gray-900" : "border-transparent"
              } bg-transparent px-0 py-2 text-base font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900`}
            >
              Ein Blick in den Markt
            </TabsTrigger>
          </TabsList>

          {activeTab === "simulation" ? <InvestmentSimulation /> : <MarketView />}
        </Tabs>
      </main>
    </div>
  )
}
