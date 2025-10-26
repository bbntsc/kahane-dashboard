"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"

export function BankGutmannHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[#f8f3ef] border-b border-[#ede9e1] relative z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Left: Menu and Navigation */}
          <div className="flex items-center gap-8 flex-1">
            <button
              className="p-2 hover:bg-[#ede9e1] rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-[#1b251d]" />
            </button>
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

          {/* Center: Logo - No absolute positioning */}
          <div className="flex-shrink-0 px-8">
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

          {/* Right: Navigation */}
          <div className="flex items-center gap-6 text-sm flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Über uns
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Kontakt
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                Karriere
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity whitespace-nowrap">
                ESG
              </a>

              {/* Language Selector */}
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-[#1b251d]">DE</span>
                <ChevronDown className="h-3 w-3 text-[#1b251d]" />
              </div>

              {/* Plus Button */}
              <button className="w-7 h-7 rounded-full border border-[#1b251d] flex items-center justify-center text-[#1b251d] hover:bg-[#1b251d] hover:text-white transition-colors flex-shrink-0">
                <span className="text-lg leading-none">+</span>
              </button>

              {/* Login Button */}
              <button className="px-4 py-1.5 rounded-full border border-[#1b251d] text-[#1b251d] text-sm hover:bg-[#1b251d] hover:text-white transition-colors whitespace-nowrap">
                login
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden px-4 py-1.5 rounded-full border border-[#1b251d] text-[#1b251d] text-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#ede9e1]">
            <nav className="flex flex-col gap-3">
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
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                Karriere
              </a>
              <a href="#" className="text-[#1b251d] hover:opacity-70 transition-opacity py-2">
                ESG
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
