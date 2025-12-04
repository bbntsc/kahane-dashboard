// kahane-dashboard-concierge 9/components/sidebar.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
// Star-Icon für den neuen Menüpunkt hinzugefügt
import { LayoutDashboard, TrendingUp, BarChart3, Settings, PieChart, FileText, Bell, Star, HelpCircle, Mail } from "lucide-react" // Mail Icon hinzugefügt
import { useSettings } from "@/lib/settings-context" // Importieren Sie useSettings
import { useTranslation } from "@/lib/i18n" // Importieren Sie useTranslation

interface SidebarProps {
  onConciergeClick: () => void
}

export function Sidebar({ onConciergeClick }: SidebarProps) {
  const pathname = usePathname()
  
  // Hooks zum Laden der Sprache und Übersetzungen
  const { language } = useSettings()
  const t = useTranslation(language)

  const navigation = [
    // ENTFERNT: Überblick (Overview)
    { name: t.nav.simulation, href: "/simulation", icon: BarChart3, target: "sidebar-simulation" },
    { name: t.nav.market, href: "/market", icon: TrendingUp, target: "sidebar-market" },
    // ENTFERNT: Portfolio
    { name: t.nav.faq, href: "/faq", icon: HelpCircle, target: "sidebar-faq" }, 
    { name: t.nav.feedback, href: "/feedback", icon: Star, target: "sidebar-feedback" },
    // NEU: Kontakt Link in die Navigation verschoben
    { name: t.nav.contact, href: "/contact", icon: Mail, target: "sidebar-contact" }, 
  ]

  const isActive = (href: string) => {
    // Wenn auf der Landing Page, markiere Simulation als aktiv
    if (href === "/simulation" && pathname === "/") return true 
    return pathname.startsWith(href)
  }

  return (
    // Hintergrundfarbe und Border für Dark Mode anpassen
    <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b251d] overflow-y-auto h-full z-10"> 
      {/* Header (Kahane zu Gutmann Concierge) */}
      <div className="flex flex-col h-16 justify-center px-6 border-b border-gray-100 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#f8f3ef] font-serif tracking-tight leading-none">Gutmann</h1>
        <div className="text-xs tracking-[0.1em] uppercase text-gray-700 dark:text-[#f8f3ef] opacity-80 mt-0.5">Concierge</div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          // Da /simulation der neue Startpunkt im Menü ist, leiten wir '/' darauf um.
          const finalHref = item.href === "/" ? "/simulation" : item.href; 
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={finalHref}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active 
                  // Aktiver Link: Hintergrund ändert sich nicht im Dark Mode, Text bleibt weiß
                  ? "bg-[#668273] text-white shadow-sm" 
                  // Inaktiver Link: Textfarbe für Dark Mode explizit auf hell setzen
                  : "text-gray-700 dark:text-gray-300 hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529] hover:text-[#1b251d] dark:hover:text-[#f8f3ef]"
              }`}
              data-tour={item.target} // Hinzufügen des data-tour Attributs
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* --- DER CONCIERGE BUTTON (Zurück zum ursprünglichen Gold-Look) --- */}
      <div className="px-6 py-6 flex justify-center">
        <button 
          onClick={onConciergeClick}
          className="group relative flex flex-col items-center justify-center transition-transform active:scale-95 outline-none"
          title="Concierge rufen"
          data-tour="sidebar-concierge-bell" // Hinzufügen des data-tour Attributs
        >
          {/* Kreis-Hintergrund mit schönem Schatten und Farbe (Gold-Look wiederhergestellt) */}
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
               {/* Icon Farbe auf Gold/Amber gesetzt */}
               <Bell className="absolute inset-0 w-full h-full text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" /> 
            </div>
            
            {/* Kleiner Ping-Indikator */}
            <span className="absolute top-1 right-1 flex h-4 w-4">
              {/* Ping-Farbe auf Gold/Amber gesetzt */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>
          
          {/* Textfarbe für Dark Mode anpassen */}
          <span className="mt-3 text-sm font-medium text-[#1b251d] dark:text-[#f8f3ef] opacity-70 group-hover:opacity-100 transition-opacity">
            Concierge
          </span>
        </button>
      </div>
      
      {/* Footer / Settings */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
             isActive("/settings") 
                // Aktiver Link: Hintergrund ändert sich nicht im Dark Mode, Text bleibt weiß
                ? "bg-[#1b251d] dark:bg-[#668273] text-white" 
                // Inaktiver Link: Textfarbe für Dark Mode explizit auf hell setzen
                : "text-gray-700 dark:text-gray-300 hover:bg-[#f8f3ef] dark:hover:bg-[#2a3529]"
          }`}
          data-tour="sidebar-settings" // Hinzufügen des data-tour Attributs
        >
          <Settings className="h-5 w-5" />
          {t.nav.settings} {/* DYNAMISCHE ÜBERSETZUNG */}
        </Link>
      </div>
    </div>
  )
}