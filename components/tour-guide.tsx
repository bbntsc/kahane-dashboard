"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowRight, X, ArrowLeft } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

interface TourStep {
  target: string
  message: string
  path?: string // Optional: Pfad, zu dem navigiert werden soll
}

const ALL_TOUR_STEPS: TourStep[] = [
  // --- KATEGORIE 1: ÜBERSICHTS-SEITE (4 Schritte) ---
  {
    target: "sidebar-overview", // NEU: Zielt auf den Übersicht-Link
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
    target: "sidebar-simulation", // NEU: Zielt auf den Simulations-Link (um den nächsten Schritt zu erklären)
    message:
      "Hier finden Sie einen Feed Ihrer letzten Aktivitäten und wichtige Markt-Insights, die Ihnen helfen, informiert zu bleiben. Weiter geht es zur Simulation.",
    path: "/"
  },

  // --- KATEGORIE 2: SIMULATIONS-SEITE (5 Schritte) ---
  {
    target: "page", // Auf der neuen Seite starten wir wieder mit der ganzen Seite
    message:
      "Dies ist der Kern der Plattform: die Vermögenssimulation. Hier können Sie verschiedene Anlagestrategien testen.",
    path: "/simulation" 
  },
  {
    target: "sliders", // Zielt auf die gesamte Slider-Sektion
    message:
      "Passen Sie die zentralen Parameter wie Anlagebetrag, monatliche Investition, Aktienquote und Anlagehorizont an.",
    path: "/simulation"
  },
  {
    target: "chart-container", // Geändert, um den gesamten Chart-Bereich zu umranden
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
      "Bevor Sie fortfahren: Nutzen Sie diesen Button Blick in den Markt, um Ihre Annahmen mit realen, historischen Krisendaten abzugleichen. Wir wechseln nun zur Marktanalyse.",
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
      "Der Schalter Insights blendet rote Marker ein. Klicken Sie auf diese, um Details zu den Krisen und unseren Empfehlungen zu erhalten.",
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

  // --- KATEGORIE 4: WEITERE SEITEN (4 Schritte) ---
  {
    target: "sidebar-portfolio", // NEU
    message:
      "Auf der Portfolio-Seite (und auch auf der FAQ/Hilfe- und Feedback-Seite) wird Ihnen weiterhin die Navigation erklärt. Das Portfolio gibt Ihnen eine detaillierte Übersicht Ihrer Anlagen.",
    path: "/portfolio" 
  },
  {
    target: "sidebar-faq", // NEU
    message:
      "Die Seite FAQ/Hilfe ist ein wichtiger Anlaufpunkt. Hier finden Sie alle Fragen und Antworten übersichtlich sortiert.",
    path: "/faq" 
  },
  {
    target: "sidebar-feedback", // NEU
    message:
      "Auf der Seite Feedback können Sie uns schnell Ihre Meinung mitteilen. Ein Klick auf Einstellungen führt zum nächsten Schritt.",
    path: "/feedback" 
  },
  {
    target: "sidebar-settings", // NEU
    message:
      "Die Seite Einstellungen ermöglicht es Ihnen, das Erscheinungsbild (Theme, Schriftgröße und Sprache) der Anwendung anzupassen. Der letzte Schritt ist die Kontaktseite.",
    path: "/settings" 
  },
  
  // --- KATEGORIE 5: KONTAKT UND ABSCHLUSS ---
  {
    target: "contact-form", 
    message:
      "Die Kontaktseite ermöglicht Ihnen, direkt mit unseren Beratern in Verbindung zu treten, um Ihre individuelle Anlagestrategie zu besprechen.",
    path: "/contact" 
  },
  
  // ABSCHLUSS-SCHRITT
  {
    target: "page", 
    message:
      "Das war die erweiterte geführte Tour! Ich hoffe, Sie haben nun einen guten Überblick über alle Funktionen der Plattform und wissen, wie Sie uns kontaktieren können. Klicken Sie auf Tour beenden, um den Guide zu schließen.",
    path: "/contact" 
  }
]

// Exportiere die vollständige Liste der Schritte
export { ALL_TOUR_STEPS };


const TOUR_STEP_KEY = "activeTourStep"

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
  initialStep?: number // Start-Index-Einstellung (wird für kontextuelle Hilfe verwendet)
  isContextual?: boolean // Flag, um Kontext-Modus zu identifizieren
  conciergeImage: string // NEU: Pfad zum Concierge-Bild
}

