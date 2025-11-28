"use client"

import type React from "react"
import { BarChart2, Home, PieChart, Settings, TrendingUp, Phone } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"

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
            {t.nav.overview}
          </NavItem>
          <NavItem href="/simulation" icon={<BarChart2 className="h-5 w-5" />}>
            {t.simulation.title}
          </NavItem>
          <NavItem href="/market" icon={<TrendingUp className="h-5 w-5" />}>
            {t.market.title}
          </NavItem>
          <NavItem href="/portfolio" icon={<PieChart className="h-5 w-5" />}>
            Portfolio
          </NavItem>
        </nav>

        <div className="flex justify-center my-8 py-8 border-y border-[#ede9e1]/50 dark:border-gray-700/50">
          <button
            onClick={handleConciergeClick}
            className="group relative"
            title={t.concierge.callConcierge}
            aria-label={t.concierge.callConcierge}
          >
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200/50 dark:border-amber-700/50">
              <Image src="/images/hotel-bell.png" alt="Hotel Bell" width={52} height={52} className="object-contain" />

              <div
                className="absolute inset-0 rounded-full bg-amber-200/30 dark:bg-amber-600/20 animate-ping"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
              {t.concierge.callConcierge}
            </span>
          </button>
        </div>

        <nav className="space-y-2 px-4 mt-4">
          <Link
            href="/contact"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Phone className="h-5 w-5" />
            <span>{t.nav.contact}</span>
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
