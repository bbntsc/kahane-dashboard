// components/base/bank-gutmann-header.tsx
"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image" 
import { useSettings, type Language } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import logo from "@/lib/logo.svg" 

interface BankGutmannHeaderProps {
  onLogoClick?: () => void
  className?: string 
}

export function BankGutmannHeader({ onLogoClick, className }: BankGutmannHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const { language, setLanguage } = useSettings()
  const t = useTranslation(language)

  const languages: { code: Language; name: string }[] = [
    { code: "de" as Language, name: t.languages.de },
    { code: "en" as Language, name: t.languages.en },
    { code: "fr" as Language, name: t.languages.fr },
    { code: "it" as Language, name: t.languages.it },
  ]

  // Handler für den Logo-Klick, um die Tour neu zu starten
  const handleLogoAction = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      // Wenn kein onLogoClick übergeben wurde, lösen wir den Event für den Tour-Neustart aus
      window.dispatchEvent(new CustomEvent('startConciergeIntro'));
    }
  };

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

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div 
              role="button" 
              tabIndex={0}
              className="block text-center cursor-pointer"
              onClick={handleLogoAction} // Startet die Hausführung von vorn
            >
              <Image src={logo} alt="Gutmann Private Bankers" className="h-12 w-auto dark:invert" priority />
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm justify-end">
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-[#1b251d] dark:text-[#f8f3ef] hover:opacity-70 transition-opacity whitespace-nowrap">
                {t.nav.about}
              </a>
              <div className="relative" data-tour="header-language-switch">
                <button onClick={() => setLanguageOpen(!languageOpen)} className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                  <span className="text-[#1b251d] dark:text-[#f8f3ef] uppercase">{language}</span>
                  <ChevronDown className="h-3 w-3 text-[#1b251d] dark:text-[#f8f3ef]" />
                </button>
                {languageOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#2a3529] border border-[#ede9e1] dark:border-[#404a3f] rounded shadow-lg py-2 min-w-[120px] z-50">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => { setLanguage(lang.code); setLanguageOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ef] dark:hover:bg-[#1b251d] transition-colors ${language === lang.code ? "bg-[#f8f3ef] dark:bg-[#1b251d]" : ""}`}>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}