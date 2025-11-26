"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"

export function BankGutmannHeader() {
  // State für das mobile Menü (offen/geschlossen)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[#f8f3ef] border-b border-[#ede9e1] relative z-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Haupt-Navigationsleiste (relative Positionierung für Logo) */}
        <div className="flex h-20 items-center justify-between relative">
          {/* Linke Sektion: Mobiles Menü-Icon & Desktop-Links */}
          <div className="flex items-center gap-8">
            {/* Mobiler Menü-Button (Hamburger) */}
            <button
              className="p-2 hover:bg-[#ede9e1] rounded-md transition-colors lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-[#1b251d]" />
            </button>
            {/* Desktop-Navigation (Links) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Private Banking
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Institutional Banking
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Investieren
              </a>
            </nav>
          </div>

          {/* Mittlere Sektion: Absolut zentriertes Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="/" className="block text-center">
              <div
                className="font-serif italic text-2xl text-[#1b251d] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Gutmann
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#1b251d] uppercase mt-0.5">Private Bankers</div>
            </a>
          </div>

          {/* Rechte Sektion: Desktop-Links & Login */}
          <div className="flex items-center gap-6 text-sm justify-end">
            {/* Desktop-Navigation (Rechts) */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Über uns
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Kontakt
              </a>

              {/* Language Selector */}
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-[#1b251d]">DE</span>
                <ChevronDown className="h-3 w-3 text-[#1b251d]" />
              </div>
            </nav>
          </div>
        </div>

        {/* Mobiles Dropdown-Menü (nur sichtbar, wenn 'mobileMenuOpen' true ist) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#ede9e1]">
            <nav className="flex flex-col gap-3">
              {/* Mobile Navigationslinks */}
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Private Banking
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Institutional Banking
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Investieren
              </a>
              <div className="border-t border-[#ede9e1] my-2"></div>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Über uns
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Kontakt
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
