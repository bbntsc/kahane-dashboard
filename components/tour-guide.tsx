"use client"

import { useState, useEffect } from "react"
import { ArrowRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TourStep {
  target: string
  message: string
}

const tourSteps: TourStep[] = [
  {
    target: "page",
    message:
      "Willkommen! Diese Seite zeigt Ihnen, wie sich Ihr Vermögen in der Zukunft entwickeln könnte. Lassen Sie mich Ihnen die wichtigsten Elemente erklären.",
  },
  {
    target: "sliders",
    message:
      "Hier können Sie Ihre persönlichen Parameter einstellen. Probieren Sie die Regler aus – oder geben Sie Werte direkt ein. Jede Änderung wird sofort im Diagramm sichtbar.",
  },
  {
    target: "chart",
    message:
      "Das Diagramm zeigt drei Szenarien: den optimistischen Fall (oben), das wahrscheinlichste Szenario (Mitte) und den vorsichtigen Fall (unten). So sehen Sie die Bandbreite möglicher Entwicklungen.",
  },
  {
    target: "summary",
    message:
      "Diese Kennzahlen fassen Ihre Simulation zusammen: Wie viel Sie investieren, welcher Ertrag erwartet wird und welchen Wert Ihr Portfolio am Ende haben könnte.",
  },
  {
    target: "cta",
    message:
      "Neugierig, wie sich Ihre Investition in echten Krisen verhalten hätte? Klicken Sie hier, um historische Marktdaten zu erkunden!",
  },
]

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
}

export function TourGuide({ isActive, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isActive) return

    // Scroll to the target element
    const element = document.querySelector(`[data-tour="${tourSteps[currentStep].target}"]`)
    if (element && currentStep > 0) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentStep, isActive])

  if (!isActive) return null

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = tourSteps[currentStep]

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={handleSkip} />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 left-8 right-8 md:left-auto md:right-32 z-50 max-w-md"
        >
          <div className="bg-white border-2 border-[#8B4513] rounded-2xl shadow-2xl p-6 relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 right-24 w-6 h-6 bg-white border-r-2 border-b-2 border-[#8B4513] transform rotate-45" />

            <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <p className="text-base text-gray-800 leading-relaxed mb-4">{step.message}</p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Schritt {currentStep + 1} von {tourSteps.length}
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors text-sm font-medium"
              >
                {currentStep < tourSteps.length - 1 ? "Verstanden" : "Tour beenden"}
                {currentStep < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Animated concierge at bottom right */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
        className="fixed bottom-8 right-24 w-24 h-24 z-50"
      >
        <img src="/images/1.svg" alt="Concierge" className="w-full h-full object-contain" />
      </motion.div>

      {/* Highlight target element */}
      {currentStep > 0 && (
        <style jsx global>{`
          [data-tour="${step.target}"] {
            position: relative;
            z-index: 45;
            box-shadow: 0 0 0 4px rgba(235, 241, 81, 0.5);
            border-radius: 12px;
          }
        `}</style>
      )}
    </>
  )
}