export function TourGuide({ isActive, onComplete, initialStep = 0, isContextual = false, conciergeImage }: TourGuideProps) { // conciergeImage als Prop hinzugefügt
  const [currentStep, setCurrentStep] = useState(initialStep) 
  const router = useRouter()
  const pathname = usePathname()
  
  // Definiere die aktuell gültige Tour-Schritt-Liste
  const tourSteps = useMemo(() => {
    if (!isContextual) {
      return ALL_TOUR_STEPS;
    }
    
    // Finde alle Schritte, die zum aktuellen Pfad gehören.
    const stepsForContext = ALL_TOUR_STEPS.filter(step => pathname.startsWith(step.path || "/"));
    
    // Finde den Index des initialStep in der gefilterten Liste, relativ zum Start des Pfades.
    const relativeStartIndex = stepsForContext.findIndex(step => 
      // Nutze den ALL_TOUR_STEPS Index, um den relativen Start in der gefilterten Liste zu finden
      ALL_TOUR_STEPS[initialStep] && (step.path === ALL_TOUR_STEPS[initialStep].path && step.target === ALL_TOUR_STEPS[initialStep].target)
    );
    
    const subTour = stepsForContext.slice(relativeStartIndex);
    
    const lastStep = subTour[subTour.length - 1];

    if (!lastStep || lastStep.target !== "page") { 
      subTour.push({
        target: "page",
        message: "Das war der Hilfebereich für diese Seite. Klicken Sie auf Tour beenden, um den Guide zu schließen.",
        path: pathname 
      })
    }
    
    return subTour;
  }, [isContextual, initialStep, pathname]) 
  
  // Zustand, um zu wissen, ob die Tour gerade beendet wird und die Animation läuft
  const [isFinishing, setIsFinishing] = useState(false);

  // 1. Effekt: Laden des gespeicherten Zustands und Initialisierung/Aufräumen
  useEffect(() => {
    if (!isActive) return;

    if (isContextual) {
        // Im Kontext-Modus ist initialStep bereits der Start, also starten wir mit Index 0 der gefilterten Liste.
        setCurrentStep(0); 
        return;
    }
    
    // Logik für die vollständige Tour (wie zuvor, aber mit ALL_TOUR_STEPS)
    if (typeof window !== 'undefined') {
        const savedStep = localStorage.getItem(TOUR_STEP_KEY);
        
        if (savedStep !== null) {
            const stepToResume = Number(savedStep);
            const expectedPath = ALL_TOUR_STEPS[stepToResume]?.path;

            if (expectedPath && pathname.startsWith(expectedPath)) {
                setCurrentStep(stepToResume);
            }
            
            localStorage.removeItem(TOUR_STEP_KEY);
        } else {
            const initialStepIndex = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/"));
            if (initialStepIndex !== -1) {
                setCurrentStep(initialStepIndex);
            } 
        }
    } 
  }, [isActive, isContextual, pathname]) 


  // 2. Effekt: Scrollen und Hervorheben, wenn der Schritt wechselt.
  useEffect(() => {
    if (!isActive) return

    const step = tourSteps[currentStep]
    
    // NUR IM NICHT-KONTEXTUELLEN Modus navigieren wir zwischen Seiten.
    if (!isContextual) {
        if (!step || (step.path && !pathname.startsWith(step.path))) {
            const currentStepInAll = ALL_TOUR_STEPS.findIndex(s => s.message === step?.message && s.path === step?.path);
            const nextStepInAll = ALL_TOUR_STEPS[currentStepInAll + 1];
            
            // Logik für die Navigation zwischen Hauptseiten (z.B. von /settings zu /contact)
            if (nextStepInAll && nextStepInAll.path && !pathname.startsWith(nextStepInAll.path)) {
                return; // Navigation steht an, warte auf den Seitenwechsel
            }
            return;
        }
    }


    // Scrollen und Hervorheben
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(`[data-tour="${step.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 200); 

    return () => clearTimeout(timeoutId);

  }, [currentStep, isActive, pathname, isContextual, tourSteps]) 


  const handleNext = () => {
    // Prüfen, ob dies der letzte Schritt der AKTUELLEN (gefilterten oder vollen) Tour ist
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

    // Nur im NICHT-KONTEXTUELLEN Modus navigieren
    if (!isContextual && nextStepData && nextStepData.path && !pathname.startsWith(nextStepData.path)) {
        // Navigiere zur neuen Seite (z.B. von /simulation zu /market)
        // Im vollen Modus verwenden wir den Index in der ALL_TOUR_STEPS Liste
        const nextStepInAllList = ALL_TOUR_STEPS.findIndex(s => s.message === nextStepData.message && s.path === nextStepData.path);
        localStorage.setItem(TOUR_STEP_KEY, nextStepInAllList.toString());
        router.push(nextStepData.path); 
    } else {
        // Bleibe auf der gleichen Seite und gehe zum nächsten Schritt (oder im Kontext-Modus)
        setCurrentStep(nextStep);
    }
  }
  
  // NEU: Funktion für den Zurück-Button
  const handlePrevious = () => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      const previousStepData = tourSteps[previousStep];
      
      // Nur im NICHT-KONTEXTUELLEN Modus muss zurück navigiert werden
      if (!isContextual && previousStepData && previousStepData.path && !pathname.startsWith(previousStepData.path)) {
        
        // Finde den Index des vorherigen Schritts in der gesamten Liste, um dort fortzufahren
        const previousStepInAllList = ALL_TOUR_STEPS.findIndex(s => s.message === previousStepData.message && s.path === previousStepData.path);
        
        // Setze den vorherigen Index, bevor wir navigieren
        localStorage.setItem(TOUR_STEP_KEY, previousStepInAllList.toString());
        
        // Navigiere zurück zur vorherigen Seite
        router.push(previousStepData.path); 
      } else {
        // Bleibe auf der gleichen Seite
        setCurrentStep(previousStep);
      }
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
  if (!isActive || isFinishing || !step || (step.path && !pathname.startsWith(step.path) && !isContextual)) return null

  return (
    <>
      {/* KORREKTUR: HÖCHSTER Z-INDEX für das Dimmer-Overlay */}
      <div className="fixed inset-0 bg-black/30 z-[99]" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }} // Animation beschleunigen
          className="fixed bottom-32 left-8 right-8 md:left-auto md:right-32 z-[102] max-w-md" // NEU: Höher als Highlight-Z-Index
        >
          <div className="bg-white border-2 border-[#668273] rounded-2xl shadow-2xl p-6 relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 right-24 w-6 h-6 bg-white border-r-2 border-b-2 border-[#668273] transform rotate-45" />

            {/* Der Schließen-Button ruft handleSkip auf (Startet die Exit-Animation) */}
            <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <p className="text-base text-gray-800 leading-relaxed mb-4">{step.message}</p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Schritt {currentStep + 1} von {tourSteps.length}
              </div>
              
              {/* NEU: Flex-Container für Zurück und Weiter */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    // Button-Stil auf Gutmann-Farbe mit Outline geändert
                    className="flex items-center gap-1 px-3 py-2 border border-[#668273] text-[#668273] rounded-lg hover:bg-[#668273]/10 transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                    currentStep < tourSteps.length - 1 ? 'bg-[#668273] hover:bg-[#5a7268]' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentStep < tourSteps.length - 1 ? "Verstanden" : "Tour beenden"}
                  {currentStep < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
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
        // HIER WIRD DIE GRÖSSE ANGEPASST (von w-24 h-24 auf w-32 h-32)
        className="fixed bottom-8 right-24 w-32 h-32 z-[102]" 
      >
        <img src={conciergeImage} alt="Concierge" className="w-full h-full object-contain" />
      </motion.div>

      {/* Highlight target element */}
      {isActive && step.target !== "page" && ( 
        <style jsx global>{`
          /* WICHTIGE KORREKTUR für alle hervorgehobenen Elemente */
          [data-tour="${step.target}"] {
            /* Das hervorgehobene Element MUSS eine Stapelkontext schaffen und über dem Dimmer liegen */
            position: relative;
            z-index: 101 !important; 
            /* Gelber Rahmen mit 50% Transparenz */
            box-shadow: 0 0 0 4px rgba(235, 241, 81, 0.5) !important; /* FARBE ZURÜCK AUF GELB/GOLD */
            border-radius: 12px;
            transition: box-shadow 0.3s ease-in-out; 
          }
          
          /* Spezieller Fix für die Sidebar-Links (die in einem FIXED Container liegen) */
          a[data-tour^="sidebar-"], button[data-tour^="sidebar-"] {
             /* Fügt relative position hinzu, falls nicht vorhanden, um Z-Index zu respektieren */
             position: relative !important;
             z-index: 101 !important; 
          }
          
          /* Header und Sidebar Container niedrig halten (aus dashboard-layout.tsx) */
          header, .lg\\:pl-64 > .sticky, .lg\\:fixed {
             z-index: 10 !important;
          }
        `}</style>
      )}
    </>
  )
}