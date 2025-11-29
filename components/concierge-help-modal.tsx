"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
// NEU: Importiere die Funktion und den Hook
import { useSettings } from "@/lib/settings-context"
import { getCombinedFaqs } from "@/components/faq-content"

interface ConciergeHelpModalProps {
  context: "simulation" | "market" | "contact"
  isOpen: boolean
  onClose: () => void
}

export function ConciergeHelpModal({ context, onClose }: ConciergeHelpModalProps) {
  // NEU: Hooks, um Sprache zu erhalten
  const { language } = useSettings()

  // NEU: Logik, um die übersetzten Abschnitte zu erhalten
  const helpSections = getCombinedFaqs(language)
    .find(item => item.context === context)

  const defaultTitle = language === "de" 
    ? "Wie kann ich Ihnen helfen?" 
    : language === "en" 
      ? "How may I assist you?" 
      : language === "fr" 
        ? "Comment puis-je vous aider?"
        : "Come posso aiutarti?"

  // Wenn der Kontext nicht gefunden wird, wird ein leerer Zustand zurückgegeben
  if (!helpSections) {
    return null;
  }

  // Wähle den Titel der Sektion
  const title = helpSections.title || defaultTitle;
  const sections = helpSections.questions;
  

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // Der Key muss im Parent-Component gesetzt werden, der das Modal kontrolliert.
        // Hier im Modal selbst kann der language-Key nur für innere Logik verwendet werden.
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <Image src="/images/1.svg" alt="Concierge" fill className="object-contain" />
              </div>
              {/* NEU: Verwende den dynamischen Titel */}
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="space-y-6">
              {/* NEU: Verwende die internationalisierten Sektionen */}
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{section.question}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{section.answer}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                {language === "de"
                  ? "Ich bin jederzeit für Sie da. Klicken Sie auf die Glocke unten rechts, wenn Sie weitere Fragen haben."
                  : language === "en"
                    ? "I am here for you anytime. Click the bell on the bottom right if you have further questions."
                    : language === "fr"
                      ? "Je suis là pour vous à tout moment. Cliquez sur la cloche en bas à droite si vous avez d'autres questions."
                      : "Sono qui per te in qualsiasi momento. Clicca sulla campana in basso a destra se hai ulteriori domande."}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}