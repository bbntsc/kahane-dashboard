"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

export default function SettingsPage() {
  const { language, theme, setTheme, fontSize, setFontSize } = useSettings()
  const t = useTranslation(language)

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
  }
  
  // KORREKTUR: Verwenden Sie direkt die Übersetzung
  const settingsSubtitle = t.settings.settingsSubtitle; 

  return (
    <DashboardLayout>
      {/* mx-auto hinzugefügt, um den max-w-3xl Container zu zentrieren */}
      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif text-[#1b251d] dark:text-[#f8f3ef]">{t.settings.title}</h1>
          <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af]">{settingsSubtitle}</p> 
        </div>

        <Card className="dark:bg-[#2a3529] dark:border-[#404a3f]">
          <CardHeader>
            <CardTitle className="font-serif text-[#1b251d] dark:text-[#f8f3ef]">{t.settings.appearance}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1b251d] dark:text-[#f8f3ef] mb-3">
                {t.settings.theme}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange("light")}
                  // Textfarbe im dunklen Modus auf dunkel gelassen, damit sie im Hellmodus sichtbar bleibt
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "light"
                      ? "border-[#1b251d] dark:border-[#f8f3ef] bg-[#f8f3ef] dark:bg-[#1b251d] text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe für aktiven Zustand
                      : "border-[#ede9e1] dark:border-[#404a3f] hover:border-[#1b251d]/30 text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe für inaktiven Zustand
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm">{t.settings.light}</span>
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "dark"
                      ? "border-[#1b251d] dark:border-[#f8f3ef] bg-[#f8f3ef] dark:bg-[#1b251d] text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe für aktiven Zustand
                      : "border-[#ede9e1] dark:border-[#404a3f] hover:border-[#1b251d]/30 text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe für inaktiven Zustand
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm">{t.settings.dark}</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-[#1b251d] dark:text-[#f8f3ef] mb-3">
                {t.settings.fontSize}
              </label>
              <div className="flex gap-3">
                {["small", "medium", "large"].map((size, index) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size as "small" | "medium" | "large")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      fontSize === size
                        ? "border-[#1b251d] dark:border-[#f8f3ef] bg-[#f8f3ef] dark:bg-[#1b251d] text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe
                        : "border-[#ede9e1] dark:border-[#404a3f] hover:border-[#1b251d]/30 text-[#1b251d] dark:text-[#f8f3ef]" // Explizit Dark Mode Textfarbe
                    }`}
                  >
                    <span className={index === 0 ? "text-sm" : index === 1 ? "text-base" : "text-lg"}>
                      {index === 0 ? t.settings.small : index === 1 ? t.settings.medium : t.settings.large}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}