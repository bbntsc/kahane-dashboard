"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"
import { ChevronDown, HelpCircle, BarChart3, TrendingUp, Mail, LayoutDashboard, PieChart, Star, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// --- DATEN-IMPORT ---
// Lädt die statische JSON-Datenbank (Daten/Inhalt)
import faqDataRaw from "@/components/faq/faq.json"

// --- ICON ZUWEISUNG ---
// Weist String-IDs Icons zu (Design/View)
const ICON_MAP = {
  overview: LayoutDashboard,
  simulation: BarChart3,
  market: TrendingUp,
  portfolio: PieChart,
  feedback: Star,
  settings: Settings,
  contact: Mail,
}

// --- SUB-KOMPONENTE ---
// Rendert eine einzelne Frage (UI-Element)
function AccordionItem({ item, isActive, onClick }: { item: { question: string, answer: string }, isActive: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-[#ede9e1] dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-[#1b251d] dark:text-[#f8f3ef] hover:text-[#4a5f52] dark:hover:text-[#668273] transition-colors focus:outline-none text-base"
        onClick={onClick}
      >
        <span className="text-base pr-4">{item.question}</span>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#6b7280] dark:text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- HAUPT-KOMPONENTE ---
// Verwaltet Zustand und Layout (Container)
export function FaqContent() {
  const { language } = useSettings()
  const t = useTranslation(language)
  const [openIndex, setOpenIndex] = useState<{ category: number, question: number } | null>(null)

  // --- DATEN FILTERUNG ---
  // Wählt Sprache aus JSON (Logik)
  const localizedFaqs = useMemo(() => {
    return faqDataRaw.map((entry) => {
      // TypeScript Cast, um auf dynamische Keys zuzugreifen
      const content = (entry.content as any)[language] || (entry.content as any)['en'];
      return {
        icon: ICON_MAP[entry.context as keyof typeof ICON_MAP],
        title: content.title,
        questions: content.items
      }
    })
  }, [language])

  const handleToggle = (category: number, question: number) => {
    setOpenIndex(prev => prev && prev.category === category && prev.question === question ? null : { category, question })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef] mb-3">
          <HelpCircle className="inline-block w-6 h-6 mr-3 text-[#4a5f52]" />
          {t.settings.faqTitle}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t.settings.faqSubtitle}
        </p>
      </header>

      {/* Iteriert über Kategorien und rendert Karten */}
      {localizedFaqs.map((category, catIndex) => {
        const IconComponent = category.icon;

        return (
          <Card key={catIndex} className="mb-8 rounded-xl p-0 shadow-lg border-[#ede9e1] dark:border-gray-700">
            <header className="flex items-center gap-4 bg-[#f8f3ef] dark:bg-gray-800 p-6 rounded-t-xl border-b border-[#ede9e1] dark:border-gray-700">
              <IconComponent className="h-6 w-6 text-[#1b251d] dark:text-[#f8f3ef] flex-shrink-0" />
              <h2 className="text-xl font-serif font-bold text-[#1b251d] dark:text-[#f8f3ef]">
                {category.title}
              </h2>
            </header>
            <CardContent className="p-6">
              <div className="space-y-0">
                {category.questions.map((q: any, qIndex: number) => (
                  <AccordionItem
                    key={qIndex}
                    item={q}
                    isActive={openIndex?.category === catIndex && openIndex?.question === qIndex}
                    onClick={() => handleToggle(catIndex, qIndex)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <p>
            {/* Fallback für einfachen Text im Footer */}
            {language === "de" && "Haben Sie weitere Fragen? Kontaktieren Sie uns direkt über die"}
            {language === "fr" && "Avez-vous d'autres questions? Contactez-nous directement via la"}
            {language === "it" && "Hai altre domande? Contattaci direttamente tramite la"}
            {language === "en" && "Do you have further questions? Contact us directly via the"}
            {" "}
            <Link href="/contact" className="text-[#4a5f52] font-semibold hover:underline">
              {t.nav.contact}
            </Link>
            -Seite.
        </p>
      </footer>
    </div>
  )
}