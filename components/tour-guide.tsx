// bbntsc/kahane-dashboard/kahane-dashboard-concierge/components/tour-guide.tsx
"use client"

import { useState, useEffect } from "react"
import { ArrowRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

interface TourStep {
  target: string
  message: string
  path?: string // Optional: Pfad, zu dem navigiert werden soll
}

const tourSteps: TourStep[] = [
  // Schritte für die Simulationsseite
  {
    target: "page",
    message:
      "Willkommen! Diese Seite zeigt Ihnen, wie sich Ihr Vermögen in der Zukunft entwickeln könnte. Lassen Sie mich Ihnen die wichtigsten Elemente erklären.",
    path: "/simulation" 
  },
  {
    target: "sliders",
    message:
      "Hier können Sie Ihre persönlichen Parameter einstellen. Probieren Sie die Regler aus – oder geben Sie Werte direkt ein. Jede Änderung wird sofort im Diagramm sichtbar.",
    path: "/simulation"
  },
  {
    target: "chart",
    message:
      "Das Diagramm zeigt drei Szenarien: den optimistischen Fall (oben), das wahrscheinlichste Szenario (Mitte) und den vorsichtigen Fall (unten). So sehen Sie die Bandbreite möglicher Entwicklungen.",
    path: "/simulation"
  },
  {
    target: "summary",
    message:
      "Diese Kennzahlen fassen Ihre Simulation zusammen: Wie viel Sie investieren, welcher Ertrag erwartet wird und welchen Wert Ihr Portfolio am Ende haben könnte.",
    path: "/simulation"
  },
  {
    target: "cta",
    message:
      "Neugierig, wie sich Ihre Investition in echten Krisen verhalten hätte? Klicken Sie hier, um historische Marktdaten zu erkunden!",
    path: "/simulation"
  },
  
  // NEUE Schritte für die Marktanalyseseite
  {
    target: "market-page",
    message:
      "Willkommen bei der Marktanalyse! Hier vergleichen Sie die Performance über verschiedene Zeiträume.",
    path: "/market" 
  },
  {
    target: "market-horizon",
    message:
      "Wählen Sie einen Anlagehorizont, um zu sehen, wie sich der MSCI World Index historisch über diese Dauer entwickelt hätte.",
    path: "/market"
  },
  {
    target: "market-chart",
    message:
      "Dieses Diagramm zeigt die tatsächliche Wertentwicklung des Index, inklusive aller historischen Krisen.",
    path: "/market"
  },
  {
    target: "market-insights",
    message:
      "Der Schalter 'Insights' blendet rote Marker im Chart ein. Klicken Sie auf diese Marker, um Details zur Krise und Empfehlungen zu erhalten.",
    path: "/market"
  },
  {
    target: "market-summary", 
    message:
      "Die Zusammenfassung zeigt Ihnen statistische Kennzahlen wie den Durchschnittsertrag und die maximalen Verluste für den gewählten Zeitraum.",
    path: "/market"
  },
  {
    target: "page", 
    message:
      "Das war die geführte Tour! Ich hoffe, Sie haben nun einen guten Überblick über die Funktionen.",
    path: "/market" 
  }
]

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
}

export function TourGuide({ isActive, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isActive) return

    const step = tourSteps[currentStep]

    // 1. Navigation, wenn nötig
    if (step.path && pathname !== step.path) {
      router.push(step.path)
      // Wichtig: Wir brechen hier ab, der Effekt wird durch die neue Route erneut ausgelöst.
      return
    }

    // 2. Scrollen und Hervorheben (mit kleiner Verzögerung nach Navigation)
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(`[data-tour="${step.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, pathname !== step.path ? 500 : 100); 

    return () => clearTimeout(timeoutId);

  }, [currentStep, isActive, pathname, router]) 

  // Zurücksetzen von currentStep beim manuellen Wechsel der Seite (um Fehler zu vermeiden)
  useEffect(() => {
    if (!isActive) return

    const currentStepPath = tourSteps[currentStep].path || "/"
    if (!pathname.startsWith(currentStepPath)) {
        // Finde den Index des ersten Schritts, der zum aktuellen Pfad passt
        const newStartStep = tourSteps.findIndex(step => pathname.startsWith(step.path || "/"))
        if (newStartStep !== -1) {
            // Springe zum ersten relevanten Schritt für die neue Seite
            setCurrentStep(newStartStep)
        }
    }
  }, [pathname, isActive, currentStep])


  if (!isActive) return null

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
      setCurrentStep(0); 
    }
  }

  const handleSkip = () => {
    onComplete()
    setCurrentStep(0)
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
      {isActive && step.target !== "page" && ( 
        <style jsx global>{`
          [data-tour="${step.target}"] {
            position: relative;
            z-index: 45;
            box-shadow: 0 0 0 4px rgba(235, 241, 81, 0.5); 
            border-radius: 12px;
            transition: box-shadow 0.3s ease-in-out; 
          }
        `}</style>
      )}
    </>
  )
}