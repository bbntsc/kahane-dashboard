"use client"

import type React from "react"

import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
import { ConciergeBell } from "@/components/concierge-bell"
import { ConciergeHelpModal } from "@/components/concierge-help-modal"
import { AnimatedConcierge } from "@/components/animated-concierge"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function ContactForm() {
  const [step, setStep] = useState(1)
  const [showHelp, setShowHelp] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Qualifying questions
  const [goal, setGoal] = useState("")
  const [component, setComponent] = useState("")
  const [amount, setAmount] = useState("")

  // Contact details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  // Feedback
  const [rating, setRating] = useState<number | null>(null)
  const [feedbackComment, setFeedbackComment] = useState("")

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would send the data to your backend
    console.log({
      goal,
      component,
      amount,
      name,
      email,
      phone,
      message,
    })

    setSubmitted(true)

    // Show feedback popup after 1 second
    setTimeout(() => {
      setShowFeedback(true)
    }, 1000)
  }

  const handleFeedbackSubmit = () => {
    // Send feedback
    console.log({ rating, feedbackComment })
    setShowFeedback(false)
  }

  const getConciergeMessage = () => {
    if (step === 1) {
      return "Um die Servicequalität zu erhöhen, möchte ich Sie zunächst etwas besser kennenlernen. Ihre Antworten helfen uns, das Gespräch gezielt vorzubereiten."
    }
    return "Perfekt! Nun brauche ich nur noch Ihre Kontaktdaten, dann kann einer unserer Berater sich bei Ihnen melden."
  }

  if (submitted && !showFeedback) {
    return (
      <div className="min-h-screen bg-[#f8f3ef]">
        <BankGutmannHeader />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Vielen Dank für Ihre Anfrage!</h2>

            <p className="text-gray-600 mb-6">Ein Berater der Bank Gutmann wird sich in Kürze bei Ihnen melden.</p>

            <Link href="/simulation">
              <button className="px-6 py-3 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors">
                Zurück zur Simulation
              </button>
            </Link>
          </motion.div>
        </div>

        <AnimatedConcierge
          message="Ausgezeichnet! Wir freuen uns darauf, Sie bei Ihrer Anlageentscheidung zu unterstützen."
          position="right"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef]">
      <BankGutmannHeader />

      {showHelp && <ConciergeHelpModal context="contact" onClose={() => setShowHelp(false)} />}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? "bg-[#1b251d] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? "bg-[#1b251d]" : "bg-gray-200"}`} />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? "bg-[#1b251d] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="ml-12">Ihre Ziele</span>
            <span className="mr-12">Kontaktdaten</span>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 ? (
            <form onSubmit={handleQuestionsSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ihre Anlageziele</h2>
                <p className="text-gray-600 text-sm mb-6">Helfen Sie uns, Sie besser zu verstehen</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welches Ziel verfolgen Sie mit Ihrer Anlage?
                </label>
                <select
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="wealth-building">Vermögensaufbau</option>
                  <option value="retirement">Altersvorsorge</option>
                  <option value="capital-preservation">Kapitalerhalt</option>
                  <option value="income">Regelmäßiges Einkommen</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auf Basis Ihrer Simulation: Welche der vier Komponenten beschäftigt Sie am meisten?
                </label>
                <select
                  required
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="initial">Anfangsinvestment</option>
                  <option value="monthly">Monatliche Einzahlungen</option>
                  <option value="horizon">Anlagehorizont</option>
                  <option value="equity">Aktienquote / Risikoverteilung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcher ungefähre Anlagebetrag ist für Sie aktuell relevant? (Optional)
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="z.B. 500.000 EUR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors font-medium"
              >
                Weiter zu den Kontaktdaten →
              </button>
            </form>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ihre Kontaktdaten</h2>
                <p className="text-gray-600 text-sm mb-6">So können wir Sie erreichen</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ihr vollständiger Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+43 ..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nachricht (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Haben Sie noch spezielle Wünsche oder Fragen?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  ← Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#ebf151] text-[#1b251d] rounded-lg hover:bg-[#d9df47] transition-colors font-medium"
                >
                  Anfrage absenden
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <AnimatedConcierge message={getConciergeMessage()} position="right" />
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wie hat Ihnen die Simulation gefallen?</h3>

              <p className="text-gray-600 text-sm mb-6">Ihr Feedback hilft uns, das Erlebnis zu verbessern.</p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {rating && star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Was können wir verbessern? (Optional)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b251d] resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Überspringen
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!rating}
                  className="flex-1 py-2 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors disabled:opacity-50"
                >
                  Feedback senden
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConciergeBell onHelp={() => setShowHelp(true)} />
    </div>
  )
}
