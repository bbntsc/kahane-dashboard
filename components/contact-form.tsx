"use client"

import type React from "react"
import { useState } from "react"
import { BankGutmannHeader } from "@/components/bank-gutmann-header"
// import { AnimatedConcierge } from "@/components/animated-concierge" // Entfernt
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

export function ContactForm() {
  const [step, setStep] = useState(1)
  // const [showConcierge, setShowConcierge] = useState(true) // Entfernt
  const [submitted, setSubmitted] = useState(false)
  const { language } = useSettings()
  const t = useTranslation(language)

  const [goal, setGoal] = useState("")
  const [component, setComponent] = useState("")
  const [amount, setAmount] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  // useEffect zum Öffnen/Schließen des Concierge wird entfernt.
  /*
  useEffect(() => {
    const handleBellClick = () => setShowConcierge((prev) => !prev)
    window.addEventListener("openConcierge", handleBellClick)
    return () => window.removeEventListener("openConcierge", handleBellClick)
  }, [])
  */

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", { goal, component, amount, name, email, phone, message })
    setSubmitted(true)
  }

  // getConciergeMessage Funktion wird entfernt.
  /*
  const getConciergeMessage = () => {
    const messages = {
      // ... Messages hier entfernt ...
    }

    if (submitted) return messages[language].submitted
    return step === 1 ? messages[language].step1 : messages[language].step2
  }
  */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8f3ef] dark:bg-gray-900">
        {/* Der Header bleibt, da er Teil des Kontaktformular-Layouts ist */}
        <BankGutmannHeader />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
              {language === "de"
                ? "Vielen Dank für Ihre Anfrage!"
                : language === "fr"
                  ? "Merci pour votre demande!"
                  : language === "it"
                    ? "Grazie per la tua richiesta!"
                    : "Thank you for your inquiry!"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {language === "de"
                ? "Ein Berater der Bank Gutmann wird sich in Kürze bei Ihnen melden."
                : language === "fr"
                  ? "Un conseiller de la Bank Gutmann vous contactera sous peu."
                  : language === "it"
                    ? "Un consulente della Bank Gutmann vi contatterà a breve."
                    : "A Bank Gutmann advisor will contact you shortly."}
            </p>

            <Link href="/simulation">
              <button className="px-6 py-3 bg-[#4a5f52] hover:bg-[#3a4f42] text-white rounded-lg transition-colors font-medium shadow-md">
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
        </div>

        {/* AnimatedConcierge hier entfernt */}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef] dark:bg-gray-900">
      {/* Der Header bleibt */}
      <BankGutmannHeader />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 1 ? "bg-[#4a5f52] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
            >
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? "bg-[#4a5f52]" : "bg-gray-200 dark:bg-gray-700"}`} />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 2 ? "bg-[#4a5f52] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400 px-8">
            <span>{t.contact.step1}</span>
            <span>{t.contact.step2}</span>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {step === 1 ? (
            <form onSubmit={handleQuestionsSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t.contact.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">{t.contact.subtitle}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.question1}
                </label>
                <select
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">
                    {language === "de"
                      ? "Bitte wählen..."
                      : language === "fr"
                        ? "Veuillez choisir..."
                        : language === "it"
                          ? "Si prega di scegliere..."
                          : "Please select..."}
                  </option>
                  <option value="wealth-building">
                    {language === "de"
                      ? "Vermögensaufbau"
                      : language === "fr"
                        ? "Accumulation de patrimoine"
                        : language === "it"
                          ? "Accumulo di patrimonio"
                          : "Wealth Building"}
                  </option>
                  <option value="retirement">
                    {language === "de"
                      ? "Altersvorsorge"
                      : language === "fr"
                        ? "Prévoyance retraite"
                        : language === "it"
                          ? "Previdenza pensionistica"
                          : "Retirement Planning"}
                  </option>
                  <option value="capital-preservation">
                    {language === "de"
                      ? "Kapitalerhalt"
                      : language === "fr"
                        ? "Préservation du capital"
                        : language === "it"
                          ? "Preservazione del capitale"
                          : "Capital Preservation"}
                  </option>
                  <option value="income">
                    {language === "de"
                      ? "Regelmäßiges Einkommen"
                      : language === "fr"
                        ? "Revenu régulier"
                        : language === "it"
                          ? "Reddito regolare"
                          : "Regular Income"}
                  </option>
                  <option value="other">
                    {language === "de"
                      ? "Sonstiges"
                      : language === "fr"
                        ? "Autre"
                        : language === "it"
                          ? "Altro"
                          : "Other"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.question2}
                </label>
                <select
                  required
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">
                    {language === "de"
                      ? "Bitte wählen..."
                      : language === "fr"
                        ? "Veuillez choisir..."
                        : language === "it"
                          ? "Si prega di scegliere..."
                          : "Please select..."}
                  </option>
                  <option value="initial">
                    {language === "de"
                      ? "Anfangsinvestment"
                      : language === "fr"
                        ? "Investissement initial"
                        : language === "it"
                          ? "Investimento iniziale"
                          : "Initial Investment"}
                  </option>
                  <option value="monthly">
                    {language === "de"
                      ? "Monatliche Einzahlungen"
                      : language === "fr"
                        ? "Versements mensuels"
                        : language === "it"
                          ? "Versamenti mensili"
                          : "Monthly Contributions"}
                  </option>
                  <option value="horizon">
                    {language === "de"
                      ? "Anlagehorizont"
                      : language === "fr"
                        ? "Horizon d'investissement"
                        : language === "it"
                          ? "Orizzonte di investimento"
                          : "Investment Horizon"}
                  </option>
                  <option value="equity">
                    {language === "de"
                      ? "Aktienquote / Risikoverteilung"
                      : language === "fr"
                        ? "Part d'actions / Répartition des risques"
                        : language === "it"
                          ? "Quota azionaria / Distribuzione del rischio"
                          : "Equity Allocation / Risk Distribution"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.question3}
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={language === "de" ? "z.B. 500.000 EUR" : "e.g. 500,000 EUR"}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4a5f52] hover:bg-[#3a4f42] text-white rounded-lg transition-colors font-medium shadow-md"
              >
                {t.contact.submit} →
              </button>
            </form>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {language === "de"
                    ? "Ihre Kontaktdaten"
                    : language === "fr"
                      ? "Vos coordonnées"
                      : language === "it"
                        ? "I tuoi dati di contatto"
                        : "Your Contact Details"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {language === "de"
                    ? "So können wir Sie erreichen"
                    : language === "fr"
                      ? "Comment nous pouvons vous joindre"
                      : language === "it"
                        ? "Come possiamo contattarti"
                        : "How we can reach you"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.name} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    language === "de"
                      ? "Ihr vollständiger Name"
                      : language === "fr"
                        ? "Votre nom complet"
                        : language === "it"
                          ? "Il tuo nome completo"
                          : "Your full name"
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.email} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "de"
                      ? "ihre.email@beispiel.de"
                      : language === "fr"
                        ? "votre.email@exemple.fr"
                        : language === "it"
                          ? "tua.email@esempio.it"
                          : "your.email@example.com"
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+43 ..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.contact.message}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === "de"
                      ? "Haben Sie noch spezielle Wünsche oder Fragen?"
                      : language === "fr"
                        ? "Avez-vous des souhaits ou des questions spécifiques?"
                        : language === "it"
                          ? "Hai desideri o domande specifiche?"
                          : "Do you have any special requests or questions?"
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5f52] resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                >
                  ← {t.contact.back}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#ebf151] hover:bg-[#d9df47] text-[#1b251d] rounded-lg transition-colors font-medium shadow-md"
                >
                  {t.contact.send}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* AnimatedConcierge hier entfernt */}
      </div>
    </div>
  )
}