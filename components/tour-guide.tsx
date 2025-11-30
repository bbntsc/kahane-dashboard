"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowRight, X, ArrowLeft } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import type { Language, translations } from "@/lib/i18n" 

interface TourStep {
  target: string
  // MESSAGE WIRD ZU EINEM SCHLÜSSEL
  messageKey: keyof typeof translations.de.concierge.tour 
  path?: string // Optional: Pfad, zu dem navigiert werden soll
}

// ACHTUNG: Die Messages selbst sind nun nur KEYS, die zur Laufzeit übersetzt werden!
const ALL_TOUR_STEPS: TourStep[] = [
  // --- KATEGORIE 1: ÜBERSICHTS-SEITE (4 Schritte) ---
  {
    target: "sidebar-overview", 
    messageKey: "t1_message",
    path: "/" 
  },
  {
    target: "stats-grid", 
    messageKey: "t2_message",
    path: "/"
  },
  {
    target: "quick-actions", 
    messageKey: "t3_message",
    path: "/"
  },
  {
    target: "sidebar-simulation", 
    messageKey: "t4_message",
    path: "/"
  },

  // --- KATEGORIE 2: SIMULATIONS-SEITE (5 Schritte) ---
  {
    target: "page", 
    messageKey: "t5_message",
    path: "/simulation" 
  },
  {
    target: "sliders", 
    messageKey: "t6_message",
    path: "/simulation"
  },
  {
    target: "chart-container", 
    messageKey: "t7_message",
    path: "/simulation"
  },
  {
    target: "summary",
    messageKey: "t8_message",
    path: "/simulation"
  },
  {
    target: "cta-simulation-link", 
    messageKey: "t9_message",
    path: "/simulation" 
  },

  // --- KATEGORIE 3: MARKTAANALYSE-SEITE (6 Schritte) ---
  {
    target: "market-page", 
    messageKey: "t10_message",
    path: "/market" 
  },
  {
    target: "market-horizon",
    messageKey: "t11_message",
    path: "/market"
  },
  {
    target: "market-chart",
    messageKey: "t12_message",
    path: "/market"
  },
  {
    target: "market-insights",
    messageKey: "t13_message",
    path: "/market"
  },
  {
    target: "market-summary", 
    messageKey: "t14_message",
    path: "/market"
  },
  {
    target: "market-contact-cta", 
    messageKey: "t15_message",
    path: "/market"
  },

  // --- KATEGORIE 4: WEITERE SEITEN (4 Schritte) ---
  {
    target: "sidebar-portfolio", 
    messageKey: "t16_message",
    path: "/portfolio" 
  },
  {
    target: "sidebar-faq", 
    messageKey: "t17_message",
    path: "/faq" 
  },
  {
    target: "sidebar-feedback", 
    messageKey: "t18_message",
    path: "/feedback" 
  },
  {
    target: "sidebar-settings", 
    messageKey: "t19_message",
    path: "/settings" 
  },
  
  // --- KATEGORIE 5: KONTAKT UND ABSCHLUSS ---
  {
    target: "contact-form", 
    messageKey: "t20_message",
    path: "/contact" 
  },
  
  // ABSCHLUSS-SCHRITT
  {
    target: "page", 
    messageKey: "t21_message",
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
  
  // NEU: Hooks für die Übersetzung
  const { language } = useSettings()
  const t = useTranslation(language)

  // Definiere die aktuell gültige Tour-Schritt-Liste
  const tourSteps: (TourStep & { fullIndex?: number })[] = useMemo(() => {
    if (!isContextual) {
      return ALL_TOUR_STEPS.map((step, index) => ({ ...step, fullIndex: index }));
    }
    
    // Finde alle Schritte, die zum aktuellen Pfad gehören.
    const stepsForContext = ALL_TOUR_STEPS.filter(step => pathname.startsWith(step.path || "/"));
    
    // Finde den Index des initialStep in der gefilterten Liste, relativ zum Start des Pfades.
    const initialStepData = ALL_TOUR_STEPS[initialStep];
    
    if (!initialStepData) return [];

    const relativeStartIndex = stepsForContext.findIndex(step => 
      step.messageKey === initialStepData.messageKey && step.path === initialStepData.path
    );
    
    const subTour = stepsForContext.slice(relativeStartIndex);
    
    const lastStep = subTour[subTour.length - 1];

    // Wenn der letzte Schritt nicht bereits der Endschritt ist, füge den kontextuellen Endschritt hinzu
    if (!lastStep || (lastStep.messageKey !== "t21_message" && lastStep.target !== "page")) { 
      subTour.push({
        target: "page",
        messageKey: "t_contextual_end", // DYNAMISCH ÜBERSETZBARER SCHLÜSSEL
        path: pathname 
      } as TourStep);
    }
    
    return subTour.map(step => ({...step, fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === step.messageKey && s.path === step.path)}));

  }, [isContextual, initialStep, pathname, language]) // language als Dependency hinzugefügt, damit bei Sprachwechsel die Tour-Schritte neu berechnet werden.
  
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
                // Finde den Index des weiterzuführenden Schritts in der aktuellen `tourSteps` Liste
                const indexInCurrentList = tourSteps.findIndex(s => s.fullIndex === stepToResume);
                if(indexInCurrentList !== -1) {
                    setCurrentStep(indexInCurrentList);
                } else {
                    // Fallback, wenn der gespeicherte Index außerhalb des aktuellen Pfadkontexts liegt
                    setCurrentStep(0);
                }
            }
            
            localStorage.removeItem(TOUR_STEP_KEY);
        } else {
            const initialStepIndex = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/"));
            if (initialStepIndex !== -1) {
                const indexInCurrentList = tourSteps.findIndex(s => s.fullIndex === initialStepIndex);
                if(indexInCurrentList !== -1) {
                    setCurrentStep(indexInCurrentList);
                } else {
                    setCurrentStep(0);
                }
            } 
        }
    } 
  }, [isActive, isContextual, pathname, tourSteps]) 


  // 2. Effekt: Scrollen und Hervorheben, wenn der Schritt wechselt.
  useEffect(() => {
    if (!isActive) return

    const step = tourSteps[currentStep]
    
    // NUR IM NICHT-KONTEXTUELLEN Modus navigieren wir zwischen Seiten.
    if (!isContextual) {
        if (!step || (step.path && !pathname.startsWith(step.path))) {
            return; // Navigation steht an, warte auf den Seitenwechsel
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
        const nextStepInAllList = nextStepData.fullIndex; // Wir nutzen den gespeicherten vollen Index
        if (nextStepInAllList !== undefined) {
             localStorage.setItem(TOUR_STEP_KEY, nextStepInAllList.toString());
        }
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
        const previousStepInAllList = previousStepData.fullIndex;
        
        // Setze den vorherigen Index, bevor wir navigieren
        if (previousStepInAllList !== undefined) {
             localStorage.setItem(TOUR_STEP_KEY, previousStepInAllList.toString());
        }
        
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
  
  // Funktion zum Abrufen der übersetzten Nachricht
  const getTranslatedMessage = (key: keyof typeof t.concierge.tour) => {
    // Sicherstellen, dass der Schlüssel existiert
    if (key in t.concierge.tour) {
        return t.concierge.tour[key] as string;
    }
    return "Translation missing for: " + key;
  }
  
  // Wenn die Tour nicht aktiv ist ODER sie gerade beendet wird (isFinishing), wird nichts gerendert.
  if (!isActive || isFinishing || !step || (step.path && !pathname.startsWith(step.path) && !isContextual)) return null

  // Hole die übersetzte Nachricht für den aktuellen Schritt
  const currentMessage = getTranslatedMessage(step.messageKey as keyof typeof t.concierge.tour)

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

            <p className="text-base text-gray-800 leading-relaxed mb-4">{currentMessage}</p> {/* HIER WIRD ÜBERSETZT */}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {t.concierge.tour.t_step} {currentStep + 1} {t.concierge.tour.t_from} {tourSteps.length} {/* HIER WIRD ÜBERSETZT */}
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
                    {t.concierge.tour.t_back} {/* HIER WIRD ÜBERSETZT */}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                    currentStep < tourSteps.length - 1 ? 'bg-[#668273] hover:bg-[#5a7268]' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentStep < tourSteps.length - 1 ? t.concierge.tour.t_understood : t.concierge.tour.t_finish} {/* HIER WIRD ÜBERSETZT */}
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