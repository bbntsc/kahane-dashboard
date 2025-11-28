"use client"

import type React from "react"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { Sidebar } from "@/components/sidebar"
import { motion } from "framer-motion"
import { CheckCircle2, Star } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [comments, setComments] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Feedback submitted:", { rating, comments })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-screen bg-[#f8f3ef] dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BankGutmannHeader />
          <main className="flex-1 overflow-auto flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center max-w-md"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>

              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                {t.feedback.thanks}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {language === "de"
                  ? "Ihre Rückmeldung hilft uns, das Erlebnis stetig zu verbessern."
                  : language === "fr"
                    ? "Vos commentaires nous aident à améliorer constamment l'expérience."
                    : language === "it"
                      ? "Il tuo feedback ci aiuta a migliorare costantemente l'esperienza."
                      : "Your feedback helps us continuously improve the experience."}
              </p>

              <Link href="/simulation">
                <button className="px-8 py-3 bg-[#4a5f52] hover:bg-[#3a4f42] text-white rounded-lg transition-colors font-medium shadow-md">
                  {language === "de"
                    ? "Zurück zur Simulation"
                    : language === "fr"
                      ? "Retour à la simulation"
                      : language === "it"
                        ? "Torna alla simulazione"
                        : "Back to Simulation"}
                </button>
              </Link>
            </motion.div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f8f3ef] dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BankGutmannHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
            >
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                {t.feedback.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{t.feedback.question}</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    {language === "de"
                      ? "Ihre Bewertung"
                      : language === "fr"
                        ? "Votre évaluation"
                        : language === "it"
                          ? "La tua valutazione"
                          : "Your rating"}
                  </label>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#4a5f52] rounded-full p-2"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            (hoveredRating !== null && star <= hoveredRating) ||
                            (hoveredRating === null && rating !== null && star <= rating)
                              ? "fill-[#8B4513] text-[#8B4513]"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.feedback.comments}
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={
                      language === "de"
                        ? "Teilen Sie uns Ihre Gedanken mit..."
                        : language === "fr"
                          ? "Partagez vos pensées..."
                          : language === "it"
                            ? "Condividi i tuoi pensieri..."
                            : "Share your thoughts..."
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <Link href="/simulation" className="flex-1">
                    <button
                      type="button"
                      className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                    >
                      {t.feedback.cancel}
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={!rating}
                    className="flex-1 py-3 bg-[#4a5f52] text-white rounded-lg hover:bg-[#3a4f42] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {t.feedback.send}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
