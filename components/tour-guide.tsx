// kahane-dashboard-concierge 2/components/tour-guide.tsx
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
  // Schritt 6 (Index 5)
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

const TOUR_STEP_KEY = "activeTourStep"

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
}

export function TourGuide({ isActive, onComplete }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0) 
  const router = useRouter()
  const pathname = usePathname()
  
  // Zustand, um zu wissen, ob die Tour gerade beendet wird und die Animation läuft
  const [isFinishing, setIsFinishing] = useState(false);

  // 1. Effekt: Laden des gespeicherten Zustands und Initialisierung/Aufräumen
  useEffect(() => {
    if (typeof window !== 'undefined' && isActive) {
        const savedStep = localStorage.getItem(TOUR_STEP_KEY);

        if (savedStep !== null) {
            // Fall 1: Zustand wurde vor Navigation gespeichert.
            const stepToResume = Number(savedStep);
            
            // Führe nur fort, wenn der gespeicherte Schritt zum aktuellen Pfad passt, 
            const expectedPath = tourSteps[stepToResume]?.path;
            if (expectedPath && pathname.startsWith(expectedPath)) {
                setCurrentStep(stepToResume);
            }
            
            localStorage.removeItem(TOUR_STEP_KEY); // Aufräumen

        } else {
            // Fall 2: Normale Initialisierung
            const initialStepIndex = tourSteps.findIndex(step => pathname.startsWith(step.path || "/"))
            if (initialStepIndex !== -1) {
                setCurrentStep(initialStepIndex);
            } 
        }
    } 
  }, [isActive, pathname]) 


  // 2. Effekt: Scrollen und Hervorheben, wenn der Schritt wechselt.
  useEffect(() => {
    if (!isActive) return

    const step = tourSteps[currentStep]
    
    if (!step || (step.path && !pathname.startsWith(step.path))) {
       return;
    }


    // Scrollen und Hervorheben
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(`[data-tour="${step.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 200); 

    return () => clearTimeout(timeoutId);

  }, [currentStep, isActive, pathname]) 


  const handleNext = () => {
    // Prüfen, ob dies der letzte Schritt ist
    if (currentStep === tourSteps.length - 1) {
      // Tour beenden: Animation starten und onComplete mit Verzögerung aufrufen
      setIsFinishing(true); 
      setTimeout(() => {
        onComplete();
        setIsFinishing(false);
      }, 300); 
      return
    }

    const nextStep = currentStep + 1;
    const nextStepData = tourSteps[nextStep];

    // Sicherstellen, dass es den nächsten Schritt gibt und einen Pfad
    if (nextStepData && nextStepData.path && pathname !== nextStepData.path) {
        // Navigiere zur neuen Seite (z.B. von /simulation zu /market)
        localStorage.setItem(TOUR_STEP_KEY, nextStep.toString());
        router.push(nextStepData.path); 
    } else {
        // Bleibe auf der gleichen Seite und gehe zum nächsten Schritt
        setCurrentStep(nextStep);
    }
  }

  const handleSkip = () => {
    // Tour abbrechen: Animation starten und onComplete mit Verzögerung aufrufen
    setIsFinishing(true);
    setTimeout(() => {
      onComplete();
      setIsFinishing(false);
    }, 300);
  }

  const step = tourSteps[currentStep]
  
  // Wenn die Tour nicht aktiv ist ODER sie gerade beendet wird (isFinishing), wird nichts gerendert.
  if (!isActive || isFinishing || !step || (step.path && !pathname.startsWith(step.path))) return null

  return (
    <>
      {/* KORREKTUR: onClick vom Overlay entfernt, damit die Buttons im Dialog funktionieren. 
         Das Overlay ist nun nur noch ein visueller Dimmer. */}
      <div className="fixed inset-0 bg-black/30 z-40" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }} // Animation beschleunigen
          className="fixed bottom-32 left-8 right-8 md:left-auto md:right-32 z-50 max-w-md"
        >
          <div className="bg-white border-2 border-[#8B4513] rounded-2xl shadow-2xl p-6 relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 right-24 w-6 h-6 bg-white border-r-2 border-b-2 border-[#8B4513] transform rotate-45" />

            {/* Der Schließen-Button ruft handleSkip auf (Startet die Exit-Animation) */}
            <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <p className="text-base text-gray-800 leading-relaxed mb-4">{step.message}</p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Schritt {currentStep + 1} von {tourSteps.length}
              </div>
              {/* Der "Verstanden" / "Tour beenden" Button ruft handleNext auf (Startet die Exit-Animation, wenn es der letzte Schritt ist) */}
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