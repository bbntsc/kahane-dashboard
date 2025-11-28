"use client"

import { Settings, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function AppSidebar() {
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <>
      <aside className="fixed left-0 top-20 bottom-0 w-20 bg-white/80 backdrop-blur-sm border-r border-[#ede9e1] flex flex-col items-center py-8 gap-8 z-40">
        {/* Spacer to center bell */}
        <div className="flex-1" />

        <button
          className="group relative"
          onClick={() => {
            const event = new CustomEvent("openConcierge")
            window.dispatchEvent(event)
          }}
          title="Concierge rufen"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f8f3ef] hover:bg-[#ede9e1] transition-all duration-300 shadow-sm hover:shadow-md">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#8B4513]"
            >
              <path d="M6 19h12M12 3v2" />
              <path d="M5 19c0-3.866 3.134-7 7-7s7 3.134 7 7" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Concierge
          </span>
        </button>

        <div className="flex-1" />

        <Link
          href="/contact"
          className="group relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#f8f3ef] transition-colors"
          title="Jetzt kontaktieren"
        >
          <Phone className="w-5 h-5 text-[#4a5f52]" />
          <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Kontakt
          </span>
        </Link>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="group relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#f8f3ef] transition-colors"
          title="Feedback geben"
        >
          <MessageSquare className="w-5 h-5 text-[#4a5f52]" />
          <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Feedback
          </span>
        </button>

        {/* Settings Button */}
        <Link
          href="/settings"
          className="group relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#f8f3ef] transition-colors mb-4"
          title="Einstellungen"
        >
          <Settings className="w-5 h-5 text-[#4a5f52]" />
          <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Einstellungen
          </span>
        </Link>
      </aside>

      {/* Feedback Modal */}
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
            <p className="text-[#6b7280] mb-6 text-sm">Wie hat Ihnen die Simulation gefallen?</p>

            <div className="flex gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="w-12 h-12 rounded-full border-2 border-[#ede9e1] hover:border-[#8B4513] hover:bg-[#f8f3ef] transition-all flex items-center justify-center text-xl text-[#8B4513]"
                  onClick={() => {
                    alert(`Vielen Dank für Ihre Bewertung: ${rating} Sterne`)
                    setShowFeedback(false)
                  }}
                  title={`${rating} Stern${rating !== 1 ? "e" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-[#ede9e1] rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4a5f52] focus:border-transparent resize-none text-sm"
              rows={4}
              placeholder="Ihre Anmerkungen (optional)"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 px-4 py-2 border border-[#ede9e1] rounded-lg hover:bg-[#f8f3ef] transition-colors text-sm font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  alert("Vielen Dank für Ihr Feedback!")
                  setShowFeedback(false)
                }}
                className="flex-1 px-4 py-2 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors text-sm font-medium"
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
