"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Monitor } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [fontSize, setFontSize] = useState("medium")

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-serif text-[#1b251d]">Einstellungen</h1>
          <p className="mt-2 text-[#6b7280]">Passen Sie die Darstellung nach Ihren Wünschen an</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Darstellung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1b251d] mb-3">Farbschema</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "light" ? "border-[#1b251d] bg-[#f8f3ef]" : "border-[#ede9e1] hover:border-[#1b251d]/30"
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm">Hell</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "dark" ? "border-[#1b251d] bg-[#f8f3ef]" : "border-[#ede9e1] hover:border-[#1b251d]/30"
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm">Dunkel</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "system" ? "border-[#1b251d] bg-[#f8f3ef]" : "border-[#ede9e1] hover:border-[#1b251d]/30"
                  }`}
                >
                  <Monitor className="w-6 h-6" />
                  <span className="text-sm">System</span>
                </button>
              </div>
              <p className="text-xs text-[#6b7280] mt-2">
                Wählen Sie das Farbschema, das am besten zu Ihrer Arbeitsumgebung passt
              </p>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-[#1b251d] mb-3">Schriftgröße</label>
              <div className="flex gap-3">
                {["Klein", "Mittel", "Groß"].map((size, index) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(["small", "medium", "large"][index])}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      fontSize === ["small", "medium", "large"][index]
                        ? "border-[#1b251d] bg-[#f8f3ef]"
                        : "border-[#ede9e1] hover:border-[#1b251d]/30"
                    }`}
                  >
                    <span className={index === 0 ? "text-sm" : index === 1 ? "text-base" : "text-lg"}>{size}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Über die Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6b7280] leading-relaxed">
              Diese Simulation dient ausschließlich zu Informationszwecken. Die dargestellten Szenarien basieren auf
              historischen Daten und stellen keine Anlageberatung dar. Vergangene Wertentwicklungen sind kein
              verlässlicher Indikator für zukünftige Ergebnisse.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
