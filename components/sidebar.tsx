"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
// Star-Icon für den neuen Menüpunkt hinzugefügt
import { LayoutDashboard, TrendingUp, BarChart3, Settings, PieChart, FileText, Bell, Star, HelpCircle } from "lucide-react"

interface SidebarProps {
  onConciergeClick: () => void
}

export function Sidebar({ onConciergeClick }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Übersicht", href: "/", icon: LayoutDashboard },
    { name: "Simulation", href: "/simulation", icon: BarChart3 },
    { name: "Marktanalyse", href: "/market", icon: TrendingUp },
    { name: "Portfolio", href: "/portfolio", icon: PieChart },
    // { name: "Reports", href: "/reports", icon: FileText }, // Reports entfernt
    { name: "FAQ/Hilfe", href: "/faq", icon: HelpCircle }, // FAQ/Hilfe hinzugefügt
    // NEU: Feedback-Link hinzugefügt
    { name: "Feedback", href: "/feedback", icon: Star },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === href
    // Stellt sicher, dass /faq als aktiv markiert wird, wenn die Seite besucht wird
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto h-full">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 font-serif tracking-tight">Kahane</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active 
                  ? "bg-[#1b251d] text-white shadow-sm" 
                  : "text-gray-700 hover:bg-[#f8f3ef] hover:text-[#1b251d]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* --- DER CONCIERGE BUTTON --- */}
      <div className="px-6 py-6 flex justify-center">
        <button 
          onClick={onConciergeClick}
          className="group relative flex flex-col items-center justify-center transition-transform active:scale-95 outline-none"
          title="Concierge rufen"
        >
          {/* Kreis-Hintergrund mit schönem Schatten und Farbe */}
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
            
            {/* Versuch das Bild zu laden, Fallback auf Icon */}
            <div className="relative w-12 h-12">
               {/* Wir nutzen Next/Image, falls das Bild existiert. Falls nicht, wird das Icon angezeigt */}
               <Image 
                 src="/images/hotel-bell.png" 
                 alt="Concierge Bell"
                 fill
                 className="object-contain drop-shadow-md"
                 onError={(e) => {
                   // Fallback: Wenn Bild nicht gefunden wird, verstecken wir es (CSS-Trick)
                   e.currentTarget.style.display = 'none';
                 }}
               />
               {/* Fallback Icon, falls Bild nicht lädt - positioniert hinter dem Bild */}
               <Bell className="absolute inset-0 w-full h-full text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" /> 
            </div>
            
            {/* Kleiner Ping-Indikator */}
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>
          
          <span className="mt-3 text-sm font-medium text-[#1b251d] opacity-70 group-hover:opacity-100 transition-opacity">
            Concierge
          </span>
        </button>
      </div>
      
      {/* Footer / Settings */}
      <div className="border-t border-gray-100 p-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
             isActive("/settings") 
                ? "bg-[#1b251d] text-white" 
                : "text-gray-700 hover:bg-[#f8f3ef]"
          }`}
        >
          <Settings className="h-5 w-5" />
          Einstellungen
        </Link>
      </div>
    </div>
  )
}