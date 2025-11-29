"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { TutorialModal } from "@/components/tutorial-modal"
import { TourGuide, ALL_TOUR_STEPS } from "@/components/tour-guide" // Importiere ALL_TOUR_STEPS und die Komponente
import { useSettings } from "@/lib/settings-context" 
// import { ConciergeHelpModal } from "@/components/concierge-help-modal" // Wird nicht mehr benötigt


const TUTORIAL_SEEN_KEY = "kahane-simulation-tutorial-seen"
const TOUR_ACTIVE_KEY = "is_tour_active" // Schlüssel für die persistente Tour-Aktivität

/**
 * Findet den Startindex in der ALL_TOUR_STEPS Liste basierend auf dem aktuellen Pfad.
 * Wird für den kontextsensitiven Start verwendet.
 */
const getStartingStepIndex = (pathname: string): number => {
    // Finde den ersten Schritt in ALL_TOUR_STEPS, dessen Pfad mit dem aktuellen pathname übereinstimmt.
    const index = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/") && (pathname === step.path || (step.path !== "/" && pathname.includes(step.path))));

    // Wenn kein spezifischer Schritt gefunden wird, starte bei 0 (Overview)
    return index !== -1 ? index : 0; 
}


// NEU: Diese Komponente steuert die gesamte Concierge-Logik im Hintergrund
export function ConciergeController() {
  const [showTutorial, setShowTutorial] = useState(false) 
  const [showGuidedTour, setShowGuidedTour] = useState(false) 
  const [currentTourStep, setCurrentTourStep] = useState(0) 
  const [isContextualTour, setIsContextualTour] = useState(false); // NEU: Zustand für den kontextuellen Modus
  
  const { language } = useSettings()
  const pathname = usePathname();

  // --- INIT: Modal nur beim ersten Besuch zeigen & Tour-Status wiederherstellen ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // 1. Tutorial anzeigen (nur auf /simulation und wenn nie gesehen)
        const tutorialSeen = sessionStorage.getItem(TUTORIAL_SEEN_KEY)
        if (!tutorialSeen && pathname === "/simulation") {
            setTimeout(() => setShowTutorial(true), 500); 
        }
        
        // 2. TOUR WIEDERHERSTELLUNG (nach Navigation oder F5)
        const tourActiveStorage = localStorage.getItem(TOUR_ACTIVE_KEY);
        if (tourActiveStorage === "true") {
            // Wenn Tour aktiv, setze den Startschritt basierend auf dem aktuellen Pfad
            const startingIndex = getStartingStepIndex(pathname);
            setCurrentTourStep(startingIndex);
            setIsContextualTour(false); // Angenommen, eine gespeicherte Tour ist die volle Tour
            if (!showTutorial) { 
               setShowGuidedTour(true);
            }
        }
    }
  }, [pathname]) 

  // --- Event Listener für Sidebar/Header-Klick ---
  useEffect(() => {
    const handleStartIntro = () => {
        // Logo-Klick: Immer bei Schritt 0 starten
        if (showGuidedTour) {
            handleTourComplete(); // Stoppt die aktuelle Tour
        }
        setIsContextualTour(false);
        setCurrentTourStep(0);
        setShowTutorial(true);
    }

    const handleBellClick = () => {
        // Bell-Klick: Springt direkt zum kontextspezifischen Tour-Schritt
        const startingIndex = getStartingStepIndex(pathname);
        
        // Tour starten und alle anderen Modals/Guides schließen
        setShowTutorial(false);
        handleStartGuidedTour(startingIndex, true); // Starte im kontextuellen Modus
    }

    window.addEventListener('startConciergeIntro', handleStartIntro);
    window.addEventListener('bellClick', handleBellClick);
    
    return () => {
        window.removeEventListener('startConciergeIntro', handleStartIntro);
        window.removeEventListener('bellClick', handleBellClick);
    }
  }, [showGuidedTour, pathname])


  // --- Tour-Handler ---
  const handleStartGuidedTour = (initialIndex: number = 0, contextual: boolean = false) => {
    setShowTutorial(false);
    setCurrentTourStep(initialIndex); // Setze den Startindex
    setIsContextualTour(contextual); // Setze den Modus
    setShowGuidedTour(true);
    
    // Nur die volle Tour wird im Local Storage gespeichert
    if (!contextual && typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
        localStorage.setItem(TOUR_ACTIVE_KEY, "true"); 
    }
  }
  
  const handleTourComplete = () => {
    setShowGuidedTour(false)
    setIsContextualTour(false); // Setze Modus zurück
    // Entferne den aktiven Status, wenn die Tour abgeschlossen ist.
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOUR_ACTIVE_KEY); 
        // WICHTIG: Setze den Tour-Schritt-Cache zurück
        localStorage.removeItem("activeTourStep"); 
    }
  }
  
  const handleCloseTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
    }
  }

  // Das ConciergeHelpModal wird nun komplett aus der Logik entfernt.

  return (
    <>
      {/* 1. TUTORIAL MODAL (Intro) */}
      {showTutorial && (
          <TutorialModal 
            onClose={handleCloseTutorial} 
            onStartTour={() => handleStartGuidedTour(0, false)} // Startet immer die volle Tour
          />
      )}
      
      {/* 2. GEFÜHRTE TOUR (Über Seiten hinweg persistent) */}
      <TourGuide 
        isActive={showGuidedTour} 
        onComplete={handleTourComplete} 
        initialStep={currentTourStep} 
        isContextual={isContextualTour} // NEU: Übergibt den Modus
      />
      
      {/* 3. ConciergeHelpModal wird hier nicht mehr gerendert, da die Glocke nun die Tour startet. */}
    </>
  )
}