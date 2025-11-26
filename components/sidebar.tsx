"use client"

import type React from "react"
import { BarChart2, Home, PieChart, Settings, TrendingUp, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export function Sidebar() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  const handleConciergeClick = () => {
    const event = new CustomEvent("openConcierge")
    window.dispatchEvent(event)
  }

  const handleFeedbackSubmit = () => {
    alert(`Vielen Dank für Ihr Feedback! Bewertung: ${rating} Sterne`)
    setShowFeedback(false)
    setRating(0)
    setFeedbackText("")
  }

  return (
    <>
      <div className="flex h-full w-64 flex-col border-r border-[#ede9e1] bg-[#f8f3ef]">
        <div className="flex h-16 items-center border-b border-[#ede9e1] px-6">
          <h1 className="text-xl font-serif tracking-tight text-[#1b251d]">Kahane</h1>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            <NavItem href="/" icon={<Home className="h-5 w-5" />}>
              Übersicht
            </NavItem>
            <NavItem href="/simulation" icon={<BarChart2 className="h-5 w-5" />} active>
              Simulation
            </NavItem>
            <NavItem href="/market" icon={<TrendingUp className="h-5 w-5" />}>
              Marktanalyse
            </NavItem>
            <NavItem href="/portfolio" icon={<PieChart className="h-5 w-5" />}>
              Portfolio
            </NavItem>
          </nav>

          <div className="flex justify-center my-8 py-8 border-y border-[#ede9e1]/50">
            <button
              onClick={handleConciergeClick}
              className="group relative"
              title="Concierge rufen"
              aria-label="Concierge rufen"
            >
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Image
                  src="/images/hotel-bell.jpg"
                  alt="Concierge Bell"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                Concierge rufen
              </span>
            </button>
          </div>

          <nav className="space-y-2 px-4 mt-4">
            <Link
              href="/contact"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] hover:bg-white rounded-md transition-colors group"
              title="Jetzt kontaktieren"
            >
              <Phone className="h-5 w-5" />
              <span>Kontaktieren</span>
            </Link>

            <button
              onClick={() => setShowFeedback(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] hover:bg-white rounded-md transition-colors group"
              title="Feedback geben"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Feedback</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-[#ede9e1] p-4">
          <nav className="space-y-1">
            <NavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
              Einstellungen
            </NavItem>
          </nav>
        </div>
      </div>

      {showFeedback && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowFeedback(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl border border-[#ede9e1]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif mb-2 text-[#1b251d]">Ihr Feedback</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Wie hat Ihnen die Simulation gefallen?</p>

            <div className="flex gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-2xl ${
                    rating >= star
                      ? "border-[#8B4513] bg-[#f8f3ef] text-[#8B4513]"
                      : "border-[#ede9e1] hover:border-[#8B4513] hover:bg-[#f8f3ef] text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  title={`${star} Stern${star !== 1 ? "e" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-[#ede9e1] rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4a5f52] focus:border-transparent resize-none text-sm"
              rows={4}
              placeholder="Ihre Anmerkungen (optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 px-4 py-2 border border-[#ede9e1] rounded-lg hover:bg-[#f8f3ef] transition-colors text-sm font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Senden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-[#1b251d] text-white" : "text-[#1b251d] hover:bg-white"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  )
}
