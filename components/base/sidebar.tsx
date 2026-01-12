"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { TrendingUp, BarChart3, Settings, Star, HelpCircle, Mail, Bell } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

interface SidebarProps {
  onConciergeClick: () => void
  isHighlighted?: boolean
}

export function Sidebar({ onConciergeClick, isHighlighted = false }: SidebarProps) {
  const pathname = usePathname()
  const { theme, language } = useSettings()
  const t = useTranslation(language)

  const isDark = theme === "dark"

  const navigation = [
    { name: t.nav.simulation, href: "/simulation", icon: BarChart3, target: "sidebar-simulation" },
    { name: t.nav.market, href: "/market", icon: TrendingUp, target: "sidebar-market" },
    { name: t.nav.faq, href: "/faq", icon: HelpCircle, target: "sidebar-faq" },
    { name: t.nav.feedback, href: "/feedback", icon: Star, target: "sidebar-feedback" },
    { name: t.nav.contact, href: "/contact", icon: Mail, target: "sidebar-contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/simulation" && pathname === "/") return true
    return pathname.startsWith(href)
  }

  // Dieser Style erzwingt Weiß im Dark Mode und ignoriert CSS-Überschreibungen
  const whiteStyle = isDark ? { color: "#ffffff", opacity: 1 } : {}

  return (
    <div
      className={`flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b251d] overflow-y-auto h-full z-10 transition-all duration-500 ${
        isHighlighted
          ? "ring-4 ring-inset ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] z-50"
          : ""
      }`}
    >
      {/* --- HEADER: LOGO --- */}
      <div className="flex flex-col items-center justify-center py-6">
        <h1 className="text-3xl font-script text-[#1b251d] dark:text-white mb-0 leading-none transition-colors">
          Gutmann
        </h1>

        {/* Separator */}
        <div className="flex items-center justify-center my-2">
          <div className="w-8 h-px bg-[#1b251d] dark:bg-white opacity-50" />
          <div className="w-1 h-1 mx-1.5 rounded-full bg-[#1b251d] dark:bg-white opacity-50" />
          <div className="w-8 h-px bg-[#1b251d] dark:bg-white opacity-50" />
        </div>

        <div className="text-[10px] tracking-[0.3em] uppercase text-[#1b251d] dark:text-white mt-0 transition-colors">
          CONCIERGE
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="mt-2 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const finalHref = item.href === "/" ? "/simulation" : item.href
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              href={finalHref}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-[#668273] text-white shadow-sm"
                  : "text-gray-700 dark:text-white hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529]"
              }`}
              style={!active ? whiteStyle : {}}
              data-tour={item.target}
            >
              <Icon className="h-5 w-5" style={!active ? whiteStyle : {}} />
              <span style={!active ? whiteStyle : {}}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* --- BOTTOM AREA (Concierge, Kontakt, Settings) --- */}
      <div className="mt-auto w-full flex flex-col items-center">
        
        {/* 1. CONCIERGE BUTTON (Glocke) */}
        <div className="px-6 py-4 flex justify-center w-full">
          <button
            onClick={onConciergeClick}
            className="group relative flex flex-col items-center justify-center transition-transform active:scale-95 outline-none"
            title="Concierge rufen"
            data-tour="sidebar-concierge-bell"
          >
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/hotel-bell.png"
                  alt="Concierge Bell"
                  fill
                  className="object-contain drop-shadow-md"
                />
                <Bell className="absolute inset-0 w-full h-full text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
              </span>
            </div>

            <span
              className="mt-3 text-sm font-medium text-[#1b251d] dark:text-white transition-opacity"
              style={whiteStyle}
            >
              Concierge
            </span>
          </button>
        </div>

        {/* C. TRENNLINIE */}
        <div className="w-full h-0 bg-gray-200 dark:bg-gray-700 my-2 opacity-50"></div>

        {/* B. KONTAKT BUTTON (Gelb) - Breite auf 80% reduziert */}
        <Link href="/contact" className="w-[80%]">
          <button
          className="w-full bg-[#EDF85B] text-[#1b251d] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-md"
          data-tour="sidebar-contact"
          >
          <Mail className="w-5 h-5 text-[#1b251d]" />
          <span>Kontakt</span>
          </button>
        </Link>

        {/* C. TRENNLINIE */}
        <div className="w-full h-0 bg-gray-200 dark:bg-gray-700 my-4 opacity-50"></div>

        {/* 3. SETTINGS LINK (Footer) */}
        <div className="w-full border-t border-gray-100 dark:border-gray-700 p-4">
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/settings")
                ? "bg-[#1b251d] dark:bg-[#668273] text-white"
                : "text-gray-700 dark:text-white hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529]"
            }`}
            style={!isActive("/settings") ? whiteStyle : {}}
            data-tour="sidebar-settings"
          >
            <Settings className="h-5 w-5" style={!isActive("/settings") ? whiteStyle : {}} />
            <span style={!isActive("/settings") ? whiteStyle : {}}>{t.nav.settings}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}