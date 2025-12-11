"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useSettings, type Language } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 


interface BankGutmannHeaderProps {
  onLogoClick?: () => void
  className?: string 
}

// BankGutmannHeader Komponente mit onLogoClick Handler
export function BankGutmannHeader({ onLogoClick, className }: BankGutmannHeaderProps) {
  // State für mobiles Menü und Sprachmenü 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // State für Sprachwahl-Dropdown
  const [languageOpen, setLanguageOpen] = useState(false)
  // Einstellungen und Übersetzungen
  const { language, setLanguage } = useSettings()
  // Übersetzungs-Hook
  const t = useTranslation(language)

  // Sprachoptionen
  const languages: { code: Language; name: string }[] = [
    { code: "de" as Language, name: t.languages.de },
    { code: "en" as Language, name: t.languages.en },
    { code: "fr" as Language, name: t.languages.fr },
    { code: "it" as Language, name: t.languages.it },
  ]

  // Bedingte Wrapper-Komponente: Link oder div je nach onLogoClick
  const LogoWrapper = onLogoClick ? 'div' : Link;

  // Design des Headers
  return (
    <header className={`bg-[#f8f3ef] dark:bg-[#1b251d] border-b border-[#ede9e1] dark:border-[#404a3f] relative z-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between relative">
          <div className="flex items-center gap-8">
            <button
              className="p-2 hover:bg-[#ede9e1] dark:hover:bg-[#2a3529] rounded-md transition-colors lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-[#1b251d] dark:text-[#f8f3ef]" />
            </button>
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            
            {/* KORREKTUR: Verwende bedingte Props und Klick-Handler */}
            <LogoWrapper 
              {...(onLogoClick ? { role: 'button', tabIndex: 0 } : { href: "/" })} 
              className="block text-center cursor-pointer"
              onClick={(e) => { 
                  // Nur ausführen, wenn der Handler vorhanden ist (d.h. auf der /simulation Seite)
                  if (onLogoClick) {
                      onLogoClick();
                  }
              }}
            >
              <div className="font-serif italic text-2xl text-[#1b251d] dark:text-[#f8f3ef] leading-tight">
                Gutmann
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#1b251d] dark:text-[#f8f3ef] uppercase mt-0.5">
                Private Bankers
              </div>
            </LogoWrapper>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6 text-sm justify-end">
            <nav className="hidden lg:flex items-center gap-6">
              <a
                href="#"
                className="text-[#1b251d] dark:text-[#f8f3ef] hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                {t.nav.about}
              </a>
              
              {/* Sprachwahl Dropdown */}
              <div className="relative" data-tour="header-language-switch">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                  <span className="text-[#1b251d] dark:text-[#f8f3ef] uppercase">{language}</span>
                  <ChevronDown className="h-3 w-3 text-[#1b251d] dark:text-[#f8f3ef]" />
                </button>

                {languageOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#2a3529] border border-[#ede9e1] dark:border-[#404a3f] rounded shadow-lg py-2 min-w-[120px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLanguageOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ef] dark:hover:bg-[#1b251d] transition-colors ${
                          language === lang.code ? "bg-[#f8f3ef] dark:bg-[#1b251d]" : ""
                        }`}
                        >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#ede9e1] dark:border-[#404a3f]">
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-[#1b251d] dark:text-[#f8f3ef] hover:opacity-70 transition-opacity py-2">
                {t.nav.about}
              </a>
              {/* ZUSÄTZLICH: Sprachauswahl im mobilen Menü */}
              <div className="relative pt-2">
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  {t.settings.language}
                </span>
                <div className="flex flex-col gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        language === lang.code
                          ? "bg-[#f8f3ef] dark:bg-[#2a3529] text-[#1b251d] dark:text-[#f8f3ef]"
                          : "text-[#1b251d] dark:text-[#f8f3ef] hover:bg-[#ede9e1] dark:hover:bg-[#2a3529]"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}