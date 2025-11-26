"use client"

import type React from "react"
import { BarChart2, Home, PieChart, Settings, TrendingUp, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

export function Sidebar() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleConciergeClick = () => {
    const event = new CustomEvent("openConcierge")
    window.dispatchEvent(event)
  }

  const handleFeedbackSubmit = () => {
    console.log("[v0] Feedback submitted:", { rating, feedbackText })
    setShowFeedback(false)
    setRating(0)
    setFeedbackText("")
  }

  return (
    <>
      <div className="flex h-full w-64 flex-col border-r border-[#ede9e1] dark:border-gray-700 bg-[#f8f3ef] dark:bg-gray-800">
        <div className="flex h-16 items-center border-b border-[#ede9e1] dark:border-gray-700 px-6">
          <h1 className="text-xl font-serif tracking-tight text-[#1b251d] dark:text-gray-100">Kahane</h1>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            <NavItem href="/" icon={<Home className="h-5 w-5" />}>
              {language === "de"
                ? "Übersicht"
                : language === "fr"
                  ? "Aperçu"
                  : language === "it"
                    ? "Panoramica"
                    : "Overview"}
            </NavItem>
            <NavItem href="/simulation" icon={<BarChart2 className="h-5 w-5" />} active>
              {t.simulation.title}
            </NavItem>
            <NavItem href="/market" icon={<TrendingUp className="h-5 w-5" />}>
              {t.market.title}
            </NavItem>
            <NavItem href="/portfolio" icon={<PieChart className="h-5 w-5" />}>
              Portfolio
            </NavItem>
          </nav>

          <div className="flex justify-center my-8 py-8 border-y border-[#ede9e1]/50 dark:border-gray-700/50">
            <button
              onClick={handleConciergeClick}
              className="group relative"
              title={
                language === "de"
                  ? "Concierge rufen"
                  : language === "fr"
                    ? "Appeler le concierge"
                    : language === "it"
                      ? "Chiamare il concierge"
                      : "Call concierge"
              }
              aria-label={
                language === "de"
                  ? "Concierge rufen"
                  : language === "fr"
                    ? "Appeler le concierge"
                    : language === "it"
                      ? "Chiamare il concierge"
                      : "Call concierge"
              }
            >
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200/50 dark:border-amber-700/50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-10 h-10 text-[#8B4513] dark:text-amber-600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C10.8954 2 10 2.89543 10 4V5.07089C7.05369 5.55612 5 8.11429 5 11.1818V14L3 16V17H21V16L19 14V11.1818C19 8.11429 16.9463 5.55612 14 5.07089V4C14 2.89543 13.1046 2 12 2Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20H10Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <circle cx="12" cy="8" r="1.5" fill="white" opacity="0.5" />
                </svg>

                {/* Subtle ring animation */}
                <div
                  className="absolute inset-0 rounded-full bg-amber-200/30 dark:bg-amber-600/20 animate-ping"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <span className="absolute left-full ml-4 px-3 py-2 bg-[#1b251d] dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                {language === "de"
                  ? "Concierge rufen"
                  : language === "fr"
                    ? "Appeler le concierge"
                    : language === "it"
                      ? "Chiamare il concierge"
                      : "Call concierge"}
              </span>
            </button>
          </div>

          <nav className="space-y-2 px-4 mt-4">
            <Link
              href="/contact"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors group"
              title={
                language === "de"
                  ? "Jetzt kontaktieren"
                  : language === "fr"
                    ? "Contactez maintenant"
                    : language === "it"
                      ? "Contatta ora"
                      : "Contact now"
              }
            >
              <Phone className="h-5 w-5" />
              <span>
                {language === "de"
                  ? "Kontaktieren"
                  : language === "fr"
                    ? "Contacter"
                    : language === "it"
                      ? "Contattare"
                      : "Contact"}
              </span>
            </Link>

            <button
              onClick={() => setShowFeedback(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#4a5f52] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors group"
              title={
                language === "de"
                  ? "Feedback geben"
                  : language === "fr"
                    ? "Donner un avis"
                    : language === "it"
                      ? "Dare un feedback"
                      : "Give feedback"
              }
            >
              <MessageSquare className="h-5 w-5" />
              <span>Feedback</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-[#ede9e1] dark:border-gray-700 p-4">
          <nav className="space-y-1">
            <NavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
              {t.settings.title}
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
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-xl border border-[#ede9e1] dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif mb-2 text-[#1b251d] dark:text-gray-100">{t.feedback.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">{t.feedback.question}</p>

            <div className="flex gap-2 mb-6 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-2xl ${
                    rating >= star
                      ? "border-[#8B4513] dark:border-amber-600 bg-[#f8f3ef] dark:bg-amber-900/30 text-[#8B4513] dark:text-amber-600"
                      : "border-[#ede9e1] dark:border-gray-600 hover:border-[#8B4513] dark:hover:border-amber-600 hover:bg-[#f8f3ef] dark:hover:bg-amber-900/20 text-gray-300 dark:text-gray-600"
                  }`}
                  onClick={() => setRating(star)}
                  title={`${star} ${language === "de" ? (star !== 1 ? "Sterne" : "Stern") : language === "fr" ? (star !== 1 ? "étoiles" : "étoile") : language === "it" ? (star !== 1 ? "stelle" : "stella") : star !== 1 ? "stars" : "star"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-[#ede9e1] dark:border-gray-600 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4a5f52] focus:border-transparent resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              placeholder={t.feedback.comments}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 px-4 py-2 border border-[#ede9e1] dark:border-gray-600 rounded-lg hover:bg-[#f8f3ef] dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                {t.feedback.cancel}
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {t.feedback.send}
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
        active
          ? "bg-[#1b251d] dark:bg-gray-700 text-white"
          : "text-[#1b251d] dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  )
}
