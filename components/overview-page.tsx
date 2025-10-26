"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, PieChart, Activity } from "lucide-react"
import Link from "next/link"

export function OverviewPage() {
  const stats = [
    {
      name: "Gesamtvermögen",
      value: "€5.240.000",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      name: "Monatliche Performance",
      value: "+3.2%",
      change: "+0.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      name: "Portfolio Diversifikation",
      value: "8 Assets",
      change: "Optimal",
      changeType: "neutral" as const,
      icon: PieChart,
    },
    {
      name: "Risiko-Score",
      value: "Moderat",
      change: "Stabil",
      changeType: "neutral" as const,
      icon: Activity,
    },
  ]

  const quickActions = [
    {
      title: "Vermögenssimulation",
      description: "Simulieren Sie die Entwicklung Ihres Portfolios über verschiedene Zeiträume",
      href: "/simulation",
      color: "bg-blue-500",
    },
    {
      title: "Marktanalyse",
      description: "Analysieren Sie historische Marktentwicklungen und Krisen",
      href: "/market",
      color: "bg-green-500",
    },
    {
      title: "Portfolio Übersicht",
      description: "Detaillierte Ansicht Ihrer aktuellen Investments und Allokation",
      href: "/portfolio",
      color: "bg-purple-500",
    },
  ]

  const recentActivities = [
    {
      action: "Portfolio Rebalancing",
      date: "Vor 2 Tagen",
      description: "Aktienquote von 85% auf 90% erhöht",
    },
    {
      action: "Neue Simulation",
      date: "Vor 5 Tagen",
      description: "Monte-Carlo Simulation mit 20 Jahren Anlagehorizont",
    },
    {
      action: "Marktanalyse",
      date: "Vor 1 Woche",
      description: "Analyse der COVID-Krise und Erholungsphase",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Willkommen zurück!</h1>
        <p className="mt-2 text-gray-600">
          Hier ist eine Übersicht über Ihr Portfolio und aktuelle Marktentwicklungen.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 flex items-center text-sm">
                  {stat.changeType === "positive" && <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />}
                  {stat.changeType === "negative" && <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />}
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className={`inline-flex rounded-lg p-3 ${action.color} mb-4`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Markt Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">MSCI World +2.1%</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Der globale Aktienmarkt zeigt positive Entwicklung diese Woche.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="flex items-start">
                  <Activity className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-900">Volatilität erhöht</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Politische Unsicherheiten führen zu erhöhter Marktvolatilität.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-900">Dividendensaison</h4>
                    <p className="text-sm text-green-700 mt-1">Viele Unternehmen schütten aktuell Dividenden aus.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
