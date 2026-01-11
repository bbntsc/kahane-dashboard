"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

interface PortfolioPieChartProps {
  stockPercentage: number
}

const COLORS = [
  "#4a5f52", 
  "#6b8e23", 
  "#a4a855", 
  "#d9df47", 
  "#8c8981", 
]

export function PortfolioPieChart({ stockPercentage }: PortfolioPieChartProps) {
  const { theme, language } = useSettings()
  const t = useTranslation(language)
  const isDark = theme === "dark"

  const generateData = (stockPct: number) => {
    const bondPct = 100 - stockPct
    const data = []

    if (stockPct > 0) {
      data.push({ name: t.simulation.stockDeveloped, value: Math.round(stockPct * 0.6) })
      data.push({ name: t.simulation.stockEmerging, value: Math.round(stockPct * 0.4) })
    }

    if (bondPct > 0) {
      data.push({ name: t.simulation.bondCorporate, value: Math.round(bondPct * 0.7) })
      data.push({ name: t.simulation.liquidity, value: Math.round(bondPct * 0.3) })
    }

    return data
      .filter(item => item.value > 0)
      .map((entry, index) => ({
        ...entry,
        color: COLORS[index % COLORS.length]
      }))
  }

  const chartData = generateData(stockPercentage)

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="grid grid-cols-1 gap-1 pt-4 text-sm">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-[#1b251d] dark:text-[#f8f3ef]">
            <span 
                className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
            ></span>
            <span className="flex-1">{entry.value}</span>
            <span className="font-medium">{entry.payload.value}%</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-[#ede9e1] dark:border-gray-700 shadow-sm">
      <h3 className="text-center text-lg font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef] mb-4">
        {t.simulation.portfolioComposition}
      </h3>
      <div className="h-[300px] w-full font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke={isDark ? "#1f2937" : "#ffffff"}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#ede9e1',
                    color: isDark ? '#f8f3ef' : '#1b251d',
                    borderRadius: '0.5rem'
                }}
            />
            <Legend content={renderLegend} verticalAlign="bottom" height={100}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
       <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
          {t.simulation.portfolioDisclaimer}
       </p>
    </div>
  )
}