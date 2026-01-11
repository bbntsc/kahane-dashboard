"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BarChart3, TrendingUp, HelpCircle, Star, Mail, Settings, Bell } from "lucide-react"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 

interface SidebarProps {
  onConciergeClick: () => void
}

export function Sidebar({ onConciergeClick }: SidebarProps) {
  const pathname = usePathname()
  const { language } = useSettings()
  const t = useTranslation(language)

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

  return (
    <div 
      className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto h-full z-10"
      data-tour="sidebar-main" /* Umrandet die gesamte Sidebar */
    > 
      <div className="flex flex-col items-center justify-center py-6">
        <h1 className="text-4xl font-script text-[#1b251d] mb-0 leading-none">Gutmann</h1>
        <div className="flex items-center justify-center my-2">
          <div className="w-8 h-px bg-[#1b251d] opacity-50" />
          <div className="w-1 h-1 mx-1.5 rounded-full bg-[#1b251d] opacity-50" />
          <div className="w-8 h-px bg-[#1b251d] opacity-50" />
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#1b251d] mt-0">CONCIERGE</div>
      </div>

      <nav className="mt-6 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const finalHref = item.href === "/" ? "/simulation" : item.href; 
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={finalHref}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active ? "bg-[#668273] text-white shadow-sm" : "text-gray-700 hover:bg-[#f8f3ef]"
              }`}
              data-tour={item.target} /* Umrandet einzelne Nav-Punkte wie Simulation */
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-6 flex justify-center">
        <button onClick={onConciergeClick} className="group flex flex-col items-center" data-tour="sidebar-concierge-bell">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200 shadow-lg">
            <Image src="/images/hotel-bell.png" alt="Bell" width={48} height={48} className="object-contain" />
          </div>
          <span className="mt-3 text-sm font-medium opacity-70">Concierge</span>
        </button>
      </div>
      
      <div className="border-t border-gray-100 p-4">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#f8f3ef]" data-tour="sidebar-settings">
          <Settings className="h-5 w-5" />
          {t.nav.settings}
        </Link>
      </div>
    </div>
  )
}