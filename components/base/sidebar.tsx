"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { TrendingUp, BarChart3, Settings, Star, HelpCircle, Mail, Bell } from "lucide-react"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 

interface SidebarProps {
  onConciergeClick: () => void
  isHighlighted?: boolean // Neue Prop für die gelbe Umrandung
}

export function Sidebar({ onConciergeClick, isHighlighted = false }: SidebarProps) {
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
      className={`flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b251d] overflow-y-auto h-full z-10 transition-all duration-500 ${
        // Die Logik für den gelben Rahmen (ähnlich wie im Video/Beispiel)
        isHighlighted 
          ? "ring-4 ring-inset ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] z-50" 
          : ""
      }`}
    > 
      {/* Header "Gutmann Concierge" */}
      <div className="flex flex-col h-16 justify-center px-6 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#f8f3ef] font-serif tracking-tight leading-none">Gutmann</h1>
        <div className="text-xs tracking-[0.1em] uppercase text-gray-700 dark:text-[#f8f3ef] opacity-80 mt-0.5">Concierge</div>
      </div>

      {/* Navigation */}
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
                active 
                  ? "bg-[#668273] text-white shadow-sm" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529] hover:text-[#1b251d] dark:hover:text-[#f8f3ef]"
              }`}
              data-tour={item.target}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Concierge Button */}
      <div className="px-6 py-6 flex justify-center">
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
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
               <Bell className="absolute inset-0 w-full h-full text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" /> 
            </div>
            
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>
          
          <span className="mt-3 text-sm font-medium text-[#1b251d] dark:text-[#f8f3ef] opacity-70 group-hover:opacity-100 transition-opacity">
            Concierge
          </span>
        </button>
      </div>
      
      {/* Footer mit Einstellungen */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
             isActive("/settings") 
                ? "bg-[#1b251d] dark:bg-[#668273] text-white" 
                : "text-gray-700 dark:text-gray-300 hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529]"
          }`}
          data-tour="sidebar-settings" 
        >
          <Settings className="h-5 w-5" />
          {t.nav.settings}
        </Link>
      </div>
    </div>
  )
}