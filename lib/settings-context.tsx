"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "./i18n"

interface SettingsContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
  fontSize: "small" | "medium" | "large"
  setFontSize: (size: "small" | "medium" | "large") => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de")
  const [theme, setThemeState] = useState<"light" | "dark">("light")
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    const savedFontSize = localStorage.getItem("fontSize") as "small" | "medium" | "large"

    if (savedLanguage) setLanguageState(savedLanguage)
    if (savedTheme) setThemeState(savedTheme)
    if (savedFontSize) setFontSize(savedFontSize)
  }, [])

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Apply font size
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg")
    if (fontSize === "small") document.documentElement.classList.add("text-sm")
    else if (fontSize === "large") document.documentElement.classList.add("text-lg")
  }, [fontSize])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
