"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface ConciergeHelpModalProps {
  context: "simulation" | "market" | "contact"
  onClose: () => void
}

export function ConciergeHelpModal({ context, onClose }: ConciergeHelpModalProps) {
  const getContextHelp = () => {
    switch (context) {
      case "simulation":
        return {
          title: "Wobei darf ich Ihnen behilflich sein?",
          sections: [
            {
              question: "Wie stelle ich die Regler ein?",
              answer:
                "Ziehen Sie die Regler mit der Maus oder klicken Sie auf das Eingabefeld rechts daneben, um Werte direkt einzugeben.",
            },
            {
              question: "Was bedeuten die drei Linien im Diagramm?",
              answer:
                "Die obere Linie zeigt den optimistischen Fall (90% der Simulationen liegen darunter), die mittlere das realistische Szenario (50%) und die untere den vorsichtigen Fall (nur 10% liegen darunter).",
            },
            {
              question: "Was ist die Aktienquote?",
              answer:
                "Die Aktienquote bestimmt, wie viel Ihres Portfolios in Aktien investiert wird. Höhere Aktienquoten bieten mehr Wachstumspotenzial, aber auch mehr Schwankungen.",
            },
            {
              question: "Warum MSCI World vs. S&P 500?",
              answer:
                "Der MSCI World investiert global in entwickelte Märkte, der S&P 500 konzentriert sich auf die 500 größten US-Unternehmen. Beide haben historisch unterschiedliche Renditen und Volatilitäten.",
            },
          ],
        }
      case "market":
        return {
          title: "Fragen zur historischen Analyse?",
          sections: [
            {
              question: "Was zeigt mir diese Seite?",
              answer:
                "Hier sehen Sie, wie sich der Markt tatsächlich über verschiedene Zeiträume entwickelt hat – inklusive aller Krisen und Erholungsphasen.",
            },
            {
              question: "Wie klicke ich auf eine Krise?",
              answer:
                "Die roten Punkte markieren historische Krisen. Klicken Sie darauf, um Details zu erfahren, was damals passiert ist und wie sich der Markt erholt hat.",
            },
            {
              question: "Warum sind Krisen normal?",
              answer:
                "Märkte durchlaufen Zyklen. Krisen gehören dazu, aber langfristig haben sich Märkte historisch immer wieder erholt und neue Höchststände erreicht.",
            },
          ],
        }
      case "contact":
        return {
          title: "Hilfe zum Kontaktformular",
          sections: [
            {
              question: "Warum diese Fragen?",
              answer:
                "Die Fragen helfen unseren Beratern, sich optimal auf Ihr Gespräch vorzubereiten und Ihnen die bestmögliche Unterstützung zu bieten.",
            },
            {
              question: "Sind meine Daten sicher?",
              answer:
                "Selbstverständlich. Ihre Daten werden vertraulich behandelt und ausschließlich für die Kontaktaufnahme verwendet.",
            },
            {
              question: "Wie schnell bekomme ich eine Antwort?",
              answer: "In der Regel meldet sich ein Berater innerhalb von 1-2 Werktagen bei Ihnen.",
            },
          ],
        }
    }
  }

  const help = getContextHelp()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
              <h2 className="text-xl font-bold text-gray-900">{help.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="space-y-6">
              {help.sections.map((section, index) => (
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
                Ich bin jederzeit für Sie da. Klicken Sie auf die Glocke unten rechts, wenn Sie weitere Fragen haben.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
