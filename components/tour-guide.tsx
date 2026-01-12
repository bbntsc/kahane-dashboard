"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowRight, X, ArrowLeft } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 
import type { translations } from "@/lib/i18n" 

interface TourStep {
  target: string
  messageKey: keyof typeof translations.de.concierge.tour 
  path?: string 
}

// kahane-dashboard-concierge_unite 10/components/tour-guide.tsx (Ausschnitt der ALL_TOUR_STEPS)

const ALL_TOUR_STEPS: TourStep[] = [
  { target: "page", messageKey: "t1_welcome", path: "/" },
  { target: "quick-actions", messageKey: "t3_message", path: "/" },
  // ÄNDERUNG: target von "page" auf "simulation-page" gesetzt
  { target: "simulation-page", messageKey: "t5_message", path: "/simulation" }, 
  { target: "sliders", messageKey: "t6_message", path: "/simulation" },
  { target: "chart-container", messageKey: "t7_message", path: "/simulation" },
  { target: "summary", messageKey: "t8_message", path: "/simulation" },
  { target: "cta-simulation-link", messageKey: "t9_message", path: "/simulation" },
  { target: "market-page", messageKey: "t10_message", path: "/market" },
  { target: "market-horizon", messageKey: "t11_message", path: "/market" },
  { target: "market-chart", messageKey: "t12_message", path: "/market" },
  { target: "market-insights", messageKey: "t13_message", path: "/market" },
  { target: "market-chart", messageKey: "t13_insights_bubbles", path: "/market" },
  { target: "market-summary", messageKey: "t14_message", path: "/market" },
  { target: "market-contact-cta", messageKey: "t15_message", path: "/market" },
  { target: "page", messageKey: "t16_nav_contact", path: "/contact" },
  { target: "contact-form", messageKey: "t20_message", path: "/contact" },
  { target: "sidebar-faq", messageKey: "t22_nav_faq", path: "/faq" },
  { target: "page", messageKey: "t17_message", path: "/faq" },
  { target: "sidebar-feedback", messageKey: "t18_message", path: "/feedback" },
  { target: "sidebar-settings", messageKey: "t19_message", path: "/settings" },
  { target: "page", messageKey: "t21_message", path: "/settings" }
]

export { ALL_TOUR_STEPS };

const TOUR_STEP_KEY = "activeTourStep"

interface TourStepWithIndex extends TourStep {
    fullIndex: number;
    customMessage?: string; 
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

  useEffect(() => {
    setCurrentStepIndex(initialStep);
  }, [initialStep]);

