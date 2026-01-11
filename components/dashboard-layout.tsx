"use client"

import { useState, useEffect } from "react"
import type React from "react" 
import { Sidebar } from "@/components/base/sidebar"
import { ConciergeController } from "@/components/concierge-guide" 
import { BankGutmannHeader } from "@/components/base/bank-gutmann-header"
import { Menu, X } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // State für die gelbe Umrandung
  const [isSidebarHighlighted, setIsSidebarHighlighted] = useState(false)

  // Effekt, um auf Highlights aus der Simulation/Tour zu reagieren
  useEffect(() => {
    const handleHighlight = (event: any) => {
      // Wenn das Event 'true' sendet, leuchtet die Sidebar
      setIsSidebarHighlighted(!!event.detail?.active);
    };

    window.addEventListener('highlightSidebar', handleHighlight);
    return () => window.removeEventListener('highlightSidebar', handleHighlight);
  }, []);

  const openConciergeIntro = () => {
    setSidebarOpen(false); 
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('startConciergeIntro'));
    }
  }
  
  const openConciergeHelp = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bellClick')); 
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      
      <ConciergeController />

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`fixed inset-y-0 left-0 w-64 bg-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
           <div className="h-full relative">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="absolute top-4 right-4 text-gray-500 z-10 lg:hidden hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
              {/* Mobile Sidebar mit Highlight-Support */}
              <Sidebar 
                onConciergeClick={openConciergeHelp} 
                isHighlighted={isSidebarHighlighted}
              /> 
           </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {/* Hier wird die Prop isHighlighted übergeben */}
        <Sidebar 
          onConciergeClick={openConciergeHelp} 
          isHighlighted={isSidebarHighlighted}
        /> 
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        <BankGutmannHeader 
            className="z-10" 
            onLogoClick={openConciergeIntro} 
        />

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-[#ede9e1] bg-white sticky top-0 z-10">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-900">
                <Menu className="h-6 w-6" />
            </button>
            <span className="ml-4 font-bold text-lg font-serif text-[#1b251d]">Gutmann Concierge</span>
        </div>

        {/* Seiteninhalt */}
        <main className="flex-1 py-2 px-4 sm:px-6 lg:px-8">
            {children}
        </main>
      </div>
    </div>
  )
}