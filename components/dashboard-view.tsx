"use client"

import { useState } from "react"
import { LineChart } from "@/components/line-chart"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardView() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground/70">Monitor your portfolio performance and market trends</p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$124,567.89</div>
                  <p className="text-xs text-primary mt-1">+2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+3.2%</div>
                  <p className="text-xs text-primary mt-1">+0.8% from previous period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Medium</div>
                  <p className="text-xs text-primary mt-1">Based on current allocation</p>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={performanceData} color="#668273" showGrid={true} />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assetAllocation.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span className="text-sm">{asset.name}</span>
                        </div>
                        <span className="text-sm font-medium">{asset.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{transaction.name}</p>
                          <p className="text-xs text-foreground/70">{transaction.date}</p>
                        </div>
                        <span
                          className={`text-sm font-medium ${transaction.type === "buy" ? "text-primary" : "text-accent"}`}
                        >
                          {transaction.type === "buy" ? "+" : "-"}${transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Long-term Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={longTermData} color="#668273" showGrid={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={marketData} color="#668273" showGrid={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Investment Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentOpportunities.map((opportunity, index) => (
                  <div key={index} className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{opportunity.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          opportunity.risk === "Low"
                            ? "bg-primary/20 text-primary"
                            : opportunity.risk === "Medium"
                              ? "bg-secondary/20 text-foreground"
                              : "bg-accent/20 text-accent"
                        }`}
                      >
                        {opportunity.risk} Risk
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/70">{opportunity.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium">Expected Return: {opportunity.expectedReturn}</span>
                      <button className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketNews.map((news, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <h3 className="text-sm font-medium">{news.title}</h3>
                    <p className="mt-1 text-xs text-foreground/70">{news.summary}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-foreground/50">{news.source}</span>
                      <span className="text-xs text-foreground/50">{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Sample data
const performanceData = [
  { x: "Jan", y: 100 },
  { x: "Feb", y: 120 },
  { x: "Mar", y: 115 },
  { x: "Apr", y: 130 },
  { x: "May", y: 145 },
  { x: "Jun", y: 160 },
  { x: "Jul", y: 170 },
  { x: "Aug", y: 185 },
  { x: "Sep", y: 190 },
  { x: "Oct", y: 205 },
  { x: "Nov", y: 220 },
  { x: "Dec", y: 235 },
]

const longTermData = [
  { x: "2018", y: 100 },
  { x: "2019", y: 130 },
  { x: "2020", y: 110 },
  { x: "2021", y: 160 },
  { x: "2022", y: 180 },
  { x: "2023", y: 210 },
  { x: "2024", y: 235 },
]

const marketData = [
  { x: "Week 1", y: 100 },
  { x: "Week 2", y: 105 },
  { x: "Week 3", y: 115 },
  { x: "Week 4", y: 110 },
  { x: "Week 5", y: 120 },
  { x: "Week 6", y: 125 },
  { x: "Week 7", y: 135 },
  { x: "Week 8", y: 145 },
]

const assetAllocation = [
  { name: "Stocks", percentage: 45, color: "#668273" },
  { name: "Bonds", percentage: 30, color: "#ebf151" },
  { name: "Real Estate", percentage: 15, color: "#1b251d" },
  { name: "Cash", percentage: 10, color: "#d9d9d9" },
]

const recentTransactions = [
  { name: "Tech Growth Fund", date: "Apr 22, 2024", amount: "1,200", type: "buy" },
  { name: "Sustainable Energy ETF", date: "Apr 18, 2024", amount: "850", type: "buy" },
  { name: "Global Bond Fund", date: "Apr 15, 2024", amount: "500", type: "sell" },
  { name: "Real Estate Trust", date: "Apr 10, 2024", amount: "1,500", type: "buy" },
]

const investmentOpportunities = [
  {
    name: "Green Energy Fund",
    risk: "Medium",
    description: "A diversified portfolio of renewable energy companies with strong growth potential.",
    expectedReturn: "8-12%",
  },
  {
    name: "Tech Innovation ETF",
    risk: "High",
    description: "Exposure to cutting-edge technology companies focused on AI and automation.",
    expectedReturn: "12-18%",
  },
  {
    name: "Stable Income Bond",
    risk: "Low",
    description: "Government and high-grade corporate bonds providing steady income.",
    expectedReturn: "4-6%",
  },
]

const marketNews = [
  {
    title: "Fed Signals Potential Rate Cut",
    summary: "Federal Reserve hints at possible interest rate reduction in upcoming meeting.",
    source: "Financial Times",
    time: "2h ago",
  },
  {
    title: "Tech Stocks Rally on Earnings",
    summary: "Major technology companies exceed quarterly earnings expectations.",
    source: "Market Watch",
    time: "4h ago",
  },
  {
    title: "New Regulations for Sustainable Investing",
    summary: "Regulatory bodies introduce new framework for ESG investment standards.",
    source: "Bloomberg",
    time: "6h ago",
  },
]
