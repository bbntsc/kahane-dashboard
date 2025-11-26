"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"

export function BankGutmannHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("DE")

  const languages = [
    { code: "DE", name: "Deutsch" },
    { code: "EN", name: "English" },
    { code: "FR", name: "Français" },
  ]

  return (
    <header className="bg-[#f8f3ef] border-b border-[#ede9e1] relative z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between relative">
          <div className="flex items-center gap-8">
            <button
              className="p-2 hover:bg-[#ede9e1] rounded-md transition-colors lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-[#1b251d]" />
            </button>
          </div>

          {/* Centered Logo */}
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

          {/* Right Section */}
          <div className="flex items-center gap-6 text-sm justify-end">
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Über uns
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Kontakt
              </a>

              <div className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <span className="text-[#1b251d]">{selectedLanguage}</span>
                  <ChevronDown className="h-3 w-3 text-[#1b251d]" />
                </button>

                {languageOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#ede9e1] rounded shadow-lg py-2 min-w-[120px]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code)
                          setLanguageOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ef] transition-colors ${
                          selectedLanguage === lang.code ? "bg-[#f8f3ef]" : ""
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
          <div className="lg:hidden py-4 border-t border-[#ede9e1]">
            <nav className="flex flex-col gap-3">
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
