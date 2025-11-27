"use client"

import type React from "react"
import { BarChart2, Home, PieChart, Settings, TrendingUp, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

export function Sidebar() {
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleConciergeClick = () => {
    const event = new CustomEvent("openConcierge")
    window.dispatchEvent(event)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#ede9e1] dark:border-gray-700 bg-[#f8f3ef] dark:bg-gray-800">
      <div className="flex h-16 items-center border-b border-[#ede9e1] dark:border-gray-700 px-6">
        <h1 className="text-xl font-serif tracking-tight text-[#1b251d] dark:text-gray-100">Kahane</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem href="/" icon={<Home className="h-5 w-5" />}>
            {language === "de"
              ? "Übersicht"
              : language === "fr"
                ? "Aperçu"
                : language === "it"
                  ? "Panoramica"
                  : "Overview"}
          </NavItem>
          <NavItem href="/simulation" icon={<BarChart2 className="h-5 w-5" />}>
            {t.simulation.title}
          </NavItem>
          <NavItem href="/market" icon={<TrendingUp className="h-5 w-5" />}>
            {language === "de"
              ? "Marktanalyse"
              : language === "fr"
                ? "Analyse du marché"
                : language === "it"
                  ? "Analisi di mercato"
                  : "Market Analysis"}
          </NavItem>
          <NavItem href="/portfolio" icon={<PieChart className="h-5 w-5" />}>
            Portfolio
          </NavItem>
        </nav>

        <div className="flex justify-center my-8 py-8 border-y border-[#ede9e1]/50 dark:border-gray-700/50">
          <button
            onClick={handleConciergeClick}
            className="group relative"
            title={
              language === "de"
                ? "Concierge rufen"
                : language === "fr"
                  ? "Appeler le concierge"
                  : language === "it"
                    ? "Chiamare il concierge"
                    : "Call concierge"
            }
            aria-label={
              language === "de"
                ? "Concierge rufen"
                : language === "fr"
                  ? "Appeler le concierge"
                  : language === "it"
                    ? "Chiamare il concierge"
                    : "Call concierge"
            }
          >
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200/50 dark:border-amber-700/50">
              {/* Hand-drawn bell SVG illustration */}
              <svg viewBox="0 0 100 100" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
                {/* Bell body - hand-drawn style */}
                <path
                  d="M 28 38 Q 28 26, 38 20 Q 50 14, 62 20 Q 72 26, 72 38 L 72 58 Q 72 68, 62 74 Q 50 76, 38 74 Q 28 68, 28 58 Z"
                  fill="#8B4513"
                  opacity="0.95"
                  stroke="#6B3410"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bell rim shadow */}
                <ellipse cx="50" cy="72" rx="24" ry="6" fill="#6B3410" opacity="0.6" />
                {/* Bell rim */}
                <ellipse cx="50" cy="70" rx="24" ry="6" fill="#8B4513" stroke="#6B3410" strokeWidth="1.5" />
                {/* Top handle */}
                <circle cx="50" cy="16" r="5" fill="#8B4513" stroke="#6B3410" strokeWidth="2" />
                {/* Clapper - vertical line */}
                <line x1="50" y1="68" x2="50" y2="82" stroke="#6B3410" strokeWidth="2.5" strokeLinecap="round" />
                {/* Clapper - ball */}
                <circle cx="50" cy="84" r="4" fill="#8B4513" stroke="#6B3410" strokeWidth="1.5" />
                {/* Highlight for 3D effect */}
                <ellipse cx="40" cy="36" rx="10" ry="14" fill="white" opacity="0.25" />
                {/* Decorative line details */}
                <path d="M 32 42 Q 34 44, 32 46" stroke="#6B3410" strokeWidth="0.8" fill="none" opacity="0.5" />
                <path d="M 68 42 Q 66 44, 68 46" stroke="#6B3410" strokeWidth="0.8" fill="none" opacity="0.5" />
              </svg>

              <div
                className="absolute inset-0 rounded-full bg-amber-200/30 dark:bg-amber-600/20 animate-ping"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
              {language === "de"
                ? "Concierge rufen"
                : language === "fr"
                  ? "Appeler le concierge"
                  : language === "it"
                    ? "Chiamare il concierge"
                    : "Call concierge"}
            </span>
          </button>
        </div>

        <nav className="space-y-2 px-4 mt-4">
          <Link
            href="/contact"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Phone className="h-5 w-5" />
            <span>
              {language === "de"
                ? "Kontaktieren"
                : language === "fr"
                  ? "Contacter"
                  : language === "it"
                    ? "Contattare"
                    : "Contact"}
            </span>
          </Link>

          <Link
            href="/feedback"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Feedback</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-[#ede9e1] dark:border-gray-700 p-4">
        <nav className="space-y-1">
          <NavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
            {t.settings.title}
          </NavItem>
        </nav>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-[#1b251d] dark:bg-gray-700 text-white"
          : "text-[#1b251d] dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  )
}
