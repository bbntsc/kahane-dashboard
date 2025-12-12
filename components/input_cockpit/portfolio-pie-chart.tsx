"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useSettings } from "@/lib/settings-context"

interface PortfolioPieChartProps {
  stockPercentage: number
}

// Gutmann Farbpalette für das Chart
const COLORS = [
  "#4a5f52", // Dunkelgrün (Primary Brand Color) - für Hauptaktien
  "#6b8e23", // Olivgrün - für weitere Aktien
  "#a4a855", // Gedecktes Gold/Oliv - für Mischformen/Rohstoffe
  "#d9df47", // Helles Akzent-Gold - für Anleihen
  "#8c8981", // Grau-Beige - für Liquidität/Sicheres
]

export function PortfolioPieChart({ stockPercentage }: PortfolioPieChartProps) {
  const { theme } = useSettings()
  const isDark = theme === "dark"

  // Fiktive Logik zur Erstellung der Portfolio-Zusammensetzung basierend auf der Aktienquote
  const generateData = (stockPct: number) => {
    const bondPct = 100 - stockPct

    const data = []

    // Aktienanteil aufteilen (wenn vorhanden)
    if (stockPct > 0) {
      data.push({ name: "Globale Aktien (Dev.)", value: Math.round(stockPct * 0.6) })
      data.push({ name: "Schwellenländer & Themen", value: Math.round(stockPct * 0.4) })
    }

    // Anleihen/Liquiditätsanteil aufteilen (wenn vorhanden)
    if (bondPct > 0) {
      data.push({ name: "Staats- & Unternehmensanl.", value: Math.round(bondPct * 0.7) })
      data.push({ name: "Liquidität & Geldmarkt", value: Math.round(bondPct * 0.3) })
    }

    // Filtern von Einträgen mit 0%, damit sie nicht in der Legende erscheinen,
    // und Zuweisung der Farben.
    return data
      .filter(item => item.value > 0)
      .map((entry, index) => ({
        ...entry,
        color: COLORS[index % COLORS.length]
      }))
  }

  const chartData = generateData(stockPercentage)

  // Benutzerdefinierte Legende für besseres Styling
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
        Beispielhafte Zusammensetzung
      </h3>
      <div className="h-[300px] w-full font-sans">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Macht es zum Donut-Chart, sieht moderner aus
              outerRadius={80}
              paddingAngle={2} // Kleiner Abstand zwischen den Segmenten
              dataKey="value"
              stroke={isDark ? "#1f2937" : "#ffffff"} // Weißer Rahmen um Segmente im Light Mode, dunkler im Dark Mode
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
          Dies ist eine illustrative Darstellung und keine Anlageempfehlung. Die tatsächliche Zusammensetzung wird individuell ermittelt.
       </p>
    </div>
  )
}