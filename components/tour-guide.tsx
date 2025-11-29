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
  // --- KATEGORIE 1: ÜBERSICHTS-SEITE (4 Schritte) ---
  {
    target: "page",
    message:
      "Willkommen! Dies ist Ihre Übersichtsseite, der zentrale Startpunkt. Hier sehen Sie die wichtigsten Kennzahlen auf einen Blick.",
    path: "/" 
  },
  {
    target: "stats-grid", 
    message:
      "Dieser Bereich liefert Ihnen eine aktuelle Zusammenfassung Ihres Gesamtvermögens, der Performance und des Risiko-Scores.",
    path: "/"
  },
  {
    target: "quick-actions", 
    message:
      "Über diese Schnellzugriffe gelangen Sie direkt zu den Hauptfunktionen wie Simulation und Marktanalyse.",
    path: "/"
  },
  {
    target: "recent-activities", 
    message:
      "Hier finden Sie einen Feed Ihrer letzten Aktivitäten und wichtige Markt-Insights, die Ihnen helfen, informiert zu bleiben. Weiter geht es zur Simulation.",
    path: "/"
  },

  // --- KATEGORIE 2: SIMULATIONS-SEITE (5 Schritte) ---
  {
    target: "page",
    message:
      "Dies ist der Kern der Plattform: die Vermögenssimulation. Hier können Sie verschiedene Anlagestrategien testen.",
    path: "/simulation" 
  },
  {
    target: "sliders",
    message:
      "Passen Sie die zentralen Parameter wie Anlagebetrag, monatliche Investition, Aktienquote und Anlagehorizont an.",
    path: "/simulation"
  },
  {
    target: "chart",
    message:
      "Das Diagramm zeigt die voraussichtliche Entwicklung Ihres Portfolios in drei Szenarien (optimistisch, realistisch, vorsichtig).",
    path: "/simulation"
  },
  {
    target: "summary",
    message:
      "Die Zusammenfassung zeigt Ihnen, was Sie investiert haben und welchen potenziellen Finalwert und Ertrag Sie erwarten können.",
    path: "/simulation"
  },
  {
    target: "cta-simulation-link", 
    message:
      "Bevor Sie fortfahren: Nutzen Sie diesen Button 'Blick in den Markt', um Ihre Annahmen mit realen, historischen Krisendaten abzugleichen. Wir wechseln nun zur Marktanalyse.",
    path: "/simulation" 
  },

  // --- KATEGORIE 3: MARKTAANALYSE-SEITE (6 Schritte) ---
  {
    target: "market-page", 
    message:
      "Willkommen bei der Marktanalyse! Hier vergleichen Sie die Performance über verschiedene Zeiträume anhand historischer Daten.",
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
      "Dieses Diagramm zeigt die tatsächliche Wertentwicklung des Index, inklusive aller historischen Krisenpunkte.",
    path: "/market"
  },
  {
    target: "market-insights",
    message:
      "Der Schalter 'Insights' blendet rote Marker ein. Klicken Sie auf diese, um Details zu den Krisen und unseren Empfehlungen zu erhalten.",
    path: "/market"
  },
  {
    target: "market-summary", 
    message:
      "Die Zusammenfassung zeigt Ihnen statistische Kennzahlen wie den Durchschnittsertrag und die maximalen Verluste für den gewählten Zeitraum.",
    path: "/market"
  },
  {
    target: "market-contact-cta", 
    message:
      "Nach der Analyse: Wenn Sie bereit sind, Ihre Erkenntnisse in eine persönliche Strategie umzusetzen, können Sie hier direkt mit uns Kontakt aufnehmen. Nun wechseln wir zum Portfolio.",
    path: "/market"
  },

  // --- KATEGORIE 4: WEITERE SEITEN (3 Schritte) ---
  {
    target: "page",
    message:
      "Auf der Portfolio-Seite (und auch auf der FAQ- und Feedback-Seite) wird Ihnen weiterhin die Navigation erklärt. Das Portfolio gibt Ihnen eine detaillierte Übersicht Ihrer Anlagen.",
    path: "/portfolio" 
  },
  {
    target: "page",
    message:
      "Die Seite 'FAQ/Hilfe' ist ein wichtiger Anlaufpunkt. Hier finden Sie alle Fragen und Antworten übersichtlich sortiert.",
    path: "/faq" 
  },
  {
    target: "page",
    message:
      "Auf der Seite 'Feedback' können Sie uns schnell Ihre Meinung mitteilen. Ein Klick auf 'Einstellungen' führt zum nächsten Schritt.",
    path: "/feedback" 
  },
  {
    target: "page",
    message:
      "Die Seite 'Einstellungen' ermöglicht es Ihnen, das Erscheinungsbild (Theme, Schriftgröße und Sprache) der Anwendung anzupassen.",
    path: "/settings" 
  },
  {
    target: "page",
    message:
      "Über die Seite 'Kontakt' können Sie direkt mit unseren Beratern in Verbindung treten, um eine individuelle Strategie zu besprechen.",
    path: "/contact" 
  },
  
  // --- KATEGORIE 5: ABSCHLUSS ---
  {
    target: "page", // Letzter Schritt der Tour
    message:
      "Das war die erweiterte geführte Tour! Ich hoffe, Sie haben nun einen guten Überblick über alle Funktionen der Plattform.",
    path: "/contact" 
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
    
    // Wichtig: Nur fortfahren, wenn der Pfad des Schritts mit dem aktuellen Pfad übereinstimmt
    if (!step || (step.path && !pathname.startsWith(step.path))) {
       // Wenn wir uns auf der Simulationsseite befinden und der nächste Schritt Market ist,
       // navigieren wir direkt zur Market Page, um den nächsten Schritt dort zu zeigen.
       // Index 5 ist der erste Schritt auf der /market Seite
       if (currentStep === 5 && step.path === "/market" && pathname === "/simulation") {
          // Erlaube die Navigation, aber nicht das Rendern des Tooltips auf der falschen Seite
          return;
       }
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
    // Prüft, ob ein Seitenwechsel ansteht (z.B. von /simulation auf /market)
    if (nextStepData && nextStepData.path && !pathname.startsWith(nextStepData.path)) {
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