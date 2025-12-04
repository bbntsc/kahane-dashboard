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
  // NEU INDEX 0: SCHRITT 1 - WILLKOMMEN 
  { 
    target: "page", // Betrifft die gesamte Seite
    messageKey: "t1_welcome",
    path: "/"
  },
  
  // NEU INDEX 1: Quick Actions (alt: 3) - NEUER ECHTER STARTPUNKT
  { 
    target: "quick-actions", 
    messageKey: "t3_message",
    path: "/"
  },
  
  // NEU INDEX 2: Navigieren zu Simulation (alt: 5)
  {
    target: "page", // Betrifft die gesamte Seite
    messageKey: "t5_message",
    path: "/simulation" 
  },
  
  // --- SIMULATIONS-SCHRITTE (ab hier unverändert in der Logik) ---
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

  // --- MARKTAANALYSE-SCHRITTE ---
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
    path: "/market" // Führt nun zu /faq
  },

  // --- WEITERE SEITEN (Portfolio entfernt, ab hier verschoben) ---
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
  
  // --- KONTAKT UND ABSCHLUSS ---
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

  const tourSteps: (TourStep & { fullIndex?: number })[] = useMemo(() => {
    if (!isContextual) {
      return ALL_TOUR_STEPS.map((step, index) => ({ ...step, fullIndex: index }));
    }
    
    const stepsForContext = ALL_TOUR_STEPS.filter(step => pathname.startsWith(step.path || "/") && step.messageKey !== "t1_welcome");
    
    const initialStepData = ALL_TOUR_STEPS[initialStep];
    
    if (!initialStepData) return [];

    const relativeStartIndex = stepsForContext.findIndex(step => 
      step.target === initialStepData.target && step.path === initialStepData.path
    );
    
    const subTour = stepsForContext.slice(relativeStartIndex);
    
    const lastStep = subTour[subTour.length - 1];

    if (!lastStep || (lastStep.messageKey !== "t21_message" && lastStep.target !== "page")) { 
      subTour.push({
        target: "page",
        messageKey: "t_contextual_end", 
        path: pathname 
      } as TourStep);
    }
    
    return subTour.map(step => ({...step, fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === step.messageKey && s.path === step.path)}));
  }, [isContextual, initialStep, pathname, language])
  
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
                    setCurrentStepIndex(initialStepIndex); // Korrigiert, um den Index aus ALL_TOUR_STEPS zu verwenden
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
  
  if (!isActive || isFinishing || !currentStep || (currentStep.path && !pathname.startsWith(currentStep.path) && !isContextual)) return null

  const getTranslatedMessage = (key: keyof typeof t.concierge.tour) => {
    if (key in t.concierge.tour) {
        return t.concierge.tour[key] as string;
    }
    return "Translation missing for: " + key;
  }
  
  const currentMessage = getTranslatedMessage(currentStep.messageKey as keyof typeof t.concierge.tour)

  const isWelcomeStep = currentStep.messageKey === "t1_welcome";
  const displayStepNumber = isWelcomeStep ? 0 : currentStepIndex; 
  const totalSteps = tourSteps.length;
  const displayTotalSteps = totalSteps - (tourSteps[0]?.messageKey === "t1_welcome" ? 1 : 0);
  const showNumbering = !isWelcomeStep;

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
          className="fixed bottom-32 left-8 right-8 md:left-auto md:right-32 z-[102] max-w-md" 
        >
          <div className="bg-white border-2 border-[#668273] rounded-2xl shadow-2xl p-6 relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 right-24 w-6 h-6 bg-white border-r-2 border-b-2 border-[#668273] transform rotate-45" />

            <button onClick={handleSkip} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <p className="text-base text-gray-800 leading-relaxed mb-4">{currentMessage}</p> 

            <div className="flex items-center justify-between">
              {showNumbering ? (
                <div className="text-xs text-gray-500">
                  {t.concierge.tour.t_step} {currentStepIndex} {t.concierge.tour.t_from} {displayTotalSteps} 
                </div>
              ) : (
                  // NEU: Platzhalter für den Willkommensschritt
                <div className="text-xs font-semibold text-[#668273]">
                    {t.concierge.tutorialWelcome}
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
                    currentStepIndex < tourSteps.length - 1 ? 'bg-[#668273] hover:bg-[#5a7268]' : 'bg-green-600 hover:bg-green-700'
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
        className="fixed bottom-8 right-24 w-32 h-32 z-[102]" 
      >
        <img src={conciergeImage} alt="Concierge" className="w-full h-full object-contain" />
      </motion.div>
    </>
  )
}