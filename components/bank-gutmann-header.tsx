"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useSettings } from "@/lib/settings-context"
import { useTranslation, type Language } from "@/lib/i18n"
import Link from "next/link"

export function BankGutmannHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const { language, setLanguage } = useSettings()
  const t = useTranslation(language)

  const languages: { code: Language; name: string }[] = [
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
  ]

  return (
    <header className="bg-[#f8f3ef] dark:bg-[#1b251d] border-b border-[#ede9e1] dark:border-[#404a3f] relative z-50">
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
            <Link href="/" className="block text-center">
              <div
                className="font-serif italic text-2xl text-[#1b251d] dark:text-[#f8f3ef] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Gutmann
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#1b251d] dark:text-[#f8f3ef] uppercase mt-0.5">
                Private Bankers
              </div>
            </Link>
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
              <Link
                href="/contact"
                className="text-[#1b251d] dark:text-[#f8f3ef] hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                {t.nav.contact}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                >
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
              <Link
                href="/contact"
                className="text-[#1b251d] dark:text-[#f8f3ef] hover:opacity-70 transition-opacity py-2"
              >
                {t.nav.contact}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
