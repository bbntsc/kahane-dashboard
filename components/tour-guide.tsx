// components/tour-guide.tsx
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
  messageKey: keyof typeof translations.de.concierge.tour 
  path?: string // Optional: Pfad, zu dem navigiert werden soll
}

// ACHTUNG: Die Messages selbst sind nun nur KEYS, die zur Laufzeit übersetzt werden!
const ALL_TOUR_STEPS: TourStep[] = [
  // INDEX 0: SCHRITT 1 - WILLKOMMEN
  { 
    target: "page", // Betrifft die gesamte Seite
    messageKey: "t1_welcome",
    path: "/"
  },
  
  // INDEX 1: Quick Actions (Sidebar Einleitung)
  { 
    target: "quick-actions", 
    messageKey: "t3_message",
    path: "/"
  },
  
  // INDEX 2: Navigieren zu Simulation
  {
    target: "page", // Betrifft die gesamte Seite
    messageKey: "t5_message",
    path: "/simulation" 
  },
  
  // --- SIMULATIONS-SCHRITTE ---
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

  // INDEX 7: Navigieren zu Marktanalyse
  {
    target: "market-page", 
    messageKey: "t10_message",
    path: "/market" 
  },
  
  // --- MARKTAANALYSE-SCHRITTE (alle auf /market) ---
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
  
  // INDEX 12: MARKTAANALYSE-CTA: 'Jetzt Kontaktieren' hervorheben (bleibt auf Market)
  {
    target: "market-contact-cta", 
    messageKey: "t15_message",
    path: "/market" 
  },
  // INDEX 13: NEU: Navigationsschritt Market -> Contact (Nur für Global Guide)
  {
    target: "page", 
    messageKey: "t16_nav_contact", 
    path: "/contact" 
  },

  // INDEX 14: KONTAKTFORMULAR
  {
    target: "contact-form", 
    messageKey: "t20_message",
    path: "/contact" 
  },
  
  // INDEX 15: NEU: Navigationsschritt Contact -> FAQ (Nur für Global Guide)
  {
    target: "sidebar-faq", 
    messageKey: "t22_nav_faq", 
    path: "/faq" 
  },
  
  // INDEX 16: FAQ (auf /faq)
  {
    target: "page", // Betrifft die gesamte Seite
    messageKey: "t17_message",
    path: "/faq" 
  },
  
  // INDEX 17: Feedback (auf /feedback)
  {
    target: "sidebar-feedback", 
    messageKey: "t18_message",
    path: "/feedback" 
  },
  
  // INDEX 18: Settings (auf /settings)
  {
    target: "sidebar-settings", 
    messageKey: "t19_message",
    path: "/settings" 
  },
  
  // INDEX 19: ABSCHLUSS-SCHRITT
  {
    target: "page", 
    messageKey: "t21_message",
    path: "/settings" // Abschluss auf der Settings-Seite
  }
]

// Exportiere die vollständige Liste der Schritte
export { ALL_TOUR_STEPS };


const TOUR_STEP_KEY = "activeTourStep"

interface TourStepWithIndex extends TourStep {
    fullIndex: number;
}

interface TourGuideProps {
  isActive: boolean
  onComplete: () => void
  initialStep?: number 
  isContextual?: boolean 
  conciergeImage: string 
}

