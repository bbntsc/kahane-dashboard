"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TutorialModal } from "@/components/tutorial-modal"
import { TourGuide, ALL_TOUR_STEPS } from "@/components/tour-guide" 
import { useSettings } from "@/lib/settings-context" 

const TUTORIAL_SEEN_KEY = "kahane-simulation-tutorial-seen"
const TOUR_ACTIVE_KEY = "is_tour_active" 

const getStartingStepIndex = (pathname: string): number => {
    const index = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/") && (pathname === step.path || (step.path !== "/" && pathname.includes(step.path))));
    return index !== -1 ? index : 0; 
}

export function ConciergeController() {
  const [showTutorial, setShowTutorial] = useState(false) 
  const [showGuidedTour, setShowGuidedTour] = useState(false) 
  const [currentTourStep, setCurrentTourStep] = useState(0) 
  const [tourKey, setTourKey] = useState(0) 
  const [isContextualTour, setIsContextualTour] = useState(false); 
  const [conciergeImage, setConciergeImage] = useState("/images/2.svg"); 
  
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const tutorialSeen = sessionStorage.getItem(TUTORIAL_SEEN_KEY)
        const isSimulationPage = pathname === "/simulation" || pathname === "/"; 
        
        if (!tutorialSeen && isSimulationPage) {
            localStorage.removeItem(TOUR_ACTIVE_KEY); 
            setTimeout(() => setShowTutorial(true), 500); 
            return; 
        }
        
        const tourActiveStorage = localStorage.getItem(TOUR_ACTIVE_KEY);
        if (tourActiveStorage === "true") { 
            const startingIndex = getStartingStepIndex(pathname);
            setCurrentTourStep(startingIndex);
            setIsContextualTour(false); 
            setConciergeImage("/images/2.svg"); 
            setShowGuidedTour(true); 
        }
    }
  }, [pathname]) 

  useEffect(() => {
    const handleStartIntro = () => {
        setShowGuidedTour(false);
        localStorage.removeItem("activeTourStep"); 
        localStorage.removeItem(TOUR_ACTIVE_KEY);
        
        setTourKey(prev => prev + 1);
        setCurrentTourStep(0);
        setIsContextualTour(false);
        setConciergeImage("/images/2.svg"); 
        
        setTimeout(() => {
            setShowTutorial(true);
        }, 50);
    }

    const handleBellClick = () => {
        const startingIndex = getStartingStepIndex(pathname);
        setShowTutorial(false);
        setTourKey(prev => prev + 1);
        handleStartGuidedTour(startingIndex, true, "/images/1.svg"); 
    }

    window.addEventListener('startConciergeIntro', handleStartIntro);
    window.addEventListener('bellClick', handleBellClick);
    
    return () => {
        window.removeEventListener('startConciergeIntro', handleStartIntro);
        window.removeEventListener('bellClick', handleBellClick);
    }
  }, [pathname])

  const handleStartGuidedTour = (initialIndex: number = 0, contextual: boolean = false, imagePath: string = "/images/2.svg") => { 
    setShowTutorial(false);
    setCurrentTourStep(initialIndex); 
    setIsContextualTour(contextual); 
    setConciergeImage(imagePath); 
    setShowGuidedTour(true);
    
    if (!contextual && typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
        localStorage.setItem(TOUR_ACTIVE_KEY, "true"); 
    }
  }
  
  const handleTourComplete = () => {
    setShowGuidedTour(false)
    setIsContextualTour(false); 
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOUR_ACTIVE_KEY); 
        localStorage.removeItem("activeTourStep"); 
    }
  }

  return (
    <>
      {showTutorial && (
          <TutorialModal 
            onClose={() => setShowTutorial(false)} 
            onStartTour={() => handleStartGuidedTour(0, false, "/images/2.svg")} 
          />
      )}
      
      <TourGuide 
        key={tourKey}
        isActive={showGuidedTour} 
        onComplete={handleTourComplete} 
        initialStep={currentTourStep} 
        isContextual={isContextualTour} 
        conciergeImage={conciergeImage} 
      />
    </>
  )
}