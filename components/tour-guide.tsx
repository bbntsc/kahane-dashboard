"use client"

import { useState, useEffect } from "react"
import { ArrowRight, X } from "lucide-react"

interface TourStep {
  target: string
  title: string
  content: string
  position: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    target: "sliders",
    title: "Die Regler",
    content:
      "Hier stellen Sie Ihre persönlichen Parameter ein: Startbetrag, monatliche Einzahlungen, Aktienquote und Anlagehorizont. Alle Werte können Sie auch manuell eingeben.",
    position: "right",
  },
  {
    target: "chart",
    title: "Das Diagramm",
    content:
      "Zeigt die mögliche Entwicklung Ihres Vermögens. Die mittlere Linie (Mitte) ist das wahrscheinlichste Szenario, darüber und darunter sehen Sie Best und Worst Case.",
    position: "left",
  },
  {
    target: "summary",
    title: "Zusammenfassung",
    content:
      "Hier sehen Sie die wichtigsten Kennzahlen: Ihr gesamtes Investment, den erwarteten Ertrag und den finalen Wert im mittleren Szenario.",
    position: "top",
  },
  {
    target: "cta",
    title: "Historische Analyse",
    content:
      "Möchten Sie sehen, wie sich Ihre Investition in der Vergangenheit verhalten hätte? Klicken Sie auf diesen Button, um zur historischen Marktanalyse zu gelangen.",
    position: "top",
  },
]

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
}

export function TourGuide({ isActive, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!isActive) return

    const updatePosition = () => {
      const element = document.querySelector(`[data-tour="${tourSteps[currentStep].target}"]`)
      if (element) {
        const rect = element.getBoundingClientRect()
        const step = tourSteps[currentStep]

        let top = rect.top
        let left = rect.left

        switch (step.position) {
          case "right":
            top = rect.top + rect.height / 2
            left = rect.right + 20
            break
          case "left":
            top = rect.top + rect.height / 2
            left = rect.left - 320
            break
          case "bottom":
            top = rect.bottom + 20
            left = rect.left + rect.width / 2 - 150
            break
          case "top":
            top = rect.top - 180
            left = rect.left + rect.width / 2 - 150
            break
        }

        setPosition({ top, left })
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" />

      {/* Tour Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-6 w-80"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <img src="/images/1.svg" alt="Concierge" className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-medium text-[#1b251d] mb-1">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.content}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Schritt {currentStep + 1} von {tourSteps.length}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors text-sm"
          >
            {currentStep < tourSteps.length - 1 ? "Weiter" : "Fertig"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Highlight target element */}
      <style jsx global>{`
        [data-tour="${step.target}"] {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(235, 241, 81, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  )
}