export function TourGuide({ isActive, onComplete, initialStep = 0, isContextual = false, conciergeImage }: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep)
  const router = useRouter()
  const pathname = usePathname()
  
  const { language } = useSettings()
  const t = useTranslation(language)

  const tourSteps: TourStepWithIndex[] = useMemo(() => {
    if (!isContextual) {
      return ALL_TOUR_STEPS.map((step, index) => ({ ...step, fullIndex: index }));
    }
    
    // --- LOKALER (KONTEXTUELLER) GUIDE LOGIK ---
    
    let stepsForContext = ALL_TOUR_STEPS.filter(step => {
        // 1. Willkommensschritt und Sidebar-Einleitung (t3_message) immer entfernen
        if (step.messageKey === "t1_welcome" || step.messageKey === "t3_message") {
            return false;
        }

        // 2. Navigationsschritte entfernen: Schritte, deren Zielpfad nicht der aktuelle Pfad ist, entfernen.
        // Das stellt sicher, dass Navigationsschritte (t5, t9, t10, t16_nav_contact, t22_nav_faq, t18, t19)
        // aus dem lokalen Kontext entfernt werden.
        if (step.path && step.path !== pathname) {
            // Ausnahme: Startseite "/" gilt als Match, wenn wir auf der Startseite sind
            if (pathname === '/' && step.path === '/') return true; 

            return false;
        }
        
        // 3. Schritte, die den gesamten Pfad abdecken und keine Navigationsschritte sind, behalten
        return pathname.startsWith(step.path || "/");
    }).map((step) => ({
        ...step, 
        fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === step.messageKey && s.path === step.path)
    }));
    
    // Sicherstellen, dass die Tour mindestens einen passenden Schritt enthält, falls der Filter zu viel entfernt hat.
    if (stepsForContext.length === 0) {
        // Versuche, den ersten relevanten Schritt für die aktuelle Seite zu finden.
        const firstStep = ALL_TOUR_STEPS.find(step => 
            pathname.startsWith(step.path || "/") && 
            step.messageKey !== "t1_welcome" &&
            step.messageKey !== "t3_message" &&
            step.path === pathname 
        );
        
        if (firstStep) {
             stepsForContext.push({...firstStep, fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === firstStep.messageKey && s.path === firstStep.path)});
        }
    }
    
    // 4. Den kontextuellen Abschluss-Schritt hinzufügen
    const lastStep = stepsForContext[stepsForContext.length - 1];
    if (!lastStep || lastStep.messageKey !== "t_contextual_end") { 
      stepsForContext.push({
        target: "page",
        messageKey: "t_contextual_end", 
        path: pathname,
        fullIndex: -1 
      } as TourStepWithIndex);
    }
    
    return stepsForContext;
  }, [isContextual, pathname])
  
  const [isFinishing, setIsFinishing] = useState(false);
  const currentStep = tourSteps[currentStepIndex]; 

  // --- HILFSFUNKTIONEN FÜR VISUELLE HERVORHEBUNG ---
  const applyHighlight = (targetId: string) => {
    const element = document.querySelector(`[data-tour="${targetId}"]`);
    if (element && targetId !== "page") {
      element.classList.add("tour-highlight");
      element.style.zIndex = "101"; // Wichtig: Z-Index muss höher als der Dimmer (z-[99]) sein
      element.style.position = "relative"; 
    }
  };

  const removeHighlight = (targetId: string) => {
    const element = document.querySelector(`[data-tour="${targetId}"]`);
    if (element) {
      element.classList.remove("tour-highlight");
      // Nur Stile entfernen, die wir gesetzt haben
      if (element.style.zIndex === "101") { 
          element.style.zIndex = "";
          element.style.position = "";
      }
    }
  };

  // 1. Effekt: Laden des gespeicherten Zustands und Initialisierung/Aufräumen
  useEffect(() => {
    if (!isActive) return;

    if (isContextual) {
        setCurrentStepIndex(0); 
        return;
    }
    
    if (typeof window !== 'undefined') {
        const savedStep = localStorage.getItem(TOUR_STEP_KEY);
        
        if (savedStep !== null) {
            const stepToResume = Number(savedStep);
            const indexInCurrentList = tourSteps.findIndex(s => s.fullIndex === stepToResume);
            if(indexInCurrentList !== -1) {
                setCurrentStepIndex(indexInCurrentList);
            } else {
                setCurrentStepIndex(0);
            }
            localStorage.removeItem(TOUR_STEP_KEY);
        } else {
            const initialStepIndex = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/"));
            if (initialStepIndex !== -1) {
                const indexInCurrentList = tourSteps.findIndex(s => s.fullIndex === initialStepIndex);
                if(indexInCurrentList !== -1) {
                    setCurrentStepIndex(initialStepIndex); 
                } else {
                    setCurrentStepIndex(0);
                }
            } 
        }
    } 
  }, [isActive, isContextual, pathname, tourSteps]) 


  // 2. Effekt: Scrollen und Hervorheben
  useEffect(() => {
    if (!isActive || !currentStep) return

    // VORHERIGEN SCHRITT AUFRÄUMEN 
    const previousStep = tourSteps[currentStepIndex - 1] || tourSteps[currentStepIndex + 1];
    if(previousStep) {
        removeHighlight(previousStep.target);
    }

    if (!isContextual) {
        if (currentStep.path && !pathname.startsWith(currentStep.path)) {
            return; 
        }
    }

    // Scrollen und Hervorheben
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(`[data-tour="${currentStep.target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      // Der Willkommensschritt soll kein Highlight auf 'page' anwenden
      if(currentStep.target !== 'page') {
         applyHighlight(currentStep.target); 
      }
    }, 200); 

    return () => {
        clearTimeout(timeoutId);
        removeHighlight(currentStep.target); 
    }

  }, [currentStepIndex, isActive, pathname, isContextual, tourSteps, currentStep]) 


  const handleNext = () => {
    if (currentStep) {
        removeHighlight(currentStep.target); 
    }
    
    if (currentStepIndex === tourSteps.length - 1) {
      setIsFinishing(true); 
      setTimeout(() => {
        onComplete();
        setIsFinishing(false);
      }, 300); 
      return
    }

    const nextStep = currentStepIndex + 1;
    const nextStepData = tourSteps[nextStep];

    // Globale Guide Navigation (Nur wenn nicht isContextual)
    if (!isContextual && nextStepData && nextStepData.path && !pathname.startsWith(nextStepData.path)) {
        const nextStepInAllList = nextStepData.fullIndex; 
        if (nextStepInAllList !== undefined) {
             localStorage.setItem(TOUR_STEP_KEY, nextStepInAllList.toString());
        }
        router.push(nextStepData.path); 
    } else {
        setCurrentStepIndex(nextStep);
    }
  }
  
  const handlePrevious = () => {
    if (currentStep) {
        removeHighlight(currentStep.target); 
    }
    
    if (currentStepIndex > 0) {
      const previousStep = currentStepIndex - 1;
      const previousStepData = tourSteps[previousStep];
      
      // Globale Guide Navigation (Nur wenn nicht isContextual)
      if (!isContextual && previousStepData && previousStepData.path && !pathname.startsWith(previousStepData.path)) {
        
        const previousStepInAllList = previousStepData.fullIndex;
        
        if (previousStepInAllList !== undefined) {
             localStorage.setItem(TOUR_STEP_KEY, previousStepInAllList.toString());
        }
        
        router.push(previousStepData.path); 
      } else {
        setCurrentStepIndex(previousStep);
      }
    }
  }


  const handleSkip = () => {
    if (currentStep) {
        removeHighlight(currentStep.target); 
    }
    setIsFinishing(true);
    setTimeout(() => {
      onComplete();
      setIsFinishing(false);
    }, 300);
  }
  
  if (!isActive || isFinishing || !currentStep || (!isContextual && currentStep.path && !pathname.startsWith(currentStep.path))) return null

  const getTranslatedMessage = (key: keyof typeof t.concierge.tour) => {
    if (key === "t_contextual_end") {
        return "Das waren die Funktionen für diese Seite. Solltest Du mich auf einer anderen Seite erneut brauchen, zöger nicht die Glocke zu klingeln! Ich bin jederzeit für Dich da.";
    }
    
    if (key in t.concierge.tour) {
        return t.concierge.tour[key] as string;
    }
    return "Translation missing for: " + key;
  }
  
  const currentMessage = getTranslatedMessage(currentStep.messageKey as keyof typeof t.concierge.tour)

  const isWelcomeStep = currentStep.messageKey === "t1_welcome";
  const isContextualEndStep = currentStep.messageKey === "t_contextual_end"; 
  const totalSteps = tourSteps.length;
  
  // Zähle die Schritte ohne Metaschritte (Willkommen und Kontext-Ende)
  const stepsWithoutMeta = totalSteps - (tourSteps[0]?.messageKey === "t1_welcome" ? 1 : 0) - (tourSteps[tourSteps.length - 1]?.messageKey === "t_contextual_end" ? 1 : 0);
  
  let currentDisplayStep = currentStepIndex;
  
  if (!isWelcomeStep) {
    currentDisplayStep = currentStepIndex - (tourSteps[0]?.messageKey === "t1_welcome" ? 1 : 0) + 1;
  }

  // Nummerierung nur anzeigen, wenn es sich um einen relevanten Schritt handelt
  const showNumbering = !isWelcomeStep && !isContextualEndStep && stepsWithoutMeta > 0;

  return (
    <>
      {/* KORREKTUR: HÖCHSTER Z-INDEX für das Dimmer-Overlay */}
      <div className="fixed inset-0 bg-black/30 z-[99]" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }} 
          // 1. NEUE POSITION FÜR DIE SPRECHBLASE (Links platziert)
          // right-32 wird zu left-32
          className="fixed bottom-90 left-3 right-3 md:right-auto md:left-16 z-[102] max-w-sm" 
        >
          <div className="bg-white border-2 border-[#668273] rounded-2xl shadow-2xl p-6 relative">
            {/* Speech bubble tail: VON rechts nach links verschieben */}
            <div className="absolute -bottom-3 left-55 w-6 h-6 bg-white border-r-2 border-b-2 border-[#668273] transform rotate-45" />

            <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <p className="text-base text-gray-800 leading-relaxed mb-4">{currentMessage}</p> 

            <div className="flex items-center justify-between">
              {showNumbering ? (
                <div className="text-xs text-gray-500">
                  {t.concierge.tour.t_step} {currentDisplayStep} {t.concierge.tour.t_from} {stepsWithoutMeta} 
                </div>
              ) : (
                  // NEU: Platzhalter für den Willkommensschritt
                <div className="text-xs font-semibold text-[#668273]">
                    {isWelcomeStep
                      ? t.concierge.tutorialWelcome
                      : ""}
                </div>
              )}
              
              <div className="flex gap-2">
                {currentStepIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-1 px-3 py-2 border border-[#668273] text-[#668273] rounded-lg hover:bg-[#668273]/10 transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t.concierge.tour.t_back} 
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                    'bg-[#668273] hover:bg-[#5a7268]' 
                  }`}
                >
                  {currentStepIndex < tourSteps.length - 1 ? t.concierge.tour.t_understood : t.concierge.tour.t_finish} 
                  {currentStepIndex < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
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
        // 2. NEUE POSITION FÜR DIE FIGUR (Links unten, näher am Rand)
        // right-32 wird zu left-4
        className="fixed bottom-45 left-73 w-40 h-40 z-[102]" 
      >
        <img src={conciergeImage} alt="Concierge" className="w-full h-full object-contain" />
      </motion.div>
    </>
  )
}