  const tourSteps: TourStepWithIndex[] = useMemo(() => {
    if (!isContextual) {
      return ALL_TOUR_STEPS.map((step, index) => ({ ...step, fullIndex: index }));
    }
    
    let stepsForContext = ALL_TOUR_STEPS.filter(step => {
        const key = step.messageKey as string;
        if (key === "t1_welcome" || key === "t3_message" || key === "t21_message" || key.includes("_nav_")) {
            return false;
        }

        if (step.path && step.path !== pathname) {
            if (pathname === '/' && step.path === '/') return true; 
            return false;
        }
        return pathname.startsWith(step.path || "/");
    }).map((step) => ({
        ...step, 
        fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === step.messageKey && s.path === step.path)
    }));
    
    if (stepsForContext.length === 0) {
        const firstStep = ALL_TOUR_STEPS.find(step => 
            pathname.startsWith(step.path || "/") && 
            !(step.messageKey as string).includes("_nav_") &&
            step.messageKey !== "t1_welcome" &&
            step.messageKey !== "t3_message" &&
            step.messageKey !== "t21_message" &&
            step.path === pathname 
        );
        if (firstStep) {
             stepsForContext.push({...firstStep, fullIndex: ALL_TOUR_STEPS.findIndex(s => s.messageKey === firstStep.messageKey)});
        }
    }
    
    // HIER WAR DER FEHLER: customMessage entfernt, damit messageKey t_contextual_end genutzt wird
    stepsForContext.push({
      target: "page",
      messageKey: "t_contextual_end" as any, 
      path: pathname,
      fullIndex: -2 
    });
    
    return stepsForContext;
  }, [isContextual, pathname])
  
  const [isFinishing, setIsFinishing] = useState(false);
  const currentStep = tourSteps[currentStepIndex]; 

  useEffect(() => {
    if (!isActive || !currentStep) {
      window.dispatchEvent(new CustomEvent('highlightSidebar', { detail: { active: false } }));
      return;
    }
    const globalIndex = currentStep.fullIndex;
    if (globalIndex === 1) {
      window.dispatchEvent(new CustomEvent('highlightSidebar', { detail: { active: true } }));
    } else {
      window.dispatchEvent(new CustomEvent('highlightSidebar', { detail: { active: false } }));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('highlightSidebar', { detail: { active: false } }));
    };
  }, [currentStepIndex, isActive, currentStep]);

  const applyHighlight = (targetId: string, stepIndex: number) => {
    if (stepIndex === 0 && !isContextual) return; 
    const element = document.querySelector(`[data-tour="${targetId}"]`) as HTMLElement;
    if (element) {
      element.classList.add("tour-highlight");
      element.style.zIndex = "101"; 
      element.style.position = "relative"; 
    }
  };

  const removeHighlight = (targetId: string) => {
    const element = document.querySelector(`[data-tour="${targetId}"]`) as HTMLElement;
    if (element) {
      element.classList.remove("tour-highlight");
      if (element.style.zIndex === "101") { 
          element.style.zIndex = "";
          element.style.position = "";
      }
    }
  };

  useEffect(() => {
    if (!isActive) return;
    if (isContextual) {
        setCurrentStepIndex(0); 
        return;
    }
    const savedStep = localStorage.getItem(TOUR_STEP_KEY);
    if (savedStep !== null) {
        const indexInCurrentList = tourSteps.findIndex(s => s.fullIndex === Number(savedStep));
        setCurrentStepIndex(indexInCurrentList !== -1 ? indexInCurrentList : 0);
        localStorage.removeItem(TOUR_STEP_KEY);
    }
  }, [isActive, isContextual, tourSteps]) 

  useEffect(() => {
    if (!isActive || !currentStep) return
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(`[data-tour="${currentStep.target}"]`)
      if (element) element.scrollIntoView({ behavior: "smooth", block: "center" })
      applyHighlight(currentStep.target, currentStep.fullIndex); 
    }, 200); 

    return () => {
        clearTimeout(timeoutId);
        removeHighlight(currentStep.target); 
    }
  }, [currentStepIndex, isActive, currentStep]) 

  const handleNext = () => {
    if (currentStepIndex === tourSteps.length - 1) {
      setIsFinishing(true); 
      setTimeout(() => {
        onComplete();
        setIsFinishing(false);
      }, 300); 
      return
    }
    const nextStepData = tourSteps[currentStepIndex + 1];
    if (!isContextual && nextStepData?.path && !pathname.startsWith(nextStepData.path)) {
        localStorage.setItem(TOUR_STEP_KEY, nextStepData.fullIndex.toString());
        router.push(nextStepData.path); 
    } else {
        setCurrentStepIndex(prev => prev + 1);
    }
  }
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStepData = tourSteps[currentStepIndex - 1];
      if (!isContextual && prevStepData?.path && !pathname.startsWith(prevStepData.path)) {
        localStorage.setItem(TOUR_STEP_KEY, prevStepData.fullIndex.toString());
        router.push(prevStepData.path); 
      } else {
        setCurrentStepIndex(prev => prev - 1);
      }
    }
  }

  if (!isActive || isFinishing || !currentStep) return null

  // Nutzt jetzt immer t.concierge.tour[currentStep.messageKey], es sei denn customMessage ist explizit gesetzt
  const currentMessage = currentStep.customMessage || (t.concierge.tour[currentStep.messageKey] as string);

  const isWelcomeStep = currentStep.messageKey === "t1_welcome";
  const totalSteps = tourSteps.length;
  const stepsWithoutMeta = totalSteps - (tourSteps[0]?.messageKey === "t1_welcome" ? 1 : 0);
  
  let currentDisplayStep = currentStepIndex;
  if (!isWelcomeStep) {
    currentDisplayStep = currentStepIndex - (tourSteps[0]?.messageKey === "t1_welcome" ? 1 : 0) + 1;
  }
  const showNumbering = !isWelcomeStep && stepsWithoutMeta > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[99]" />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-90 left-16 z-[102] max-w-sm" 
        >
          <div className="bg-white border-2 border-[#668273] rounded-2xl shadow-2xl p-6 relative">
            <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white border-r-2 border-b-2 border-[#668273] transform rotate-45" />
            <button onClick={onComplete} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            <p className="text-base text-gray-800 leading-relaxed mb-4">{currentMessage}</p> 
            <div className="flex items-center justify-between">
              {showNumbering && <div className="text-xs text-gray-500">{t.concierge.tour.t_step} {currentDisplayStep} {t.concierge.tour.t_from} {stepsWithoutMeta}</div>}
              {!showNumbering && isWelcomeStep && <div className="text-xs font-semibold text-[#668273]">{t.concierge.tutorialWelcome}</div>}
              <div className="flex gap-2 ml-auto">
                {currentStepIndex > 0 && (
                  <button onClick={handlePrevious} className="flex items-center gap-1 px-3 py-2 border border-[#668273] text-[#668273] rounded-lg text-sm font-medium hover:bg-[#668273]/10"><ArrowLeft className="h-4 w-4" />{t.concierge.tour.t_back}</button>
                )}
                <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 text-white bg-[#668273] rounded-lg text-sm font-medium hover:bg-[#5a7268]">
                  {currentStepIndex < tourSteps.length - 1 ? t.concierge.tour.t_understood : t.concierge.tour.t_finish} 
                  {currentStepIndex < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <motion.div animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="fixed bottom-45 left-73 w-40 h-40 z-[102]">
        <img src={conciergeImage} alt="Concierge" className="w-full h-full object-contain" />
      </motion.div>
    </>
  )
}