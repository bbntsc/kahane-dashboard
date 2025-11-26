"use client"

import { Settings, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function AppSidebar() {
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <>
      <aside className="fixed left-0 top-20 bottom-0 w-20 bg-[#f8f3ef] border-r border-[#ede9e1] flex flex-col items-center py-8 gap-6 z-40">
        {/* Traditional Hotel Bell Icon */}
        <button
          className="group relative"
          onClick={() => {
            const event = new CustomEvent("openConcierge")
            window.dispatchEvent(event)
          }}
          title="Concierge rufen"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-[#ede9e1] transition-colors">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#1b251d]"
            >
              <path d="M6 19h12M12 3v2" />
              <path d="M5 19c0-3.866 3.134-7 7-7s7 3.134 7 7" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="absolute left-full ml-4 px-3 py-1 bg-[#1b251d] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Concierge
          </span>
        </button>

        {/* Contact Button */}
        <Link
          href="/contact"
          className="group relative w-14 h-14 flex items-center justify-center rounded-full hover:bg-[#ede9e1] transition-colors"
          title="Jetzt kontaktieren"
        >
          <Phone className="w-6 h-6 text-[#1b251d]" />
          <span className="absolute left-full ml-4 px-3 py-1 bg-[#1b251d] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Kontakt
          </span>
        </Link>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="group relative w-14 h-14 flex items-center justify-center rounded-full hover:bg-[#ede9e1] transition-colors"
          title="Feedback geben"
        >
          <MessageSquare className="w-6 h-6 text-[#1b251d]" />
          <span className="absolute left-full ml-4 px-3 py-1 bg-[#1b251d] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Feedback
          </span>
        </button>

        <div className="flex-1" />

        {/* Settings Button */}
        <Link
          href="/settings"
          className="group relative w-14 h-14 flex items-center justify-center rounded-full hover:bg-[#ede9e1] transition-colors"
          title="Einstellungen"
        >
          <Settings className="w-6 h-6 text-[#1b251d]" />
          <span className="absolute left-full ml-4 px-3 py-1 bg-[#1b251d] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Einstellungen
          </span>
        </Link>
      </aside>

      {/* Feedback Modal */}
      {showFeedback && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={() => setShowFeedback(false)}
        >
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-serif mb-4 text-[#1b251d]">Ihr Feedback</h2>
            <p className="text-[#6b7280] mb-6">Wie hat Ihnen die Simulation gefallen?</p>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="w-12 h-12 rounded-full border-2 border-[#ede9e1] hover:border-[#1b251d] hover:bg-[#f8f3ef] transition-colors flex items-center justify-center text-lg"
                  onClick={() => {
                    alert(`Vielen Dank für Ihre Bewertung: ${rating} Sterne`)
                    setShowFeedback(false)
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-[#ede9e1] rounded p-3 mb-4 focus:outline-none focus:border-[#1b251d] resize-none"
              rows={4}
              placeholder="Ihre Anmerkungen (optional)"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 px-4 py-2 border border-[#ede9e1] rounded hover:bg-[#f8f3ef] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  alert("Vielen Dank für Ihr Feedback!")
                  setShowFeedback(false)
                }}
                className="flex-1 px-4 py-2 bg-[#1b251d] text-white rounded hover:opacity-90 transition-opacity"
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
